"""RTSP Multi-Camera Facial Recognition Pipeline with ArcFace SOTA (Enterprise R&D Grade)."""

from facial_recognition.schemas import (
    CameraConfig,
    DetectionBox,
    FacialEmbedding,
    MatchResult,
    PipelineMetrics,
)
from facial_recognition.arcface import ArcFaceLoss, ResNetFaceBackbone
from facial_recognition.hnsw_indexer import HNSWGalleryIndexer
from facial_recognition.benchmark import evaluate_biometric_roc

__version__ = "2.0.0"
__all__ = [
    "CameraConfig",
    "DetectionBox",
    "FacialEmbedding",
    "MatchResult",
    "PipelineMetrics",
    "ArcFaceLoss",
    "ResNetFaceBackbone",
    "HNSWGalleryIndexer",
    "evaluate_biometric_roc",
]
