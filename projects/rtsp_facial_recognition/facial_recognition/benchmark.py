"""Biometric Evaluation (NIST FRVT Standard): ROC, FMR, FNMR and Equal Error Rate (EER)."""

import numpy as np
from typing import Dict, Any, List, Tuple


def evaluate_biometric_roc(
    genuine_scores: np.ndarray, impostor_scores: np.ndarray, target_fmr: float = 1e-4
) -> Dict[str, Any]:
    """Calculates FMR(tau), FNMR(tau), EER and operating threshold calibrated at target FMR."""
    thresholds = np.linspace(0.20, 0.85, 100)
    fmr_list = []
    fnmr_list = []

    n_gen = len(genuine_scores)
    n_imp = len(impostor_scores)

    for tau in thresholds:
        # FMR = fraction of impostors >= tau
        fmr = np.sum(impostor_scores >= tau) / n_imp
        # FNMR = fraction of genuine < tau
        fnmr = np.sum(genuine_scores < tau) / n_gen

        fmr_list.append(fmr)
        fnmr_list.append(fnmr)

    fmr_arr = np.array(fmr_list)
    fnmr_arr = np.array(fnmr_list)

    # 1. Equal Error Rate (EER) where |FMR - FNMR| is minimized
    diff = np.abs(fmr_arr - fnmr_arr)
    eer_idx = int(np.argmin(diff))
    eer = float((fmr_arr[eer_idx] + fnmr_arr[eer_idx]) / 2.0)
    eer_threshold = float(thresholds[eer_idx])

    # 2. Operating point at Target FMR (e.g. 10^-4)
    fmr_diff = np.abs(fmr_arr - target_fmr)
    op_idx = int(np.argmin(fmr_diff))
    calibrated_threshold = float(thresholds[op_idx])
    achieved_tar = float(1.0 - fnmr_arr[op_idx])

    return {
        "equal_error_rate_pct": round(eer * 100, 2),
        "eer_threshold": round(eer_threshold, 3),
        "calibrated_threshold": round(calibrated_threshold, 3),
        "true_accept_rate_at_target_fmr_pct": round(achieved_tar * 100, 2),
        "target_fmr": target_fmr,
    }
