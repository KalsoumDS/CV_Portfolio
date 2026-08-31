/**
 * FinSight R&D - Optimisation de Portefeuille & Frontière Efficiente (Markowitz / Modern Portfolio Theory)
 * Calcul analytique et échantillonnage de la Frontière Efficiente, Portefeuille Tangent (Max Sharpe),
 * et Portefeuille de Variance Minimale Globale (GMV).
 */

const { covarianceMatrix, mean, stdDev } = require('./stats');

/**
 * Inverse une matrice symétrique 2x2 ou NxN (élimination de Gauss-Jordan avec pivot partiel).
 * @param {number[][]} matrix
 * @returns {number[][]}
 */
function invertMatrix(matrix) {
  const n = matrix.length;
  const A = matrix.map((row) => [...row]);
  const I = Array.from({ length: n }, (_, i) => {
    const row = new Array(n).fill(0);
    row[i] = 1;
    return row;
  });

  for (let i = 0; i < n; i++) {
    // Recherche du pivot maximal
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }

    // Échange de lignes
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [I[i], I[maxRow]] = [I[maxRow], I[i]];

    const pivot = A[i][i];
    if (Math.abs(pivot) < 1e-12) {
      // Régularisation Ridge Tikhonov si quasi-singulière
      A[i][i] += 1e-6;
    }

    const diagVal = A[i][i];
    for (let j = 0; j < n; j++) {
      A[i][j] /= diagVal;
      I[i][j] /= diagVal;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = A[k][i];
        for (let j = 0; j < n; j++) {
          A[k][j] -= factor * A[i][j];
          I[k][j] -= factor * I[i][j];
        }
      }
    }
  }

  return I;
}

/**
 * Calcule l'allocation optimale et les points de la Frontière Efficiente.
 * @param {number[][]} returnsMatrix - [T x N]
 * @param {string[]} tickers - Symboles des actifs
 * @param {number} [riskFreeRate=0.035] - Taux sans risque annuel (3.5%)
 * @param {number} [numFrontierPoints=30] - Nombre de points sur la courbe efficiente
 * @returns {Object}
 */
function optimizePortfolio(returnsMatrix, tickers, riskFreeRate = 0.035, numFrontierPoints = 30) {
  const { cov, means } = covarianceMatrix(returnsMatrix);
  const N = tickers.length;

  // Annualisation des rendements et de la matrice de covariance (base 252 jours)
  const annualMeans = means.map((m) => m * 252);
  const annualCov = cov.map((row) => row.map((v) => v * 252));
  const invCov = invertMatrix(annualCov);

  const ones = new Array(N).fill(1);

  // Produit matrice-vecteur
  const multMV = (mat, vec) => {
    const res = new Array(N).fill(0);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        res[i] += mat[i][j] * vec[j];
      }
    }
    return res;
  };

  // Produit scalaire
  const dot = (v1, v2) => v1.reduce((sum, val, idx) => sum + val * v2[idx], 0);

  const invCovOnes = multMV(invCov, ones);
  const invCovMeans = multMV(invCov, annualMeans);

  const A = dot(ones, invCovMeans); // 1^T * inv(Cov) * mu
  const B = dot(annualMeans, invCovMeans); // mu^T * inv(Cov) * mu
  const C = dot(ones, invCovOnes); // 1^T * inv(Cov) * 1
  const D = B * C - A * A;

  // 1. Portefeuille de Variance Minimale Globale (GMV)
  const gmvWeightsRaw = invCovOnes.map((v) => v / C);
  const gmvWeights = gmvWeightsRaw.map((w) => Math.max(0, w)); // Contrainte long-only approximée
  const sumGmv = gmvWeights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < N; i++) gmvWeights[i] /= sumGmv;

  const gmvReturn = dot(gmvWeights, annualMeans);
  const gmvVol = Math.sqrt(Math.max(1e-12, dot(gmvWeights, multMV(annualCov, gmvWeights))));
  const gmvSharpe = (gmvReturn - riskFreeRate) / gmvVol;

  // 2. Portefeuille Tangent (Max Sharpe Ratio)
  const excessMeans = annualMeans.map((m) => m - riskFreeRate);
  const invCovExcess = multMV(invCov, excessMeans);
  const sumExcess = dot(ones, invCovExcess);

  const maxSharpeWeightsRaw = invCovExcess.map((v) => (sumExcess > 0 ? v / sumExcess : 1 / N));
  const maxSharpeWeights = maxSharpeWeightsRaw.map((w) => Math.max(0, w));
  const sumMaxSharpe = maxSharpeWeights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < N; i++) maxSharpeWeights[i] /= sumMaxSharpe;

  const maxSharpeReturn = dot(maxSharpeWeights, annualMeans);
  const maxSharpeVol = Math.sqrt(Math.max(1e-12, dot(maxSharpeWeights, multMV(annualCov, maxSharpeWeights))));
  const maxSharpeRatio = (maxSharpeReturn - riskFreeRate) / maxSharpeVol;

  // 3. Échantillonnage de la Frontière Efficiente (Profils rendement / volatilité)
  const minTargetReturn = Math.max(0.02, gmvReturn);
  const maxTargetReturn = Math.max(...annualMeans) * 1.15;
  const stepReturn = (maxTargetReturn - minTargetReturn) / numFrontierPoints;

  const frontierCurve = [];
  for (let k = 0; k <= numFrontierPoints; k++) {
    const targetMu = minTargetReturn + k * stepReturn;
    // Formule analytique de variance minimale pour un rendement cible : sigma^2 = (C*mu^2 - 2*A*mu + B) / D
    const varTarget = D > 0 ? (C * targetMu * targetMu - 2 * A * targetMu + B) / D : 0.04;
    const volTarget = Math.sqrt(Math.max(1e-12, varTarget));
    const sharpeTarget = (targetMu - riskFreeRate) / volTarget;

    frontierCurve.push({
      expectedReturnPct: Math.round(targetMu * 1000) / 10,
      volatilityPct: Math.round(volTarget * 1000) / 10,
      sharpeRatio: Math.round(sharpeTarget * 100) / 100,
    });
  }

  // Actifs individuels
  const individualAssets = tickers.map((t, i) => {
    const assetVol = Math.sqrt(annualCov[i][i]);
    const assetRet = annualMeans[i];
    return {
      ticker: t,
      annualReturnPct: Math.round(assetRet * 1000) / 10,
      volatilityPct: Math.round(assetVol * 1000) / 10,
      sharpe: Math.round(((assetRet - riskFreeRate) / assetVol) * 100) / 100,
    };
  });

  return {
    riskFreeRatePct: riskFreeRate * 100,
    minVariancePortfolio: {
      returnPct: Math.round(gmvReturn * 1000) / 10,
      volatilityPct: Math.round(gmvVol * 1000) / 10,
      sharpeRatio: Math.round(gmvSharpe * 100) / 100,
      weights: tickers.map((t, i) => ({
        ticker: t,
        weightPct: Math.round(gmvWeights[i] * 1000) / 10,
      })),
    },
    maxSharpePortfolio: {
      returnPct: Math.round(maxSharpeReturn * 1000) / 10,
      volatilityPct: Math.round(maxSharpeVol * 1000) / 10,
      sharpeRatio: Math.round(maxSharpeRatio * 100) / 100,
      weights: tickers.map((t, i) => ({
        ticker: t,
        weightPct: Math.round(maxSharpeWeights[i] * 1000) / 10,
      })),
    },
    individualAssets,
    frontierCurve,
  };
}

module.exports = {
  optimizePortfolio,
};
