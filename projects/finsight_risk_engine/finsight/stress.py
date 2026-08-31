"""Macro-Economic Stress-Testing Engine & Historical Crash Replay."""

from typing import List, Dict, Any
from finsight.schemas import StressScenarioResult, StressScenarioType


SCENARIO_CONFIGS = {
    StressScenarioType.LEHMAN_2008: {
        "name": "Crise Financière Mondiale (2008 - Lehman)",
        "equity_shock": -0.42,
        "tech_multiplier": 1.10,
        "vol_multiplier": 2.5,
    },
    StressScenarioType.COVID_2020: {
        "name": "Choc Pandémique (Fév-Mars 2020)",
        "equity_shock": -0.34,
        "tech_multiplier": 0.85,
        "vol_multiplier": 3.2,
    },
    StressScenarioType.STAGFLATION_2022: {
        "name": "Choc Inflation & Taux (2022)",
        "equity_shock": -0.25,
        "tech_multiplier": 1.40,
        "vol_multiplier": 1.6,
    },
    StressScenarioType.GEOPOLITICAL_ENERGY: {
        "name": "Choc Énergie & Géopolitique",
        "equity_shock": -0.18,
        "tech_multiplier": 1.20,
        "vol_multiplier": 1.8,
    },
}


def apply_stress_scenario(
    tickers: List[str], weights: List[float], notional: float, scenario_type: StressScenarioType
) -> StressScenarioResult:
    """Applies macro stress shock across assets."""
    cfg = SCENARIO_CONFIGS.get(scenario_type, SCENARIO_CONFIGS[StressScenarioType.LEHMAN_2008])
    base_shock = cfg["equity_shock"]
    tech_mult = cfg["tech_multiplier"]

    asset_impacts = []
    portfolio_loss_pct = 0.0

    for i, ticker in enumerate(tickers):
        t_upper = ticker.upper()
        sensitivity = 1.0
        if any(tech in t_upper for tech in ["AAPL", "MSFT", "GOOGL", "NVDA", "AMZN", "META", "TSLA"]):
            sensitivity = 1.25 * tech_mult
        elif any(defensive in t_upper for defensive in ["JNJ", "PG", "KO"]):
            sensitivity = 0.65

        asset_shock = base_shock * sensitivity
        loss = weights[i] * notional * asset_shock
        portfolio_loss_pct += weights[i] * asset_shock

        asset_impacts.append({
            "ticker": ticker,
            "weight_pct": round(weights[i] * 100, 2),
            "sensitivity": round(sensitivity, 2),
            "shock_pct": round(asset_shock * 100, 2),
            "loss_amount": round(loss, 2),
        })

    stressed_value = max(0.0, notional * (1.0 + portfolio_loss_pct))
    total_loss = notional - stressed_value
    resilience_score = max(0, min(100, int(100 + portfolio_loss_pct * 100)))

    return StressScenarioResult(
        scenario_id=scenario_type.value,
        scenario_name=cfg["name"],
        portfolio_loss_pct=round(portfolio_loss_pct * 100, 2),
        loss_amount=round(total_loss, 2),
        residual_value=round(stressed_value, 2),
        resilience_score=resilience_score,
        asset_impacts=asset_impacts,
    )
