"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { mcpUrl, profile } from "@/content/profile";
import { haptic, prefs, pushImpulse, setMotionOverride, usePrefs } from "@/lib/interaction";

const sections = [
  { id: "top", label: "Home" },
  { id: "about", label: "About me" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education & certifications" },
  { id: "agents", label: "For AI agents (MCP)" },
  { id: "contact", label: "Contact" },
];

/** Heavy part of the ⌘K menu (cmdk + dialog) — loaded on first open. */
export default function PaletteDialog() {
  const open = usePrefs((p) => p.paletteOpen);
  const motion = usePrefs((p) => p.motion);
  const router = useRouter();

  const close = () => prefs.set({ paletteOpen: false });
  const run = (fn: () => void) => () => {
    close();
    // let the dialog unmount before scrolling / opening tabs
    setTimeout(fn, 60);
  };
  const go = (id: string) =>
    run(() => {
      if (location.pathname !== "/") {
        router.push(`/#${id}`);
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: motion ? "smooth" : "auto" });
    });
  const copy = (text: string) => run(() => navigator.clipboard?.writeText(text).catch(() => {}));

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(o) => prefs.set({ paletteOpen: o })}
      label="Command menu"
      overlayClassName="fixed inset-0 z-[80] bg-ink/25 backdrop-blur-sm"
      contentClassName="fixed z-[90] w-full overflow-hidden bg-cream shadow-lift outline-none focus-visible:outline-none
        bottom-0 left-0 rounded-t-[2rem] pb-[env(safe-area-inset-bottom)]
        sm:bottom-auto sm:left-1/2 sm:top-[18vh] sm:max-w-xl sm:-translate-x-1/2 sm:rounded-[2rem] sm:pb-0"
    >
      <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-ink/15 sm:hidden" aria-hidden />
      <Command.Input
        autoFocus
        placeholder="Where to? Type a command…"
        // the caret already shows focus; the global focus ring drew a purple bar under the field
        className="w-full border-b border-ink/10 bg-transparent px-6 py-5 text-lg outline-none placeholder:text-ink-soft/70 focus-visible:outline-none"
      />
      {/* data-lenis-prevent: let the wheel scroll this list natively instead of the page */}
      <Command.List
        data-lenis-prevent
        className="max-h-[min(60svh,26rem)] overflow-y-auto overscroll-contain p-3"
      >
        <Command.Empty className="px-4 py-8 text-center text-ink-soft">Nothing here… yet ✦</Command.Empty>

        <Group heading="Go to">
          {sections.map((s) => (
            <Item key={s.id} onSelect={go(s.id)} icon="→">
              {s.label}
            </Item>
          ))}
          <Item onSelect={run(() => router.push("/notes"))} icon="✎">
            Notes & case studies
          </Item>
        </Group>

        <Group heading="Contact">
          <Item onSelect={copy(profile.contact.email)} icon="@">
            Copy email
          </Item>
          <Item onSelect={run(() => window.open(profile.contact.linkedin, "_blank", "noopener"))} icon="in">
            Open LinkedIn
          </Item>
          <Item
            onSelect={run(() => {
              const a = document.createElement("a");
              a.href = profile.contact.cv;
              a.download = "";
              a.click();
            })}
            icon="↓"
          >
            Download CV (PDF)
          </Item>
        </Group>

        <Group heading="For AI agents">
          <Item onSelect={copy(mcpUrl())} icon="⌁">
            Copy MCP server URL
          </Item>
          <Item onSelect={run(() => window.open("/llms.txt", "_blank"))} icon="≡">
            Open llms.txt
          </Item>
        </Group>

        <Group heading="Fun">
          <Item
            onSelect={run(() => {
              pushImpulse("jump", 1.2);
              haptic(20);
            })}
            icon="✦"
          >
            Make the robot jump
          </Item>
          <Item onSelect={run(() => setMotionOverride(!motion))} icon={motion ? "◐" : "◑"}>
            {motion ? "Turn animations off" : "Turn animations on"}
          </Item>
        </Group>
      </Command.List>
    </Command.Dialog>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="mb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-ink-soft"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  children,
  onSelect,
  icon,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  icon: string;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl px-3 text-base text-ink data-[selected=true]:bg-lavender/45"
    >
      <span aria-hidden className="grid size-8 place-items-center rounded-xl bg-white font-mono text-sm shadow-soft">
        {icon}
      </span>
      {children}
    </Command.Item>
  );
}
