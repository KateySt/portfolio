import { profile } from "@/content/profile";
import { RobotAnchor } from "../RobotAnchor";
import { ButtonLink } from "../ui";

export function Hero() {
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
          Open to new projects · {profile.location}
        </p>
        <h1
          id="hero-title"
          className="font-display text-hero font-extrabold tracking-tight text-balance short:text-[clamp(2.2rem,6vw,3.4rem)]"
        >
          Hi, I&apos;m {profile.shortName}
          <span className="block bg-gradient-to-r from-lavender-deep via-peach-deep to-mint-deep bg-clip-text text-transparent">
            {profile.role.toLowerCase()}
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty sm:text-xl short:mt-3 short:text-base">
          {profile.tagline}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 short:mt-4">
          <ButtonLink href="#projects">See my work →</ButtonLink>
          <ButtonLink href={profile.contact.cv} variant="soft" download>
            Download CV
          </ButtonLink>
        </div>
        <p className="mt-6 hidden font-mono text-sm text-ink-soft mouse:block short:hidden">
          psst — press{" "}
          <kbd className="rounded-md bg-white/80 px-1.5 py-0.5 shadow-soft">⌘K</kbd> or{" "}
          <kbd className="rounded-md bg-white/80 px-1.5 py-0.5 shadow-soft">Ctrl K</kbd> · try
          poking the robot
        </p>
        <p className="mt-5 font-mono text-sm text-ink-soft touch:block hidden short:hidden">
          tap, squish or drag the robot ✦
        </p>
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
