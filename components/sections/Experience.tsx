import { certifications, education } from "@/content/profile";
import { RobotAnchor } from "../RobotAnchor";
import { Eyebrow, SectionTitle } from "../ui";

export function Experience() {
  return (
    <section
      id="education"
      data-tint="sky"
      aria-labelledby="education-title"
      className="container-page grid scroll-mt-24 gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_1fr] short:py-14"
    >
      <div>
        <Eyebrow accent="sky">Education</Eyebrow>
        <SectionTitle id="education-title">A roboticist who fell for the web.</SectionTitle>
        <ol className="relative mt-10 space-y-6 border-l-2 border-dashed border-sky-deep/50 pl-7">
          {education.map((e) => (
            <li key={e.degree} data-reveal className="relative">
              <span
                aria-hidden
                className="absolute -left-[2.35rem] top-6 size-4 rounded-full border-4 border-cream bg-sky-deep"
              />
              <div className="card-soft p-6">
                <p className="font-mono text-sm text-ink-soft">{e.year}</p>
                <h3 className="mt-1 font-display text-xl font-bold">{e.degree}</h3>
                <p className="mt-1 font-medium">{e.field}</p>
                <p className="mt-1 text-sm text-ink-soft">{e.school}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="lg:pt-24">
        <h3 className="font-display text-2xl font-bold">Certifications</h3>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {certifications.map((c) => (
            <li
              key={c.name + c.year}
              data-reveal
              className="card-soft flex min-h-16 items-center justify-between gap-3 !rounded-2xl px-5 py-3"
            >
              <span className="font-medium">{c.name}</span>
              <span className="rounded-full bg-sky/60 px-2.5 py-0.5 font-mono text-xs">{c.year}</span>
            </li>
          ))}
        </ul>
        <RobotAnchor
          pose="idle"
          id="education"
          className="ml-auto mt-6 hidden aspect-square w-52 lg:block"
        />
      </div>
    </section>
  );
}
