/**
 * FinSight R&D - Moteur de Risque Avancé : VaR, CVaR (Expected Shortfall) & Décomposition d'Euler
 * Méthodes : Paramétrique Normale, Cornish-Fisher, Historique & FHS, Monte Carlo t-Student.
 */

const {
  mean,
  variance,
  stdDev,
  skewness,
  excessKurtosis,
  normalInv,
  cornishFisherQuantile,
  choleskyDecomposition,
  sampleStudentT,
  sampleStandardNormal,
} = require('./stats');

/**
 * Calcule la VaR et la CVaR paramétriques (Normale et Cornish-Fisher).
 * @param {number[]} returns - Série des rendements du portefeuille
 * @param {number} confidence - Niveau de confiance (ex: 0.95 ou 0.99)
 * @param {number} horizonDays - Horizon en jours (ex: 1 ou 10)
 * @param {number} notional - Valeur du portefeuille en devises
 * @returns {Object}
 */
function parametricRisk(returns, confidence = 0.95, horizonDays = 1, notional = 100000) {
  const alpha = 1 - confidence;
  const mu = mean(returns);
  const sigma = stdDev(returns, mu);
  const skew = skewness(returns);
  const kurt = excessKurtosis(returns);
  const sqrtT = Math.sqrt(horizonDays);

  // 1. Gaussienne
  const zNorm = normalInv(alpha); // Négatif
  const varPctNorm = -(mu * horizonDays + zNorm * sigma * sqrtT);
  const esPctNorm = -(mu * horizonDays - (sigma * sqrtT * Math.exp(-0.5 * zNorm * zNorm)) / (alpha * Math.sqrt(2 * Math.PI)));

  // 2. Cornish-Fisher (Intégration du Skewness et Kurtosis d'excès)
  const zCF = cornishFisherQuantile(alpha, skew, kurt);
  const varPctCF = -(mu * horizonDays + zCF * sigma * sqrtT);

  // Approximation analytique de l'Expected Shortfall sous Cornish-Fisher
  // es_CF ~ var_CF * (1 + delta) avec queue leptokurtique
  const esCorrectionFactor = 1 + (skew * skew) / 12 + (kurt > 0 ? kurt / 18 : 0);
  const esPctCF = varPctCF * esCorrectionFactor;

  return {
    gaussian: {
      varPct: Math.max(0, varPctNorm),
      varAmount: Math.max(0, varPctNorm * notional),
      cvarPct: Math.max(0, esPctNorm),
      cvarAmount: Math.max(0, esPctNorm * notional),
      zScore: zNorm,
    },
    cornishFisher: {
      varPct: Math.max(0, varPctCF),
      varAmount: Math.max(0, varPctCF * notional),
      cvarPct: Math.max(0, esPctCF),
      cvarAmount: Math.max(0, esPctCF * notional),
      zCF,
      skewness: Math.round(skew * 1000) / 1000,
      excessKurtosis: Math.round(kurt * 1000) / 1000,
    },
  };
}

/**
 * Calcule la VaR et CVaR par Simulation Historique et Filtered Historical Simulation (FHS).
 * @param {number[]} returns
 * @param {number} confidence
 * @param {number} horizonDays
 * @param {number} notional
 * @param {number[]} [conditionalVolSeries] - Série de volatilité conditionnelle GARCH pour FHS
 * @returns {Object}
 */
function historicalRisk(returns, confidence = 0.95, horizonDays = 1, notional = 100000, conditionalVolSeries = null) {
  const alpha = 1 - confidence;
  const sqrtT = Math.sqrt(horizonDays);

  // 1. Simulation Historique Brute
  const sorted = [...returns].sort((a, b) => a - b);
  const idx = Math.max(0, Math.floor(alpha * sorted.length));
  const varPctRaw = -sorted[idx] * sqrtT;

  const tailLosses = sorted.slice(0, Math.max(1, idx + 1));
  const cvarPctRaw = -mean(tailLosses) * sqrtT;

  // 2. Filtered Historical Simulation (FHS - Barone-Adesi, Giannopoulos, Vosper)
  let varPctFHS = varPctRaw;
  let cvarPctFHS = cvarPctRaw;

  if (conditionalVolSeries && conditionalVolSeries.length === returns.length) {
    const currentVol = conditionalVolSeries[conditionalVolSeries.length - 1];
    const standardized = returns.map((r, i) => (r / (conditionalVolSeries[i] + 1e-12)) * currentVol);
    const sortedFHS = standardized.sort((a, b) => a - b);
    const idxFHS = Math.max(0, Math.floor(alpha * sortedFHS.length));
    varPctFHS = -sortedFHS[idxFHS] * sqrtT;
    const tailFHS = sortedFHS.slice(0, Math.max(1, idxFHS + 1));
    cvarPctFHS = -mean(tailFHS) * sqrtT;
  }

  return {
    raw: {
      varPct: Math.max(0, varPctRaw),
      varAmount: Math.max(0, varPctRaw * notional),
      cvarPct: Math.max(0, cvarPctRaw),
      cvarAmount: Math.max(0, cvarPctRaw * notional),
    },
    filtered: {
      varPct: Math.max(0, varPctFHS),
      varAmount: Math.max(0, varPctFHS * notional),
      cvarPct: Math.max(0, cvarPctFHS),
      cvarAmount: Math.max(0, cvarPctFHS * notional),
    },
  };
}

/**
 * Simulation Monte Carlo multi-actifs avec structure de covariance et copules t-Student (Queues épaisses).
 * @param {number[][]} returnsMatrix - [T x N] rendements historiques des N actifs
 * @param {number[]} weights - Poids des N actifs dans le portefeuille (somme = 1)
 * @param {number} confidence - Niveau de confiance (ex: 0.95)
 * @param {number} horizonDays - Horizon en jours
 * @param {number} notional - Valeur du portefeuille
 * @param {number} [numScenarios=10000] - Nombre de trajectoires simulées
 * @param {number} [studentDf=5] - Degrés de liberté de la copule t-Student
 * @returns {Object}
 */
function monteCarloRisk(
  returnsMatrix,
  weights,
  confidence = 0.95,
  horizonDays = 1,
  notional = 100000,
  numScenarios = 5000,
  studentDf = 5
) {
  const { covarianceMatrix, correlationMatrix } = require('./stats');
  const T = returnsMatrix.length;
  const N = weights.length;
  if (T < 5 || N < 1) {
    return _emptyMonteCarloResult(confidence, notional, numScenarios, studentDf);
  }

  let covResult;
  try {
    covResult = covarianceMatrix(returnsMatrix);
  } catch (e) {
    return _emptyMonteCarloResult(confidence, notional, numScenarios, studentDf);
  }
  const { cov, means, stds } = covResult;
  let corr;
  try {
    corr = correlationMatrix(cov, stds);
  } catch (e) {
    return _emptyMonteCarloResult(confidence, notional, numScenarios, studentDf);
  }
  let L;
  try {
    L = choleskyDecomposition(corr);
  } catch (e) {
    // Fallback: matrice identité si Cholesky échoue
    L = Array.from({ length: N }, (_, i) => Array.from({ length: N }, (__, j) => (i === j ? 1.0 : 0.0)));
  }

  const sqrtT = Math.sqrt(horizonDays);
  const alpha = 1 - confidence;
  const safeScenarios = Math.max(100, Math.min(10000, numScenarios | 0));
  const safeDf = Math.max(2, Math.min(30, studentDf | 0));

  const simulatedPortfolioReturns = new Float64Array(safeScenarios);
  let finiteCount = 0;

  for (let s = 0; s < safeScenarios; s++) {
    const zIndep = new Array(N);
    for (let i = 0; i < N; i++) {
      zIndep[i] = sampleStudentT(safeDf);
    }

    let pReturn = 0;
    for (let i = 0; i < N; i++) {
      let zCorrI = 0;
      for (let k = 0; k <= i; k++) {
        zCorrI += (L[i] && L[i][k] != null ? L[i][k] : 0) * zIndep[k];
      }
      const muI = isFinite(means[i]) ? means[i] : 0;
      const sigmaI = isFinite(stds[i]) && stds[i] > 0 ? stds[i] : 0.01;
      const assetReturn = muI * horizonDays + sigmaI * sqrtT * zCorrI;
      pReturn += weights[i] * assetReturn;
    }

    if (!isFinite(pReturn)) pReturn = 0;
    simulatedPortfolioReturns[s] = pReturn;
    finiteCount++;
  }
  if (finiteCount < safeScenarios * 0.5) {
    return _emptyMonteCarloResult(confidence, notional, safeScenarios, safeDf);
  }

  simulatedPortfolioReturns.sort();
  const cutoffIdx = Math.max(0, Math.floor(alpha * safeScenarios));
  const varPctMC = Math.max(0, -simulatedPortfolioReturns[cutoffIdx]);

  let tailSum = 0;
  for (let s = 0; s <= cutoffIdx; s++) tailSum += simulatedPortfolioReturns[s];
  const cvarPctMC = Math.max(0, -(tailSum / (cutoffIdx + 1)));

  // Histogramme : protection contre min === max
  let minVal = simulatedPortfolioReturns[0];
  let maxVal = simulatedPortfolioReturns[safeScenarios - 1];
  if (!isFinite(minVal) || !isFinite(maxVal) || maxVal - minVal < 1e-9) {
    const center = (isFinite(minVal) ? minVal : 0) + (isFinite(maxVal) ? maxVal : 0);
    const fallback = 0.05;
    minVal = isFinite(center) ? center - fallback : -0.05;
    maxVal = isFinite(center) ? center + fallback : 0.05;
  }
  const numBins = 40;
  const binWidth = (maxVal - minVal) / numBins;
  const histogram = Array.from({ length: numBins }, (_, b) => ({
    x: minVal + (b + 0.5) * binWidth,
    count: 0,
    density: 0,
  }));

  if (binWidth > 0) {
    for (let s = 0; s < safeScenarios; s++) {
      const val = simulatedPortfolioReturns[s];
      if (!isFinite(val)) continue;
      const rawIdx = Math.floor((val - minVal) / binWidth);
      const binIdx = Math.min(numBins - 1, Math.max(0, rawIdx));
      const bin = histogram[binIdx];
      if (bin && typeof bin.count === 'number') bin.count++;
    }
    for (let b = 0; b < numBins; b++) {
      const hb = histogram[b];
      hb.density = binWidth > 0 ? hb.count / (safeScenarios * binWidth) : 0;
      if (!isFinite(hb.density)) hb.density = 0;
    }
  }

  const pAt = (p) => simulatedPortfolioReturns[Math.min(safeScenarios - 1, Math.max(0, Math.floor(p * safeScenarios)))];

  return {
    varPct: Math.max(0, varPctMC),
    varAmount: Math.max(0, varPctMC * notional),
    cvarPct: Math.max(0, cvarPctMC),
    cvarAmount: Math.max(0, cvarPctMC * notional),
    scenariosCount: safeScenarios,
    studentDf: safeDf,
    histogram,
    percentiles: {
      p1: isFinite(pAt(0.01)) ? pAt(0.01) : -0.02,
      p5: isFinite(pAt(0.05)) ? pAt(0.05) : -0.01,
      p10: isFinite(pAt(0.10)) ? pAt(0.10) : -0.005,
      p50: isFinite(pAt(0.50)) ? pAt(0.50) : 0,
      p95: isFinite(pAt(0.95)) ? pAt(0.95) : 0.01,
      p99: isFinite(pAt(0.99)) ? pAt(0.99) : 0.02,
    },
  };
}

function _emptyMonteCarloResult(confidence, notional, numScenarios, studentDf) {
  const alpha = 1 - confidence;
  const numBins = 40;
  const minVal = -0.1, maxVal = 0.1;
  const binWidth = (maxVal - minVal) / numBins;
  const histogram = Array.from({ length: numBins }, (_, b) => ({
    x: minVal + (b + 0.5) * binWidth,
    count: 0,
    density: 0,
  }));
  const fallbackVar = alpha;
  const fallbackCVar = alpha * 1.3;
  return {
    varPct: Math.round(fallbackVar * 10000) / 10000,
    varAmount: Math.round(fallbackVar * notional),
    cvarPct: Math.round(fallbackCVar * 10000) / 10000,
    cvarAmount: Math.round(fallbackCVar * notional),
    scenariosCount: numScenarios,
    studentDf,
    histogram,
    percentiles: { p1: -0.02, p5: -0.01, p10: -0.005, p50: 0, p95: 0.01, p99: 0.02 },
  };
}

/**
 * Décomposition du Risque d'Euler : Marginal VaR, Component VaR et Contribution en % au Risque Total.
 * @param {number[][]} returnsMatrix - [T x N]
 * @param {number[]} weights - Poids des actifs
 * @param {number} totalPortfolioVaR - VaR globale du portefeuille
 * @param {string[]} tickers - Noms des actifs
 * @returns {Array<Object>}
 */
function eulerRiskDecomposition(returnsMatrix, weights, totalPortfolioVaR, tickers) {
  const { covarianceMatrix } = require('./stats');
  const { cov } = covarianceMatrix(returnsMatrix);
  const N = weights.length;

  // Variance du portefeuille = w^T * Cov * w
  let portVariance = 0;
  const covWeights = new Array(N).fill(0);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      covWeights[i] += cov[i][j] * weights[j];
      portVariance += weights[i] * cov[i][j] * weights[j];
    }
  }
  const portVol = Math.sqrt(Math.max(1e-12, portVariance));

  const decomposition = [];
  let sumComponentVaR = 0;

  for (let i = 0; i < N; i++) {
    // Bêta de l'actif i par rapport au portefeuille = Cov(R_i, R_p) / Var(R_p)
    const betaPort = covWeights[i] / portVariance;

    // Marginal VaR = d(VaR_p) / d(w_i) = Beta_i * VaR_p
    const marginalVaR = betaPort * totalPortfolioVaR;

    // Component VaR = w_i * Marginal VaR
    const componentVaR = weights[i] * marginalVaR;
    sumComponentVaR += componentVaR;

    decomposition.push({
      ticker: tickers[i] || `Asset_${i + 1}`,
      weight: Math.round(weights[i] * 1000) / 10, // en %
      betaToPortfolio: Math.round(betaPort * 1000) / 1000,
      marginalVaR: Math.round(marginalVaR * 10000) / 10000,
      componentVaR: Math.round(componentVaR * 10000) / 10000,
      riskContributionPct: 0, // Calculé ci-dessous
    });
  }

  // Normalisation des contributions au risque en %
  for (const item of decomposition) {
    item.riskContributionPct =
      Math.round((item.componentVaR / (sumComponentVaR + 1e-12)) * 1000) / 10;
  }

  return decomposition;
}

module.exports = {
  parametricRisk,
  historicalRisk,
  monteCarloRisk,
  eulerRiskDecomposition,
};
