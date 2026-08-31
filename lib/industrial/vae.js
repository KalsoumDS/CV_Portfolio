/**
 * FinSight / Industrial R&D - Moteur Variational Autoencoder (VAE) Spatio-Temporel
 * Modélisation probabiliste de séries temporelles de capteurs avec astuce de reparamétrisation :
 * z = mu_z + sigma_z * eps, où eps ~ N(0, I)
 * Fonction de perte ELBO = Reconstruction Loss (MSE/Mahalanobis) + beta * KL Divergence
 */

/**
 * Encodeur probabiliste : projette un vecteur multi-capteurs x dans les paramètres
 * de la distribution latente q(z|x) = N(mu_z, diag(sigma_z^2)).
 * @param {number[]} xNorm - Vecteur capteurs normalisé (dimension d=4)
 * @returns {{ mu: number[], logVar: number[], z: number[] }}
 */
function encode(xNorm) {
  // Poids calibrés d'extraction spatio-temporelle 4 -> 2
  const W_mu = [
    [0.65, 0.35, -0.42, 0.28],
    [-0.30, 0.72, 0.51, -0.48],
  ];
  const b_mu = [0.02, -0.01];

  const W_logVar = [
    [-0.15, -0.22, 0.18, -0.12],
    [0.20, -0.18, -0.25, 0.16],
  ];
  const b_logVar = [-0.85, -0.90]; // Variance latente modérée

  const latentDim = 2;
  const mu = new Array(latentDim).fill(0);
  const logVar = new Array(latentDim).fill(0);
  const z = new Array(latentDim).fill(0);

  for (let j = 0; j < latentDim; j++) {
    let sumMu = b_mu[j];
    let sumLogVar = b_logVar[j];
    for (let i = 0; i < xNorm.length; i++) {
      sumMu += W_mu[j][i] * xNorm[i];
      sumLogVar += W_logVar[j][i] * xNorm[i];
    }
    mu[j] = sumMu;
    logVar[j] = Math.max(-6.0, Math.min(2.0, sumLogVar));

    // Reparameterization trick : z = mu + exp(0.5 * logVar) * eps
    const std = Math.exp(0.5 * logVar[j]);
    const eps = sampleStandardNormal();
    z[j] = mu[j] + std * eps;
  }

  return { mu, logVar, z };
}

/**
 * Décodeur génératif : reconstruit le signal x_hat à partir du vecteur latent z.
 * p(x|z) = N(x_hat, I)
 * @param {number[]} z - Vecteur latent (dimension 2)
 * @returns {number[]} xHat - Vecteur capteurs reconstruit (dimension 4)
 */
function decode(z) {
  const W_dec = [
    [0.65, -0.30],
    [0.35, 0.72],
    [-0.42, 0.51],
    [0.28, -0.48],
  ];
  const b_dec = [0.0, 0.0, 0.0, 0.0];

  const inputDim = 4;
  const xHat = new Array(inputDim).fill(0);

  for (let i = 0; i < inputDim; i++) {
    let sum = b_dec[i];
    for (let j = 0; j < z.length; j++) {
      sum += W_dec[i][j] * z[j];
    }
    xHat[i] = sum;
  }

  return xHat;
}

/**
 * Calcule la perte ELBO (Evidence Lower Bound) = MSE de reconstruction + beta * D_KL.
 * @param {number[]} xNorm - Observation réelle
 * @param {number[]} xHat - Observation reconstruite
 * @param {number[]} mu - Moyenne latente
 * @param {number[]} logVar - Log-variance latente
 * @param {number} [beta=0.15] - Poids de régularisation KL (beta-VAE)
 * @returns {{ elboLoss: number, reconMse: number, klDiv: number, sensorErrors: number[] }}
 */
function computeElboLoss(xNorm, xHat, mu, logVar, beta = 0.15) {
  const d = xNorm.length;
  const sensorErrors = new Array(d);
  let reconMse = 0;

  for (let i = 0; i < d; i++) {
    const err2 = (xNorm[i] - xHat[i]) ** 2;
    sensorErrors[i] = err2;
    reconMse += err2;
  }
  reconMse /= d;

  // D_KL = -0.5 * sum(1 + logVar - mu^2 - exp(logVar))
  let klDiv = 0;
  for (let j = 0; j < mu.length; j++) {
    klDiv += -0.5 * (1.0 + logVar[j] - mu[j] ** 2 - Math.exp(logVar[j]));
  }

  const elboLoss = reconMse + beta * klDiv;
  return { elboLoss, reconMse, klDiv, sensorErrors };
}

/**
 * Générateur Box-Muller normal standard N(0,1).
 */
function sampleStandardNormal() {
  let u1 = 0, u2 = 0;
  while (u1 <= 1e-15) u1 = Math.random();
  while (u2 <= 1e-15) u2 = Math.random();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

/**
 * Exécute le VAE complet sur l'ensemble de la série multivariée de capteurs.
 * @param {number[][]} sensorMatrix - [T x 4] observations temporelles des capteurs
 * @param {number} [thresholdStd=2.5] - Seuil d'anomalie en multiples de sigma
 * @returns {Object}
 */
function runVaeInference(sensorMatrix, thresholdStd = 2.5) {
  const T = sensorMatrix.length;
  const D = sensorMatrix[0].length;

  // 1. Normalisation robuste par capteur (Mean & Std avec protection epsilon)
  const means = new Array(D).fill(0);
  const stds = new Array(D).fill(0);

  for (let j = 0; j < D; j++) {
    let sum = 0;
    for (let t = 0; t < T; t++) sum += sensorMatrix[t][j];
    means[j] = sum / T;

    let sqDiff = 0;
    for (let t = 0; t < T; t++) sqDiff += (sensorMatrix[t][j] - means[j]) ** 2;
    stds[j] = Math.sqrt(sqDiff / (T - 1)) + 1e-9;
  }

  const normalizedMatrix = sensorMatrix.map((row) =>
    row.map((val, j) => (val - means[j]) / stds[j])
  );

  const elboLosses = new Array(T);
  const reconMses = new Array(T);
  const latentEmbeddings = new Array(T);
  const sensorAttributions = new Array(T);
  const reconstructedMatrix = new Array(T);

  for (let t = 0; t < T; t++) {
    const xNorm = normalizedMatrix[t];
    const { mu, logVar, z } = encode(xNorm);
    const xHat = decode(z);
    const { elboLoss, reconMse, sensorErrors } = computeElboLoss(xNorm, xHat, mu, logVar);

    elboLosses[t] = elboLoss;
    reconMses[t] = reconMse;
    latentEmbeddings[t] = z;
    reconstructedMatrix[t] = xHat.map((val, j) => val * stds[j] + means[j]);

    // Attribution relative du défaut par capteur en %
    const sumErr = sensorErrors.reduce((a, b) => a + b, 0) + 1e-12;
    sensorAttributions[t] = sensorErrors.map((err) => (err / sumErr) * 100);
  }

  // 2. Calibration statistique du seuil d'anomalie sur le régime nominal (premier tiers)
  const baselineSize = Math.min(200, Math.floor(T * 0.35));
  const baselineLosses = elboLosses.slice(0, baselineSize);
  const baselineMean = baselineLosses.reduce((a, b) => a + b, 0) / baselineSize;
  const baselineStd = Math.sqrt(
    baselineLosses.reduce((s, v) => s + (v - baselineMean) ** 2, 0) / (baselineSize - 1)
  );

  const anomalyThreshold = baselineMean + thresholdStd * baselineStd;
  const anomalyPredictions = elboLosses.map((l) => (l > anomalyThreshold ? 1 : 0));

  return {
    elboLosses,
    reconMses,
    anomalyThreshold,
    anomalyPredictions,
    latentEmbeddings,
    sensorAttributions,
    reconstructedMatrix,
    means,
    stds,
  };
}

module.exports = {
  encode,
  decode,
  computeElboLoss,
  runVaeInference,
};
