"""FinSight - Enterprise Streamlit & Plotly Quantitative Dashboard."""

import streamlit as st
import numpy as np
import plotly.graph_objects as go
from finsight.schemas import PortfolioConfig, StressScenarioType
from finsight.risk import QuantitativeRiskEngine
from finsight.garch import GARCH11
from finsight.backtest import kupiec_pof_test, basel_traffic_light
from finsight.stress import apply_stress_scenario
from finsight.portfolio import calculate_efficient_frontier

st.set_page_config(
    page_title="FinSight — Quantitative Risk Engine",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.title("📈 FinSight — Stress-Testing & Risque Quantitatif (R&D Grade)")
st.markdown(
    "Moteur institutionnel d'analyse de risque de marché : expansion de Cornish-Fisher, GARCH(1,1), Copules t-Student, décomposition d'Euler et conformité Bâle."
)

# Sidebar
st.sidebar.header("⚙️ Configuration Portefeuille")
tickers_input = st.sidebar.text_input("Tickers (séparés par virgule)", "AAPL, MSFT, GOOGL, NVDA")
notional = st.sidebar.number_input("Valeur du portefeuille ($)", min_value=10000.0, value=100000.0, step=10000.0)
horizon_years = st.sidebar.selectbox("Horizon d'analyse", [1, 2, 3], index=1)
confidence = st.sidebar.selectbox("Niveau de confiance VaR", [0.90, 0.95, 0.975, 0.99], index=1)
scenario = st.sidebar.selectbox(
    "Scénario de Stress Macro",
    [
        StressScenarioType.LEHMAN_2008,
        StressScenarioType.COVID_2020,
        StressScenarioType.STAGFLATION_2022,
        StressScenarioType.GEOPOLITICAL_ENERGY,
    ],
    format_func=lambda s: s.value.replace("_", " ").upper(),
)

# Ingestion / Simulation de données
tickers = [t.strip().upper() for t in tickers_input.split(",") if t.strip()]
N = len(tickers)
T = horizon_years * 252

np.random.seed(42)
means = np.linspace(0.0006, 0.0012, N)
cov = np.full((N, N), 0.0002)
np.fill_diagonal(cov, 0.00045)
returns_matrix = np.random.multivariate_normal(means, cov, size=T)
weights = np.ones(N) / N

config = PortfolioConfig(tickers=tickers, notional=notional, confidence=confidence)
engine = QuantitativeRiskEngine(config)

port_returns = returns_matrix @ weights
risk_results = engine.compute_parametric_risk(port_returns)
mc_results = engine.compute_monte_carlo_risk(returns_matrix, weights)
euler_decomp = engine.decompose_euler_risk(returns_matrix, weights, risk_results["var_pct"])
garch_model = GARCH11().fit(port_returns)
stress_result = apply_stress_scenario(tickers, weights.tolist(), notional, scenario)
opt_result = calculate_efficient_frontier(returns_matrix, tickers)

# Metrics Grid
c1, c2, c3, c4 = st.columns(4)
c1.metric(f"VaR 1J ({int(confidence*100)}%)", f"{risk_results['var_pct']*100:.2f}%", f"${risk_results['var_amount']:,.0f}")
c2.metric("Expected Shortfall (CVaR)", f"{risk_results['cvar_pct']*100:.2f}%", f"${risk_results['cvar_amount']:,.0f}")
c3.metric("Volatilité GARCH(1,1)", f"{garch_model.conditional_volatilities[-1]*np.sqrt(252)*100:.1f}%", f"Persistance: {garch_model.persistence:.3f}")
c4.metric("Score Résilience Stress", f"{stress_result.resilience_score}/100", f"Choc: {stress_result.portfolio_loss_pct:.1f}%")

# Onglets
tab1, tab2, tab3, tab4 = st.tabs(["📊 Distribution & Queues Épaisses", "🧩 Décomposition d'Euler", "⚡ Stress-Testing Macro", "🎯 Frontière Efficiente"])

with tab1:
    fig_dist = go.Figure()
    fig_dist.add_trace(go.Histogram(x=mc_results["simulated_returns"] * 100, nbinsx=60, name="Simulations t-Student", marker_color="#bda178"))
    fig_dist.add_vline(x=-risk_results["var_pct"] * 100, line_dash="dash", line_color="#e8b14b", annotation_text=f"VaR {int(confidence*100)}%")
    fig_dist.add_vline(x=-risk_results["cvar_pct"] * 100, line_color="#c97b5a", annotation_text="CVaR (Expected Shortfall)")
    fig_dist.update_layout(template="plotly_dark", title="Distribution des Pertes Monte Carlo avec Queues Épaisses", xaxis_title="Rendement Journalier (%)", yaxis_title="Fréquence")
    st.plotly_chart(fig_dist, use_container_width=True)

with tab2:
    st.subheader("Attribution du Risque de Portefeuille (Euler)")
    st.dataframe([c.model_dump() for c in euler_decomp], use_container_width=True)

with tab3:
    st.subheader(f"Impact du Scénario : {stress_result.scenario_name}")
    st.markdown(f"**Perte totale estimée :** `${stress_result.loss_amount:,.2f}` (`{stress_result.portfolio_loss_pct:.2f}%`)")
    st.dataframe(stress_result.asset_impacts, use_container_width=True)

with tab4:
    fig_front = go.Figure()
    fc = opt_result["frontier_curve"]
    fig_front.add_trace(go.Scatter(x=[p["volatility_pct"] for p in fc], y=[p["expected_return_pct"] for p in fc], mode="lines", name="Frontière Efficiente", line=dict(color="#e8b14b", width=3)))
    ms = opt_result["max_sharpe_portfolio"]
    fig_front.add_trace(go.Scatter(x=[ms["volatility_pct"]], y=[ms["return_pct"]], mode="markers", name=f"Max Sharpe ({ms['sharpe_ratio']})", marker=dict(size=12, color="#22c55e", symbol="star")))
    fig_front.update_layout(template="plotly_dark", title="Frontière Efficiente de Markowitz (Mean-Variance)", xaxis_title="Volatilité Annualisée (%)", yaxis_title="Rendement Espéré (%)")
    st.plotly_chart(fig_front, use_container_width=True)
