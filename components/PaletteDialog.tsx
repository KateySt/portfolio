"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { mcpUrl, person } from "@/content/data";
import type { Dictionary } from "@/i18n/dictionary";
import { haptic, prefs, pushImpulse, setMotionOverride, setTheme, usePrefs } from "@/lib/interaction";

const sectionIds = ["top", "about", "skills", "projects", "education", "agents", "contact"] as const;

/** Heavy part of the ⌘K menu (cmdk + dialog) — loaded on first open. Strings arrive as props. */
export default function PaletteDialog({ t }: { t: Dictionary["palette"] }) {
  const open = usePrefs((p) => p.paletteOpen);
  const motion = usePrefs((p) => p.motion);
  const theme = usePrefs((p) => p.theme);
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
      label={t.label}
      overlayClassName="fixed inset-0 z-[80] bg-scrim backdrop-blur-sm"
      contentClassName="fixed z-[90] w-full overflow-hidden bg-cream shadow-lift outline-none focus-visible:outline-none
        bottom-0 left-0 rounded-t-[2rem] pb-[env(safe-area-inset-bottom)]
        sm:bottom-auto sm:left-1/2 sm:top-[18vh] sm:max-w-xl sm:-translate-x-1/2 sm:rounded-[2rem] sm:pb-0"
    >
      <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-ink/15 sm:hidden" aria-hidden />
      <Command.Input
        autoFocus
        placeholder={t.placeholder}
        // the caret already shows focus; the global focus ring drew a purple bar under the field
        className="w-full bg-transparent px-6 py-5 text-lg outline-none placeholder:text-ink-soft/70 focus-visible:outline-none"
      />
      <div aria-hidden className="mx-6 h-px bg-ink/10" />
      {/* data-lenis-prevent: let the wheel scroll this list natively instead of the page.
          The mask fades items out at the edges instead of slicing them at the divider. */}
      <Command.List
        data-lenis-prevent
        className="max-h-[min(60svh,26rem)] overflow-y-auto overscroll-contain p-3 [mask-image:linear-gradient(to_bottom,transparent,black_14px,black_calc(100%-14px),transparent)]"
      >
        <Command.Empty className="px-4 py-8 text-center text-ink-soft">{t.empty}</Command.Empty>

        <Group heading={t.groups.goTo}>
          {sectionIds.map((id) => (
            <Item key={id} onSelect={go(id)} icon="→">
              {t.sections[id]}
            </Item>
          ))}
          <Item onSelect={run(() => router.push("/notes"))} icon="✎">
            {t.notes}
          </Item>
        </Group>

        <Group heading={t.groups.contact}>
          <Item onSelect={copy(person.contact.email)} icon="@">
            {t.copyEmail}
          </Item>
          <Item onSelect={run(() => window.open(person.contact.linkedin, "_blank", "noopener"))} icon="in">
            {t.openLinkedIn}
          </Item>
          <Item
            onSelect={run(() => {
              const a = document.createElement("a");
              a.href = person.contact.cv;
              a.download = "";
              a.click();
            })}
            icon="↓"
          >
            {t.downloadCv}
          </Item>
        </Group>

        <Group heading={t.groups.agents}>
          <Item onSelect={copy(mcpUrl())} icon="⌁">
            {t.copyMcp}
          </Item>
          <Item onSelect={run(() => window.open("/llms.txt", "_blank"))} icon="≡">
            {t.openLlms}
          </Item>
        </Group>

        <Group heading={t.groups.fun}>
          <Item
            onSelect={run(() => {
              pushImpulse("jump", 1.2);
              haptic(20);
            })}
            icon="✦"
          >
            {t.jump}
          </Item>
          <Item onSelect={run(() => setTheme(theme === "dark" ? "light" : "dark"))} icon={theme === "dark" ? "☀" : "☾"}>
            {theme === "dark" ? t.themeLight : t.themeDark}
          </Item>
          <Item onSelect={run(() => setMotionOverride(!motion))} icon={motion ? "◐" : "◑"}>
            {motion ? t.motionOff : t.motionOn}
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
      className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl px-3 text-base text-ink data-[selected=true]:bg-lavender/45 dark:data-[selected=true]:bg-lavender dark:data-[selected=true]:text-on-pastel"
    >
      <span aria-hidden className="grid size-8 place-items-center rounded-xl bg-surface font-mono text-sm shadow-soft">
        {icon}
      </span>
      {children}
    </Command.Item>
  );
}
