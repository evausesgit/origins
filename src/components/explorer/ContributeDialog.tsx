"use client";

import { useState } from "react";
import type { GraphIndex } from "@/data";
import type { Locale } from "@/data/types";
import { getDictionary } from "@/lib/i18n";
import { Dialog } from "./Dialog";

/**
 * Phase 1: shows the contribution process; submission opens in phase 2
 * (accounts, AI pre-analysis, moderation). Nothing is sent anywhere.
 */
export function ContributeDialog({ index, locale, targetId, onClose }: { index: GraphIndex; locale: Locale; targetId: string; onClose: () => void }) {
  const t = getDictionary(locale);
  const claims = index.dossier.nodes.filter((n) => n.kind === "claim" || n.id === index.dossier.rootId);
  const initial = claims.some((c) => c.id === targetId) ? targetId : index.dossier.rootId;
  const [target, setTarget] = useState(initial);
  const field = "w-full rounded-xl border border-rule bg-paper/50 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink-2";

  return (
    <Dialog onClose={onClose} label={t.contribute.title} className="max-w-2xl">
      <form
        className="max-h-[84dvh] overflow-y-auto"
        onSubmit={(e) => e.preventDefault()}
        aria-describedby="contribute-unavailable"
      >
        <div className="flex items-start justify-between gap-4 border-b border-rule-2 px-6 pb-4 pt-5">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">{t.contribute.title}</h2>
            <p className="mt-1 text-sm text-ink-2">{t.contribute.lead}</p>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-paper-2" aria-label={t.explorer.close}>
            ×
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t.contribute.target}</span>
            <select className={field} value={target} onChange={(e) => setTarget(e.target.value)}>
              {claims.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title[locale]}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t.contribute.url}</span>
              <input className={field} placeholder="https://…" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t.contribute.file}</span>
              <input type="file" accept="application/pdf,image/*" className={`${field} file:mr-3 file:rounded-full file:border-0 file:bg-paper-2 file:px-3 file:py-1 file:text-xs`} />
            </label>
          </div>
          <fieldset className="space-y-1.5">
            <legend className="text-xs font-semibold uppercase tracking-wider text-muted">{t.contribute.stance}</legend>
            <div className="flex flex-wrap gap-2">
              {[t.contribute.supports, t.contribute.contradicts, t.contribute.contextualizes].map((s, i) => (
                <label key={i} className="flex cursor-pointer items-center gap-2 rounded-full border border-rule px-3 py-1.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-paper-2">
                  <input type="radio" name="stance" defaultChecked={i === 0} className="accent-[color:var(--ink)]" />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t.contribute.comment}</span>
            <textarea rows={4} className={field} placeholder={t.contribute.commentHint} />
          </label>

          <div className="rounded-xl bg-paper-2/70 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{t.contribute.steps}</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-2">
              <li>{t.contribute.step1}</li>
              <li>{t.contribute.step2}</li>
              <li>{t.contribute.step3}</li>
            </ol>
          </div>
          <p id="contribute-unavailable" className="text-sm text-muted">
            {t.contribute.unavailable}
          </p>
        </div>
        <div className="flex justify-end border-t border-rule-2 px-6 py-3">
          <button type="submit" disabled className="cursor-not-allowed rounded-full bg-ink/40 px-5 py-2 text-sm font-medium text-paper">
            {t.contribute.submit}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
