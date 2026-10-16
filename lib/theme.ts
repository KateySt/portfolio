// Light/dark theme. The page is static, so the theme is chosen in the browser:
// an inline <head> script sets data-theme before the first paint (no flash),
// then the client keeps it in sync with the toggle and the OS setting.

export type Theme = "light" | "dark";

export const THEME_KEY = "ks:theme";

/** Browser UI color (address bar) per theme — matches --c-page in globals.css. */
export const THEME_COLORS: Record<Theme, string> = { light: "#fff8f1", dark: "#16121f" };

/** Runs synchronously while the HTML is parsed. Kept tiny and dependency-free. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function storedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

export function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Explicit choice wins; otherwise follow the OS. */
export function resolveTheme(): Theme {
  return storedTheme() ?? systemTheme();
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  // the viewport export ships one theme-color per OS scheme; an explicit choice overrides both
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    m.content = THEME_COLORS[theme];
  });
}

export function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode — the choice just won't survive a reload */
  }
}

/**
 * 0 = day, 1 = night, eased by the 3D scene so lights and the robot's glowing
 * screen fade between themes instead of snapping.
 */
export const night = { value: 0 };
