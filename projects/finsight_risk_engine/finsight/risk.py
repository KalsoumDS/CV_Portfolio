"""Quantitative Risk Engine: VaR, CVaR, Monte Carlo Copulas & Euler Risk Attribution."""

import numpy as np
from typing import Dict, List, Any
from finsight.schemas import PortfolioConfig, RiskMetrics, ComponentRisk, BaselZone
from finsight.stats import compute_higher_moments, cornish_fisher_quantile, cholesky_correlated_shocks
from finsight.garch import GARCH11


class QuantitativeRiskEngine:
    def __init__(self, config: PortfolioConfig):
        self.config = config

    def compute_parametric_risk(self, portfolio_returns: np.ndarray) -> Dict[str, float]:
        """Cornish-Fisher expansion VaR & CVaR."""
        moments = compute_higher_moments(portfolio_returns)
        alpha = 1.0 - self.config.confidence
        sqrt_t = np.sqrt(self.config.horizon_days)

        z_cf = cornish_fisher_quantile(alpha, moments["skewness"], moments["excess_kurtosis"])
        var_pct = -(moments["mean"] * self.config.horizon_days + z_cf * moments["std"] * sqrt_t)

        # Expected Shortfall avec ajustement de queue épaisse
        kurt_adj = max(0.0, moments["excess_kurtosis"] / 18.0)
        cvar_pct = var_pct * (1.0 + (moments["skewness"] ** 2) / 12.0 + kurt_adj)

        return {
            "var_pct": max(0.0, float(var_pct)),
            "var_amount": max(0.0, float(var_pct * self.config.notional)),
            "cvar_pct": max(0.0, float(cvar_pct)),
            "cvar_amount": max(0.0, float(cvar_pct * self.config.notional)),
            "skewness": moments["skewness"],
            "excess_kurtosis": moments["excess_kurtosis"],
        }

    def compute_monte_carlo_risk(
        self, returns_matrix: np.ndarray, weights: np.ndarray, num_scenarios: int = 10000
    ) -> Dict[str, Any]:
        """Monte Carlo with Student-t Copula."""
        corr = np.corrcoef(returns_matrix, rowvar=False)
        stds = np.std(returns_matrix, axis=0, ddof=1)
        means = np.mean(returns_matrix, axis=0)

        shocks = cholesky_correlated_shocks(corr, num_scenarios, degrees_of_freedom=5)
        simulated_returns = np.zeros(num_scenarios)

        sqrt_t = np.sqrt(self.config.horizon_days)
        for i in range(len(weights)):
            asset_sim = (
                means[i] * self.config.horizon_days + stds[i] * sqrt_t * shocks[:, i]
            )
            simulated_returns += weights[i] * asset_sim

        alpha = 1.0 - self.config.confidence
        simulated_returns.sort()
        idx = max(0, int(alpha * num_scenarios))
        var_mc = -simulated_returns[idx]
        cvar_mc = -float(np.mean(simulated_returns[: idx + 1]))

        return {
            "var_pct": max(0.0, float(var_mc)),
            "var_amount": max(0.0, float(var_mc * self.config.notional)),
            "cvar_pct": max(0.0, float(cvar_mc)),
            "cvar_amount": max(0.0, float(cvar_mc * self.config.notional)),
            "simulated_returns": simulated_returns,
        }

    def decompose_euler_risk(
        self, returns_matrix: np.ndarray, weights: np.ndarray, total_var: float
    ) -> List[ComponentRisk]:
        """Decomposes portfolio risk via Euler Theorem: Sum(w_i * Marginal_VaR_i) = Total_VaR."""
        cov = np.cov(returns_matrix, rowvar=False)
        port_var = float(weights @ cov @ weights)

        decomposition = []
        marginal_vars = []

        for i in range(len(weights)):
            cov_i_p = float(np.sum(cov[i, :] * weights))
            beta_i = cov_i_p / max(1e-12, port_var)
            m_var = beta_i * total_var
            c_var = weights[i] * m_var
            marginal_vars.append(c_var)

            decomposition.append({
                "ticker": self.config.tickers[i],
                "weight_pct": round(float(weights[i] * 100), 2),
                "beta_to_portfolio": round(float(beta_i), 3),
                "marginal_var": round(float(m_var), 4),
                "component_var": round(float(c_var), 4),
                "risk_contribution_pct": 0.0,
            })

        sum_cvar = sum(marginal_vars)
        for item in decomposition:
            item["risk_contribution_pct"] = round(
                float((item["component_var"] / max(1e-12, sum_cvar)) * 100), 2
            )

        return [ComponentRisk(**d) for d in decomposition]
