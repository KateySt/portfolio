export type NoteMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  tags: string[];
  /** Drafts render only in development and are excluded from sitemap, llms.txt and MCP. */
  draft: boolean;
};

// Body lives in content/notes/<slug>.mdx
export const notes: NoteMeta[] = [
  {
    slug: "htmx-30s-to-4s",
    title: "From 30s to 4s: splitting a monolithic Django page into async HTMX requests",
    description:
      "How breaking one giant query into small HTMX-loaded fragments and moving filtering to the client cut an HRMS dashboard load time by 85%.",
    date: "2026-10-15",
    tags: ["Django", "HTMX", "Performance", "PostgreSQL"],
    draft: true,
  },
  {
    slug: "lighthouse-60-to-90",
    title: "Lighthouse 60 → 90+: when vanilla JS beats React hooks on static pages",
    description:
      "Replacing hook-heavy interactive widgets with tiny vanilla scripts on statically generated Next.js pages — and what it did to Web Vitals.",
    date: "2026-10-15",
    tags: ["Next.js", "React", "Web Vitals", "Performance"],
    draft: true,
  },
];
