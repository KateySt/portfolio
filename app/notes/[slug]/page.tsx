import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNote } from "@/lib/notes";
import { notes as allNotes } from "@/content/notes";
import { SITE_URL, profile } from "@/content/profile";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { RobotAnchor } from "@/components/RobotAnchor";
import { Pill } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  // all notes incl. drafts (Cache Components needs ≥1 param); drafts 404 in production via getNote()
  return allNotes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.description,
    alternates: { canonical: `/notes/${slug}` },
    robots: note.draft ? { index: false } : undefined,
    openGraph: {
      type: "article",
      title: note.title,
      description: note.description,
      publishedTime: note.date,
      authors: [profile.name],
      tags: note.tags,
    },
  };
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();
  const { default: Body } = await import(`@/content/notes/${slug}.mdx`);

  return (
    <>
      <Header />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: note.title,
          description: note.description,
          datePublished: note.date,
          keywords: note.tags.join(", "),
          url: `${SITE_URL}/notes/${slug}`,
          author: { "@type": "Person", name: profile.name, url: SITE_URL },
        }}
      />
      <main id="main" className="container-page pb-20 pt-32">
        <article className="mx-auto max-w-3xl">
          <Link href="/notes" className="inline-flex min-h-11 items-center font-medium text-ink-soft hover:text-ink">
            ← All notes
          </Link>
          <div className="relative">
            <RobotAnchor pose="point" id="note" className="absolute -right-4 -top-10 hidden size-32 lg:block" />
            <p className="mt-6 font-mono text-sm text-ink-soft">
              {note.date}
              {note.draft && <span className="ml-2 rounded-full bg-butter px-2 py-0.5 text-xs text-ink">draft</span>}
            </p>
            <h1 className="mt-2 font-display text-section font-bold tracking-tight text-balance lg:pr-36">{note.title}</h1>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {note.tags.map((t) => (
                <Pill key={t} className="!text-xs">{t}</Pill>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <Body />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
