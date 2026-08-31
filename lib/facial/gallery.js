/**
 * FinSight / Computer Vision R&D - Indexation Vectorielle & Matching Galerie
 * Base de données des identités enrôlées et recherche du plus proche voisin (Nearest Neighbor Cosinus).
 */

const { generateIdentityEmbedding, cosineSimilarity } = require('./arcface');

const ENROLLED_IDENTITIES = [
  { id: 'EMP-001', name: 'Dr. Sarah Alami', department: 'R&D Computer Vision', clearance: 'Niveau 3 (Total)' },
  { id: 'EMP-002', name: 'Marc Berrada', department: 'MLOps & Infrastructure', clearance: 'Niveau 3 (Total)' },
  { id: 'EMP-003', name: 'Amina Mansour', department: 'Embedded IoT & Edge', clearance: 'Niveau 2 (Bâtiment B)' },
  { id: 'EMP-004', name: 'Thomas Leroy', department: 'Direction Technique', clearance: 'Niveau 3 (Total)' },
  { id: 'EMP-005', name: 'Youssef Chraibi', department: 'Contrôle Qualité IA', clearance: 'Niveau 2 (Bâtiment B)' },
  { id: 'EMP-006', name: 'Inès Benali', department: 'Cybersécurité & Données', clearance: 'Niveau 3 (Total)' },
  { id: 'EMP-007', name: 'Karim Tazi', department: 'Opérations Usine', clearance: 'Niveau 1 (Visiteur VIP)' },
];

// Initialisation des embeddings de la galerie
const GALLERY_INDEX = ENROLLED_IDENTITIES.map((person) => ({
  ...person,
  embedding: generateIdentityEmbedding(person.id, 0.0), // Centre de classe pur
}));

/**
 * Recherche l'identité la plus proche dans la galerie vectorielle.
 * @param {number[]} queryEmbedding - Embedding 512-D de la requête
 * @param {number} [threshold=0.58] - Seuil opérationnel calibré
 * @param {number} [livenessScore=0.96] - Score d'anti-usurpation (0 à 1)
 * @returns {Object}
 */
function matchGallery(queryEmbedding, threshold = 0.58, livenessScore = 0.96) {
  let bestMatch = null;
  let bestScore = -1.0;

  for (const entry of GALLERY_INDEX) {
    const sim = cosineSimilarity(queryEmbedding, entry.embedding);
    if (sim > bestScore) {
      bestScore = sim;
      bestMatch = entry;
    }
  }

  const isAuthorized = bestScore >= threshold && livenessScore >= 0.80;
  const confidencePct = Math.round(Math.max(0, bestScore) * 1000) / 10;
  const livenessPct = Math.round(livenessScore * 1000) / 10;

  return {
    matchedIdentity: isAuthorized ? bestMatch.name : (bestScore >= threshold ? 'Refusé (Liveness Échoué)' : 'Inconnu (Non Autorisé)'),
    personId: isAuthorized ? bestMatch.id : 'N/A',
    department: isAuthorized ? bestMatch.department : 'N/A',
    clearance: isAuthorized ? bestMatch.clearance : 'Accès Refusé',
    cosineSimilarity: Math.round(bestScore * 10000) / 10000,
    confidencePct,
    livenessPct,
    isAuthorized,
    decisionStatus: isAuthorized ? 'ACCÈS AUTORISÉ' : 'ACCÈS REFUSÉ',
    statusColor: isAuthorized ? '#22c55e' : '#ef4444',
  };
}

module.exports = {
  ENROLLED_IDENTITIES,
  GALLERY_INDEX,
  matchGallery,
};
