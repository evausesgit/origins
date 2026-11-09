import Link from "next/link";
import type { Locale } from "@/data/types";
import { formatDate, getDictionary } from "@/lib/i18n";
import { Wordmark } from "./SiteHeader";

export function SiteFooter({ locale, updated }: { locale: Locale; updated?: string }) {
  const t = getDictionary(locale);
  return (
    <footer className="mx-auto max-w-[1200px] px-4 py-10 text-sm text-muted sm:px-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Wordmark className="text-sm" />
        <span>{t.meta.tagline}</span>
        <Link href={`/${locale}/methode`} className="hover:text-ink">
          {t.nav.method}
        </Link>
      </div>
      <p className="mt-3 text-xs">
        {t.footer.note}
        {updated && ` ${t.footer.updated} ${formatDate(updated, locale)}.`}
      </p>
    </footer>
  );
}
