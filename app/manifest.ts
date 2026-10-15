import type { MetadataRoute } from "next";
import { getContent } from "@/content/content";
import { defaultLocale } from "@/i18n/config";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { dict, profile } = await getContent();
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: dict.meta.appleTitle,
    description: profile.tagline,
    lang: defaultLocale,
    start_url: "/",
    display: "standalone",
    background_color: "#fff8f1",
    theme_color: "#fff8f1",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
