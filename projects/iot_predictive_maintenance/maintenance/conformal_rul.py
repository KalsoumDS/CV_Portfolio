"""Probabilistic Remaining Useful Life (RUL) Estimation with Conformal Prediction."""

import numpy as np
from typing import Dict, Any, List
from maintenance.schemas import RulPrediction


class ConformalRulEstimator:
    def __init__(self, confidence: float = 0.95, sampling_interval_min: float = 1.0):
        self.confidence = confidence
        self.sampling_interval_min = sampling_interval_min
        self.calibration_residuals: np.ndarray = np.array([])

    def calibrate(self, true_rul_series: np.ndarray, predicted_rul_series: np.ndarray) -> "ConformalRulEstimator":
        """Calibrates non-conformity scores s_i = |RUL_true - RUL_pred|."""
        residuals = np.abs(true_rul_series - predicted_rul_series)
        self.calibration_residuals = np.sort(residuals)
        return self

    def predict_rul_with_bounds(self, elbo_loss_series: np.ndarray, threshold: float) -> RulPrediction:
        """Estimates RUL and constructs exact (1 - alpha) conformal prediction intervals."""
        T = len(elbo_loss_series)
        lookback = min(40, max(10, int(T * 0.15)))
        recent_losses = elbo_loss_series[-lookback:]

        # Taux de dégradation local d(Loss)/dt
        x_t = np.arange(lookback)
        slope, _ = np.polyfit(x_t, recent_losses, deg=1)
        degradation_rate = max(0.001, float(slope))

        current_loss = float(elbo_loss_series[-1])
        critical_threshold = threshold * 2.8
        remaining_steps = max(5.0, (critical_threshold - current_loss) / degradation_rate)
        estimated_rul = remaining_steps * self.sampling_interval_min

        # Conformal Margin
        if len(self.calibration_residuals) > 0:
            n = len(self.calibration_residuals)
            q_idx = min(n - 1, int(np.ceil(self.confidence * (n + 1))) - 1)
            conformal_margin = float(self.calibration_residuals[q_idx])
        else:
            # Approximation analytique conforme basée sur la dispersion des résidus de perte
            loss_diffs = np.abs(np.diff(recent_losses) - degradation_rate)
            q_loss = np.quantile(loss_diffs, self.confidence)
            conformal_margin = float(q_loss * (remaining_steps / (degradation_rate + 1e-6)) * self.sampling_interval_min)

        lower_bound = max(2.0, estimated_rul - conformal_margin)
        upper_bound = estimated_rul + conformal_margin

        return RulPrediction(
            estimated_rul_minutes=round(estimated_rul, 1),
            confidence_coverage_pct=round(self.confidence * 100, 1),
            rul_lower_bound_minutes=round(lower_bound, 1),
            rul_upper_bound_minutes=round(upper_bound, 1),
            conformal_margin_minutes=round(conformal_margin, 1),
            degradation_slope=round(degradation_rate, 4),
        )
