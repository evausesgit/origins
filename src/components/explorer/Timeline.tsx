"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GraphIndex } from "@/data";
import type { GraphNode, Locale, TimelineScale } from "@/data/types";
import { StatusGlyph } from "@/components/Status";
import { getDictionary } from "@/lib/i18n";
import { kindColor } from "@/lib/theme";

const AXIS_Y = 76;
const LABEL_W = 190;

/** Linear scale, or piecewise when the dossier spans a long empty gap. */
export function yearToPct(y: number, sc: TimelineScale) {
  if (!sc.break) return ((y - sc.min) / (sc.max - sc.min)) * 100;
  if (y <= sc.break) return ((y - sc.min) / (sc.break - sc.min)) * 86;
  return 86 + ((y - sc.break) / (sc.max - sc.break)) * 14;
}

export function datedEvents(index: GraphIndex): GraphNode[] {
  return index.dossier.nodes
    .filter((n) => n.date && (n.kind === "event" || n.kind === "concept") && n.id !== index.dossier.rootId)
    .sort((a, b) => a.date!.year - b.date!.year);
}

export function useYearPlayer(sc: TimelineScale) {
  const [year, setYear] = useState(sc.max);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setYear((y) => {
        // ~ 10 s for the main period, ~ 3 s for a compressed tail
        const speed = sc.break ? (y < sc.break ? (sc.break - sc.min) / 10 : (sc.max - sc.break) / 3) : (sc.max - sc.min) / 10;
        const next = y + (dt / 1000) * speed;
        if (next >= sc.max) {
          setPlaying(false);
          return sc.max;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, sc]);
  return { year, setYear, playing, setPlaying, sc };
}

export function YearSlider({ year, setYear, playing, setPlaying, sc, locale }: ReturnType<typeof useYearPlayer> & { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => {
          if (!playing && year >= sc.max - 1) setYear(sc.min);
          setPlaying(!playing);
        }}
        className="shrink-0 rounded-full border border-rule bg-card px-3 py-1.5 text-xs font-medium text-ink-2 hover:bg-paper-2"
      >
        {playing ? "❚❚" : "▶"} {t.timeline.play}
      </button>
      <label className="flex flex-1 items-center gap-3">
        <span className="sr-only">{t.timeline.upTo}</span>
        <input
          type="range"
          min={sc.min}
          max={sc.max}
          step={1}
          value={Math.round(year)}
          onChange={(e) => {
            setPlaying(false);
            setYear(Number(e.target.value));
          }}
          className="w-full accent-[color:var(--accent)]"
        />
        <span className="w-24 shrink-0 text-right font-serif text-lg tabular-nums text-ink">
          <span className="text-xs text-muted">{t.timeline.upTo} </span>
          {Math.round(year)}
        </span>
      </label>
    </div>
  );
}

export function Timeline({ index, locale, onSelect, selectedId }: { index: GraphIndex; locale: Locale; onSelect: (id: string) => void; selectedId?: string }) {
  const t = getDictionary(locale);
  const sc = index.dossier.timeline;
  const player = useYearPlayer(sc);
  const { year } = player;
  const events = useMemo(() => datedEvents(index).filter((e) => e.kind === "event"), [index]);
  const bands = useMemo(() => index.dossier.nodes.filter((n) => n.kind === "concept" && n.date), [index]);
  const ticks = sc.ticks;
  const visible = events.filter((e) => e.date!.year <= year);

  // Spread axis labels over lanes so they never overlap, using the real width.
  const axisRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);
  useEffect(() => {
    const el = axisRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const placed = useMemo(() => {
    const laneEnds: number[] = [];
    return events.map((e) => {
      const x = (yearToPct(e.date!.year, sc) / 100) * width;
      const w = Math.min(LABEL_W, e.title[locale].length * 6.6 + 24);
      const left = Math.min(Math.max(0, x - 6), width - w);
      let lane = laneEnds.findIndex((end) => end + 6 < left);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = left + w;
      return { e, lane, left };
    });
  }, [events, width, locale, sc]);
  const lanesUsed = Math.max(1, ...placed.map((p) => p.lane + 1));

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-5 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="font-serif text-2xl font-semibold text-ink">{t.timeline.title}</h2>
        <p className="mt-1 text-sm text-muted">{t.timeline.hint}</p>
        <div className="mt-4">
          <YearSlider {...player} locale={locale} />
        </div>

        {/* Axis (tablet and up) */}
        <div ref={axisRef} className="relative mt-8 hidden md:block" style={{ height: 120 + lanesUsed * 30 }} aria-hidden>
          {bands.map((b, i) => {
            const start = b.date!.year;
            const shown = year >= start;
            return (
              <div
                key={b.id}
                className="absolute h-6 rounded-full transition-opacity duration-500"
                style={{
                  top: i * 30,
                  left: `${yearToPct(start, sc)}%`,
                  right: 0,
                  opacity: shown ? 1 : 0,
                  background: `linear-gradient(90deg, color-mix(in srgb, var(--k-concept) 14%, transparent), color-mix(in srgb, var(--k-concept) 4%, transparent))`,
                }}
              >
                <span className="smallcaps whitespace-nowrap pl-3 text-xs leading-6 text-ink-2">{b.title[locale]}</span>
              </div>
            );
          })}
          <div className="absolute inset-x-0 h-px bg-rule" style={{ top: AXIS_Y }} />
          {sc.break && <div className="absolute h-2 w-px bg-rule" style={{ left: "86%", top: AXIS_Y - 4 }} />}
          {ticks.map((y) => (
            <div key={y} className="absolute -translate-x-1/2 text-[0.7rem] tabular-nums text-muted" style={{ left: `${yearToPct(y, sc)}%`, top: AXIS_Y + 6 }}>
              {y}
            </div>
          ))}
          {placed.map(({ e, lane, left }) => {
            const shown = e.date!.year <= year;
            const top = AXIS_Y + 28 + lane * 30;
            return (
              <div key={e.id} className="transition-opacity duration-500" style={{ opacity: shown ? 1 : 0 }}>
                <span className="absolute w-px bg-rule" style={{ left: `${yearToPct(e.date!.year, sc)}%`, top: AXIS_Y - 3, height: top - AXIS_Y + 3 }} />
                <span className="absolute size-1.5 -translate-x-1/2 rounded-full" style={{ left: `${yearToPct(e.date!.year, sc)}%`, top: AXIS_Y - 3, background: kindColor(e.kind) }} />
                <button
                  onClick={() => onSelect(e.id)}
                  tabIndex={-1}
                  className={`absolute truncate rounded-full border bg-card px-2.5 py-0.5 text-xs shadow-sm hover:border-ink-2 ${selectedId === e.id ? "border-accent text-ink" : "border-rule text-ink-2"}`}
                  style={{ left, top, maxWidth: LABEL_W, pointerEvents: shown ? "auto" : "none" }}
                >
                  {e.title[locale]}
                </button>
              </div>
            );
          })}
        </div>

        {/* List (always, also the accessible version) */}
        <ol className="mt-6 space-y-2 md:mt-2">
          {visible.map((e) => (
            <li key={e.id}>
              <button
                onClick={() => onSelect(e.id)}
                className={`flex w-full items-baseline gap-4 rounded-xl border bg-card px-4 py-3 text-left transition hover:border-ink-2 ${selectedId === e.id ? "border-accent" : "border-rule"}`}
              >
                <span className="w-14 shrink-0 font-serif text-lg tabular-nums text-ink">{e.date!.year}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-ink">{e.title[locale]}</span>
                  <span className="block text-sm text-ink-2">{e.date!.label[locale]}{e.short && e.short[locale] !== e.date!.label[locale] ? ` · ${e.short[locale]}` : ""}</span>
                </span>
                {e.place && <span className="hidden text-xs text-muted sm:inline">{e.place.name[locale]}</span>}
                {e.status && <StatusGlyph status={e.status} />}
                <span className="size-2 shrink-0 rounded-full" style={{ background: kindColor(e.kind) }} aria-hidden />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
