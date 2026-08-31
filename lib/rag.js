/** Corpus réglementaire / ESG indexé pour retrieval + Parseur CSV strict + Document Intelligence Multi-Format. */

const { parseCsvCorpus } = require('./rag/data');
const { processDocumentsToCorpus } = require('./rag/document');

const DOCUMENTS = [
  {
    id: 'csrd-2024',
    title: 'Directive CSRD 2024/1760',
    text: 'La directive CSRD impose aux entreprises de publier un reporting ESG de durabilité annuel. Les obligations incluent la publication des émissions Scope 1, Scope 2 et Scope 3, avec vérification par un auditeur tiers indépendant. Les grandes entreprises doivent divulguer leurs impacts climatiques, sociaux et de gouvernance selon les standards ESRS.',
  },
  {
    id: 'impact-2025',
    title: 'Rapport impact 2025 — section Climat',
    text: "Le rapport d'impact 2025 détaille la trajectoire de décarbonation à horizon 2030. Les émissions Scope 1 et 2 ont diminué de 12 % par rapport à l'année précédente. Le plan climat inclut des objectifs science-based targets validés par la SBTi.",
  },
  {
    id: 'code-travail-184',
    title: 'Code du travail — art. 184',
    text: 'Le droit du travail impose une durée hebdomadaire maximale de 44 heures. Le repos hebdomadaire minimum est de 24 heures consécutives. Les heures supplémentaires sont plafonnées et doivent faire l\'objet d\'une compensation.',
  },
  {
    id: 'accord-sectoriel-2023',
    title: 'Accord sectoriel 2023',
    text: "L'accord sectoriel 2023 prévoit une revalorisation salariale progressive sur trois ans. Il instaure un droit à la déconnexion et renforce les obligations de formation continue.",
  },
  {
    id: 'esg-governance',
    title: 'Guide gouvernance ESG',
    text: "La gouvernance ESG exige un comité dédié au conseil d'administration. Les indicateurs climatiques doivent être intégrés dans la rémunération variable des dirigeants.",
  },
];

function tokenize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .match(/[a-z0-9\u00c0-\u017f]+/g) || [];
}

function buildIndex(docs = DOCUMENTS) {
  const documents = docs.map((d) => ({ ...d, tokens: tokenize(d.text) }));
  const df = {};
  documents.forEach((d) => {
    const seen = new Set();
    d.tokens.forEach((t) => {
      if (!seen.has(t)) {
        df[t] = (df[t] || 0) + 1;
        seen.add(t);
      }
    });
  });
  const n = documents.length;
  documents.forEach((d) => {
    const tf = {};
    d.tokens.forEach((t) => {
      tf[t] = (tf[t] || 0) + 1;
    });
    d.weights = {};
    Object.entries(tf).forEach(([t, c]) => {
      d.weights[t] = (c / d.tokens.length) * Math.log(1 + n / (df[t] || 1));
    });
  });
  return documents;
}

const INDEX = buildIndex();

function score(queryTokens, doc) {
  let s = 0;
  queryTokens.forEach((t) => {
    if (doc.weights[t]) s += doc.weights[t];
  });
  return s;
}

function retrieve(question, index = INDEX, topK = 2) {
  const q = tokenize(question);
  return index.map((d) => ({ ...d, score: score(q, d) }))
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

async function generateGroq(question, context) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return '';
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      max_tokens: 512,
      messages: [
        { role: 'system', content: 'Réponds uniquement à partir du contexte. Réponds en français.' },
        { role: 'user', content: `Contexte:\n${context}\n\nQuestion: ${question}` },
      ],
    }),
  });
  if (!res.ok) return '';
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

function extractiveAnswer(question, hits) {
  if (!hits.length || hits[0].score < 0.01) {
    return "Je n'ai pas trouvé de passage pertinent. Reformulez sur l'ESG, le climat ou le droit du travail.";
  }
  const qSet = new Set(tokenize(question));
  const sentences = hits[0].text.split(/(?<=[.!?])\s+/);
  let best = sentences[0];
  let bestScore = 0;
  sentences.forEach((s) => {
    const overlap = tokenize(s).filter((t) => qSet.has(t)).length;
    if (overlap > bestScore) {
      bestScore = overlap;
      best = s;
    }
  });
  return best;
}

async function analyze({ question, csvData = null, documents = null }) {
  const warnings = [];
  const q = String(question || '').trim();
  if (!q) throw Object.assign(new Error('La question est requise.'), { status: 400 });

  // ============== 1. Ingestion Multi-Format (CSV ou Documents) ==============
  let customDocuments = [];
  let corpusType = 'embedded_esg';
  
  // Priorité aux documents multi-format (PDF, DOCX, TXT)
  if (documents && Array.isArray(documents) && documents.length > 0) {
    try {
      customDocuments = await processDocumentsToCorpus(documents);
      corpusType = 'multi_format_documents';
    } catch (docErr) {
      warnings.push(`Avertissement traitement documents : ${docErr.message} — Corpus embarqué utilisé.`);
    }
  }
  // Fallback CSV si pas de documents
  else if (csvData && typeof csvData === 'string' && csvData.trim().length > 20) {
    try {
      customDocuments = parseCsvCorpus(csvData);
      corpusType = 'custom_csv';
    } catch (parseErr) {
      warnings.push(`Avertissement import CSV corpus : ${parseErr.message} — Corpus embarqué utilisé.`);
    }
  }

  // ============== 2. Construction index avec fallback ==============
  let index;
  try {
    if (customDocuments.length > 0) {
      index = buildIndex(customDocuments);
    } else {
      index = INDEX;
    }
  } catch (indexErr) {
    warnings.push(`Avertissement construction index : ${indexErr.message} — Index par défaut utilisé.`);
    index = INDEX;
  }

  // ============== 3. Retrieval avec fallback ==============
  let hits;
  try {
    hits = retrieve(q, index);
  } catch (retrieveErr) {
    warnings.push(`Avertissement retrieval : ${retrieveErr.message} — Résultats vides retournés.`);
    hits = [];
  }

  // ============== 4. Génération réponse avec fallback ==============
  let answer;
  let engine;
  try {
    const context = hits.map((h) => `[${h.title}] ${h.text}`).join('\n\n');
    const llm = await generateGroq(q, context);
    answer = llm || extractiveAnswer(q, hits);
    engine = llm ? 'groq+tfidf' : 'tfidf-retrieval';
  } catch (genErr) {
    warnings.push(`Avertissement génération réponse : ${genErr.message} — Réponse extractive utilisée.`);
    answer = extractiveAnswer(q, hits);
    engine = 'tfidf-retrieval-fallback';
  }

  return {
    meta: {
      question: q,
      corpusSize: customDocuments.length > 0 ? customDocuments.length : DOCUMENTS.length,
      corpusType,
      supportedFormats: ['PDF', 'DOCX', 'TXT', 'CSV'],
      warnings,
    },
    answer,
    sources: hits.map((h) => ({
      title: h.title,
      id: h.id,
      score: Math.round(h.score * 1000) / 1000,
    })),
    engine,
  };
}

module.exports = { analyze, DOCUMENTS };
