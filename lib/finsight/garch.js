/**
 * FinSight R&D - Modélisation de Volatilité Dynamique GARCH(1,1)
 * Équation : sigma_t^2 = omega + alpha * epsilon_{t-1}^2 + beta * sigma_{t-1}^2
 * Estimation par Quasi-Maximum de Vraisemblance (QMLE) avec Variance Targeting
 * et prévision de la structure par terme de volatilité.
 */

const { mean, variance } = require('./stats');

/**
 * Calcule la log-vraisemblance négative pour GARCH(1,1) avec variance targeting.
 * omega = V_L * (1 - alpha - beta) où V_L est la variance inconditionnelle échantillonnale.
 * @param {number[]} returns - Série des rendements centrés
 * @param {number} alpha - Coefficient ARCH (réaction aux chocs)
 * @param {number} beta - Coefficient GARCH (persistance de la volatilité)
 * @param {number} sampleVar - Variance inconditionnelle (V_L)
 * @returns {{ nll: number, sigma2: number[] }}
 */
function garchLogLikelihood(returns, alpha, beta, sampleVar) {
  const T = returns.length;
  const persistence = alpha + beta;

  // Pénalité stricte de non-stationnarité ou positivité violée
  if (alpha < 0.001 || beta < 0.001 || persistence >= 0.9999) {
    return { nll: 1e9, sigma2: [] };
  }

  const omega = sampleVar * (1 - persistence);
  const sigma2 = new Array(T);
  sigma2[0] = sampleVar;

  let nll = 0;
  for (let t = 1; t < T; t++) {
    const epsPrev2 = returns[t - 1] ** 2;
    const s2 = omega + alpha * epsPrev2 + beta * sigma2[t - 1];
    sigma2[t] = Math.max(1e-12, s2);

    // Contribution à la log-vraisemblance gaussienne conditionnelle : 0.5 * (log(sigma2) + eps^2 / sigma2)
    nll += 0.5 * (Math.log(sigma2[t]) + (returns[t] ** 2) / sigma2[t]);
  }

  return { nll, sigma2 };
}

/**
 * Ajuste un modèle GARCH(1,1) par recherche bidimensionnelle sur grille fine + descente locale (Nelder-Mead / Powell simplifié).
 * @param {number[]} returns - Série des rendements journaliers
 * @returns {{
 *   omega: number,
 *   alpha: number,
 *   beta: number,
 *   persistence: number,
 *   unconditionalVolAnnual: number,
 *   currentDailyVol: number,
 *   currentAnnualVol: number,
 *   conditionalVolSeries: number[],
 *   halfLifeDays: number
 * }}
 */
function fitGarch11(returns) {
  const T = returns.length;
  if (T < 30) throw new Error('Échantillon insuffisant pour calibration GARCH(1,1).');

  const mu = mean(returns);
  const centered = returns.map((r) => r - mu);
  const sampleVar = variance(centered);

  let bestNll = Infinity;
  let bestAlpha = 0.08;
  let bestBeta = 0.90;

  // 1. Grid Search initiale sur le domaine admissible [alpha in (0.01, 0.25), persistence in (0.80, 0.99)]
  const alphaGrid = [0.03, 0.05, 0.08, 0.10, 0.12, 0.15, 0.18, 0.22];
  const persistGrid = [0.85, 0.90, 0.93, 0.95, 0.97, 0.985];

  for (const a of alphaGrid) {
    for (const p of persistGrid) {
      if (p <= a) continue;
      const b = p - a;
      const { nll } = garchLogLikelihood(centered, a, b, sampleVar);
      if (nll < bestNll) {
        bestNll = nll;
        bestAlpha = a;
        bestBeta = b;
      }
    }
  }

  // 2. Raffinement local par gradient discret (coordonnées adaptatives)
  let step = 0.01;
  for (let iter = 0; iter < 15; iter++) {
    const candidates = [
      [bestAlpha + step, bestBeta],
      [bestAlpha - step, bestBeta],
      [bestAlpha, bestBeta + step],
      [bestAlpha, bestBeta - step],
      [bestAlpha + step, bestBeta - step],
      [bestAlpha - step, bestBeta + step],
    ];

    let improved = false;
    for (const [candA, candB] of candidates) {
      if (candA > 0.005 && candB > 0.005 && candA + candB < 0.998) {
        const { nll } = garchLogLikelihood(centered, candA, candB, sampleVar);
        if (nll < bestNll) {
          bestNll = nll;
          bestAlpha = candA;
          bestBeta = candB;
          improved = true;
        }
      }
    }
    if (!improved) step *= 0.5;
  }

  const persistence = bestAlpha + bestBeta;
  const omega = sampleVar * (1 - persistence);
  const { sigma2 } = garchLogLikelihood(centered, bestAlpha, bestBeta, sampleVar);

  const conditionalVolSeries = sigma2.map((s2) => Math.sqrt(s2));
  const currentDailyVol = conditionalVolSeries[conditionalVolSeries.length - 1];
  const currentAnnualVol = currentDailyVol * Math.sqrt(252);
  const unconditionalVolAnnual = Math.sqrt(sampleVar * 252);

  // Demi-vie du choc de volatilité : ln(0.5) / ln(alpha + beta)
  const halfLifeDays = persistence < 0.999 ? Math.log(0.5) / Math.log(persistence) : Infinity;

  return {
    omega,
    alpha: Math.round(bestAlpha * 10000) / 10000,
    beta: Math.round(bestBeta * 10000) / 10000,
    persistence: Math.round(persistence * 10000) / 10000,
    unconditionalVolAnnual: Math.round(unconditionalVolAnnual * 10000) / 10000,
    currentDailyVol: Math.round(currentDailyVol * 100000) / 100000,
    currentAnnualVol: Math.round(currentAnnualVol * 10000) / 10000,
    conditionalVolSeries,
    halfLifeDays: Math.round(halfLifeDays * 10) / 10,
  };
}

/**
 * Prévision de la structure par terme de volatilité pour les h prochains jours.
 * E[sigma_{t+h}^2] = V_L + (alpha + beta)^h * (sigma_t^2 - V_L)
 * @param {Object} garchModel - Modèle issu de fitGarch11
 * @param {number} [horizonDays=30] - Horizon de prévision
 * @returns {{ days: number[], dailyVolForecast: number[], annualizedVolForecast: number[] }}
 */
function forecastGarchTermStructure(garchModel, horizonDays = 30) {
  const { alpha, beta, omega, persistence, conditionalVolSeries } = garchModel;
  const currentSigma2 = (conditionalVolSeries[conditionalVolSeries.length - 1]) ** 2;
  const vLongTerm = omega / (1 - persistence);

  const days = [];
  const dailyVolForecast = [];
  const annualizedVolForecast = [];

  for (let h = 1; h <= horizonDays; h++) {
    const s2Forecast = vLongTerm + Math.pow(persistence, h) * (currentSigma2 - vLongTerm);
    const dailyVol = Math.sqrt(Math.max(1e-12, s2Forecast));
    days.push(h);
    dailyVolForecast.push(dailyVol);
    annualizedVolForecast.push(dailyVol * Math.sqrt(252));
  }

  return {
    days,
    dailyVolForecast,
    annualizedVolForecast,
  };
}

module.exports = {
  fitGarch11,
  forecastGarchTermStructure,
};
