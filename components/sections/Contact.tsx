import { person } from "@/content/data";
import { getDictionary } from "@/i18n/dictionary";
import { CopyButton } from "../CopyButton";
import { RobotAnchor } from "../RobotAnchor";
import { ButtonLink, Eyebrow } from "../ui";

export async function Contact() {
  const dict = await getDictionary();
  const t = dict.contact;
  const { email, linkedin, github, cv } = person.contact;
  return (
    <section
      id="contact"
      data-tint="blush"
      aria-labelledby="contact-title"
      className="container-page scroll-mt-24 py-20 sm:py-28 short:py-14"
    >
      <div className="card-soft relative grid items-center gap-8 overflow-hidden p-6 min-[360px]:p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div aria-hidden className="absolute -left-20 -top-24 size-72 rounded-full bg-blush/60 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 right-0 size-72 rounded-full bg-lavender/50 blur-3xl" />
        <div className="relative min-w-0">
          <Eyebrow accent="blush">{t.eyebrow}</Eyebrow>
          <h2 id="contact-title" className="font-display text-section font-bold tracking-tight text-balance">
            {t.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg text-ink-soft text-pretty">{t.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={`mailto:${email}`}>{email}</ButtonLink>
            <CopyButton
              value={email}
              label={t.copyEmail}
              copiedLabel={dict.common.copied}
              className="min-h-12 bg-surface/80 !text-ink shadow-soft"
            />
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
              {t.cv}
            </ButtonLink>
          </div>
        </div>
        <RobotAnchor pose="bye" id="contact" className="relative hidden aspect-square w-full max-w-xs justify-self-center md:block" />
      </div>
    </section>
  );
}
