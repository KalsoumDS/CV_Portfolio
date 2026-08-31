"""Strict Pydantic schemas for IoT telemetry validation and MLOps contracts."""

from enum import Enum
from typing import List, Dict, Optional
from pydantic import BaseModel, Field


class EquipmentType(str, Enum):
    PUMP = "pump"
    MOTOR = "motor"
    COMPRESSOR = "compressor"


class OperationalSeverity(str, Enum):
    NOMINAL = "NOMINAL"
    PREVENTIVE_ALERT = "PREVENTIVE_ALERT"
    CRITICAL_WARNING = "CRITICAL_WARNING"


class TelemetryConfig(BaseModel):
    equipment_type: EquipmentType = EquipmentType.PUMP
    sampling_rate_hz: float = Field(default=1.0, gt=0)
    window_size: int = Field(default=128, ge=16)
    threshold_sigma: float = Field(default=2.5, ge=1.0, le=5.0)
    conformal_confidence: float = Field(default=0.95, ge=0.80, le=0.999)


class AnomalyMetrics(BaseModel):
    health_index_pct: float
    elbo_loss_max: float
    anomaly_threshold: float
    precision_pct: float
    recall_pct: float
    f1_pct: float
    lead_time_minutes: float
    operational_status: str
    severity: OperationalSeverity
    root_cause_fault: str
    dominant_sensor: str


class RulPrediction(BaseModel):
    estimated_rul_minutes: float
    confidence_coverage_pct: float
    rul_lower_bound_minutes: float
    rul_upper_bound_minutes: float
    conformal_margin_minutes: float
    degradation_slope: float


class SensorAttribution(BaseModel):
    sensor_name: str
    contribution_pct: float
    is_dominant: bool
    diagnostic_insight: str
