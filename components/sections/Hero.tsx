import { getContent } from "@/content/content";
import { fmt, rich } from "@/i18n/format";
import { RobotAnchor } from "../RobotAnchor";
import { ButtonLink } from "../ui";

const kbd = "rounded-md bg-white/80 px-1.5 py-0.5 shadow-soft";

export async function Hero() {
  const { dict, profile } = await getContent();
  const t = dict.hero;
  return (
    <section
      id="top"
      data-tint="cream"
      aria-labelledby="hero-title"
      className="container-page relative grid min-h-svh items-center gap-6 pb-12 pt-24 md:grid-cols-[1.1fr_0.9fr] md:gap-10 short:min-h-0 short:grid-cols-[1.25fr_0.75fr] short:gap-4 short:pb-8 short:pt-20"
    >
      <div className="relative z-10 order-2 md:order-1 short:order-1">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-1.5 text-sm font-medium text-ink-soft shadow-soft short:mb-3">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint-deep opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-mint-deep" />
          </span>
          {fmt(t.status, { location: profile.location })}
        </p>
        <h1
          id="hero-title"
          className="font-display text-hero font-extrabold tracking-tight text-balance short:text-[clamp(2.2rem,6vw,3.4rem)]"
        >
          {fmt(t.greeting, { name: profile.shortName })}
          <span className="block bg-gradient-to-r from-lavender-deep via-peach-deep to-mint-deep bg-clip-text text-transparent">
            {profile.role.toLowerCase()}
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty sm:text-xl short:mt-3 short:text-base">
          {profile.tagline}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 short:mt-4">
          <ButtonLink href="#projects">{t.seeWork}</ButtonLink>
          <ButtonLink href={profile.contact.cv} variant="soft" download>
            {t.downloadCv}
          </ButtonLink>
        </div>
        <p className="mt-6 hidden font-mono text-sm text-ink-soft mouse:block short:hidden">
          {rich(t.hintKeyboard, { cmd: <kbd className={kbd}>⌘K</kbd>, ctrl: <kbd className={kbd}>Ctrl K</kbd> })}
        </p>
        <p className="mt-5 font-mono text-sm text-ink-soft touch:block hidden short:hidden">{t.hintTouch}</p>
      </div>
      <RobotAnchor
        pose="wave"
        id="hero"
        poster
        className="order-1 mx-auto aspect-square w-[min(72vw,36svh)] md:order-2 md:w-full md:max-w-[34rem] short:order-2 short:w-[min(38vw,62svh)]"
      />
    </section>
  );
}
