"use client";

import { prefs, setTheme } from "@/lib/interaction";

/**
 * Moon in the light theme, sun in the dark one. Which icon shows is decided by
 * CSS (data-theme on <html>), so server and client markup are identical.
 */
export function ThemeToggle({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(prefs.get().theme === "dark" ? "light" : "dark")}
      className="grid min-h-11 min-w-11 place-items-center rounded-full bg-surface/90 text-ink shadow-soft transition active:scale-95 mouse:bg-surface/75 mouse:backdrop-blur mouse:hover:bg-surface"
    >
      {/* moon */}
      <svg aria-hidden viewBox="0 0 24 24" className="size-5 dark:hidden" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
      </svg>
      {/* sun */}
      <svg aria-hidden viewBox="0 0 24 24" className="hidden size-5 text-butter-deep dark:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
