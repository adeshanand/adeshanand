/*
 * Single source of truth for all site content. Edit here — never in the
 * section components. Contact email/phone live in src/lib/contact.js.
 */

export const identity = {
  name: 'Adesh Anand',
  role: 'Senior Full-Stack Engineer & Composable Commerce Specialist',
  location: 'Bengaluru, India',
  linkedin: 'https://www.linkedin.com/in/adeshanand',
  resumeFile: '/Adesh-Anand-Resume.pdf',
};

export const hero = {
  headline: ['Composable commerce,', 'engineered to scale.'],
  sub: 'Senior Full-Stack Engineer with 7+ years building resilient, low-latency storefronts and AI-powered systems for brands like Woolworths, Movado, and AAFES — across Next.js, Node.js, and MACH architecture.',
  brands: ['Woolworths', 'Movado', 'AAFES', 'Masons', 'Fabric'],
};

export const impact = [
  {
    value: 7,
    suffix: '+',
    label: 'years of engineering experience',
    context: 'Full-stack, commerce & AI systems',
  },
  {
    value: 80,
    prefix: '~',
    suffix: '%',
    label: 'less marketing dependency on engineering',
    context: 'Movado composable storefronts',
  },
  {
    value: 40,
    prefix: '~',
    suffix: '%',
    label: 'fewer redundant upstream API calls',
    context: 'Masons customer support platform',
  },
  {
    value: 60,
    prefix: '~',
    suffix: '%',
    label: 'faster new-storefront setup',
    context: 'Commercetools accelerators',
  },
];

export const experience = [
  {
    company: 'Zensar Technologies',
    role: 'Technical Specialist',
    period: "Apr 2026 — Present",
    location: 'Bengaluru',
    projects: [
      {
        name: 'Woolworths Storefront',
        blurb:
          'Developing targeted proof-of-concepts to assess Commercetools capabilities across order workflows and promotional engines — validating the technical feasibility of replacing the existing ATG platform with a composable commerce solution.',
        stack: ['Commercetools', 'Composable Commerce', 'PoC Engineering'],
      },
    ],
  },
  {
    company: 'BOSCH BGSW',
    meta: 'Payroll — LanceSoft',
    role: 'Senior Software Engineer',
    period: 'Oct 2024 — Apr 2026',
    location: 'Bengaluru',
    projects: [
      {
        name: 'Movado Storefronts',
        blurb:
          'Built and optimized a high-performance, composable multi-site platform across movado.com and movadocompanystore.com — cutting the marketing team’s dependency on engineering for page launches by ~80%.',
        points: [
          'Owned features end-to-end on a Builder.io visual-editing frontend with Next.js, shipping modular components and content models the marketing team assembles into landing pages independently.',
          'Developed custom RESTful APIs for data transformation and optimized SCAPI responses, maintaining the high-performance Alokai middleware layer against SFCC.',
          'Integrated Adyen payments and Yotpo reviews with robust API connection logic — secure, reliable, and invisible to the core experience.',
          'Paired deep SFCC SCAPI knowledge with Next.js SSG/SSR strategies to shrink frontend payloads and lift rendering speed, SEO, and Core Web Vitals.',
        ],
        stack: ['SFCC', 'Alokai', 'Builder.io', 'Next.js', 'Adyen', 'Yotpo'],
      },
    ],
  },
  {
    company: 'Icreon',
    meta: 'earlier Change CX',
    role: 'Senior Software Engineer',
    period: 'Jun 2023 — Jun 2024',
    location: 'Noida',
    projects: [
      {
        name: 'Masons CSA',
        blurb:
          'Engineered a headless customer-support application serving 5 storefronts on MACH principles — a Node.js BFF orchestration layer with Saga patterns cut redundant upstream API calls by ~40% and average page loads by ~30%.',
        stack: ['Next.js', 'Commercetools', 'Node.js BFF', 'Saga Patterns'],
      },
      {
        name: 'AAFES Storefront',
        blurb:
          'Built a scalable, decoupled storefront for shopmyexchange.com — custom PDPs plus core PLP, Cart, and Checkout components supporting a 10K+ product catalog, with API response times reduced ~35% through optimized data-fetching.',
        stack: ['Next.js', 'Commercetools', 'Headless Commerce'],
      },
    ],
  },
  {
    company: 'Mastek',
    role: 'Software Engineer',
    period: 'Jan 2022 — Jun 2023',
    location: 'Noida',
    projects: [
      {
        name: 'Commercetools Storefront Accelerators',
        blurb:
          'Architected a Yoga-GraphQL + Express.js BFF on microservices principles with fault isolation and exponential backoff — a production-ready accelerator that cut new-storefront setup time by ~60% and API failure rates.',
        stack: ['Next.js', 'Builder.io', 'GraphQL Yoga', 'Express.js'],
      },
      {
        name: 'Fabric Inc Storefront Accelerator',
        blurb:
          'Built a technology-agnostic composable accelerator from the ground up — custom BFF endpoints over Commercetools REST APIs and Contentful CMS cut backend integration complexity by ~50% and shortened time-to-market.',
        stack: ['Next.js', 'Express.js BFF', 'Commercetools', 'Contentful'],
      },
    ],
  },
  {
    company: 'Copious Software',
    role: 'Solution Engineer',
    period: 'Jul 2019 — Jan 2022',
    location: 'Patna',
    projects: [
      {
        name: 'App for Professional Service Businesses',
        blurb:
          'Delivered AWS infrastructure (EC2, RDS with connection pooling, S3, Lambda workflow automation), database performance and schema evolution, intelligent workflow integrations (Zapier, Slack, email), and RESTful APIs with OAuth 2.0.',
        stack: ['AWS', 'REST', 'OAuth 2.0', 'Zapier', 'Slack'],
      },
    ],
  },
];

export const skills = [
  {
    title: 'Backend',
    icon: 'server',
    items: [
      'JavaScript / TypeScript',
      'Node.js',
      'Express.js',
      'Next.js',
      'Python',
      'FastAPI',
      'Java',
      'GraphQL',
      'REST APIs',
      'AWS (SQS, EC2, S3)',
      'Kafka',
      'Redis',
      'ChromaDB',
      'OAuth / OIDC / JWT',
    ],
  },
  {
    title: 'Frontend',
    icon: 'layout',
    items: [
      'React.js',
      'Next.js',
      'SSR / SSG / ISR',
      'SWR',
      'Core Web Vitals',
      'Code-Splitting',
      'Lazy Loading',
      'Asset Optimization',
      'Formik / Yup',
      'Tailwind CSS',
      'Builder.io',
    ],
  },
  {
    title: 'AI & GenAI Systems',
    icon: 'sparkles',
    items: [
      'Multi-LLM with fallback (Groq)',
      'Tool Calling',
      'Prompt Engineering',
      'RAG',
      'Embedding Strategies',
      'Semantic Search',
      'Multi-hop Retrieval',
      'Document OCR',
      'Audio Transcription',
      'Video Analysis',
      'Image Embeddings',
    ],
  },
  {
    title: 'Developer Tools',
    icon: 'wrench',
    items: [
      'Git / GitHub / Bitbucket',
      'Postman',
      'GitHub Copilot',
      'Cursor',
      'Groq API',
      'Claude',
      'Ollama',
    ],
  },
];

export const certifications = [
  {
    name: 'AWS Certified Solutions Architect — Associate',
    issuer: 'Amazon Web Services',
    date: 'Jul 2023',
    credentialId: 'PQZDYFVKVBQE16KL',
    verifyUrl: 'https://cp.certmetrics.com/amazon/en/public/verify/credential/',
  },
  {
    name: 'Salesforce Certified B2C Commerce Cloud Developer',
    issuer: 'Salesforce',
    date: 'Sep 2025',
    credentialId: '6718429',
    verifyUrl: 'https://trailhead.salesforce.com/en/credentials/verification/',
  },
];

export const education = [
  {
    degree: 'Master of Computer Applications',
    school: "Tula's Institute, Dehradun",
    period: '2014 — 2016',
    score: '71.77%',
  },
  {
    degree: 'Bachelor of Computer Applications',
    school: 'Lalit Narayana Mishra College of Business Management',
    period: '2011 — 2014',
    score: '72.46%',
  },
];
