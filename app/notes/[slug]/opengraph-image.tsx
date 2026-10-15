import { getNote } from "@/lib/notes";
import { notes as allNotes } from "@/content/notes";
import { profile } from "@/content/profile";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Note";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  // all notes incl. drafts (Cache Components needs ≥1 param); drafts 404 in production via getNote()
  return allNotes.map((n) => ({ slug: n.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNote(slug);
  return renderOg({
    eyebrow: `Notes · ${profile.name}`,
    title: note?.title ?? "Notes",
    footer: (note?.tags ?? []).slice(0, 4).join(" · "),
  });
}
