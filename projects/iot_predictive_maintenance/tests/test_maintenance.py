"""Unit & Mathematical Tests for Industrial IoT Predictive Maintenance Engine."""

import torch
import numpy as np
import pytest
from maintenance.vae import TemporalVAE
from maintenance.conformal_rul import ConformalRulEstimator
from maintenance.xai import compute_sensor_attributions
from maintenance.schemas import TelemetryConfig, EquipmentType


def test_vae_elbo_loss_positivity():
    """ELBO Loss must be strictly positive."""
    model = TemporalVAE(input_dim=4, latent_dim=2, beta=0.15)
    x = torch.randn(32, 4)

    x_recon, mu, logvar, z = model(x)
    loss_dict = model.loss_function(x, x_recon, mu, logvar)

    assert loss_dict["elbo_loss"].item() > 0, "La perte ELBO doit être positive."
    assert loss_dict["recon_mse"].item() >= 0, "La MSE de reconstruction doit être positive."
    assert loss_dict["kl_div"].item() >= 0, "La divergence KL doit être positive (distance aux priors)."


def test_conformal_rul_bounds_monotonicity():
    """RUL lower bound must be <= estimated RUL <= upper bound."""
    estimator = ConformalRulEstimator(confidence=0.95)
    losses = np.linspace(0.1, 2.5, 100)
    threshold = 1.0

    prediction = estimator.predict_rul_with_bounds(losses, threshold)

    assert prediction.rul_lower_bound_minutes <= prediction.estimated_rul_minutes
    assert prediction.estimated_rul_minutes <= prediction.rul_upper_bound_minutes
    assert prediction.conformal_margin_minutes > 0


def test_sensor_attribution_normalization():
    """Sum of percentage sensor attributions must equal 100%."""
    x_real = np.random.randn(50, 4)
    x_recon = x_real + np.array([0.5, 0.1, 0.05, 0.02])
    sensor_names = ["Vibration", "Temperature", "Pressure", "Flow"]

    attributions = compute_sensor_attributions(x_real, x_recon, sensor_names)
    total_pct = sum(a.contribution_pct for a in attributions)

    assert pytest.approx(total_pct, rel=1e-2) == 100.0
    assert attributions[0].is_dominant, "Le premier capteur avec le plus grand résidu doit être identifié comme dominant."
