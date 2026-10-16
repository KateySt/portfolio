import type { Accent } from "@/content/data";

export const accentBg: Record<Accent, string> = {
  lavender: "bg-lavender",
  peach: "bg-peach",
  mint: "bg-mint",
  sky: "bg-sky",
  butter: "bg-butter",
  blush: "bg-blush",
};

// dark: a bright candy fill with dark text — washed-out pastels got lost on the dark page
const onPastel = "dark:text-on-pastel dark:[&_.text-ink-soft]:text-on-pastel";
export const accentSoft: Record<Accent, string> = {
  lavender: `bg-lavender/40 dark:bg-lavender ${onPastel}`,
  peach: `bg-peach/45 dark:bg-peach ${onPastel}`,
  mint: `bg-mint/45 dark:bg-mint ${onPastel}`,
  sky: `bg-sky/50 dark:bg-sky ${onPastel}`,
  butter: `bg-butter/60 dark:bg-butter ${onPastel}`,
  blush: `bg-blush/45 dark:bg-blush ${onPastel}`,
};

/** Decorative blurred blobs behind cards. */
export const accentGlow: Record<Accent, string> = {
  lavender: "bg-lavender/40 dark:bg-lavender/30",
  peach: "bg-peach/45 dark:bg-peach/30",
  mint: "bg-mint/45 dark:bg-mint/25",
  sky: "bg-sky/50 dark:bg-sky/25",
  butter: "bg-butter/60 dark:bg-butter/25",
  blush: "bg-blush/45 dark:bg-blush/30",
};

export function Eyebrow({ children, accent = "lavender" }: { children: React.ReactNode; accent?: Accent }) {
  return (
    <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-surface/70 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink-soft shadow-soft">
      <span className={`size-2 rounded-full ${accentBg[accent]}`} />
      {children}
    </p>
  );
}

export function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="font-display text-section font-bold tracking-tight text-balance text-ink"
    >
      {children}
    </h2>
  );
}

export function Pill({
  children,
  accent,
  className = "",
}: {
  children: React.ReactNode;
  accent?: Accent;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-ink ${
        accent ? accentSoft[accent] : "bg-surface/70"
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
  download,
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "soft";
  download?: boolean;
  external?: boolean;
}) {
  const base =
    // max-w-full + overflow-wrap: long labels (the email) wrap on very narrow screens instead of widening the layout
    "inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-full px-6 py-2 text-center text-base font-semibold [overflow-wrap:anywhere] transition-[transform,background-color,box-shadow] duration-300 ease-out active:scale-[0.96]";
  const styles =
    variant === "solid"
      ? "bg-ink text-cream shadow-lift hover:bg-ink/85"
      : "bg-surface/75 text-ink shadow-soft hover:bg-surface";
  return (
    <a
      href={href}
      data-magnetic
      className={`${base} ${styles}`}
      {...(download ? { download: "" } : {})}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
