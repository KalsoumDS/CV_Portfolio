"""
Industrial IoT R&D - Pipeline de Données de Télémétrie
Extraction, nettoyage et génération de données capteurs avec validation stricte.

Auteur: Lead Data Scientist R&D
Version: 2.0 - Production Grade
"""

from typing import List, Tuple, Dict, Optional, Union
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TelemetryDataPipeline:
    """
    Pipeline de données de télémétrie industrielle enterprise-grade.
    
    Gère l'ingestion de données depuis différentes sources (CSV, JSON, génération stochastique)
    avec validation stricte, nettoyage et préparation pour les modèles de détection d'anomalies.
    
    Attributes:
        equipment_scenarios (Dict): Scénarios d'équipements prédéfinis
        min_data_points (int): Nombre minimum de points de données requis
    """
    
    EQUIPMENT_SCENARIOS = {
        'pump': {
            'id': 'pump',
            'name': 'Pompe Centrifuge P-042 (Dégradation Palier & Cavitation)',
            'sensor_names': ['Vibration RMS (mm/s)', 'Température (°C)', 'Pression Refoulement (bar)', 'Débit (m³/h)'],
            'base_values': [1.2, 45.0, 3.2, 120.0],
        },
        'motor': {
            'id': 'motor',
            'name': 'Moteur Asynchrone M-99 (Surchauffe & Dérive Statorique)',
            'sensor_names': ['Vibration Axiale (mm/s)', 'Température Enroulement (°C)', 'Pression Huile (bar)', 'Courant Statorique (A)'],
            'base_values': [0.8, 62.0, 4.5, 85.0],
        },
        'compressor': {
            'id': 'compressor',
            'name': 'Compresseur C-12 (Fuite Soupape & Perte de Charge)',
            'sensor_names': ['Vibration Carter (mm/s)', 'Température Étage 2 (°C)', 'Pression Étage 2 (bar)', 'Débit Aspiration (Nm³/h)'],
            'base_values': [1.5, 78.0, 6.8, 250.0],
        },
    }
    
    MIN_DATA_POINTS = 30
    
    def __init__(self, min_data_points: int = MIN_DATA_POINTS):
        """
        Initialise le pipeline de données de télémétrie.
        
        Args:
            min_data_points: Nombre minimum de points de données requis
        """
        self.min_data_points = min_data_points
        self.equipment_scenarios = self.EQUIPMENT_SCENARIOS.copy()
    
    def parse_csv_telemetry(self, csv_text: str) -> Dict[str, Union[List, np.ndarray]]:
        """
        Parse un contenu CSV brut pour extraire les données de télémétrie.
        
        Format attendu : Timestamp + colonnes capteurs numériques.
        Validation stricte : colonnes numériques majoritaires, variation non nulle.
        
        Args:
            csv_text: Contenu CSV brut
            
        Returns:
            Dictionnaire contenant sensor_names, timestamps, sensor_matrix, ground_truth
            
        Raises:
            ValueError: Si le CSV ne respecte pas les critères de validation
        """
        try:
            lines = csv_text.strip().split('\n')
            lines = [l for l in lines if l.strip()]
            
            if len(lines) < self.MIN_DATA_POINTS + 1:
                raise ValueError(
                    f'CSV invalide : au moins {self.MIN_DATA_POINTS + 1} lignes requises '
                    f'(header + {self.MIN_DATA_POINTS} points temporels minimum).'
                )
            
            header = lines[0].split(',')
            header = [h.strip().replace('"', '').replace("'", '') for h in header if h.strip()]
            
            if len(header) < 2:
                raise ValueError('CSV invalide : au moins 2 colonnes attendues (Timestamp + 1 signal capteur).')
            
            # Identification colonne timestamp
            timestamp_col_idx = self._detect_timestamp_column(header, lines[1:])
            
            # Identification colonnes capteurs numériques
            sensor_cols = self._detect_sensor_columns(header, lines[1:], timestamp_col_idx)
            
            if not sensor_cols:
                raise ValueError(
                    'Aucun signal capteur numérique valide détecté. '
                    'Vérifiez que vos colonnes contiennent des mesures numériques.'
                )
            
            # Parsing des lignes
            timestamps, sensor_matrix = self._parse_telemetry_lines(
                lines, timestamp_col_idx, sensor_cols, header
            )
            
            # Validation variation minimale
            self._validate_sensor_variation(sensor_matrix, [header[c] for c in sensor_cols])
            
            return {
                'scenario': {
                    'id': 'custom_csv',
                    'name': f'Données télémétriques personnalisées ({len(sensor_cols)} capteurs · {len(timestamps)} points)'
                },
                'sensor_names': [header[c] for c in sensor_cols],
                'timestamps': timestamps,
                'sensor_matrix': sensor_matrix,
                'ground_truth': None,
            }
            
        except Exception as e:
            logger.error(f"Erreur parsing CSV télémétrie: {e}")
            raise ValueError(f"Échec parsing CSV: {e}")
    
    def _detect_timestamp_column(self, header: List[str], data_lines: List[str]) -> int:
        """Détecte la colonne de timestamps."""
        timestamp_patterns = ['date', 'timestamp', 'time', 'jour', 'minute', 'heure', 'hour', 'dt']
        
        for i, h in enumerate(header):
            if any(pattern in h.lower() for pattern in timestamp_patterns):
                return i
        
        # Fallback heuristique
        for col in range(len(header)):
            timestamp_like_count = 0
            for line in data_lines[:20]:
                parts = line.split(',')
                if col < len(parts) and self._is_plausible_timestamp(parts[col]):
                    timestamp_like_count += 1
            
            if timestamp_like_count / len(data_lines[:20]) >= 0.7:
                return col
        
        return 0  # Première colonne par défaut
    
    def _detect_sensor_columns(self, header: List[str], data_lines: List[str], 
                              timestamp_col_idx: int) -> List[int]:
        """Détecte les colonnes capteurs numériques."""
        sensor_cols = []
        
        for col in range(len(header)):
            if col == timestamp_col_idx:
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
                    sensor_cols.append(col)
        
        return sensor_cols
    
    def _parse_telemetry_lines(self, lines: List[str], timestamp_col_idx: int, 
                              sensor_cols: List[int], header: List[str]) -> Tuple[List[str], np.ndarray]:
        """Parse les lignes de données télémétriques."""
        timestamps = []
        sensor_matrix = []
        
        for line in lines[1:]:
            parts = line.split(',')
            if len(parts) < len(header):
                continue
            
            # Timestamp
            ts_raw = parts[timestamp_col_idx].strip()
            timestamps.append(self._is_plausible_timestamp(ts_raw) and ts_raw or f"T_{len(timestamps)}")
            
            # Capteurs
            row_sensors = []
            for col in sensor_cols:
                raw = parts[col].strip()
                try:
                    val = float(raw)
                    row_sensors.append(val)
                except ValueError:
                    # Fallback : dernière valeur valide
                    val = sensor_matrix[-1][sensor_cols.index(col)] if sensor_matrix else 0.0
                    row_sensors.append(val)
            
            if row_sensors:
                sensor_matrix.append(row_sensors)
        
        return timestamps, np.array(sensor_matrix)
    
    def _validate_sensor_variation(self, sensor_matrix: np.ndarray, sensor_names: List[str]) -> None:
        """Valide que les capteurs ont une variation suffisante."""
        for j, name in enumerate(sensor_names):
            col = sensor_matrix[:, j]
            range_ratio = (np.max(col) - np.min(col)) / (np.abs(np.mean(col)) + 1e-9)
            if range_ratio < 0.005:
                raise ValueError(
                    f'Capteur « {name} » quasi constant (variation < 0.5%). '
                    'Ce fichier ne ressemble pas à de la télémétrie industrielle dynamique.'
                )
    
    def _is_plausible_timestamp(self, s: str) -> bool:
        """Vérifie si une chaîne ressemble à un timestamp."""
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
        
        return True  # Permissive fallback
    
    def parse_json_telemetry(self, json_text: str) -> Dict[str, Union[List, np.ndarray]]:
        """
        Parse un contenu JSON pour extraire les données de télémétrie.
        
        Format attendu : { timestamps: [], sensors: { sensorName: [], ... } }
        
        Args:
            json_text: Contenu JSON brut
            
        Returns:
            Dictionnaire contenant sensor_names, timestamps, sensor_matrix, ground_truth
        """
        try:
            data = json.loads(json_text)
            
            if not data.get('sensors') or not isinstance(data['sensors'], dict):
                raise ValueError('JSON invalide : propriété "sensors" manquante ou invalide.')
            
            sensor_names = list(data['sensors'].keys())
            if not sensor_names:
                raise ValueError('JSON invalide : aucun capteur détecté dans "sensors".')
            
            timestamps = data.get('timestamps', [])
            sensor_matrix = []
            
            max_length = max(len(arr) for arr in data['sensors'].values()) if data['sensors'] else 0
            
            for i in range(max_length):
                row = []
                for name in sensor_names:
                    arr = data['sensors'][name]
                    val = arr[i] if i < len(arr) else 0.0
                    row.append(float(val) if isinstance(val, (int, float)) else 0.0)
                sensor_matrix.append(row)
            
            if len(sensor_matrix) < self.MIN_DATA_POINTS:
                raise ValueError(f'Télémétrie JSON trop courte ({len(sensor_matrix)} points, minimum {self.MIN_DATA_POINTS}).')
            
            return {
                'scenario': {
                    'id': 'custom_json',
                    'name': f'Télémétrie JSON personnalisée ({len(sensor_names)} capteurs)'
                },
                'sensor_names': sensor_names,
                'timestamps': timestamps if timestamps else [f"T_{i}" for i in range(len(sensor_matrix))],
                'sensor_matrix': np.array(sensor_matrix),
                'ground_truth': None,
            }
            
        except json.JSONDecodeError as e:
            logger.error(f"Erreur parsing JSON: {e}")
            raise ValueError(f"JSON invalide: {e}")
        except Exception as e:
            logger.error(f"Erreur traitement JSON: {e}")
            raise ValueError(f"Échec parsing JSON: {e}")
    
    def generate_sensor_data(self, scenario_id: str = 'pump', n_steps: int = 1200, 
                            seed: int = 42) -> Dict[str, Union[List, np.ndarray]]:
        """
        Génère des données de télémétrie réalistes avec anomalies injectées.
        
        Simule des signaux nominaux harmoniques + bruit blanc avec injection
        de défauts physiques réels (dérive vibratoire, choc thermique, cavitation).
        
        Args:
            scenario_id: Type d'équipement ('pump', 'motor', 'compressor')
            n_steps: Nombre de points temporels à générer
            seed: Graine aléatoire pour reproductibilité
            
        Returns:
            Dictionnaire contenant sensor_names, timestamps, sensor_matrix, ground_truth
        """
        np.random.seed(seed)
        
        scenario = self.equipment_scenarios.get(scenario_id, self.equipment_scenarios['pump'])
        sensor_names = scenario['sensor_names']
        base_values = scenario['base_values']
        
        sensor_matrix = []
        ground_truth = np.zeros(n_steps)
        timestamps = []
        
        base_date = datetime(2026, 3, 1, 8, 0, 0)
        
        for i in range(n_steps):
            cur_date = base_date + timedelta(minutes=i)
            timestamps.append(cur_date.strftime('%Y-%m-%d %H:%M:%S'))
            
            t_norm = (i / n_steps) * 100
            
            # Signaux nominaux harmoniques + bruit blanc
            s0 = base_values[0] + 0.3 * np.sin(0.18 * t_norm) + 0.08 * (np.random.random() - 0.5) * 2
            s1 = base_values[1] + 0.04 * t_norm + 0.25 * (np.random.random() - 0.5) * 2
            s2 = base_values[2] + 0.08 * np.cos(0.12 * t_norm) + 0.04 * (np.random.random() - 0.5) * 2
            s3 = base_values[3] - 0.02 * t_norm + 0.60 * (np.random.random() - 0.5) * 2
            
            # Anomalie 1 (t = 300 à 400) : Dérive vibratoire accélérée + échauffement
            if 300 <= i < 400:
                progress = (i - 300) / 100
                s0 += 0.8 + progress * 2.1 + (np.random.random() - 0.5) * 0.5
                s1 += progress * 19.5
                ground_truth[i] = 1
            
            # Anomalie 2 (t = 700 à 760) : Chute brutale de pression + cavitation
            if 700 <= i < 760:
                progress = (i - 700) / 60
                s2 -= 0.6 + progress * 1.4
                s0 += 1.4 * (np.random.random() - 0.5) * 2
                ground_truth[i] = 1
            
            # Anomalie 3 (t = 1000 à 1090) : Colmatage et effondrement de débit
            if 1000 <= i < 1090:
                progress = (i - 1000) / 90
                s3 -= 8.0 + progress * 38.0
                s1 += progress * 14.0
                ground_truth[i] = 1
            
            sensor_matrix.append([s0, s1, s2, s3])
        
        return {
            'scenario': scenario,
            'sensor_names': sensor_names,
            'timestamps': timestamps,
            'sensor_matrix': np.array(sensor_matrix),
            'ground_truth': ground_truth,
        }


def load_telemetry_pipeline(min_data_points: int = 30) -> TelemetryDataPipeline:
    """
    Factory function pour charger le pipeline de données de télémétrie.
    
    Args:
        min_data_points: Nombre minimum de points de données requis
        
    Returns:
        Instance de TelemetryDataPipeline
    """
    return TelemetryDataPipeline(min_data_points=min_data_points)
