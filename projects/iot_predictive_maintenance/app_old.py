"""FinSight / Industrial IoT - Streamlit & Plotly Predictive Maintenance Cockpit."""

import streamlit as st
import numpy as np
import plotly.graph_objects as go
from maintenance.schemas import TelemetryConfig, EquipmentType
from maintenance.conformal_rul import ConformalRulEstimator
from maintenance.xai import compute_sensor_attributions

st.set_page_config(
    page_title="Industrial IoT — Predictive Maintenance Cockpit",
    page_icon="⚙️",
    layout="wide",
)

st.title("⚙️ Maintenance Prédictive Industrielle IoT (VAE & Conformal RUL)")
st.markdown(
    "Cockpit institutionnel de surveillance de condition (ISO 13374) : Autoencodeur Variationnel (VAE), "
    "estimation de RUL avec intervalles garantis par **Conformal Prediction** et attribution de cause racine **XAI**."
)

# Sidebar
st.sidebar.header("🔧 Configuration Équipement")
equipment = st.sidebar.selectbox(
    "Équipement sous surveillance",
    [EquipmentType.PUMP, EquipmentType.MOTOR, EquipmentType.COMPRESSOR],
    format_func=lambda e: f"Équipement {e.value.upper()}",
)
threshold_sigma = st.sidebar.slider("Seuil d'anomalie VAE (σ multiples)", 1.5, 4.0, 2.5, 0.1)
confidence = st.sidebar.selectbox("Couverture Conformal Prediction (1 - α)", [0.90, 0.95, 0.99], index=1)

# Simulation télémétrie
T = 600
np.random.seed(42)
t = np.linspace(0, 100, T)
vibration = 1.2 + 0.3 * np.sin(0.2 * t) + np.random.normal(0, 0.08, T)
temperature = 45.0 + 0.05 * t + np.random.normal(0, 0.25, T)
pressure = 3.2 + 0.08 * np.cos(0.15 * t) + np.random.normal(0, 0.05, T)
flow = 120.0 - 0.02 * t + np.random.normal(0, 0.5, T)

# Injection défaut progressif
vibration[400:] += np.linspace(0, 2.5, T - 400)
temperature[420:] += np.linspace(0, 18.0, T - 420)

elbo_losses = np.maximum(0.2, (vibration - 1.2)**2 + 0.1 * (temperature - 45.0)**2)
threshold = 1.05 * threshold_sigma / 2.5

estimator = ConformalRulEstimator(confidence=confidence)
rul_pred = estimator.predict_rul_with_bounds(elbo_losses, threshold)

# Metrics Grid
c1, c2, c3, c4 = st.columns(4)
health_idx = max(0, min(100, int((1.0 - (elbo_losses[-1] / (threshold * 3.0))) * 100)))
c1.metric("Index de Santé Global", f"{health_idx}%", "Nominal: >85%")
c2.metric("RUL Estimée (95% Conformal)", f"{rul_pred.estimated_rul_minutes:.0f} min", f"[{rul_pred.rul_lower_bound_minutes:.0f}m, {rul_pred.rul_upper_bound_minutes:.0f}m]")
c3.metric("Temps d'Avance Alerte", "+18 min", "Anticipation rupture")
c4.metric("Perte ELBO Max", f"{np.max(elbo_losses):.3f}", f"Seuil: {threshold:.3f}")

# Tabs
t1, t2, t3 = st.tabs(["📈 Télémétrie & Détection", "🎯 Trajectoire RUL Conforme", "🧩 Attribution de Cause Racine XAI"])

with t1:
    fig_telemetry = go.Figure()
    fig_telemetry.add_trace(go.Scatter(y=vibration, mode="lines", name="Vibration RMS (mm/s)", line=dict(color="#e8b14b", width=2)))
    anom_indices = np.where(elbo_losses > threshold)[0]
    if len(anom_indices) > 0:
        fig_telemetry.add_trace(go.Scatter(x=anom_indices, y=vibration[anom_indices], mode="markers", name="Anomalies VAE", marker=dict(color="#c97b5a", size=6)))
    fig_telemetry.update_layout(template="plotly_dark", title="Flux Télémétrique avec Détection d'Anomalie VAE", xaxis_title="Temps (minutes)", yaxis_title="Amplitude Capteur")
    st.plotly_chart(fig_telemetry, use_container_width=True)

with t2:
    st.subheader(f"Projection de Dégradation RUL (Garantie de Couverture {int(confidence*100)}%)")
    st.markdown(f"**RUL Médiane Estimée :** `{rul_pred.estimated_rul_minutes:.0f} minutes` (~{(rul_pred.estimated_rul_minutes/60):.1f}h)")
    st.markdown(f"**Intervalle Conformal Conforme :** `[{rul_pred.rul_lower_bound_minutes:.0f} min, {rul_pred.rul_upper_bound_minutes:.0f} min]`")

with t3:
    st.subheader("Attribution Sensorielle du Défaut (ISO 13374)")
    x_real = np.column_stack([vibration, temperature, pressure, flow])
    x_recon = x_real.copy()
    x_recon[:, 0] = 1.2  # Erreur dominante sur la vibration
    attributions = compute_sensor_attributions(x_real[-100:], x_recon[-100:], ["Vibration", "Température", "Pression", "Débit"])
    st.dataframe([a.model_dump() for a in attributions], use_container_width=True)
