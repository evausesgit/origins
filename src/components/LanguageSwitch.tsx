"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/data/types";

export function LanguageSwitch({ locale, label, aria }: { locale: Locale; label: string; aria: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const other: Locale = locale === "fr" ? "en" : "fr";
  const target = pathname.replace(/^\/(fr|en)(?=\/|$)/, `/${other}`);
  return (
    <Link
      href={target}
      hrefLang={other}
      aria-label={aria}
      className="rounded-full border border-rule px-3 py-1 text-xs font-medium tracking-wide text-ink-2 hover:bg-paper-2"
    >
      {label}
    </Link>
  );
}
