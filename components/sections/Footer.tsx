import Link from "next/link";
import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="container-page flex flex-col items-center justify-between gap-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 text-sm text-ink-soft sm:flex-row">
      <p>
        © 2026 {profile.name}. Made with marshmallows, Next.js &amp; three.js.
      </p>
      <p className="flex gap-4">
        <Link href="/notes" className="underline-offset-4 hover:underline">Notes</Link>
        <a href="/llms.txt" className="underline-offset-4 hover:underline">llms.txt</a>
        <a href={profile.contact.linkedin} className="underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
