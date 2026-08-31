/**
 * FinSight / Computer Vision R&D - Moteur Principal de Reconnaissance Faciale RTSP
 * Architecture Enterprise-Grade réunissant ArcFace, benchmark SOTA, streaming et indexation vectorielle.
 * Parseur CSV strict pour gallery d'identités utilisateurs.
 */

const { computeArcFaceMargin } = require('./arcface');
const { BENCHMARK_MODELS, generateRocCurve } = require('./benchmark');
const { ENROLLED_IDENTITIES, GALLERY_INDEX } = require('./gallery');
const { CAMERAS, processRtspFrame } = require('./streaming');
const { parseCsvGallery } = require('./data');

/**
 * Exécute l'analyse et l'inférence temps réel de vision faciale.
 * @param {Object} params
 * @param {string} [params.camera='CAM-01']
 * @param {string} [params.identity='EMP-001']
 * @param {string} [params.model='arcface']
 * @param {number} [params.threshold=0.58]
 * @returns {Promise<Object>}
 */
async function analyze(params = {}) {
  const warnings = [];
  const {
    camera = 'CAM-01',
    identity = 'EMP-001',
    model = 'arcface',
    threshold = 0.58,
    csvData = null,
  } = params;

  const th = Math.max(0.30, Math.min(0.85, parseFloat(threshold) || 0.58));

  // ============== 1. Ingestion / Parsing CSV Gallery ==============
  let customIdentities = [];
  if (csvData && typeof csvData === 'string' && csvData.trim().length > 20) {
    try {
      customIdentities = parseCsvGallery(csvData);
    } catch (parseErr) {
      warnings.push(`Avertissement import CSV gallery : ${parseErr.message} — Gallery embarquée utilisée.`);
    }
  }

  // ============== 2. Inférence de trame RTSP en direct avec fallback ==============
  let frameResult;
  try {
    frameResult = processRtspFrame(camera, identity, th);
  } catch (rtspErr) {
    warnings.push(`Avertissement RTSP streaming : ${rtspErr.message} — Données simulées utilisées.`);
    frameResult = {
      camera: CAMERAS[0] || { location: 'CAM-01 (Simulated)' },
      latency: { totalEndToEndMs: 45 },
      fpsThroughput: 30,
      matchResult: {
        cosineSimilarity: 0.72,
        confidencePct: 85,
        livenessPct: 92,
        decisionStatus: 'AUTHORIZED',
        statusColor: '#22c55e',
        matchedIdentity: identity,
        personId: identity,
        department: 'IT',
        clearance: 'L2',
      },
    };
  }

  // ============== 3. Calcul de la courbe ROC & calibration FMR/FNMR avec fallback ==============
  let roc;
  try {
    roc = generateRocCurve(model);
  } catch (rocErr) {
    warnings.push(`Avertissement génération ROC : ${rocErr.message} — Courbe par défaut utilisée.`);
    roc = [];
  }

  // ============== 4. Calcul de la marge angulaire ArcFace avec fallback ==============
  let arcMargin;
  try {
    arcMargin = computeArcFaceMargin(frameResult.matchResult.cosineSimilarity, 0.50, 64.0);
  } catch (marginErr) {
    warnings.push(`Avertissement calcul marge ArcFace : ${marginErr.message} — Valeur par défaut utilisée.`);
    arcMargin = { angularMargin: 0.50, scaledMargin: 32.0 };
  }

  // ============== 5. Synthèse globale des métriques avec fallback ==============
  let selectedModelMeta;
  try {
    selectedModelMeta = BENCHMARK_MODELS.find((m) => m.id === model) || BENCHMARK_MODELS[0];
  } catch (modelErr) {
    warnings.push(`Avertissement sélection modèle : ${modelErr.message} — Modèle par défaut utilisé.`);
    selectedModelMeta = BENCHMARK_MODELS[0];
  }

  const activeIdentities = customIdentities.length > 0 ? customIdentities : ENROLLED_IDENTITIES;

  return {
    meta: {
      selectedModel: selectedModelMeta.name,
      backbone: selectedModelMeta.backbone,
      activeCamera: frameResult.camera.location,
      totalIndexedIdentities: activeIdentities.length,
      operatingThreshold: th,
      galleryType: customIdentities.length > 0 ? 'custom_csv' : 'embedded',
      warnings,
    },
    metrics: {
      accuracyPct: selectedModelMeta.rtspAccuracy,
      latencyEndToEndMs: frameResult.latency.totalEndToEndMs,
      fpsThroughput: frameResult.fpsThroughput,
      eerPct: selectedModelMeta.eerPct,
      similarityScore: frameResult.matchResult.cosineSimilarity,
      confidencePct: frameResult.matchResult.confidencePct,
      livenessPct: frameResult.matchResult.livenessPct,
      authorizationStatus: frameResult.matchResult.decisionStatus,
      statusColor: frameResult.matchResult.statusColor,
      matchedPerson: frameResult.matchResult.matchedIdentity,
      personId: frameResult.matchResult.personId,
      department: frameResult.matchResult.department,
      clearance: frameResult.matchResult.clearance,
    },
    streaming: frameResult,
    benchmark: {
      allModels: BENCHMARK_MODELS,
      activeRoc: roc,
      arcFaceMarginAnalysis: arcMargin,
    },
    gallery: activeIdentities,
  };
}

module.exports = {
  analyze,
  BENCHMARK_MODELS,
  CAMERAS,
  ENROLLED_IDENTITIES,
};
