"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { normalize, type GraphIndex } from "@/data";
import type { Locale } from "@/data/types";
import { getDictionary } from "@/lib/i18n";
import { kindColor } from "@/lib/theme";
import { Dialog } from "./Dialog";

type Hit = { type: "node"; id: string; title: string; sub: string; kind: string; color: string } | { type: "source"; id: string; title: string; sub: string };

export function SearchDialog({ index, locale, onClose, onNavigate }: { index: GraphIndex; locale: Locale; onClose: () => void; onNavigate: (id: string) => void }) {
  const t = getDictionary(locale);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);

  const hits = useMemo<Hit[]>(() => {
    const needle = normalize(q.trim());
    const nodes: Hit[] = index.dossier.nodes
      .filter((n) => !needle || normalize(`${n.title[locale]} ${n.short?.[locale] ?? ""} ${n.summary[locale]}`).includes(needle))
      .map((n) => ({ type: "node", id: n.id, title: n.title[locale], sub: n.short?.[locale] ?? "", kind: t.kind[n.kind], color: kindColor(n.kind) }));
    const sources: Hit[] = index.dossier.sources
      .filter((s) => !needle || normalize(`${s.title} ${s.author} ${s.description[locale]}`).includes(needle))
      .map((s) => ({ type: "source", id: s.id, title: s.title, sub: s.author }));
    // Title matches first.
    const score = (h: Hit) => (normalize(h.title).includes(needle) ? 0 : 1);
    return [...nodes, ...sources].sort((a, b) => score(a) - score(b)).slice(0, needle ? 30 : 12);
  }, [q, index, locale, t]);

  const choose = (h: Hit) => {
    if (h.type === "node") {
      onNavigate(h.id);
      onClose();
    } else {
      router.push(`/${locale}/dossier/${index.dossier.slug}/sources/${h.id}`);
    }
  };

  return (
    <Dialog onClose={onClose} label={t.explorer.search} className="max-w-xl">
      <div className="border-b border-rule-2 p-3">
        <input
          ref={input}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, hits.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && hits[active]) {
              choose(hits[active]);
            }
          }}
          placeholder={t.explorer.searchPlaceholder}
          className="w-full rounded-xl bg-paper-2/60 px-4 py-3 text-base text-ink outline-none placeholder:text-muted focus:bg-paper-2"
          role="combobox"
          aria-expanded
          aria-controls="search-results"
          aria-activedescendant={hits[active] ? `hit-${active}` : undefined}
        />
      </div>
      <ul id="search-results" role="listbox" className="max-h-[60dvh] overflow-y-auto p-2">
        {hits.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">{t.explorer.noResults}</li>}
        {hits.map((h, i) => (
          <li key={`${h.type}-${h.id}`} id={`hit-${i}`} role="option" aria-selected={i === active}>
            {h.type === "node" ? (
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(h)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${i === active ? "bg-paper-2" : ""}`}
              >
                <span className="size-2 shrink-0 rounded-full" style={{ background: h.color }} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink">{h.title}</span>
                  <span className="block truncate text-xs text-muted">
                    <span className="smallcaps">{h.kind}</span>
                    {h.sub && ` · ${h.sub}`}
                  </span>
                </span>
              </button>
            ) : (
              <Link
                href={`/${locale}/dossier/${index.dossier.slug}/sources/${h.id}`}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i === active ? "bg-paper-2" : ""}`}
              >
                <span aria-hidden className="text-xs" style={{ color: "var(--k-source)" }}>❦</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif text-sm text-ink">{h.title}</span>
                  <span className="block truncate text-xs text-muted">{h.sub}</span>
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
