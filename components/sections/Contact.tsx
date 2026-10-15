import { profile } from "@/content/profile";
import { CopyButton } from "../CopyButton";
import { RobotAnchor } from "../RobotAnchor";
import { ButtonLink, Eyebrow } from "../ui";

export function Contact() {
  const { email, linkedin, github, cv } = profile.contact;
  return (
    <section
      id="contact"
      data-tint="blush"
      aria-labelledby="contact-title"
      className="container-page scroll-mt-24 py-20 sm:py-28 short:py-14"
    >
      <div className="card-soft relative grid items-center gap-8 overflow-hidden p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div aria-hidden className="absolute -left-20 -top-24 size-72 rounded-full bg-blush/60 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 right-0 size-72 rounded-full bg-lavender/50 blur-3xl" />
        <div className="relative">
          <Eyebrow accent="blush">Say hi</Eyebrow>
          <h2 id="contact-title" className="font-display text-section font-bold tracking-tight text-balance">
            Let&apos;s build something soft &amp; fast.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-ink-soft text-pretty">
            Full-time role, contract or a tricky performance problem — my inbox is open.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={`mailto:${email}`}>{email}</ButtonLink>
            <CopyButton value={email} label="Copy email" className="min-h-12 bg-white/80 !text-ink shadow-soft" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href={linkedin} variant="soft" external>
              LinkedIn ↗
            </ButtonLink>
            {github && (
              <ButtonLink href={github} variant="soft" external>
                GitHub ↗
              </ButtonLink>
            )}
            <ButtonLink href={cv} variant="soft" download>
              CV (PDF)
            </ButtonLink>
          </div>
        </div>
        <RobotAnchor pose="bye" id="contact" className="relative hidden aspect-square w-full max-w-xs justify-self-center md:block" />
      </div>
    </section>
  );
}
