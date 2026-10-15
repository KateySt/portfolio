import { SITE_URL, mcpUrl } from "@/content/data";
import { getContent } from "@/content/content";
import { getNoteMarkdown, getPublishedNotes } from "./notes";

// Agent-facing documents: the structure/headings stay in English (machine-readable),
// all profile content comes from the default-locale dictionary.

/** Full profile as clean markdown — used by /index.md, /llms-full.txt and MCP. */
export async function profileMarkdown(): Promise<string> {
  const { profile, skills, projects, education, certifications } = await getContent();
  const c = profile.contact;
  return [
    `# ${profile.name} — ${profile.role}`,
    "",
    `> ${profile.facts}`,
    "",
    "## Summary",
    "",
    ...profile.summary.map((p) => p),
    "",
    `Strengths: ${profile.strengths.join(", ")}.`,
    "",
    "## Skills",
    "",
    ...skills.map((g) => `- **${g.title}:** ${g.items.join(", ")}`),
    "",
    "## Projects",
    "",
    ...projects.flatMap((p) => [
      `### ${p.name} — ${p.kind}`,
      "",
      `${p.description}`,
      "",
      `- Role: ${p.role} · Duration: ${p.duration} · Team: ${p.team}`,
      `- Key result: **${p.metric.value}** (${p.metric.label})`,
      ...p.highlights.map((h) => `- ${h}`),
      `- Stack: ${p.stack.join(", ")}`,
      "",
    ]),
    "## Education",
    "",
    ...education.map((e) => `- ${e.degree}, ${e.field} — ${e.school} (${e.year})`),
    "",
    "## Certifications",
    "",
    ...certifications.map((x) => `- ${x.name} (${x.year})`),
    "",
    "## Contact",
    "",
    `- Email: ${c.email}`,
    `- LinkedIn: ${c.linkedin}`,
    ...(c.github ? [`- GitHub: ${c.github}`] : []),
    `- CV (PDF): ${SITE_URL}${c.cv}`,
    `- Website: ${SITE_URL}`,
    `- MCP server (Streamable HTTP): ${mcpUrl()}`,
    "",
  ].join("\n");
}

/** https://llmstxt.org — short index for agents. */
export async function llmsTxt(): Promise<string> {
  const { profile } = await getContent();
  const notes = getPublishedNotes();
  return [
    `# ${profile.name}`,
    "",
    `> ${profile.facts}`,
    "",
    `${profile.name} is open to new projects (full-time, contract or freelance, remote). Contact: ${profile.contact.email}.`,
    "",
    "## Profile",
    "",
    `- [Full profile in markdown](${SITE_URL}/index.md): skills, projects with measurable results, education, certifications, contacts`,
    `- [Everything in one file](${SITE_URL}/llms-full.txt): profile plus all published notes`,
    `- [CV (PDF)](${SITE_URL}${profile.contact.cv})`,
    "",
    "## For agents",
    "",
    `- [MCP server](${mcpUrl()}): read-only tools get_profile, get_skills, get_projects, get_experience, get_contact, list_notes. Streamable HTTP, no auth.`,
    "",
    ...(notes.length
      ? [
          "## Notes",
          "",
          ...notes.map((n) => `- [${n.title}](${SITE_URL}/notes/${n.slug}): ${n.description}`),
          "",
        ]
      : []),
    "## Optional",
    "",
    `- [LinkedIn](${profile.contact.linkedin})`,
    "",
  ].join("\n");
}

export async function llmsFullTxt(): Promise<string> {
  const notes = getPublishedNotes();
  const bodies = await Promise.all(
    notes.map(async (n) => `## Note: ${n.title}\n\n_${n.date}_ · ${SITE_URL}/notes/${n.slug}\n\n${await getNoteMarkdown(n.slug)}\n`),
  );
  return [await profileMarkdown(), ...bodies].join("\n---\n\n");
}

export function markdownResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
