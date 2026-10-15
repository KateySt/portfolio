import { profile } from "@/content/profile";
import { RobotAnchor } from "../RobotAnchor";
import { Eyebrow, Pill, SectionTitle } from "../ui";

export function About() {
  return (
    <section
      id="about"
      data-tint="lavender"
      aria-labelledby="about-title"
      className="container-page grid scroll-mt-24 items-center gap-10 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] short:py-14"
    >
      <RobotAnchor
        pose="think"
        id="about"
        className="hidden aspect-square w-full max-w-sm justify-self-center lg:block"
      />
      <div>
        <Eyebrow accent="lavender">About me</Eyebrow>
        <SectionTitle id="about-title">Soft on the outside, fast on the inside.</SectionTitle>
        <div data-reveal className="card-soft mt-8 space-y-4 p-6 text-lg leading-relaxed text-ink-soft sm:p-8">
          {profile.summary.map((p) => (
            <p key={p.slice(0, 24)} className="text-pretty">
              {p}
            </p>
          ))}
        </div>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Strengths">
          {profile.strengths.map((s, i) => (
            <li key={s} data-reveal>
              <Pill accent={(["lavender", "peach", "mint", "sky", "butter"] as const)[i % 5]}>{s}</Pill>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
