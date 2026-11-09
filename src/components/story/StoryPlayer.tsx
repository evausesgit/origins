"use client";

/**
 * Plays a dossier's animated story. The timeline is the clock: the stage is
 * redrawn from `t` every frame, and the voice-over track follows `t` (it is
 * re-synced whenever they drift apart, e.g. after a seek).
 */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/data/types";
import { storyAudio } from "@/data/stories";
import { getDictionary } from "@/lib/i18n";
import { type Story, clock, cueAt, sceneAt } from "@/lib/story";
import { H, W } from "./kit";
import { storyScenes } from "./scenes";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const VOICE_KEY = "origines-story-voice";
const CAPTIONS_KEY = "origines-story-captions";

function readPref(key: string): boolean {
  try {
    return localStorage.getItem(key) !== "off";
  } catch {
    return true;
  }
}
function writePref(key: string, on: boolean) {
  try {
    localStorage.setItem(key, on ? "on" : "off");
  } catch {
    /* private mode: the preference just isn't remembered */
  }
}

export function StoryPlayer({ story, locale, dossierTitle }: { story: Story; locale: Locale; dossierTitle: string }) {
  const t$ = getDictionary(locale);
  const { script, timing } = story;
  const duration = timing.duration;
  const Scenes = storyScenes[story.slug];
  const c = useMemo(() => clock(timing), [timing]);

  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const tRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const resync = useRef(0);

  // Preferences and the ?t= start time (kept when switching language), read
  // after hydration: the server has neither localStorage nor the query.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setVoiceOn(readPref(VOICE_KEY));
      setCaptionsOn(readPref(CAPTIONS_KEY));
      const start = parseFloat(new URLSearchParams(window.location.search).get("t") ?? "");
      if (start > 0 && start < duration) {
        tRef.current = start;
        setT(start);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [duration]);

  const seek = (time: number) => {
    const v = Math.max(0, Math.min(duration, time));
    tRef.current = v;
    setT(v);
    const a = audioRef.current;
    if (a && Number.isFinite(a.duration)) a.currentTime = Math.min(v, a.duration);
  };

  // The clock.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const next = Math.min(duration, tRef.current + dt);
      tRef.current = next;
      setT(next);
      if (next >= duration) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration]);

  // The voice follows the clock.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const wanted = playing && voiceOn && !blocked && t < (Number.isFinite(a.duration) ? a.duration : duration);
    if (!wanted) {
      if (!a.paused) a.pause();
      return;
    }
    const now = performance.now();
    if (Math.abs(a.currentTime - t) > 0.3 && now - resync.current > 800) {
      a.currentTime = t;
      resync.current = now;
    }
    if (a.paused) {
      a.play().catch((err: DOMException) => {
        if (err.name === "NotAllowedError") setBlocked(true);
      });
    }
  }, [t, playing, voiceOn, blocked, duration]);

  // Pause when the tab is hidden: the clock stops, the audio would not.
  useEffect(() => {
    const onHide = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const play = () => {
    setStarted(true);
    setBlocked(false);
    if (tRef.current >= duration - 0.05) seek(0);
    setPlaying(true);
    // Safari only unlocks audio when play() runs inside the gesture.
    const a = audioRef.current;
    if (a && voiceOn) {
      a.currentTime = tRef.current;
      a.play().catch(() => {});
    }
  };
  const toggle = () => (playing ? setPlaying(false) : play());

  const setVoice = (on: boolean) => {
    setVoiceOn(on);
    setBlocked(false);
    writePref(VOICE_KEY, on);
    const a = audioRef.current;
    if (a && on && playing) {
      a.currentTime = tRef.current;
      a.play().catch(() => {});
    }
  };
  const setCaptions = (on: boolean) => {
    setCaptionsOn(on);
    writePref(CAPTIONS_KEY, on);
  };

  const scene = sceneAt(script, timing, t);
  const sceneIdx = script.scenes.indexOf(scene);
  const jump = (dir: number) => {
    const now = tRef.current;
    const idx = script.scenes.indexOf(sceneAt(script, timing, now));
    const back = dir < 0 && now - timing.scenes[script.scenes[idx].id].start > 2;
    const target = Math.max(0, Math.min(script.scenes.length - 1, back ? idx : idx + dir));
    setStarted(true);
    seek(timing.scenes[script.scenes[target].id].start);
  };

  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen?.();
  };

  // Keyboard shortcuts: subscribed once, always calling the latest handler.
  const onKey = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const el = e.target as HTMLElement;
    if (el.closest("input, textarea, select")) return;
    if (e.key === " " || e.key === "k") {
      if (el.closest("button, a, [role=slider]")) return; // the focused control handles it
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowRight") jump(1);
    else if (e.key === "ArrowLeft") jump(-1);
    else if (e.key === "v" || e.key === "V") setVoice(!voiceOn || blocked);
    else if (e.key === "c" || e.key === "C") setCaptions(!captionsOn);
    else if (e.key === "f" || e.key === "F") fullscreen();
  };
  const keyRef = useRef(onKey);
  useEffect(() => {
    keyRef.current = onKey;
  });
  useEffect(() => {
    const h = (e: KeyboardEvent) => keyRef.current(e);
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  // Scrubbing.
  const timeAt = (clientX: number) => {
    const r = trackRef.current!.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * duration;
  };
  const dragging = useRef<{ wasPlaying: boolean } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    dragging.current = { wasPlaying: playing };
    setPlaying(false);
    setStarted(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    seek(timeAt(e.clientX));
  };
  const onMove = (e: React.PointerEvent) => {
    const v = Math.max(0, Math.min(duration, timeAt(e.clientX)));
    setHover(v);
    if (dragging.current) seek(v);
  };
  const onUp = () => {
    if (dragging.current?.wasPlaying) play();
    dragging.current = null;
  };

  const cue = cueAt(script, timing, t);
  const ended = t >= c.at(script.cues[script.cues.length - 1].id);
  const other: Locale = locale === "fr" ? "en" : "fr";
  const base = `/${locale}/dossier/${story.slug}`;
  const minutes = Math.round(duration / 60);
  const p = t / duration;

  return (
    <div ref={rootRef} className="fixed inset-0 z-50 flex flex-col bg-paper paper-bg text-ink">
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b border-rule-2 px-4 py-2.5 sm:px-6">
        <Link href={base} className="rounded-full px-2 py-1 text-sm text-ink-2 hover:bg-paper-2">
          ← <span className="hidden sm:inline">{t$.story.back}</span>
        </Link>
        <div className="min-w-0 flex-1 text-center">
          <p className="smallcaps truncate text-xs font-semibold text-muted">
            {dossierTitle} · {t$.story.title}
          </p>
        </div>
        <div className="flex items-center gap-1" role="group" aria-label={t$.story.language}>
          {(["fr", "en"] as Locale[]).map((lng) =>
            lng === locale ? (
              <span key={lng} className="rounded-full bg-ink px-2.5 py-1 text-xs font-semibold uppercase text-paper">
                {lng}
              </span>
            ) : (
              <a key={lng} href={`/${other}/dossier/${story.slug}/histoire?t=${t.toFixed(1)}`} hrefLang={other} className="rounded-full px-2.5 py-1 text-xs font-semibold uppercase text-ink-2 hover:bg-paper-2">
                {lng}
              </a>
            ),
          )}
        </div>
      </header>

      {/* Stage */}
      <div className="flex min-h-0 flex-1 items-center justify-center px-3 pt-3 sm:px-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-rule bg-card shadow-[0_30px_80px_-50px_rgba(60,45,20,0.55)]" style={{ maxWidth: "min(100%, calc((100dvh - 210px) * 16 / 9))" }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full select-none" role="img" aria-label={`${dossierTitle} — ${scene.label[locale]}`}>
            <rect width={W} height={H} fill="var(--card)" />
            {Scenes && <Scenes t={t} locale={locale} c={c} />}
            <text x={40} y={52} fontSize={16} fontWeight={600} letterSpacing="0.16em" fill="var(--muted)">
              {`${String(sceneIdx + 1).padStart(2, "0")} · ${scene.label[locale].toUpperCase()}`}
            </text>
          </svg>

          {!started && (
            <button onClick={play} className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-paper/70 backdrop-blur-[2px] transition hover:bg-paper/60">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ink text-paper shadow-xl sm:h-24 sm:w-24">
                <svg width="34" height="34" viewBox="0 0 16 16" aria-hidden>
                  <path d="M4.5 2.5v11l9-5.5z" fill="currentColor" />
                </svg>
              </span>
              <span className="font-serif text-2xl font-semibold sm:text-3xl">{t$.story.launch}</span>
              <span className="text-sm text-muted">{t$.story.meta(minutes)}</span>
            </button>
          )}

          {ended && !playing && (
            <div className="absolute inset-x-0 bottom-[8%] flex flex-wrap justify-center gap-3 px-4">
              <Link href={base} className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper shadow-lg hover:bg-ink-2">
                {t$.story.explore} →
              </Link>
              <button onClick={() => { seek(0); play(); }} className="rounded-full border border-ink/20 bg-card px-6 py-3 text-sm font-medium text-ink hover:bg-paper-2">
                ↺ {t$.story.replay}
              </button>
            </div>
          )}

          {voiceOn && blocked && playing && (
            <button onClick={() => setVoice(true)} className="absolute right-3 top-3 rounded-full bg-accent px-4 py-2 text-sm font-medium text-paper shadow">
              {t$.story.voiceBlocked}
            </button>
          )}
        </div>
      </div>

      {/* Captions (also read by screen readers) */}
      <div className="flex min-h-[4.2rem] items-start justify-center px-4 pt-3 sm:min-h-[4.6rem]" aria-live="polite">
        {captionsOn && cue && started && (
          <p key={cue.id} className="max-w-4xl text-center font-serif text-base leading-snug text-ink sm:text-xl">
            {cue[locale]}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 px-3 pb-3 sm:gap-3 sm:px-6 sm:pb-4">
        <button onClick={toggle} aria-label={playing ? t$.story.pause : t$.story.play} className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink text-paper hover:bg-ink-2">
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
              <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <path d="M4.5 2.5v11l9-5.5z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button onClick={() => { seek(0); play(); }} aria-label={t$.story.restart} title={t$.story.restart} className="hidden h-9 w-9 flex-none items-center justify-center rounded-full text-ink-2 hover:bg-paper-2 sm:flex">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
            <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" />
          </svg>
        </button>
        <span className="w-[5.5rem] flex-none text-center font-mono text-xs text-muted tabular-nums">
          {fmt(t)} / {fmt(duration)}
        </span>
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label={t$.story.timeline}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(t)}
          aria-valuetext={`${fmt(t)} · ${scene.label[locale]}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={() => setHover(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.stopPropagation();
              e.preventDefault();
              seek(tRef.current + (e.key === "ArrowRight" ? 5 : -5));
              setStarted(true);
            }
          }}
          className="relative h-8 min-w-0 flex-1 cursor-pointer touch-none"
        >
          <div className="absolute inset-x-0 top-[15px] h-[3px] rounded-full bg-rule-2" />
          <div className="absolute left-0 top-[15px] h-[3px] rounded-full bg-accent" style={{ width: `${p * 100}%` }} />
          {script.scenes.slice(1).map((s) => (
            <div key={s.id} className="absolute top-[11px] h-[11px] w-[2px] -translate-x-1/2 rounded bg-ink/25" style={{ left: `${(timing.scenes[s.id].start / duration) * 100}%` }} />
          ))}
          <div className="absolute top-[10px] h-[13px] w-[13px] -translate-x-1/2 rounded-full border-2 border-card bg-accent shadow" style={{ left: `${p * 100}%` }} />
          {hover !== null && (
            <div className="pointer-events-none absolute bottom-8 -translate-x-1/2 whitespace-nowrap rounded-md border border-rule bg-card px-2 py-1 text-xs text-ink shadow" style={{ left: `${(hover / duration) * 100}%` }}>
              {fmt(hover)} · {sceneAt(script, timing, hover).label[locale]}
            </div>
          )}
        </div>
        <span className="hidden w-48 flex-none truncate text-xs font-semibold uppercase tracking-wider text-muted lg:block">{scene.label[locale]}</span>
        <button onClick={() => setVoice(!voiceOn || blocked)} aria-pressed={voiceOn && !blocked} aria-label={t$.story.voice} title={`${t$.story.voice} (V) · ${t$.story.voiceCredit}`} className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-ink-2 hover:bg-paper-2">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2.5 6v4h2.6L8.5 13V3L5.1 6z" />
            {voiceOn && !blocked ? <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.6a6 6 0 0 1 0 8.8" /> : <path d="M11 6l3.5 4M14.5 6L11 10" />}
          </svg>
        </button>
        <button onClick={() => setCaptions(!captionsOn)} aria-pressed={captionsOn} aria-label={t$.story.captions} title={`${t$.story.captions} (C)`} className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-[11px] font-bold hover:bg-paper-2 ${captionsOn ? "text-ink" : "text-muted line-through"}`}>
          CC
        </button>
        <button onClick={fullscreen} aria-label={t$.story.fullscreen} title={`${t$.story.fullscreen} (F)`} className="hidden h-9 w-9 flex-none items-center justify-center rounded-full text-ink-2 hover:bg-paper-2 sm:flex">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
            <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
          </svg>
        </button>
      </div>
      <p className="sr-only">{t$.story.shortcuts}</p>
      <audio ref={audioRef} src={storyAudio(story.slug, locale)} preload="auto" onError={() => setVoiceOn(false)} />
    </div>
  );
}
