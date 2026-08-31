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
    'hero.subtitle': 'Data Scientist & ML Engineer | Mathématiques Appliquées & Optimisation',
    'hero.available': 'Disponible en Remote & International',
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
    'terminal.recruit': 'Parfait — parlons de votre mission. Je suis disponible pour des opportunités en Data Science & ML Engineering.',
    'terminal.work': 'Voici une sélection de mes projets phares. Faites défiler pour explorer.',
    'terminal.explore': 'Prenez votre temps — découvrez mon parcours, mes valeurs et mon approche.',
    'terminal.unknown': 'Je n\'ai pas compris. Tapez 1, 2 ou 3 — ou posez une question libre.',
    'about.tag': 'À propos',
    'about.lead': 'Data Scientist avec une solide formation en Mathématiques Appliquées et optimisation des données.',
    'about.bio': 'Data Scientist & ML Engineer spécialisée dans la traduction de contraintes industrielles complexes en modèles prédictifs scalables, pipelines de données automatisés et architectures de Deep Learning.',
    'about.loc.val': 'Remote / International',
    'about.locationTag': 'Disponible en Remote & International',
    'services.tag': 'Services',
    'services.s1.title': 'Stratégie Data & IA',
    'services.s2.title': 'Systèmes ML sur mesure',
    'services.s3.title': 'Déploiement & MLOps',
    'skills.tag': 'Compétences',
    'skills.title': 'Expertise technique & mathématique',
    'skills.intro': 'Un socle quantitatif rigoureux en Mathématiques Appliquées combiné à l\'ingénierie logicielle pour concevoir et déployer des architectures IA robustes.',
    'skills.c1.title': 'Data Science & Machine Learning',
    'skills.c1.sub': 'Modélisation statistique & apprentissage profond',
    'skills.c1.desc': 'Conception d\'algorithmes prédictifs, modélisation de séries temporelles et optimisation numérique sous contraintes industrielles.',
    'skills.c1.b1': 'PyTorch',
    'skills.c1.b2': 'Scikit-learn',
    'skills.c1.b3': 'Optimisation numérique',
    'skills.c1.b4': 'Modélisation statistique',
    'skills.c1.b5': 'Séries temporelles',
    'skills.c1.b6': 'Fusion de données',
    'skills.c1.b7': 'Processus stochastiques',
    'skills.c1.b8': 'Algèbre linéaire',
    'skills.c2.title': 'IA Générative & RAG Avancé',
    'skills.c2.sub': 'Systèmes autonomes & recherche contextuelle',
    'skills.c2.desc': 'Architecture de pipelines RAG structurés, agents autonomes multi-étapes et intégration d\'APIs LLM pour l\'extraction de connaissances complexes.',
    'skills.c2.b1': 'LangChain',
    'skills.c2.b2': 'RAG Structuré',
    'skills.c2.b3': 'Agents autonomes',
    'skills.c2.b4': 'Recherche contextuelle',
    'skills.c2.b5': 'Bases vectorielles (FAISS)',
    'skills.c2.b6': 'APIs LLM (Mistral / OpenAI)',
    'skills.c2.b7': 'Computer Vision (OpenCV)',
    'skills.c3.title': 'Data Engineering & Outils',
    'skills.c3.sub': 'Pipelines de production & gestion de bases',
    'skills.c3.desc': 'Développement de pipelines ETL automatisés, modélisation relationnelle SQL et conteneurisation pour environnements de production.',
    'skills.c3.b1': 'Python (Expert)',
    'skills.c3.b2': 'SQL & Bases relationnelles',
    'skills.c3.b3': 'Pipelines ETL',
    'skills.c3.b4': 'Docker',
    'skills.c3.b5': 'Contrôle de version Git',
    'skills.c3.b6': 'Linux & Cloud',
    'skills.c3.b7': 'C++',
    'skills.c4.title': 'Méthodes & Impact Métier',
    'skills.c4.sub': 'Résolution de problèmes & communication',
    'skills.c4.desc': 'Traduction des contraintes business en indicateurs mesurables, restitution claire pour décideurs et collaboration agile pluridisciplinaire.',
    'skills.c4.b1': 'Résolution de problèmes industriels',
    'skills.c4.b2': 'Data Storytelling',
    'skills.c4.b3': 'Collaboration pluridisciplinaire',
    'skills.c4.b4': 'Forte autonomie',
    'skills.c4.b5': 'Dashboards de direction',
    'skills.c4.b6': 'IA explicable (XAI)',
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
    'stats.focus': 'Data Science & ML',
    'stats.degree': 'Master Maths & IA',
    'stats.projects': 'Projets & Modèles ML',
    'proof.tag': 'Projets phares',
    'proof.title': 'Réalisations techniques',
    'proof.intro': 'Cinq projets à fort impact technique — chacun conçu pour résoudre un problème réel, avec des résultats mesurables et des démos interactives.',
    'proof.c1.org': 'ABA Technology / Nextronic · PFE Master 2026',
    'proof.c3.org': 'FinTech & Analyse Quantitative · 2025',
    'proof.c4.org': 'Democratisation ML · 2025',
    'proof.c5.org': 'NLP & IA Réglementaire · 2025',
    'proof.c6.org': 'Industrie 4.0 & IoT · 2025',
    'proof.master.title': 'Système de reconnaissance faciale temps réel — Contrôle d\'accès multi-caméras',
    'proof.master.desc': 'Architecture de vision par ordinateur déployée en production pour ABA Technology : latence <35 ms sur flux RTSP multi-caméras, benchmark rigoureux de 3 modèles SOTA (ArcFace vs AdaFace vs VGGFace2), taux de reconnaissance >98% sur corpus de test. Pipeline complet : détection, alignement, embedding, matching et alerte temps réel.',
    'proof.finsight.title': 'FinSight — Moteur de Stress-Testing & Analyse de Risque Financier',
    'proof.finsight.desc': 'Plateforme quantitative d\'analyse de portefeuille : calcul de VaR/CVaR paramétrique et historique, simulation Monte Carlo (10 000 scénarios), détection de régimes de marché par LSTM (F1 = 0.91) et backtesting XGBoost sur séries OHLCV. Interface de stress-test interactive avec visualisations en temps réel.',
    'proof.automl.title': 'ChatAutoML — Plateforme No-Code d\'AutoML Conversationnel',
    'proof.automl.desc': 'Moteur d\'AutoML piloté par le langage naturel : optimisation bayésienne des hyperparamètres via Optuna (50+ trials), sélection automatique du meilleur modèle parmi 8 algorithmes, génération de rapport complet en <60s. Conçu pour ONG et PME sans expertise data. Démo interactive avec datasets réels (churn, housing, wine).',
    'proof.rag.title': 'RAG Document Intelligence — Analyse ESG & Réglementaire par IA',
    'proof.rag.desc': 'Pipeline RAG structuré sur corpus de rapports ESG et textes réglementaires : chunking sémantique, indexation FAISS (cosine similarity), récupération top-k avec re-ranking, réponses 100% sourcées via Mistral AI. Précision de la récupération contextuelle >92% sur corpus de 500+ pages. Démo interactive sur documents ESG réels.',
    'proof.anomaly.title': 'Maintenance Prédictive Industrielle — Détection d\'Anomalies IoT',
    'proof.anomaly.desc': 'Autoencodeur LSTM-CNN PyTorch entraîné sur séries temporelles de capteurs industriels (vibration, température, pression) : détection d\'anomalies jusqu\'à 15 min avant rupture, recall = 0.97 sur jeu de test, réduction de 40% des arrêts non planifiés simulés. Pipeline complet : ingestion, normalisation, inférence temps réel et alerting.',
    'proj.tag': 'Démos interactives',
    'proj.title': 'Applications testables en ligne',
    'proj.intro': 'Démos complètes avec données réelles — testez directement dans votre navigateur.',
    'proj.demo': 'Tester la démo →',
    'proj.p1.title': 'FinSight — Stress-Testing Financier',
    'proj.p1.desc': 'VaR/CVaR, Monte Carlo 10K scénarios, LSTM de détection de régimes (F1=0.91), backtesting XGBoost.',
    'proj.p1.cat': 'FinTech / Quant',
    'proj.p2.title': 'ChatAutoML — AutoML No-Code',
    'proj.p2.desc': 'Optuna bayésien, 8 algorithmes comparés, meilleur modèle en <60s, rapport automatique complet.',
    'proj.p2.cat': 'AutoML / IA',
    'proj.p3.title': 'RAG Document Intelligence',
    'proj.p3.desc': 'FAISS + Mistral AI, précision contextuelle >92%, réponses sourcées sur corpus ESG 500+ pages.',
    'proj.p3.cat': 'NLP / GenAI',
    'proj.p4.title': 'Maintenance Prédictive IoT',
    'proj.p4.desc': 'LSTM-CNN autoencoder, recall=0.97, alerte 15 min avant rupture, réduction 40% des arrêts.',
    'proj.p4.cat': 'Industrie 4.0',
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
    'journey.licence.org': 'Institut Supérieur de Management (ISM)',
    'journey.volunteer': 'Data Analyst (Bénévole)',
    'journey.volunteer.org': 'Refocus Child',
    'journey.volunteer.desc': 'Suivi de l\'intégrité des données, structuration de cadres de métadonnées et optimisation des bases de données de reporting.',
    'journey.references': 'Références académiques & professionnelles',
    'journey.ref1.role': 'VP Affaires Académiques, Université Mundiapolis',
    'journey.ref2.role': 'Ingénieur IA, Nextronic (ABA Technology)',
    'contact.tag': 'Contact',
    'contact.title': 'Travaillons ensemble.',
    'contact.copy': 'Disponible pour des opportunités en Data Science, Machine Learning et modélisation prédictive.',
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
    'hero.subtitle': 'Data Scientist & ML Engineer | Applied Mathematics & Data Optimization',
    'hero.available': 'Available for Remote & International',
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
    'terminal.recruit': 'Great — let\'s talk about your mission. I\'m available for Data Science & ML Engineering roles.',
    'terminal.work': 'Here\'s a selection of my featured projects. Scroll to explore.',
    'terminal.explore': 'Take your time — discover my journey, values and approach.',
    'terminal.unknown': 'I didn\'t understand. Type 1, 2 or 3 — or ask a free question.',
    'about.tag': 'About',
    'about.lead': 'Data Scientist with a rigorous foundation in Applied Mathematics and data optimization.',
    'about.bio': 'Data Scientist & ML Engineer specialized in translating complex industrial constraints into scalable predictive models, structured pipelines and Deep Learning architectures.',
    'about.loc.val': 'Remote / Worldwide',
    'about.locationTag': 'Available for Remote & International',
    'services.tag': 'Services',
    'services.s1.title': 'Data & AI Strategy',
    'services.s2.title': 'Custom ML Systems',
    'services.s3.title': 'Deployment & MLOps',
    'skills.tag': 'Skills',
    'skills.title': 'Technical & Mathematical Expertise',
    'skills.intro': 'A rigorous quantitative foundation in Applied Mathematics combined with software engineering to design and deploy robust AI architectures.',
    'skills.c1.title': 'Data Science & Machine Learning',
    'skills.c1.sub': 'Statistical modeling & deep learning',
    'skills.c1.desc': 'Designing predictive algorithms, time-series forecasting, and numerical optimization under real-world industrial constraints.',
    'skills.c1.b1': 'PyTorch',
    'skills.c1.b2': 'Scikit-learn',
    'skills.c1.b3': 'Numerical Optimization',
    'skills.c1.b4': 'Statistical Modeling',
    'skills.c1.b5': 'Time Series Forecasting',
    'skills.c1.b6': 'Spatial Data Fusion',
    'skills.c1.b7': 'Stochastic Processes',
    'skills.c1.b8': 'Linear Algebra',
    'skills.c2.title': 'Generative AI & Advanced RAG',
    'skills.c2.sub': 'Autonomous agents & contextual retrieval',
    'skills.c2.desc': 'Architecting structured RAG pipelines, multi-step autonomous agents, and LLM API integrations for complex knowledge extraction.',
    'skills.c2.b1': 'LangChain',
    'skills.c2.b2': 'Structured RAG',
    'skills.c2.b3': 'Autonomous Agents',
    'skills.c2.b4': 'Context Retrieval',
    'skills.c2.b5': 'Vector DBs (FAISS)',
    'skills.c2.b6': 'LLM APIs (Mistral / OpenAI)',
    'skills.c2.b7': 'Computer Vision (OpenCV)',
    'skills.c3.title': 'Data Engineering & Tools',
    'skills.c3.sub': 'Production pipelines & database management',
    'skills.c3.desc': 'Building automated ETL pipelines, relational SQL modeling, and containerization for scalable production environments.',
    'skills.c3.b1': 'Python (Expert)',
    'skills.c3.b2': 'SQL & Relational DBs',
    'skills.c3.b3': 'ETL Pipelines',
    'skills.c3.b4': 'Docker',
    'skills.c3.b5': 'Git Version Control',
    'skills.c3.b6': 'Linux & Cloud',
    'skills.c3.b7': 'C++',
    'skills.c4.title': 'Methods & Business Impact',
    'skills.c4.sub': 'Problem solving & executive communication',
    'skills.c4.desc': 'Translating business constraints into measurable KPIs, delivering clear executive reporting, and cross-functional agile collaboration.',
    'skills.c4.b1': 'Industrial Problem-Solving',
    'skills.c4.b2': 'Data Storytelling',
    'skills.c4.b3': 'Cross-Functional Collaboration',
    'skills.c4.b4': 'High Autonomy',
    'skills.c4.b5': 'Executive Dashboards',
    'skills.c4.b6': 'Explainable AI (XAI)',
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
    'stats.focus': 'Data Science & ML',
    'stats.degree': 'M.Sc Applied Maths & AI',
    'stats.projects': 'Projects & ML Models',
    'proof.tag': 'Featured projects',
    'proof.title': 'Technical achievements',
    'proof.intro': 'Five high-impact technical projects — each built to solve a real problem, with measurable results and live interactive demos.',
    'proof.c1.org': 'ABA Technology / Nextronic · Master Thesis 2026',
    'proof.c3.org': 'FinTech & Quantitative Analysis · 2025',
    'proof.c4.org': 'ML Democratization · 2025',
    'proof.c5.org': 'NLP & Regulatory AI · 2025',
    'proof.c6.org': 'Industry 4.0 & IoT · 2025',
    'proof.master.title': 'Real-Time Facial Recognition System — Multi-Camera Access Control',
    'proof.master.desc': 'Computer vision architecture deployed in production at ABA Technology: <35ms latency on RTSP multi-camera streams, rigorous benchmark of 3 SOTA models (ArcFace vs AdaFace vs VGGFace2), >98% recognition rate on test corpus. Full pipeline: detection, alignment, embedding, matching and real-time alerting.',
    'proof.finsight.title': 'FinSight — Financial Risk Engine & Stress-Testing Platform',
    'proof.finsight.desc': 'Quantitative portfolio analysis platform: parametric and historical VaR/CVaR, Monte Carlo simulation (10,000 scenarios), LSTM market regime detection (F1 = 0.91) and XGBoost backtesting on OHLCV series. Interactive stress-test interface with real-time visualizations.',
    'proof.automl.title': 'ChatAutoML — Conversational No-Code AutoML Platform',
    'proof.automl.desc': 'Natural language-driven AutoML engine: Bayesian hyperparameter optimization via Optuna (50+ trials), automatic selection of the best model from 8 algorithms, complete report generated in <60s. Designed for NGOs and SMEs without data expertise. Interactive demo with real datasets (churn, housing, wine).',
    'proof.rag.title': 'RAG Document Intelligence — ESG & Regulatory AI Analysis',
    'proof.rag.desc': 'Structured RAG pipeline over ESG reports and regulatory corpora: semantic chunking, FAISS indexing (cosine similarity), top-k retrieval with re-ranking, 100% sourced answers via Mistral AI. Contextual retrieval accuracy >92% on 500+ page corpus. Interactive demo on real ESG documents.',
    'proof.anomaly.title': 'Industrial Predictive Maintenance — IoT Anomaly Detection',
    'proof.anomaly.desc': 'LSTM-CNN PyTorch autoencoder trained on industrial sensor time series (vibration, temperature, pressure): anomaly detection up to 15 minutes before failure, recall = 0.97 on test set, 40% reduction in simulated unplanned downtime. Full pipeline: ingestion, normalization, real-time inference and alerting.',
    'proj.tag': 'Live builds',
    'proj.title': 'Testable applications',
    'proj.intro': 'Demos powered by Vercel APIs — real server-side Node.js computation.',
    'proj.demo': 'Live demo →',
    'proj.p1.title': 'Finsight — Stress-Testing',
    'proj.p1.desc': 'Financial risk assessment engine, VaR/CVaR calculation and volatility modeling for SMEs.',
    'proj.p1.cat': 'FinTech',
    'proj.p2.title': 'ChatAutoML — No-Code AI',
    'proj.p2.desc': 'Conversational interface making predictive machine learning and Optuna optimization accessible to all.',
    'proj.p2.cat': 'AutoML',
    'proj.p3.title': 'RAG Document Intelligence',
    'proj.p3.desc': 'Vector search and 100% sourced answers for ESG impact reports and regulatory policies.',
    'proj.p3.cat': 'NLP / Societal',
    'proj.p4.title': 'IoT Predictive Maintenance',
    'proj.p4.desc': 'Early detection of sensor drift and industrial failure prevention using PyTorch autoencoders.',
    'proj.p4.cat': 'Smart Factory',
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
    'journey.licence.org': 'Institut Supérieur de Management (ISM)',
    'journey.volunteer': 'Data Analyst (Volunteer)',
    'journey.volunteer.org': 'Refocus Child',
    'journey.volunteer.desc': 'Monitored data integrity, structured metadata frameworks, and optimized tracking databases to streamline operational reporting.',
    'journey.references': 'Academic & Professional References',
    'journey.ref1.role': 'VP Academic Affairs, Mundiapolis University',
    'journey.ref2.role': 'AI Engineer, Nextronic (ABA Technology)',
    'contact.tag': 'Contact',
    'contact.title': 'Let\'s work together.',
    'contact.copy': 'Available for opportunities in Data Science, Machine Learning, and predictive modeling.',
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
    { k: ['projet', 'réalisation', 'travail', 'github', 'aba', 'finsight', 'automl', 'rag', 'anomalie'], a: () => '<b>Projets d\'impact :</b><br>• Maintenance Prédictive Industrielle (PyTorch IoT)<br>• Intelligence Documentaire RAG (Analyse ESG & Réglementations)<br>• Finsight (Stress-Testing & Risque Financier PME)<br>• ChatAutoML (Démocratisation IA No-Code)<br>• Reconnaissance faciale temps réel (ABA Technology)' },
    { k: ['compétence', 'skill', 'stack', 'python', 'pytorch'], a: () => 'Compétences : Python, PyTorch, TensorFlow, OpenCV, FastAPI, Docker, Streamlit, LangChain, MLflow.' },
    { k: ['disponible', 'freelance', 'recrut', 'emploi', 'remote'], a: () => 'Disponible pour opportunités en Data Science & ML Engineering (Remote / International).<br>Email : oumoukaltoumsall@gmail.com' },
    { k: ['contact', 'email', 'linkedin'], a: () => 'Email : oumoukaltoumsall@gmail.com<br>LinkedIn · GitHub' },
    { k: ['formation', 'master', 'diplôme'], a: () => 'Master Data Science & IA — Mundiapolis<br>Licence Mathématiques Appliquées — ISM' },
    { k: ['bonjour', 'salut', 'hello'], a: () => 'Bonjour ! Posez-moi vos questions ou utilisez les boutons ci-dessous.' }
  ],
  en: [
    { k: ['project', 'work', 'github', 'aba', 'finsight', 'automl', 'rag', 'anomaly'], a: () => '<b>High-Impact Projects:</b><br>• Industrial Predictive Maintenance (PyTorch IoT)<br>• RAG Document Intelligence (ESG & Regulatory Analysis)<br>• Finsight (SME Financial Risk & Stress-Testing)<br>• ChatAutoML (No-Code AI Democratization)<br>• Real-Time Facial Recognition (ABA Tech)' },
    { k: ['skill', 'stack', 'python', 'pytorch'], a: () => 'Skills: Python, PyTorch, TensorFlow, OpenCV, FastAPI, Docker, Streamlit, LangChain, MLflow.' },
    { k: ['available', 'freelance', 'hire', 'remote'], a: () => 'Available for Data Science & ML Engineering opportunities (Remote / International).' },
    { k: ['contact', 'email', 'linkedin'], a: () => 'Email: oumoukaltoumsall@gmail.com' },
    { k: ['education', 'master', 'degree'], a: () => 'Master Data Science & AI — Mundiapolis · ISM' },
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
