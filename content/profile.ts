// Single source of truth for the site, /llms.txt, /index.md and the MCP server.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kateryna-stetsenko.vercel.app"
).replace(/\/$/, "");

export type Accent = "lavender" | "peach" | "mint" | "sky" | "butter" | "blush";

export const profile = {
  name: "Kateryna Stetsenko",
  shortName: "Kateryna",
  role: "Full-stack developer",
  location: "Ukraine · open to remote",
  tagline:
    "I build fast, friendly web products — from pixel-perfect React interfaces to scalable Python backends.",
  // First person — this is my own site. Agents/llms.txt get a neutral third-person intro below.
  summary: [
    "I'm a full-stack developer with 3+ years of experience across the complete software development life cycle.",
    "On the frontend I work with React, Next.js and React Native; on the backend with Python, Django, FastAPI, Celery, Redis and PostgreSQL — building scalable APIs, designing databases and optimizing systems.",
    "I'm a little obsessed with performance: I cut main-page load time in an enterprise HRMS from 30s to 4s and lifted Lighthouse scores from 60–75 to 90+.",
  ],
  facts:
    "Kateryna Stetsenko is a full-stack developer (3+ years) specializing in React/Next.js frontends and Python/Django backends, with a focus on performance optimization, API and database design, and real-time features. Master's degree in Computerized and Robotic Systems (KhNURE, 2025).",
  strengths: [
    "Performance optimization",
    "Clean, tested, documented code",
    "Database & API design",
    "Real-time features",
    "Code review & mentoring mindset",
  ],
  contact: {
    email: "kateystetsenko@gmail.com",
    linkedin: "https://www.linkedin.com/in/kateryna-stetsenko-72311b251/",
    // TODO: add GitHub profile URL
    github: null as string | null,
    cv: "/Kateryna-Stetsenko-CV.pdf",
  },
};

export type SkillGroup = { title: string; accent: Accent; items: string[] };

export const skills: SkillGroup[] = [
  {
    title: "Frontend",
    accent: "lavender",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "React Native",
      "Redux Toolkit",
      "Tailwind CSS",
      "HTMX",
      "Alpine.js",
      "Electron",
    ],
  },
  {
    title: "Backend",
    accent: "peach",
    items: [
      "Python",
      "Django",
      "FastAPI",
      "Celery",
      "GraphQL",
      "WebSockets",
      "REST APIs",
    ],
  },
  {
    title: "Data & infra",
    accent: "mint",
    items: ["PostgreSQL", "Redis / Valkey", "Docker", "DigitalOcean", "CI/CD"],
  },
  {
    title: "Integrations & quality",
    accent: "sky",
    items: [
      "Stripe",
      "Auth0",
      "Lighthouse / Web Vitals",
      "Unit testing",
      "Code review",
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: string;
  accent: Accent;
  role: string;
  duration: string;
  team: string;
  description: string;
  metric: { value: string; label: string };
  highlights: string[];
  stack: string[];
};

export const projects: Project[] = [
  {
    slug: "horilla",
    name: "Horilla",
    kind: "Open-source HRMS & ERP",
    accent: "lavender",
    role: "Full-stack developer",
    duration: "8 months",
    team: "2–3 people",
    description:
      "Open-source international HRMS and ERP platform for enterprise operations.",
    metric: { value: "30s → 4s", label: "main page load (−85%)" },
    highlights: [
      "Cut load time by up to 85% on main pages and 50% on secondary views by splitting monolithic queries into async HTMX requests and client-side filtering.",
      "Designed Django polymorphic models for a non-duplicating DB architecture across complex HRMS entities, simplifying migrations.",
      "Built dynamic UI components with Alpine.js/HTMX and grew test coverage with automated unit tests.",
    ],
    stack: [
      "Python",
      "Django",
      "PostgreSQL",
      "HTMX",
      "Alpine.js",
      "Docker",
      "Valkey",
      "DigitalOcean",
    ],
  },
  {
    slug: "ctrl-ai",
    name: "Ctrl.ai",
    kind: "Fleet & driver management",
    accent: "mint",
    role: "Full-stack developer",
    duration: "6 months",
    team: "4–6 people",
    description:
      "Fleet and driver management platform with real-time operational tracking.",
    metric: { value: "Real-time", label: "tracking with lean GraphQL payloads" },
    highlights: [
      "Built Celery/Redis task queues for heavy asynchronous background processing and scheduling workflows.",
      "Implemented real-time data fetching and state management with GraphQL and Redux Toolkit, reducing API payload sizes.",
      "Optimized PostgreSQL models, wrote schema migrations and automated deployment scripts.",
    ],
    stack: [
      "React",
      "TypeScript",
      "Redux",
      "Python",
      "Django",
      "GraphQL",
      "Celery",
      "Redis",
      "PostgreSQL",
      "Docker",
    ],
  },
  {
    slug: "pikt",
    name: "Pikt",
    kind: "AI website builder",
    accent: "peach",
    role: "Front-end developer",
    duration: "9 months",
    team: "9–10 people",
    description:
      "AI-driven website creation platform with integrated e-commerce: users launch professional sites with intelligent design generation and payments.",
    metric: { value: "SSR + SSG", label: "faster first load & better SEO" },
    highlights: [
      "Engineered server-rendered and statically generated pages with Next.js, drastically improving initial load time and SEO discoverability.",
      "Monitored and improved Web Vitals with Lighthouse: code splitting, image optimization and bundle-size audits.",
      "Developed the component architecture for intelligent layout generation, linking user input directly to automated e-commerce payment flows.",
    ],
    stack: ["Next.js", "TypeScript", "Redux", "Lighthouse"],
  },
  {
    slug: "logo-contests",
    name: "Design contest platform",
    kind: "Marketplace for logo design",
    accent: "sky",
    role: "Front-end developer",
    duration: "16 months",
    team: "3–5 people",
    description:
      "Platform where customers launch logo design contests and receive 200+ designs from many designers, working directly with clients.",
    metric: { value: "60 → 90+", label: "Lighthouse score on static pages" },
    highlights: [
      "Implemented bidirectional real-time communication for live design contests and chat with WebSockets.",
      "Secured authentication and access control across web and desktop (Electron) apps with Auth0.",
      "Integrated Stripe for multi-party marketplace payments: refunds, payouts and automated invoicing.",
      "Lifted Lighthouse from 60–75 to 90+ by replacing React hooks overhead with lightweight vanilla JS and optimizing Next.js static output.",
    ],
    stack: [
      "Next.js",
      "React",
      "Electron",
      "TypeScript",
      "Tailwind",
      "Redux",
      "WebSocket",
      "Redis",
      "Auth0",
      "Stripe",
    ],
  },
];

export const education = [
  {
    degree: "Master's degree",
    school: "Kharkiv National University of Radio Electronics",
    field: "Computerized and Robotic Systems",
    year: "2025",
  },
  {
    degree: "Bachelor's degree",
    school: "Kharkiv National University of Radio Electronics",
    field: "Automation, Computer-Integrated Technologies and Robotics",
    year: "2024",
  },
];

export const certifications = [
  { name: "Cybersecurity", year: "2026" },
  { name: "Python Pro", year: "2025" },
  { name: "DevOps Crash Course", year: "2024" },
  { name: "DevOps", year: "2023" },
  { name: "Java Fundamental · Team project stage", year: "2023" },
  { name: "React Native", year: "2023" },
  { name: "Java Fundamental", year: "2022" },
  { name: "React", year: "2022" },
  { name: "Front End Pro", year: "2022" },
];

export const MCP_PATH = "/api/mcp";
export const mcpUrl = () => `${SITE_URL}${MCP_PATH}`;
