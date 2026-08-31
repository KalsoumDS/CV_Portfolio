"""Dynamic Volatility Modeling via GARCH(1,1) with Quasi-Maximum Likelihood."""

import numpy as np
from scipy.optimize import minimize
from typing import Dict, Any, Tuple


class GARCH11:
    def __init__(self):
        self.omega: float = 0.0
        self.alpha: float = 0.08
        self.beta: float = 0.90
        self.persistence: float = 0.98
        self.sample_variance: float = 0.0
        self.conditional_volatilities: np.ndarray = np.array([])

    def fit(self, returns: np.ndarray) -> "GARCH11":
        """Fits GARCH(1,1) via variance targeting:

        sigma_t^2 = V_L * (1 - alpha - beta) + alpha * eps_{t-1}^2 + beta * sigma_{t-1}^2
        """
        mu = np.mean(returns)
        centered = returns - mu
        self.sample_variance = float(np.var(centered, ddof=1))
        T = len(centered)

        def neg_log_likelihood(params: np.ndarray) -> float:
            alpha, beta = params
            persist = alpha + beta
            if alpha <= 0.0001 or beta <= 0.0001 or persist >= 0.9999:
                return 1e9

            omega = self.sample_variance * (1.0 - persist)
            sigma2 = np.zeros(T)
            sigma2[0] = self.sample_variance

            nll = 0.0
            for t in range(1, T):
                s2 = omega + alpha * (centered[t - 1] ** 2) + beta * sigma2[t - 1]
                sigma2[t] = max(1e-12, s2)
                nll += 0.5 * (np.log(sigma2[t]) + (centered[t] ** 2) / sigma2[t])

            return float(nll)

        res = minimize(
            neg_log_likelihood,
            x0=np.array([0.08, 0.90]),
            bounds=[(0.001, 0.30), (0.50, 0.99)],
            method="L-BFGS-B",
        )

        self.alpha = float(res.x[0])
        self.beta = float(res.x[1])
        self.persistence = self.alpha + self.beta
        self.omega = self.sample_variance * (1.0 - self.persistence)

        # Calcul de la série complète des variances conditionnelles
        sigma2 = np.zeros(T)
        sigma2[0] = self.sample_variance
        for t in range(1, T):
            sigma2[t] = self.omega + self.alpha * (centered[t - 1] ** 2) + self.beta * sigma2[t - 1]

        self.conditional_volatilities = np.sqrt(np.maximum(1e-12, sigma2))
        return self

    def forecast_term_structure(self, horizon_days: int = 30) -> np.ndarray:
        """Forecasts forward term structure:

        E[sigma_{t+k}^2] = V_L + (alpha + beta)^k * (sigma_t^2 - V_L)
        """
        current_s2 = self.conditional_volatilities[-1] ** 2
        v_long_term = self.omega / (1.0 - self.persistence)
        forecasts = np.zeros(horizon_days)

        for k in range(1, horizon_days + 1):
            s2_k = v_long_term + (self.persistence**k) * (current_s2 - v_long_term)
            forecasts[k - 1] = np.sqrt(max(1e-12, s2_k))

        return forecasts
