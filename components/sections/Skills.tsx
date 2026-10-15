import { skills } from "@/content/profile";
import { RobotAnchor } from "../RobotAnchor";
import { Eyebrow, SectionTitle, accentBg, accentSoft } from "../ui";

export function Skills() {
  return (
    <section
      id="skills"
      data-tint="mint"
      aria-labelledby="skills-title"
      className="container-page scroll-mt-24 py-20 sm:py-28 short:py-14"
    >
      <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
        <div>
          <Eyebrow accent="mint">Toolbox</Eyebrow>
          <SectionTitle id="skills-title">Building blocks I play with every day.</SectionTitle>
        </div>
        <RobotAnchor
          pose="build"
          id="skills"
          className="hidden aspect-square w-56 lg:block xl:w-64"
        />
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {skills.map((g, gi) => (
          <div key={g.title} data-reveal>
            <article
              data-tilt
              className="card-soft h-full p-6 transition-transform duration-300 ease-out touch:active:scale-[0.98]"
            >
              <h3 className="flex items-center gap-2 font-display text-xl font-bold">
                <span className={`size-3 rounded-[0.4rem] ${accentBg[g.accent]}`} aria-hidden />
                {g.title}
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.items.map((s, i) => (
                  <li
                    key={s}
                    className={`rounded-xl px-3 py-1.5 text-sm font-medium text-ink shadow-[inset_0_-3px_0_rgb(43_36_64_/_0.07)] ${accentSoft[g.accent]}`}
                    style={{ rotate: `${((i + gi) % 3) - 1}deg` }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
