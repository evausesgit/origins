import Link from "next/link";
import type { Locale } from "@/data/types";
import { getDictionary } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <header className="sticky top-0 z-40 border-b border-rule-2 bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
        <Link href={`/${locale}`} className="flex shrink-0 items-baseline gap-2" aria-label={t.meta.siteName}>
          <Wordmark />
        </Link>
        <nav className="ml-auto flex items-center gap-0.5 text-sm text-ink-2 sm:gap-2">
          <Link href={`/${locale}#dossiers`} className="hidden rounded-full px-3 py-1.5 hover:bg-paper-2 sm:inline-block">
            {t.nav.dossiers}
          </Link>
          <Link href={`/${locale}/methode`} className="rounded-full px-3 py-1.5 hover:bg-paper-2">
            {t.nav.method}
          </Link>
          <LanguageSwitch locale={locale} label={t.nav.switchTo} aria={t.nav.switchLabel} />
        </nav>
      </div>
    </header>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`whitespace-nowrap font-serif text-[1.05rem] font-semibold tracking-[0.2em] text-ink sm:text-[1.15rem] sm:tracking-[0.28em] ${className}`}>
      <span aria-hidden className="mr-1.5 inline-block translate-y-[-1px] text-accent">◎</span>
      ORIGINES
    </span>
  );
}
