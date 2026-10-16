import { mcpUrl, SITE_URL } from "@/content/data";
import { getDictionary } from "@/i18n/dictionary";
import { rich } from "@/i18n/format";
import { CopyButton } from "../CopyButton";
import { RobotAnchor } from "../RobotAnchor";
import { Eyebrow, SectionTitle } from "../ui";

export async function Agents() {
  const dict = await getDictionary();
  const t = dict.agents;
  const copy = { label: dict.common.copy, copiedLabel: dict.common.copied };
  const url = mcpUrl();
  const claudeCmd = `claude mcp add --transport http kateryna ${url}`;
  const cursorJson = JSON.stringify({ mcpServers: { kateryna: { url } } }, null, 2);

  return (
    <section
      id="agents"
      data-tint="butter"
      aria-labelledby="agents-title"
      className="container-page grid scroll-mt-24 items-center gap-10 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] short:py-14"
    >
      <div>
        <Eyebrow accent="butter">{t.eyebrow}</Eyebrow>
        <SectionTitle id="agents-title">{t.title}</SectionTitle>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
          {rich(t.intro, {
            llms: (
              <a className="font-semibold text-ink underline decoration-butter-deep decoration-4 underline-offset-4" href="/llms.txt">
                /llms.txt
              </a>
            ),
          })}
        </p>

        <div className="mt-8 space-y-4">
          <div data-reveal className="card-soft p-5">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">{t.endpoint}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <code translate="no" className="min-w-0 break-all font-mono text-base font-semibold">{url}</code>
              <CopyButton value={url} {...copy} />
            </div>
          </div>

          <div data-reveal className="card-soft p-5">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">{t.claudeCode}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <code translate="no" className="min-w-0 flex-1 break-all rounded-xl bg-ink/5 px-3 py-2 font-mono text-sm">
                {claudeCmd}
              </code>
              <CopyButton value={claudeCmd} {...copy} />
            </div>
          </div>

          <details data-reveal className="card-soft group p-5">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
              {t.otherClients}
              <span aria-hidden className="text-lg transition group-open:rotate-45">+</span>
            </summary>
            <pre translate="no" className="mt-3 overflow-x-auto rounded-xl bg-ink/5 p-4 font-mono text-sm">{cursorJson}</pre>
            <CopyButton value={cursorJson} {...copy} className="mt-3" />
          </details>
        </div>

        <p className="mt-6 text-sm text-ink-soft">
          {t.alsoAvailable} <a className="underline" href="/llms-full.txt">/llms-full.txt</a> ·{" "}
          <a className="underline" href="/index.md">/index.md</a> ·{" "}
          <a className="underline" href={`${SITE_URL}/sitemap.xml`}>{t.sitemap}</a>
        </p>
      </div>
      <RobotAnchor pose="signal" id="agents" className="hidden aspect-square w-full max-w-sm justify-self-center lg:block" />
    </section>
  );
}
