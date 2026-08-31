/**
 * FinSight / Industrial R&D - Générateur de Télémétrie Industrielle Réaliste & Parseur CSV
 * Scénarios d'équipements industriels types (Pompe centrifuge, Moteur asynchrone, Compresseur)
 * avec injection de défauts physiques réels (dérive vibratoire, choc thermique, cavitation).
 */

const EQUIPMENT_SCENARIOS = {
  pump: {
    id: 'pump',
    name: 'Pompe Centrifuge P-042 (Dégradation Palier & Cavitation)',
    sensorNames: ['Vibration RMS (mm/s)', 'Température (°C)', 'Pression Refoulement (bar)', 'Débit (m³/h)'],
    baseValues: [1.2, 45.0, 3.2, 120.0],
  },
  motor: {
    id: 'motor',
    name: 'Moteur Asynchrone M-99 (Surchauffe & Dérive Statorique)',
    sensorNames: ['Vibration Axiale (mm/s)', 'Température Enroulement (°C)', 'Pression Huile (bar)', 'Courant Statorique (A)'],
    baseValues: [0.8, 62.0, 4.5, 85.0],
  },
  compressor: {
    id: 'compressor',
    name: 'Compresseur C-12 (Fuite Soupape & Perte de Charge)',
    sensorNames: ['Vibration Carter (mm/s)', 'Température Étage 2 (°C)', 'Pression Étage 2 (bar)', 'Débit Aspiration (Nm³/h)'],
    baseValues: [1.5, 78.0, 6.8, 250.0],
  },
};

/**
 * Génère une série temporelle réaliste multi-capteurs avec des anomalies injectées.
 * @param {string} [scenarioId='pump']
 * @param {number} [nSteps=1200]
 * @param {number} [seed=42]
 * @returns {Object}
 */
function generateSensorData(scenarioId = 'pump', nSteps = 1200, seed = 42) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const scenario = EQUIPMENT_SCENARIOS[scenarioId] || EQUIPMENT_SCENARIOS.pump;
  const sensorMatrix = [];
  const groundTruth = new Array(nSteps).fill(0);
  const timestamps = [];

  const baseDate = new Date('2026-03-01T08:00:00Z');

  for (let i = 0; i < nSteps; i++) {
    const curDate = new Date(baseDate.getTime() + i * 60000); // 1 minute par pas
    timestamps.push(curDate.toISOString().replace('T', ' ').slice(0, 19));

    const tNorm = (i / nSteps) * 100;
    // Signaux nominaux harmoniques + bruit blanc
    let s0 = scenario.baseValues[0] + 0.3 * Math.sin(0.18 * tNorm) + 0.08 * (rand() - 0.5) * 2;
    let s1 = scenario.baseValues[1] + 0.04 * tNorm + 0.25 * (rand() - 0.5) * 2;
    let s2 = scenario.baseValues[2] + 0.08 * Math.cos(0.12 * tNorm) + 0.04 * (rand() - 0.5) * 2;
    let s3 = scenario.baseValues[3] - 0.02 * tNorm + 0.60 * (rand() - 0.5) * 2;

    // 1. Anomalie 1 (t = 300 à 400) : Dérive vibratoire accélérée + échauffement
    if (i >= 300 && i < 400) {
      const progress = (i - 300) / 100;
      s0 += 0.8 + progress * 2.1 + (rand() - 0.5) * 0.5;
      s1 += progress * 19.5;
      groundTruth[i] = 1;
    }

    // 2. Anomalie 2 (t = 700 à 760) : Chute brutale de pression + cavitation
    if (i >= 700 && i < 760) {
      const progress = (i - 700) / 60;
      s2 -= 0.6 + progress * 1.4;
      s0 += 1.4 * (rand() - 0.5) * 2;
      groundTruth[i] = 1;
    }

    // 3. Anomalie 3 (t = 1000 à 1090) : Colmatage et effondrement de débit
    if (i >= 1000 && i < 1090) {
      const progress = (i - 1000) / 90;
      s3 -= 8.0 + progress * 38.0;
      s1 += progress * 14.0;
      groundTruth[i] = 1;
    }

    sensorMatrix.push([
      Math.round(s0 * 1000) / 1000,
      Math.round(s1 * 1000) / 1000,
      Math.round(s2 * 1000) / 1000,
      Math.round(s3 * 1000) / 1000,
    ]);
  }

  return {
    scenario,
    sensorNames: scenario.sensorNames,
    timestamps,
    sensorMatrix,
    groundTruth,
  };
}

/**
 * Détermine si une chaîne de caractères est une date/timestamp plausible.
 * @param {string} s
 * @returns {boolean}
 */
function _isPlausibleTimestamp(s) {
  if (!s || typeof s !== 'string') return false;
  const trimmed = s.trim();
  if (!trimmed) return false;
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(trimmed)) return true;
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(trimmed)) return true;
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(trimmed)) return true;
  if (/^\d{9,13}$/.test(trimmed)) return true;
  if (/^T_\d+/.test(trimmed)) return true;
  const d = new Date(trimmed);
  return !isNaN(d.getTime());
}

/**
 * Détecte si une chaîne représente une valeur monétaire et la parse.
 * @param {string} s
 * @returns {number|null}
 */
function _parseLooseNumeric(s) {
  if (s == null) return null;
  const raw = String(s).trim();
  if (!raw) return null;
  let n = parseFloat(raw);
  if (!isNaN(n)) return n;
  const cleaned = raw.replace(/[^\d.,\-]/g, '').replace(/,(?=\d{3}(\D|$))/g, '').replace(/,(?=\d{1,2}$)/, '.');
  n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

/**
 * Parse un fichier CSV importé de capteurs industriels — VALIDATION STRICTE.
 * Rejette les CSV non conformes (colonnes catégorielles, textes, IDs/CVV/Postaux) avec une erreur descriptive.
 * @param {string} csvText
 * @returns {Object}
 */
function parseIndustrialCsv(csvText) {
  const lines = String(csvText || '')
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);

  if (lines.length < 31) {
    throw new Error(
      'CSV capteurs invalide : au moins 31 lignes requises (header + 30 points temporels minimum) pour la détection d’anomalies.'
    );
  }

  const header = lines[0]
    .split(/[,;\t]/)
    .map((h) => h.trim().replace(/['"]/g, ''))
    .filter(Boolean);

  if (header.length < 2) {
    throw new Error('CSV capteurs invalide : au moins 2 colonnes attendues (Timestamp + 1 signal capteur).');
  }

  // --- 1. Identifier colonne temps/date ---
  let dateColIdx = header.findIndex((h) => /date|timestamp|time|jour|minute|heure|hour|dt/i.test(h));
  if (dateColIdx === -1) {
    // Fallback heuristique : première colonne majoritairement date-like
    for (let c = 0; c < header.length; c++) {
      let hits = 0;
      const sampleCount = Math.min(20, lines.length - 1);
      for (let i = 1; i <= sampleCount; i++) {
        const parts = lines[i].split(/[,;\t]/).map((p) => p.trim());
        if (_isPlausibleTimestamp(parts[c])) hits++;
      }
      if (hits / sampleCount >= 0.7) {
        dateColIdx = c;
        break;
      }
    }
  }
  if (dateColIdx === -1) dateColIdx = 0; // colonne 0 par défaut (interprétée comme index T_i)

  // --- 2. Identifier colonnes capteurs numériques ---
  const sensorCols = [];
  const sensorNames = [];
  const totalRows = lines.length - 1;

  for (let c = 0; c < header.length; c++) {
    if (c === dateColIdx) continue;

    let numericCount = 0;
    let nonEmpty = 0;
    const sample = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/[,;\t]/).map((p) => p.trim());
      if (c >= parts.length) continue;
      const raw = parts[c];
      if (!raw) continue;
      nonEmpty++;
      const v = _parseLooseNumeric(raw);
      if (v != null) {
        numericCount++;
        if (sample.length < 200) sample.push(v);
      }
    }

    const ratioValid = totalRows > 0 ? numericCount / totalRows : 0;
    if (ratioValid >= 0.85 && sample.length >= 10) {
      const uniq = new Set(sample.map((x) => Math.round(x * 1000) / 1000));
      if (uniq.size >= 5) {
        sensorCols.push(c);
        sensorNames.push(header[c] || `Capteur_${c}`);
      }
    }
  }

  if (sensorCols.length === 0) {
    throw new Error(
      'Aucun signal capteur numérique valide détecté. Vérifiez que vos colonnes contiennent des mesures numériques (ex: vibration, température, pression), pas des catégories ou des identifiants.'
    );
  }

  // --- 3. Parser les lignes ---
  const timestamps = [];
  const sensorMatrix = [];
  const N = sensorCols.length;

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/[,;\t]/).map((p) => p.trim());
    if (parts.length < header.length) continue;

    const tsRaw = parts[dateColIdx];
    timestamps.push(_isPlausibleTimestamp(tsRaw) ? tsRaw : `T_${i}`);

    const row = new Array(N);
    for (let j = 0; j < N; j++) {
      const raw = parts[sensorCols[j]];
      const v = _parseLooseNumeric(raw);
      if (v != null) row[j] = v;
      else {
        // fallback: dernière valeur valide ou zéro
        const lastValid = sensorMatrix.length > 0 ? sensorMatrix[sensorMatrix.length - 1][j] : 0;
        row[j] = lastValid || 0;
      }
    }
    sensorMatrix.push(row);
  }

  const T = sensorMatrix.length;
  if (T < 30) {
    throw new Error(`Trop peu de lignes valides après nettoyage (${T} points, min 30).`);
  }

  // --- 4. Validation de variation minimale par capteur ---
  for (let j = 0; j < N; j++) {
    const col = sensorMatrix.map((r) => r[j]);
    const mn = Math.min(...col);
    const mx = Math.max(...col);
    const range = mx - mn;
    if (Math.abs(range) / (Math.abs(mn) + 1e-9) < 0.005) {
      throw new Error(
        `Capteur « ${sensorNames[j]} » quasi constant (range ${(range).toFixed(4)} — variance nulle). Ce fichier ne ressemble pas à de la télémétrie industrielle dynamique.`
      );
    }
  }

  return {
    scenario: { id: 'custom_csv', name: `Données télémétriques personnalisées (${N} capteurs · ${T} points)` },
    sensorNames,
    timestamps,
    sensorMatrix,
    groundTruth: null,
  };
}

module.exports = {
  EQUIPMENT_SCENARIOS,
  generateSensorData,
  parseIndustrialCsv,
};
