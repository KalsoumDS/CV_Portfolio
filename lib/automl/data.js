/**
 * ChatAutoML R&D - Parseur CSV Strict pour Datasets Utilisateurs
 * Validation stricte : colonnes numériques, variation minimale, rejet des données non conformes
 */

/**
 * Détermine si une chaîne représente une valeur numérique et la parse.
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
 * Parse un contenu CSV brut pour extraire features et target.
 * Format attendu : colonnes numériques, dernière colonne = target (optionnel).
 * Validation stricte : colonnes numériques majoritaires, variation non nulle.
 * @param {string} csvText
 * @returns {Object} { X: number[][], y: number[], featureNames: string[], task: 'classification'|'regression' }
 */
function parseCsvDataset(csvText) {
  const lines = String(csvText || '')
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);

  if (lines.length < 11) {
    throw new Error(
      'CSV dataset invalide : au moins 11 lignes requises (header + 10 échantillons minimum) pour l\'entraînement kNN.'
    );
  }

  const header = lines[0]
    .split(/[,;\t]/)
    .map((h) => h.trim().replace(/['"]/g, ''))
    .filter(Boolean);

  if (header.length < 2) {
    throw new Error('CSV dataset invalide : au moins 2 colonnes attendues (features + target optionnel).');
  }

  // --- 1. Identifier colonnes numériques ---
  const numericCols = [];
  const colNames = [];
  const totalRows = lines.length - 1;

  for (let c = 0; c < header.length; c++) {
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
    if (ratioValid >= 0.85 && sample.length >= 5) {
      const uniq = new Set(sample.map((x) => Math.round(x * 1000) / 1000));
      if (uniq.size >= 3) {
        numericCols.push(c);
        colNames.push(header[c] || `Feature_${c}`);
      }
    }
  }

  if (numericCols.length === 0) {
    throw new Error(
      'Aucune colonne numérique valide détectée. Vérifiez que vos colonnes contiennent des données numériques (features), pas des catégories ou identifiants.'
    );
  }

  // --- 2. Déterminer la colonne target (dernière colonne numérique par défaut) ---
  const targetColIdx = numericCols[numericCols.length - 1];
  const featureColIndices = numericCols.slice(0, -1);

  if (featureColIndices.length === 0) {
    throw new Error(
      'Au moins une colonne feature requise (en plus de la target). Le dataset doit contenir des colonnes de caractéristiques.'
    );
  }

  // --- 3. Parser les lignes ---
  const X = [];
  const y = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/[,;\t]/).map((p) => p.trim());
    if (parts.length < header.length) continue;

    const rowFeatures = [];
    let validRow = true;

    for (const c of featureColIndices) {
      const raw = parts[c];
      const v = _parseLooseNumeric(raw);
      if (v != null) {
        rowFeatures.push(v);
      } else {
        validRow = false;
        break;
      }
    }

    if (!validRow) continue;

    const targetRaw = parts[targetColIdx];
    const targetVal = _parseLooseNumeric(targetRaw);
    if (targetVal != null) {
      X.push(rowFeatures);
      y.push(targetVal);
    }
  }

  const nSamples = X.length;
  if (nSamples < 10) {
    throw new Error(
      `Trop peu d'échantillons valides après nettoyage (${nSamples}, minimum 10). Vérifiez vos données.`
    );
  }

  // --- 4. Validation de variation minimale ---
  for (let j = 0; j < X[0].length; j++) {
    const col = X.map((r) => r[j]);
    const mn = Math.min(...col);
    const mx = Math.max(...col);
    const range = mx - mn;
    if (Math.abs(range) / (Math.abs(mn) + 1e-9) < 0.01) {
      throw new Error(
        `Feature « ${colNames[j]} » quasi constant (range ${range.toFixed(4)}). Cette colonne n\'apporte pas d\'information discriminante.`
      );
    }
  }

  // --- 5. Détecter le type de tâche (classification vs régression) ---
  const uniqueTargets = new Set(y.map((v) => Math.round(v * 1000) / 1000));
  const isClassification = uniqueTargets.size <= 10 && uniqueTargets.size < nSamples * 0.5;

  return {
    X,
    y,
    featureNames: colNames.slice(0, -1),
    targetName: colNames[colNames.length - 1],
    task: isClassification ? 'classification' : 'regression',
    nSamples,
    nFeatures: X[0].length,
  };
}

module.exports = {
  parseCsvDataset,
};
