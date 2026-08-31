"""
Facial Recognition R&D - Pipeline de Données d'Identités
Extraction, nettoyage et génération de données de gallery avec embeddings.

Auteur: Lead Data Scientist R&D
Version: 2.0 - Production Grade
"""

from typing import List, Tuple, Dict, Optional, Union
import numpy as np
import pandas as pd
from dataclasses import dataclass
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class Identity:
    """
    Représente une identité faciale avec métadonnées.
    
    Attributes:
        id: Identifiant unique (ex: EMP-001)
        name: Nom complet de la personne
        department: Département d'appartenance
        clearance: Niveau de clearance (L1, L2, L3)
        embedding: Vecteur d'embedding facial (512 dimensions)
    """
    id: str
    name: str
    department: str
    clearance: str
    embedding: np.ndarray


@dataclass
class CameraConfig:
    """
    Configuration d'une caméra RTSP.
    
    Attributes:
        id: Identifiant de la caméra
        location: Emplacement physique
        rtsp_url: URL RTSP (simulée)
        fps: Fréquence d'images par seconde
        resolution: Résolution (width, height)
    """
    id: str
    location: str
    rtsp_url: str
    fps: int
    resolution: Tuple[int, int]


class FacialDataPipeline:
    """
    Pipeline de données de reconnaissance faciale enterprise-grade.
    
    Gère l'ingestion de données depuis différentes sources (CSV, génération stochastique)
    avec validation stricte, nettoyage et préparation pour les modèles de reconnaissance.
    
    Attributes:
        embedded_identities: Gallery d'identités embarquées
        cameras: Configuration des caméras RTSP
        embedding_dim: Dimension des embeddings (512 pour ArcFace)
    """
    
    # Gallery embarquée d'identités (simulée pour la démo)
    EMBEDDED_IDENTITIES = [
        Identity(
            id='EMP-001',
            name='Dr. Sarah Alami',
            department='R&D',
            clearance='L3',
            embedding=np.random.randn(512) * 0.1
        ),
        Identity(
            id='EMP-002',
            name='Jean-Pierre Dubois',
            department='IT',
            clearance='L2',
            embedding=np.random.randn(512) * 0.1
        ),
        Identity(
            id='EMP-003',
            name='Marie Chen',
            department='Finance',
            clearance='L2',
            embedding=np.random.randn(512) * 0.1
        ),
        Identity(
            id='EMP-004',
            name='Ahmed Hassan',
            department='Operations',
            clearance='L1',
            embedding=np.random.randn(512) * 0.1
        ),
        Identity(
            id='EMP-005',
            name='Elena Rossi',
            department='HR',
            clearance='L2',
            embedding=np.random.randn(512) * 0.1
        ),
        Identity(
            id='EMP-006',
            name='Thomas Müller',
            department='Security',
            clearance='L3',
            embedding=np.random.randn(512) * 0.1
        ),
        Identity(
            id='EMP-007',
            name='Yuki Tanaka',
            department='R&D',
            clearance='L2',
            embedding=np.random.randn(512) * 0.1
        ),
    ]
    
    # Configuration des caméras RTSP
    CAMERAS = [
        CameraConfig(
            id='CAM-01',
            location='Entrée Principale — Hall A',
            rtsp_url='rtsp://cam-01.internal:554/stream',
            fps=30,
            resolution=(1920, 1080)
        ),
        CameraConfig(
            id='CAM-02',
            location='Salle Serveurs — Zone Sécurisée',
            rtsp_url='rtsp://cam-02.internal:554/stream',
            fps=25,
            resolution=(1280, 720)
        ),
        CameraConfig(
            id='CAM-03',
            location='Parking — Accès Véhicules',
            rtsp_url='rtsp://cam-03.internal:554/stream',
            fps=15,
            resolution=(1920, 1080)
        ),
    ]
    
    EMBEDDING_DIM = 512
    
    def __init__(self, embedding_dim: int = EMBEDDING_DIM):
        """
        Initialise le pipeline de données faciales.
        
        Args:
            embedding_dim: Dimension des embeddings faciaux
        """
        self.embedding_dim = embedding_dim
        self.embedded_identities = self.EMBEDDED_IDENTITIES.copy()
        self.cameras = self.CAMERAS.copy()
    
    def parse_csv_gallery(self, csv_text: str) -> List[Identity]:
        """
        Parse un contenu CSV brut pour extraire une gallery d'identités.
        
        Format attendu : id, name, department, clearance.
        Validation stricte : colonnes valides, identifiants uniques, noms non vides.
        
        Args:
            csv_text: Contenu CSV brut
            
        Returns:
            Liste d'identités extraites
            
        Raises:
            ValueError: Si le CSV ne respecte pas les critères de validation
        """
        try:
            lines = csv_text.strip().split('\n')
            lines = [l for l in lines if l.strip()]
            
            if len(lines) < 2:
                raise ValueError('CSV invalide : au moins 2 lignes requises (header + 1 identité).')
            
            header = lines[0].split(',')
            header = [h.strip().replace('"', '').replace("'", '') for h in header if h.strip()]
            
            if len(header) < 2:
                raise ValueError('CSV invalide : au moins 2 colonnes attendues (id + name).')
            
            # Identification colonnes
            id_col_idx = self._detect_id_column(header)
            name_col_idx = self._detect_name_column(header)
            dept_col_idx = self._detect_department_column(header)
            clearance_col_idx = self._detect_clearance_column(header)
            
            # Parsing des lignes
            identities = []
            seen_ids = set()
            
            for line in lines[1:]:
                parts = line.split(',')
                if len(parts) < len(header):
                    continue
                
                # ID
                id_raw = parts[id_col_idx].strip() if id_col_idx >= 0 else f"EMP-{len(identities) + 1}"
                if id_raw in seen_ids:
                    continue  # Ignorer les doublons
                seen_ids.add(id_raw)
                
                # Name
                name_raw = parts[name_col_idx].strip() if name_col_idx >= 0 else f"Person {len(identities) + 1}"
                if len(name_raw) < 2:
                    continue  # Ignorer les noms trop courts
                
                # Department
                dept_raw = parts[dept_col_idx].strip() if dept_col_idx >= 0 else 'General'
                
                # Clearance
                clearance_raw = parts[clearance_col_idx].strip() if clearance_col_idx >= 0 else 'L1'
                
                # Génération embedding simulé (en production, utiliser ArcFace réel)
                embedding = np.random.randn(self.embedding_dim) * 0.1
                
                identities.append(Identity(
                    id=id_raw,
                    name=name_raw,
                    department=dept_raw,
                    clearance=clearance_raw,
                    embedding=embedding
                ))
            
            if not identities:
                raise ValueError('Aucune identité valide extraite. Vérifiez le format CSV.')
            
            return identities
            
        except Exception as e:
            logger.error(f"Erreur parsing CSV gallery: {e}")
            raise ValueError(f"Échec parsing CSV: {e}")
    
    def _detect_id_column(self, header: List[str]) -> int:
        """Détecte la colonne ID."""
        id_patterns = ['id', 'emp_id', 'employee_id', 'person_id', 'ref', 'employee']
        
        for i, h in enumerate(header):
            if any(pattern in h.lower() for pattern in id_patterns):
                return i
        
        return 0  # Première colonne par défaut
    
    def _detect_name_column(self, header: List[str]) -> int:
        """Détecte la colonne Name."""
        name_patterns = ['name', 'nom', 'full_name', 'employee_name', 'person_name']
        
        for i, h in enumerate(header):
            if any(pattern in h.lower() for pattern in name_patterns):
                return i
        
        return 1 if len(header) > 1 else 0
    
    def _detect_department_column(self, header: List[str]) -> int:
        """Détecte la colonne Department."""
        dept_patterns = ['department', 'dept', 'service', 'département', 'division']
        
        for i, h in enumerate(header):
            if any(pattern in h.lower() for pattern in dept_patterns):
                return i
        
        return 2 if len(header) > 2 else -1
    
    def _detect_clearance_column(self, header: List[str]) -> int:
        """Détecte la colonne Clearance."""
        clearance_patterns = ['clearance', 'access', 'level', 'niveau', 'security']
        
        for i, h in enumerate(header):
            if any(pattern in h.lower() for pattern in clearance_patterns):
                return i
        
        return 3 if len(header) > 3 else -1
    
    def generate_gallery(self, n_identities: int = 10, seed: int = 42) -> List[Identity]:
        """
        Génère une gallery d'identités simulée.
        
        Args:
            n_identities: Nombre d'identités à générer
            seed: Graine aléatoire pour reproductibilité
            
        Returns:
            Liste d'identités générées
        """
        np.random.seed(seed)
        
        departments = ['R&D', 'IT', 'Finance', 'Operations', 'HR', 'Security', 'Marketing']
        clearances = ['L1', 'L2', 'L3']
        first_names = ['Sarah', 'Jean', 'Marie', 'Ahmed', 'Elena', 'Thomas', 'Yuki', 'Carlos', 'Anna', 'David']
        last_names = ['Alami', 'Dubois', 'Chen', 'Hassan', 'Rossi', 'Müller', 'Tanaka', 'Garcia', 'Kowalski', 'Smith']
        
        identities = []
        
        for i in range(n_identities):
            embedding = np.random.randn(self.embedding_dim) * 0.1
            identities.append(Identity(
                id=f'EMP-{String(i + 1).zfill(3)}',
                name=f'{first_names[i % len(first_names)]} {last_names[i % len(last_names)]}',
                department=departments[i % len(departments)],
                clearance=clearances[i % len(clearances)],
                embedding=embedding
            ))
        
        return identities
    
    def get_camera(self, camera_id: str) -> Optional[CameraConfig]:
        """
        Récupère la configuration d'une caméra par son ID.
        
        Args:
            camera_id: Identifiant de la caméra
            
        Returns:
            CameraConfig si trouvé, None sinon
        """
        for camera in self.cameras:
            if camera.id == camera_id:
                return camera
        return None
    
    def compute_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Calcule la similarité cosinus entre deux embeddings.
        
        Args:
            embedding1: Premier embedding
            embedding2: Deuxième embedding
            
        Returns:
            Score de similarité cosinus [-1, 1]
        """
        norm1 = np.linalg.norm(embedding1)
        norm2 = np.linalg.norm(embedding2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return np.dot(embedding1, embedding2) / (norm1 * norm2)


def load_facial_pipeline(embedding_dim: int = 512) -> FacialDataPipeline:
    """
    Factory function pour charger le pipeline de données faciales.
    
    Args:
        embedding_dim: Dimension des embeddings faciaux
        
    Returns:
        Instance de FacialDataPipeline
    """
    return FacialDataPipeline(embedding_dim=embedding_dim)
