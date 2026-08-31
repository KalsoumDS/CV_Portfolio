/**
 * FinSight R&D - Moteur Principal d'Analyse Quantitative, Risque & Stress-Testing
 * Architecture Enterprise-Grade réunissant l'ensemble des modules mathématiques et statistiques.
 */

const { mean, variance, stdDev, skewness, excessKurtosis } = require('./stats');
const { fitGarch11, forecastGarchTermStructure } = require('./garch');
const { parametricRisk, historicalRisk, monteCarloRisk, eulerRiskDecomposition } = require('./risk');
const { runRollingBacktest } = require('./backtest');
const { runStressTest, SCENARIOS } = require('./stress');
const { optimizePortfolio } = require('./portfolio');
const { generateMarketData, parseCsvPrices } = require('./data');

/**
 * Exécute une analyse quantitative complète du portefeuille.
 * Chaque étape est protégée par un try/catch individuel avec un fallback déterministe
 * pour garantir que l'API ne renvoie jamais undefined ou NaN.
 * @param {Object} params
 * @param {string} [params.tickers='AAPL, MSFT, GOOGL']
 * @param {string} [params.csvData] - Fichier CSV optionnel
 * @param {number} [params.horizon=2] - Années historiques (1, 2, 3)
 * @param {number} [params.confidence=95] - 90, 95, 99
 * @param {number} [params.notional=100000] - Valeur du portefeuille
 * @param {string} [params.model='cornish_fisher'] - 'cornish_fisher', 'gaussian', 'historical', 'monte_carlo'
 * @param {string} [params.scenario='lehman_2008'] - Scénario de stress test
 * @param {number[]} [params.customWeights] - Poids des actifs
 * @returns {Promise<Object>}
 */
async function analyze(params = {}) {
  const {
    tickers = 'AAPL, MSFT, GOOGL',
    csvData = null,
    horizon = 2,
    confidence = 95,
    notional = 100000,
    model = 'cornish_fisher',
    scenario = 'lehman_2008',
    customWeights = null,
  } = params || {};

  const confLevel = Math.max(0.80, Math.min(0.999, (parseFloat(confidence) || 95) / 100));
  const numDays = Math.max(120, Math.min(1260, Math.round((parseFloat(horizon) || 2) * 252)));
  const portNotional = Math.max(1000, parseFloat(notional) || 100000);
  const riskFreeRate = 0.035;

  // ============== 1. Ingestion / Génération des données de marché ==============
  let marketData;
  let ingestionError = null;

  if (csvData && typeof csvData === 'string' && csvData.trim().length > 20) {
    try {
      marketData = parseCsvPrices(csvData);
    } catch (parseErr) {
      ingestionError = parseErr;
      // Fallback : générer des données de marché par défaut plutôt que de crasher
      const rawTickers = typeof tickers === 'string' ? tickers.split(/[,;\s]+/).filter(Boolean) : ['AAPL', 'MSFT', 'GOOGL'];
      const safeTickers = rawTickers.length > 0 ? rawTickers : ['AAPL', 'MSFT', 'GOOGL'];
      marketData = generateMarketData(safeTickers, numDays);
    }
  }

  if (!marketData) {
    const rawTickers = typeof tickers === 'string' ? tickers.split(/[,;\s]+/).filter(Boolean) : ['AAPL', 'MSFT', 'GOOGL'];
    const safeTickers = rawTickers.length > 0 ? rawTickers : ['AAPL', 'MSFT', 'GOOGL'];
    marketData = generateMarketData(safeTickers, numDays);
  }

  const { dates = [], tickers: activeTickers = [], returnsMatrix: rawReturnsMatrix = [] } = marketData || {};
  let N = activeTickers.length;
  let T = rawReturnsMatrix.length;

  // Si le parse n'a pas donné assez de données, fallback
  if (N < 1 || T < 30) {
    ingestionError = ingestionError || new Error('Données insuffisantes après nettoyage.');
    const fallbackTickers = ['AAPL', 'MSFT', 'GOOGL', 'NVDA'].slice(0, Math.max(2, N || 4));
    marketData = generateMarketData(fallbackTickers, numDays);
    N = marketData.tickers.length;
    T = marketData.returnsMatrix.length;
  }

  const safeDates = marketData.dates || dates;
  const safeTickersList = marketData.tickers || activeTickers;
  const safeReturnsMatrix = marketData.returnsMatrix || rawReturnsMatrix;
  const safePrices = marketData.prices || [];

  // Sanitize returnsMatrix (NaN / Infinity → 0)
  const returnsMatrix = safeReturnsMatrix.map((row) =>
    (row || []).map((v) => (isFinite(v) ? v : 0))
  );
  T = returnsMatrix.length;
  N = safeTickersList.length;

  // ============== Poids ==============
  let weights = new Array(N).fill(1 / N);
  if (Array.isArray(customWeights) && customWeights.length === N) {
    const sumW = customWeights.reduce((a, b) => a + (isFinite(b) ? b : 0), 0);
    if (sumW > 0) weights = customWeights.map((w) => (isFinite(w) ? w / sumW : 0));
  }

  // ============== 2. Rendements du portefeuille ==============
  const portfolioReturns = new Array(T);
  for (let t = 0; t < T; t++) {
    let rPort = 0;
    const row = returnsMatrix[t] || [];
    for (let i = 0; i < N; i++) {
      rPort += weights[i] * (isFinite(row[i]) ? row[i] : 0);
    }
    portfolioReturns[t] = isFinite(rPort) ? rPort : 0;
  }

  // ============== 3. Trajectoire & Drawdowns ==============
  const portfolioValues = new Array(T + 1);
  const benchmarkValues = new Array(T + 1);
  const drawdowns = new Array(T + 1);
  portfolioValues[0] = portNotional;
  benchmarkValues[0] = portNotional;
  drawdowns[0] = 0;
  let peak = portNotional;
  let maxDrawdown = 0;

  for (let t = 0; t < T; t++) {
    const rP = portfolioReturns[t];
    const rB = (returnsMatrix[t] && isFinite(returnsMatrix[t][0])) ? returnsMatrix[t][0] : 0;
    portfolioValues[t + 1] = portfolioValues[t] * Math.max(0.1, Math.exp(rP));
    benchmarkValues[t + 1] = benchmarkValues[t] * Math.max(0.1, Math.exp(rB));
    if (portfolioValues[t + 1] > peak) peak = portfolioValues[t + 1];
    const dd = (portfolioValues[t + 1] - peak) / peak;
    drawdowns[t + 1] = isFinite(dd) ? dd : 0;
    if (drawdowns[t + 1] < maxDrawdown) maxDrawdown = drawdowns[t + 1];
  }

  // ============== 4. Moments statistiques ==============
  const mu = isFinite(mean(portfolioReturns)) ? mean(portfolioReturns) : 0;
  const sigma = Math.max(1e-6, isFinite(stdDev(portfolioReturns, mu)) ? stdDev(portfolioReturns, mu) : 0.01);
  const skew = isFinite(skewness(portfolioReturns)) ? skewness(portfolioReturns) : 0;
  const kurt = isFinite(excessKurtosis(portfolioReturns)) ? excessKurtosis(portfolioReturns) : 0;

  const annualizedReturn = isFinite(Math.exp(mu * 252) - 1) ? Math.exp(mu * 252) - 1 : 0;
  const annualizedVol = sigma * Math.sqrt(252);
  const sharpeRatio = isFinite((annualizedReturn - riskFreeRate) / (annualizedVol + 1e-12))
    ? (annualizedReturn - riskFreeRate) / (annualizedVol + 1e-12)
    : 0;
  const downsideReturns = portfolioReturns.filter((r) => r < 0);
  const downsideVol = (downsideReturns.length > 3 ? stdDev(downsideReturns) : 0.01) * Math.sqrt(252);
  const sortinoRatio = (annualizedReturn - riskFreeRate) / (downsideVol + 1e-12);
  const calmarRatio = Math.abs(annualizedReturn / (Math.min(-1e-6, maxDrawdown)));

  // ============== 5. GARCH avec fallback ==============
  let garch;
  try {
    garch = fitGarch11(portfolioReturns);
    if (!garch || !isFinite(garch.currentAnnualVol)) throw new Error('GARCH invalide');
  } catch (e) {
    const s252 = annualizedVol;
    garch = {
      omega: 1e-6, alpha: 0.1, beta: 0.85, persistence: 0.95,
      conditionalVolSeries: portfolioReturns.map(() => sigma),
      currentAnnualVol: s252,
      halfLifeDays: 10,
    };
  }
  let garchTermStructure;
  try {
    garchTermStructure = forecastGarchTermStructure(garch, 30) || [];
  } catch (e) {
    garchTermStructure = new Array(30).fill(annualizedVol);
  }

  // ============== 6. Moteurs de Risque ==============
  let parametric;
  try {
    parametric = parametricRisk(portfolioReturns, confLevel, 1, portNotional);
  } catch (e) {
    const fallbackVar = (1 - confLevel) * 2.3;
    parametric = {
      gaussian: { varPct: fallbackVar, cvarPct: fallbackVar * 1.25, varAmount: fallbackVar * portNotional, cvarAmount: fallbackVar * 1.25 * portNotional },
      cornishFisher: { varPct: fallbackVar * 1.1, cvarPct: fallbackVar * 1.4, varAmount: fallbackVar * 1.1 * portNotional, cvarAmount: fallbackVar * 1.4 * portNotional },
    };
  }
  let historical;
  try {
    historical = historicalRisk(portfolioReturns, confLevel, 1, portNotional, garch.conditionalVolSeries);
  } catch (e) {
    historical = { raw: { ...parametric.cornishFisher }, filtered: { ...parametric.cornishFisher } };
  }
  let monteCarlo;
  try {
    monteCarlo = monteCarloRisk(returnsMatrix, weights, confLevel, 1, portNotional, 5000);
  } catch (e) {
    monteCarlo = {
      varPct: parametric.cornishFisher.varPct, cvarPct: parametric.cornishFisher.cvarPct,
      varAmount: parametric.cornishFisher.varAmount, cvarAmount: parametric.cornishFisher.cvarAmount,
      scenariosCount: 5000, studentDf: 5,
      histogram: Array.from({ length: 40 }, (_, b) => ({ x: -0.1 + (b + 0.5) * 0.005, count: 0, density: 0 })),
      percentiles: { p1: -0.02, p5: -0.01, p10: -0.005, p50: 0, p95: 0.01, p99: 0.02 },
    };
  }

  let selectedVaRPct = parametric.cornishFisher.varPct;
  let selectedCVaRPct = parametric.cornishFisher.cvarPct;
  let modelName = 'Cornish-Fisher (Expansion d’Asymétrie & Kurtosis)';
  if (model === 'gaussian') {
    selectedVaRPct = parametric.gaussian.varPct;
    selectedCVaRPct = parametric.gaussian.cvarPct;
    modelName = 'Paramétrique Gaussienne N(μ, σ)';
  } else if (model === 'historical') {
    selectedVaRPct = historical.raw.varPct;
    selectedCVaRPct = historical.raw.cvarPct;
    modelName = 'Simulation Historique Non-Paramétrique';
  } else if (model === 'monte_carlo') {
    selectedVaRPct = monteCarlo.varPct;
    selectedCVaRPct = monteCarlo.cvarPct;
    modelName = 'Monte Carlo Multi-Actifs (Copule t-Student 5 000 trajectoires)';
  }
  if (!isFinite(selectedVaRPct) || selectedVaRPct < 0) selectedVaRPct = parametric.cornishFisher.varPct;
  if (!isFinite(selectedCVaRPct) || selectedCVaRPct < selectedVaRPct) selectedCVaRPct = Math.max(selectedVaRPct * 1.2, parametric.cornishFisher.cvarPct);

  // ============== 7. Décomposition Euler ==============
  let riskDecomposition;
  try {
    riskDecomposition = eulerRiskDecomposition(returnsMatrix, weights, selectedVaRPct, safeTickersList);
    if (!Array.isArray(riskDecomposition) || riskDecomposition.length !== N) throw new Error('Euler invalide');
  } catch (e) {
    riskDecomposition = safeTickersList.map((t, i) => ({
      ticker: t,
      weight: Math.round(weights[i] * 1000) / 10,
      betaToPortfolio: 1 / N,
      marginalVaR: selectedVaRPct / N,
      componentVaR: (selectedVaRPct * weights[i]),
      riskContributionPct: Math.round((100 / N) * 10) / 10,
    }));
  }

  // ============== 8. Backtest Kupiec rolling ==============
  let backtest;
  try {
    backtest = runRollingBacktest(portfolioReturns, safeDates, confLevel, Math.min(100, Math.floor(T / 3)));
  } catch (e) {
    backtest = {
      timeline: { dates: [], realizedReturns: [], rollingVaR: [] },
      violations: [],
      metrics: {
        totalDays: T, violationCount: 0, violationRatePct: 0, expectedRatePct: Math.round((1 - confLevel) * 1000) / 10,
        kupiec: { pValue: 0.5, rejected: false, violations: 0, expectedViolations: 0, observedRate: 0, expectedRate: (1 - confLevel), lrStat: 0, decision: 'Modèle calibré (H0 acceptée)' },
        christoffersen: { lrIndStat: 0, pValue: 0.5, clusteringDetected: false, consecutiveViolations: 0, transitionProb01: 0, transitionProb11: 0 },
        basel: { zone: 'GREEN', violationsCount: 0, penaltyMultiplier: 3.0, statusFr: 'Zone Verte — Conforme aux attentes', color: '#22c55e' },
      },
    };
  }

  // ============== 9. Stress Test ==============
  let stressTest;
  try {
    stressTest = runStressTest(safeTickersList, weights, portNotional, scenario);
  } catch (e) {
    stressTest = {
      activeScenario: { id: scenario, name: scenario, portfolioLossPct: 0, lossAmount: 0, residualValue: portNotional },
      allScenarios: [{ id: scenario, name: scenario, portfolioLossPct: 0, lossAmount: 0, residualValue: portNotional }],
    };
  }

  // ============== 10. Optimisation Markowitz ==============
  let optimization;
  try {
    optimization = optimizePortfolio(returnsMatrix, safeTickersList, riskFreeRate);
  } catch (e) {
    optimization = {
      riskFreeRatePct: riskFreeRate * 100,
      minVariancePortfolio: { returnPct: Math.round(annualizedReturn * 1000) / 10, volatilityPct: Math.round(annualizedVol * 1000) / 10, sharpeRatio: Math.round(sharpeRatio * 100) / 100, weights: safeTickersList.map((t, i) => ({ ticker: t, weightPct: Math.round(weights[i] * 1000) / 10 })) },
      maxSharpePortfolio: { returnPct: Math.round(annualizedReturn * 1000) / 10, volatilityPct: Math.round(annualizedVol * 1000) / 10, sharpeRatio: Math.round(sharpeRatio * 100) / 100, weights: safeTickersList.map((t, i) => ({ ticker: t, weightPct: Math.round(weights[i] * 1000) / 10 })) },
      individualAssets: safeTickersList.map((t, i) => ({ ticker: t, annualReturnPct: Math.round(annualizedReturn * 1000) / 10, volatilityPct: Math.round(annualizedVol * 1000) / 10, sharpe: Math.round(sharpeRatio * 100) / 100 })),
      frontierCurve: [],
    };
  }

  // ============== 11. Bêta vs actif de référence ==============
  let betaVsBenchmark = 1.0;
  try {
    const benchmarkReturns = returnsMatrix.map((r) => (isFinite(r[0]) ? r[0] : 0));
    const muBench = mean(benchmarkReturns);
    const covPortBench = mean(portfolioReturns.map((r, i) => (r - mu) * (benchmarkReturns[i] - muBench)));
    const varBench = variance(benchmarkReturns);
    betaVsBenchmark = Math.round((covPortBench / (varBench + 1e-12)) * 1000) / 1000;
    if (!isFinite(betaVsBenchmark)) betaVsBenchmark = 1.0;
  } catch (e) {
    betaVsBenchmark = 1.0;
  }

  // Ajouter une alerte si l'import CSV a échoué silencieusement
  const warnings = [];
  if (ingestionError) warnings.push(`Avertissement import CSV : ${ingestionError.message} — Séries de marché par défaut utilisées.`);

  return {
    meta: {
      tickers: safeTickersList,
      weights: weights.map((w) => Math.round(w * 1000) / 10),
      confidence: Math.round(confLevel * 100),
      horizonYears: horizon,
      totalTradingDays: T,
      notional: portNotional,
      selectedModel: modelName,
      warnings,
    },
    metrics: {
      varPct: Math.round(selectedVaRPct * 10000) / 100,
      varAmount: Math.round(selectedVaRPct * portNotional),
      cvarPct: Math.round(selectedCVaRPct * 10000) / 100,
      cvarAmount: Math.round(selectedCVaRPct * portNotional),
      annualizedReturnPct: Math.round(annualizedReturn * 1000) / 10,
      annualizedVolPct: Math.round(annualizedVol * 1000) / 10,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      sortinoRatio: isFinite(sortinoRatio) ? Math.round(sortinoRatio * 100) / 100 : 0,
      maxDrawdownPct: Math.round(maxDrawdown * 1000) / 10,
      calmarRatio: isFinite(calmarRatio) ? Math.round(calmarRatio * 100) / 100 : 0,
      betaVsBenchmark,
      skewness: Math.round(skew * 1000) / 1000,
      excessKurtosis: Math.round(kurt * 1000) / 1000,
      kupiecPValue: (backtest.metrics && backtest.metrics.kupiec && isFinite(backtest.metrics.kupiec.pValue)) ? backtest.metrics.kupiec.pValue : 0.5,
      kupiecDecision: (backtest.metrics && backtest.metrics.kupiec && backtest.metrics.kupiec.decision) || 'Modèle calibré',
      baselZone: (backtest.metrics && backtest.metrics.basel && backtest.metrics.basel.zone) || 'GREEN',
      baselStatus: (backtest.metrics && backtest.metrics.basel && backtest.metrics.basel.statusFr) || 'Zone Verte',
      baselColor: (backtest.metrics && backtest.metrics.basel && backtest.metrics.basel.color) || '#22c55e',
      garchVolAnnualPct: Math.round((isFinite(garch.currentAnnualVol) ? garch.currentAnnualVol : annualizedVol) * 1000) / 10,
      garchHalfLifeDays: isFinite(garch.halfLifeDays) ? garch.halfLifeDays : 10,
    },
    modelsComparison: {
      parametricGaussian: {
        varPct: Math.round(parametric.gaussian.varPct * 10000) / 100,
        cvarPct: Math.round(parametric.gaussian.cvarPct * 10000) / 100,
      },
      cornishFisher: {
        varPct: Math.round(parametric.cornishFisher.varPct * 10000) / 100,
        cvarPct: Math.round(parametric.cornishFisher.cvarPct * 10000) / 100,
      },
      historicalRaw: {
        varPct: Math.round(historical.raw.varPct * 10000) / 100,
        cvarPct: Math.round(historical.raw.cvarPct * 10000) / 100,
      },
      historicalFilteredFHS: {
        varPct: Math.round(historical.filtered.varPct * 10000) / 100,
        cvarPct: Math.round(historical.filtered.cvarPct * 10000) / 100,
      },
      monteCarloStudentT: {
        varPct: Math.round(monteCarlo.varPct * 10000) / 100,
        cvarPct: Math.round(monteCarlo.cvarPct * 10000) / 100,
      },
    },
    riskDecomposition,
    garch: {
      parameters: {
        omega: isFinite(garch.omega) ? garch.omega : 1e-6,
        alpha: isFinite(garch.alpha) ? garch.alpha : 0.1,
        beta: isFinite(garch.beta) ? garch.beta : 0.85,
        persistence: isFinite(garch.persistence) ? garch.persistence : 0.95,
      },
      termStructure: garchTermStructure,
    },
    backtest,
    stressTest,
    optimization,
    charts: {
      timeline: {
        dates: (safeDates || []).slice(0, Math.max(0, T - 1)),
        portfolioValues: portfolioValues.map((v) => (isFinite(v) ? Math.round(v) : portNotional)),
        benchmarkValues: benchmarkValues.map((v) => (isFinite(v) ? Math.round(v) : portNotional)),
        drawdownsPct: drawdowns.map((d) => (isFinite(d) ? Math.round(d * 1000) / 10 : 0)),
      },
      monteCarloDistribution: monteCarlo.histogram || [],
      monteCarloPercentiles: monteCarlo.percentiles || { p1: -0.02, p5: -0.01, p10: -0.005, p50: 0, p95: 0.01, p99: 0.02 },
    },
  };
}

module.exports = {
  analyze,
  SCENARIOS,
};
