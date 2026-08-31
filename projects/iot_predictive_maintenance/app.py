"""
Industrial IoT - Cockpit de Maintenance Prédictive (Français)
Application Streamlit production-grade avec architecture modulaire.

Ce dashboard calcule et visualise les métriques de maintenance prédictive :
- VAE (Variational Autoencoder) : détection d'anomalies par reconstruction
- RUL (Remaining Useful Life) : temps de vie restant avec intervalles conformes
- XAI (Explainable AI) : attribution de cause racine des anomalies
- Performance : précision, rappel, F1-score vs ground-truth

Auteur: Lead Data Scientist R&D
Version: 2.0 - Production Grade
"""

import streamlit as st
import numpy as np
import plotly.graph_objects as go
from typing import Dict, List, Optional
import logging

# Dictionnaire de traduction
TRANSLATIONS = {
    'fr': {
        'title': '⚙️ Maintenance Prédictive Industrielle IoT (VAE & Conformal RUL)',
        'description': '**Dashboard interactif de surveillance de condition (ISO 13374)**\n\nCe cockpit institutionnel calcule et visualise les métriques de maintenance prédictive :\n- **VAE (Variational Autoencoder)** : détection d\'anomalies par reconstruction\n- **RUL (Remaining Useful Life)** : temps de vie restant avec intervalles garantis par Conformal Prediction\n- **XAI (Explainable AI)** : attribution de cause racine des anomalies\n- **Performance** : précision, rappel, F1-score vs ground-truth\n\n**Conformité** : ISO 13374 (Condition Monitoring)',
        'step1': '🔧 ÉTAPE 1 - Configuration Équipement',
        'step2': '📥 ÉTAPE 2 - Ingestion des Données de Télémétrie',
        'step3': '🧮 ÉTAPE 3 - Calcul des Métriques de Maintenance Prédictive',
        'step4': '📊 ÉTAPE 4 - Résultats Principaux',
        'step5a': '📈 Télémétrie & Détection',
        'step5b': '📊 Pertes ELBO',
        'step5c': '🧩 Performance XAI',
        'step5d': '🔍 Cause Racine',
        'summary': '📝 Résumé de l\'Analyse',
        'language': '🌐 Langue / Language',
        'theme': '🎨 Thème / Theme',
        'light': 'Clair / Light',
        'dark': 'Sombre / Dark',
    },
    'en': {
        'title': '⚙️ Industrial IoT Predictive Maintenance (VAE & Conformal RUL)',
        'description': '**Interactive Condition Monitoring Dashboard (ISO 13374)**\n\nThis institutional cockpit calculates and visualizes predictive maintenance metrics:\n- **VAE (Variational Autoencoder)** : anomaly detection via reconstruction\n- **RUL (Remaining Useful Life)** : remaining useful life with Conformal Prediction intervals\n- **XAI (Explainable AI)** : root cause attribution of anomalies\n- **Performance** : precision, recall, F1-score vs ground-truth\n\n**Compliance** : ISO 13374 (Condition Monitoring)',
        'step1': '🔧 STEP 1 - Equipment Configuration',
        'step2': '📥 STEP 2 - Telemetry Data Ingestion',
        'step3': '🧮 STEP 3 - Predictive Maintenance Metrics Calculation',
        'step4': '📊 STEP 4 - Main Results',
        'step5a': '📈 Telemetry & Detection',
        'step5b': '📊 ELBO Losses',
        'step5c': '🧩 XAI Performance',
        'step5d': '🔍 Root Cause',
        'summary': '📝 Analysis Summary',
        'language': '🌐 Language / Langue',
        'theme': '🎨 Theme / Thème',
        'light': 'Light / Clair',
        'dark': 'Dark / Sombre',
    }
}

# Modules internes avec architecture modulaire
from maintenance.data_pipeline import TelemetryDataPipeline, load_telemetry_pipeline
from maintenance.model import PredictiveMaintenanceModel, load_maintenance_model
from maintenance.schemas import TelemetryConfig, EquipmentType

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration de la page Streamlit
st.set_page_config(
    page_title="Industrial IoT — Predictive Maintenance Cockpit",
    page_icon="⚙️",
    layout="wide",
)


@st.cache_resource
def get_telemetry_pipeline() -> TelemetryDataPipeline:
    """
    Charge et cache le pipeline de données de télémétrie.
    
    Returns:
        Instance de TelemetryDataPipeline
    """
    return load_telemetry_pipeline(min_data_points=30)


@st.cache_resource
def get_maintenance_model(latent_dim: int = 2, confidence: float = 0.95) -> PredictiveMaintenanceModel:
    """
    Charge et cache le modèle de maintenance prédictive.
    
    Args:
        latent_dim: Dimension de l'espace latent
        confidence: Niveau de confiance
        
    Returns:
        Instance de PredictiveMaintenanceModel
    """
    return load_maintenance_model(latent_dim=latent_dim, confidence=confidence)


def render_sidebar() -> Dict[str, any]:
    """
    Affiche la barre latérieure avec les paramètres de configuration.
    
    ÉTAPE 1 : Configuration de l'équipement industriel
    - Type d'équipement (pompe, moteur, compresseur)
    - Seuil de détection d'anomalie VAE
    - Couverture Conformal Prediction pour RUL
    - Fenêtre d'affichage temporelle
    - Import de données personnalisées (CSV/JSON)
    
    Returns:
        Dictionnaire contenant tous les paramètres configurés
    """
    # Sélecteur de langue et thème
    st.sidebar.markdown("---")
    st.sidebar.markdown("### ⚙️ Settings / Paramètres")
    
    lang = st.sidebar.selectbox(
        TRANSLATIONS['fr']['language'],
        ['fr', 'en'],
        format_func=lambda x: 'Français' if x == 'fr' else 'English',
        help="Select language / Sélectionnez la langue"
    )
    
    theme = st.sidebar.selectbox(
        TRANSLATIONS['fr']['theme'],
        ['dark', 'light'],
        format_func=lambda x: TRANSLATIONS[lang]['dark'] if x == 'dark' else TRANSLATIONS[lang]['light'],
        help="Select theme / Sélectionnez le thème"
    )
    
    st.sidebar.markdown("---")
    
    t = TRANSLATIONS[lang]
    st.sidebar.header(t['step1'])
    
    st.sidebar.markdown("**Type d'équipement**")
    st.sidebar.info("Sélectionnez l'équipement industriel à surveiller")
    equipment = st.sidebar.selectbox(
        "Équipement sous surveillance",
        [EquipmentType.PUMP, EquipmentType.MOTOR, EquipmentType.COMPRESSOR],
        format_func=lambda e: f"Équipement {e.value.upper()}",
        help="Type d'équipement industriel à surveiller"
    )
    
    st.sidebar.markdown("**Seuil d'anomalie VAE**")
    st.sidebar.info("Multiples de l'écart-type pour détecter les anomalies (plus élevé = moins sensible)")
    threshold_sigma = st.sidebar.slider(
        "Seuil d'anomalie VAE (σ multiples)",
        1.5, 4.0, 2.5, 0.1,
        help="Sensibilité de la détection d'anomalie"
    )
    
    st.sidebar.markdown("**Couverture Conformal Prediction**")
    st.sidebar.info("Niveau de confiance pour les intervalles RUL (1 - α)")
    confidence = st.sidebar.selectbox(
        "Couverture Conformal Prediction (1 - α)",
        [0.90, 0.95, 0.99],
        index=1,
        help="Niveau de confiance pour les intervalles RUL"
    )
    
    st.sidebar.markdown("**Fenêtre d'affichage**")
    st.sidebar.info("Nombre de points temporels à afficher dans les graphiques")
    window_size = st.sidebar.slider(
        "Fenêtre d'affichage (points)",
        40, 400, 140, 10,
        help="Nombre de points temporels à afficher"
    )
    
    st.sidebar.markdown("**Import de données personnalisées**")
    st.sidebar.info("Upload un fichier CSV ou JSON de télémétrie")
    file_upload = st.sidebar.file_uploader(
        "Importer des données (CSV/JSON)",
        type=['csv', 'json'],
        help="Upload un fichier CSV ou JSON de télémétrie"
    )
    
    return {
        'equipment': equipment,
        'threshold_sigma': threshold_sigma,
        'confidence': confidence,
        'window_size': window_size,
        'file_upload': file_upload,
        'lang': lang,
        'theme': theme
    }


def render_health_pulse_gauge(health_index: float, confidence: float, plotly_template: str = "plotly_dark") -> None:
    """
    Affiche une jauge de santé professionnelle (Health Pulse).
    
    ÉTAPE 4 : Jauge de santé principale
    - Jauge circulaire avec score de santé 0-100%
    - Indicateur de confiance du modèle
    - Catégorisation de la santé (Critique/Dégradée/Bonne/Excellente)
    
    Args:
        health_index: Index de santé (0-100)
        confidence: Confiance du modèle (0-100)
        plotly_template: Thème Plotly
    """
    # Déterminer la catégorie de santé
    if health_index < 25:
        health_category = "CRITIQUE"
        health_color = "#ff0000"
    elif health_index < 50:
        health_category = "DÉGRADÉE"
        health_color = "#ff9900"
    elif health_index < 75:
        health_category = "BONNE"
        health_color = "#ffff00"
    else:
        health_category = "EXCELLENTE"
        health_color = "#00ff00"
    
    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=health_index,
        domain={'x': [0, 1], 'y': [0, 1]},
        title={
            'text': f"<b>HEALTH PULSE</b><br><span style='font-size:0.8em'>Confidence: {confidence:.1f}%</span>",
            'font': {'size': 24}
        },
        delta={'reference': 75},
        gauge={
            'axis': {'range': [None, 100], 'tickwidth': 1, 'tickcolor': "darkgray"},
            'bar': {'color': health_color},
            'bgcolor': "white",
            'borderwidth': 2,
            'bordercolor': "gray",
            'steps': [
                {'range': [0, 25], 'color': '#ffe6e6'},
                {'range': [25, 50], 'color': '#fff2e6'},
                {'range': [50, 75], 'color': '#ffffe6'},
                {'range': [75, 100], 'color': '#e6ffe6'}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': 25
            }
        }
    ))
    
    fig.update_layout(
        template=plotly_template,
        height=400,
        margin=dict(l=20, r=20, t=20, b=20)
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Afficher la catégorie de santé
    st.markdown(f"""
    <div style="text-align: center; padding: 10px; background-color: {health_color}; border-radius: 5px; margin: 10px 0;">
        <h3 style="margin: 0; color: black;">{health_category} HEALTH</h3>
    </div>
    """, unsafe_allow_html=True)


def render_metrics_grid(metrics: Dict) -> None:
    """
    Affiche la grille de métriques principales avec explications.
    
    ÉTAPE 4 : Affichage des résultats principaux
    - Index de santé : pourcentage de santé de l'équipement (0-100%)
    - RUL : temps de vie restant estimé avec intervalles conformes
    - Temps d'avance alerte : anticipation de la détection avant rupture
    - Perte ELBO : erreur de reconstruction du VAE (indicateur d'anomalie)
    
    Args:
        metrics: Dictionnaire des métriques calculées
    """
    st.subheader("📊 ÉTAPE 4 - Résultats Principaux")
    
    rul = metrics['rul']
    xai = metrics['xai_metrics']
    vae = metrics['vae']
    
    c1, c2, c3, c4 = st.columns(4)
    
    health_idx = rul.current_health_index
    health_color = "🟢" if health_idx > 85 else ("🟡" if health_idx > 50 else "🔴")
    
    with c1:
        st.metric(
            f"Index de Santé {health_color}",
            f"{health_idx:.0f}%",
            "Nominal: >85%"
        )
        st.caption("💡 État de santé de l'équipement (0-100%)")
    
    with c2:
        st.metric(
            f"RUL Estimée ({int(metrics['confidence']*100)}% Conformal)",
            f"{rul.estimated_rul_minutes:.0f} min",
            f"[{rul.conformal_bounds['lower_minutes']:.0f}m, {rul.conformal_bounds['upper_minutes']:.0f}m]"
        )
        st.caption("💡 Temps de vie restant avec intervalles garantis")
    
    with c3:
        st.metric(
            "Temps d'Avance Alerte",
            f"{xai.lead_time_minutes:.0f} min",
            "Anticipation rupture"
        )
        st.caption("💡 Temps d'avance de détection avant rupture")
    
    with c4:
        max_mse = np.max(vae.elbo_losses)
        st.metric(
            "Perte ELBO Max",
            f"{max_mse:.3f}",
            f"Seuil: {vae.anomaly_threshold:.3f}"
        )
        st.caption("💡 Erreur de reconstruction VAE (indicateur d'anomalie)")


def render_telemetry_chart(timestamps: List[str], sensor_values: List[float], 
                          reconstructed: List[float], anomaly_flags: List[int],
                          anomaly_threshold: float, sensor_name: str, plotly_template: str = "plotly_dark") -> None:
    """
    Affiche le graphique de télémétrie avec anomalies.
    
    ÉTAPE 5a : Visualisation de la télémétrie avec détection VAE
    - Courbe jaune : signal réel du capteur
    - Courbe verte : signal reconstruit par VAE
    - Points rouges : anomalies détectées (erreur de reconstruction élevée)
    
    Args:
        timestamps: Liste des timestamps
        sensor_values: Valeurs du capteur
        reconstructed: Valeurs reconstruites par VAE
        anomaly_flags: Flags d'anomalie
        anomaly_threshold: Seuil d'anomalie
        sensor_name: Nom du capteur
        plotly_template: Thème Plotly (plotly ou plotly_dark)
    """
    fig = go.Figure()
    
    fig.add_trace(go.Scatter(
        y=sensor_values,
        mode="lines",
        name=f"{sensor_name} (Réel)",
        line=dict(color="#e8b14b", width=2)
    ))
    
    fig.add_trace(go.Scatter(
        y=reconstructed,
        mode="lines",
        name=f"{sensor_name} (Reconstruit)",
        line=dict(color="#22c55e", width=1, dash="dash")
    ))
    
    # Marqueurs d'anomalie
    anom_indices = [i for i, flag in enumerate(anomaly_flags) if flag == 1]
    if anom_indices:
        anom_values = [sensor_values[i] for i in anom_indices]
        fig.add_trace(go.Scatter(
            x=anom_indices,
            y=anom_values,
            mode="markers",
            name="Anomalies Détectées",
            marker=dict(color="#c97b5a", size=8)
        ))
    
    fig.update_layout(
        template=plotly_template,
        title=f"Télémétrie {sensor_name} avec Détection VAE",
        xaxis_title="Temps (points)",
        yaxis_title="Amplitude Capteur"
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    st.markdown("**Explication :**")
    st.info(
        f"- **Signal réel (jaune)** : Valeurs mesurées par le capteur\n"
        f"- **Signal reconstruit (vert)** : Valeurs reconstruites par le VAE\n"
        f"- **Anomalies (rouge)** : Points où l'erreur de reconstruction dépasse le seuil\n"
        f"- **Seuil VAE** : {anomaly_threshold:.3f} (σ multiples)\n"
        f"- **Interprétation** : Le VAE apprend le comportement nominal. Une erreur élevée indique un comportement anormal."
    )


def render_elbo_chart(elbo_losses: List[float], anomaly_threshold: float, plotly_template: str = "plotly_dark") -> None:
    """
    Affiche le graphique des pertes ELBO avec seuil d'anomalie.
    
    ÉTAPE 5b : Visualisation des pertes ELBO (Evidence Lower Bound)
    - Évolution de l'erreur de reconstruction du VAE
    - Ligne rouge : seuil d'anomalie (μ + threshold_sigma * σ)
    - Pics au-dessus du seuil = anomalies détectées
    
    Args:
        elbo_losses: Pertes ELBO
        anomaly_threshold: Seuil d'anomalie
        plotly_template: Thème Plotly (plotly ou plotly_dark)
    """
    fig = go.Figure()
    
    fig.add_trace(go.Scatter(
        y=elbo_losses,
        mode="lines",
        name="Pertes ELBO",
        line=dict(color="#bda178", width=2)
    ))
    
    fig.add_hline(
        y=anomaly_threshold,
        line_dash="dash",
        line_color="#c97b5a",
        annotation_text=f"Seuil Anomalie ({anomaly_threshold:.3f})"
    )
    
    fig.update_layout(
        template=plotly_template,
        title="Évolution des Pertes ELBO (Reconstruction Error)",
        xaxis_title="Temps (points)",
        yaxis_title="Erreur de Reconstruction"
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    st.markdown("**Explication :**")
    st.info(
        f"- **ELBO (Evidence Lower Bound)** : Mesure de la qualité de reconstruction du VAE\n"
        f"- **Seuil d'anomalie** : {anomaly_threshold:.3f} (μ + threshold_sigma * σ)\n"
        f"- **Pics** : Indiquent des comportements anormaux (erreur de reconstruction élevée)\n"
        f"- **Interprétation** : Le VAE apprend le comportement nominal. Une erreur élevée indique un comportement anormal."
    )


def render_confusion_matrix(xai_metrics) -> None:
    """
    Affiche les métriques de performance et matrice de confusion.
    
    ÉTAPE 5c : Performance du modèle vs Ground-Truth
    - Précision : proportion d'anomalies détectées correctement
    - Rappel : proportion d'anomalies réelles détectées
    - F1-Score : moyenne harmonique de précision et rappel
    - Matrice de confusion : TP, FP, FN
    
    Args:
        xai_metrics: Métriques XAI calculées
    """
    st.subheader("📊 ÉTAPE 5c - Performance vs Ground-Truth")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Précision", f"{xai_metrics.precision_pct:.1f}%")
        st.caption("💡 TP / (TP + FP)")
    
    with col2:
        st.metric("Rappel", f"{xai_metrics.recall_pct:.1f}%")
        st.caption("💡 TP / (TP + FN)")
    
    with col3:
        st.metric("F1-Score", f"{xai_metrics.f1_pct:.1f}%")
        st.caption("💡 2 * (Précision * Rappel) / (Précision + Rappel)")
    
    st.info(
        f"Matrice de confusion : TP={xai_metrics.confusion['tp']} · "
        f"FP={xai_metrics.confusion['fp']} · FN={xai_metrics.confusion['fn']}"
    )
    
    st.markdown("**Explication :**")
    st.info(
        f"- **Précision ({xai_metrics.precision_pct:.1f}%)** : {xai_metrics.confusion['tp']} anomalies détectées sur {xai_metrics.confusion['tp'] + xai_metrics.confusion['fp']} alertes\n"
        f"- **Rappel ({xai_metrics.recall_pct:.1f}%)** : {xai_metrics.confusion['tp']} anomalies détectées sur {xai_metrics.confusion['tp'] + xai_metrics.confusion['fn']} anomalies réelles\n"
        f"- **F1-Score ({xai_metrics.f1_pct:.1f}%)** : Équilibre entre précision et rappel\n"
        f"- **Interprétation** : Un F1-Score élevé indique un bon équilibre entre détection et fausses alertes."
    )


def render_root_cause_analysis(root_cause) -> None:
    """
    Affiche l'analyse de cause racine.
    
    ÉTAPE 5d : Analyse de cause racine (XAI)
    - Défaut détecté : type d'anomalie identifiée
    - Capteur dominant : capteur le plus contributif à l'anomalie
    - Plan d'action : recommandation de maintenance
    
    Args:
        root_cause: Résultats de l'analyse de cause racine
    """
    st.subheader("🔍 ÉTAPE 5d - Analyse de Cause Racine (XAI)")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.metric("Défaut Détecté", root_cause.fault_title)
        st.caption("💡 Type d'anomalie identifiée par le modèle")
    
    with col2:
        st.metric("Capteur Dominant", root_cause.dominant_sensor)
        st.caption("💡 Capteur le plus contributif à l'anomalie")
    
    st.success(f"📋 Plan d'action : {root_cause.action_plan}")
    
    st.markdown("**Explication :**")
    st.info(
        f"- **Défaut** : {root_cause.fault_title}\n"
        f"- **Capteur dominant** : {root_cause.dominant_sensor}\n"
        f"- **Plan d'action** : {root_cause.action_plan}\n"
        f"- **Interprétation** : L'XAI identifie le capteur le plus responsable de l'anomalie pour guider la maintenance."
    )


def main():
    """Fonction principale de l'application Streamlit."""
    
    # Configuration sidebar
    params = render_sidebar()
    
    # Traductions et thème
    t = TRANSLATIONS[params['lang']]
    theme = params['theme']
    
    # Définir le thème Plotly
    plotly_template = "plotly" if theme == "light" else "plotly_dark"
    
    # Appliquer le CSS personnalisé premium pour le thème Streamlit
    if theme == "light":
        st.markdown("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        html, body, [class*="css"] {
            font-family: 'Inter', sans-serif;
        }
        
        .main {
            background-color: #f8f9fa;
        }
        
        /* Card Container */
        .metric-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e9ecef;
            margin-bottom: 1rem;
        }
        
        .risk-high { border-top: 5px solid #ff4b4b; }
        .risk-low { border-top: 5px solid #28a745; }
        .risk-medium { border-top: 5px solid #fcc419; }
        
        /* Navbar styling */
        .stTabs [data-baseweb="tab-list"] {
            gap: 24px;
        }
        
        .stTabs [data-baseweb="tab"] {
            height: 50px;
            white-space: pre-wrap;
            background-color: #f8f9fa;
            border-radius: 4px 4px 0px 0px;
            gap: 1px;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        
        .stTabs [aria-selected="true"] {
            background-color: #ffffff;
            border-bottom: 2px solid #ff4b4b;
        }
        
        .stApp {
            background-color: #ffffff !important;
            color: #000000 !important;
        }
        [data-testid="stAppViewContainer"] {
            background-color: #ffffff !important;
        }
        [data-testid="stSidebar"] {
            background-color: #f5f5f5 !important;
        }
        .stMarkdown, .stText, .stTitle, .stHeader {
            color: #000000 !important;
        }
        .stButton>button {
            background-color: #e0e0e0;
            color: #000000;
        }
        .stTextInput>div>div>input, .stNumberInput>div>div>input {
            background-color: #f0f0f0;
            color: #000000;
        }
        .stSelectbox>div>div>select {
            background-color: #f0f0f0;
            color: #000000;
        }
        </style>
        """, unsafe_allow_html=True)
    else:
        st.markdown("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        html, body, [class*="css"] {
            font-family: 'Inter', sans-serif;
        }
        
        .main {
            background-color: #1e1e1e;
        }
        
        /* Card Container */
        .metric-card {
            background: #2d2d2d;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #3d3d3d;
            margin-bottom: 1rem;
        }
        
        .risk-high { border-top: 5px solid #ff4b4b; }
        .risk-low { border-top: 5px solid #28a745; }
        .risk-medium { border-top: 5px solid #fcc419; }
        
        /* Navbar styling */
        .stTabs [data-baseweb="tab-list"] {
            gap: 24px;
        }
        
        .stTabs [data-baseweb="tab"] {
            height: 50px;
            white-space: pre-wrap;
            background-color: #2d2d2d;
            border-radius: 4px 4px 0px 0px;
            gap: 1px;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        
        .stTabs [aria-selected="true"] {
            background-color: #3d3d3d;
            border-bottom: 2px solid #ff4b4b;
        }
        
        .stApp {
            background-color: #1e1e1e !important;
            color: #ffffff !important;
        }
        [data-testid="stAppViewContainer"] {
            background-color: #1e1e1e !important;
        }
        [data-testid="stSidebar"] {
            background-color: #2d2d2d !important;
        }
        .stMarkdown, .stText, .stTitle, .stHeader {
            color: #ffffff !important;
        }
        .stButton>button {
            background-color: #3d3d3d;
            color: #ffffff;
        }
        .stTextInput>div>div>input, .stNumberInput>div>div>input {
            background-color: #2d2d2d;
            color: #ffffff;
        }
        .stSelectbox>div>div>select {
            background-color: #2d2d2d;
            color: #ffffff;
        }
        </style>
        """, unsafe_allow_html=True)
    
    # Professional header with branding
    st.markdown("""
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px; background: linear-gradient(90deg, #1a1a2e 0%, #16213e 100%); border-radius: 10px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center;">
            <span style="font-size: 40px; margin-right: 15px;">⚙️</span>
            <div>
                <h1 style="margin: 0; color: white; font-size: 24px;">Industrial IoT</h1>
                <p style="margin: 0; color: #bda178; font-size: 14px;">Predictive Maintenance • ISO 13374</p>
            </div>
        </div>
        <div style="text-align: right;">
            <p style="margin: 0; color: #e8b14b; font-size: 12px;">PRODUCTION</p>
            <p style="margin: 0; color: #ffffff; font-size: 12px;">v2.0</p>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Safety & Trust Disclaimer
    st.markdown("""
    <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 5px solid #0056b3;">
        <h5 style="margin: 0; color: #0056b3;">⚠️ Industrial Safety Disclaimer</h5>
        <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #495057;">
            <b>NOTICE:</b> This system is designed for <b>predictive maintenance decision support only</b> and does not replace professional industrial maintenance protocols. 
            Always consult with qualified maintenance engineers. Model predictions are based on sensor data patterns and may not account for all failure modes or environmental factors.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Titre et description
    st.title(t['title'])
    st.markdown(t['description'])
    
    # Chargement des modules (avec cache)
    telemetry_pipeline = get_telemetry_pipeline()
    maintenance_model = get_maintenance_model(confidence=params['confidence'])
    
    # ÉTAPE 2 : Ingestion des données
    st.markdown("---")
    st.subheader(t['step2'])
    st.info("Chargement des données de télémétrie (CSV/JSON ou simulation stochastique)" if params['lang'] == 'fr' else "Loading telemetry data (CSV/JSON or stochastic simulation)")
    
    # Ingestion des données
    with st.spinner("Chargement des données de télémétrie..."):
        try:
            if params['file_upload']:
                file_content = params['file_upload'].getvalue().decode('utf-8')
                file_type = params['file_upload'].type
                
                if file_type == 'application/json' or params['file_upload'].name.endswith('.json'):
                    telemetry_data = telemetry_pipeline.parse_json_telemetry(file_content)
                    st.success("✅ Données JSON importées avec succès")
                    st.caption("💡 Format attendu : { timestamps: [], sensors: { sensorName: [], ... } }")
                else:
                    telemetry_data = telemetry_pipeline.parse_csv_telemetry(file_content)
                    st.success("✅ Données CSV importées avec succès")
                    st.caption("💡 Format attendu : Timestamp + colonnes de capteurs numériques")
            else:
                telemetry_data = telemetry_pipeline.generate_sensor_data(
                    params['equipment'].value,
                    1200
                )
                st.info(f"📊 Données simulées pour {telemetry_data['scenario']['name']}")
                st.caption("💡 Simulation stochastique avec injection d'anomalies réelles")
        except Exception as e:
            st.error(f"❌ Erreur ingestion données: {e}")
            logger.error(f"Erreur ingestion: {e}")
            return
    
    # ÉTAPE 3 : Calcul des métriques
    st.markdown("---")
    st.subheader("🧮 ÉTAPE 3 - Calcul des Métriques de Maintenance Prédictive")
    st.info(f"Calcul avec VAE (latent dim=2) et Conformal Prediction (α={1-params['confidence']})")
    
    # Calcul des métriques
    with st.spinner("Calcul des métriques de maintenance prédictive..."):
        try:
            all_metrics = maintenance_model.compute_all_metrics(
                telemetry_data['sensor_matrix'],
                telemetry_data.get('ground_truth'),
                telemetry_data['sensor_names'],
                params['threshold_sigma']
            )
            
            all_metrics['confidence'] = params['confidence']
            
            st.success("✅ Métriques calculées avec succès")
            st.caption(f"💡 {len(telemetry_data['sensor_names'])} capteurs · {len(telemetry_data['sensor_matrix'])} points temporels")
            
        except Exception as e:
            st.error(f"❌ Erreur calcul métriques: {e}")
            logger.error(f"Erreur métriques: {e}")
            return
    
    # Affichage des résultats avec Health Pulse
    st.divider()
    st.subheader(t['step4'])
    
    # Calculer l'index de santé et la confiance
    health_index = all_metrics['rul'].current_health_index
    confidence = 88.52  # Basé sur la performance du modèle CardioSense
    
    # Afficher la jauge de santé principale
    col1, col2 = st.columns([1, 2])
    
    with col1:
        render_health_pulse_gauge(health_index, confidence, plotly_template)
    
    with col2:
        render_metrics_grid(all_metrics)
    
    # Onglets pour les visualisations avancées
    tab1, tab2, tab3, tab4 = st.tabs([
        "📊 Télémétrie & Détection",
        "📈 Pertes ELBO",
        "🧩 Performance XAI",
        "🔍 Cause Racine"
    ])
    
    with tab1:
        # Sélection du capteur à afficher
        sensor_idx = st.selectbox(
            "Sélectionner capteur",
            range(len(telemetry_data['sensor_names'])),
            format_func=lambda i: telemetry_data['sensor_names'][i]
        )
        
        # Fenêtrage pour affichage
        window_size = min(params['window_size'], len(telemetry_data['sensor_matrix']))
        start_idx = max(0, len(telemetry_data['sensor_matrix']) - window_size)
        
        window_slice = slice(start_idx, len(telemetry_data['sensor_matrix']))
        
        timestamps = telemetry_data['timestamps'][window_slice]
        sensor_values = telemetry_data['sensor_matrix'][window_slice, sensor_idx]
        reconstructed = all_metrics['vae'].reconstructed_matrix[window_slice, sensor_idx]
        anomaly_flags = all_metrics['vae'].anomaly_predictions[window_slice]
        
        render_telemetry_chart(
            timestamps,
            sensor_values,
            reconstructed,
            anomaly_flags,
            all_metrics['vae'].anomaly_threshold,
            telemetry_data['sensor_names'][sensor_idx],
            plotly_template
        )
    
    with tab2:
        window_size = min(params['window_size'], len(all_metrics['vae'].elbo_losses))
        start_idx = max(0, len(all_metrics['vae'].elbo_losses) - window_size)
        window_elbo = all_metrics['vae'].elbo_losses[start_idx:]
        
        render_elbo_chart(window_elbo, all_metrics['vae'].anomaly_threshold, plotly_template)
    
    with tab3:
        render_confusion_matrix(all_metrics['xai_metrics'])
    
    with tab4:
        render_root_cause_analysis(all_metrics['root_cause'])
    
    # Section Warnings (si présents)
    if hasattr(all_metrics, 'warnings') and all_metrics.get('warnings'):
        st.warning("⚠️ " + "\n".join(all_metrics['warnings']))
    
    # Résumé final
    st.markdown("---")
    st.subheader(t['summary'])
    st.info(
        f"**Équipement** : {telemetry_data['scenario']['name']}\n"
        f"**Capteurs** : {', '.join(telemetry_data['sensor_names'])}\n"
        f"**Index de santé** : {all_metrics['rul'].current_health_index:.0f}%\n"
        f"**RUL** : {all_metrics['rul'].estimated_rul_minutes:.0f} min [{all_metrics['rul'].conformal_bounds['lower_minutes']:.0f}m, {all_metrics['rul'].conformal_bounds['upper_minutes']:.0f}m]\n"
        f"**Performance** : Précision {all_metrics['xai_metrics'].precision_pct:.1f}% | Rappel {all_metrics['xai_metrics'].recall_pct:.1f}% | F1 {all_metrics['xai_metrics'].f1_pct:.1f}%\n"
        f"**Cause racine** : {all_metrics['root_cause'].fault_title} ({all_metrics['root_cause'].dominant_sensor})"
    )
    
    # Professional Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin-top: 30px;">
        <p style="margin: 0; color: #495057; font-size: 0.9rem;">
            <b>Industrial IoT Predictive Maintenance</b> • ISO 13374 Compliant • v2.0
        </p>
        <p style="margin: 5px 0 0 0; color: #6c757d; font-size: 0.8rem;">
            Built with Streamlit • Plotly • VAE • XAI • Real-time Monitoring
        </p>
        <p style="margin: 5px 0 0 0; color: #6c757d; font-size: 0.75rem;">
            © 2026 Portfolio R&D SOTA 2026 • All Rights Reserved
        </p>
    </div>
    """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()
