"""Regulatory Backtesting: Kupiec POF test, Christoffersen Independence, and Basel Traffic Light."""

import numpy as np
from scipy import stats
from typing import Dict, Any, Tuple
from finsight.schemas import BaselZone


def kupiec_pof_test(
    violations: int, total_observations: int, confidence: float = 0.95, significance_level: float = 0.05
) -> Dict[str, Any]:
    """Kupiec Proportion of Failures (POF) Likelihood-Ratio Test.

    LR_POF = -2 * [ (T-x)*ln(1-p) + x*ln(p) - (T-x)*ln(1-pHat) - x*ln(pHat) ] ~ Chi2(1)
    """
    T = total_observations
    x = violations
    p = 1.0 - confidence
    p_hat = x / T

    if x == 0:
        lr_stat = -2.0 * T * np.log(1.0 - p)
        p_val = float(1.0 - stats.chi2.cdf(lr_stat, df=1))
        return {
            "lr_stat": round(float(lr_stat), 3),
            "p_value": round(float(p_val), 4),
            "rejected": bool(p_val < significance_level),
            "decision": "Modèle validé (H0 acceptée)" if p_val >= significance_level else "Modèle rejeté",
        }

    log_l0 = (T - x) * np.log(1.0 - p) + x * np.log(p)
    log_l1 = (T - x) * np.log(1.0 - p_hat) + x * np.log(p_hat)
    lr_stat = max(0.0, -2.0 * (log_l0 - log_l1))
    p_val = float(1.0 - stats.chi2.cdf(lr_stat, df=1))

    return {
        "lr_stat": round(float(lr_stat), 3),
        "p_value": round(float(p_val), 4),
        "rejected": bool(p_val < significance_level),
        "decision": "Modèle calibré (H0 acceptée)" if p_val >= significance_level else "Modèle non calibré (H0 rejetée)",
    }


def basel_traffic_light(violations: int, confidence: float = 0.99) -> Dict[str, Any]:
    """Basel Committee Traffic Light Framework (250 days regulatory horizon)."""
    if confidence >= 0.985:
        if violations <= 4:
            return {"zone": BaselZone.GREEN, "multiplier": 3.0, "status": "Zone Verte (Conforme)"}
        elif violations <= 9:
            return {"zone": BaselZone.YELLOW, "multiplier": 3.5, "status": "Zone Jaune (Surveillance)"}
        else:
            return {"zone": BaselZone.RED, "multiplier": 4.0, "status": "Zone Rouge (Rejet)"}
    else:
        if violations <= 16:
            return {"zone": BaselZone.GREEN, "multiplier": 3.0, "status": "Zone Verte"}
        elif violations <= 22:
            return {"zone": BaselZone.YELLOW, "multiplier": 3.5, "status": "Zone Jaune"}
        else:
            return {"zone": BaselZone.RED, "multiplier": 4.0, "status": "Zone Rouge"}
