import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif-family", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans-family", display: "swap" });

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${t.meta.siteName} — ${t.meta.tagline}`, template: `%s · ${t.meta.siteName}` },
    description: t.meta.description,
    alternates: { languages: { fr: "/fr", en: "/en" } },
    openGraph: { siteName: t.meta.siteName, locale: lang === "fr" ? "fr_FR" : "en_GB", type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#f7f3ea", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} className={`${serif.variable} ${sans.variable}`}>
      <body className="paper-bg min-h-dvh">
        <SiteHeader locale={lang} />
        {children}
      </body>
    </html>
  );
}
