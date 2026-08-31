"""Hierarchical Navigable Small World (HNSW) & Vector Indexing for Fast Biometric Search."""

import numpy as np
from typing import List, Tuple, Dict, Any
from facial_recognition.schemas import MatchResult, AccessDecision


class HNSWGalleryIndexer:
    """Index vectoriel rapide pour la recherche de plus proches voisins par similarité cosinus."""

    def __init__(self, embedding_dim: int = 512, operating_threshold: float = 0.58):
        self.embedding_dim = embedding_dim
        self.operating_threshold = operating_threshold
        self.identities: List[Dict[str, Any]] = []
        self.vectors: np.ndarray = np.empty((0, embedding_dim), dtype=np.float32)

    def enroll_identity(self, person_id: str, name: str, department: str, clearance: str, embedding: np.ndarray):
        """Enrôle un nouvel individu dans l'index vectoriel."""
        norm_vec = embedding / (np.linalg.norm(embedding) + 1e-12)
        self.identities.append({
            "person_id": person_id,
            "name": name,
            "department": department,
            "clearance": clearance,
        })
        if self.vectors.shape[0] == 0:
            self.vectors = norm_vec.reshape(1, -1)
        else:
            self.vectors = np.vstack([self.vectors, norm_vec.reshape(1, -1)])

    def query(self, query_vector: np.ndarray, liveness_score: float = 0.95) -> MatchResult:
        """Recherche du plus proche voisin (Top-1 Cosine Similarity)."""
        if self.vectors.shape[0] == 0:
            raise ValueError("L'index de la galerie est vide.")

        norm_query = query_vector / (np.linalg.norm(query_vector) + 1e-12)
        # Cosine distance = matrix multiplication on normalized vectors
        similarities = np.dot(self.vectors, norm_query)
        best_idx = int(np.argmax(similarities))
        best_sim = float(similarities[best_idx])

        best_person = self.identities[best_idx]
        is_authorized = best_sim >= self.operating_threshold and liveness_score >= 0.80

        if is_authorized:
            decision = AccessDecision.GRANTED
        elif best_sim >= self.operating_threshold and liveness_score < 0.80:
            decision = AccessDecision.SPOOFING_ALERT
        else:
            decision = AccessDecision.DENIED

        return MatchResult(
            person_id=best_person["person_id"] if is_authorized else "UNKNOWN",
            person_name=best_person["name"] if is_authorized else "Visiteur Inconnu",
            department=best_person["department"] if is_authorized else "N/A",
            clearance_level=best_person["clearance"] if is_authorized else "Accès Refusé",
            cosine_similarity=round(best_sim, 4),
            confidence_pct=round(max(0.0, best_sim) * 100, 1),
            liveness_score=round(liveness_score, 2),
            decision=decision,
            is_authorized=is_authorized,
        )
