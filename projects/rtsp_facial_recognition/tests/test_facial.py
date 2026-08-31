"""Unit & Mathematical Tests for RTSP Facial Recognition and ArcFace Loss."""

import torch
import numpy as np
import pytest
from facial_recognition.arcface import ArcFaceLoss, ResNetFaceBackbone
from facial_recognition.hnsw_indexer import HNSWGalleryIndexer
from facial_recognition.benchmark import evaluate_biometric_roc
from facial_recognition.schemas import AccessDecision


def test_embedding_l2_normalization():
    """Output embeddings from ResNetFaceBackbone must have exact unit L2 norm ||z||_2 = 1.0."""
    model = ResNetFaceBackbone(embedding_dim=512)
    x = torch.randn(4, 3, 112, 112)
    embeddings = model(x)

    norms = torch.norm(embeddings, p=2, dim=1)
    for n in norms:
        assert pytest.approx(n.item(), rel=1e-4) == 1.0


def test_arcface_loss_computation():
    """ArcFace loss must be strictly positive and penalize angles appropriately."""
    loss_fn = ArcFaceLoss(in_features=512, out_features=10, scale=64.0, margin=0.50)
    embeddings = torch.randn(8, 512)
    labels = torch.randint(0, 10, (8,))

    loss = loss_fn(embeddings, labels)
    assert loss.item() > 0.0
    assert not torch.isnan(loss)


def test_hnsw_indexer_matching():
    """Gallery matching must return correct identity and granted access if cosine similarity is high."""
    indexer = HNSWGalleryIndexer(embedding_dim=512, operating_threshold=0.58)

    emb_sarah = np.random.randn(512).astype(np.float32)
    emb_sarah /= np.linalg.norm(emb_sarah)

    indexer.enroll_identity("EMP-001", "Dr. Sarah Alami", "R&D", "Niveau 3", emb_sarah)

    # Requête avec léger bruit
    query_vec = emb_sarah + np.random.normal(0, 0.05, 512).astype(np.float32)
    query_vec /= np.linalg.norm(query_vec)

    result = indexer.query(query_vec, liveness_score=0.96)
    assert result.person_name == "Dr. Sarah Alami"
    assert result.is_authorized is True
    assert result.decision == AccessDecision.GRANTED
    assert result.cosine_similarity > 0.85
