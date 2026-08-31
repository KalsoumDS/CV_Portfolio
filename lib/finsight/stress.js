/**
 * FinSight R&D - Moteur de Stress-Testing Macro-Économique & Scénarios Historiques Extrêmes
 * Rejeu de crises réelles (Lehman 2008, Covid 2020, Choc Taux 2022, Crise Cyber/Énergie)
 * et chocs factoriels paramétriques.
 */

const SCENARIOS = [
  {
    id: 'lehman_2008',
    name: 'Crise Financière Mondiale (2008 - Lehman)',
    description: 'Effondrement du crédit bancaire, liquidité asséchée et corrélation systématique tendant vers 1.',
    equityShock: -0.42,
    techMultiplier: 1.1,
    volMultiplier: 2.5,
    correlationShift: 0.85,
    durationMonths: 6,
    historicalDrawdownMax: -56.8,
  },
  {
    id: 'covid_2020',
    name: 'Choc de Liquidité Pandémique (Fév-Mars 2020)',
    description: 'Chute la plus rapide de l’histoire des marchés financiers (VIX > 80) suivie d’injections massives des banques centrales.',
    equityShock: -0.34,
    techMultiplier: 0.85, // Résilience relative de la Tech
    volMultiplier: 3.2,
    correlationShift: 0.90,
    durationMonths: 2,
    historicalDrawdownMax: -33.9,
  },
  {
    id: 'stagflation_2022',
    name: 'Choc Inflationniste & Hausse des Taux (2022)',
    description: 'Resserrement monétaire brutal (+450 bps Fed/BCE), compression sévère des multiples de valorisation Tech / Growth.',
    equityShock: -0.25,
    techMultiplier: 1.4, // Tech plus lourdement pénalisée
    volMultiplier: 1.6,
    correlationShift: 0.60,
    durationMonths: 10,
    historicalDrawdownMax: -28.2,
  },
  {
    id: 'geopolitical_energy',
    name: 'Choc Géopolitique & Énergétique Majeur',
    description: 'Flambée des coûts énergétiques, perturbation des chaînes d’approvisionnement et repli vers les valeurs refuges.',
    equityShock: -0.18,
    techMultiplier: 1.2,
    volMultiplier: 1.8,
    correlationShift: 0.70,
    durationMonths: 4,
    historicalDrawdownMax: -22.5,
  },
];

/**
 * Applique un scénario de stress macro sur un portefeuille d'actifs.
 * @param {string[]} tickers - Symboles des actifs
 * @param {number[]} weights - Pondérations (somme = 1)
 * @param {number} notional - Valeur totale du portefeuille
 * @param {string} [scenarioId='lehman_2008'] - Identifiant du scénario
 * @param {number} [customEquityShock=null] - Choc d'actions personnalisé optionnel (-0.15 pour -15%)
 * @param {number} [customVolMultiplier=null] - Multiplicateur de volatilité personnalisé (ex: 2.0)
 * @returns {Object}
 */
function runStressTest(
  tickers,
  weights,
  notional = 100000,
  scenarioId = 'lehman_2008',
  customEquityShock = null,
  customVolMultiplier = null
) {
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  const equityShock = customEquityShock !== null ? customEquityShock : scenario.equityShock;
  const volMultiplier = customVolMultiplier !== null ? customVolMultiplier : scenario.volMultiplier;

  const N = tickers.length;
  const assetImpacts = [];
  let portfolioLossPct = 0;

  for (let i = 0; i < N; i++) {
    const ticker = (tickers[i] || '').toUpperCase();
    let betaSensitivity = 1.0;

    // Sensibilité factorielle par classe d'actifs et profil technologique
    if (['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'AMZN', 'META', 'TSLA', 'TECH'].some((t) => ticker.includes(t))) {
      betaSensitivity = 1.25 * scenario.techMultiplier;
    } else if (['JNJ', 'PG', 'KO', 'DEFENSIVE', 'HEALTH'].some((t) => ticker.includes(t))) {
      betaSensitivity = 0.65;
    } else if (['XOM', 'CVX', 'ENERGY', 'COMMODITY'].some((t) => ticker.includes(t))) {
      betaSensitivity = scenario.id === 'geopolitical_energy' ? -0.2 : 1.1; // Énergie résistante en crise géopolitique
    } else if (['JPM', 'BAC', 'GS', 'BANK', 'FINANCE'].some((t) => ticker.includes(t))) {
      betaSensitivity = scenario.id === 'lehman_2008' ? 1.6 : 1.15;
    }

    const assetLossPct = equityShock * betaSensitivity;
    const assetLossAmount = weights[i] * notional * assetLossPct;
    portfolioLossPct += weights[i] * assetLossPct;

    assetImpacts.push({
      ticker,
      weightPct: Math.round(weights[i] * 1000) / 10,
      sensitivityFactor: Math.round(betaSensitivity * 100) / 100,
      shockPct: Math.round(assetLossPct * 1000) / 10,
      lossAmount: Math.round(assetLossAmount),
      stressedValue: Math.round(weights[i] * notional + assetLossAmount),
    });
  }

  const stressedPortfolioValue = Math.max(0, notional * (1 + portfolioLossPct));
  const totalLossAmount = notional - stressedPortfolioValue;

  // Calcul comparatif sur tous les scénarios pour matrice de résilience
  const benchmarkAllScenarios = SCENARIOS.map((sc) => {
    let pLoss = 0;
    for (let i = 0; i < N; i++) {
      const t = (tickers[i] || '').toUpperCase();
      let sens = 1.0;
      if (['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'AMZN', 'META', 'TSLA'].some((x) => t.includes(x))) {
        sens = 1.25 * sc.techMultiplier;
      }
      pLoss += weights[i] * sc.equityShock * sens;
    }
    return {
      id: sc.id,
      name: sc.name,
      portfolioLossPct: Math.round(pLoss * 1000) / 10,
      lossAmount: Math.round(Math.abs(pLoss * notional)),
      residualValue: Math.round(notional * (1 + pLoss)),
    };
  });

  return {
    activeScenario: {
      id: scenario.id,
      name: scenario.name,
      description: scenario.description,
      volMultiplier,
      correlationShift: scenario.correlationShift,
    },
    results: {
      initialNotional: notional,
      stressedValue: Math.round(stressedPortfolioValue),
      totalLossAmount: Math.round(totalLossAmount),
      portfolioLossPct: Math.round(portfolioLossPct * 1000) / 10, // en %
      resilienceScore: Math.round(Math.max(0, Math.min(100, 100 + portfolioLossPct * 100))),
    },
    assetImpacts,
    allScenarios: benchmarkAllScenarios,
  };
}

module.exports = {
  SCENARIOS,
  runStressTest,
};
