"""Explainable AI (XAI) for Sensor Attribution & Root Cause Isolation."""

import numpy as np
from typing import List, Dict, Any
from maintenance.schemas import SensorAttribution


FAULT_CATALOG = {
    0: {
        "sensor": "Vibration",
        "title": "Dégradation Mécanique des Roulements (Bearing Fatigue)",
        "insight": "Pic spectral et cavitation accélérée sur bague interne du roulement.",
    },
    1: {
        "sensor": "Température",
        "title": "Surchauffe Thermique & Rupture de Film Lubrifiant",
        "insight": "Friction anormale stator/rotor et dégradation viscosité huile.",
    },
    2: {
        "sensor": "Pression",
        "title": "Instabilité Hydraulique & Risque de Cavitation",
        "insight": "Chute brutale de pression différentielle à l'aspiration.",
    },
    3: {
        "sensor": "Débit",
        "title": "Obstruction Partielle du Circuit / Perte de Charge",
        "insight": "Colmatage des filtres amont ou perte d'étanchéité.",
    },
}


def compute_sensor_attributions(
    x_real: np.ndarray, x_recon: np.ndarray, sensor_names: List[str]
) -> List[SensorAttribution]:
    """Computes sensor-wise error attribution: (x_i - x_hat_i)^2 / sum(errors)."""
    squared_errors = np.mean((x_real - x_recon) ** 2, axis=0)
    total_error = float(np.sum(squared_errors) + 1e-12)
    contributions = (squared_errors / total_error) * 100.0

    dominant_idx = int(np.argmax(contributions))
    attributions = []

    for i, name in enumerate(sensor_names):
        is_dom = i == dominant_idx
        catalog_info = FAULT_CATALOG.get(i, {"title": "Anomalie Générique", "insight": "Dérive télémétrique"})
        insight = catalog_info["title"] if is_dom else catalog_info["insight"]

        attributions.append(
            SensorAttribution(
                sensor_name=name,
                contribution_pct=round(float(contributions[i]), 2),
                is_dominant=is_dom,
                diagnostic_insight=insight,
            )
        )

    return attributions
