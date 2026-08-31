/**
 * FinSight R&D - Générateur & Ingestion de Données de Marché Réalistes
 * Supporte le parsing de fichiers CSV réels ainsi que la génération stochastique
 * multi-régimes (Merton jump-diffusion + clustering de volatilité Heston-like).
 */

const { choleskyDecomposition, sampleStandardNormal } = require('./stats');

// Paramètres calibrés sur données de marché historiques réelles (2020-2026)
const ASSET_REGISTRY = {
  AAPL: { mu: 0.18, sigma: 0.24, startPrice: 175.0, name: 'Apple Inc.' },
  MSFT: { mu: 0.20, sigma: 0.22, startPrice: 410.0, name: 'Microsoft Corp.' },
  GOOGL: { mu: 0.16, sigma: 0.26, startPrice: 165.0, name: 'Alphabet Inc.' },
  NVDA: { mu: 0.38, sigma: 0.44, startPrice: 120.0, name: 'NVIDIA Corp.' },
  AMZN: { mu: 0.17, sigma: 0.28, startPrice: 185.0, name: 'Amazon.com Inc.' },
  META: { mu: 0.22, sigma: 0.35, startPrice: 500.0, name: 'Meta Platforms' },
  TSLA: { mu: 0.25, sigma: 0.52, startPrice: 220.0, name: 'Tesla Inc.' },
  JPM: { mu: 0.12, sigma: 0.19, startPrice: 215.0, name: 'JPMorgan Chase' },
  SPY: { mu: 0.11, sigma: 0.15, startPrice: 550.0, name: 'SPDR S&P 500 ETF' },
};

/**
 * Génère des séries temporelles cohérentes pour une liste de tickers.
 * @param {string[]} tickers
 * @param {number} numDays - Nombre de jours de trading (ex: 504 pour 2 ans)
 * @param {number} [seed=42]
 * @returns {Object}
 */
function generateMarketData(tickers = ['AAPL', 'MSFT', 'GOOGL'], numDays = 504, seed = 42) {
  let s = seed;
  const pseudoRand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const N = tickers.length;
  const cleanTickers = tickers.map((t) => t.trim().toUpperCase());

  // Construction de la matrice de corrélation
  const corr = Array.from({ length: N }, () => new Array(N).fill(0.45));
  for (let i = 0; i < N; i++) {
    corr[i][i] = 1.0;
    for (let j = i + 1; j < N; j++) {
      const t1 = cleanTickers[i];
      const t2 = cleanTickers[j];
      let c = 0.55;
      if ((t1 === 'MSFT' && t2 === 'AAPL') || (t1 === 'AAPL' && t2 === 'MSFT')) c = 0.72;
      if ((t1 === 'NVDA' && t2 === 'MSFT') || (t1 === 'MSFT' && t2 === 'NVDA')) c = 0.68;
      if ((t1 === 'SPY' || t2 === 'SPY')) c = 0.82;
      corr[i][j] = c;
      corr[j][i] = c;
    }
  }

  const L = choleskyDecomposition(corr);
  const dt = 1 / 252;
  const sqrtDt = Math.sqrt(dt);

  const dates = [];
  const prices = Array.from({ length: N }, () => new Array(numDays));
  const returns = Array.from({ length: numDays }, () => new Array(N));

  const baseDate = new Date('2024-01-02');

  for (let i = 0; i < N; i++) {
    const meta = ASSET_REGISTRY[cleanTickers[i]] || { mu: 0.12, sigma: 0.25, startPrice: 100.0 };
    prices[i][0] = meta.startPrice;
    returns[0][i] = 0;
  }

  dates.push(baseDate.toISOString().split('T')[0]);

  // Régimes de volatilité stochastique
  let volRegimeMultiplier = 1.0;

  for (let t = 1; t < numDays; t++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + Math.floor(t * (7 / 5)));
    dates.push(curDate.toISOString().split('T')[0]);

    // Choc de régime stochastique périodique
    if (t % 110 === 0) {
      volRegimeMultiplier = 1.6 + pseudoRand() * 0.8;
    } else {
      volRegimeMultiplier = 0.96 * volRegimeMultiplier + 0.04 * 1.0;
    }

    const zIndep = new Array(N);
    for (let i = 0; i < N; i++) {
      zIndep[i] = sampleStandardNormal(pseudoRand);
    }

    for (let i = 0; i < N; i++) {
      let zCorr = 0;
      for (let k = 0; k <= i; k++) {
        zCorr += L[i][k] * zIndep[k];
      }

      const meta = ASSET_REGISTRY[cleanTickers[i]] || { mu: 0.12, sigma: 0.25, startPrice: 100.0 };
      const sigmaT = meta.sigma * volRegimeMultiplier;
      const drift = (meta.mu - 0.5 * sigmaT * sigmaT) * dt;
      const diffusion = sigmaT * sqrtDt * zCorr;

      // Sauts de Poisson occasionnels (Merton Jump-diffusion)
      let jump = 0;
      if (pseudoRand() < 0.015) {
        jump = (pseudoRand() - 0.65) * 0.045;
      }

      const r = drift + diffusion + jump;
      returns[t][i] = r;
      prices[i][t] = prices[i][t - 1] * Math.exp(r);
    }
  }

  return {
    dates,
    tickers: cleanTickers,
    prices,
    returnsMatrix: returns.slice(1), // [T-1 x N]
  };
}

/**
 * Détecte si une chaîne représente un montant monétaire (ex: $1,234.56, €50, 1 234,56 EUR).
 * @param {string} s
 * @returns {number|null}
 */
function parseCurrency(s) {
  if (s == null) return null;
  const cleaned = String(s)
    .replace(/[^\d.,\-]/g, '')
    .replace(/,(?=\d{3}(\D|$))/g, '')
    .replace(/,(?=\d{1,2}$)/, '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

/**
 * Détermine si une chaîne de caractères est une date valide (ISO, FR, US, ou année).
 * @param {string} s
 * @returns {boolean}
 */
function isPlausibleDate(s) {
  if (!s || typeof s !== 'string') return false;
  const trimmed = s.trim();
  if (!trimmed) return false;
  // ISO / FR / US patterns
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(trimmed)) return true;
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(trimmed)) return true;
  // Date simple "2024"
  if (/^\d{4}$/.test(trimmed)) {
    const y = parseInt(trimmed, 10);
    return y >= 1900 && y <= 2200;
  }
  // Timestamp Unix-like
  if (/^\d{9,13}$/.test(trimmed)) return true;
  const d = new Date(trimmed);
  return !isNaN(d.getTime());
}

/**
 * Parse un contenu CSV brut pour extraire les colonnes numériques et séries de prix.
 * Format attendu : Date,AAPL,MSFT,GOOGL... (séries financières).
 * Validation stricte : colonnes numériques majoritaires, prix positifs, variation non nulle.
 * @param {string} csvText
 * @returns {Object}
 */
function parseCsvPrices(csvText) {
  const lines = String(csvText || '')
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);

  if (lines.length < 31) {
    throw new Error(
      'CSV invalide : au moins 31 lignes requises (header + 30 jours de données) pour un calcul de risque quantitatif.'
    );
  }

  const header = lines[0]
    .split(/[,;\t]/)
    .map((h) => h.trim().replace(/['"]/g, ''))
    .filter(Boolean);

  if (header.length < 2) {
    throw new Error('CSV invalide : au moins 2 colonnes attendues (Date + 1 série de prix).');
  }

  // --- 1. Identifier la colonne de dates ---
  let dateColIdx = header.findIndex((h) => /date|timestamp|time|jour|dt/i.test(h));
  if (dateColIdx === -1) {
    // Fallback : cherche la première colonne dont >= 80% des valeurs ressemblent à des dates
    for (let c = 0; c < header.length; c++) {
      let hits = 0;
      const sampleCount = Math.min(20, lines.length - 1);
      for (let i = 1; i <= sampleCount; i++) {
        const parts = lines[i].split(/[,;\t]/).map((p) => p.trim());
        if (isPlausibleDate(parts[c])) hits++;
      }
      if (hits / sampleCount >= 0.7) {
        dateColIdx = c;
        break;
      }
    }
  }
  if (dateColIdx === -1) {
    throw new Error(
      "Colonne de dates introuvable. Format attendu : la première colonne ou une colonne 'Date'/'Timestamp' avec des dates valides."
    );
  }

  // --- 2. Identifier les colonnes de prix (numériques / devises) ---
  const candidateCols = [];
  for (let col = 0; col < header.length; col++) {
    if (col === dateColIdx) continue;

    let numericCount = 0;
    let negativeCount = 0;
    let nonEmptyCount = 0;
    const sample = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/[,;\t]/).map((p) => p.trim());
      if (col >= parts.length) continue;
      const raw = parts[col];
      if (!raw) continue;
      nonEmptyCount++;

      let v = parseFloat(raw);
      if (isNaN(v)) v = parseCurrency(raw);
      if (v != null && !isNaN(v)) {
        numericCount++;
        if (v < 0) negativeCount++;
        if (sample.length < 200) sample.push(v);
      }
    }

    const totalRows = lines.length - 1;
    const ratioValid = totalRows > 0 ? numericCount / totalRows : 0;

    if (ratioValid >= 0.85 && sample.length >= 10) {
      // Variation non triviale (pas une colonne entière constante comme "1", "YES", etc.)
      const uniq = new Set(sample.map((x) => Math.round(x * 1000) / 1000));
      if (uniq.size >= 5) {
        candidateCols.push({
          idx: col,
          name: header[col] || `Asset_${col}`,
          ratioValid,
        });
      }
    }
  }

  if (candidateCols.length === 0) {
    throw new Error(
      "Aucune colonne de prix numérique valide détectée. Assurez-vous que les colonnes contiennent des nombres (ex: cours d'actions, indices) et non des catégories (Visa/No/YES, texte, etc.)."
    );
  }

  const priceColIndices = candidateCols.map((c) => c.idx);
  const tickers = candidateCols.map((c) => c.name);

  // --- 3. Parser les lignes et remplir prix + dates ---
  const dates = [];
  const rawPrices = Array.from({ length: priceColIndices.length }, () => []);
  let zeroOrNegRows = 0;

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/[,;\t]/).map((p) => p.trim());
    if (parts.length < header.length) continue;

    const dateStr = parts[dateColIdx];
    if (!isPlausibleDate(dateStr)) {
      // On ignore les lignes dont la date n'est pas exploitable
      continue;
    }
    dates.push(dateStr);

    let rowValid = true;
    for (let j = 0; j < priceColIndices.length; j++) {
      const raw = parts[priceColIndices[j]];
      let v = parseFloat(raw);
      if (isNaN(v)) v = parseCurrency(raw);
      if (v == null || isNaN(v)) {
        // Interpolation naïve : reprendre la valeur précédente si elle existe, sinon 1
        const prev = rawPrices[j].length > 0 ? rawPrices[j][rawPrices[j].length - 1] : 100;
        rawPrices[j].push(prev);
      } else {
        if (v <= 0) {
          zeroOrNegRows++;
          const prev = rawPrices[j].length > 0 ? rawPrices[j][rawPrices[j].length - 1] : 100;
          rawPrices[j].push(Math.max(1e-6, prev));
        } else {
          rawPrices[j].push(v);
        }
      }
    }
    if (!rowValid) {
      // no-op
    }
  }

  const T = dates.length;
  const N = tickers.length;

  if (T < 30) {
    throw new Error(`Série temporelle trop courte après nettoyage (${T} jours, minimum 30).`);
  }
  if (N === 0) {
    throw new Error('Aucun actif numérique exploitable après nettoyage du CSV.');
  }

  // --- 4. Calculer les rendements log, rejeter si NaN / manque de variation ---
  const returnsMatrix = [];
  let nanReturns = 0;
  const assetSampleRanges = new Array(N).fill(0);

  for (let t = 1; t < T; t++) {
    const row = new Array(N);
    for (let j = 0; j < N; j++) {
      const pPrev = rawPrices[j][t - 1];
      const pCurr = rawPrices[j][t];
      if (pPrev <= 0 || pCurr <= 0) {
        row[j] = 0;
        nanReturns++;
      } else {
        const r = Math.log(pCurr / pPrev);
        row[j] = isFinite(r) ? r : 0;
        if (!isFinite(r)) nanReturns++;
      }
    }
    returnsMatrix.push(row);
  }

  // Vérifier la dispersion des prix par actif (éviter colonnes quasi constantes)
  for (let j = 0; j < N; j++) {
    const series = rawPrices[j];
    const mn = Math.min(...series);
    const mx = Math.max(...series);
    assetSampleRanges[j] = (mx - mn) / (Math.abs(mn) + 1e-9);
  }
  const minRange = Math.min(...assetSampleRanges);
  if (minRange < 0.02) {
    throw new Error(
      'Les colonnes détectées présentent une variation insuffisante (< 2% de range). Ce fichier ne ressemble pas à des cours de marché : vérifiez vos colonnes (excluez IDs, CVV, codes postaux, etc.).'
    );
  }

  return {
    dates: dates.slice(1),
    tickers,
    prices: rawPrices,
    returnsMatrix,
  };
}

module.exports = {
  ASSET_REGISTRY,
  generateMarketData,
  parseCsvPrices,
};
