import { readFile } from "node:fs/promises";
import path from "node:path";
import { notes, type NoteMeta } from "@/content/notes";

const showDrafts = process.env.NODE_ENV !== "production";

/** Notes visible on the site (drafts only in development). */
export function getNotes(): NoteMeta[] {
  return notes
    .filter((n) => showDrafts || !n.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Published notes only — for sitemap, llms.txt and MCP. */
export function getPublishedNotes(): NoteMeta[] {
  return notes.filter((n) => !n.draft).sort((a, b) => b.date.localeCompare(a.date));
}

export function getNote(slug: string): NoteMeta | undefined {
  return getNotes().find((n) => n.slug === slug);
}

/** Raw markdown body with MDX comments stripped, for llms-full.txt and MCP. */
export async function getNoteMarkdown(slug: string): Promise<string> {
  "use cache";
  const file = path.join(process.cwd(), "content", "notes", `${slug}.mdx`);
  const raw = await readFile(file, "utf8");
  return raw.replace(/\{\/\*[\s\S]*?\*\/\}\n?/g, "").trim();
}
