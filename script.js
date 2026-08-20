const T = {
  fr: {
    'nav.about': 'À propos',
    'nav.services': 'Services',
    'nav.skills': 'Compétences',
    'nav.caseStudies': 'Projets phares',
    'nav.projects': 'Projets',
    'nav.journey': 'Parcours',
    'nav.contact': 'Contact',
    'nav.chat': 'Assistant IA',
    'hero.subtitle': 'Data Scientist & ML Engineer — Maths appliquées & optimisation · Maroc · Sénégal',
    'hero.available': 'Freelance · Conseil',
    'hero.intro': 'J\'aide les équipes à transformer des données, des modèles et des idées en produits IA utiles, robustes et prêts à être mis en production.',
    'hero.cta1': 'Voir mon travail',
    'hero.cta2': 'Me contacter',
    'terminal.prompt': 'Qu\'est-ce qui vous amène ?',
    'terminal.hint': 'CHOIX OU MESSAGE LIBRE — ENTRÉE POUR VALIDER',
    'terminal.c1': '[ 1 ] Vous recruter',
    'terminal.c2': '[ 2 ] Voir mon travail',
    'terminal.c3': '[ 3 ] Juste explorer',
    'terminal.restart': 'RECOMMENCER',
    'terminal.scroll': 'SCROLL',
    'terminal.scrollHint': 'scroll ↓',
    'terminal.recruit': 'Parfait — parlons de votre mission. Je suis disponible pour freelance, CDD et remote.',
    'terminal.work': 'Voici une sélection de mes projets phares. Faites défiler pour explorer.',
    'terminal.explore': 'Prenez votre temps — découvrez mon parcours, mes valeurs et mon approche.',
    'terminal.unknown': 'Je n\'ai pas compris. Tapez 1, 2 ou 3 — ou posez une question libre.',
    'about.tag': 'À propos',
    'about.lead': 'Data Scientist avec une base quantitative en mathématiques appliquées : je traduis des contraintes industrielles en modèles d\'optimisation, pipelines de données et systèmes prédictifs déployés.',
    'about.bio': 'Licence de mathématiques appliquées (analyse numérique, programmation linéaire, processus stochastiques) puis Master Data Science & IA. Aujourd\'hui R&D Data Scientist chez ABA Technology, je travaille sur la vision par ordinateur temps réel et les séries temporelles industrielles, du prototype au code de production.',
    'about.loc.val': 'Maroc · Sénégal',
    'about.locationTag': 'Basée au Maroc · Disponible globalement',
    'services.tag': 'Services',
    'services.s1.title': 'Stratégie Data & IA',
    'services.s2.title': 'Systèmes ML sur mesure',
    'services.s3.title': 'Déploiement & MLOps',
    'skills.tag': 'Compétences',
    'skills.g1.title': 'ML & Deep Learning',
    'skills.g2.title': 'Vision & NLP',
    'skills.g3.title': 'Data & MLOps',
    'skills.g4.title': 'Maths & Optimisation',
    'cv.download': 'Télécharger le CV',
    'metric.latency': 'latence par image',
    'metric.models': 'modèles benchmarkés (ArcFace · AdaFace · VGGFace2)',
    'metric.streams': 'validation RTSP multi-caméras',
    'metric.var': 'méthodes de VaR validées par test de Kupiec POF',
    'metric.features': 'features techniques, walk-forward 5-fold sans fuite',
    'metric.costs': 'frais & slippage simulés (Sharpe · Sortino · Calmar)',
    'metric.alert': 'd\'anticipation avant rupture',
    'metric.sensors': 'capteurs fusionnés (vibration · température · pression · débit)',
    'metric.threshold': 'seuil calibré sur precision/recall',
    'values.tag': 'Valeurs',
    'values.v1.title': 'Impact',
    'values.v1.desc': 'Chaque décision vise un résultat mesurable.',
    'values.v2.title': 'Clarté',
    'values.v2.desc': 'La complexité est un problème à résoudre, pas à exposer.',
    'values.v3.title': 'Craft',
    'values.v3.desc': 'Le soin dans les détails distingue le bon du remarquable.',
    'process.tag': 'Processus',
    'process.title': 'Du concept à la production.',
    'process.p1.title': 'Découverte',
    'process.p1.sub': 'Recherche & Stratégie',
    'process.p1.desc': 'Comprendre le problème sous tous ses angles. Cartographier les parcours data, exposer les vraies contraintes — pas celles supposées.',
    'process.p2.title': 'Design',
    'process.p2.sub': 'Architecture & Prototypage',
    'process.p2.desc': 'Architecture ML, prototypage rapide, validation de la faisabilité technique et définition des KPIs de succès.',
    'process.p3.title': 'Build',
    'process.p3.sub': 'Ingénierie & Livraison',
    'process.p3.desc': 'Développement itératif, tests rigoureux, intégration continue et préparation au déploiement en production.',
    'process.p4.title': 'Croissance',
    'process.p4.sub': 'Analytics & Scale',
    'process.p4.desc': 'Monitoring MLflow, analytics, optimisation continue et accompagnement pour l\'adoption et l\'échelle.',
    'exp.c2.title': 'Computer Vision temps réel',
    'exp.c4.title': 'NLP, RAG & assistants',
    'exp.c5.title': 'BI & aide à la décision',
    'analytics.stat.experience': 'Années d\'expertise',
    'analytics.stat.projects': 'Projets documentés',
    'proof.tag': 'Projets phares',
    'proof.title': 'Études de cas & produits',
    'proof.intro': 'Trois systèmes détaillés de bout en bout : le problème, l\'approche mathématique, l\'architecture et les résultats mesurés.',
    'proof.master.title': 'Reconnaissance faciale temps réel sur flux RTSP',
    'proof.master.desc': 'Contrôle d\'accès industriel sur flux caméras : pipeline de détection et d\'identification temps réel, benchmark comparatif de trois architectures d\'embeddings et validation multi-caméras sous contraintes de production.',
    'proof.finsight.title': 'Finsight — Risque de portefeuille & signaux ML',
    'proof.finsight.desc': 'Plateforme de recherche quantitative : moteur de risque (VaR historique, paramétrique et Monte-Carlo GBM, CVaR, VaR composante), signaux directionnels ML et backtesting avec frais et slippage réalistes.',
    'proof.anomaly.title': 'Maintenance prédictive industrielle (séries temporelles IoT)',
    'proof.anomaly.desc': 'Détection précoce de dérives sur équipements industriels : autoencodeur séquentiel PyTorch entraîné sur le régime nominal, score d\'anomalie par erreur de reconstruction et seuillage calibré sur ROC-AUC.',
    'proj.tag': 'Autres projets',
    'proj.title': 'Applications testables',
    'proj.intro': 'Prototypes d\'IA générative déployés en ligne, code source ouvert.',
    'proj.rag.desc': 'Interrogation de corpus réglementaires et rapports ESG en langage naturel : retrieval MMR sur ChromaDB, réponses sourcées avec citation page et paragraphe (LangChain · Mistral AI).',
    'proj.automl.desc': 'Assistant conversationnel AutoML pour équipes non techniques : prétraitement automatique, comparaison Random Forest / Gradient Boosting / XGBoost et recherche d\'hyperparamètres Optuna.',
    'proj.demo': 'Démo live',
    'journey.tag': 'Parcours',
    'journey.title': 'Expérience & formation',
    'journey.experience': 'Expérience',
    'journey.formation': 'Formation',
    'journey.present': 'présent',
    'journey.aba': 'R&D Data Scientist',
    'journey.aba.org': 'ABA Technology / Nextronic — Casablanca',
    'journey.aba.desc': 'Deep learning, computer vision, validation de modèles et prototypes industriels temps réel.',
    'journey.freelance': 'Freelance Data Scientist & ML Consultant',
    'journey.freelance.org': 'Remote — projets indépendants',
    'journey.freelance.desc': 'Pipelines data, scraping, modélisation statistique, visualisations et solutions ML sur mesure.',
    'journey.master': 'Master Data Science & IA',
    'journey.master.org': 'Mundiapolis University of Casablanca',
    'journey.licence': 'Licence Mathématiques Appliquées',
    'journey.licence.org': 'ISM Dakar — Sénégal',
    'contact.tag': 'Contact',
    'contact.title': 'Travaillons ensemble.',
    'contact.copy': 'Je collabore sur des missions freelance, des prototypes IA, des dashboards analytiques et des sujets de computer vision ou NLP.',
    'contact.emailBtn': 'Envoyer un message',
    'contact.chatBtn': 'Discuter avec mon assistant IA',
    'footer.desc': 'Data Scientist & ML Engineer — produits IA, vision par ordinateur et déploiement ML pour des cas d\'usage concrets.',
    'footer.nav': 'Navigation',
    'footer.contact': 'Contact',
    'chat.status': 'Assistant IA · En ligne',
    'chat.placeholder': 'Posez une question…',
    'chat.welcome': 'Bonjour. Je suis l\'assistant d\'Oumou Kaltoum Sall. Posez-moi vos questions sur son parcours, ses compétences ou ses projets.',
    'chat.fallback': 'Je n\'ai pas trouvé de réponse précise. Essayez : projets, compétences, disponibilité, contact ou formation.',
    'chip.projects': 'Projets',
    'chip.skills': 'Compétences',
    'chip.availability': 'Disponibilité',
    'chip.contact': 'Contact',
    'chip.education': 'Formation'
  },
  en: {
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.skills': 'Skills',
    'nav.caseStudies': 'Featured work',
    'nav.projects': 'Projects',
    'nav.journey': 'Journey',
    'nav.contact': 'Contact',
    'nav.chat': 'AI Assistant',
    'hero.subtitle': 'Data Scientist & ML Engineer — Applied Mathematics & Optimization · Morocco · Senegal',
    'hero.available': 'Freelance · Advisory',
    'hero.intro': 'I help teams turn data, models and ideas into useful, robust AI products ready for production.',
    'hero.cta1': 'View my work',
    'hero.cta2': 'Contact me',
    'terminal.prompt': 'What brings you here?',
    'terminal.hint': 'CHOICE OR FREE MESSAGE — ENTER TO SUBMIT',
    'terminal.c1': '[ 1 ] Recruit me',
    'terminal.c2': '[ 2 ] View my work',
    'terminal.c3': '[ 3 ] Just explore',
    'terminal.restart': 'RESTART',
    'terminal.scroll': 'SCROLL',
    'terminal.scrollHint': 'scroll ↓',
    'terminal.recruit': 'Great — let\'s talk about your mission. I\'m available for freelance, contracts and remote work.',
    'terminal.work': 'Here\'s a selection of my featured projects. Scroll to explore.',
    'terminal.explore': 'Take your time — discover my journey, values and approach.',
    'terminal.unknown': 'I didn\'t understand. Type 1, 2 or 3 — or ask a free question.',
    'about.tag': 'About',
    'about.lead': 'Data Scientist with a rigorous quantitative foundation in applied mathematics: I translate industrial constraints into optimization models, data pipelines and deployed predictive systems.',
    'about.bio': 'B.Sc. in Applied Mathematics (numerical analysis, linear programming, stochastic processes) then M.Sc. in Data Science & AI. Now R&D Data Scientist at ABA Technology, working on real-time computer vision and industrial time series, from prototype to production-grade code.',
    'about.loc.val': 'Morocco · Senegal',
    'about.locationTag': 'Based in Morocco · Available globally',
    'services.tag': 'Services',
    'services.s1.title': 'Data & AI Strategy',
    'services.s2.title': 'Custom ML Systems',
    'services.s3.title': 'Deployment & MLOps',
    'skills.tag': 'Skills',
    'skills.g1.title': 'ML & Deep Learning',
    'skills.g2.title': 'Vision & NLP',
    'skills.g3.title': 'Data & MLOps',
    'skills.g4.title': 'Maths & Optimization',
    'cv.download': 'Download CV',
    'metric.latency': 'latency per frame',
    'metric.models': 'benchmarked models (ArcFace · AdaFace · VGGFace2)',
    'metric.streams': 'multi-camera RTSP validation',
    'metric.var': 'VaR methods validated with the Kupiec POF test',
    'metric.features': 'engineered features, leak-free 5-fold walk-forward',
    'metric.costs': 'simulated fees & slippage (Sharpe · Sortino · Calmar)',
    'metric.alert': 'early warning before failure',
    'metric.sensors': 'fused sensors (vibration · temperature · pressure · flow)',
    'metric.threshold': 'threshold calibrated on precision/recall',
    'values.tag': 'Values',
    'values.v1.title': 'Impact',
    'values.v1.desc': 'Every decision aims for measurable results.',
    'values.v2.title': 'Clarity',
    'values.v2.desc': 'Complexity is a problem to solve, not to expose.',
    'values.v3.title': 'Craft',
    'values.v3.desc': 'Attention to detail distinguishes good from remarkable.',
    'process.tag': 'Process',
    'process.title': 'From concept to production.',
    'process.p1.title': 'Discovery',
    'process.p1.sub': 'Research & Strategy',
    'process.p1.desc': 'Understand the problem from every angle. Map data journeys, expose real constraints — not assumed ones.',
    'process.p2.title': 'Design',
    'process.p2.sub': 'Architecture & Prototyping',
    'process.p2.desc': 'ML architecture, rapid prototyping, technical feasibility validation and success KPIs definition.',
    'process.p3.title': 'Build',
    'process.p3.sub': 'Engineering & Delivery',
    'process.p3.desc': 'Iterative development, rigorous testing, continuous integration and production deployment preparation.',
    'process.p4.title': 'Growth',
    'process.p4.sub': 'Analytics & Scale',
    'process.p4.desc': 'MLflow monitoring, analytics, continuous optimization and support for adoption and scaling.',
    'exp.c2.title': 'Real-time Computer Vision',
    'exp.c4.title': 'NLP, RAG & Assistants',
    'exp.c5.title': 'BI & Decision Support',
    'analytics.stat.experience': 'Years of expertise',
    'analytics.stat.projects': 'Documented projects',
    'proof.tag': 'Featured work',
    'proof.title': 'Case studies & products',
    'proof.intro': 'Three systems detailed end to end: the problem, the mathematical approach, the architecture and the measured results.',
    'proof.master.title': 'Real-time facial recognition on RTSP streams',
    'proof.master.desc': 'Industrial access control on camera streams: real-time detection and identification pipeline, comparative benchmark of three embedding architectures and multi-camera validation under production constraints.',
    'proof.finsight.title': 'Finsight — Portfolio risk & ML signals',
    'proof.finsight.desc': 'Quantitative research platform: risk engine (historical, parametric and Monte-Carlo GBM VaR, CVaR, Component VaR), ML directional signals and backtesting with realistic fees and slippage.',
    'proof.anomaly.title': 'Industrial predictive maintenance (IoT time series)',
    'proof.anomaly.desc': 'Early drift detection on industrial equipment: sequential PyTorch autoencoder trained on nominal regime, reconstruction-error anomaly score and threshold calibrated on ROC-AUC.',
    'proj.tag': 'Other projects',
    'proj.title': 'Testable applications',
    'proj.intro': 'Generative AI prototypes deployed online, with open source code.',
    'proj.rag.desc': 'Querying regulatory corpora and ESG reports in natural language: MMR retrieval on ChromaDB, sourced answers with exact page and paragraph citations (LangChain · Mistral AI).',
    'proj.automl.desc': 'Conversational AutoML assistant for non-technical teams: automatic preprocessing, Random Forest / Gradient Boosting / XGBoost comparison and Optuna hyperparameter search.',
    'proj.demo': 'Live demo',
    'journey.tag': 'Journey',
    'journey.title': 'Experience & education',
    'journey.experience': 'Experience',
    'journey.formation': 'Education',
    'journey.present': 'present',
    'journey.aba': 'R&D Data Scientist',
    'journey.aba.org': 'ABA Technology / Nextronic — Casablanca',
    'journey.aba.desc': 'Deep learning, computer vision, model validation and real-time industrial prototypes.',
    'journey.freelance': 'Freelance Data Scientist & ML Consultant',
    'journey.freelance.org': 'Remote — independent projects',
    'journey.freelance.desc': 'Data pipelines, scraping, statistical modelling, visualizations and custom ML solutions.',
    'journey.master': 'Master Data Science & AI',
    'journey.master.org': 'Mundiapolis University of Casablanca',
    'journey.licence': 'Bachelor Applied Mathematics',
    'journey.licence.org': 'ISM Dakar — Senegal',
    'contact.tag': 'Contact',
    'contact.title': 'Let\'s work together.',
    'contact.copy': 'I collaborate on freelance engagements, AI prototypes, analytical dashboards and computer vision or NLP topics.',
    'contact.emailBtn': 'Send a message',
    'contact.chatBtn': 'Chat with my AI assistant',
    'footer.desc': 'Data Scientist & ML Engineer — AI products, computer vision and ML deployment for concrete use cases.',
    'footer.nav': 'Navigation',
    'footer.contact': 'Contact',
    'chat.status': 'AI Assistant · Online',
    'chat.placeholder': 'Ask a question…',
    'chat.welcome': 'Hello. I\'m Oumou Kaltoum Sall\'s assistant. Ask me about her background, skills or projects.',
    'chat.fallback': 'I couldn\'t find a precise answer. Try: projects, skills, availability, contact or education.',
    'chip.projects': 'Projects',
    'chip.skills': 'Skills',
    'chip.availability': 'Availability',
    'chip.contact': 'Contact',
    'chip.education': 'Education'
  }
};

const FAQ = {
  fr: [
    { k: ['projet', 'réalisation', 'travail', 'github', 'aba', 'finsight', 'automl', 'rag', 'anomalie'], a: () => '<b>Projets phares :</b><br>• Reconnaissance faciale temps réel RTSP — &lt;35 ms, 3 modèles benchmarkés (ABA Technology)<br>• Finsight — VaR/CVaR, test de Kupiec, backtesting avec frais réalistes<br>• Maintenance prédictive IoT — autoencodeur PyTorch, alerte &lt;15 min<br><br><b>Autres :</b> Intelligence Documentaire RAG, ChatAutoML.' },
    { k: ['compétence', 'skill', 'stack', 'python', 'pytorch', 'maths', 'optimisation'], a: () => 'Compétences : Python, C++, SQL, PyTorch, TensorFlow, OpenCV, FastAPI, Docker, Linux, MLflow, LangChain.<br>Socle mathématique : optimisation numérique, séries temporelles, processus stochastiques, modélisation statistique.' },
    { k: ['cv', 'résumé', 'pdf'], a: () => 'Le CV est téléchargeable ici : <a href="assets/CV-Oumou-Kaltoum-Sall.pdf" download>CV Oumou Kaltoum Sall (PDF)</a>' },
    { k: ['disponible', 'freelance', 'recrut', 'emploi', 'remote'], a: () => 'Disponible pour freelance, CDD et remote — Maroc, Sénégal.<br>Email : oumoukaltoumsall@gmail.com' },
    { k: ['contact', 'email', 'linkedin'], a: () => 'Email : oumoukaltoumsall@gmail.com<br>LinkedIn · GitHub' },
    { k: ['formation', 'master', 'diplôme'], a: () => 'Master Data Science & IA — Mundiapolis<br>Licence Mathématiques Appliquées — ISM Dakar' },
    { k: ['bonjour', 'salut', 'hello'], a: () => 'Bonjour ! Posez-moi vos questions ou utilisez les boutons ci-dessous.' }
  ],
  en: [
    { k: ['project', 'work', 'github', 'aba', 'finsight', 'automl', 'rag', 'anomaly'], a: () => '<b>Featured work:</b><br>• Real-time RTSP facial recognition — &lt;35 ms, 3 benchmarked models (ABA Technology)<br>• Finsight — VaR/CVaR, Kupiec test, backtesting with realistic costs<br>• Industrial predictive maintenance — PyTorch autoencoder, &lt;15 min early warning<br><br><b>Other:</b> RAG Document Intelligence, ChatAutoML.' },
    { k: ['skill', 'stack', 'python', 'pytorch', 'math', 'optimization'], a: () => 'Skills: Python, C++, SQL, PyTorch, TensorFlow, OpenCV, FastAPI, Docker, Linux, MLflow, LangChain.<br>Mathematical foundation: numerical optimization, time series, stochastic processes, statistical modelling.' },
    { k: ['cv', 'resume', 'pdf'], a: () => 'You can download the CV here: <a href="assets/CV-Oumou-Kaltoum-Sall.pdf" download>Oumou Kaltoum Sall CV (PDF)</a>' },
    { k: ['available', 'freelance', 'hire', 'remote'], a: () => 'Available for freelance, contracts and remote — Morocco, Senegal.' },
    { k: ['contact', 'email', 'linkedin'], a: () => 'Email: oumoukaltoumsall@gmail.com' },
    { k: ['education', 'master', 'degree'], a: () => 'Master Data Science & AI — Mundiapolis · ISM Dakar' },
    { k: ['hello', 'hi', 'hey'], a: () => 'Hello! Ask me anything or use the buttons below.' }
  ]
};

const TERMINAL_TARGETS = {
  recruit: '#contact',
  work: '#case-studies',
  explore: '#about'
};

let lang = localStorage.getItem('lang') || 'fr';
let theme = localStorage.getItem('theme') || 'dark';
let terminalActive = false;

const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const terminalInput = document.getElementById('terminalInput');
const terminalChoices = document.getElementById('terminalChoices');
const terminalLog = document.getElementById('terminalLog');
const terminalRestart = document.getElementById('terminalRestart');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotChips = document.getElementById('chatbotChips');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');

function applyLang(l) {
  lang = l;
  localStorage.setItem('lang', l);
  document.documentElement.lang = l;
  langLabel.textContent = l === 'fr' ? 'EN' : 'FR';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (T[l][key] !== undefined) el.textContent = T[l][key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (T[l][key] !== undefined) el.placeholder = T[l][key];
  });

  renderChips();
  if (!terminalActive) resetChat();
}

function applyTheme(t) {
  theme = t;
  localStorage.setItem('theme', t);
  document.documentElement.setAttribute('data-theme', t);
}

langToggle.addEventListener('click', () => applyLang(lang === 'fr' ? 'en' : 'fr'));
themeToggle.addEventListener('click', () => applyTheme(theme === 'light' ? 'dark' : 'light'));
applyTheme(theme);

function openMenu() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (hamburger.classList.contains('open')) closeMenu();
  else openMenu();
});
overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.drawer-link').forEach(link => link.addEventListener('click', closeMenu));

const revObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ── Terminal ── */
function handleTerminalAction(action, userText) {
  terminalActive = true;
  terminalChoices.classList.add('hidden');
  terminalRestart.hidden = false;

  const labels = {
    recruit: T[lang]['terminal.c1'],
    work: T[lang]['terminal.c2'],
    explore: T[lang]['terminal.c3']
  };

  const responses = {
    recruit: T[lang]['terminal.recruit'],
    work: T[lang]['terminal.work'],
    explore: T[lang]['terminal.explore']
  };

  const display = userText || labels[action] || userText;
  terminalLog.innerHTML = `<p class="log-user">${display}</p><p class="log-bot">${responses[action] || T[lang]['terminal.unknown']}</p>`;

  setTimeout(() => {
    const target = TERMINAL_TARGETS[action];
    if (target) {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, 600);
}

function parseTerminalInput(value) {
  const v = value.trim().toLowerCase();
  if (v === '1' || v.includes('recrut') || v.includes('hire') || v.includes('emploi') || v.includes('job')) return 'recruit';
  if (v === '2' || v.includes('travail') || v.includes('projet') || v.includes('work') || v.includes('project')) return 'work';
  if (v === '3' || v.includes('explor') || v.includes('découvr') || v.includes('discover')) return 'explore';

  const faqMatch = FAQ[lang].find(item => item.k.some(k => v.includes(k)));
  if (faqMatch) {
    terminalActive = true;
    terminalChoices.classList.add('hidden');
    terminalRestart.hidden = false;
    terminalLog.innerHTML = `<p class="log-user">${value}</p><p class="log-bot">${faqMatch.a()}</p>`;
    return null;
  }

  if (v.includes('contact') || v.includes('email') || v.includes('mail')) return 'recruit';
  return null;
}

function submitTerminal(value) {
  if (!value.trim()) return;
  const action = parseTerminalInput(value);
  if (action) handleTerminalAction(action, value.trim());
  else if (!terminalActive) {
    terminalActive = true;
    terminalChoices.classList.add('hidden');
    terminalRestart.hidden = false;
    terminalLog.innerHTML = `<p class="log-user">${value}</p><p class="log-bot">${T[lang]['terminal.unknown']}</p>`;
  }
  terminalInput.value = '';
}

document.querySelectorAll('.terminal-choice').forEach(btn => {
  btn.addEventListener('click', () => handleTerminalAction(btn.dataset.action));
});

terminalInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') submitTerminal(terminalInput.value);
});

terminalRestart.addEventListener('click', () => {
  terminalActive = false;
  terminalLog.innerHTML = '';
  terminalChoices.classList.remove('hidden');
  terminalRestart.hidden = true;
  terminalInput.value = '';
  terminalInput.focus();
  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
});

/* ── Process scroll ── */
const processSection = document.getElementById('process');
const processNavBtns = document.querySelectorAll('.process-nav-btn');
const processPanels = document.querySelectorAll('.process-step-panel');

function setProcessStep(index) {
  processNavBtns.forEach((btn, i) => btn.classList.toggle('active', i === index));
  processPanels.forEach((panel, i) => panel.classList.toggle('active', i === index));
}

processNavBtns.forEach(btn => {
  btn.addEventListener('click', () => setProcessStep(Number(btn.dataset.step)));
});

function updateProcessOnScroll() {
  if (!processSection) return;
  const rect = processSection.getBoundingClientRect();
  const scrollable = processSection.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return;

  const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
  const progress = scrolled / scrollable;
  const step = Math.min(Math.floor(progress * 4), 3);
  setProcessStep(step);
}

window.addEventListener('scroll', updateProcessOnScroll, { passive: true });

/* ── Chatbot ── */
function openChat() {
  chatbotPanel.classList.add('open');
  chatbotPanel.setAttribute('aria-hidden', 'false');
  chatbotToggle.classList.add('hidden');
  chatbotInput.focus();
}

function closeChat() {
  chatbotPanel.classList.remove('open');
  chatbotPanel.setAttribute('aria-hidden', 'true');
  chatbotToggle.classList.remove('hidden');
}

function addMessage(html, type) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  msg.innerHTML = html;
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function respondToMessage(text) {
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot chat-typing';
  typing.innerHTML = '<p>…</p>';
  chatbotMessages.appendChild(typing);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const lower = text.toLowerCase();
    const match = FAQ[lang].find(item => item.k.some(k => lower.includes(k)));
    addMessage(match ? match.a() : T[lang]['chat.fallback'], 'bot');
  }, 500);
}

function sendChatMessage(text) {
  const msg = text.trim();
  if (!msg) return;
  addMessage(`<p>${msg}</p>`, 'user');
  chatbotInput.value = '';
  respondToMessage(msg);
}

function resetChat() {
  chatbotMessages.innerHTML = '';
  addMessage(`<p>${T[lang]['chat.welcome']}</p>`, 'bot');
}

function renderChips() {
  const chips = [
    { key: 'chip.projects', query: lang === 'fr' ? 'Quels sont vos projets ?' : 'What are your projects?' },
    { key: 'chip.skills', query: lang === 'fr' ? 'Quelles sont vos compétences ?' : 'What are your skills?' },
    { key: 'chip.availability', query: lang === 'fr' ? 'Êtes-vous disponible ?' : 'Are you available?' },
    { key: 'chip.contact', query: lang === 'fr' ? 'Comment vous contacter ?' : 'How can I contact you?' }
  ];

  chatbotChips.innerHTML = '';
  chips.forEach(chip => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip-btn';
    btn.textContent = T[lang][chip.key];
    btn.addEventListener('click', () => sendChatMessage(chip.query));
    chatbotChips.appendChild(btn);
  });
}

chatbotToggle.addEventListener('click', openChat);
chatbotClose.addEventListener('click', closeChat);
chatbotSend.addEventListener('click', () => sendChatMessage(chatbotInput.value));
chatbotInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendChatMessage(chatbotInput.value);
});

['drawerChatBtn', 'contactChatBtn'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', () => { closeMenu(); openChat(); });
});

applyLang(lang);

/* ── Splash ── */
const splash = document.getElementById('splash');
if (splash) {
  const hideSplash = () => {
    splash.classList.add('is-hidden');
    setTimeout(() => splash.remove(), 700);
  };

  if (sessionStorage.getItem('splashSeen') === '1') {
    splash.remove();
  } else {
    sessionStorage.setItem('splashSeen', '1');
    setTimeout(hideSplash, 1600);
  }
}

terminalInput.focus();
