/**
 * FinSight / Computer Vision R&D - Moteur ArcFace (Additive Angular Margin Loss)
 * Projection sur hypersphère S^{d-1} (dimension d=512) et métrique cosinus.
 * L_ArcFace = -log( exp(s * cos(theta_yi + m)) / (exp(s * cos(theta_yi + m)) + sum_{j != yi} exp(s * cos(theta_j))) )
 */

/**
 * Normalise un vecteur embedding sur la sphère unité euclidienne ||z||_2 = 1.
 * @param {number[]} vec
 * @returns {number[]}
 */
function l2Normalize(vec) {
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) + 1e-12;
  return vec.map((v) => v / norm);
}

/**
 * Calcule la similarité cosinus entre deux embeddings normalisés : Sim(u, v) = u . v.
 * @param {number[]} u
 * @param {number[]} v
 * @returns {number}
 */
function cosineSimilarity(u, v) {
  let dot = 0;
  for (let i = 0; i < u.length; i++) {
    dot += u[i] * v[i];
  }
  return Math.max(-1.0, Math.min(1.0, dot));
}

/**
 * Génère un vecteur embedding 512-D synthétique déterministe pour une identité donnée
 * avec un bruit de pose / éclairage simulant la variabilité intra-classe.
 * @param {string} identityId - Identifiant unique
 * @param {number} [variationNoise=0.08] - Bruit intra-classe (pose, expression, occlusion)
 * @param {number} [seed=42]
 * @returns {number[]} Embedding 512-D normalisé
 */
function generateIdentityEmbedding(identityId, variationNoise = 0.08, seed = 42) {
  const dim = 512;
  const raw = new Array(dim);

  // Hash de l'identifiant pour ancrage de classe
  let hash = seed;
  for (let i = 0; i < identityId.length; i++) {
    hash = (hash * 31 + identityId.charCodeAt(i)) % 1000000007;
  }

  for (let i = 0; i < dim; i++) {
    hash = (hash * 9301 + 49297) % 233280;
    const baseVal = Math.sin((hash / 233280) * 2 * Math.PI + i);
    const noise = (Math.random() - 0.5) * variationNoise;
    raw[i] = baseVal + noise;
  }

  return l2Normalize(raw);
}

/**
 * Calcule la perte théorique ArcFace pour une marge angulaire m et échelle s.
 * @param {number} cosineAngle - cos(theta) entre embedding et centre de classe
 * @param {number} [margin=0.50] - Marge angulaire additive en radians (~28.6°)
 * @param {number} [scale=64.0] - Facteur d'échelle sur hypersphère
 * @returns {Object}
 */
function computeArcFaceMargin(cosineAngle, margin = 0.50, scale = 64.0) {
  const theta = Math.acos(Math.max(-0.9999, Math.min(0.9999, cosineAngle)));
  const thetaWithMargin = theta + margin;

  // cos(theta + m) = cos(theta)*cos(m) - sin(theta)*sin(m)
  const targetCosine = Math.cos(thetaWithMargin);
  const angularDistanceDeg = Math.round((theta * (180 / Math.PI)) * 10) / 10;
  const penalizedCosine = Math.round(targetCosine * 10000) / 10000;

  return {
    rawCosine: Math.round(cosineAngle * 10000) / 10000,
    penalizedCosine,
    angularDistanceDeg,
    marginDeg: Math.round((margin * (180 / Math.PI)) * 10) / 10,
    scale,
  };
}

module.exports = {
  l2Normalize,
  cosineSimilarity,
  generateIdentityEmbedding,
  computeArcFaceMargin,
};
