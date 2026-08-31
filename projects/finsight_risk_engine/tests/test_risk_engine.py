"""Unit & Mathematical Consistency Tests for FinSight Quantitative Risk Engine."""

import numpy as np
import pytest
from finsight.schemas import PortfolioConfig, RiskModelType, StressScenarioType
from finsight.stats import compute_higher_moments, cornish_fisher_quantile, cholesky_correlated_shocks
from finsight.garch import GARCH11
from finsight.risk import QuantitativeRiskEngine
from finsight.backtest import kupiec_pof_test, basel_traffic_light
from finsight.stress import apply_stress_scenario
from finsight.portfolio import calculate_efficient_frontier


@pytest.fixture
def sample_market_data():
    np.random.seed(42)
    T = 504
    N = 4
    # Simulation de rendements corrélés avec asymétrie
    means = np.array([0.0008, 0.0007, 0.0006, 0.0012])
    cov = np.array([
        [0.0004, 0.0002, 0.00015, 0.00025],
        [0.0002, 0.00035, 0.00018, 0.00022],
        [0.00015, 0.00018, 0.00038, 0.00020],
        [0.00025, 0.00022, 0.00020, 0.00080],
    ])
    returns = np.random.multivariate_normal(means, cov, size=T)
    tickers = ["AAPL", "MSFT", "GOOGL", "NVDA"]
    return returns, tickers


def test_cornish_fisher_monotonicity():
    """VaR should increase with confidence level (alpha decreases)."""
    skew = -0.4
    kurt = 1.8
    q90 = cornish_fisher_quantile(0.10, skew, kurt)
    q95 = cornish_fisher_quantile(0.05, skew, kurt)
    q99 = cornish_fisher_quantile(0.01, skew, kurt)

    assert q90 > q95 > q99, "Quantile cornish-fisher non monotone par rapport au niveau alpha."


def test_garch11_fitting(sample_market_data):
    """GARCH(1,1) must satisfy stationarity: alpha + beta < 1."""
    returns, _ = sample_market_data
    port_returns = np.mean(returns, axis=1)

    model = GARCH11().fit(port_returns)
    assert 0.0 < model.alpha < 0.35
    assert 0.5 < model.beta < 0.99
    assert model.persistence < 1.0, "La persistance GARCH doit être strictement inférieure à 1 (stationnarité)."

    term_structure = model.forecast_term_structure(30)
    assert len(term_structure) == 30
    assert np.all(term_structure > 0), "La volatilité prévisionnelle doit être strictement positive."


def test_euler_risk_decomposition(sample_market_data):
    """Euler Theorem: sum of component VaRs must equal total portfolio VaR."""
    returns, tickers = sample_market_data
    weights = np.array([0.25, 0.25, 0.25, 0.25])
    config = PortfolioConfig(tickers=tickers, notional=100000.0, confidence=0.95)
    engine = QuantitativeRiskEngine(config)

    port_returns = returns @ weights
    risk_dict = engine.compute_parametric_risk(port_returns)
    total_var = risk_dict["var_pct"]

    decomposition = engine.decompose_euler_risk(returns, weights, total_var)
    sum_components = sum(c.component_var for c in decomposition)

    assert pytest.approx(sum_components, rel=1e-3) == total_var, "La décomposition d'Euler viole la conservation du risque."


def test_kupiec_pof_validation():
    """Kupiec POF test should reject bad models and accept calibrated ones."""
    # 5 exceptions on 250 days with alpha=0.05 (expected 12.5) -> Acceptable
    res_calibrated = kupiec_pof_test(violations=12, total_observations=250, confidence=0.95)
    assert not res_calibrated["rejected"]
    assert res_calibrated["p_value"] > 0.05

    # 45 exceptions on 250 days -> Critical failure -> Rejected
    res_failed = kupiec_pof_test(violations=45, total_observations=250, confidence=0.95)
    assert res_failed["rejected"]
    assert res_failed["p_value"] < 0.001


def test_markowitz_efficient_frontier(sample_market_data):
    """Max Sharpe portfolio must have a Sharpe ratio higher or equal to GMV."""
    returns, tickers = sample_market_data
    opt = calculate_efficient_frontier(returns, tickers, risk_free_rate=0.035)

    max_sharpe = opt["max_sharpe_portfolio"]["sharpe_ratio"]
    gmv_sharpe = opt["min_variance_portfolio"]["sharpe_ratio"]

    assert max_sharpe >= gmv_sharpe - 1e-4
    assert len(opt["frontier_curve"]) > 10
