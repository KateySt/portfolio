import en from "./messages/en.json";
import { defaultLocale, type Locale } from "./config";

/** Shape of every messages file — en.json is the source of truth for keys and types. */
export type Dictionary = typeof en;

// Server-only by usage: dictionaries are read in Server Components, so they never
// reach the client bundle. Client components receive the strings they need as props.
// Extra locales load lazily: `uk: () => import("./messages/uk.json").then((m) => m.default)`.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: async () => en,
};

/**
 * The messages for a locale. Today the site has one locale; once routes live under
 * app/[lang], this reads the current one with `next/root-params` instead of the default.
 */
export async function getDictionary(locale: Locale = defaultLocale): Promise<Dictionary> {
  return dictionaries[locale]();
}

/** Default-locale messages for module-level strings (metadata exports, MCP server info). */
export const defaultDictionary: Dictionary = en;
