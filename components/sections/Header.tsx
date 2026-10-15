import Link from "next/link";
import { PaletteTrigger } from "../CommandPalette";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Work" },
  { href: "/#agents", label: "For AI" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <nav
        aria-label="Main"
        className="container-page flex items-center justify-between gap-3"
      >
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 rounded-full bg-white/90 px-4 font-display text-lg font-bold shadow-soft mouse:bg-white/75 mouse:backdrop-blur"
        >
          <span aria-hidden className="inline-block size-3 rounded-full bg-lavender-deep" />
          kateryna<span className="text-lavender-deep">.</span>
        </Link>
        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-1 rounded-full bg-white/75 p-1 shadow-soft backdrop-blur lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium text-ink-soft transition hover:bg-lavender/40 hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <PaletteTrigger />
        </div>
      </nav>
    </header>
  );
}
