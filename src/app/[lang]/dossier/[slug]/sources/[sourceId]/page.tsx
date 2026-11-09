import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusBadge } from "@/components/Status";
import { claimsForSource, getDossier, indexDossier, nodesForSource, sourceDescendants, sourceLineage } from "@/data";
import { formatDate, getDictionary, isLocale } from "@/lib/i18n";
import { kindColor } from "@/lib/theme";

type Params = { lang: string; slug: string; sourceId: string };

export function generateStaticParams({ params }: { params: { slug: string } }) {
  return getDossier(params.slug)?.sources.map((s) => ({ sourceId: s.id })) ?? [];
}

function resolve(p: Params) {
  if (!isLocale(p.lang)) return null;
  const dossier = getDossier(p.slug);
  const source = dossier?.sources.find((s) => s.id === p.sourceId);
  if (!dossier || !source) return null;
  return { locale: p.lang, dossier, source, index: indexDossier(dossier) };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const title = `${r.source.title} — ${r.source.author}`;
  return { title, description: r.source.description[r.locale], openGraph: { title, description: r.source.description[r.locale], type: "article" } };
}

const verifColor = { verified: "var(--st-established)", partial: "var(--st-plausible)", to_verify: "var(--st-undetermined)" } as const;

export default async function SourcePage({ params }: { params: Promise<Params> }) {
  const r = resolve(await params);
  if (!r) notFound();
  const { locale, dossier, source, index } = r;
  const t = getDictionary(locale);
  const tx = (v?: { fr: string; en: string }) => v?.[locale];
  const base = `/${locale}/dossier/${dossier.slug}`;
  const lineage = sourceLineage(index, source.id);
  const descendants = sourceDescendants(index, source.id);
  const claims = claimsForSource(index, source.id);
  const inMap = nodesForSource(index, source.id);

  return (
    <>
      <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-12">
        <nav className="text-sm text-muted">
          <Link href={base} className="hover:text-ink">← {t.source.backToMap}</Link>
          <span className="mx-2">·</span>
          <span>{t.source.library}</span>
        </nav>

        <header className="mt-6">
          <p className="smallcaps text-xs font-semibold" style={{ color: "var(--k-source)" }}>
            {t.nature[source.nature]} · {tx(source.type)}
          </p>
          <h1 className="mt-2 max-w-4xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">{source.title}</h1>
          <p className="mt-2 text-lg text-ink-2">
            {source.author} — {tx(source.date)}
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-8">
            <p className="text-[1.05rem] leading-relaxed text-ink">{tx(source.description)}</p>

            <dl className="grid gap-x-8 gap-y-4 rounded-2xl border border-rule bg-card p-5 sm:grid-cols-2">
              <Field label={t.source.author}>{source.author}</Field>
              <Field label={t.source.date}>{tx(source.date)}</Field>
              <Field label={t.source.nature}>{t.nature[source.nature]}</Field>
              <Field label={t.source.type}>{tx(source.type)}</Field>
              {source.provenance && <Field label={t.source.provenance}>{tx(source.provenance)}</Field>}
              {source.holding && <Field label={t.source.holding}>{tx(source.holding)}</Field>}
              <Field label={t.source.language}>{tx(source.language)}</Field>
              {source.edition && <Field label={t.source.edition}>{tx(source.edition)}</Field>}
              <Field label={t.source.link} wide>
                {source.url ? (
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="break-all text-accent underline decoration-accent/30 hover:decoration-accent">
                    {source.url}
                  </a>
                ) : (
                  <span className="text-muted">{t.source.linkMissing}</span>
                )}
              </Field>
            </dl>

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{t.source.quote}</h2>
              {source.quote ? (
                <figure className="mt-2 rounded-2xl border border-rule bg-card p-5">
                  <blockquote className="font-serif text-lg italic text-ink">{source.quote.text}</blockquote>
                  {source.quote.translation && <p className="mt-2 text-ink-2">{tx(source.quote.translation)}</p>}
                  <figcaption className="mt-2 text-xs text-muted">{tx(source.quote.locator)}</figcaption>
                </figure>
              ) : (
                <p className="mt-2 rounded-2xl border border-dashed border-rule p-4 text-sm text-muted">{t.source.quoteMissing}</p>
              )}
            </section>

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{t.source.manuscript}</h2>
              <p className="mt-2 rounded-2xl border border-dashed border-rule p-4 text-sm text-muted">{t.source.manuscriptMissing}</p>
            </section>

            {claims.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{t.source.claims}</h2>
                <ul className="mt-2 space-y-2">
                  {claims.map((c) => (
                    <li key={c.id}>
                      <Link href={`${base}/${c.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rule bg-card px-4 py-3 hover:border-ink-2">
                        <span className="font-serif text-ink">{c.title[locale]}</span>
                        {c.status && <StatusBadge status={c.status} locale={locale} size="sm" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-rule bg-card p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{t.source.verification}</h2>
              <p className="mt-2 font-medium" style={{ color: verifColor[source.verification.status] }}>
                {t.verification[source.verification.status]}
                <span className="font-normal text-muted"> · {t.source.checkedOn} {formatDate(source.verification.checkedOn, locale)}</span>
              </p>
              <p className="mt-1 text-sm text-ink-2">{tx(source.verification.note)}</p>
            </div>

            <div className="rounded-2xl border border-rule bg-card p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{t.source.independence}</h2>
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <div className="text-xs text-muted">{t.source.dependsOn}</div>
                  {lineage.length === 0 ? (
                    <p className="text-ink-2">—</p>
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {lineage.map((s) => (
                        <li key={s.id}>
                          <Link href={`${base}/sources/${s.id}`} className="font-serif text-ink underline decoration-rule hover:decoration-ink">↑ {s.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <div className="text-xs text-muted">{t.source.usedBy}</div>
                  {descendants.length === 0 ? (
                    <p className="text-ink-2">—</p>
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {descendants.map((s) => (
                        <li key={s.id}>
                          <Link href={`${base}/sources/${s.id}`} className="font-serif text-ink underline decoration-rule hover:decoration-ink">↓ {s.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {inMap.length > 0 && (
              <div className="rounded-2xl border border-rule bg-card p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{t.source.nodes}</h2>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {inMap.map((n) => (
                    <li key={n.id}>
                      <Link href={`${base}/${n.id}`} className="flex items-center gap-2 text-ink hover:underline">
                        <span className="size-2 rounded-full" style={{ background: kindColor(n.kind) }} aria-hidden />
                        {n.title[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <CopyLinkButton label={t.source.shareSource} done={t.explorer.copied} />
          </aside>
        </div>
      </main>
      <SiteFooter locale={locale} updated={dossier.updated} />
    </>
  );
}

function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
  );
}
