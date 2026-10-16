import Link from "next/link";
import { getDictionary } from "@/i18n/dictionary";
import { PaletteTrigger } from "../CommandPalette";
import { ThemeToggle } from "../ThemeToggle";

export async function Header() {
  const { nav } = await getDictionary();
  const links = [
    { href: "/#about", label: nav.about },
    { href: "/#skills", label: nav.skills },
    { href: "/#projects", label: nav.work },
    { href: "/#agents", label: nav.forAi },
    { href: "/#contact", label: nav.contact },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <nav
        aria-label={nav.label}
        className="container-page flex items-center justify-between gap-3"
      >
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 rounded-full bg-surface/90 px-4 font-display text-lg font-bold shadow-soft mouse:bg-surface/75 mouse:backdrop-blur"
        >
          <span aria-hidden className="inline-block size-3 rounded-full bg-lavender-deep" />
          kateryna<span className="text-lavender-deep">.</span>
        </Link>
        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-1 rounded-full bg-surface/75 p-1 shadow-soft backdrop-blur lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium text-ink-soft transition hover:bg-lavender/40 hover:text-ink dark:hover:bg-lavender dark:hover:text-on-pastel"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle label={nav.toggleTheme} />
          <PaletteTrigger label={nav.openMenu} menuText={nav.menu} />
        </div>
      </nav>
    </header>
  );
}
