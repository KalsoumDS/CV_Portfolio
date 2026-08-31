"""Strict Pydantic schemas for RTSP computer vision streams and biometric validation."""

from enum import Enum
from typing import List, Dict, Tuple, Optional
from pydantic import BaseModel, Field


class CameraProtocol(str, Enum):
    RTSP = "rtsp"
    WEBRTC = "webrtc"
    MJPEG = "mjpeg"


class AccessDecision(str, Enum):
    GRANTED = "ACCÈS AUTORISÉ"
    DENIED = "ACCÈS REFUSÉ"
    SPOOFING_ALERT = "ALERTE USURPATION (LIVENESS)"


class CameraConfig(BaseModel):
    camera_id: str
    rtsp_url: str
    location: str
    fps_target: int = Field(default=30, ge=15, le=60)
    resolution: Tuple[int, int] = (1920, 1080)


class DetectionBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    confidence: float = Field(ge=0.0, le=1.0)
    landmarks_5pts: List[Tuple[int, int]]


class FacialEmbedding(BaseModel):
    embedding_dim: int = 512
    vector: List[float]
    l2_norm: float = 1.0


class MatchResult(BaseModel):
    person_id: str
    person_name: str
    department: str
    clearance_level: str
    cosine_similarity: float
    confidence_pct: float
    liveness_score: float
    decision: AccessDecision
    is_authorized: bool


class PipelineMetrics(BaseModel):
    capture_latency_ms: float
    detection_latency_ms: float
    alignment_latency_ms: float
    embedding_latency_ms: float
    vector_search_latency_ms: float
    total_latency_ms: float
    fps_actual: float
