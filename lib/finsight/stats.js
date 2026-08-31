/**
 * FinSight R&D - Moteur Mathématique & Statistique Fondamental
 * Moments d'ordre supérieur, expansion de Cornish-Fisher, algèbre linéaire matricielle,
 * factorisation de Cholesky et distributions statistiques.
 */

/**
 * Calcule la moyenne arithmétique d'une série.
 * @param {number[]} values
 * @returns {number}
 */
function mean(values) {
  if (!values || values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Calcule la variance échantillonnale (avec correction de Bessel n-1).
 * @param {number[]} values
 * @param {number} [m] - Moyenne pré-calculée
 * @returns {number}
 */
function variance(values, m = null) {
  if (!values || values.length < 2) return 0;
  const avg = m !== null ? m : mean(values);
  const sqDiffs = values.reduce((acc, v) => acc + (v - avg) ** 2, 0);
  return sqDiffs / (values.length - 1);
}

/**
 * Calcule l'écart-type échantillonnal.
 * @param {number[]} values
 * @param {number} [m]
 * @returns {number}
 */
function stdDev(values, m = null) {
  return Math.sqrt(variance(values, m));
}

/**
 * Calcule le Skewness échantillonnal (asymétrie de Fisher-Pearson non biaisée).
 * S = [n / ((n - 1)(n - 2))] * sum(((x - mu)/sigma)^3)
 * @param {number[]} values
 * @returns {number}
 */
function skewness(values) {
  const n = values.length;
  if (n < 3) return 0;
  const avg = mean(values);
  const s = stdDev(values, avg);
  if (s < 1e-12) return 0;

  const m3 = values.reduce((acc, v) => acc + ((v - avg) / s) ** 3, 0);
  return (n / ((n - 1) * (n - 2))) * m3;
}

/**
 * Calcule le Kurtosis d'excès échantillonnal (Excess Kurtosis par rapport à la normale = 0).
 * @param {number[]} values
 * @returns {number}
 */
function excessKurtosis(values) {
  const n = values.length;
  if (n < 4) return 0;
  const avg = mean(values);
  const s = stdDev(values, avg);
  if (s < 1e-12) return 0;

  const m4 = values.reduce((acc, v) => acc + ((v - avg) / s) ** 4, 0);
  const c1 = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
  const c2 = (3 * (n - 1) ** 2) / ((n - 2) * (n - 3));
  return c1 * m4 - c2;
}

/**
 * Fonction quantile de la loi normale standard (Approximation rationnelle d'Acklam).
 * Erreur absolue < 1.15e-9.
 * @param {number} p - Probabilité (0 < p < 1)
 * @returns {number} - Quantile z_p tel que P(Z <= z_p) = p
 */
function normalInv(p) {
  if (p <= 0 || p >= 1) {
    if (p === 0) return -Infinity;
    if (p === 1) return Infinity;
    throw new RangeError('p doit être strictement compris entre 0 et 1');
  }

  // Coefficients d'Acklam
  const a = [
    -3.969683028665376e1,
    2.209460984245205e2,
    -2.759285104469687e2,
    1.38357751867269e2,
    -3.066479806614716e1,
    2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1,
    1.615858368580409e2,
    -1.556989798598866e2,
    6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3,
    -3.223964580411365e-1,
    -2.400758277161838,
    -2.549732539343734,
    4.374664141464968,
    2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3,
    3.224671290700398e-1,
    2.445134137142996,
    3.754408661907416,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (p < pLow) {
    // Région inférieure
    const q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }

  if (p <= pHigh) {
    // Région centrale
    const q = p - 0.5;
    const r = q * q;
    return (
      (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  }

  // Région supérieure
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return (
    -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  );
}

/**
 * Fonction de répartition de la loi normale standard Phi(z).
 * @param {number} z
 * @returns {number}
 */
function normalCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const prob =
    d *
    t *
    (0.31938153 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z > 0 ? 1 - prob : prob;
}

/**
 * Quantile ajusté par l'expansion de Cornish-Fisher.
 * Corrige le quantile gaussien standard z_alpha pour intégrer l'asymétrie S et l'excès de kurtosis K.
 * z_CF = z + (z^2 - 1)*S/6 + (z^3 - 3z)*K/24 - (2z^3 - 5z)*S^2/36
 * @param {number} alpha - Niveau de quantile (ex: 0.05 pour 95% de confiance)
 * @param {number} skew - Asymétrie (Skewness)
 * @param {number} kurt - Excès de Kurtosis
 * @returns {number} Quantile ajusté
 */
function cornishFisherQuantile(alpha, skew, kurt) {
  const z = normalInv(alpha);
  const z2 = z * z;
  const z3 = z2 * z;

  const termSkew1 = ((z2 - 1) * skew) / 6;
  const termKurt = ((z3 - 3 * z) * kurt) / 24;
  const termSkew2 = ((2 * z3 - 5 * z) * (skew * skew)) / 36;

  return z + termSkew1 + termKurt - termSkew2;
}

/**
 * Calcule la matrice de covariance échantillonnale entre plusieurs séries d'actifs.
 * @param {number[][]} returnsMatrix - Matrice [T x N] (T observations temporelles, N actifs)
 * @returns {{ cov: number[][], means: number[], stds: number[] }}
 */
function covarianceMatrix(returnsMatrix) {
  const T = returnsMatrix.length;
  if (T < 2) throw new Error('Nombre insuffisant de périodes pour calculer la covariance.');
  const N = returnsMatrix[0].length;

  const means = new Array(N).fill(0);
  for (let t = 0; t < T; t++) {
    for (let i = 0; i < N; i++) {
      means[i] += returnsMatrix[t][i];
    }
  }
  for (let i = 0; i < N; i++) means[i] /= T;

  const cov = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let t = 0; t < T; t++) {
    for (let i = 0; i < N; i++) {
      const devI = returnsMatrix[t][i] - means[i];
      for (let j = i; j < N; j++) {
        const devJ = returnsMatrix[t][j] - means[j];
        cov[i][j] += devI * devJ;
      }
    }
  }

  const stds = new Array(N);
  for (let i = 0; i < N; i++) {
    for (let j = i; j < N; j++) {
      cov[i][j] /= T - 1;
      cov[j][i] = cov[i][j];
    }
    stds[i] = Math.sqrt(Math.max(1e-12, cov[i][i]));
  }

  return { cov, means, stds };
}

/**
 * Calcule la matrice de corrélation à partir de la matrice de covariance.
 * @param {number[][]} cov
 * @param {number[]} stds
 * @returns {number[][]}
 */
function correlationMatrix(cov, stds) {
  const N = cov.length;
  const corr = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      corr[i][j] = cov[i][j] / (stds[i] * stds[j] + 1e-12);
      if (i === j) corr[i][j] = 1.0;
    }
  }
  return corr;
}

/**
 * Décomposition de Cholesky d'une matrice symétrique définie positive : A = L * L^T.
 * Utilisé pour générer des chocs gaussiens corrélés pour la simulation Monte Carlo.
 * @param {number[][]} matrix
 * @returns {number[][]} Matrice triangulaire inférieure L
 */
function choleskyDecomposition(matrix) {
  const N = matrix.length;
  const L = Array.from({ length: N }, () => new Array(N).fill(0));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) {
        sum += L[i][k] * L[j][k];
      }

      if (i === j) {
        const diag = matrix[i][i] - sum;
        L[i][j] = Math.sqrt(Math.max(1e-12, diag));
      } else {
        L[i][j] = (matrix[i][j] - sum) / (L[j][j] + 1e-12);
      }
    }
  }
  return L;
}

/**
 * Générateur pseudo-aléatoire Box-Muller pour variables normales standards N(0,1).
 * @param {Function} [rng] - Générateur uniforme [0, 1)
 * @returns {number}
 */
function sampleStandardNormal(rng = Math.random) {
  let u1 = 0;
  let u2 = 0;
  while (u1 <= 1e-15) u1 = rng();
  while (u2 <= 1e-15) u2 = rng();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

/**
 * Échantillonne une variable de Student-t avec nu degrés de liberté.
 * @param {number} df - Degrés de liberté (ex: 5 pour queues épaisses financières)
 * @param {Function} [rng]
 * @returns {number}
 */
function sampleStudentT(df = 5, rng = Math.random) {
  const z = sampleStandardNormal(rng);
  let v = 0;
  for (let k = 0; k < df; k++) {
    const zk = sampleStandardNormal(rng);
    v += zk * zk;
  }
  return z / Math.sqrt(v / df);
}

module.exports = {
  mean,
  variance,
  stdDev,
  skewness,
  excessKurtosis,
  normalInv,
  normalCdf,
  cornishFisherQuantile,
  covarianceMatrix,
  correlationMatrix,
  choleskyDecomposition,
  sampleStandardNormal,
  sampleStudentT,
};
