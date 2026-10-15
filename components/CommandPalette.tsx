"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { prefs, usePrefs } from "@/lib/interaction";

const PaletteDialog = dynamic(() => import("./PaletteDialog"), { ssr: false });

export function PaletteTrigger({ label, menuText }: { label: string; menuText: string }) {
  return (
    <button
      type="button"
      onClick={() => prefs.set({ paletteOpen: true })}
      // warm the chunk up before the click lands
      onPointerEnter={() => void import("./PaletteDialog")}
      onTouchStart={() => void import("./PaletteDialog")}
      aria-label={label}
      aria-haspopup="dialog"
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-cream shadow-lift transition active:scale-95"
    >
      <span className="hidden mouse:inline">⌘K</span>
      <span className="mouse:hidden">{menuText}</span>
    </button>
  );
}

/** Light shell: ⌘K / Ctrl+K listener; the dialog itself loads on first open. */
export function CommandPalette({ t }: { t: Dictionary["palette"] }) {
  const open = usePrefs((p) => p.paletteOpen);
  const used = usePrefs((p) => p.paletteUsed);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        prefs.set({ paletteOpen: !prefs.get().paletteOpen });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open && !used) prefs.set({ paletteUsed: true });
  }, [open, used]);

  return open || used ? <PaletteDialog t={t} /> : null;
}
