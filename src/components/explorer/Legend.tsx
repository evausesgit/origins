"use client";

import type { Locale, NodeKind, Status } from "@/data/types";
import { STATUSES } from "@/data/types";
import { StatusGlyph } from "@/components/Status";
import { getDictionary } from "@/lib/i18n";
import { kindColor } from "@/lib/theme";

const KINDS: NodeKind[] = ["claim", "event", "source", "evidence", "person", "interpretation", "conclusion", "question"];

export function Legend({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const t = getDictionary(locale);
  return (
    <div className="pointer-events-auto w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-rule bg-card/95 p-4 text-xs shadow-xl backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold uppercase tracking-wider text-muted">{t.explorer.legend}</span>
        <button onClick={onClose} aria-label={t.explorer.close} className="rounded-full px-2 text-base leading-none text-ink-2 hover:bg-paper-2">
          ×
        </button>
      </div>
      <ul className="grid grid-cols-1 gap-1.5">
        {STATUSES.map((s: Status) => (
          <li key={s} className="flex items-start gap-2">
            <span className="mt-0.5"><StatusGlyph status={s} /></span>
            <span>
              <span className="font-medium" style={{ color: `var(--st-${s})` }}>{t.status[s]}</span>
              <span className="text-muted"> — {t.statusHelp[s]}</span>
            </span>
          </li>
        ))}
      </ul>
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-rule-2 pt-3">
        {KINDS.map((k) => (
          <li key={k} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: kindColor(k) }} aria-hidden />
            {t.kind[k]}
          </li>
        ))}
      </ul>
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-rule-2 pt-3">
        <li className="flex items-center gap-1.5"><span className="h-0.5 w-5 bg-[color:var(--r-supports)]" />{t.relation.SUPPORTS}</li>
        <li className="flex items-center gap-1.5"><span className="h-0.5 w-5 bg-[color:var(--r-contradicts)]" />{t.relation.CONTRADICTS}</li>
        <li className="flex items-center gap-1.5"><span className="h-0.5 w-5 bg-[color:var(--r-neutral)]" />{t.panel.relations}</li>
      </ul>
    </div>
  );
}
