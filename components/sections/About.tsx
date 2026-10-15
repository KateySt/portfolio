import { getContent } from "@/content/content";
import { RobotAnchor } from "../RobotAnchor";
import { Eyebrow, Pill, SectionTitle } from "../ui";

export async function About() {
  const { dict, profile } = await getContent();
  const t = dict.about;
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
        <Eyebrow accent="lavender">{t.eyebrow}</Eyebrow>
        <SectionTitle id="about-title">{t.title}</SectionTitle>
        <div data-reveal className="card-soft mt-8 space-y-4 p-6 text-lg leading-relaxed text-ink-soft sm:p-8">
          {profile.summary.map((p) => (
            <p key={p.slice(0, 24)} className="text-pretty">
              {p}
            </p>
          ))}
        </div>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={t.strengthsLabel}>
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
