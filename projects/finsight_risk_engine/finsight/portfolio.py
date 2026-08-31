"""Modern Portfolio Theory & Markowitz Efficient Frontier Optimization."""

import numpy as np
from typing import List, Dict, Any, Tuple


def calculate_efficient_frontier(
    returns_matrix: np.ndarray, tickers: List[str], risk_free_rate: float = 0.035, num_points: int = 40
) -> Dict[str, Any]:
    """Calculates Tangency (Max Sharpe) portfolio, Global Minimum Variance, and Frontier Curve."""
    N = len(tickers)
    annual_means = np.mean(returns_matrix, axis=0) * 252.0
    annual_cov = np.cov(returns_matrix, rowvar=False) * 252.0

    inv_cov = np.linalg.pinv(annual_cov)
    ones = np.ones(N)

    # 1. Global Minimum Variance (GMV)
    w_gmv_raw = inv_cov @ ones / (ones.T @ inv_cov @ ones)
    w_gmv = np.maximum(0, w_gmv_raw)
    w_gmv /= np.sum(w_gmv)

    gmv_ret = float(w_gmv @ annual_means)
    gmv_vol = float(np.sqrt(w_gmv @ annual_cov @ w_gmv))
    gmv_sharpe = (gmv_ret - risk_free_rate) / max(1e-12, gmv_vol)

    # 2. Tangency Portfolio (Max Sharpe)
    excess_means = annual_means - risk_free_rate
    w_tan_raw = inv_cov @ excess_means / max(1e-12, ones.T @ inv_cov @ excess_means)
    w_tan = np.maximum(0, w_tan_raw)
    w_tan /= np.sum(w_tan)

    tan_ret = float(w_tan @ annual_means)
    tan_vol = float(np.sqrt(w_tan @ annual_cov @ w_tan))
    tan_sharpe = (tan_ret - risk_free_rate) / max(1e-12, tan_vol)

    # 3. Frontier points
    A = float(ones.T @ inv_cov @ annual_means)
    B = float(annual_means.T @ inv_cov @ annual_means)
    C = float(ones.T @ inv_cov @ ones)
    D = B * C - A * A

    target_returns = np.linspace(gmv_ret * 0.95, max(annual_means) * 1.15, num_points)
    frontier_curve = []

    for r in target_returns:
        var_target = (C * (r**2) - 2.0 * A * r + B) / max(1e-12, D) if D > 0 else 0.04
        vol = float(np.sqrt(max(1e-12, var_target)))
        frontier_curve.append({
            "expected_return_pct": round(float(r * 100), 2),
            "volatility_pct": round(float(vol * 100), 2),
            "sharpe_ratio": round(float((r - risk_free_rate) / vol), 2),
        })

    return {
        "max_sharpe_portfolio": {
            "return_pct": round(tan_ret * 100, 2),
            "volatility_pct": round(tan_vol * 100, 2),
            "sharpe_ratio": round(tan_sharpe, 2),
            "weights": {tickers[i]: round(float(w_tan[i] * 100), 2) for i in range(N)},
        },
        "min_variance_portfolio": {
            "return_pct": round(gmv_ret * 100, 2),
            "volatility_pct": round(gmv_vol * 100, 2),
            "sharpe_ratio": round(gmv_sharpe, 2),
            "weights": {tickers[i]: round(float(w_gmv[i] * 100), 2) for i in range(N)},
        },
        "frontier_curve": frontier_curve,
    }
