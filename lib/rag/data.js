/**
 * RAG TF-IDF R&D - Parseur CSV Strict pour Corpus Utilisateurs
 * Validation stricte : colonnes id/title/text, rejet des données non conformes
 */

/**
 * Parse un contenu CSV brut pour extraire un corpus de documents.
 * Format attendu : id, title, text (ou colonnes équivalentes détectées automatiquement).
 * Validation stricte : au moins 3 colonnes, contenu textuel non vide.
 * @param {string} csvText
 * @returns {Array<Object>} [{ id, title, text }]
 */
function parseCsvCorpus(csvText) {
  const lines = String(csvText || '')
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    throw new Error(
      'CSV corpus invalide : au moins 2 lignes requises (header + 1 document minimum).'
    );
  }

  const header = lines[0]
    .split(/[,;\t]/)
    .map((h) => h.trim().replace(/['"]/g, ''))
    .filter(Boolean);

  if (header.length < 2) {
    throw new Error('CSV corpus invalide : au moins 2 colonnes attendues (id/title + text).');
  }

  // --- 1. Identifier colonnes id, title, text ---
  let idColIdx = -1;
  let titleColIdx = -1;
  let textColIdx = -1;

  for (let c = 0; c < header.length; c++) {
    const h = header[c].toLowerCase();
    if (/^id$|^doc_id$|^document_id$|^ref$/i.test(h)) {
      idColIdx = c;
    } else if (/^title$|^titre$|^name$|^nom$/i.test(h)) {
      titleColIdx = c;
    } else if (/^text$|^content$|^contenu$|^body$|^description$/i.test(h)) {
      textColIdx = c;
    }
  }

  // Fallback heuristique si les noms ne correspondent pas
  if (titleColIdx === -1) titleColIdx = 0;
  if (textColIdx === -1 && header.length > 1) textColIdx = 1;
  if (idColIdx === -1 && header.length > 2) idColIdx = 2;

  if (textColIdx === -1) {
    throw new Error(
      'Colonne de texte introuvable. Format attendu : une colonne nommée "text", "content", "contenu" ou "body".'
    );
  }

  // --- 2. Parser les lignes ---
  const documents = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/[,;\t]/).map((p) => p.trim().replace(/['"]/g, ''));
    if (parts.length < header.length) continue;

    const id = idColIdx >= 0 ? parts[idColIdx] || `doc_${i}` : `doc_${i}`;
    const title = titleColIdx >= 0 ? parts[titleColIdx] || `Document ${i}` : `Document ${i}`;
    const text = parts[textColIdx] || '';

    if (text.length < 10) {
      // Ignorer les documents avec un texte trop court
      continue;
    }

    documents.push({
      id: String(id).trim(),
      title: String(title).trim(),
      text: String(text).trim(),
    });
  }

  if (documents.length === 0) {
    throw new Error(
      'Aucun document valide extrait. Vérifiez que vos lignes contiennent du texte (min. 10 caractères).'
    );
  }

  return documents;
}

module.exports = {
  parseCsvCorpus,
};
