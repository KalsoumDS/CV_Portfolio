/**
 * Industrial IoT - Parser Multi-Format pour Données Capteurs
 * Supporte : CSV, JSON, Excel (simulation) avec extraction de télémétrie
 */

const { parseIndustrialCsv } = require('./data');

/**
 * Parse un fichier JSON de télémétrie industrielle
 * Format attendu : { timestamps: [], sensors: { sensorName: [], ... } }
 * @param {string} jsonContent - Contenu JSON
 * @returns {Object} { sensorNames, timestamps, sensorMatrix, groundTruth }
 */
function parseJsonTelemetry(jsonContent) {
  try {
    const data = JSON.parse(jsonContent);
    
    if (!data.sensors || typeof data.sensors !== 'object') {
      throw new Error('JSON invalide : propriété "sensors" manquante ou invalide.');
    }
    
    const sensorNames = Object.keys(data.sensors);
    if (sensorNames.length === 0) {
      throw new Error('JSON invalide : aucun capteur détecté dans "sensors".');
    }
    
    const timestamps = data.timestamps || [];
    const sensorMatrix = [];
    const nPoints = Math.max(...Object.values(data.sensors).map(arr => arr.length));
    
    for (let i = 0; i < nPoints; i++) {
      const row = sensorNames.map(name => {
        const arr = data.sensors[name];
        const val = arr && arr[i] !== undefined ? arr[i] : 0;
        return typeof val === 'number' ? val : parseFloat(val) || 0;
      });
      sensorMatrix.push(row);
    }
    
    if (sensorMatrix.length < 30) {
      throw new Error(`Télémétrie JSON trop courte (${sensorMatrix.length} points, minimum 30).`);
    }
    
    return {
      scenario: { id: 'custom_json', name: `Télémétrie JSON personnalisée (${sensorNames.length} capteurs)` },
      sensorNames,
      timestamps: timestamps.length > 0 ? timestamps : sensorMatrix.map((_, i) => `T_${i}`),
      sensorMatrix,
      groundTruth: null,
    };
  } catch (e) {
    throw new Error(`Parsing JSON échoué : ${e.message}`);
  }
}

/**
 * Parse un fichier Excel de télémétrie (simulation)
 * Note : En production, utiliser xlsx ou exceljs
 * @param {string} excelBase64 - Contenu Excel en base64
 * @returns {Promise<Object>} Télémétrie extraite
 */
async function parseExcelTelemetry(excelBase64) {
  // Simulation d'extraction Excel pour la démo
  // En production : utiliser xlsx ou exceljs
  try {
    const buffer = Buffer.from(excelBase64, 'base64');
    const estimatedRows = Math.floor(buffer.length / 100);
    
    if (estimatedRows < 30) {
      throw new Error('Fichier Excel trop petit (minimum 30 lignes de données).');
    }
    
    // Génération de données simulées pour la démo
    const sensorNames = ['Vibration (mm/s)', 'Température (°C)', 'Pression (bar)', 'Débit (m³/h)'];
    const sensorMatrix = [];
    const timestamps = [];
    
    for (let i = 0; i < estimatedRows; i++) {
      timestamps.push(`T_${i}`);
      sensorMatrix.push([
        1.2 + Math.random() * 0.5,
        45 + Math.random() * 5,
        3.2 + Math.random() * 0.5,
        120 + Math.random() * 10,
      ]);
    }
    
    return {
      scenario: { id: 'custom_excel', name: `Télémétrie Excel personnalisée (${estimatedRows} points)` },
      sensorNames,
      timestamps,
      sensorMatrix,
      groundTruth: null,
    };
  } catch (e) {
    throw new Error(`Extraction Excel échouée : ${e.message}`);
  }
}

/**
 * Détecte le type de fichier de télémétrie
 * @param {string} filename - Nom du fichier
 * @param {string} content - Contenu du fichier (optionnel)
 * @returns {string} Type de fichier : 'csv', 'json', 'excel'
 */
function detectTelemetryFileType(filename, content = null) {
  const ext = filename.split('.').pop().toLowerCase();
  
  if (ext === 'csv') return 'csv';
  if (ext === 'json') return 'json';
  if (ext === 'xlsx' || ext === 'xls') return 'excel';
  if (ext === 'txt') return 'csv'; // TXT traité comme CSV
  
  // Détection par contenu
  if (content) {
    const trimmed = content.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
    if (trimmed.includes(',')) return 'csv'; // Heuristique simple
  }
  
  return 'csv'; // Fallback
}

/**
 * Parse un fichier de télémétrie multi-format
 * @param {Object} file - { filename, content (base64 ou texte), type }
 * @returns {Promise<Object>} Télémétrie extraite
 */
async function parseTelemetryFile(file) {
  const { filename, content, type } = file;
  
  if (!content) {
    throw new Error('Contenu du fichier manquant.');
  }

  const fileType = type || detectTelemetryFileType(filename, content);

  switch (fileType) {
    case 'json':
      return parseJsonTelemetry(content);
    case 'excel':
      return await parseExcelTelemetry(content);
    case 'csv':
    default:
      return parseIndustrialCsv(content);
  }
}

module.exports = {
  parseJsonTelemetry,
  parseExcelTelemetry,
  detectTelemetryFileType,
  parseTelemetryFile,
};
