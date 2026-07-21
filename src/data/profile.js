/*
 * Single source of truth for all site content. Edit here — never in the
 * section components. Contact email/phone live in src/lib/contact.js.
 */

export const identity = {
  name: 'Adesh Anand',
  role: 'Senior Software Engineer & Composable Commerce Specialist',
  location: 'Bengaluru, India',
  linkedin: 'https://www.linkedin.com/in/adeshanand',
  resumeFile: '/Adesh-Anand-Resume.pdf',
};

export const hero = {
  headline: ['Composable commerce,', 'engineered to scale.'],
  sub: 'Senior Software Engineer with 8 years building resilient, low-latency storefronts and AI-powered systems for brands like Woolworths, Movado, and AAFES — driving AI readiness through orchestration and autonomous services across Next.js, Node.js, and MACH architecture.',
  chips: ['2× AWS Certified', '8 years', 'MACH architecture'],
  brands: ['Woolworths', 'Movado', 'AAFES', 'Masons', 'Fabric'],
};

export const impact = [
  {
    value: 8,
    label: 'years of engineering experience',
    context: 'Full-stack, commerce & AI systems',
  },
  {
    value: 80,
    suffix: '%',
    label: 'less marketing dependency on engineering',
    context: 'Movado composable storefronts',
  },
  {
    value: 40,
    suffix: '%',
    label: 'fewer redundant upstream API calls',
    context: 'Masons customer support platform',
  },
  {
    value: 60,
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
      'Java',
      'GraphQL',
      'REST APIs',
      'AWS (SQS, EC2, S3)',
      'Kafka',
      'Redis',
      'Vector DB',
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
      'Sanity.io',
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

/* AWS credentials get first-class treatment (hero chip + dedicated
 * spotlight section); the rest render in the supporting Credentials
 * section. `date` and `credentialId` are optional everywhere. */
export const awsCertifications = [
  {
    name: 'AWS Certified Generative AI Developer',
    short: 'Generative AI Developer',
    level: 'Professional',
    badge: '/badges/aws-generative-ai-developer-professional.png',
    tagline:
      'Generative AI systems on AWS — model integration, RAG pipelines, and agentic workflows built to production standards.',
    credentialId: '036a883f8f494731ab6197b75b36528a',
    verifyUrl: 'https://aws.amazon.com/verification',
  },
  {
    name: 'AWS Certified Solutions Architect',
    short: 'Solutions Architect',
    level: 'Associate',
    badge: '/badges/aws-solutions-architect-associate.png',
    tagline:
      'Cloud architecture fundamentals — resilient, cost-aware, secure-by-default systems on AWS infrastructure.',
    date: 'Jul 2023',
    credentialId: 'PQZDYFVKVBQE16KL',
    verifyUrl: 'https://cp.certmetrics.com/amazon/en/public/verify/credential/',
  },
];

export const certifications = [
  {
    name: 'Sanity Certified Content Operator',
    issuer: 'Sanity',
    date: 'Jul 2026',
    logo: '/logos/sanity.png',
    verifyUrl: 'https://www.sanity.io/learn/profile/gt0XGk6qI',
  },
  {
    name: 'Oracle Certified Agentic AI Developer',
    issuer: 'Oracle',
    logo: '/logos/oracle.png',
    verifyUrl:
      'https://catalog-education.oracle.com/ords/certview/sharebadge?id=96FE037C13FBED0427A24EB31A5AED45AD3FD1F5BA497D39DC3D1E70990904CB',
  },
  {
    name: 'Salesforce Certified B2C Commerce Cloud Developer',
    issuer: 'Salesforce',
    date: 'Sep 2025',
    credentialId: '6718429',
    logo: '/logos/salesforce.svg',
    verifyUrl: 'https://trailhead.salesforce.com/en/credentials/verification/',
  },
  {
    name: 'Cyber Security Training Completion Certificate',
    issuer: 'Safe Security (earlier Lucideus)',
    credentialId: 'LCEH/50055',
    logo: '/logos/safe-security.png',
    verifyUrl: 'https://drive.google.com/file/d/14hq5FXA4X_Lg19i5S699xlfO678BwG0f',
  },
];

export const recognitions = [
  {
    name: 'Freshworks Security Hall of Fame',
    body: 'Recognized by Freshworks for contributions to their responsible disclosure program, with a listing in their Hall of Fame.',
    logo: '/logos/freshworks.png',
    url: 'https://www.freshworks.com/security/responsible-disclosure/',
  },
];

export const education = [
  {
    degree: 'Master of Computer Applications',
    school: "Tula's Institute, Dehradun",
    period: '2014 — 2016',
    score: '71.77%',
    logo: '/logos/tulas.png',
  },
  {
    degree: 'Bachelor of Computer Applications',
    school: 'Lalit Narayana Mishra College of Business Management',
    period: '2011 — 2014',
    score: '72.46%',
    logo: '/logos/lnmcbm.png',
  },
];


/* LinkedIn recommendations, quoted verbatim (roles are each person's own
 * LinkedIn headline, first segment). URLs point at their profiles. */
export const testimonials = [
  {
    name: 'Mukund Kumar',
    role: 'International Business & Delivery',
    relation: 'Managed Adesh directly',
    date: 'Jul 2026',
    url: 'https://www.linkedin.com/in/mukund-kumar-49917316/',
    initials: 'MK',
    quote:
      "When I was managing regional operations and scaling our business at Copious Software, having dependable technical talent was critical to our success. Adesh joined us as a Solution Engineer in 2019, and he quickly became the person we relied on to manage the engineering side of our professional services application. He practically owned the AWS infrastructure, setting up EC2, RDS, and Lambda to automate workflows seamlessly. What I appreciated most about Adesh was his highly practical approach to engineering—whether he was designing secure RESTful APIs or integrating third-party tools like Twilio, Bitrix24 and Zapier, he just got it done efficiently. He is a rock-solid engineer who truly understands how to support business needs.",
  },
  {
    name: 'Rohit Singh',
    role: 'Building TRIPPLE DOUBLE · Founder',
    relation: 'Managed Adesh directly',
    date: 'Jul 2026',
    url: 'https://www.linkedin.com/in/rohitspsingh/',
    initials: 'RS',
    quote:
      "Adesh worked with me on a few tech projects, and he quickly became the person we trusted with the tricky stuff. His biggest strengths are his work ethic and his refusal to give up. When a project got difficult, Adesh would just put his head down, do the research, and take full responsibility from start to finish.\n\nHe’s a fantastic team member to have in your corner, and I’d happily work with him again.",
  },
  {
    name: 'Rajapandi K',
    role: 'MERN and Commercetools developer',
    relation: 'Worked with Adesh on the same team',
    date: 'Jul 2026',
    url: 'https://www.linkedin.com/in/errp/',
    initials: 'RK',
    quote:
      "I had the pleasure of working with Adesh on the AAFES project, where we collaborated on building a headless e-commerce platform using Commercetools, Next.js, and MACH architecture. Adesh has a strong understanding of composable commerce principles and consistently demonstrated deep technical expertise in Commercetools, modern frontend development, and scalable solution design. He was instrumental in solving complex technical challenges, building high-quality features, and ensuring clean, maintainable implementations. Beyond his technical skills, Adesh is collaborative, dependable, and always willing to support the team. His passion for modern commerce technologies and commitment to delivering quality solutions make him a valuable asset to any engineering team. I highly recommend him to any organization looking for a talented full-stack engineer with strong expertise in Commercetools and MACH-based architectures.",
  },
  {
    name: 'Thabrez Ahmed S',
    role: 'Senior Front-end Engineer',
    relation: 'Worked with Adesh on the same team',
    date: 'Jul 2026',
    url: 'https://www.linkedin.com/in/thabrez-ahmed-s-14a293119/',
    initials: 'TA',
    quote:
      "I had the opportunity to work with Adesh for over a year, and it was a great experience. He has strong problem-solving skills and consistently performs thorough issue investigations to identify and resolve root causes effectively.\n\nAdesh is highly proficient in Builder.io and backend development, demonstrating both technical expertise and a practical approach to solving complex challenges. He is dependable, collaborative, and always willing to support the team when needed. I highly recommend Adesh to any team looking for a skilled and dedicated engineer.",
  },
  {
    name: 'Anurag Sreedevi Nair',
    role: 'Full Stack Developer at Royal Cyber',
    relation: 'Worked with Adesh on the same team',
    date: 'Jul 2026',
    url: 'https://www.linkedin.com/in/anurag-nair-007/',
    initials: 'AN',
    quote:
      "I had the opportunity to work with Adesh Anand at Icreon on a customer support application built on a Composable Commerce architecture using commercetools. Adesh was responsible for the backend development and consistently demonstrated strong technical expertise, ownership, and a solution-oriented approach throughout the project.\n\nHe has a solid understanding of commercetools and backend development, and played a key role in building reliable, scalable services. He collaborated seamlessly with the team, communicated effectively, and was always willing to help resolve technical challenges.\n\nWhat stood out the most was his commitment to delivering high-quality solutions and his professionalism. His work was appreciated not only by the team but also by our clients, who recognized his ability to understand requirements and deliver consistently.\n\nIt was a pleasure working with Adesh, and I would highly recommend him to any organization looking for a skilled backend engineer with strong experience in Composable Commerce and commercetools.",
  },
  {
    name: 'Prafulla Kr.',
    role: 'Cloud Data Engineer · AWS/GCP/Cloudera',
    relation: 'Was Adesh’s mentor',
    date: 'Oct 2023',
    url: 'https://www.linkedin.com/in/prafulla-kr/',
    initials: 'PK',
    quote:
      "I am pleased to write for Adesh, as SDE who consistently makes a significant impact on every assignment he takes on. Adesh is an exceptional talent in our field, and his abilities are truly remarkable.\n\nAdesh's work is characterized by a level of excellence that is rare to find. He has an innate ability to write high-quality solutions that are not only functional but also incredibly smart. When faced with complex challenges, Adesh's analytical mindset and problem-solving skills shine, leading to innovative solutions that make a real difference.\n\nAdesh's contributions to every project are invaluable. His work has consistently led to the successful delivery of top-notch software solutions. He's a team player, always ready to collaborate, share his knowledge, and support his colleagues.\n\nAdesh's passion for solution design and development is contagious, motivating those around him to continually improve and learn. He not only excels in his role but also inspires others, making him an asset to any team.",
  },
  {
    name: 'VH Chaudhari',
    role: 'Co-Founder & CTO @ PySquad',
    relation: 'Worked with Adesh on the same team',
    date: 'Oct 2021',
    url: 'https://www.linkedin.com/in/vh-chaudhari-412729101/',
    initials: 'VC',
    quote:
      "Adesh is the very Innovative person I ever meet, He has great experience in product development. He has always come up with the best ideas for product development and they seem very innovative. He has always the number of solutions with his own reserach and use cases(Not only technical). I have worked with him on one of large product and I am happy to recommend him.",
  },
];
