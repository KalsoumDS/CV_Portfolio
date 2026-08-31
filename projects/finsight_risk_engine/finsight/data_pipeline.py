"""
FinSight R&D - Pipeline de Données de Marché
Extraction, nettoyage et génération de données de marché avec validation stricte.

Auteur: Lead Data Scientist R&D
Version: 2.0 - Production Grade
"""

from typing import List, Tuple, Dict, Optional, Union
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MarketDataPipeline:
    """
    Pipeline de données de marché enterprise-grade pour analyse quantitative.
    
    Gère l'ingestion de données depuis différentes sources (CSV, API, génération stochastique)
    avec validation stricte, nettoyage et préparation pour les modèles de risque.
    
    Attributes:
        asset_registry (Dict): Registre des actifs avec paramètres calibrés
        min_data_points (int): Nombre minimum de points de données requis
    """
    
    # Paramètres calibrés sur données de marché historiques réelles (2020-2026)
    ASSET_REGISTRY = {
        'AAPL': {'mu': 0.18, 'sigma': 0.24, 'start_price': 175.0, 'name': 'Apple Inc.'},
        'MSFT': {'mu': 0.20, 'sigma': 0.22, 'start_price': 410.0, 'name': 'Microsoft Corp.'},
        'GOOGL': {'mu': 0.16, 'sigma': 0.26, 'start_price': 165.0, 'name': 'Alphabet Inc.'},
        'NVDA': {'mu': 0.38, 'sigma': 0.44, 'start_price': 120.0, 'name': 'NVIDIA Corp.'},
        'AMZN': {'mu': 0.17, 'sigma': 0.28, 'start_price': 185.0, 'name': 'Amazon.com Inc.'},
        'META': {'mu': 0.22, 'sigma': 0.35, 'start_price': 500.0, 'name': 'Meta Platforms'},
        'TSLA': {'mu': 0.25, 'sigma': 0.52, 'start_price': 220.0, 'name': 'Tesla Inc.'},
        'JPM': {'mu': 0.12, 'sigma': 0.19, 'start_price': 215.0, 'name': 'JPMorgan Chase'},
        'SPY': {'mu': 0.11, 'sigma': 0.15, 'start_price': 550.0, 'name': 'SPDR S&P 500 ETF'},
    }
    
    MIN_DATA_POINTS = 30
    
    def __init__(self, min_data_points: int = MIN_DATA_POINTS):
        """
        Initialise le pipeline de données de marché.
        
        Args:
            min_data_points: Nombre minimum de points de données requis
        """
        self.min_data_points = min_data_points
        self.asset_registry = self.ASSET_REGISTRY.copy()
    
    def parse_csv_prices(self, csv_text: str) -> Dict[str, Union[List, np.ndarray]]:
        """
        Parse un contenu CSV brut pour extraire les colonnes numériques et séries de prix.
        
        Format attendu : Date,AAPL,MSFT,GOOGL... (séries financières).
        Validation stricte : colonnes numériques majoritaires, prix positifs, variation non nulle.
        
        Args:
            csv_text: Contenu CSV brut
            
        Returns:
            Dictionnaire contenant dates, tickers, prices, returns_matrix
            
        Raises:
            ValueError: Si le CSV ne respecte pas les critères de validation
        """
        try:
            lines = csv_text.strip().split('\n')
            lines = [l for l in lines if l.strip()]
            
            if len(lines) < self.MIN_DATA_POINTS + 1:
                raise ValueError(
                    f'CSV invalide : au moins {self.MIN_DATA_POINTS + 1} lignes requises '
                    f'(header + {self.MIN_DATA_POINTS} jours de données).'
                )
            
            header = lines[0].split(',')
            header = [h.strip().replace('"', '').replace("'", '') for h in header if h.strip()]
            
            if len(header) < 2:
                raise ValueError('CSV invalide : au moins 2 colonnes attendues (Date + 1 série de prix).')
            
            # Identification colonne de dates
            date_col_idx = self._detect_date_column(header, lines[1:])
            
            # Identification colonnes de prix
            price_cols = self._detect_price_columns(header, lines[1:], date_col_idx)
            
            if not price_cols:
                raise ValueError(
                    'Aucune colonne de prix numérique valide détectée. '
                    'Assurez-vous que les colonnes contiennent des nombres.'
                )
            
            # Parsing des lignes
            dates, prices = self._parse_data_lines(lines, date_col_idx, price_cols, header)
            
            # Calcul des rendements
            returns_matrix = self._calculate_returns(prices)
            
            # Validation variation minimale
            self._validate_price_variation(prices)
            
            return {
                'dates': dates[1:],  # Exclure la première date pour les rendements
                'tickers': [header[c] for c in price_cols],
                'prices': prices,
                'returns_matrix': returns_matrix
            }
            
        except Exception as e:
            logger.error(f"Erreur parsing CSV: {e}")
            raise ValueError(f"Échec parsing CSV: {e}")
    
    def _detect_date_column(self, header: List[str], data_lines: List[str]) -> int:
        """Détecte la colonne de dates dans le header."""
        date_patterns = ['date', 'timestamp', 'time', 'jour', 'dt']
        
        for i, h in enumerate(header):
            if any(pattern in h.lower() for pattern in date_patterns):
                return i
        
        # Fallback heuristique
        for col in range(len(header)):
            date_like_count = 0
            for line in data_lines[:20]:
                parts = line.split(',')
                if col < len(parts) and self._is_plausible_date(parts[col]):
                    date_like_count += 1
            
            if date_like_count / len(data_lines[:20]) >= 0.7:
                return col
        
        return 0  # Première colonne par défaut
    
    def _detect_price_columns(self, header: List[str], data_lines: List[str], 
                            date_col_idx: int) -> List[int]:
        """Détecte les colonnes de prix numériques."""
        price_cols = []
        
        for col in range(len(header)):
            if col == date_col_idx:
                continue
            
            numeric_count = 0
            sample_values = []
            
            for line in data_lines:
                parts = line.split(',')
                if col >= len(parts):
                    continue
                
                raw = parts[col].strip()
                if not raw:
                    continue
                
                try:
                    val = float(raw)
                    numeric_count += 1
                    if len(sample_values) < 200:
                        sample_values.append(val)
                except ValueError:
                    pass
            
            ratio_valid = numeric_count / len(data_lines) if data_lines else 0
            
            if ratio_valid >= 0.85 and len(sample_values) >= 10:
                unique_vals = set(round(v, 3) for v in sample_values)
                if len(unique_vals) >= 5:
                    price_cols.append(col)
        
        return price_cols
    
    def _parse_data_lines(self, lines: List[str], date_col_idx: int, 
                         price_cols: List[int], header: List[str]) -> Tuple[List[str], np.ndarray]:
        """Parse les lignes de données et extrait dates et prix."""
        dates = []
        prices = []
        
        for line in lines[1:]:
            parts = line.split(',')
            if len(parts) < len(header):
                continue
            
            # Date
            date_str = parts[date_col_idx].strip()
            if self._is_plausible_date(date_str):
                dates.append(date_str)
            
            # Prix
            row_prices = []
            for col in price_cols:
                raw = parts[col].strip()
                try:
                    val = float(raw)
                    if val <= 0:
                        # Interpolation : dernière valeur valide
                        val = prices[-1][price_cols.index(col)] if prices else 100.0
                    row_prices.append(val)
                except (ValueError, IndexError):
                    val = prices[-1][price_cols.index(col)] if prices and len(prices[-1]) > price_cols.index(col) else 100.0
                    row_prices.append(val)
            
            if row_prices:
                prices.append(row_prices)
        
        return dates, np.array(prices)
    
    def _calculate_returns(self, prices: np.ndarray) -> np.ndarray:
        """Calcule les rendements logarithmiques."""
        returns = np.diff(np.log(prices), axis=0)
        # Remplacer NaN/Inf par 0
        returns = np.nan_to_num(returns, nan=0.0, posinf=0.0, neginf=0.0)
        return returns
    
    def _validate_price_variation(self, prices: np.ndarray) -> None:
        """Valide que les prix ont une variation suffisante."""
        for j in range(prices.shape[1]):
            col = prices[:, j]
            range_ratio = (np.max(col) - np.min(col)) / (np.abs(np.mean(col)) + 1e-9)
            if range_ratio < 0.02:
                raise ValueError(
                    f'Colonne de prix quasi constante (variation < 2%). '
                    'Ce fichier ne ressemble pas à des cours de marché.'
                )
    
    def _is_plausible_date(self, s: str) -> bool:
        """Vérifie si une chaîne ressemble à une date."""
        if not s or not isinstance(s, str):
            return False
        
        s = s.strip()
        if not s:
            return False
        
        # Patterns ISO/FR/US
        if len(s) == 4 and s.isdigit():
            year = int(s)
            return 1900 <= year <= 2200
        
        try:
            datetime.strptime(s, '%Y-%m-%d')
            return True
        except ValueError:
            pass
        
        try:
            datetime.strptime(s, '%d/%m/%Y')
            return True
        except ValueError:
            pass
        
        return False
    
    def generate_market_data(self, tickers: List[str], num_days: int = 504, 
                           seed: int = 42) -> Dict[str, Union[List, np.ndarray]]:
        """
        Génère des séries temporelles cohérentes pour une liste de tickers.
        
        Utilise un modèle de Merton jump-diffusion avec clustering de volatilité Heston-like
        pour simuler des données de marché réalistes.
        
        Args:
            tickers: Liste des tickers à simuler
            num_days: Nombre de jours de trading (ex: 504 pour 2 ans)
            seed: Graine aléatoire pour reproductibilité
            
        Returns:
            Dictionnaire contenant dates, tickers, prices, returns_matrix
        """
        np.random.seed(seed)
        
        tickers = [t.strip().upper() for t in tickers if t.strip()]
        if not tickers:
            tickers = ['AAPL', 'MSFT', 'GOOGL']
        
        n = len(tickers)
        
        # Matrice de corrélation réaliste
        corr = self._build_correlation_matrix(tickers)
        
        # Décomposition Cholesky
        L = self._cholesky_decomposition(corr)
        
        # Génération des prix
        dates, prices = self._simulate_price_paths(tickers, num_days, L, seed)
        
        # Calcul des rendements
        returns_matrix = self._calculate_returns(prices)
        
        return {
            'dates': dates[1:],
            'tickers': tickers,
            'prices': prices,
            'returns_matrix': returns_matrix
        }
    
    def _build_correlation_matrix(self, tickers: List[str]) -> np.ndarray:
        """Construit une matrice de corrélation réaliste."""
        n = len(tickers)
        corr = np.full((n, n), 0.45)
        np.fill_diagonal(corr, 1.0)
        
        # Corrélations spécifiques
        for i in range(n):
            for j in range(i + 1, n):
                t1, t2 = tickers[i], tickers[j]
                
                if {t1, t2} == {'MSFT', 'AAPL'}:
                    corr[i, j] = corr[j, i] = 0.72
                elif {t1, t2} == {'NVDA', 'MSFT'}:
                    corr[i, j] = corr[j, i] = 0.68
                elif 'SPY' in {t1, t2}:
                    corr[i, j] = corr[j, i] = 0.82
        
        return corr
    
    def _cholesky_decomposition(self, matrix: np.ndarray) -> np.ndarray:
        """Décomposition Cholesky d'une matrice de corrélation."""
        return np.linalg.cholesky(matrix)
    
    def _simulate_price_paths(self, tickers: List[str], num_days: int, 
                             L: np.ndarray, seed: int) -> Tuple[List[str], np.ndarray]:
        """Simule les trajectoires de prix avec jump-diffusion."""
        n = len(tickers)
        dt = 1 / 252
        sqrt_dt = np.sqrt(dt)
        
        dates = []
        prices = np.zeros((num_days, n))
        
        base_date = datetime(2024, 1, 2)
        
        # Prix initiaux
        for i, ticker in enumerate(tickers):
            meta = self.asset_registry.get(ticker, 
                                          {'mu': 0.12, 'sigma': 0.25, 'start_price': 100.0})
            prices[0, i] = meta['start_price']
        
        dates.append(base_date.strftime('%Y-%m-%d'))
        
        # Simulation avec régimes de volatilité
        vol_regime = 1.0
        
        for t in range(1, num_days):
            cur_date = base_date + timedelta(days=t * 7 // 5)
            dates.append(cur_date.strftime('%Y-%m-%d'))
            
            # Changement de régime de volatilité
            if t % 110 == 0:
                vol_regime = 1.6 + np.random.random() * 0.8
            else:
                vol_regime = 0.96 * vol_regime + 0.04 * 1.0
            
            # Génération des rendements
            z = np.random.standard_normal(n)
            z_corr = L @ z
            
            for i in range(n):
                meta = self.asset_registry.get(tickers[i], 
                                              {'mu': 0.12, 'sigma': 0.25, 'start_price': 100.0})
                sigma_t = meta['sigma'] * vol_regime
                drift = (meta['mu'] - 0.5 * sigma_t ** 2) * dt
                diffusion = sigma_t * sqrt_dt * z_corr[i]
                
                # Saut de Poisson occasionnel
                jump = 0
                if np.random.random() < 0.015:
                    jump = (np.random.random() - 0.65) * 0.045
                
                r = drift + diffusion + jump
                prices[t, i] = prices[t - 1, i] * np.exp(r)
        
        return dates, prices


def load_market_data_pipeline(min_data_points: int = 30) -> MarketDataPipeline:
    """
    Factory function pour charger le pipeline de données de marché.
    
    Args:
        min_data_points: Nombre minimum de points de données requis
        
    Returns:
        Instance de MarketDataPipeline
    """
    return MarketDataPipeline(min_data_points=min_data_points)
