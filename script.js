const T = {
  fr: {
    'nav.about': 'À propos',
    'nav.expertise': 'Expertise',
    'nav.caseStudies': 'Projets phares',
    'nav.projects': 'Projets',
    'nav.journey': 'Parcours',
    'nav.contact': 'Contact',
    'nav.chat': 'Assistant IA',
    'hero.greeting': 'Bonjour, je suis',
    'hero.rolePrefix': 'Data Scientist',
    'hero.subtitle': 'De la recherche à l\'IA en production',
    'hero.bio': 'Data Scientist & ML Engineer basée au Maroc et au Sénégal. Je conçois des systèmes d\'IA appliquée — reconnaissance faciale temps réel, pipelines RAG/AutoML, BI et déploiement de modèles en production.',
    'hero.available': 'Disponible — Freelance · CDD · CDI · Remote',
    'hero.cta1': 'Voir mes projets',
    'hero.cta2': 'Me contacter',
    'about.tag': '01 — À PROPOS',
    'about.title': 'Passionnée par la data, le deep learning et les systèmes IA en production.',
    'about.bio': 'Data Scientist & ML Engineer basée au Maroc et au Sénégal. Mon expérience couvre la reconnaissance faciale temps réel chez ABA Technology, les pipelines RAG/AutoML, le traitement de données industrielles et la mise en production de modèles.',
    'about.loc.label': 'Localisation',
    'about.loc.val': 'Maroc · Sénégal',
    'about.avail.label': 'Disponibilité',
    'about.avail.val': 'Freelance · CDD · CDI · Remote',
    'about.focus.label': 'Focus',
    'about.focus.val': 'Vision IA · AutoML · MLOps',
    'exp.tag': '02 — EXPERTISE',
    'exp.title': 'Compétences & technologies',
    'exp.subtitle': 'Machine learning, vision par ordinateur, AutoML et MLOps pour transformer la data en solutions IA exploitables.',
    'exp.c1.title': 'Machine Learning & Deep Learning',
    'exp.c1.desc': 'Modèles prédictifs, réseaux de neurones, AutoML et pipelines de bout en bout.',
    'exp.c2.title': 'Computer Vision',
    'exp.c2.desc': 'Reconnaissance faciale, détection d\'objets et pipelines temps réel sur flux RTSP.',
    'exp.c3.title': 'AutoML & MLOps',
    'exp.c3.desc': 'Optimisation Optuna, MLflow, déploiement Docker et APIs REST pour servir des modèles.',
    'exp.c4.title': 'BI & Data Visualization',
    'exp.c4.desc': 'Dashboards Power BI, ETL, data storytelling et KPIs pour la prise de décision.',
    'exp.c5.title': 'Python & APIs',
    'exp.c5.desc': 'Automatisation, FastAPI, Flask, Streamlit et intégrations REST.',
    'exp.c6.title': 'SQL & Bases de données',
    'exp.c6.desc': 'Modélisation relationnelle, requêtes optimisées et pipelines ETL structurés.',
    'exp.c7.title': 'NLP & RAG',
    'exp.c7.desc': 'LangChain, embeddings, recherche vectorielle et assistants documentaires.',
    'exp.c8.title': 'Déploiement & Production',
    'exp.c8.desc': 'Conteneurisation Docker, APIs scalables et validation industrielle de modèles.',
    'analytics.tag': '03 — ANALYTICS',
    'analytics.title': 'Niveau de maîtrise',
    'analytics.stat.projects': 'Projets data & IA',
    'analytics.stat.skills': 'Compétences techniques',
    'analytics.stat.experience': 'Années d\'expérience',
    'analytics.stat.markets': 'Pays',
    'analytics.d1': 'Machine Learning & Deep Learning',
    'analytics.d2': 'Computer Vision & IA appliquée',
    'analytics.d3': 'BI, ETL & data storytelling',
    'analytics.d4': 'APIs, Docker & déploiement',
    'proof.tag': '04 — PROJETS PHARES',
    'proof.title': 'Études de cas impactantes',
    'proof.master.title': 'Reconnaissance faciale temps réel sur flux RTSP',
    'proof.master.desc': 'Benchmark ArcFace, AdaFace et VGGFace2 · alignement SCRFD · calibration KDE des seuils · preuve de concept multi-caméras · latence <35 ms.',
    'proof.jba.title': 'PanierDuCoin — Plateforme pour produits locaux',
    'proof.jba.desc': 'Business plan complet : étude de marché, stratégie commerciale, modèle économique, analyse des risques et projections financières sur 5 ans.',
    'proof.finsight.title': 'Finsight — Analyse de signaux financiers',
    'proof.finsight.desc': 'Dashboard interactif : backtesting, signaux ML, VaR/CVaR, stress tests et visualisations Plotly pour l\'aide à la décision.',
    'proof.automl.title': 'ChatAutoML Bot — Pipeline ML automatisé',
    'proof.automl.desc': 'Preprocessing, sélection de modèles, optimisation Optuna et explications LLM dans une interface Streamlit modulaire.',
    'proof.rag.title': 'RAG Document Intelligence',
    'proof.rag.desc': 'Assistant documentaire avec chunking, embeddings, recherche vectorielle et réponses sourcées via API Mistral.',
    'proof.anomaly.title': 'Détection d\'anomalies industrielles',
    'proof.anomaly.desc': 'Autoencodeur entraîné sur données SKAB pour surveiller capteurs industriels et détecter dérives en temps réel.',
    'proj.tag': '05 — PROJETS',
    'proj.title': 'Autres réalisations',
    'proj.code': 'Code source',
    'proj.demo': 'Démo live',
    'p3.title': 'Prédiction risques cardiovasculaires',
    'p3.desc': 'Modèle ML, EDA complète, comparaison de modèles et interprétabilité SHAP.',
    'p4.title': 'Dashboard BI complet',
    'p4.desc': 'Modélisation dimensionnelle, ETL et dashboards analytiques pour la décision.',
    'p5.title': 'Architectures CNN & ANN',
    'p5.desc': 'Implémentation et optimisation de réseaux de neurones sur Jupyter.',
    'p6.title': 'API Flask dockerisée',
    'p6.desc': 'API REST conteneurisée pour servir un modèle ANN en production.',
    'p7.title': 'Finsight — Exploration interactive',
    'p7.desc': 'Application Streamlit pour l\'analyse de signaux financiers et ML.',
    'p8.title': 'ChatAutoML Bot',
    'p8.desc': 'Pipeline AutoML modulaire : preprocessing, sélection de modèles et optimisation.',
    'p9.title': 'RAG Document Intelligence',
    'p9.desc': 'Assistant documentaire avec LangChain, embeddings et réponses sourcées via Mistral.',
    'p10.title': 'Détection d\'anomalies industrielles',
    'p10.desc': 'Autoencodeur PyTorch sur données SKAB pour la surveillance de capteurs industriels.',
    'journey.tag': '06 — PARCOURS',
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
    'journey.licence': 'Licence Mathématiques Appliquées & Data',
    'journey.licence.org': 'ISM Dakar — Sénégal',
    'journey.languages': 'Langues',
    'journey.lang.fr': 'Français',
    'journey.lang.en': 'Anglais',
    'journey.lang.ar': 'Arabe',
    'journey.certs': 'Certifications & distinctions',
    'journey.cert1.title': 'Master Data Science & IA',
    'journey.cert1.org': 'Mundiapolis University · 2023–2026',
    'journey.cert2.title': 'Licence Mathématiques Appliquées & Data',
    'journey.cert2.org': 'ISM Dakar · 2020–2023',
    'journey.cert3.title': 'PFE Vision IA — Reconnaissance faciale industrielle',
    'journey.cert3.org': 'ABA Technology / Nextronic · 2026',
    'journey.cert4.title': 'Projets déployés en production',
    'journey.cert4.org': 'Finsight & ChatAutoML — Streamlit Cloud',
    'contact.tag': '07 — CONTACT',
    'contact.title': 'Travaillons ensemble',
    'contact.sub': 'Un projet, une mission ou une simple question ? Écrivez-moi ou discutez avec mon assistant IA.',
    'contact.emailBtn': 'Envoyer un message',
    'contact.chatBtn': 'Discuter avec mon assistant IA',
    'footer.desc': 'Data Scientist & ML Engineer — IA appliquée, vision par ordinateur et MLOps.',
    'footer.made': 'Portfolio 2026',
    'chat.status': 'Assistant IA · En ligne',
    'chat.tooltip': 'Discutez avec mon assistant IA',
    'chat.placeholder': 'Posez une question…',
    'chat.welcome': 'Bonjour ! Je suis l\'assistant d\'Oumou Kaltoum Sall. Posez-moi vos questions sur son parcours, ses compétences ou ses projets.',
    'chat.fallback': 'Je n\'ai pas trouvé de réponse précise. Essayez : projets, compétences, disponibilité, contact ou formation.',
    'chip.projects': 'Projets',
    'chip.skills': 'Compétences',
    'chip.availability': 'Disponibilité',
    'chip.contact': 'Contact',
    'chip.education': 'Formation'
  },
  en: {
    'nav.about': 'About',
    'nav.expertise': 'Expertise',
    'nav.caseStudies': 'Featured work',
    'nav.projects': 'Projects',
    'nav.journey': 'Journey',
    'nav.contact': 'Contact',
    'nav.chat': 'AI Assistant',
    'hero.greeting': 'Hello, I\'m',
    'hero.rolePrefix': 'Data Scientist',
    'hero.subtitle': 'From research to production AI',
    'hero.bio': 'Data Scientist & ML Engineer based in Morocco and Senegal. I build applied AI systems — real-time facial recognition, RAG/AutoML pipelines, BI and production model deployment.',
    'hero.available': 'Available — Freelance · CDD · CDI · Remote',
    'hero.cta1': 'View my work',
    'hero.cta2': 'Contact me',
    'about.tag': '01 — ABOUT',
    'about.title': 'Passionate about data, deep learning and production AI systems.',
    'about.bio': 'Data Scientist & ML Engineer based in Morocco and Senegal. My experience spans real-time facial recognition at ABA Technology, RAG/AutoML pipelines, industrial data processing and model deployment.',
    'about.loc.label': 'Location',
    'about.loc.val': 'Morocco · Senegal',
    'about.avail.label': 'Availability',
    'about.avail.val': 'Freelance · CDD · CDI · Remote',
    'about.focus.label': 'Focus',
    'about.focus.val': 'AI Vision · AutoML · MLOps',
    'exp.tag': '02 — EXPERTISE',
    'exp.title': 'Skills & Technologies',
    'exp.subtitle': 'Machine learning, computer vision, AutoML and MLOps to turn raw data into actionable AI solutions.',
    'exp.c1.title': 'Machine Learning & Deep Learning',
    'exp.c1.desc': 'Predictive models, neural networks, AutoML and end-to-end pipelines.',
    'exp.c2.title': 'Computer Vision',
    'exp.c2.desc': 'Facial recognition, object detection and real-time pipelines on RTSP streams.',
    'exp.c3.title': 'AutoML & MLOps',
    'exp.c3.desc': 'Optuna optimization, MLflow, Docker deployment and REST APIs to serve models.',
    'exp.c4.title': 'BI & Data Visualization',
    'exp.c4.desc': 'Power BI dashboards, ETL, data storytelling and KPIs for decision-making.',
    'exp.c5.title': 'Python & APIs',
    'exp.c5.desc': 'Automation, FastAPI, Flask, Streamlit and REST integrations.',
    'exp.c6.title': 'SQL & Databases',
    'exp.c6.desc': 'Relational modelling, optimized queries and structured ETL pipelines.',
    'exp.c7.title': 'NLP & RAG',
    'exp.c7.desc': 'LangChain, embeddings, vector search and document assistants.',
    'exp.c8.title': 'Deployment & Production',
    'exp.c8.desc': 'Docker containerization, scalable APIs and industrial model validation.',
    'analytics.tag': '03 — ANALYTICS',
    'analytics.title': 'Proficiency level',
    'analytics.stat.projects': 'Data & AI projects',
    'analytics.stat.skills': 'Technical skills',
    'analytics.stat.experience': 'Years of experience',
    'analytics.stat.markets': 'Countries',
    'analytics.d1': 'Machine Learning & Deep Learning',
    'analytics.d2': 'Computer Vision & Applied AI',
    'analytics.d3': 'BI, ETL & data storytelling',
    'analytics.d4': 'APIs, Docker & deployment',
    'proof.tag': '04 — FEATURED WORK',
    'proof.title': 'High-impact case studies',
    'proof.master.title': 'Real-time facial recognition on RTSP streams',
    'proof.master.desc': 'ArcFace, AdaFace and VGGFace2 benchmarking · SCRFD alignment · KDE threshold calibration · multi-camera proof of concept · latency <35 ms.',
    'proof.jba.title': 'PanierDuCoin — Platform for local products',
    'proof.jba.desc': 'Complete business plan: market study, commercial strategy, business model, risk analysis and 5-year financial projections.',
    'proof.finsight.title': 'Finsight — Financial signal analysis',
    'proof.finsight.desc': 'Interactive dashboard: backtesting, ML signals, VaR/CVaR, stress tests and Plotly visualizations for decision support.',
    'proof.automl.title': 'ChatAutoML Bot — Automated ML pipeline',
    'proof.automl.desc': 'Preprocessing, model selection, Optuna optimization and LLM explanations in a modular Streamlit interface.',
    'proof.rag.title': 'RAG Document Intelligence',
    'proof.rag.desc': 'Document assistant with chunking, embeddings, vector search and sourced answers via Mistral API.',
    'proof.anomaly.title': 'Industrial anomaly detection',
    'proof.anomaly.desc': 'Autoencoder trained on SKAB data to monitor industrial sensors and detect real-time drift.',
    'proj.tag': '05 — PROJECTS',
    'proj.title': 'Other work',
    'proj.code': 'Source code',
    'proj.demo': 'Live demo',
    'p3.title': 'Cardiovascular risk prediction',
    'p3.desc': 'ML model, full EDA, model comparison and SHAP interpretability.',
    'p4.title': 'Complete BI dashboard',
    'p4.desc': 'Dimensional modelling, ETL and analytical dashboards for decision-making.',
    'p5.title': 'CNN & ANN architectures',
    'p5.desc': 'Implementation and optimization of neural networks in Jupyter.',
    'p6.title': 'Dockerized Flask API',
    'p6.desc': 'Containerized REST API to serve an ANN model in production.',
    'p7.title': 'Finsight — Interactive exploration',
    'p7.desc': 'Streamlit app for financial signal analysis and ML.',
    'p8.title': 'ChatAutoML Bot',
    'p8.desc': 'Modular AutoML pipeline: preprocessing, model selection and optimization.',
    'p9.title': 'RAG Document Intelligence',
    'p9.desc': 'Document assistant with LangChain, embeddings and sourced answers via Mistral.',
    'p10.title': 'Industrial anomaly detection',
    'p10.desc': 'PyTorch autoencoder on SKAB data for industrial sensor monitoring.',
    'journey.tag': '06 — JOURNEY',
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
    'journey.licence': 'Bachelor Applied Mathematics & Data',
    'journey.licence.org': 'ISM Dakar — Senegal',
    'journey.languages': 'Languages',
    'journey.lang.fr': 'French',
    'journey.lang.en': 'English',
    'journey.lang.ar': 'Arabic',
    'journey.certs': 'Certifications & highlights',
    'journey.cert1.title': 'Master Data Science & AI',
    'journey.cert1.org': 'Mundiapolis University · 2023–2026',
    'journey.cert2.title': 'Bachelor Applied Mathematics & Data',
    'journey.cert2.org': 'ISM Dakar · 2020–2023',
    'journey.cert3.title': 'AI Vision Thesis — Industrial facial recognition',
    'journey.cert3.org': 'ABA Technology / Nextronic · 2026',
    'journey.cert4.title': 'Production-deployed projects',
    'journey.cert4.org': 'Finsight & ChatAutoML — Streamlit Cloud',
    'contact.tag': '07 — CONTACT',
    'contact.title': 'Let\'s work together',
    'contact.sub': 'A project, a mission or a quick question? Email me or chat with my AI assistant.',
    'contact.emailBtn': 'Send a message',
    'contact.chatBtn': 'Chat with my AI assistant',
    'footer.desc': 'Data Scientist & ML Engineer — applied AI, computer vision and MLOps.',
    'footer.made': 'Portfolio 2026',
    'chat.status': 'AI Assistant · Online',
    'chat.tooltip': 'Chat with my AI assistant',
    'chat.placeholder': 'Ask a question…',
    'chat.welcome': 'Hello! I\'m Oumou Kaltoum Sall\'s assistant. Ask me about her background, skills or projects.',
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
    {
      k: ['projet', 'réalisation', 'travail', 'github', 'aba', 'jba', 'mémoire', 'reconnaissance', 'panierducoin', 'finsight', 'automl', 'rag', 'anomalie'],
      a: () => '🗂️ <b>Projets principaux :</b><br><br>1. <b>Reconnaissance faciale temps réel (ABA / PFE 2026)</b> — ArcFace, SCRFD, RTSP, latence &lt;35 ms.<br>2. <b>PanierDuCoin (JBA 2024)</b> — Business plan complet sur 5 ans.<br>3. <b>Finsight</b> — <a href="https://finsight-signals.streamlit.app" target="_blank" rel="noopener">finsight-signals.streamlit.app</a><br>4. <b>ChatAutoML Bot</b> — <a href="https://chatautoml-bot.streamlit.app" target="_blank" rel="noopener">chatautoml-bot.streamlit.app</a><br>5. <b>RAG Document Intelligence</b> et <b>détection d\'anomalies industrielles</b> (PyTorch, LangChain).'
    },
    {
      k: ['compétence', 'competence', 'skill', 'stack', 'techno', 'python', 'tensorflow', 'pytorch', 'opencv', 'maîtrise', 'outil'],
      a: () => '🛠️ <b>Stack :</b> Python, SQL, Scikit-learn, PyTorch, TensorFlow, OpenCV, FastAPI, Flask, Docker, Streamlit, Power BI, LangChain, MLflow, Optuna.'
    },
    {
      k: ['disponible', 'disponibilité', 'emploi', 'cdd', 'cdi', 'freelance', 'mission', 'recrutement', 'remote'],
      a: () => '✅ <b>Disponible immédiatement</b> pour freelance, CDD ou CDI — Maroc, Sénégal et remote.<br>📧 <a href="mailto:oumoukaltoumsall@gmail.com">oumoukaltoumsall@gmail.com</a>'
    },
    {
      k: ['contact', 'email', 'mail', 'linkedin', 'joindre', 'écrire'],
      a: () => '📬 <b>Contact :</b><br>📧 <a href="mailto:oumoukaltoumsall@gmail.com">oumoukaltoumsall@gmail.com</a><br>💼 <a href="https://linkedin.com/in/oumou-kaltoum-sall" target="_blank" rel="noopener">LinkedIn</a><br>🐙 <a href="https://github.com/KalsoumDS" target="_blank" rel="noopener">GitHub</a>'
    },
    {
      k: ['formation', 'étude', 'diplôme', 'master', 'licence', 'université', 'parcours'],
      a: () => '🎓 <b>Formation :</b><br>• Master Data Science & IA — Mundiapolis (Casablanca)<br>• Licence Mathématiques Appliquées & Data — ISM Dakar'
    },
    {
      k: ['qui', 'profil', 'oumou', 'présente', 'presentation'],
      a: () => '👩‍💻 <b>Oumou Kaltoum Sall</b> — Data Scientist & ML Engineer. Spécialisée en vision par ordinateur, AutoML et déploiement de modèles en production (ABA Technology).'
    },
    {
      k: ['bonjour', 'salut', 'hello', 'bonsoir', 'coucou'],
      a: () => 'Bonjour ! Je peux vous parler de ses projets, compétences, disponibilité ou formation. Utilisez les boutons ci-dessous ou posez votre question.'
    }
  ],
  en: [
    {
      k: ['project', 'work', 'github', 'aba', 'jba', 'thesis', 'facial', 'panierducoin', 'finsight', 'automl', 'rag', 'anomaly'],
      a: () => '🗂️ <b>Main projects:</b><br><br>1. <b>Real-time facial recognition (ABA / Thesis 2026)</b> — ArcFace, SCRFD, RTSP, latency &lt;35 ms.<br>2. <b>PanierDuCoin (JBA 2024)</b> — Full 5-year business plan.<br>3. <b>Finsight</b> — <a href="https://finsight-signals.streamlit.app" target="_blank" rel="noopener">finsight-signals.streamlit.app</a><br>4. <b>ChatAutoML Bot</b> — <a href="https://chatautoml-bot.streamlit.app" target="_blank" rel="noopener">chatautoml-bot.streamlit.app</a><br>5. <b>RAG Document Intelligence</b> and <b>industrial anomaly detection</b> (PyTorch, LangChain).'
    },
    {
      k: ['skill', 'stack', 'tech', 'python', 'tensorflow', 'pytorch', 'opencv', 'tools'],
      a: () => '🛠️ <b>Stack:</b> Python, SQL, Scikit-learn, PyTorch, TensorFlow, OpenCV, FastAPI, Flask, Docker, Streamlit, Power BI, LangChain, MLflow, Optuna.'
    },
    {
      k: ['available', 'availability', 'job', 'cdd', 'cdi', 'freelance', 'remote', 'hire'],
      a: () => '✅ <b>Available immediately</b> for freelance, CDD or CDI — Morocco, Senegal and remote.<br>📧 <a href="mailto:oumoukaltoumsall@gmail.com">oumoukaltoumsall@gmail.com</a>'
    },
    {
      k: ['contact', 'email', 'mail', 'linkedin', 'reach'],
      a: () => '📬 <b>Contact:</b><br>📧 <a href="mailto:oumoukaltoumsall@gmail.com">oumoukaltoumsall@gmail.com</a><br>💼 <a href="https://linkedin.com/in/oumou-kaltoum-sall" target="_blank" rel="noopener">LinkedIn</a><br>🐙 <a href="https://github.com/KalsoumDS" target="_blank" rel="noopener">GitHub</a>'
    },
    {
      k: ['education', 'degree', 'master', 'bachelor', 'university', 'school'],
      a: () => '🎓 <b>Education:</b><br>• Master Data Science & AI — Mundiapolis (Casablanca)<br>• Bachelor Applied Mathematics & Data — ISM Dakar'
    },
    {
      k: ['who', 'about', 'profile', 'oumou', 'introduce'],
      a: () => '👩‍💻 <b>Oumou Kaltoum Sall</b> — Data Scientist & ML Engineer. Specialized in computer vision, AutoML and production model deployment (ABA Technology).'
    },
    {
      k: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
      a: () => 'Hello! I can tell you about her projects, skills, availability or education. Use the buttons below or ask your question.'
    }
  ]
};

const SECTION_LEVELS = [
  { id: 'about', fr: 'Level 01 — À propos', en: 'Level 01 — About' },
  { id: 'expertise', fr: 'Level 02 — Expertise', en: 'Level 02 — Expertise' },
  { id: 'analytics', fr: 'Level 03 — Analytics', en: 'Level 03 — Analytics' },
  { id: 'case-studies', fr: 'Level 04 — Projets phares', en: 'Level 04 — Featured' },
  { id: 'projects', fr: 'Level 05 — Projets', en: 'Level 05 — Projects' },
  { id: 'journey', fr: 'Level 06 — Parcours', en: 'Level 06 — Journey' },
  { id: 'contact', fr: 'Level 07 — Contact', en: 'Level 07 — Contact' }
];

let lang = localStorage.getItem('lang') || 'fr';
let theme = localStorage.getItem('theme') || 'light';

const navbar = document.getElementById('navbar');
const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const levelIndicator = document.getElementById('levelIndicator');
const levelText = document.getElementById('levelText');
const levelProgress = document.getElementById('levelProgress');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotTooltip = document.getElementById('chatbotTooltip');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotChips = document.getElementById('chatbotChips');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');

function applyFontAwesomeFallback() {
  const root = document.documentElement;

  const updateFallbackState = () => {
    if (!document.fonts || !document.fonts.check) {
      root.classList.add('fa-fallback');
      return;
    }

    const solidLoaded =
      document.fonts.check('900 1em "Font Awesome 6 Free"') ||
      document.fonts.check('900 1em "Font Awesome 5 Free"');
    const brandsLoaded =
      document.fonts.check('400 1em "Font Awesome 6 Brands"') ||
      document.fonts.check('400 1em "Font Awesome 5 Brands"');

    root.classList.toggle('fa-fallback', !(solidLoaded && brandsLoaded));
  };

  updateFallbackState();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateFallbackState).catch(updateFallbackState);
  }

  window.addEventListener('load', updateFallbackState, { once: true });
  setTimeout(updateFallbackState, 1200);
}

function applyLang(l) {
  lang = l;
  localStorage.setItem('lang', l);
  document.documentElement.lang = l;
  langLabel.textContent = l === 'fr' ? 'EN' : 'FR';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (T[l][key] !== undefined) el.textContent = T[l][key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (T[l][key] !== undefined) el.innerHTML = T[l][key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (T[l][key] !== undefined) el.placeholder = T[l][key];
  });

  renderChips();
  resetChat();
  updateLevelIndicator();
}

function applyTheme(t) {
  theme = t;
  localStorage.setItem('theme', t);
  document.documentElement.setAttribute('data-theme', t);
}

langToggle.addEventListener('click', () => applyLang(lang === 'fr' ? 'en' : 'fr'));
themeToggle.addEventListener('click', () => applyTheme(theme === 'light' ? 'dark' : 'light'));
applyFontAwesomeFallback();
applyTheme(theme);

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateLevelIndicator();
  updateActiveNav();
});

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 200 && rect.bottom >= 200) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

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

function updateLevelIndicator() {
  let activeIndex = -1;
  SECTION_LEVELS.forEach((section, index) => {
    const el = document.getElementById(section.id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
      activeIndex = index;
    }
  });

  const onHero = activeIndex === -1;
  levelIndicator.classList.toggle('visible', !onHero);

  if (activeIndex >= 0) {
    levelText.textContent = SECTION_LEVELS[activeIndex][lang];
    levelProgress.textContent = `${activeIndex + 1}/7`;
  } else {
    levelText.textContent = lang === 'fr' ? 'Level 01 — Accueil' : 'Level 01 — Home';
    levelProgress.textContent = '0/7';
  }
}

function openChat() {
  chatbotPanel.classList.add('open');
  chatbotPanel.setAttribute('aria-hidden', 'false');
  chatbotToggle.classList.add('hidden');
  if (chatbotTooltip) chatbotTooltip.classList.add('hidden-by-chat');
  chatbotInput.focus();
}

function closeChat() {
  chatbotPanel.classList.remove('open');
  chatbotPanel.setAttribute('aria-hidden', 'true');
  chatbotToggle.classList.remove('hidden');
  if (chatbotTooltip) chatbotTooltip.classList.remove('hidden-by-chat');
}

function showChatTooltip() {
  if (!chatbotTooltip || chatbotPanel.classList.contains('open')) return;
  chatbotTooltip.classList.add('visible');
  setTimeout(() => chatbotTooltip.classList.remove('visible'), 5000);
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
    const reply = match ? match.a() : T[lang]['chat.fallback'];
    addMessage(reply, 'bot');
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
    { key: 'chip.contact', query: lang === 'fr' ? 'Comment vous contacter ?' : 'How can I contact you?' },
    { key: 'chip.education', query: lang === 'fr' ? 'Quelle est votre formation ?' : 'What is your education?' }
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

['navChatBtn', 'drawerChatBtn', 'contactChatBtn'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', () => {
    closeMenu();
    openChat();
  });
});

applyLang(lang);
updateLevelIndicator();

if (window.innerWidth > 768) {
  setTimeout(showChatTooltip, 2000);
  if (!sessionStorage.getItem('chatOpened')) {
    setTimeout(() => {
      openChat();
      sessionStorage.setItem('chatOpened', '1');
    }, 3500);
  }
}
