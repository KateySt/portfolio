import { person } from "@/content/data";
import { defaultDictionary, getDictionary } from "@/i18n/dictionary";
import { fmt } from "@/i18n/format";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `${person.name} — ${defaultDictionary.profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const { meta } = await getDictionary();
  return renderOg({
    eyebrow: meta.ogEyebrow,
    title: fmt(meta.ogTitle, { name: person.name }),
    footer: meta.ogFooter,
  });
}
