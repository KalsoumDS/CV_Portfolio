"""Statistical & Mathematical Foundations for FinSight."""

import numpy as np
from scipy import stats
from typing import Tuple, Dict


def compute_higher_moments(returns: np.ndarray) -> Dict[str, float]:
    """Calculates mean, standard deviation, unbiased skewness, and excess kurtosis."""
    mu = float(np.mean(returns))
    sigma = float(np.std(returns, ddof=1))
    skew = float(stats.skew(returns, bias=False))
    kurt = float(stats.kurtosis(returns, bias=False))  # Excess kurtosis (Fisher, normal=0)
    return {"mean": mu, "std": sigma, "skewness": skew, "excess_kurtosis": kurt}


def cornish_fisher_quantile(alpha: float, skewness: float, excess_kurtosis: float) -> float:
    """Calculates Cornish-Fisher adjusted quantile for alpha level.

    z_CF = z + (z^2 - 1)*S/6 + (z^3 - 3z)*K/24 - (2z^3 - 5z)*S^2/36
    """
    z = stats.norm.ppf(alpha)
    z2 = z**2
    z3 = z2 * z

    term_skew1 = ((z2 - 1.0) * skewness) / 6.0
    term_kurt = ((z3 - 3.0 * z) * excess_kurtosis) / 24.0
    term_skew2 = ((2.0 * z3 - 5.0 * z) * (skewness**2)) / 36.0

    return float(z + term_skew1 + term_kurt - term_skew2)


def cholesky_correlated_shocks(
    corr_matrix: np.ndarray, num_scenarios: int, degrees_of_freedom: int = 5
) -> np.ndarray:
    """Generates multivariate Student-t shocks with fat tails and correlation structure."""
    N = corr_matrix.shape[0]
    # Matrice triangulaire inférieure de Cholesky
    L = np.linalg.cholesky(corr_matrix)

    # Tirages indépendants Student-t
    u = np.random.standard_t(df=degrees_of_freedom, size=(num_scenarios, N))

    # Application de la corrélation : shocks = u @ L^T
    correlated_shocks = u @ L.T
    return correlated_shocks
