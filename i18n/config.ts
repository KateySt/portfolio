// Supported languages. Add a locale here + messages/<locale>.json to translate the site.
// With a second locale, routes move under app/[lang] and getDictionary() reads it via next/root-params.
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Open Graph locale codes */
export const ogLocales: Record<Locale, string> = { en: "en_US" };

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);
