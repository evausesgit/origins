"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Locale, NarrationStep } from "@/data/types";
import { getDictionary } from "@/lib/i18n";

export const STEP_MS = 30_000; // 6 steps ≈ 3 minutes

interface Props {
  steps: NarrationStep[];
  step: number;
  playing: boolean;
  locale: Locale;
  onStep: (i: number) => void;
  onPlaying: (p: boolean) => void;
  onExit: () => void;
}

export function NarrationBar({ steps, step, playing, locale, onStep, onPlaying, onExit }: Props) {
  const t = getDictionary(locale);
  const reduce = useReducedMotion();
  // Progress is stored with the step it belongs to, so a new step starts at 0.
  const [prog, setProg] = useState({ step, p: 0 });
  const progress = prog.step === step ? prog.p : 0;
  const elapsed = useRef({ step, ms: 0 });

  useEffect(() => {
    if (!playing) return;
    if (elapsed.current.step !== step) elapsed.current = { step, ms: 0 };
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      elapsed.current.ms += now - last;
      last = now;
      const p = Math.min(1, elapsed.current.ms / STEP_MS);
      setProg({ step, p });
      if (p >= 1) {
        if (step < steps.length - 1) onStep(step + 1);
        else onPlaying(false);
      }
    }, 120);
    return () => window.clearInterval(id);
  }, [playing, step, steps.length, onStep, onPlaying]);

  const s = steps[step];
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center p-3 sm:p-5">
      <div
        className="pointer-events-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-rule bg-card/95 shadow-xl backdrop-blur"
        role="region"
        aria-label={t.narration.start}
        aria-live="polite"
      >
        <div className="flex gap-1 px-5 pt-4" aria-hidden>
          {steps.map((_, i) => (
            <button key={i} onClick={() => onStep(i)} className="h-1 flex-1 overflow-hidden rounded-full bg-paper-2" tabIndex={-1}>
              <span
                className="block h-full rounded-full bg-accent"
                style={{ width: i < step ? "100%" : i === step ? `${progress * 100}%` : "0%", transition: reduce ? "none" : "width 120ms linear" }}
              />
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="px-5 pb-3 pt-3"
          >
            <div className="text-xs text-muted">{t.narration.step(step + 1, steps.length)}</div>
            <h2 className="font-serif text-lg font-semibold text-ink">{s.title[locale]}</h2>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-2">{s.text[locale]}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-2 border-t border-rule-2 px-4 py-2.5">
          <button onClick={() => onStep(Math.max(0, step - 1))} disabled={step === 0} className="rounded-full px-3 py-1.5 text-sm text-ink-2 hover:bg-paper-2 disabled:opacity-40" aria-label={t.narration.prev}>
            ←
          </button>
          <button onClick={() => onPlaying(!playing)} className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-paper hover:bg-ink-2">
            {playing ? `❚❚ ${t.narration.pause}` : `▶ ${t.narration.play}`}
          </button>
          <button onClick={() => onStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} className="rounded-full px-3 py-1.5 text-sm text-ink-2 hover:bg-paper-2 disabled:opacity-40" aria-label={t.narration.next}>
            →
          </button>
          <button onClick={onExit} className="ml-auto rounded-full px-3 py-1.5 text-sm text-ink-2 hover:bg-paper-2">
            {t.narration.explore}
          </button>
        </div>
      </div>
    </div>
  );
}
