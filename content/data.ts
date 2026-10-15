// Locale-independent facts: names, links, tech names, years. Anything a reader
// would see translated lives in i18n/messages/*.json; getContent() merges both.

import type { Dictionary } from "@/i18n/dictionary";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kateystetsenko.com"
).replace(/\/$/, "");

export type Accent = "lavender" | "peach" | "mint" | "sky" | "butter" | "blush";

export const person = {
  name: "Kateryna Stetsenko",
  shortName: "Kateryna",
  contact: {
    email: "kateystetsenko@gmail.com",
    linkedin: "https://www.linkedin.com/in/kateryna-stetsenko-72311b251/",
    // TODO: add GitHub profile URL
    github: null as string | null,
    cv: "/Kateryna-Stetsenko-CV.pdf",
  },
};

type SkillGroupId = keyof Dictionary["skills"]["groups"];
export const skillGroups: { id: SkillGroupId; accent: Accent; items: string[] }[] = [
  {
    id: "frontend",
    accent: "lavender",
    items: ["React", "Next.js", "TypeScript", "React Native", "Redux Toolkit", "Tailwind CSS", "HTMX", "Alpine.js", "Electron"],
  },
  {
    id: "backend",
    accent: "peach",
    items: ["Python", "Django", "FastAPI", "Celery", "GraphQL", "WebSockets", "REST APIs"],
  },
  {
    id: "data",
    accent: "mint",
    items: ["PostgreSQL", "Redis / Valkey", "Docker", "DigitalOcean", "CI/CD"],
  },
  {
    id: "quality",
    accent: "sky",
    items: ["Stripe", "Auth0", "Lighthouse / Web Vitals", "Unit testing", "Code review"],
  },
];

type ProjectSlug = keyof Dictionary["projects"]["items"];
export const projectData: { slug: ProjectSlug; accent: Accent; stack: string[] }[] = [
  {
    slug: "horilla",
    accent: "lavender",
    stack: ["Python", "Django", "PostgreSQL", "HTMX", "Alpine.js", "Docker", "Valkey", "DigitalOcean"],
  },
  {
    slug: "ctrl-ai",
    accent: "mint",
    stack: ["React", "TypeScript", "Redux", "Python", "Django", "GraphQL", "Celery", "Redis", "PostgreSQL", "Docker"],
  },
  {
    slug: "pikt",
    accent: "peach",
    stack: ["Next.js", "TypeScript", "Redux", "Lighthouse"],
  },
  {
    slug: "logo-contests",
    accent: "sky",
    stack: ["Next.js", "React", "Electron", "TypeScript", "Tailwind", "Redux", "WebSocket", "Redis", "Auth0", "Stripe"],
  },
];

type EducationId = keyof Dictionary["education"]["items"];
export const educationData: { id: EducationId; year: string }[] = [
  { id: "master", year: "2025" },
  { id: "bachelor", year: "2024" },
];

// Certificate titles are proper names — kept as issued.
export const certifications = [
  { name: "AI Agentic Engineer", year: "2026" },
  { name: "Architecture of high loads", year: "2026" },
  { name: "Python Pro", year: "2025" },
];

export const MCP_PATH = "/api/mcp";
export const mcpUrl = () => `${SITE_URL}${MCP_PATH}`;
