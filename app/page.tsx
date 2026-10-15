import Link from "next/link";
import { SITE_URL } from "@/content/data";
import { getContent } from "@/content/content";
import { getDictionary } from "@/i18n/dictionary";
import { getPublishedNotes } from "@/lib/notes";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Agents } from "@/components/sections/Agents";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Eyebrow } from "@/components/ui";

async function LatestNotes() {
  const notes = getPublishedNotes().slice(0, 3);
  if (notes.length === 0) return null;
  const t = (await getDictionary()).notes;
  return (
    <section id="notes" data-tint="peach" aria-labelledby="notes-title" className="container-page scroll-mt-24 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow accent="peach">{t.latestEyebrow}</Eyebrow>
          <h2 id="notes-title" className="font-display text-3xl font-bold sm:text-4xl">{t.latestTitle}</h2>
        </div>
        <Link href="/notes" className="min-h-11 font-semibold underline underline-offset-4">{t.allNotes}</Link>
      </div>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {notes.map((n) => (
          <li key={n.slug} data-reveal>
            <Link href={`/notes/${n.slug}`} className="card-soft block h-full p-6 transition hover:-translate-y-1">
              <p className="font-mono text-sm text-ink-soft">{n.date}</p>
              <h3 className="mt-2 font-display text-xl font-bold text-balance">{n.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function Home() {
  const { profile, skills, education, certifications } = await getContent();
  const sameAs = [profile.contact.linkedin, profile.contact.github].filter(Boolean);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: profile.name,
            },
            {
              "@type": "ProfilePage",
              "@id": `${SITE_URL}/#profile`,
              url: SITE_URL,
              name: `${profile.name} — ${profile.role}`,
              mainEntity: { "@id": `${SITE_URL}/#person` },
            },
            {
              "@type": "Person",
              "@id": `${SITE_URL}/#person`,
              name: profile.name,
              jobTitle: profile.role,
              description: profile.facts,
              url: SITE_URL,
              email: `mailto:${profile.contact.email}`,
              sameAs,
              knowsAbout: skills.flatMap((g) => g.items),
              alumniOf: education.map((e) => ({
                "@type": "CollegeOrUniversity",
                name: e.school,
              })),
              hasCredential: certifications.map((c) => ({
                "@type": "EducationalOccupationalCredential",
                name: c.name,
                dateCreated: c.year,
              })),
            },
          ],
        }}
      />
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <LatestNotes />
        <Agents />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
