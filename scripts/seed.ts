import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Seed script for initial portfolio content.
 *
 * Prereqs:
 * 1) Ensure collections exist: `skills`, `experiences`, `projects` (add to payload.config.ts).
 * 2) Set PAYLOAD_SECRET in .env.
 * 3) Run MongoDB (already running on 127.0.0.1:27017).
 * 4) Run with: npx ts-node scripts/seed.ts
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Load env relative to project root to ensure PAYLOAD_SECRET is available when running via ts-node
dotenv.config({ path: path.resolve(dirname, '../.env') })

const skills = [
  { 
    name: { en: 'JavaScript / TypeScript', es: 'JavaScript / TypeScript', fr: 'JavaScript / TypeScript', de: 'JavaScript / TypeScript' }, 
    category: 'Frontend',
    proficiency: 5, 
    description: { 
      en: 'Modern JS/TS, RSC, ISR/SSG, Edge runtimes',
      es: 'JS/TS moderno, RSC, ISR/SSG, tiempos de ejecución Edge',
      fr: 'JS/TS moderne, RSC, ISR/SSG, runtimes Edge',
      de: 'Modernes JS/TS, RSC, ISR/SSG, Edge-Laufzeiten'
    } 
  },
  { 
    name: { en: 'React / Next.js', es: 'React / Next.js', fr: 'React / Next.js', de: 'React / Next.js' }, 
    category: 'Frontend',
    proficiency: 5, 
    description: { 
      en: 'App Router, RSC, streaming, image optimization, SEO',
      es: 'App Router, RSC, streaming, optimización de imágenes, SEO',
      fr: 'App Router, RSC, streaming, optimisation d\'images, SEO',
      de: 'App Router, RSC, Streaming, Bildoptimierung, SEO'
    } 
  },
  { 
    name: { en: 'TailwindCSS / shadcn/ui', es: 'TailwindCSS / shadcn/ui', fr: 'TailwindCSS / shadcn/ui', de: 'TailwindCSS / shadcn/ui' }, 
    category: 'Frontend',
    proficiency: 5, 
    description: { 
      en: 'Design systems, accessible components, responsive UI',
      es: 'Sistemas de diseño, componentes accesibles, UI responsiva',
      fr: 'Systèmes de design, composants accessibles, UI responsive',
      de: 'Design-Systeme, barrierefreie Komponenten, responsives UI'
    } 
  },
  { 
    name: { en: 'Node.js / Express', es: 'Node.js / Express', fr: 'Node.js / Express', de: 'Node.js / Express' }, 
    category: 'Backend',
    proficiency: 5, 
    description: { 
      en: 'High-throughput APIs, middleware pipelines, async I/O',
      es: 'APIs de alto rendimiento, pipelines de middleware, I/O asíncrono',
      fr: 'APIs haute performance, pipelines middleware, I/O asynchrone',
      de: 'Hochdurchsatz-APIs, Middleware-Pipelines, asynchrones I/O'
    } 
  },
  { 
    name: { en: 'GraphQL / REST', es: 'GraphQL / REST', fr: 'GraphQL / REST', de: 'GraphQL / REST' }, 
    category: 'Backend',
    proficiency: 4, 
    description: { 
      en: 'BFF patterns, aggregation, caching, batching',
      es: 'Patrones BFF, agregación, caché, procesamiento por lotes',
      fr: 'Patterns BFF, agrégation, mise en cache, traitement par lots',
      de: 'BFF-Muster, Aggregation, Caching, Batching'
    } 
  },
  { 
    name: { en: 'MongoDB / SQL', es: 'MongoDB / SQL', fr: 'MongoDB / SQL', de: 'MongoDB / SQL' }, 
    category: 'Backend',
    proficiency: 4, 
    description: { 
      en: 'Data modeling, sharding considerations, indexing',
      es: 'Modelado de datos, consideraciones de sharding, indexación',
      fr: 'Modélisation de données, considérations de sharding, indexation',
      de: 'Datenmodellierung, Sharding-Überlegungen, Indexierung'
    } 
  },
  { 
    name: { en: 'AWS (EC2/S3/Lambda/RDS)', es: 'AWS (EC2/S3/Lambda/RDS)', fr: 'AWS (EC2/S3/Lambda/RDS)', de: 'AWS (EC2/S3/Lambda/RDS)' }, 
    category: 'Cloud',
    proficiency: 4, 
    description: { 
      en: 'Scaling workloads, resilience patterns, observability',
      es: 'Escalado de cargas de trabajo, patrones de resiliencia, observabilidad',
      fr: 'Mise à l\'échelle des charges de travail, patterns de résilience, observabilité',
      de: 'Skalierung von Workloads, Resilienzmuster, Beobachtbarkeit'
    } 
  },
  { 
    name: { en: 'Headless / Composable Commerce', es: 'Comercio Headless / Composable', fr: 'Commerce Headless / Composable', de: 'Headless / Composable Commerce' }, 
    category: 'Commerce',
    proficiency: 5, 
    description: { 
      en: 'SFCC, Commercetools, Fabric, Alokai, Builder.io',
      es: 'SFCC, Commercetools, Fabric, Alokai, Builder.io',
      fr: 'SFCC, Commercetools, Fabric, Alokai, Builder.io',
      de: 'SFCC, Commercetools, Fabric, Alokai, Builder.io'
    } 
  },
  { 
    name: { en: 'System Design', es: 'Diseño de Sistemas', fr: 'Conception de Systèmes', de: 'Systemdesign' }, 
    category: 'Architecture',
    proficiency: 4, 
    description: { 
      en: 'CQRS, event sourcing, caching, circuit breakers, bulkheads',
      es: 'CQRS, event sourcing, caché, circuit breakers, bulkheads',
      fr: 'CQRS, event sourcing, mise en cache, disjoncteurs, cloisons étanches',
      de: 'CQRS, Event Sourcing, Caching, Circuit Breakers, Bulkheads'
    } 
  },
  { 
    name: { en: 'AI Productivity', es: 'Productividad con IA', fr: 'Productivité IA', de: 'KI-Produktivität' }, 
    category: 'Productivity',
    proficiency: 4, 
    description: { 
      en: 'Prompt-driven dev, GitHub Copilot, AI search (Algolia, Einstein)',
      es: 'Desarrollo impulsado por prompts, GitHub Copilot, búsqueda con IA (Algolia, Einstein)',
      fr: 'Développement par prompts, GitHub Copilot, recherche IA (Algolia, Einstein)',
      de: 'Prompt-basierte Entwicklung, GitHub Copilot, KI-Suche (Algolia, Einstein)'
    } 
  },
]

const experiences = [
  {
    company: 'BOSCH BGSW (via LanceSoft India Pvt. Ltd.)',
    role: { en: 'Senior Software Engineer (Contract)', es: 'Ingeniero de Software Senior (Contrato)', fr: 'Ingénieur Logiciel Senior (Contrat)', de: 'Senior Software Engineer (Vertrag)' },
    startDate: '2024-10-01',
    endDate: null,
    location: { en: 'Bengaluru, India', es: 'Bengaluru, India', fr: 'Bengaluru, Inde', de: 'Bengaluru, Indien' },
    highlights: [
      { en: 'Built multisite storefronts (Movado) with Alokai + Builder.io + SFCC', es: 'Construí tiendas multisitio (Movado) con Alokai + Builder.io + SFCC', fr: 'Construit des vitrines multisites (Movado) avec Alokai + Builder.io + SFCC', de: 'Multisite-Storefronts (Movado) mit Alokai + Builder.io + SFCC entwickelt' },
      { en: 'Optimized middleware (Node/Express) integrating SCAPI, Adyen, Yotpo', es: 'Optimicé middleware (Node/Express) integrando SCAPI, Adyen, Yotpo', fr: 'Optimisé le middleware (Node/Express) intégrant SCAPI, Adyen, Yotpo', de: 'Middleware (Node/Express) mit SCAPI, Adyen, Yotpo Integration optimiert' },
      { en: 'Improved Core Web Vitals via SSR/SSG strategies and API payload tuning', es: 'Mejoré Core Web Vitals mediante estrategias SSR/SSG y ajuste de carga útil de API', fr: 'Amélioré les Core Web Vitals via des stratégies SSR/SSG et l\'optimisation des charges utiles API', de: 'Core Web Vitals durch SSR/SSG-Strategien und API-Payload-Optimierung verbessert' },
    ],
  },
  {
    company: 'Icreon (Change CX)',
    role: { en: 'Senior Software Engineer', es: 'Ingeniero de Software Senior', fr: 'Ingénieur Logiciel Senior', de: 'Senior Software Engineer' },
    startDate: '2023-06-01',
    endDate: '2024-06-01',
    location: { en: 'Noida, India', es: 'Noida, India', fr: 'Noida, Inde', de: 'Noida, Indien' },
    highlights: [
      { en: 'Led BFF layer for Customer Support Assistance (CSA) on Commercetools', es: 'Lideré la capa BFF para Asistencia de Soporte al Cliente (CSA) en Commercetools', fr: 'Dirigé la couche BFF pour l\'assistance au support client (CSA) sur Commercetools', de: 'BFF-Schicht für Kundensupport-Assistenz (CSA) auf Commercetools geleitet' },
      { en: 'Built themable Next.js + Chakra UI modules consuming aggregated APIs', es: 'Construí módulos tematizables de Next.js + Chakra UI consumiendo APIs agregadas', fr: 'Construit des modules Next.js + Chakra UI personnalisables consommant des APIs agrégées', de: 'Thembare Next.js + Chakra UI Module entwickelt, die aggregierte APIs nutzen' },
      { en: 'Optimized API patterns with caching, batching, and query tuning to lift Lighthouse scores', es: 'Optimicé patrones de API con caché, procesamiento por lotes y ajuste de consultas para mejorar puntuaciones de Lighthouse', fr: 'Optimisé les patterns API avec mise en cache, traitement par lots et optimisation des requêtes pour améliorer les scores Lighthouse', de: 'API-Muster mit Caching, Batching und Query-Tuning optimiert, um Lighthouse-Scores zu verbessern' },
    ],
  },
  {
    company: 'Mastek',
    role: { en: 'Software Engineer', es: 'Ingeniero de Software', fr: 'Ingénieur Logiciel', de: 'Software Engineer' },
    startDate: '2022-01-01',
    endDate: '2023-06-01',
    location: { en: 'Noida, India', es: 'Noida, India', fr: 'Noida, Inde', de: 'Noida, Indien' },
    highlights: [
      { en: 'Designed composable storefront accelerators (Next.js + GraphQL Yoga + Commercetools)', es: 'Diseñé aceleradores de tiendas composables (Next.js + GraphQL Yoga + Commercetools)', fr: 'Conçu des accélérateurs de vitrine composables (Next.js + GraphQL Yoga + Commercetools)', de: 'Composable Storefront Accelerators entworfen (Next.js + GraphQL Yoga + Commercetools)' },
      { en: 'Built reusable PLP/PDP/Cart/Checkout components consuming custom GraphQL API', es: 'Construí componentes reutilizables PLP/PDP/Carrito/Checkout consumiendo API GraphQL personalizada', fr: 'Construit des composants réutilisables PLP/PDP/Panier/Paiement consommant une API GraphQL personnalisée', de: 'Wiederverwendbare PLP/PDP/Warenkorb/Checkout-Komponenten mit benutzerdefinierter GraphQL-API entwickelt' },
      { en: 'Implemented OAuth2 identity/session flows and advanced API transformations', es: 'Implementé flujos de identidad/sesión OAuth2 y transformaciones avanzadas de API', fr: 'Mis en œuvre des flux d\'identité/session OAuth2 et des transformations API avancées', de: 'OAuth2-Identitäts-/Sitzungsflüsse und erweiterte API-Transformationen implementiert' },
    ],
  },
  {
    company: 'Copious Software',
    role: { en: 'Solution Engineer', es: 'Ingeniero de Soluciones', fr: 'Ingénieur Solutions', de: 'Solution Engineer' },
    startDate: '2019-07-01',
    endDate: '2022-01-01',
    location: { en: 'Patna, India', es: 'Patna, India', fr: 'Patna, Inde', de: 'Patna, Indien' },
    highlights: [
      { en: 'Delivered SaaS app (React + Django + PostgreSQL + AWS) automating pro-services workflows', es: 'Entregué aplicación SaaS (React + Django + PostgreSQL + AWS) automatizando flujos de trabajo de servicios profesionales', fr: 'Livré une application SaaS (React + Django + PostgreSQL + AWS) automatisant les flux de travail de services professionnels', de: 'SaaS-App (React + Django + PostgreSQL + AWS) zur Automatisierung von Professional-Services-Workflows geliefert' },
      { en: 'Built chatbots (MS Bot Framework), Teams/Bitrix24 integrations, Twilio WhatsApp bridge', es: 'Construí chatbots (MS Bot Framework), integraciones Teams/Bitrix24, puente WhatsApp de Twilio', fr: 'Construit des chatbots (MS Bot Framework), intégrations Teams/Bitrix24, pont WhatsApp Twilio', de: 'Chatbots (MS Bot Framework), Teams/Bitrix24-Integrationen, Twilio WhatsApp-Bridge entwickelt' },
      { en: 'Owned deployment infra on AWS (S3, RDS, EC2) and Swagger API documentation', es: 'Gestioné infraestructura de despliegue en AWS (S3, RDS, EC2) y documentación de API Swagger', fr: 'Géré l\'infrastructure de déploiement sur AWS (S3, RDS, EC2) et la documentation API Swagger', de: 'Deployment-Infrastruktur auf AWS (S3, RDS, EC2) und Swagger-API-Dokumentation verantwortlich' },
    ],
  },
]

const projects = [
  {
    title: { en: 'Movado Multisite Storefronts', es: 'Tiendas Multisitio de Movado', fr: 'Vitrines Multisites Movado', de: 'Movado Multisite-Storefronts' },
    role: { en: 'Senior Software Engineer', es: 'Ingeniero de Software Senior', fr: 'Ingénieur Logiciel Senior', de: 'Senior Software Engineer' },
    techStack: ['Builder.io', 'Alokai', 'SFCC', 'Next.js Page Router', 'Node.js/Express'],
    achievements: [
      { en: 'Composable frontend with Builder.io visual editing; modular components for marketing self-serve', es: 'Frontend composable con edición visual de Builder.io; componentes modulares para autoservicio de marketing', fr: 'Frontend composable avec édition visuelle Builder.io; composants modulaires pour le libre-service marketing', de: 'Composable Frontend mit Builder.io Visual Editing; modulare Komponenten für Marketing-Self-Service' },
      { en: 'High-performance middleware integrating SCAPI; optimized data flows for storefronts', es: 'Middleware de alto rendimiento integrando SCAPI; flujos de datos optimizados para tiendas', fr: 'Middleware haute performance intégrant SCAPI; flux de données optimisés pour les vitrines', de: 'Hochleistungs-Middleware mit SCAPI-Integration; optimierte Datenflüsse für Storefronts' },
      { en: 'Integrated Adyen, Yotpo without degrading UX; improved Core Web Vitals with SSG/SSR mix', es: 'Integré Adyen, Yotpo sin degradar UX; mejoré Core Web Vitals con combinación SSG/SSR', fr: 'Intégré Adyen, Yotpo sans dégrader l\'UX; amélioré les Core Web Vitals avec un mix SSG/SSR', de: 'Adyen, Yotpo ohne UX-Verschlechterung integriert; Core Web Vitals mit SSG/SSR-Mix verbessert' },
    ],
    link: 'https://www.movado.com',
  },
  {
    title: { en: 'Customer Support Assistance (CSA) for Mason Companies', es: 'Asistencia de Soporte al Cliente (CSA) para Mason Companies', fr: 'Assistance au Support Client (CSA) pour Mason Companies', de: 'Kundensupport-Assistenz (CSA) für Mason Companies' },
    role: { en: 'Senior Software Engineer', es: 'Ingeniero de Software Senior', fr: 'Ingénieur Logiciel Senior', de: 'Senior Software Engineer' },
    techStack: ['Commercetools JS SDK', 'Next.js', 'Node.js BFF', 'Chakra UI'],
    achievements: [
      { en: 'Engineered BFF orchestration integrating Commercetools GraphQL/REST + 3P services', es: 'Ingenié orquestación BFF integrando Commercetools GraphQL/REST + servicios 3P', fr: 'Conçu l\'orchestration BFF intégrant Commercetools GraphQL/REST + services tiers', de: 'BFF-Orchestrierung mit Commercetools GraphQL/REST + 3P-Services entwickelt' },
      { en: 'Built high-performance, reusable UI modules with Next.js + Chakra UI (themable)', es: 'Construí módulos UI reutilizables de alto rendimiento con Next.js + Chakra UI (tematizables)', fr: 'Construit des modules UI réutilisables haute performance avec Next.js + Chakra UI (personnalisables)', de: 'Hochleistungs-, wiederverwendbare UI-Module mit Next.js + Chakra UI (thembar) entwickelt' },
      { en: 'Implemented caching/batching to reduce page load and lift Lighthouse scores', es: 'Implementé caché/procesamiento por lotes para reducir carga de página y mejorar puntuaciones Lighthouse', fr: 'Mis en œuvre la mise en cache/le traitement par lots pour réduire le temps de chargement et améliorer les scores Lighthouse', de: 'Caching/Batching implementiert, um Seitenladezeit zu reduzieren und Lighthouse-Scores zu verbessern' },
    ],
  },
  {
    title: { en: 'AAFES Storefront (Army Air Force Exchange Service)', es: 'Tienda AAFES (Servicio de Intercambio de la Fuerza Aérea del Ejército)', fr: 'Vitrine AAFES (Service d\'échange de l\'armée de l\'air)', de: 'AAFES Storefront (Army Air Force Exchange Service)' },
    role: { en: 'Full Stack Developer', es: 'Desarrollador Full Stack', fr: 'Développeur Full Stack', de: 'Full Stack Entwickler' },
    techStack: ['Next.js', 'Commercetools JS SDK', 'Frontastic'],
    achievements: [
      { en: 'Developed PLP/PDP modules with Commercetools SDK and TypeScript', es: 'Desarrollé módulos PLP/PDP con Commercetools SDK y TypeScript', fr: 'Développé des modules PLP/PDP avec Commercetools SDK et TypeScript', de: 'PLP/PDP-Module mit Commercetools SDK und TypeScript entwickelt' },
      { en: 'Customized PDP for dynamic pricing, inventory checks, variant selection', es: 'Personalicé PDP para precios dinámicos, verificaciones de inventario, selección de variantes', fr: 'Personnalisé la PDP pour la tarification dynamique, les vérifications de stock, la sélection de variantes', de: 'PDP für dynamische Preisgestaltung, Bestandsprüfungen, Variantenauswahl angepasst' },
      { en: 'Built reusable cart/checkout components aligned with headless principles', es: 'Construí componentes reutilizables de carrito/checkout alineados con principios headless', fr: 'Construit des composants panier/paiement réutilisables alignés sur les principes headless', de: 'Wiederverwendbare Warenkorb-/Checkout-Komponenten nach Headless-Prinzipien entwickelt' },
    ],
    link: 'https://www.shopmyexchange.com',
  },
  {
    title: { en: 'Commercetools Storefront Accelerator (GraphQL)', es: 'Acelerador de Tienda Commercetools (GraphQL)', fr: 'Accélérateur de Vitrine Commercetools (GraphQL)', de: 'Commercetools Storefront Accelerator (GraphQL)' },
    role: { en: 'Full Stack Developer', es: 'Desarrollador Full Stack', fr: 'Développeur Full Stack', de: 'Full Stack Entwickler' },
    techStack: ['Next.js App Router', 'GraphQL Yoga', 'Express', 'Commercetools GraphQL'],
    achievements: [
      { en: 'Architected end-to-end headless commerce accelerator with BFF GraphQL layer', es: 'Arquitecturé acelerador de comercio headless de extremo a extremo con capa BFF GraphQL', fr: 'Architecturé un accélérateur de commerce headless de bout en bout avec couche BFF GraphQL', de: 'End-to-End Headless Commerce Accelerator mit BFF-GraphQL-Schicht konzipiert' },
      { en: 'Designed resolvers/services to transform commercetools API responses', es: 'Diseñé resolvers/servicios para transformar respuestas de API de commercetools', fr: 'Conçu des résolveurs/services pour transformer les réponses API commercetools', de: 'Resolver/Services zur Transformation von Commercetools-API-Antworten entworfen' },
      { en: 'Built foundational UI library (PLP/PDP/Cart/Checkout) consuming custom GraphQL API', es: 'Construí biblioteca UI fundamental (PLP/PDP/Carrito/Checkout) consumiendo API GraphQL personalizada', fr: 'Construit une bibliothèque UI fondamentale (PLP/PDP/Panier/Paiement) consommant une API GraphQL personnalisée', de: 'Grundlegende UI-Bibliothek (PLP/PDP/Warenkorb/Checkout) mit benutzerdefinierter GraphQL-API entwickelt' },
    ],
  },
  {
    title: { en: 'Fabric Inc Storefront Accelerator', es: 'Acelerador de Tienda Fabric Inc', fr: 'Accélérateur de Vitrine Fabric Inc', de: 'Fabric Inc Storefront Accelerator' },
    role: { en: 'Full Stack Developer', es: 'Desarrollador Full Stack', fr: 'Développeur Full Stack', de: 'Full Stack Entwickler' },
    techStack: ['Next.js', 'Express BFF', 'Commercetools REST', 'Contentful'],
    achievements: [
      { en: 'Built technology-agnostic composable accelerator with Next.js + Express BFF', es: 'Construí acelerador composable agnóstico de tecnología con Next.js + Express BFF', fr: 'Construit un accélérateur composable agnostique technologique avec Next.js + Express BFF', de: 'Technologie-agnostischen Composable Accelerator mit Next.js + Express BFF entwickelt' },
      { en: 'Orchestrated REST endpoints aggregating Commercetools APIs for frontend simplicity', es: 'Orquesté endpoints REST agregando APIs de Commercetools para simplicidad del frontend', fr: 'Orchestré des endpoints REST agrégeant les APIs Commercetools pour simplifier le frontend', de: 'REST-Endpoints zur Aggregation von Commercetools-APIs für Frontend-Vereinfachung orchestriert' },
      { en: 'Integrated Contentful as headless CMS for dynamic content in the storefront', es: 'Integré Contentful como CMS headless para contenido dinámico en la tienda', fr: 'Intégré Contentful comme CMS headless pour le contenu dynamique dans la vitrine', de: 'Contentful als Headless-CMS für dynamische Inhalte im Storefront integriert' },
    ],
  },
  {
    title: { en: 'SaaS for Professional Services Automation', es: 'SaaS para Automatización de Servicios Profesionales', fr: 'SaaS pour l\'automatisation des services professionnels', de: 'SaaS für Professional Services Automation' },
    role: { en: 'Solution Engineer', es: 'Ingeniero de Soluciones', fr: 'Ingénieur Solutions', de: 'Solution Engineer' },
    techStack: ['React', 'Django', 'PostgreSQL', 'AWS'],
    achievements: [
      { en: 'Automated time-consuming workflows to reduce operational costs and boost revenue', es: 'Automaticé flujos de trabajo que consumen tiempo para reducir costos operativos y aumentar ingresos', fr: 'Automatisé les flux de travail chronophages pour réduire les coûts opérationnels et augmenter les revenus', de: 'Zeitaufwändige Workflows automatisiert, um Betriebskosten zu senken und Umsatz zu steigern' },
      { en: 'Designed/implemented REST APIs in Django + Postgres; owned AWS infra (S3, RDS, EC2)', es: 'Diseñé/implementé APIs REST en Django + Postgres; gestioné infraestructura AWS (S3, RDS, EC2)', fr: 'Conçu/mis en œuvre des APIs REST dans Django + Postgres; géré l\'infra AWS (S3, RDS, EC2)', de: 'REST-APIs in Django + Postgres entworfen/implementiert; AWS-Infrastruktur (S3, RDS, EC2) verantwortlich' },
      { en: 'Led discovery workshops, translated business workflows into technical specs', es: 'Lideré talleres de descubrimiento, traduje flujos de trabajo empresariales en especificaciones técnicas', fr: 'Animé des ateliers de découverte, traduit les flux de travail métier en spécifications techniques', de: 'Discovery-Workshops geleitet, Geschäftsworkflows in technische Spezifikationen übersetzt' },
    ],
  },
]

async function upsertCollectionItem<T extends { title?: string | Record<string, string>; name?: string | Record<string, string>; company?: string }>(
  payloadClient: typeof import('payload')['default'],
  collection: string,
  doc: T,
) {
  // Collection-specific unique field mapping
  const uniqueFieldMap: Record<string, string> = {
    skills: 'name.en',
    experiences: 'company',
    projects: 'title.en',
  }
  
  const uniqueFieldPath = uniqueFieldMap[collection]
  if (!uniqueFieldPath) {
    await payloadClient.create({ collection: collection as any, data: doc })
    return
  }

  // Handle nested field paths like 'name.en'
  const [fieldName, locale] = uniqueFieldPath.split('.')
  const fieldValue = (doc as any)[fieldName]
  const uniqueValue = locale ? fieldValue?.[locale] : fieldValue
  
  if (!uniqueValue) {
    await payloadClient.create({ collection: collection as any, data: doc })
    return
  }
  
  const existing = await payloadClient.find({ 
    collection: collection as any, 
    where: { [uniqueFieldPath]: { equals: uniqueValue } }, 
    limit: 1 
  })
  
  if (existing.docs.length > 0) {
    // Update existing document
    await payloadClient.update({
      collection: collection as any,
      id: existing.docs[0].id,
      data: doc,
    })
    return
  }
  await payloadClient.create({ collection: collection as any, data: doc })
}

const mapArray = (items?: string[]) => (items ? items.map((value) => ({ value })) : [])

async function run() {
  const secret = '8ef2c743a2597736c74829bf63d081212f4bb7edac2be541447a1d22fd9fa7a7'
  if (!secret) {
    throw new Error('PAYLOAD_SECRET is missing. Add it to your environment (e.g., .env.local) before seeding.')
  }

  // Debug: confirm secret is available at runtime
  // eslint-disable-next-line no-console
  console.log('Using PAYLOAD_SECRET length:', secret.length)

  // Ensure config files loaded later also see the secret
  process.env.PAYLOAD_SECRET = '8ef2c743a2597736c74829bf63d081212f4bb7edac2be541447a1d22fd9fa7a7'

  const payloadClient = (await import('payload')).default
  const payloadConfig = (await import('../src/payload.config.ts')).default

  await payloadClient.init({
    config: payloadConfig,
  })

  const locales = ['en', 'es', 'fr', 'de']

  // Seed skills with localization
  for (const skill of skills) {
    // First create with English
    const existing = await payloadClient.find({
      collection: 'skills',
      where: { 'name.en': { equals: (skill.name as any).en } },
      locale: 'en',
      limit: 1,
    })

    let skillId: string

    if (existing.docs.length === 0) {
      const created = await payloadClient.create({
        collection: 'skills',
        locale: 'en',
        data: {
          name: (skill.name as any).en,
          category: skill.category,
          proficiency: skill.proficiency,
          description: (skill.description as any).en,
        },
      })
      skillId = created.id
    } else {
      skillId = existing.docs[0].id
    }

    // Then update with other locales
    for (const locale of locales.filter(l => l !== 'en')) {
      await payloadClient.update({
        collection: 'skills',
        id: skillId,
        locale,
        data: {
          name: (skill.name as any)[locale],
          description: (skill.description as any)[locale],
        },
      })
    }
  }

  // Seed experiences with localization
  for (const exp of experiences) {
    const existing = await payloadClient.find({
      collection: 'experiences',
      where: { company: { equals: exp.company } },
      locale: 'en',
      limit: 1,
    })

    let expId: string

    if (existing.docs.length === 0) {
      const created = await payloadClient.create({
        collection: 'experiences',
        locale: 'en',
        data: {
          company: exp.company,
          role: (exp.role as any).en,
          startDate: exp.startDate,
          endDate: exp.endDate,
          location: (exp.location as any).en,
          highlights: (exp.highlights as any).map((h: any) => ({ value: h.en })),
        },
      })
      expId = created.id
    } else {
      expId = existing.docs[0].id
    }

    // Update other locales
    for (const locale of locales.filter(l => l !== 'en')) {
      await payloadClient.update({
        collection: 'experiences',
        id: expId,
        locale,
        data: {
          role: (exp.role as any)[locale],
          location: (exp.location as any)[locale],
          highlights: (exp.highlights as any).map((h: any) => ({ value: h[locale] })),
        },
      })
    }
  }

  // Seed projects with localization
  for (const project of projects) {
    const existing = await payloadClient.find({
      collection: 'projects',
      where: { 'title.en': { equals: (project.title as any).en } },
      locale: 'en',
      limit: 1,
    })

    let projectId: string

    if (existing.docs.length === 0) {
      const created = await payloadClient.create({
        collection: 'projects',
        locale: 'en',
        data: {
          title: (project.title as any).en,
          role: (project.role as any).en,
          techStack: mapArray(project.techStack),
          achievements: (project.achievements as any).map((a: any) => ({ value: a.en })),
          link: project.link,
        },
      })
      projectId = created.id
    } else {
      projectId = existing.docs[0].id
    }

    // Update other locales
    for (const locale of locales.filter(l => l !== 'en')) {
      await payloadClient.update({
        collection: 'projects',
        id: projectId,
        locale,
        data: {
          title: (project.title as any)[locale],
          role: (project.role as any)[locale],
          achievements: (project.achievements as any).map((a: any) => ({ value: a[locale] })),
        },
      })
    }
  }

  // Create Contact Us page with localized content
  
  for (const locale of locales) {
    const existingContactPage = await payloadClient.find({
      collection: 'pages',
      where: { slug: { equals: 'contact-us' } },
      locale,
      limit: 1,
    })

    if (existingContactPage.docs.length === 0) {
      const contactPageContent = {
        en: {
          title: 'Contact Us',
          heroHeading: 'Get in Touch',
          heroText: 'Have a question or want to work together? Feel free to reach out!',
          heading: 'Contact Information',
          protectedText: 'This is a protected page - only authenticated users can view this content.',
          email: '📧 Email: your-email@example.com',
          phone: '📱 Phone: +1 (555) 123-4567',
          location: '📍 Location: Your City, Country',
          metaDescription: 'Get in touch with us. This page requires authentication.',
        },
        es: {
          title: 'Contáctanos',
          heroHeading: 'Ponte en Contacto',
          heroText: '¿Tienes una pregunta o quieres trabajar juntos? ¡No dudes en contactarnos!',
          heading: 'Información de Contacto',
          protectedText: 'Esta es una página protegida - solo los usuarios autenticados pueden ver este contenido.',
          email: '📧 Email: tu-correo@ejemplo.com',
          phone: '📱 Teléfono: +1 (555) 123-4567',
          location: '📍 Ubicación: Tu Ciudad, País',
          metaDescription: 'Ponte en contacto con nosotros. Esta página requiere autenticación.',
        },
        fr: {
          title: 'Nous Contacter',
          heroHeading: 'Contactez-nous',
          heroText: 'Vous avez une question ou souhaitez travailler ensemble? N\'hésitez pas à nous contacter!',
          heading: 'Informations de Contact',
          protectedText: 'Ceci est une page protégée - seuls les utilisateurs authentifiés peuvent voir ce contenu.',
          email: '📧 Email: votre-email@exemple.com',
          phone: '📱 Téléphone: +1 (555) 123-4567',
          location: '📍 Emplacement: Votre Ville, Pays',
          metaDescription: 'Contactez-nous. Cette page nécessite une authentification.',
        },
        de: {
          title: 'Kontakt',
          heroHeading: 'Kontaktieren Sie uns',
          heroText: 'Haben Sie eine Frage oder möchten Sie zusammenarbeiten? Kontaktieren Sie uns gerne!',
          heading: 'Kontaktinformationen',
          protectedText: 'Dies ist eine geschützte Seite - nur authentifizierte Benutzer können diesen Inhalt sehen.',
          email: '📧 Email: ihre-email@beispiel.com',
          phone: '📱 Telefon: +1 (555) 123-4567',
          location: '📍 Standort: Ihre Stadt, Land',
          metaDescription: 'Kontaktieren Sie uns. Diese Seite erfordert Authentifizierung.',
        },
      }

      const content = contactPageContent[locale as keyof typeof contactPageContent]

      if (locale === 'en') {
        // Create the initial document in English
        await payloadClient.create({
          collection: 'pages',
          locale,
          context: {
            skipRevalidate: true,
          },
          data: {
            title: content.title,
            slug: 'contact-us',
            requiresAuth: true,
            _status: 'published',
            hero: {
              type: 'lowImpact',
              richText: [
                {
                  type: 'heading',
                  tag: 'h1',
                  children: [{ text: content.heroHeading }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: content.heroText }],
                },
              ],
            },
            layout: [
              {
                blockType: 'content',
                columns: [
                  {
                    size: 'full',
                    richText: [
                      {
                        type: 'heading',
                        tag: 'h2',
                        children: [{ text: content.heading }],
                      },
                      {
                        type: 'paragraph',
                        children: [{ text: content.protectedText }],
                      },
                      {
                        type: 'paragraph',
                        children: [{ text: content.email }],
                      },
                      {
                        type: 'paragraph',
                        children: [{ text: content.phone }],
                      },
                      {
                        type: 'paragraph',
                        children: [{ text: content.location }],
                      },
                    ],
                  },
                ],
              },
            ],
            meta: {
              title: content.title,
              description: content.metaDescription,
            },
          },
        })
        // eslint-disable-next-line no-console
        console.log(`✓ Contact Us page created for locale: ${locale}`)
      } else {
        // Update existing document with localized content
        const enPage = await payloadClient.find({
          collection: 'pages',
          where: { slug: { equals: 'contact-us' } },
          locale: 'en',
          limit: 1,
        })

        if (enPage.docs.length > 0) {
          await payloadClient.update({
            collection: 'pages',
            id: enPage.docs[0].id,
            locale,
            context: {
              skipRevalidate: true,
            },
            data: {
              title: content.title,
              hero: {
                type: 'lowImpact',
                richText: [
                  {
                    type: 'heading',
                    tag: 'h1',
                    children: [{ text: content.heroHeading }],
                  },
                  {
                    type: 'paragraph',
                    children: [{ text: content.heroText }],
                  },
                ],
              },
              layout: [
                {
                  blockType: 'content',
                  columns: [
                    {
                      size: 'full',
                      richText: [
                        {
                          type: 'heading',
                          tag: 'h2',
                          children: [{ text: content.heading }],
                        },
                        {
                          type: 'paragraph',
                          children: [{ text: content.protectedText }],
                        },
                        {
                          type: 'paragraph',
                          children: [{ text: content.email }],
                        },
                        {
                          type: 'paragraph',
                          children: [{ text: content.phone }],
                        },
                        {
                          type: 'paragraph',
                          children: [{ text: content.location }],
                        },
                      ],
                    },
                  ],
                },
              ],
              meta: {
                title: content.title,
                description: content.metaDescription,
              },
            },
          })
          // eslint-disable-next-line no-console
          console.log(`✓ Contact Us page updated for locale: ${locale}`)
        }
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(`✓ Contact Us page already exists for locale: ${locale}`)
    }
  }

  // eslint-disable-next-line no-console
  console.log('Seed completed.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
