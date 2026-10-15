import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { SITE_URL } from "@/content/data";
import { getContent } from "@/content/content";
import { defaultLocale, ogLocales } from "@/i18n/config";
import { ClientShell } from "@/components/ClientShell";
import "./globals.css";
import "./poster.css";

// Two web fonts only; small mono labels use the system monospace stack.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { dict, profile } = await getContent();
  const title = `${profile.name} — ${profile.role}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${profile.name}` },
    description: profile.facts,
    applicationName: profile.name,
    authors: [{ name: profile.name, url: SITE_URL }],
    creator: profile.name,
    keywords: dict.meta.keywords,
    alternates: {
      canonical: "/",
      types: { "text/markdown": "/index.md" },
    },
    openGraph: {
      type: "profile",
      url: "/",
      siteName: profile.name,
      title,
      description: profile.tagline,
      firstName: "Kateryna",
      lastName: "Stetsenko",
      locale: ogLocales[defaultLocale],
    },
    twitter: { card: "summary_large_image", title, description: profile.tagline },
    robots: { index: true, follow: true },
    // iOS turns number runs like "2022" or "30s → 4s" into tap-to-call links otherwise
    formatDetection: { telephone: false, address: false, email: false },
    // "Add to Home Screen" on iOS: own title, status bar blends with the page
    appleWebApp: { capable: true, title: dict.meta.appleTitle, statusBarStyle: "default" },
  };
}

export const viewport: Viewport = {
  themeColor: "#fff8f1",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { dict } = await getContent();
  return (
    <html
      lang={defaultLocale}
      className={`${bricolage.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
        >
          {dict.meta.skipToContent}
        </a>
        <ClientShell t={{ palette: dict.palette, robot: dict.robot }}>{children}</ClientShell>
      </body>
    </html>
  );
}
