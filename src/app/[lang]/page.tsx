import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusBadge, StatusGlyph } from "@/components/Status";
import { dossiers, indexDossier, type Dossier } from "@/data";
import type { Locale } from "@/data/types";
import { getDictionary, isLocale } from "@/lib/i18n";
import { computeLayout } from "@/lib/layout";
import { kindColor, statusColor } from "@/lib/theme";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const q = (s: string) => (lang === "fr" ? `« ${s} »` : `“${s}”`);

  // Path B: one timeline across every dossier, one entry per place and year.
  const events = dossiers
    .flatMap((d) =>
      d.nodes
        .filter((n) => n.kind === "event" && n.date && n.place)
        .map((n) => ({ d, n })),
    )
    .sort((a, b) => a.n.date!.year - b.n.date!.year)
    .filter(({ n }, i, arr) => arr.findIndex((m) => m.n.place!.name.en === n.place!.name.en && m.n.date!.year === n.date!.year) === i);

  return (
    <>
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-[1200px] px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
          <p className="smallcaps text-sm font-semibold text-accent">{t.home.kicker}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-[2.4rem] font-semibold leading-[1.08] text-ink sm:text-6xl">{t.home.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{t.home.lead}</p>
        </section>

        {/* Dossiers */}
        <section id="dossiers" className="mx-auto max-w-[1200px] scroll-mt-20 space-y-8 px-4 sm:px-6">
          {dossiers.map((d) => (
            <DossierCard key={d.slug} d={d} lang={lang} />
          ))}
        </section>

        {/* Two paths */}
        <section className="mx-auto grid max-w-[1200px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2">
          <div className="rounded-3xl border border-rule bg-card/70 p-6 sm:p-8">
            <p className="smallcaps text-xs font-semibold text-accent">A</p>
            <h2 className="font-serif text-2xl font-semibold text-ink">{t.home.pathA}</h2>
            <p className="mt-1 text-sm text-ink-2">{t.home.pathADesc}</p>
            {dossiers.map((d) => (
              <div key={d.slug} className="mt-5">
                <h3 className="smallcaps text-xs font-semibold text-muted">{d.title[lang]}</h3>
                <ul className="divide-y divide-rule-2">
                  {d.nodes
                    .filter((n) => n.kind === "claim")
                    .map((c) => (
                      <li key={c.id}>
                        <Link href={`/${lang}/dossier/${d.slug}/${c.id}`} className="group flex items-start gap-3 py-3">
                          <span className="mt-1.5">
                            <StatusGlyph status={c.status!} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-serif text-[1.05rem] leading-snug text-ink group-hover:underline">{q(c.title[lang])}</span>
                            <span className="text-xs font-medium" style={{ color: statusColor(c.status!) }}>
                              {t.status[c.status!]}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-rule bg-card/70 p-6 sm:p-8">
            <p className="smallcaps text-xs font-semibold text-accent">B</p>
            <h2 className="font-serif text-2xl font-semibold text-ink">{t.home.pathB}</h2>
            <p className="mt-1 text-sm text-ink-2">{t.home.pathBDesc}</p>
            <ol className="relative mt-5 space-y-1 border-l border-rule pl-5">
              {events.map(({ d, n: e }) => (
                <li key={`${d.slug}-${e.id}`} className="relative">
                  <span className="absolute -left-[1.6rem] top-[0.95rem] size-2.5 rounded-full border-2 border-card" style={{ background: kindColor("event") }} aria-hidden />
                  <Link href={`/${lang}/dossier/${d.slug}/${e.id}`} className="group flex items-baseline gap-4 py-2">
                    <span className="w-12 shrink-0 font-serif text-lg tabular-nums text-ink">{e.date!.year}</span>
                    <span className="min-w-0">
                      <span className="block text-ink group-hover:underline">
                        {e.place!.name[lang].split(" (")[0]} — {e.title[lang]}
                      </span>
                      <span className="block text-xs text-muted">{d.title[lang]}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Principles */}
        <section className="border-y border-rule-2 bg-paper-2/40">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
            <h2 className="font-serif text-2xl font-semibold text-ink">{t.home.principles}</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[
                [t.home.p1, t.home.p1d],
                [t.home.p2, t.home.p2d],
                [t.home.p3, t.home.p3d],
              ].map(([h, d]) => (
                <div key={h}>
                  <h3 className="font-serif text-lg font-semibold text-ink">{h}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{d}</p>
                </div>
              ))}
            </div>
            <Link href={`/${lang}/methode`} className="mt-6 inline-block text-sm font-medium text-accent hover:underline">
              {t.nav.method} →
            </Link>
            <p className="mt-8 text-sm text-muted">{t.home.comingSoon}</p>
          </div>
        </section>
      </main>
      <SiteFooter locale={lang} updated={dossiers.map((d) => d.updated).sort().at(-1)} />
    </>
  );
}

function DossierCard({ d, lang }: { d: Dossier; lang: Locale }) {
  const t = getDictionary(lang);
  const root = d.nodes.find((n) => n.id === d.rootId)!;
  const base = `/${lang}/dossier/${d.slug}`;
  return (
    <article className="grid overflow-hidden rounded-[1.75rem] border border-rule bg-card shadow-[0_30px_80px_-50px_rgba(60,45,20,0.55)] lg:grid-cols-[1.05fr_1fr]">
      <div className="flex flex-col p-6 sm:p-10">
        <p className="smallcaps text-xs font-semibold text-muted">
          {t.explorer.dossier} · {d.title[lang]} · {d.period[lang]}
        </p>
        <p className="mt-4 font-serif text-lg italic text-muted">{d.accusation[lang]}</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink sm:text-[2.6rem]">{root.title[lang]}</h2>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t.home.verdict}</span>
          <StatusBadge status={root.status!} locale={lang} size="lg" />
        </div>
        <p className="mt-4 leading-relaxed text-ink-2">{root.summary[lang]}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={base} className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-ink-2">
            {t.home.explore} →
          </Link>
          <Link href={`${base}#narration`} className="rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink hover:bg-paper-2">
            ▶ {t.home.understand3}
          </Link>
        </div>
      </div>
      <Link href={base} aria-label={t.home.explore} className="relative hidden min-h-[420px] border-l border-rule-2 bg-paper-2/40 lg:block">
        <MiniMap d={d} lang={lang} />
      </Link>
    </article>
  );
}

/** Static, decorative preview of a dossier's first level (same layout as the explorer). */
function MiniMap({ d, lang }: { d: Dossier; lang: Locale }) {
  const t = getDictionary(lang);
  const index = indexDossier(d);
  const layout = computeLayout(index);
  const branches = index.children.get(d.rootId) ?? [];
  const pts = branches.map((b) => layout.get(b.id)!);
  const max = Math.max(...pts.map((p) => Math.hypot(p.x, p.y)));
  const k = 150 / max;
  const root = index.byId.get(d.rootId)!;
  return (
    <svg viewBox="-260 -230 520 460" className="absolute inset-0 h-full w-full" aria-hidden>
      {pts.map((p, i) => (
        <line key={i} x1={0} y1={0} x2={p.x * k} y2={p.y * k} stroke="var(--rule)" strokeWidth={1} />
      ))}
      {pts.map((p, i) => {
        const b = branches[i];
        const kids = index.children.get(b.id) ?? [];
        return (
          <g key={b.id}>
            {kids.map((kid, j) => {
              const a = Math.atan2(p.y, p.x) + (j - (kids.length - 1) / 2) * 0.22;
              const x2 = p.x * k + Math.cos(a) * 38;
              const y2 = p.y * k + Math.sin(a) * 38;
              return (
                <g key={kid.id}>
                  <line x1={p.x * k} y1={p.y * k} x2={x2} y2={y2} stroke="var(--rule-2)" strokeWidth={0.8} />
                  <circle cx={x2} cy={y2} r={2.4} fill={kindColor(kid.kind)} opacity={0.55} />
                </g>
              );
            })}
            <rect x={p.x * k - 58} y={p.y * k - 13} width={116} height={26} rx={8} fill="var(--card)" stroke="var(--rule)" />
            <text x={p.x * k} y={p.y * k + 4} textAnchor="middle" fontSize={9.5} fill="var(--ink)" className="font-serif">
              {b.title[lang].length > 24 ? b.title[lang].slice(0, 23) + "…" : b.title[lang]}
            </text>
          </g>
        );
      })}
      <rect x={-82} y={-24} width={164} height={48} rx={12} fill="var(--card)" stroke="var(--ink-2)" />
      <text x={0} y={-3} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--ink)" className="font-serif">
        {d.title[lang]}
      </text>
      <text x={0} y={13} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={statusColor(root.status!)}>
        {t.status[root.status!]}
      </text>
    </svg>
  );
}
