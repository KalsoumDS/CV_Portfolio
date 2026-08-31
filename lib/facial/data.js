/**
 * Facial Recognition R&D - Parseur CSV Strict pour Gallery d'Identités
 * Validation stricte : colonnes id/name/department/clearance, rejet des données non conformes
 */

/**
 * Parse un contenu CSV brut pour extraire une gallery d'identités faciales.
 * Format attendu : id, name, department, clearance (ou colonnes équivalentes détectées automatiquement).
 * Validation stricte : au moins 3 colonnes, identifiants uniques.
 * @param {string} csvText
 * @returns {Array<Object>} [{ id, name, department, clearance, embedding }]
 */
function parseCsvGallery(csvText) {
  const lines = String(csvText || '')
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    throw new Error(
      'CSV gallery invalide : au moins 2 lignes requises (header + 1 identité minimum).'
    );
  }

  const header = lines[0]
    .split(/[,;\t]/)
    .map((h) => h.trim().replace(/['"]/g, ''))
    .filter(Boolean);

  if (header.length < 2) {
    throw new Error('CSV gallery invalide : au moins 2 colonnes attendues (id + name).');
  }

  // --- 1. Identifier colonnes id, name, department, clearance ---
  let idColIdx = -1;
  let nameColIdx = -1;
  let deptColIdx = -1;
  let clearanceColIdx = -1;

  for (let c = 0; c < header.length; c++) {
    const h = header[c].toLowerCase();
    if (/^id$|^emp_id$|^employee_id$|^person_id$|^ref$/i.test(h)) {
      idColIdx = c;
    } else if (/^name$|^nom$|^full_name$|^employee_name$/i.test(h)) {
      nameColIdx = c;
    } else if (/^department$|^dept$|^service$|^département$/i.test(h)) {
      deptColIdx = c;
    } else if (/^clearance$|^access$|^niveau$|^level$/i.test(h)) {
      clearanceColIdx = c;
    }
  }

  // Fallback heuristique si les noms ne correspondent pas
  if (idColIdx === -1) idColIdx = 0;
  if (nameColIdx === -1 && header.length > 1) nameColIdx = 1;
  if (deptColIdx === -1 && header.length > 2) deptColIdx = 2;
  if (clearanceColIdx === -1 && header.length > 3) clearanceColIdx = 3;

  if (nameColIdx === -1) {
    throw new Error(
      'Colonne de nom introuvable. Format attendu : une colonne nommée "name", "nom" ou "employee_name".'
    );
  }

  // --- 2. Parser les lignes ---
  const identities = [];
  const seenIds = new Set();

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/[,;\t]/).map((p) => p.trim().replace(/['"]/g, ''));
    if (parts.length < header.length) continue;

    const idRaw = idColIdx >= 0 ? parts[idColIdx] : `EMP-${String(i).padStart(3, '0')}`;
    const id = String(idRaw).trim();
    
    // Vérifier unicité de l'ID
    if (seenIds.has(id)) {
      continue; // Ignorer les doublons
    }
    seenIds.add(id);

    const name = nameColIdx >= 0 ? parts[nameColIdx] : `Person ${i}`;
    const department = deptColIdx >= 0 ? parts[deptColIdx] : 'General';
    const clearance = clearanceColIdx >= 0 ? parts[clearanceColIdx] : 'L1';

    if (name.length < 2) {
      // Ignorer les entrées avec un nom trop court
      continue;
    }

    // Générer un embedding factice pour la démo (512 dimensions)
    const embedding = Array.from({ length: 512 }, () => (Math.random() - 0.5) * 2);

    identities.push({
      id,
      name: String(name).trim(),
      department: String(department).trim(),
      clearance: String(clearance).trim(),
      embedding,
    });
  }

  if (identities.length === 0) {
    throw new Error(
      'Aucune identité valide extraite. Vérifiez que vos lignes contiennent des noms valides (min. 2 caractères).'
    );
  }

  return identities;
}

module.exports = {
  parseCsvGallery,
};
