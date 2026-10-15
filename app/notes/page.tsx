import type { Metadata } from "next";
import Link from "next/link";
import { getNotes } from "@/lib/notes";
import { getDictionary } from "@/i18n/dictionary";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { RobotAnchor } from "@/components/RobotAnchor";
import { Eyebrow, Pill } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return {
    title: meta.notesTitle,
    description: meta.notesDescription,
    alternates: { canonical: "/notes" },
  };
}

export default async function NotesPage() {
  const notes = getNotes();
  const t = (await getDictionary()).notes;
  return (
    <>
      <Header />
      <main id="main" className="container-page min-h-svh pb-20 pt-32">
        <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <Eyebrow accent="peach">{t.eyebrow}</Eyebrow>
            <h1 className="font-display text-section font-bold tracking-tight">{t.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-ink-soft">{t.intro}</p>
          </div>
          <RobotAnchor pose="think" id="notes" className="hidden aspect-square w-48 md:block" />
        </div>
        {notes.length === 0 ? (
          <p className="mt-12 text-lg text-ink-soft">{t.empty}</p>
        ) : (
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {notes.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/notes/${n.slug}`}
                  data-tilt
                  className="card-soft block h-full p-6 transition-transform duration-300 touch:active:scale-[0.98] sm:p-8"
                >
                  <p className="font-mono text-sm text-ink-soft">
                    {n.date}
                    {n.draft && <span className="ml-2 rounded-full bg-butter px-2 py-0.5 text-xs text-ink">{t.draft}</span>}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-balance">{n.title}</h2>
                  <p className="mt-3 text-ink-soft">{n.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {n.tags.map((tag) => (
                      <Pill key={tag} className="!text-xs">{tag}</Pill>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
