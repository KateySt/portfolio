import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/data";
import { getPublishedNotes } from "@/lib/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getPublishedNotes();
  const lastModified = notes[0]?.date ?? "2026-10-15";
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/notes`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    ...notes.map((n) => ({
      url: `${SITE_URL}/notes/${n.slug}`,
      lastModified: n.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
