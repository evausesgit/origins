"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import type { GraphIndex } from "@/data";
import type { GraphNode, Locale } from "@/data/types";
import { StatusBadge, StatusGlyph } from "@/components/Status";
import { getDictionary } from "@/lib/i18n";
import { kindColor, statusColor } from "@/lib/theme";

/**
 * Phone version of the mind map: the same tree, "zoomed" one level at a time.
 * Tapping a child makes its card travel up into the header position (shared
 * layout animation) while its own children unfold below.
 */
export function MobileFocus({ index, locale, focusId, onNavigate, onDetails }: { index: GraphIndex; locale: Locale; focusId: string; onNavigate: (id: string) => void; onDetails: (id: string) => void }) {
  const t = getDictionary(locale);
  const reduce = useReducedMotion();
  const focus = index.byId.get(focusId)!;
  const kids = index.children.get(focusId) ?? [];
  const parent = focus.parent ? index.byId.get(focus.parent) : undefined;
  const transition = { duration: reduce ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="absolute inset-0 overflow-y-auto px-3 pb-28 pt-[6.5rem]">
      <LayoutGroup>
        {parent && (
          <motion.button
            layout
            onClick={() => onNavigate(parent.id)}
            className="mb-2 flex items-center gap-2 text-sm text-ink-2"
            transition={transition}
          >
            <span aria-hidden>↑</span>
            <span className="truncate">{parent.title[locale]}</span>
          </motion.button>
        )}

        <motion.div layoutId={`m-${focus.id}`} transition={transition} className="relative z-10">
          <button
            onClick={() => onDetails(focus.id)}
            className="block w-full overflow-hidden rounded-2xl border border-rule bg-card p-4 text-left shadow-[0_10px_30px_-18px_rgba(60,45,20,0.5)]"
            style={{ borderLeft: `4px solid ${accentOf(focus)}` }}
          >
            <div className="flex items-center justify-between text-[0.7rem]">
              <span className="smallcaps font-semibold" style={{ color: kindColor(focus.kind) }}>
                {focus.parent ? t.kind[focus.kind] : t.explorer.dossier}
              </span>
              {focus.date && <span className="text-muted">{focus.date.label[locale]}</span>}
            </div>
            <h2 className="mt-1 font-serif text-[1.35rem] font-semibold leading-snug text-ink">{focus.title[locale]}</h2>
            {focus.status && (
              <div className="mt-2">
                <StatusBadge status={focus.status} locale={locale} />
              </div>
            )}
            <p className="mt-2 line-clamp-4 text-[0.93rem] leading-relaxed text-ink-2">{focus.summary[locale]}</p>
            <span className="mt-2 inline-block text-sm font-medium text-accent">{t.panel.assessment} & {t.panel.relations.toLowerCase()} →</span>
          </button>
        </motion.div>

        {kids.length > 0 && (
          <div className="relative mt-1 pl-5">
            <span aria-hidden className="absolute bottom-6 left-2 top-0 w-px bg-rule" />
            <AnimatePresence mode="popLayout">
              {kids.map((k, i) => (
                <motion.div
                  key={k.id}
                  layoutId={`m-${k.id}`}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ ...transition, delay: reduce ? 0 : 0.05 + i * 0.03 }}
                  className="relative mt-2.5"
                >
                  <span aria-hidden className="absolute -left-3 top-6 h-px w-3 bg-rule" />
                  <button
                    onClick={() => onNavigate(k.id)}
                    className="block w-full rounded-xl border border-rule bg-card px-3.5 py-3 text-left active:bg-paper-2"
                    style={{ borderLeft: `3px solid ${accentOf(k)}` }}
                  >
                    <div className="flex items-center justify-between text-[0.66rem]">
                      <span className="smallcaps font-semibold" style={{ color: kindColor(k.kind) }}>{focus.parent ? t.kind[k.kind] : ""}</span>
                      {k.date && <span className="text-muted">{k.date.label[locale]}</span>}
                    </div>
                    <div className="mt-0.5 font-serif text-[1.02rem] leading-snug text-ink">{k.title[locale]}</div>
                    {k.short && <div className="mt-0.5 text-[0.82rem] text-ink-2">{k.short[locale]}</div>}
                    <div className="mt-1.5 flex items-center justify-between text-[0.72rem]">
                      {k.status ? (
                        <span className="inline-flex items-center gap-1 font-medium" style={{ color: statusColor(k.status) }}>
                          <StatusGlyph status={k.status} size={10} /> {t.status[k.status]}
                        </span>
                      ) : (
                        <span />
                      )}
                      {(index.children.get(k.id)?.length ?? 0) > 0 && (
                        <span className="rounded-full bg-paper-2 px-2 py-0.5 text-ink-2">+{index.children.get(k.id)!.length}</span>
                      )}
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </LayoutGroup>
    </div>
  );
}

function accentOf(n: GraphNode) {
  return n.status && (n.kind === "claim" || n.kind === "question" || !n.parent) ? statusColor(n.status) : kindColor(n.kind);
}
