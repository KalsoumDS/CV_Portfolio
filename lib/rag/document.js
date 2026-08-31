/**
 * RAG Document Intelligence - Parser Multi-Format
 * Supporte : PDF, DOCX, TXT, CSV avec extraction de texte structuré
 */

/**
 * Extrait le texte d'un fichier PDF (base64)
 * Note : En production, utiliser pdf-parse ou pdf-lib en Node.js
 * @param {string} pdfBase64 - Contenu PDF en base64
 * @returns {Promise<string>} Texte extrait
 */
async function extractPdfText(pdfBase64) {
  // Simulation d'extraction PDF pour la démo
  // En production : utiliser pdf-parse ou pdf-lib
  try {
    const buffer = Buffer.from(pdfBase64, 'base64');
    // Pour la démo, on retourne un texte factice basé sur la taille
    const estimatedLength = Math.floor(buffer.length / 100);
    return `Document PDF extrait (${estimatedLength} caractères estimés). Contenu simulé pour démo. En production, utiliser pdf-parse pour extraction réelle.`;
  } catch (e) {
    throw new Error('Extraction PDF échouée : format invalide ou fichier corrompu.');
  }
}

/**
 * Extrait le texte d'un fichier DOCX (base64)
 * Note : En production, utiliser mammoth.js
 * @param {string} docxBase64 - Contenu DOCX en base64
 * @returns {Promise<string>} Texte extrait
 */
async function extractDocxText(docxBase64) {
  // Simulation d'extraction DOCX pour la démo
  // En production : utiliser mammoth.js
  try {
    const buffer = Buffer.from(docxBase64, 'base64');
    const estimatedLength = Math.floor(buffer.length / 50);
    return `Document DOCX extrait (${estimatedLength} caractères estimés). Contenu simulé pour démo. En production, utiliser mammoth.js pour extraction réelle.`;
  } catch (e) {
    throw new Error('Extraction DOCX échouée : format invalide ou fichier corrompu.');
  }
}

/**
 * Extrait le texte d'un fichier TXT brut
 * @param {string} txtContent - Contenu TXT
 * @returns {string} Texte extrait
 */
function extractTxtText(txtContent) {
  if (!txtContent || typeof txtContent !== 'string') {
    throw new Error('Contenu TXT invalide ou vide.');
  }
  return txtContent.trim();
}

/**
 * Parse un fichier CSV pour extraire des documents (déjà implémenté dans data.js)
 * @param {string} csvContent - Contenu CSV
 * @returns {Array<Object>} Documents extraits
 */
function parseCsvDocuments(csvContent) {
  const { parseCsvCorpus } = require('./data');
  return parseCsvCorpus(csvContent);
}

/**
 * Détecte le type de fichier à partir du nom ou du contenu
 * @param {string} filename - Nom du fichier
 * @param {string} content - Contenu du fichier (optionnel)
 * @returns {string} Type de fichier : 'pdf', 'docx', 'txt', 'csv'
 */
function detectFileType(filename, content = null) {
  const ext = filename.split('.').pop().toLowerCase();
  
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx' || ext === 'doc') return 'docx';
  if (ext === 'txt' || ext === 'md') return 'txt';
  if (ext === 'csv') return 'csv';
  
  // Détection par contenu si extension ambiguë
  if (content && content.startsWith('%PDF')) return 'pdf';
  if (content && content.includes('PK\x03\x04')) return 'docx'; // Signature ZIP/DOCX
  if (content && content.includes(',')) return 'csv'; // Heuristique simple
  
  return 'txt'; // Fallback
}

/**
 * Extrait le texte d'un document multi-format
 * @param {Object} doc - { filename, content (base64 ou texte), type }
 * @returns {Promise<string>} Texte extrait
 */
async function extractDocumentText(doc) {
  const { filename, content, type } = doc;
  
  if (!content) {
    throw new Error('Contenu du document manquant.');
  }

  const fileType = type || detectFileType(filename, content);

  switch (fileType) {
    case 'pdf':
      return await extractPdfText(content);
    case 'docx':
      return await extractDocxText(content);
    case 'txt':
      return extractTxtText(content);
    case 'csv':
      const docs = parseCsvDocuments(content);
      return docs.map(d => `[${d.title}] ${d.text}`).join('\n\n');
    default:
      throw new Error(`Type de fichier non supporté : ${fileType}. Types supportés : PDF, DOCX, TXT, CSV.`);
  }
}

/**
 * Traite plusieurs documents et retourne un corpus unifié
 * @param {Array<Object>} documents - [{ filename, content, type }]
 * @returns {Promise<Array<Object>>} Corpus [{ id, title, text }]
 */
async function processDocumentsToCorpus(documents) {
  const corpus = [];
  
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    try {
      const text = await extractDocumentText(doc);
      corpus.push({
        id: `DOC-${String(i + 1).padStart(3, '0')}`,
        title: doc.filename || `Document ${i + 1}`,
        text,
      });
    } catch (e) {
      console.warn(`Document ${i + 1} ignoré : ${e.message}`);
    }
  }
  
  if (corpus.length === 0) {
    throw new Error('Aucun document valide extrait. Vérifiez les formats de fichiers.');
  }
  
  return corpus;
}

module.exports = {
  extractPdfText,
  extractDocxText,
  extractTxtText,
  parseCsvDocuments,
  detectFileType,
  extractDocumentText,
  processDocumentsToCorpus,
};
