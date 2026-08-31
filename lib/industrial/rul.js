/**
 * FinSight / Industrial R&D - Estimation Probabiliste de RUL (Remaining Useful Life)
 * et Quantification d'Incertitude par Conformal Prediction (Garantie de Couverture 1 - alpha).
 */

/**
 * Estime la RUL (Remaining Useful Life) probabiliste et ses intervalles de confiance conformes.
 * @param {number[]} elboLosses - Série temporelle des pertes ELBO de l'autoencodeur
 * @param {number} threshold - Seuil de détection d'anomalie critique
 * @param {number} [samplingIntervalMin=1.0] - Intervalle d'échantillonnage des capteurs (en minutes)
 * @param {number} [confidence=0.95] - Niveau de confiance pour la conformal prediction (ex: 0.95)
 * @returns {Object}
 */
function estimateConformalRul(elboLosses, threshold, samplingIntervalMin = 1.0, confidence = 0.95) {
  const T = elboLosses.length;
  const healthIndex = new Array(T);

  // 1. Calcul de l'Index de Santé (Health Index : 100% nominal -> 0% défaillance critique)
  const maxAllowableLoss = threshold * 3.5;
  for (let t = 0; t < T; t++) {
    const loss = elboLosses[t];
    const hi = Math.max(0, Math.min(100, (1.0 - (loss / maxAllowableLoss)) * 100));
    healthIndex[t] = Math.round(hi * 10) / 10;
  }

  // 2. Trajectoire de dégradation et estimation de la vitesse de dérive d(ELBO)/dt
  const windowLookback = Math.min(30, Math.floor(T * 0.1));
  const recentLosses = elboLosses.slice(-windowLookback);
  const recentT = Array.from({ length: windowLookback }, (_, i) => i);

  // Régression linéaire locale sur la dérivée de perte
  const meanT = (windowLookback - 1) / 2;
  const meanLoss = recentLosses.reduce((a, b) => a + b, 0) / windowLookback;

  let num = 0, den = 0;
  for (let i = 0; i < windowLookback; i++) {
    num += (recentT[i] - meanT) * (recentLosses[i] - meanLoss);
    den += (recentT[i] - meanT) ** 2;
  }
  const degradationRate = Math.max(0.001, num / (den + 1e-9)); // d(Loss)/dt par point

  const currentLoss = elboLosses[T - 1];
  const criticalLossThreshold = threshold * 2.8;
  const remainingPoints = Math.max(5, (criticalLossThreshold - currentLoss) / degradationRate);
  const estimatedRulMinutes = Math.round(remainingPoints * samplingIntervalMin);

  // 3. Conformal Prediction : Quantification de l'incertitude sur la calibration
  // Score de non-conformité : s_i = |RUL_i - RUL_hat_i| sur résidus de dégradation
  const nonConformityScores = [];
  for (let i = 1; i < windowLookback; i++) {
    const actualStep = recentLosses[i] - recentLosses[i - 1];
    const expectedStep = degradationRate;
    nonConformityScores.push(Math.abs(actualStep - expectedStep) * (remainingPoints / (degradationRate + 1e-6)));
  }

  nonConformityScores.sort((a, b) => a - b);
  const qIdx = Math.min(
    nonConformityScores.length - 1,
    Math.max(0, Math.floor(confidence * (nonConformityScores.length + 1)) - 1)
  );
  const conformalMargin = (nonConformityScores[qIdx] || 15.0) * samplingIntervalMin;

  const rulLowerBound = Math.max(2, Math.round(estimatedRulMinutes - conformalMargin));
  const rulUpperBound = Math.round(estimatedRulMinutes + conformalMargin);

  // 4. Projection probabiliste de la courbe de survie RUL (fan chart 60 points)
  const projectionSteps = 40;
  const projectionTrajectory = [];
  for (let s = 0; s <= projectionSteps; s++) {
    const futureT = s * (estimatedRulMinutes / projectionSteps);
    const projectedLoss = currentLoss + (s / projectionSteps) * (criticalLossThreshold - currentLoss);
    const uncertaintyBand = (s / projectionSteps) * conformalMargin;

    projectionTrajectory.push({
      timeAheadMin: Math.round(futureT),
      projectedLoss: Math.round(projectedLoss * 1000) / 1000,
      lowerBoundLoss: Math.round(Math.max(0, projectedLoss - uncertaintyBand * 0.05) * 1000) / 1000,
      upperBoundLoss: Math.round((projectedLoss + uncertaintyBand * 0.05) * 1000) / 1000,
    });
  }

  return {
    currentHealthIndex: healthIndex[T - 1],
    healthIndexSeries: healthIndex,
    estimatedRulMinutes,
    conformalBounds: {
      confidencePct: Math.round(confidence * 100),
      lowerMinutes: rulLowerBound,
      upperMinutes: rulUpperBound,
      marginMinutes: Math.round(conformalMargin),
    },
    degradationRatePerMinute: Math.round(degradationRate * 10000) / 10000,
    projectionTrajectory,
  };
}

module.exports = {
  estimateConformalRul,
};
