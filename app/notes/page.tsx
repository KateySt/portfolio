import type { Metadata } from "next";
import Link from "next/link";
import { getNotes } from "@/lib/notes";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { RobotAnchor } from "@/components/RobotAnchor";
import { Eyebrow, Pill } from "@/components/ui";

export const metadata: Metadata = {
  title: "Notes",
  description: "Case studies and notes on web performance, Next.js, Django and building fast, friendly products.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  const notes = getNotes();
  return (
    <>
      <Header />
      <main id="main" className="container-page min-h-svh pb-20 pt-32">
        <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <Eyebrow accent="peach">Notes</Eyebrow>
            <h1 className="font-display text-section font-bold tracking-tight">Case studies &amp; notes</h1>
            <p className="mt-4 max-w-2xl text-lg text-ink-soft">
              What I learned making real products faster — with numbers.
            </p>
          </div>
          <RobotAnchor pose="think" id="notes" className="hidden aspect-square w-48 md:block" />
        </div>
        {notes.length === 0 ? (
          <p className="mt-12 text-lg text-ink-soft">First notes are on their way ✦</p>
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
                    {n.draft && <span className="ml-2 rounded-full bg-butter px-2 py-0.5 text-xs text-ink">draft</span>}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-balance">{n.title}</h2>
                  <p className="mt-3 text-ink-soft">{n.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {n.tags.map((t) => (
                      <Pill key={t} className="!text-xs">{t}</Pill>
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
