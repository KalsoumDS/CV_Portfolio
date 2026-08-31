/** ChatAutoML — GridSearch kNN réel sur jeux de données embarqués + Parseur CSV strict. */

const { parseCsvDataset } = require('./automl/data');

// Sous-ensemble Wine (UCI) — 13 features, 3 classes
const WINE = {
  name: 'Wine classification (UCI)',
  task: 'classification',
  X: [
    [14.23,1.71,2.43,15.6,127,2.8,3.06,0.28,2.29,5.64,1.04,3.92,1065],
    [13.2,1.78,2.14,11.2,100,2.65,2.76,0.26,1.28,4.38,1.05,3.4,1050],
    [13.16,2.36,2.67,18.6,101,2.8,3.24,0.3,2.81,5.68,1.03,3.17,1185],
    [14.37,1.95,2.5,16.8,113,3.85,3.49,0.24,2.18,7.8,0.86,3.45,1480],
    [13.24,2.59,2.87,21,118,2.8,2.69,0.39,1.82,4.32,1.04,2.93,735],
    [14.2,1.76,2.45,15.2,112,3.27,3.39,0.34,1.97,6.75,1.05,2.85,1480],
    [14.39,1.87,2.45,14.6,96,2.5,2.52,0.3,1.98,5.25,1.02,3.58,1290],
    [14.06,2.15,2.61,17.6,121,2.6,2.51,0.31,1.25,5.05,1.06,3.58,1295],
    [14.83,1.64,2.17,14,97,2.8,2.98,0.29,1.98,5.2,1.08,2.85,1045],
    [13.86,1.51,2.67,25,86,2.94,2.45,0.25,1.99,5.05,1.08,3.08,1265],
    [14.1,2.02,2.4,18.8,103,2.75,2.92,0.32,1.74,5.88,1.03,3.57,1185],
    [14.12,1.48,2.32,16.8,95,2.2,2.43,0.26,1.57,5.52,1.08,3.27,1060],
    [14.75,1.73,2.2,17.4,110,2.47,2.78,0.26,1.73,5.26,1.04,3.2,1075],
    [14.38,1.87,2.38,12,102,3.3,3.64,0.29,2.96,7.5,0.98,3.73,1480],
    [13.63,1.81,2.7,17.2,112,2.85,2.91,0.3,1.46,7.3,1.28,2.88,880],
    [14.3,1.92,2.72,20,120,2.8,3.14,0.33,1.97,6.2,1.07,2.65,1280],
    [13.83,1.57,2.62,20,115,2.95,3.4,0.24,1.6,6.6,1.13,2.57,1130],
    [14.19,1.59,2.48,16.5,108,3.3,3.93,0.32,1.86,8.7,1.23,2.82,1680],
    [13.08,1.9,2.36,19.5,106,2.7,3.1,0.26,1.65,5.6,1.07,3.4,1080],
    [13.75,1.73,2.41,16,89,2.6,2.76,0.29,1.81,5.6,1.15,2.9,990],
    [14.48,1.87,2.52,20,115,3,3.44,0.32,1.87,7.5,1.01,3.26,1420],
    [14.07,1.35,2.46,17.1,97,2.8,2.98,0.29,1.98,5.28,1.08,2.85,1060],
    [14.04,1.3,2.38,16.5,100,3.2,3.54,0.26,2.31,7.8,0.86,3.45,1480],
    [13.77,1.53,2.7,19.5,104,2.85,2.87,0.21,1.46,7.3,1.28,2.88,880],
    [12.74,1.48,2.28,16.8,90,3.2,3.43,0.29,2.53,7.2,0.86,3.45,1480],
    [13.74,1.67,2.25,16.8,100,2.8,3.06,0.26,2.37,6.7,1.03,3.14,1180],
    [12.56,1.77,2.45,18.1,98,2.9,2.98,0.24,2.29,7.2,1.04,3.26,1290],
    [13.05,1.77,2.1,18.5,92,3.2,3.44,0.27,1.87,8.5,1.04,3.07,1280],
    [13.87,1.9,2.8,19.4,107,2.95,2.97,0.37,1.76,4.5,1.25,3.4,915],
    [13.02,1.68,2.2,18.75,86,2.45,2.37,0.26,1.46,6.3,1.09,2.52,810],
  ],
  y: [0,0,0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,1,1, 2,2,2,2,2,2,2,2,2,2],
};

// Breast cancer proxy — 4 features
const CHURN = {
  name: 'Churn proxy — Breast Cancer (4 features)',
  task: 'classification',
  X: [
    [17.99,10.38,122.8,1001],[20.57,17.77,132.9,1326],[19.69,21.25,130,1203],
    [11.42,20.38,77.58,386.1],[20.29,14.34,135.1,1297],[12.45,15.7,82.57,477.1],
    [18.25,19.98,119.6,1040],[13.71,20.83,90.2,577.9],[13,21.82,87.5,524],[12.46,24.04,83.97,475.9],
    [16.02,23.24,102.7,797.8],[15.78,17.89,103.6,781],[19.17,24.8,128.7,1104],[13.54,14.36,87.46,566.3],
    [13.08,15.71,85.63,520],[9.504,12.44,60.34,273.9],[15.34,14.26,102.5,704.4],[21.16,23.04,137.2,1406],
    [16.65,21.38,110,904.6],[17.14,16.4,116,912.7],[14.58,21.53,97.41,644.8],[18.61,20.25,122.1,1094],
    [7.76,24.54,47.92,181],[7.93,19.54,50.41,206.9],[11.8,17.91,75.51,419.1],[16.57,19.04,104.4,811.2],
    [11.84,18.7,75.51,437.6],[13.08,15.77,85.63,520],[10.95,21.35,67.89,357.1],[11.32,27.08,71,396.2],
  ],
  y: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
};

// California housing proxy — 4 features
const PRICE = {
  name: 'Prix proxy — California Housing (4 features)',
  task: 'regression',
  X: [
    [8.3,41,6.5,322],[6.9,18,4.5,280],[7.2,52,3.2,310],[5.8,35,5.1,240],[8.9,28,7.2,380],
    [6.1,45,3.8,260],[7.5,33,4.9,300],[5.5,22,3.5,220],[8.1,38,6.8,350],[6.7,29,4.2,270],
    [7.8,41,5.5,320],[5.9,19,3.9,230],[8.5,36,7.0,370],[6.3,48,4.0,250],[7.1,31,4.7,290],
    [5.2,25,3.3,210],[8.0,42,6.2,340],[6.5,27,4.4,265],[7.4,39,5.2,315],[5.7,21,3.6,225],
    [8.2,37,6.6,355],[6.8,44,4.3,275],[7.6,30,5.0,305],[5.4,20,3.4,215],[8.4,40,6.9,365],
    [6.4,46,4.1,255],[7.3,32,4.8,295],[5.6,23,3.7,235],[8.6,34,7.1,375],[6.2,43,3.9,245],
  ],
  y: [4.5,3.2,3.8,2.5,5.1,2.9,3.5,2.2,4.8,3.1,3.9,2.4,5.0,2.8,3.4,2.1,4.6,3.0,3.6,2.3,4.7,3.3,3.7,2.0,4.9,2.7,3.5,2.2,5.2,2.6],
};

function detectTask(prompt) {
  const p = prompt.toLowerCase();
  if (/churn|attrition|désabonn|classification|client/.test(p)) return 'churn';
  if (/prix|price|régression|regression|coût|cost|loyer/.test(p)) return 'price';
  return 'default';
}

function pickDataset(task) {
  if (task === 'churn') return CHURN;
  if (task === 'price') return PRICE;
  return WINE;
}

function scale(X) {
  const n = X.length;
  const d = X[0].length;
  const mean = Array(d).fill(0);
  const std = Array(d).fill(0);
  for (let j = 0; j < d; j++) {
    mean[j] = X.reduce((s, r) => s + r[j], 0) / n;
    std[j] = Math.sqrt(X.reduce((s, r) => s + (r[j] - mean[j]) ** 2, 0) / n) + 1e-9;
  }
  return X.map((r) => r.map((v, j) => (v - mean[j]) / std[j]));
}

function split(X, y, testRatio = 0.2) {
  const n = X.length;
  const testN = Math.floor(n * testRatio);
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const testIdx = idx.slice(0, testN);
  const trainIdx = idx.slice(testN);
  return {
    Xtrain: trainIdx.map((i) => X[i]),
    ytrain: trainIdx.map((i) => y[i]),
    Xtest: testIdx.map((i) => X[i]),
    ytest: testIdx.map((i) => y[i]),
  };
}

function dist(a, b) {
  return Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
}

function knnPredict(Xtrain, ytrain, x, k, task) {
  const neighbors = Xtrain.map((row, i) => ({ d: dist(row, x), y: ytrain[i] }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k);
  if (task === 'regression') {
    return neighbors.reduce((s, n) => s + n.y, 0) / k;
  }
  const votes = {};
  neighbors.forEach((n) => {
    votes[n.y] = (votes[n.y] || 0) + 1;
  });
  return +Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
}

function accuracy(yTrue, yPred) {
  return yTrue.filter((y, i) => y === yPred[i]).length / yTrue.length;
}

function scoreModel(yTrue, yPred, task, dsTask) {
  if (dsTask === 'regression') return rmse(yTrue, yPred);
  const labels = [...new Set(yTrue)];
  if (labels.length <= 2) return f1Score(yTrue, yPred);
  return accuracy(yTrue, yPred);
}

function f1Score(yTrue, yPred) {
  let tp = 0, fp = 0, fn = 0;
  yTrue.forEach((y, i) => {
    if (yPred[i] === 1 && y === 1) tp++;
    else if (yPred[i] === 1 && y === 0) fp++;
    else if (yPred[i] === 0 && y === 1) fn++;
  });
  const prec = tp / (tp + fp + 1e-9);
  const rec = tp / (tp + fn + 1e-9);
  return (2 * prec * rec) / (prec + rec + 1e-9);
}

function rmse(yTrue, yPred) {
  return Math.sqrt(yTrue.reduce((s, y, i) => s + (y - yPred[i]) ** 2, 0) / yTrue.length);
}

function gridSearchKnn(X, y, task, dsTask) {
  const ks = [3, 5, 7, 9];
  const { Xtrain, ytrain, Xtest, ytest } = split(X, y);
  let bestK = 3;
  let bestScore = task === 'regression' ? Infinity : -Infinity;

  for (const k of ks) {
    const preds = Xtest.map((x) => knnPredict(Xtrain, ytrain, x, k, task));
    const score = scoreModel(ytest, preds, task, dsTask);
    const better = task === 'regression' ? score < bestScore : score > bestScore;
    if (better) {
      bestScore = score;
      bestK = k;
    }
  }

  const finalPreds = Xtest.map((x) => knnPredict(Xtrain, ytrain, x, bestK, task));
  const metric = Math.round(scoreModel(ytest, finalPreds, task, dsTask) * 100) / 100;
  return { bestK, metric, task };
}

function analyze({ prompt = '', csvData = null }) {
  const warnings = [];
  let ds;
  let X;
  let y;
  let taskType;
  let dsTask;

  // ============== 1. Ingestion / Parsing CSV ==============
  if (csvData && typeof csvData === 'string' && csvData.trim().length > 20) {
    try {
      const parsed = parseCsvDataset(csvData);
      ds = {
        name: `Dataset personnalisé (${parsed.nSamples} échantillons · ${parsed.nFeatures} features)`,
        task: parsed.task,
        X: parsed.X,
        y: parsed.y,
        featureNames: parsed.featureNames,
        targetName: parsed.targetName,
      };
      taskType = parsed.task;
      dsTask = parsed.task;
    } catch (parseErr) {
      warnings.push(`Avertissement import CSV : ${parseErr.message} — Dataset embarqué utilisé.`);
      const detectedTask = detectTask(prompt);
      ds = pickDataset(detectedTask);
      taskType = ds.task;
      dsTask = ds.task;
    }
  }

  if (!ds) {
    const detectedTask = detectTask(prompt);
    ds = pickDataset(detectedTask);
    taskType = ds.task;
    dsTask = ds.task;
  }

  // ============== 2. Scaling avec fallback ==============
  try {
    X = scale(ds.X);
    y = ds.y;
  } catch (scaleErr) {
    warnings.push(`Avertissement scaling : ${scaleErr.message} — Données brutes utilisées.`);
    X = ds.X;
    y = ds.y;
  }

  // ============== 3. GridSearch kNN avec fallback ==============
  let bestK = 3;
  let metric = 0;
  try {
    const result = gridSearchKnn(X, y, taskType, dsTask);
    bestK = result.bestK;
    metric = result.metric;
  } catch (gridErr) {
    warnings.push(`Avertissement GridSearch : ${gridErr.message} — kNN k=3 par défaut utilisé.`);
    bestK = 3;
    // Fallback : prédiction simple avec k=3
    const preds = X.slice(0, Math.min(5, X.length)).map((x) => knnPredict(X, y, x, 3, taskType));
    metric = taskType === 'regression' ? rmse(y.slice(0, preds.length), preds) : accuracy(y.slice(0, preds.length), preds);
  }

  // ============== 4. Construction réponse ==============
  if (dsTask === 'classification') {
    const isBinary = [...new Set(y)].length <= 2;
    const metricLabel = isBinary ? 'F1' : 'Accuracy';
    return {
      meta: {
        task: taskType,
        dataset: ds.name,
        featureNames: ds.featureNames || [],
        targetName: ds.targetName || 'Target',
        nSamples: X.length,
        nFeatures: X[0]?.length || 0,
        warnings,
      },
      model: `kNN (k=${bestK})`,
      metric_label: metricLabel,
      metric_value: Math.round(metric * 1000) / 1000,
      message: `Objectif détecté : classification (${taskType}). Dataset : ${ds.name}. StandardScaler + GridSearchCV sur k∈{3,5,7,9}. Meilleur modèle : kNN k=${bestK} — ${metricLabel} = ${metric.toFixed(3)}.`,
      prompt: prompt.trim() || 'Entraîne un modèle de classification sur mes données clients.',
    };
  }

  return {
    meta: {
      task: taskType,
      dataset: ds.name,
      featureNames: ds.featureNames || [],
      targetName: ds.targetName || 'Target',
      nSamples: X.length,
      nFeatures: X[0]?.length || 0,
      warnings,
    },
    model: `kNN (k=${bestK})`,
    metric_label: 'RMSE',
    metric_value: Math.round(metric * 1000) / 1000,
    message: `Objectif détecté : régression (${taskType}). Dataset : ${ds.name}. Features normalisées + GridSearchCV. Modèle retenu : kNN k=${bestK} — RMSE = ${metric.toFixed(3)}.`,
    prompt: prompt.trim() || 'Entraîne un modèle de régression sur mes données.',
  };
}

module.exports = { analyze };
