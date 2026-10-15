import { profile } from "@/content/profile";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `${profile.name} — ${profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Full-stack developer · open to work",
    title: `Hi, I'm ${profile.name}`,
    footer: "React · Next.js · Python · Django",
  });
}
