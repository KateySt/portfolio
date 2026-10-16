import { getContent } from "@/content/content";
import { fmt } from "@/i18n/format";
import { RobotAnchor } from "../RobotAnchor";
import { Eyebrow, Pill, SectionTitle, accentBg, accentGlow, accentSoft } from "../ui";

export async function Projects() {
  const { dict, projects } = await getContent();
  const t = dict.projects;
  return (
    <section
      id="projects"
      data-tint="peach"
      aria-labelledby="projects-title"
      className="container-page scroll-mt-24 py-20 sm:py-28 short:py-14"
    >
      <Eyebrow accent="peach">{t.eyebrow}</Eyebrow>
      <SectionTitle id="projects-title">{t.title}</SectionTitle>

      <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-10">
        {projects.map((p, i) => (
          <div key={p.slug} data-reveal className="relative">
            {/* robot hops from card to card on wide screens */}
            <RobotAnchor
              pose="point"
              id={`project-${p.slug}`}
              className={`absolute -top-14 hidden size-28 lg:block ${
                i % 2 === 0 ? "-right-6" : "-left-6"
              }`}
            />
            <article
              id={`project-${p.slug}`}
              data-tilt
              aria-labelledby={`${p.slug}-title`}
              className="card-soft relative h-full overflow-hidden p-6 transition-transform duration-300 ease-out touch:active:scale-[0.985] sm:p-8"
            >
              <div
                aria-hidden
                className={`absolute -right-16 -top-16 size-48 rounded-full blur-2xl ${accentGlow[p.accent]}`}
              />
              <div className="relative">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
                  {p.kind}
                </p>
                <h3 id={`${p.slug}-title`} className="mt-2 font-display text-3xl font-bold">
                  {p.name}
                </h3>

                <div className={`mt-6 rounded-3xl p-5 ${accentSoft[p.accent]}`}>
                  <p className="text-balance font-display text-[clamp(1.75rem,9vw,2.25rem)] font-extrabold tracking-tight sm:text-5xl">
                    {p.metric.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink-soft">{p.metric.label}</p>
                </div>

                <p className="mt-6 text-ink-soft text-pretty">{p.description}</p>
                <ul className="mt-5 space-y-3">
                  {p.highlights.map((h) => (
                    <li key={h.slice(0, 30)} className="flex gap-3 text-[0.97rem] leading-relaxed">
                      <span
                        aria-hidden
                        className={`mt-2 size-2 shrink-0 rounded-full ${accentBg[p.accent]}`}
                      />
                      <span className="text-pretty">{h}</span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-ink/10 pt-5 text-sm">
                  <div>
                    <dt className="text-ink-soft">{t.role}</dt>
                    <dd className="font-semibold">{p.role}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">{t.duration}</dt>
                    <dd className="font-semibold">{p.duration}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">{t.team}</dt>
                    <dd className="font-semibold">{p.team}</dd>
                  </div>
                </dl>

                <ul translate="no" className="mt-5 flex flex-wrap gap-1.5" aria-label={fmt(t.stackLabel, { name: p.name })}>
                  {p.stack.map((s) => (
                    <li key={s}>
                      <Pill accent={p.accent} className="!text-xs">{s}</Pill>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
