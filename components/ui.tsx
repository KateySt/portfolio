import type { Accent } from "@/content/profile";

export const accentBg: Record<Accent, string> = {
  lavender: "bg-lavender",
  peach: "bg-peach",
  mint: "bg-mint",
  sky: "bg-sky",
  butter: "bg-butter",
  blush: "bg-blush",
};

export const accentSoft: Record<Accent, string> = {
  lavender: "bg-lavender/40",
  peach: "bg-peach/45",
  mint: "bg-mint/45",
  sky: "bg-sky/50",
  butter: "bg-butter/60",
  blush: "bg-blush/45",
};

export function Eyebrow({ children, accent = "lavender" }: { children: React.ReactNode; accent?: Accent }) {
  return (
    <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink-soft shadow-soft">
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
        accent ? accentSoft[accent] : "bg-white/70"
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
      ? "bg-ink text-cream shadow-lift hover:bg-[#3a3155]"
      : "bg-white/75 text-ink shadow-soft hover:bg-white";
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
