import { getNote } from "@/lib/notes";
import { notes as allNotes } from "@/content/notes";
import { person } from "@/content/data";
import { defaultDictionary, getDictionary } from "@/i18n/dictionary";
import { fmt } from "@/i18n/format";
import { ogSize, renderOg } from "@/lib/og";

export const alt = defaultDictionary.meta.notesTitle;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  // all notes incl. drafts (Cache Components needs ≥1 param); drafts 404 in production via getNote()
  return allNotes.map((n) => ({ slug: n.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNote(slug);
  const { meta } = await getDictionary();
  return renderOg({
    eyebrow: fmt(meta.ogNotesEyebrow, { name: person.name }),
    title: note?.title ?? meta.notesTitle,
    footer: (note?.tags ?? []).slice(0, 4).join(" · "),
  });
}
