import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusGlyph } from "@/components/Status";
import { dossiers } from "@/data";
import { STATUSES } from "@/data/types";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/methode">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return { title: t.method.title, description: t.method.lead };
}

export default async function MethodPage({ params }: PageProps<"/[lang]/methode">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const sources = dossiers.flatMap((d) => d.sources);
  const count = (s: string) => sources.filter((x) => x.verification.status === s).length;

  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-4xl font-semibold text-ink">{t.method.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">{t.method.lead}</p>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-ink">{t.method.levelsTitle}</h2>
          <p className="mt-2 leading-relaxed text-ink-2">{t.method.levelsLead}</p>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ["A", t.method.levelA, t.method.levelAd],
              ["B", t.method.levelB, t.method.levelBd],
              ["C", t.method.levelC, t.method.levelCd],
            ].map(([k, h, d]) => (
              <li key={k} className="rounded-2xl border border-rule bg-card p-5">
                <div className="font-serif text-3xl text-accent">{k}</div>
                <h3 className="mt-1 font-semibold text-ink">{h}</h3>
                <p className="mt-1 text-sm text-ink-2">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-ink">{t.method.statusesTitle}</h2>
          <ul className="mt-5 divide-y divide-rule-2 rounded-2xl border border-rule bg-card">
            {STATUSES.map((s) => (
              <li key={s} className="flex items-start gap-3 px-5 py-3.5">
                <span className="mt-1"><StatusGlyph status={s} size={14} /></span>
                <div>
                  <div className="font-medium" style={{ color: `var(--st-${s})` }}>{t.status[s]}</div>
                  <p className="text-sm text-ink-2">{t.statusHelp[s]}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-ink">{t.method.rulesTitle}</h2>
          <ul className="mt-5 space-y-3">
            {t.method.rules.map((r) => (
              <li key={r} className="flex gap-3 leading-relaxed text-ink-2">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-ink">{t.method.verificationTitle}</h2>
          <ul className="mt-4 flex flex-wrap gap-3 text-sm">
            {(["verified", "partial", "to_verify"] as const).map((s) => (
              <li key={s} className="rounded-full border border-rule bg-card px-4 py-2 text-ink-2">
                {t.verification[s]} : <span className="font-semibold text-ink">{count(s)}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter locale={lang} />
    </>
  );
}
