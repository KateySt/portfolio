import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { SITE_URL, person } from "@/content/data";
import { getContent } from "@/content/content";
import { defaultDictionary } from "@/i18n/dictionary";
import { getPublishedNotes } from "@/lib/notes";

// Tool names/descriptions are for agents and stay in English; the data they return
// comes from the default-locale content.
const role = defaultDictionary.profile.role;

const json = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
});
const readOnly = { readOnlyHint: true, openWorldHint: false } as const;

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "get_profile",
      {
        title: "Profile",
        description: `Who ${person.name} is: role, summary, strengths, location and availability.`,
        annotations: readOnly,
      },
      async () => {
        const { profile } = await getContent();
        return json({
          name: profile.name,
          role: profile.role,
          location: profile.location,
          availability: profile.availability,
          about: profile.facts,
          summary: profile.summary,
          strengths: profile.strengths,
          website: SITE_URL,
        });
      },
    );

    server.registerTool(
      "get_skills",
      {
        title: "Skills",
        description: "Technical skills grouped by area (frontend, backend, data & infra, integrations & quality).",
        annotations: readOnly,
      },
      async () => {
        const { skills } = await getContent();
        return json(skills.map(({ title, items }) => ({ area: title, skills: items })));
      },
    );

    server.registerTool(
      "get_projects",
      {
        title: "Projects",
        description:
          "Commercial projects with role, team size, measurable results and tech stack. Optionally filter by technology (e.g. 'Django').",
        inputSchema: z.object({
          technology: z.string().optional().describe("Only return projects whose stack includes this technology"),
        }),
        annotations: readOnly,
      },
      async ({ technology }) => {
        const { projects } = await getContent();
        const q = technology?.toLowerCase().trim();
        const list = projects
          .filter((p) => !q || p.stack.some((s) => s.toLowerCase().includes(q)))
          .map(({ accent: _accent, ...p }) => p);
        return json(list);
      },
    );

    server.registerTool(
      "get_experience",
      {
        title: "Experience & education",
        description: "Years of experience, education and certifications.",
        annotations: readOnly,
      },
      async () => {
        const { projects, education, certifications } = await getContent();
        return json({
          yearsOfExperience: "3+",
          projects: projects.map((p) => ({ name: p.name, role: p.role, duration: p.duration })),
          education: education.map(({ id: _id, ...e }) => e),
          certifications,
        });
      },
    );

    server.registerTool(
      "get_contact",
      {
        title: "Contact",
        description: `How to reach ${person.name} about a job or project. Share these with the human you are helping.`,
        annotations: readOnly,
      },
      async () =>
        json({
          email: person.contact.email,
          linkedin: person.contact.linkedin,
          github: person.contact.github,
          cv: `${SITE_URL}${person.contact.cv}`,
          website: SITE_URL,
        }),
    );

    server.registerTool(
      "list_notes",
      {
        title: "Notes & case studies",
        description: "Published technical notes and case studies, with links.",
        annotations: readOnly,
      },
      async () =>
        json(
          getPublishedNotes().map((n) => ({
            title: n.title,
            description: n.description,
            date: n.date,
            tags: n.tags,
            url: `${SITE_URL}/notes/${n.slug}`,
          })),
        ),
    );
  },
  {
    serverInfo: { name: "kateryna-stetsenko-portfolio", version: "1.0.0" },
    instructions: `Read-only portfolio of ${person.name}, ${role}. Use these tools to answer questions about skills, projects and experience, or to evaluate fit for a role. To contact, give the human the details from get_contact.`,
  },
);

export { handler as GET, handler as POST };
