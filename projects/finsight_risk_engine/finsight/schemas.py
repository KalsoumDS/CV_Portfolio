"""Strict Pydantic schemas for data validation and contract enforcement."""

from enum import Enum
from typing import List, Dict, Optional
from pydantic import BaseModel, Field, field_validator


class RiskModelType(str, Enum):
    CORNISH_FISHER = "cornish_fisher"
    GAUSSIAN = "gaussian"
    HISTORICAL_FHS = "historical"
    MONTE_CARLO = "monte_carlo"


class StressScenarioType(str, Enum):
    LEHMAN_2008 = "lehman_2008"
    COVID_2020 = "covid_2020"
    STAGFLATION_2022 = "stagflation_2022"
    GEOPOLITICAL_ENERGY = "geopolitical_energy"


class BaselZone(str, Enum):
    GREEN = "GREEN"
    YELLOW = "YELLOW"
    RED = "RED"


class PortfolioConfig(BaseModel):
    tickers: List[str] = Field(default_factory=lambda: ["AAPL", "MSFT", "GOOGL", "NVDA"])
    weights: Optional[List[float]] = None
    notional: float = Field(default=100000.0, gt=0)
    confidence: float = Field(default=0.95, ge=0.80, le=0.999)
    horizon_days: int = Field(default=1, ge=1, le=252)
    risk_free_rate: float = Field(default=0.035, ge=0.0)

    @field_validator("tickers")
    @classmethod
    def validate_tickers(cls, v: List[str]) -> List[str]:
        cleaned = [t.strip().upper() for t in v if t.strip()]
        if not cleaned:
            raise ValueError("Le portefeuille doit contenir au moins un ticker valide.")
        return cleaned


class RiskMetrics(BaseModel):
    var_pct: float
    var_amount: float
    cvar_pct: float
    cvar_amount: float
    annualized_return_pct: float
    annualized_vol_pct: float
    sharpe_ratio: float
    sortino_ratio: float
    max_drawdown_pct: float
    calmar_ratio: float
    beta_vs_benchmark: float
    skewness: float
    excess_kurtosis: float
    kupiec_p_value: float
    kupiec_decision: str
    basel_zone: BaselZone
    garch_vol_annual_pct: float
    garch_half_life_days: float


class ComponentRisk(BaseModel):
    ticker: str
    weight_pct: float
    beta_to_portfolio: float
    marginal_var: float
    component_var: float
    risk_contribution_pct: float


class StressScenarioResult(BaseModel):
    scenario_id: str
    scenario_name: str
    portfolio_loss_pct: float
    loss_amount: float
    residual_value: float
    resilience_score: int
    asset_impacts: List[Dict[str, float]]
