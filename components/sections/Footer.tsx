import Link from "next/link";
import { person } from "@/content/data";
import { getDictionary } from "@/i18n/dictionary";
import { fmt } from "@/i18n/format";

export async function Footer() {
  const { footer } = await getDictionary();
  return (
    <footer className="container-page flex flex-col items-center justify-between gap-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 text-sm text-ink-soft sm:flex-row">
      {/* year is static on purpose: a Date() here would make the page dynamic */}
      <p>{fmt(footer.credits, { year: 2026, name: person.name })}</p>
      <p className="flex gap-4">
        <Link href="/notes" className="underline-offset-4 hover:underline">{footer.notes}</Link>
        <a href="/llms.txt" className="underline-offset-4 hover:underline">llms.txt</a>
        <a href={person.contact.linkedin} className="underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
