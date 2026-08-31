# Industrial IoT — Predictive Maintenance & Spatio-Temporal Anomaly Detection (Enterprise / R&D Grade)

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![PyTorch 2.0+](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg)](https://pytorch.org/)
[![Standards](https://img.shields.io/badge/standard-ISO%2013374-brightgreen.svg)]()

## 📌 Executive Summary

Ce projet implémente une plateforme industrielle de surveillance de condition et de maintenance prédictive pour équipements critiques (turbines, pompes centrifuges, moteurs asynchrones). Basée sur un **Autoencodeur Variationnel Spatio-Temporel (VAE)** et l'estimation de la **Remaining Useful Life (RUL)** par **Conformal Prediction**, la solution garantit un taux d'anticipation de panne élevé tout en assurant une quantification rigoureuse de l'incertitude et une explicabilité causale (**XAI**) par capteur.

---

## 🔬 Fondements Mathématiques & Algorithmiques

### 1. Autoencodeur Variationnel Spatio-Temporel ($\beta$-VAE)
Pour capturer la dynamique temporelle et les corrélations inter-capteurs, le réseau encode chaque observation multivariée $x \in \mathbb{R}^D$ dans un espace latent continu $z \sim q_\phi(z|x) = \mathcal{N}(\mu_z(x), \text{diag}(\sigma_z^2(x)))$.

La perte est l'opposée de l'Evidence Lower Bound ($\mathcal{L}_{\text{ELBO}}$) :

$$\mathcal{L}_{\text{ELBO}}(\theta, \phi; x) = \mathbb{E}_{q_\phi(z|x)} \left[ -\log p_\theta(x|z) \right] + \beta \mathcal{D}_{\text{KL}}\left( q_\phi(z|x) \,\|\, p(z) \right)$$

où la divergence de Kullback-Leibler contre le prior $\mathcal{N}(0, \mathbf{I})$ s'exprime analytiquement :

$$\mathcal{D}_{\text{KL}}\left( q_\phi(z|x) \,\|\, \mathcal{N}(0, \mathbf{I}) \right) = -\frac{1}{2} \sum_{j=1}^{d_z} \left( 1 + \log \sigma_{z,j}^2 - \mu_{z,j}^2 - \sigma_{z,j}^2 \right)$$

### 2. Quantification d'Incertitude de la RUL par Conformal Prediction
Pour éviter les prédictions déterministes fragiles en environnement industriel, nous construisons un intervalle de prédiction $\mathcal{C}_{1-\alpha}(x)$ à garantie statistique exacte :

$$\mathbb{P}\left( \text{RUL}_{\text{true}} \in \mathcal{C}_{1-\alpha}(x) \right) \ge 1 - \alpha$$

Le score de non-conformité $s_i = |\text{RUL}_i - \hat{\text{RUL}}_i|$ est calibré sur les résidus de dérive de la perte ELBO, déterminant la marge conforme :

$$\mathcal{C}_{1-\alpha}(x) = \left[ \hat{\text{RUL}}(x) - \hat{q}_{1-\alpha}, \; \hat{\text{RUL}}(x) + \hat{q}_{1-\alpha} \right]$$

### 3. Décomposition Causale XAI (Attribution de Cause Racine)
Attribution relative de l'anomalie sur chaque canal capteur $i \in \{1, \dots, D\}$ :

$$\text{Attribution}_i = \frac{(x_i - \hat{x}_i)^2}{\sum_{j=1}^D (x_j - \hat{x}_j)^2} \times 100\%$$

---

## 🏛️ Architecture MLOps

```mermaid
graph TD
    A[Capteurs IoT / CSV Télémétrie] --> B[Ingestion & Normalisation Robuste]
    B --> C[Encodeur VAE: Inférence Latente q z|x]
    C --> D[Décodeur VAE: Reconstruction x_hat]
    D --> E[Calcul Perte ELBO & Seuil Dynamique μ + 2.5σ]
    E --> F[Attribution Causale XAI par Capteur]
    E --> G[Moteur RUL Conforme: Intervalle 95%]
    F --> H[Cockpit Live & Tableau de Bord Diagnostic]
    G --> H
```

---

## 🚀 Installation & Lancement

```bash
# Installation
pip install torch numpy scipy pydantic plotly streamlit pytest

# Lancer le cockpit Streamlit
streamlit run app.py

# Exécuter les tests unitaires
pytest tests/ -v
```
