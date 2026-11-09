import type { Locale, Status } from "@/data/types";
import { getDictionary } from "@/lib/i18n";
import { statusColor } from "@/lib/theme";

/**
 * Status glyph: the fill tells the story without relying on colour alone
 * (full = established … hollow = not demonstrated, crossed = contradicted/refuted, dashed = undetermined).
 */
export function StatusGlyph({ status, size = 12 }: { status: Status; size?: number }) {
  const c = statusColor(status);
  const r = 5;
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden className="shrink-0">
      {status === "established" && <circle cx="6" cy="6" r={r} fill={c} />}
      {status === "strong" && (
        <>
          <circle cx="6" cy="6" r={r} fill="none" stroke={c} strokeWidth="1.4" />
          <path d="M6 1 A5 5 0 1 1 1.67 8.5 L6 6 Z" fill={c} />
        </>
      )}
      {status === "plausible" && (
        <>
          <circle cx="6" cy="6" r={r} fill="none" stroke={c} strokeWidth="1.4" />
          <path d="M6 1 A5 5 0 0 1 6 11 Z" fill={c} />
        </>
      )}
      {status === "not_demonstrated" && <circle cx="6" cy="6" r={r} fill="none" stroke={c} strokeWidth="1.4" />}
      {status === "contradicted" && (
        <>
          <circle cx="6" cy="6" r={r} fill="none" stroke={c} strokeWidth="1.4" />
          <path d="M3.5 3.5 L8.5 8.5" stroke={c} strokeWidth="1.4" />
        </>
      )}
      {status === "refuted" && (
        <>
          <circle cx="6" cy="6" r={r} fill={c} />
          <path d="M3.8 3.8 L8.2 8.2 M8.2 3.8 L3.8 8.2" stroke="#fffdf8" strokeWidth="1.4" />
        </>
      )}
      {status === "undetermined" && (
        <circle cx="6" cy="6" r={r} fill="none" stroke={c} strokeWidth="1.4" strokeDasharray="2 1.6" />
      )}
    </svg>
  );
}

export function StatusBadge({ status, locale, size = "md" }: { status: Status; locale: Locale; size?: "sm" | "md" | "lg" }) {
  const t = getDictionary(locale);
  const cls =
    size === "lg" ? "text-sm px-3 py-1 gap-2" : size === "sm" ? "text-[0.68rem] px-2 py-0.5 gap-1" : "text-xs px-2.5 py-0.5 gap-1.5";
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium whitespace-nowrap ${cls}`}
      style={{ color: statusColor(status), borderColor: `color-mix(in srgb, ${statusColor(status)} 35%, transparent)`, background: `color-mix(in srgb, ${statusColor(status)} 7%, var(--card))` }}
      title={t.statusHelp[status]}
    >
      <StatusGlyph status={status} size={size === "lg" ? 13 : 11} />
      {t.status[status]}
    </span>
  );
}
