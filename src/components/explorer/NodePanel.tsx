"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ancestry, type GraphIndex } from "@/data";
import type { GraphNode, L, Locale, Relation } from "@/data/types";
import { StatusBadge } from "@/components/Status";
import { formatDate, getDictionary } from "@/lib/i18n";
import { kindColor, relationColor } from "@/lib/theme";

interface Props {
  index: GraphIndex;
  node: GraphNode;
  locale: Locale;
  onNavigate: (id: string) => void;
  onClose: () => void;
  onContribute: (id: string) => void;
  onShare: (id: string) => void;
}

export function NodePanel({ index, node, locale, onNavigate, onClose, onContribute, onShare }: Props) {
  const t = getDictionary(locale);
  const tx = (v?: L) => (v ? v[locale] : "");
  const slug = index.dossier.slug;
  const children = index.children.get(node.id) ?? [];
  const source = node.sourceId ? index.sources.get(node.sourceId) : undefined;
  const relations = index.relationsOf.get(node.id) ?? [];
  const a = node.assessment;
  const path = ancestry(index, node.id);
  const canContribute = node.kind === "claim" || node.kind === "concept" || node.kind === "question" || node.kind === "conclusion";

  return (
    <article className="flex h-full flex-col" aria-labelledby="panel-title">
      <div className="flex items-start gap-3 border-b border-rule-2 px-5 pb-4 pt-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="smallcaps font-semibold" style={{ color: kindColor(node.kind) }}>
              {t.kind[node.kind]}
            </span>
            {node.date && <span className="text-muted">· {tx(node.date.label)}</span>}
            {node.place && <span className="text-muted">· {tx(node.place.name)}</span>}
          </div>
          <h2 id="panel-title" className="mt-1 font-serif text-[1.35rem] font-semibold leading-snug text-ink">
            {tx(node.title)}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="-mr-1 grid size-9 shrink-0 place-items-center rounded-full text-ink-2 hover:bg-paper-2"
          aria-label={t.explorer.close}
        >
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 text-[0.95rem] leading-relaxed text-ink-2">
        {node.status && (
          <div className="space-y-1.5">
            <StatusBadge status={node.status} locale={locale} size="lg" />
            <p className="text-xs text-muted">{t.statusHelp[node.status]}</p>
          </div>
        )}

        <p className="text-ink">{tx(node.summary)}</p>

        {node.reading && (
          <Section title={t.panel.readings}>
            <div className="space-y-2.5">
              <Reading label={t.panel.levelA} text={tx(node.reading.authenticity)} />
              <Reading label={t.panel.levelB} text={tx(node.reading.content)} />
              <Reading label={t.panel.levelC} text={tx(node.reading.probative)} strong />
            </div>
            {node.locator && (
              <p className="mt-2 text-xs text-muted">
                {t.panel.locator} : {tx(node.locator)}
              </p>
            )}
          </Section>
        )}

        {source && (
          <Section title={t.panel.source}>
            <Link
              href={`/${locale}/dossier/${slug}/sources/${source.id}`}
              className="group block rounded-xl border border-rule bg-card p-3.5 transition hover:border-[color:var(--k-source)]"
            >
              <div className="smallcaps text-[0.7rem] font-semibold" style={{ color: "var(--k-source)" }}>
                {t.nature[source.nature]} · {t.verification[source.verification.status]}
              </div>
              <div className="mt-0.5 font-serif text-[1.02rem] leading-snug text-ink">{source.title}</div>
              <div className="mt-0.5 text-xs text-muted">
                {source.author} — {tx(source.date)}
              </div>
              <div className="mt-2 text-xs font-medium text-accent group-hover:underline">{t.panel.openSource} →</div>
            </Link>
          </Section>
        )}

        {a && (
          <Section title={t.panel.assessment}>
            <div className="space-y-4">
              <List title={t.panel.favorable} items={a.favorable} locale={locale} empty={t.panel.none} tone="for" />
              <List title={t.panel.contrary} items={a.contrary} locale={locale} empty={t.panel.none} tone="against" />
              <List title={t.panel.limits} items={a.limits} locale={locale} empty={t.panel.none} tone="limit" />
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">{t.panel.reasoning}</h4>
                <p className="text-ink">{tx(a.reasoning)}</p>
              </div>
              <dl className="grid grid-cols-2 gap-3 rounded-xl bg-paper-2/70 p-3 text-xs">
                <div>
                  <dt className="text-muted">{t.panel.confidence}</dt>
                  <dd className="font-medium text-ink">{t.confidence[a.confidence]}</dd>
                </div>
                <div>
                  <dt className="text-muted">{t.panel.lastReviewed}</dt>
                  <dd className="font-medium text-ink">{formatDate(a.lastReviewed, locale)}</dd>
                </div>
              </dl>
              <details className="group">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink">
                  {t.panel.history} ({a.history.length})
                </summary>
                <ol className="mt-2 space-y-2 border-l border-rule pl-3">
                  {a.history.map((h, i) => (
                    <li key={i} className="text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="tabular-nums text-muted">{formatDate(h.date, locale)}</span>
                        <StatusBadge status={h.status} locale={locale} size="sm" />
                      </div>
                      <p className="mt-0.5">{tx(h.note)}</p>
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          </Section>
        )}

        {children.length > 0 && (
          <Section title={t.explorer.explore}>
            <ul className="divide-y divide-rule-2 overflow-hidden rounded-xl border border-rule bg-card">
              {children.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onNavigate(c.id)}
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-paper-2/60"
                  >
                    <span className="size-2 shrink-0 rounded-full" style={{ background: kindColor(c.kind) }} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-ink">{tx(c.title)}</span>
                      <span className="smallcaps block text-[0.68rem] text-muted">{t.kind[c.kind]}</span>
                    </span>
                    {c.status && <StatusBadge status={c.status} locale={locale} size="sm" />}
                  </button>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {relations.length > 0 && (
          <Section title={t.panel.relations}>
            <ul className="space-y-2.5">
              {relations.map((r) => (
                <RelationItem key={r.id} r={r} self={node.id} index={index} locale={locale} onNavigate={onNavigate} />
              ))}
            </ul>
          </Section>
        )}

        {path.length > 1 && (
          <nav aria-label="breadcrumb" className="text-xs text-muted">
            {path.slice(0, -1).map((p, i) => (
              <span key={p.id}>
                {i > 0 && " › "}
                <button className="hover:text-ink hover:underline" onClick={() => onNavigate(p.id)}>
                  {i === 0 ? t.explorer.overview : tx(p.title)}
                </button>
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-rule-2 px-5 py-3">
        {canContribute && (
          <button
            onClick={() => onContribute(node.id)}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-2"
          >
            + {t.panel.contribute}
          </button>
        )}
        <button
          onClick={() => onShare(node.id)}
          className="rounded-full border border-rule px-4 py-2 text-sm text-ink-2 hover:bg-paper-2"
        >
          {t.explorer.share}
        </button>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
      {children}
    </section>
  );
}

function Reading({ label, text, strong }: { label: string; text: string; strong?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${strong ? "border-[color:var(--k-evidence)]/40 bg-card" : "border-rule-2 bg-paper-2/40"}`}>
      <div className="smallcaps text-[0.72rem] font-semibold" style={{ color: "var(--k-evidence)" }}>
        {label}
      </div>
      <p className={`mt-0.5 text-sm ${strong ? "text-ink" : ""}`}>{text}</p>
    </div>
  );
}

function List({ title, items, locale, empty, tone }: { title: string; items: L[]; locale: Locale; empty: string; tone: "for" | "against" | "limit" }) {
  const color = tone === "for" ? "var(--r-supports)" : tone === "against" ? "var(--r-contradicts)" : "var(--muted)";
  const mark = tone === "for" ? "+" : tone === "against" ? "−" : "!";
  return (
    <div>
      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color }}>
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-sm text-muted italic">{empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span aria-hidden className="mt-px w-3 shrink-0 text-center font-semibold" style={{ color }}>
                {mark}
              </span>
              <span>{it[locale]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RelationItem({ r, self, index, locale, onNavigate }: { r: Relation; self: string; index: GraphIndex; locale: Locale; onNavigate: (id: string) => void }) {
  const t = getDictionary(locale);
  const outgoing = r.from === self;
  const other = index.byId.get(outgoing ? r.to : r.from);
  if (!other) return null;
  const fromNode = index.byId.get(r.from)!;
  const toNode = index.byId.get(r.to)!;
  return (
    <li className="rounded-xl border border-rule-2 bg-card p-3 text-sm">
      <div className="leading-snug">
        <span className={outgoing ? "text-muted" : ""}>
          {outgoing ? (
            <span className="text-muted">{t.kind[fromNode.kind]}</span>
          ) : (
            <button className="font-medium text-ink hover:underline" onClick={() => onNavigate(other.id)}>
              {fromNode.title[locale]}
            </button>
          )}
        </span>{" "}
        <span className="smallcaps font-semibold" style={{ color: relationColor(r.type) }}>
          {t.relation[r.type]}
        </span>{" "}
        {outgoing ? (
          <button className="font-medium text-ink hover:underline" onClick={() => onNavigate(other.id)}>
            {toNode.title[locale]}
          </button>
        ) : (
          <span className="text-muted">{t.kind[toNode.kind].toLowerCase()}</span>
        )}
      </div>
      <p className="mt-1 text-xs text-ink-2">{r.justification[locale]}</p>
      {r.sourceIds.length > 0 && (
        <p className="mt-1 text-[0.7rem] text-muted">
          {t.panel.relationBackedBy} :{" "}
          {r.sourceIds.map((sid, i) => {
            const s = index.sources.get(sid);
            return (
              <span key={sid}>
                {i > 0 && ", "}
                <Link href={`/${locale}/dossier/${index.dossier.slug}/sources/${sid}`} className="underline decoration-rule hover:text-ink">
                  {s ? shortSource(s.author, s.title) : sid}
                </Link>
              </span>
            );
          })}
        </p>
      )}
    </li>
  );
}

function shortSource(author: string, title: string) {
  const a = author.split(/[,/(]/)[0].trim();
  const ti = title.length > 42 ? title.slice(0, 40) + "…" : title;
  return `${a}, ${ti}`;
}
