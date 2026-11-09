/**
 * Shared SVG pieces for animated stories. Every piece is drawn from the
 * current time `t`, never from internal state, so the story stays scrub-safe.
 * Stage coordinates: 1600 × 900.
 */
import type { ReactNode } from "react";
import type { Status } from "@/data/types";
import { easeBack, easeOut, prog, wrap } from "@/lib/story";
import { statusColor } from "@/lib/theme";

export const W = 1600;
export const H = 900;

/** Fades (and lifts) its children in at `at`, and out at `until` if given. */
export function Appear({
  t,
  at,
  until,
  dur = 0.7,
  dy = 14,
  children,
}: {
  t: number;
  at: number;
  until?: number;
  dur?: number;
  dy?: number;
  children: ReactNode;
}) {
  const pin = easeOut(prog(t, at, dur));
  const pout = until === undefined ? 0 : easeOut(prog(t, until, dur * 0.8));
  const o = pin * (1 - pout);
  if (o <= 0.001) return null;
  return (
    <g opacity={o} transform={`translate(0 ${(1 - pin) * dy - pout * dy * 0.5})`}>
      {children}
    </g>
  );
}

/** Several lines of SVG text. */
export function Lines({
  lines,
  x,
  y,
  size,
  lh = 1.3,
  anchor = "start",
  className,
  fill = "var(--ink)",
  weight,
  italic,
}: {
  lines: string[];
  x: number;
  y: number;
  size: number;
  lh?: number;
  anchor?: "start" | "middle" | "end";
  className?: string;
  fill?: string;
  weight?: number;
  italic?: boolean;
}) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} className={className} fill={fill} fontWeight={weight} fontStyle={italic ? "italic" : undefined}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : size * lh}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

/** Small-caps label, the dossier's "kicker" style. */
export function Kicker({ x, y, text, anchor = "start", fill = "var(--muted)", size = 17 }: { x: number; y: number; text: string; anchor?: "start" | "middle" | "end"; fill?: string; size?: number }) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} fill={fill} fontWeight={600} letterSpacing="0.14em">
      {text.toUpperCase()}
    </text>
  );
}

/** Line breaks and baselines of a card, relative to its top. */
function cardLayout(title: string, body: string | undefined, w: number, hasKicker: boolean) {
  const tl = wrap(title, Math.floor(w / 15.5));
  const bl = body ? wrap(body, Math.floor(w / 10.6)) : [];
  const titleY = hasKicker ? 80 : 50;
  const bodyY = titleY + (tl.length - 1) * 34 + 38;
  const h = (bl.length ? bodyY + (bl.length - 1) * 26 : titleY + (tl.length - 1) * 34) + 26;
  return { tl, bl, titleY, bodyY, h };
}

export const cardHeight = (title: string, body: string | undefined, w: number, hasKicker: boolean) => cardLayout(title, body, w, hasKicker).h;

export function Card({
  x,
  y,
  w,
  kicker,
  title,
  body,
  accent = "var(--rule)",
  kickerFill,
}: {
  x: number;
  y: number;
  w: number;
  kicker?: string;
  title: string;
  body?: string;
  accent?: string;
  kickerFill?: string;
}) {
  const { tl, bl, titleY, bodyY, h } = cardLayout(title, body, w, !!kicker);
  return (
    <g>
      <rect x={x + 3} y={y + 5} width={w} height={h} rx={14} fill="rgba(60,45,20,0.07)" />
      <rect x={x} y={y} width={w} height={h} rx={14} fill="var(--card)" stroke="var(--rule)" />
      <rect x={x} y={y + 14} width={4} height={h - 28} rx={2} fill={accent} />
      {kicker && <Kicker x={x + 24} y={y + 40} text={kicker} fill={kickerFill} size={15} />}
      <Lines lines={tl} x={x + 24} y={y + titleY} size={27} lh={1.26} className="font-serif" weight={600} />
      {bl.length > 0 && <Lines lines={bl} x={x + 24} y={y + bodyY} size={19} lh={1.37} fill="var(--ink-2)" />}
    </g>
  );
}

/** An assessment stamp landing on the page, in the colour of its status. */
export function Stamp({
  t,
  at,
  x,
  y,
  status,
  label,
  size = 1,
  rotate = -5,
}: {
  t: number;
  at: number;
  x: number;
  y: number;
  status: Status;
  label: string;
  size?: number;
  rotate?: number;
}) {
  const p = prog(t, at, 0.45);
  if (p <= 0) return null;
  const s = (1.9 - 0.9 * easeBack(p)) * size;
  const color = statusColor(status);
  const fs = 22;
  const w = label.length * fs * 0.68 + 44;
  const h = 50;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`} opacity={Math.min(1, p * 2.2)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill="var(--card)" fillOpacity={0.85} stroke={color} strokeWidth={3} />
      <rect x={-w / 2 + 6} y={-h / 2 + 6} width={w - 12} height={h - 12} rx={5} fill="none" stroke={color} strokeWidth={1.2} />
      <text y={8} textAnchor="middle" fontSize={fs} fontWeight={700} letterSpacing="0.12em" fill={color}>
        {label.toUpperCase()}
      </text>
    </g>
  );
}

/** A line drawn progressively from (x1,y1) to (x2,y2). */
export function DrawLine({
  t,
  at,
  dur = 0.8,
  x1,
  y1,
  x2,
  y2,
  stroke = "var(--rule)",
  width = 2,
  dash,
}: {
  t: number;
  at: number;
  dur?: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
  width?: number;
  dash?: string;
}) {
  const p = easeOut(prog(t, at, dur));
  if (p <= 0) return null;
  return <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={stroke} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" />;
}

/** A stylised manuscript page whose ruled lines are written progressively. */
export function Manuscript({ t, at, x, y, w, h, title, dur = 2.4 }: { t: number; at: number; x: number; y: number; w: number; h: number; title?: string; dur?: number }) {
  const rows = Math.floor((h - 150) / 22);
  const written = prog(t, at + 0.3, dur) * rows;
  return (
    <g>
      <rect x={x + 6} y={y + 8} width={w} height={h} rx={6} fill="rgba(60,45,20,0.10)" />
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#f3e7c9" stroke="#c9b48a" />
      <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} rx={3} fill="none" stroke="#d8c59c" />
      {title && (
        <text x={x + w / 2} y={y + 52} textAnchor="middle" fontSize={15} fontStyle="italic" className="font-serif" fill="#7a5a33">
          {title}
        </text>
      )}
      {/* rubricated initial */}
      <rect x={x + 30} y={y + 72} width={48} height={52} rx={3} fill="var(--accent)" opacity={0.88} />
      <text x={x + 54} y={y + 111} textAnchor="middle" fontSize={40} className="font-serif" fill="#f3e7c9" fontWeight={700}>
        W
      </text>
      {Array.from({ length: rows }, (_, i) => {
        const fill = Math.max(0, Math.min(1, written - i));
        if (fill <= 0) return null;
        const indent = i < 3 ? 64 : 0;
        const full = w - 60 - indent - (i % 5 === 4 ? 70 : (i * 37) % 23);
        return <line key={i} x1={x + 30 + indent} x2={x + 30 + indent + full * fill} y1={y + 84 + i * 22} y2={y + 84 + i * 22} stroke="#6b5434" strokeOpacity={0.55} strokeWidth={3} strokeLinecap="round" />;
      })}
    </g>
  );
}

/** A pulsing location dot. */
export function Pin({ x, y, t, color = "var(--accent)", r = 9, pulse = true }: { x: number; y: number; t: number; color?: string; r?: number; pulse?: boolean }) {
  const ph = (t % 2) / 2;
  return (
    <g>
      {pulse && <circle cx={x} cy={y} r={r + ph * 26} fill="none" stroke={color} strokeOpacity={0.5 * (1 - ph)} strokeWidth={2} />}
      <circle cx={x} cy={y} r={r} fill={color} stroke="var(--card)" strokeWidth={3} />
    </g>
  );
}
