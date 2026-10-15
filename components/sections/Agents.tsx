import { mcpUrl, SITE_URL } from "@/content/profile";
import { CopyButton } from "../CopyButton";
import { RobotAnchor } from "../RobotAnchor";
import { Eyebrow, SectionTitle } from "../ui";

export function Agents() {
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
        <Eyebrow accent="butter">For AI agents</Eyebrow>
        <SectionTitle id="agents-title">Hire me through your AI.</SectionTitle>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
          This site speaks to agents too. Plug my MCP server into Claude, Cursor or any MCP
          client and ask it about my skills, projects and availability — or point a crawler at{" "}
          <a className="font-semibold text-ink underline decoration-butter-deep decoration-4 underline-offset-4" href="/llms.txt">
            /llms.txt
          </a>
          .
        </p>

        <div className="mt-8 space-y-4">
          <div data-reveal className="card-soft p-5">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">MCP endpoint</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <code className="min-w-0 break-all font-mono text-base font-semibold">{url}</code>
              <CopyButton value={url} />
            </div>
          </div>

          <div data-reveal className="card-soft p-5">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">Claude Code</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <code className="min-w-0 flex-1 break-all rounded-xl bg-ink/5 px-3 py-2 font-mono text-sm">
                {claudeCmd}
              </code>
              <CopyButton value={claudeCmd} />
            </div>
          </div>

          <details data-reveal className="card-soft group p-5">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
              Cursor / other clients (JSON)
              <span aria-hidden className="text-lg transition group-open:rotate-45">+</span>
            </summary>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-ink/5 p-4 font-mono text-sm">{cursorJson}</pre>
            <CopyButton value={cursorJson} className="mt-3" />
          </details>
        </div>

        <p className="mt-6 text-sm text-ink-soft">
          Also available: <a className="underline" href="/llms-full.txt">/llms-full.txt</a> ·{" "}
          <a className="underline" href="/index.md">/index.md</a> ·{" "}
          <a className="underline" href={`${SITE_URL}/sitemap.xml`}>sitemap</a>
        </p>
      </div>
      <RobotAnchor pose="signal" id="agents" className="hidden aspect-square w-full max-w-sm justify-self-center lg:block" />
    </section>
  );
}
