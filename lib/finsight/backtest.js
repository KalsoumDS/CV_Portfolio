/**
 * FinSight R&D - Moteur de Backtesting Réglementaire (Normes Bâle & Tests Statistiques)
 * Tests : Kupiec POF (Proportion of Failures), Christoffersen Independence,
 * Conditional Coverage & Cadre des Feux Tricolores du Comité de Bâle.
 */

const { normalCdf } = require('./stats');

/**
 * Calcule la p-valeur exacte d'une statistique Chi2 à 1 degré de liberté.
 * P(Chi2(1) >= x) = 2 * (1 - Phi(sqrt(x)))
 * @param {number} chi2Stat
 * @returns {number}
 */
function chi2Survival1Df(chi2Stat) {
  if (chi2Stat <= 0) return 1.0;
  const z = Math.sqrt(chi2Stat);
  return 2.0 * (1.0 - normalCdf(z));
}

/**
 * Calcule la p-valeur pour Chi2 à 2 degrés de liberté.
 * P(Chi2(2) >= x) = exp(-x / 2)
 * @param {number} chi2Stat
 * @returns {number}
 */
function chi2Survival2Df(chi2Stat) {
  if (chi2Stat <= 0) return 1.0;
  return Math.exp(-chi2Stat / 2.0);
}

/**
 * Exécute le test de Kupiec (POF Likelihood Ratio).
 * H0 : La probabilité théorique de violation p est égale au taux observé x/T.
 * @param {number} violations - Nombre d'exceptions réelles observées (x)
 * @param {number} totalObservations - Nombre total de jours testés (T)
 * @param {number} alpha - Niveau de confiance (ex: 0.95 => p = 0.05)
 * @param {number} [significanceLevel=0.05] - Seuil de rejet alpha_test
 * @returns {Object}
 */
function kupiecPofTest(violations, totalObservations, alpha = 0.95, significanceLevel = 0.05) {
  const T = totalObservations;
  const x = violations;
  const p = 1.0 - alpha; // Probabilité théorique (ex: 0.05)
  const pHat = x / T;

  if (x === 0) {
    const lr0 = -2.0 * T * Math.log(1.0 - p);
    const pVal0 = chi2Survival1Df(lr0);
    return {
      lrStat: Math.round(lr0 * 1000) / 1000,
      pValue: Math.round(pVal0 * 10000) / 10000,
      rejected: pVal0 < significanceLevel,
      violations: x,
      expectedViolations: Math.round(T * p * 10) / 10,
      observedRate: 0,
      expectedRate: p,
      decision: pVal0 >= significanceLevel ? 'Modèle validé (H0 acceptée)' : 'Modèle rejeté (H0 rejetée)',
    };
  }

  if (x === T) {
    return {
      lrStat: 999.0,
      pValue: 0.0,
      rejected: true,
      violations: x,
      expectedViolations: Math.round(T * p * 10) / 10,
      observedRate: 1.0,
      expectedRate: p,
      decision: 'Modèle rejeté (H0 rejetée)',
    };
  }

  // LR_POF = -2 * [ (T-x)*ln(1-p) + x*ln(p) - (T-x)*ln(1-pHat) - x*ln(pHat) ]
  const logL0 = (T - x) * Math.log(1.0 - p) + x * Math.log(p);
  const logL1 = (T - x) * Math.log(1.0 - pHat) + x * Math.log(pHat);
  const lrPof = Math.max(0, -2.0 * (logL0 - logL1));
  const pValue = chi2Survival1Df(lrPof);

  return {
    lrStat: Math.round(lrPof * 1000) / 1000,
    pValue: Math.round(pValue * 10000) / 10000,
    rejected: pValue < significanceLevel,
    violations: x,
    expectedViolations: Math.round(T * p * 10) / 10,
    observedRate: Math.round(pHat * 10000) / 10000,
    expectedRate: Math.round(p * 10000) / 10000,
    decision: pValue >= significanceLevel ? 'Modèle calibré (H0 acceptée)' : 'Modèle non calibré (H0 rejetée)',
  };
}

/**
 * Test d'indépendance de Christoffersen (absence de clustering / dépendance temporelle des violations).
 * @param {number[]} violationSequence - Suite binaire [0, 1, 0, 0, 1...] où 1 indique une violation
 * @returns {Object}
 */
function christoffersenIndependenceTest(violationSequence) {
  let n00 = 0;
  let n01 = 0;
  let n10 = 0;
  let n11 = 0;

  for (let t = 1; t < violationSequence.length; t++) {
    const prev = violationSequence[t - 1];
    const curr = violationSequence[t];
    if (prev === 0 && curr === 0) n00++;
    else if (prev === 0 && curr === 1) n01++;
    else if (prev === 1 && curr === 0) n10++;
    else if (prev === 1 && curr === 1) n11++;
  }

  const pi0 = (n01 + n11) / (n00 + n01 + n10 + n11 + 1e-12);
  const pi01 = n01 / (n00 + n01 + 1e-12);
  const pi11 = n11 / (n10 + n11 + 1e-12);

  let lrInd = 0;
  if (n01 > 0 || n11 > 0) {
    const term00 = n00 > 0 ? n00 * Math.log(1 - pi01) : 0;
    const term01 = n01 > 0 ? n01 * Math.log(pi01) : 0;
    const term10 = n10 > 0 ? n10 * Math.log(1 - pi11) : 0;
    const term11 = n11 > 0 ? n11 * Math.log(pi11) : 0;
    const logL1 = term00 + term01 + term10 + term11;

    const logL0 =
      (n00 + n10) * Math.log(Math.max(1e-12, 1 - pi0)) +
      (n01 + n11) * Math.log(Math.max(1e-12, pi0));

    lrInd = Math.max(0, -2.0 * (logL0 - logL1));
  }

  const pValue = chi2Survival1Df(lrInd);

  return {
    lrIndStat: Math.round(lrInd * 1000) / 1000,
    pValue: Math.round(pValue * 10000) / 10000,
    clusteringDetected: pValue < 0.05,
    consecutiveViolations: n11,
    transitionProb01: Math.round(pi01 * 1000) / 1000,
    transitionProb11: Math.round(pi11 * 1000) / 1000,
  };
}

/**
 * Cadre réglementaire des Feux Tricolores du Comité de Bâle (Basel Traffic Light).
 * Évalue le nombre d'exceptions sur un horizon rolling standardisé de 250 jours pour VaR 99%.
 * @param {number} violationsCount - Nombre de dépassements sur 250 jours
 * @param {number} [confidence=0.99]
 * @returns {Object}
 */
function baselTrafficLight(violationsCount, confidence = 0.99) {
  let zone = 'GREEN';
  let penaltyMultiplier = 3.0; // Multiplicateur de capital standard
  let statusFr = 'Zone Verte (Conforme)';
  let color = '#22c55e'; // Vert émeraude

  if (confidence >= 0.985) {
    // Norme réglementaire Bâle II/III pour VaR 99% sur 250 jours
    if (violationsCount <= 4) {
      zone = 'GREEN';
      penaltyMultiplier = 3.0;
      statusFr = 'Zone Verte — Modèle robuste et validé';
      color = '#22c55e';
    } else if (violationsCount <= 9) {
      zone = 'YELLOW';
      const scale = [3.4, 3.5, 3.65, 3.75, 3.85];
      penaltyMultiplier = scale[violationsCount - 5] || 3.85;
      statusFr = 'Zone Jaune — Surveillance accrue / Pénalité de fonds propres';
      color = '#eab308';
    } else {
      zone = 'RED';
      penaltyMultiplier = 4.0;
      statusFr = 'Zone Rouge — Modèle déficient / Rejet réglementaire';
      color = '#ef4444';
    }
  } else {
    // Approximation pour VaR 95% (attendu ~12.5 exceptions sur 250 jours)
    if (violationsCount <= 16) {
      zone = 'GREEN';
      penaltyMultiplier = 3.0;
      statusFr = 'Zone Verte — Conforme aux attentes (VaR 95%)';
      color = '#22c55e';
    } else if (violationsCount <= 22) {
      zone = 'YELLOW';
      penaltyMultiplier = 3.5;
      statusFr = 'Zone Jaune — Déviation modérée';
      color = '#eab308';
    } else {
      zone = 'RED';
      penaltyMultiplier = 4.0;
      statusFr = 'Zone Rouge — Sous-estimation critique du risque';
      color = '#ef4444';
    }
  }

  return {
    zone,
    violationsCount,
    penaltyMultiplier,
    statusFr,
    color,
  };
}

/**
 * Exécute un backtesting complet rolling sur l'ensemble de la série historique.
 * @param {number[]} portfolioReturns - Série temporelle des rendements réels
 * @param {number[]} dates - Timestamps ou labels
 * @param {number} confidence - 0.95 ou 0.99
 * @param {number} [windowSize=120] - Fenêtre glissante d'estimation
 * @returns {Object}
 */
function runRollingBacktest(portfolioReturns, dates, confidence = 0.95, windowSize = 120) {
  const { mean, stdDev, cornishFisherQuantile, skewness, excessKurtosis } = require('./stats');
  const T = portfolioReturns.length;
  if (T <= windowSize + 10) {
    throw new Error('Série temporelle trop courte pour un backtest rolling.');
  }

  const alpha = 1 - confidence;
  const rollingDates = [];
  const realizedReturns = [];
  const rollingVaR = [];
  const violationIndices = [];
  const violationSequence = [];

  for (let t = windowSize; t < T; t++) {
    const windowSlice = portfolioReturns.slice(t - windowSize, t);
    const mu = mean(windowSlice);
    const sigma = stdDev(windowSlice, mu);
    const skew = skewness(windowSlice);
    const kurt = excessKurtosis(windowSlice);

    const zCF = cornishFisherQuantile(alpha, skew, kurt);
    const varT = -(mu + zCF * sigma);

    const actualReturn = portfolioReturns[t];
    const isViolation = actualReturn < -varT ? 1 : 0;

    rollingDates.push(dates ? dates[t] : `T_${t}`);
    realizedReturns.push(Math.round(actualReturn * 10000) / 10000);
    rollingVaR.push(Math.round(varT * 10000) / 10000);
    violationSequence.push(isViolation);

    if (isViolation === 1) {
      violationIndices.push({
        index: t,
        date: dates ? dates[t] : `T_${t}`,
        realizedLoss: Math.round(actualReturn * 10000) / 100, // en %
        predictedVaR: Math.round(varT * 10000) / 100, // en %
        excessLoss: Math.round((-actualReturn - varT) * 10000) / 100,
      });
    }
  }

  const numEvaluated = violationSequence.length;
  const numViolations = violationIndices.length;

  const kupiec = kupiecPofTest(numViolations, numEvaluated, confidence);
  const christoffersen = christoffersenIndependenceTest(violationSequence);
  const basel = baselTrafficLight(numViolations, confidence);

  return {
    timeline: {
      dates: rollingDates,
      realizedReturns,
      rollingVaR,
    },
    violations: violationIndices,
    metrics: {
      totalDays: numEvaluated,
      violationCount: numViolations,
      violationRatePct: Math.round((numViolations / numEvaluated) * 1000) / 10,
      expectedRatePct: Math.round((1 - confidence) * 1000) / 10,
      kupiec,
      christoffersen,
      basel,
    },
  };
}

module.exports = {
  kupiecPofTest,
  christoffersenIndependenceTest,
  baselTrafficLight,
  runRollingBacktest,
};
