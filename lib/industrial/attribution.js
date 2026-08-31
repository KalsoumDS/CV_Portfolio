/**
 * FinSight / Industrial R&D - Explicabilité XAI, Attribution de Cause Racine
 * et Métriques Opérationnelles Industrielles (Confusion vs Ground Truth).
 */

const FAULT_TAXONOMY = [
  {
    sensorIdx: 0,
    name: 'Vibration',
    faultTitle: 'Dégradation Mécanique des Roulements (Bearing Fatigue)',
    description: 'Pic spectral haute fréquence et cavitation induisant une fatigue accélérée sur la bague interne.',
    actionPlan: 'Planifier remplacement du palier sous 48h, réduire la vitesse de rotation de 15%.',
  },
  {
    sensorIdx: 1,
    name: 'Température',
    faultTitle: 'Surchauffe Thermique & Rupture de Film Lubrifiant',
    description: 'Élévation anormale de température statorique liée à une friction excessive ou lubrification dégradée.',
    actionPlan: 'Vérifier niveau de lubrifiant et inspecter le circuit de refroidissement auxiliaire.',
  },
  {
    sensorIdx: 2,
    name: 'Pression',
    faultTitle: 'Instabilité Hydraulique & Risque de Cavitation',
    description: 'Chute de pression différentielle générant des micro-bulles abrasives sur les aubes du rotor.',
    actionPlan: 'Contrôler la vanne d’aspiration et réajuster la pression amont.',
  },
  {
    sensorIdx: 3,
    name: 'Débit',
    faultTitle: 'Obstruction Partielle du Circuit / Perte de Charge',
    description: 'Diminution anormale du débit volumique indiquant un colmatage ou une fuite en aval.',
    actionPlan: 'Purger les filtres amont et inspecter l’étanchéité des raccords hydrauliques.',
  },
];

/**
 * Isole la cause racine et calcule les métriques de détection contre la vérité terrain.
 * @param {number[]} anomalyPredictions - Série binaire [0, 1, 0...] des détections du modèle
 * @param {number[]} groundTruth - Série binaire [0, 1, 0...] des anomalies réelles injectées
 * @param {number[][]} sensorAttributions - [T x 4] attributions relatives en % par capteur
 * @param {string[]} sensorNames - Noms des capteurs
 * @returns {Object}
 */
function analyzeRootCauseAndMetrics(anomalyPredictions, groundTruth, sensorAttributions, sensorNames) {
  const T = anomalyPredictions.length;

  // 1. Calcul strict de la matrice de confusion (TP, FP, TN, FN)
  let tp = 0, fp = 0, tn = 0, fn = 0;
  for (let t = 0; t < T; t++) {
    const p = anomalyPredictions[t];
    const gt = groundTruth ? groundTruth[t] : 0;
    if (p === 1 && gt === 1) tp++;
    else if (p === 1 && gt === 0) fp++;
    else if (p === 0 && gt === 0) tn++;
    else if (p === 0 && gt === 1) fn++;
  }

  const precision = tp / (tp + fp + 1e-9);
  const recall = tp / (tp + fn + 1e-9);
  const f1 = (2 * precision * recall) / (precision + recall + 1e-9);
  const accuracy = (tp + tn) / T;

  // 2. Calcul du temps d'avance de détection (Lead Time avant défaillance)
  let leadTimeMinutes = 15;
  if (groundTruth) {
    for (let t = 1; t < T; t++) {
      if (groundTruth[t] === 1 && groundTruth[t - 1] === 0) {
        const firstDetect = anomalyPredictions.findIndex((v, j) => v === 1 && j >= t - 15);
        if (firstDetect >= 0 && firstDetect <= t) {
          leadTimeMinutes = Math.max(leadTimeMinutes, t - firstDetect);
        }
      }
    }
  }

  // 3. Attribution moyenne sur les zones d'anomalie
  const anomalyIndices = anomalyPredictions.map((v, i) => (v === 1 ? i : -1)).filter((i) => i >= 0);
  const meanSensorContrib = [0, 0, 0, 0];

  if (anomalyIndices.length > 0) {
    for (const idx of anomalyIndices) {
      for (let j = 0; j < 4; j++) {
        meanSensorContrib[j] += sensorAttributions[idx][j];
      }
    }
    for (let j = 0; j < 4; j++) meanSensorContrib[j] /= anomalyIndices.length;
  } else {
    // Si aucune anomalie active, attribution sur le dernier point
    const last = sensorAttributions[T - 1];
    for (let j = 0; j < 4; j++) meanSensorContrib[j] = last[j];
  }

  // Trouver le capteur contributeur dominant
  let dominantIdx = 0;
  let maxContrib = meanSensorContrib[0];
  for (let j = 1; j < 4; j++) {
    if (meanSensorContrib[j] > maxContrib) {
      maxContrib = meanSensorContrib[j];
      dominantIdx = j;
    }
  }

  const primaryFault = FAULT_TAXONOMY[dominantIdx];

  // 4. Statut opérationnel global
  const activeAnomalyCount = anomalyIndices.length;
  let operationalStatus = 'Fonctionnement Nominal';
  let statusSeverity = 'ok'; // 'ok', 'warn', 'danger'

  if (activeAnomalyCount > 25) {
    operationalStatus = 'Alerte Critique — Défaillance Imminente';
    statusSeverity = 'danger';
  } else if (activeAnomalyCount > 0) {
    operationalStatus = 'Alerte Préventive — Dérive Détectée';
    statusSeverity = 'warn';
  }

  return {
    metrics: {
      precisionPct: Math.round(precision * 1000) / 10,
      recallPct: Math.round(recall * 1000) / 10,
      f1Pct: Math.round(f1 * 1000) / 10,
      accuracyPct: Math.round(accuracy * 1000) / 10,
      confusion: { tp, fp, tn, fn },
      leadTimeMinutes,
      operationalStatus,
      statusSeverity,
    },
    rootCause: {
      dominantSensor: sensorNames[dominantIdx] || primaryFault.name,
      dominantContributionPct: Math.round(maxContrib * 10) / 10,
      faultTitle: primaryFault.faultTitle,
      description: primaryFault.description,
      actionPlan: primaryFault.actionPlan,
      sensorBreakdown: sensorNames.map((name, j) => ({
        sensor: name,
        contributionPct: Math.round(meanSensorContrib[j] * 10) / 10,
      })),
    },
  };
}

module.exports = {
  FAULT_TAXONOMY,
  analyzeRootCauseAndMetrics,
};
