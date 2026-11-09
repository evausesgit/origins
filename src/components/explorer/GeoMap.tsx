"use client";

import { geoConicConformal, geoPath } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
import { useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";
import type { GraphIndex } from "@/data";
import type { Locale, SpreadLinkKind } from "@/data/types";
import { getDictionary } from "@/lib/i18n";
import { YearSlider, useYearPlayer } from "./Timeline";

const W = 900;
const H = 760;

const linkStyle: Record<SpreadLinkKind, { stroke: string; dash?: string; width: number }> = {
  documented: { stroke: "var(--ink)", width: 2.2 },
  proposed: { stroke: "var(--accent)", width: 1.6 },
  similarity: { stroke: "var(--muted)", dash: "2 5", width: 1.4 },
};

const placeShort = (name: string) => name.split(" (")[0];

export function GeoMap({ index, locale, onSelect, selectedId }: { index: GraphIndex; locale: Locale; onSelect: (id: string) => void; selectedId?: string }) {
  const t = getDictionary(locale);
  const [land, setLand] = useState<FeatureCollection<Geometry> | null>(null);
  const player = useYearPlayer(index.dossier.timeline);
  const { year } = player;

  useEffect(() => {
    let alive = true;
    // Loaded on demand: the basemap is only needed for this view.
    import("world-atlas/countries-50m.json").then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const topo = (mod as any).default ?? mod;
      const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry>;
      if (alive) setLand(fc);
    });
    return () => {
      alive = false;
    };
  }, []);

  // One point per place (earliest event wins); sub-events of an event are folded into it.
  const points = useMemo(() => {
    const seen = new Set<string>();
    return index.dossier.nodes
      .filter((n) => n.kind === "event" && n.place && n.date && index.byId.get(n.parent ?? "")?.kind !== "event")
      .sort((a, b) => a.date!.year - b.date!.year)
      .filter((n) => {
        const key = n.place!.name.en;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [index]);
  const placeless = index.dossier.nodes.filter((n) => n.kind === "event" && !n.place && n.date);

  // Frame the dossier's places, with a margin so that labels and context fit.
  const projection = useMemo(() => {
    const lons = points.map((p) => p.place!.lon);
    const lats = points.map((p) => p.place!.lat);
    const [minLon, maxLon, minLat, maxLat] = [Math.min(...lons), Math.max(...lons), Math.min(...lats), Math.max(...lats)];
    const padLon = Math.max(3, (maxLon - minLon) * 0.18);
    const padLat = Math.max(2, (maxLat - minLat) * 0.18);
    return geoConicConformal()
      .parallels([minLat, maxLat + 0.01])
      .rotate([-(minLon + maxLon) / 2, 0])
      .fitExtent(
        [
          [20, 20],
          [W - 20, H - 20],
        ],
        {
          type: "MultiPoint",
          coordinates: [
            [minLon - padLon, minLat - padLat],
            [maxLon + padLon, minLat - padLat],
            [minLon - padLon, maxLat + padLat],
            [maxLon + padLon, maxLat + padLat],
          ],
        },
      );
  }, [points]);
  const path = useMemo(() => geoPath(projection), [projection]);

  const xy = (id: string) => {
    const n = index.byId.get(id);
    if (!n?.place) return null;
    return projection([n.place.lon, n.place.lat]);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-5 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="font-serif text-2xl font-semibold text-ink">{t.geo.title}</h2>
        <p className="mt-1 max-w-3xl text-sm text-muted">{t.geo.hint}</p>
        <div className="mt-4">
          <YearSlider {...player} locale={locale} />
        </div>

        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_15rem]">
          <figure className="overflow-hidden rounded-2xl border border-rule bg-[#f1ebdd]">
            <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={t.geo.title}>
              <defs>
                <marker id="arrow-proposed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
                </marker>
              </defs>
              <rect width={W} height={H} fill="#e9e3d4" />
              {land?.features.map((f, i) => (
                <path key={i} d={path(f) ?? ""} fill="#fbf8f0" stroke="#d3c9b2" strokeWidth={0.7} />
              ))}

              {index.dossier.spread.map((s, i) => {
                const a = xy(s.from);
                const b = xy(s.to);
                const to = index.byId.get(s.to)!;
                if (!a || !b) return null;
                const shown = to.date!.year <= year;
                const mx = (a[0] + b[0]) / 2;
                const my = (a[1] + b[1]) / 2;
                const dx = b[0] - a[0];
                const dy = b[1] - a[1];
                const curve = 0.18;
                const cx = mx - dy * curve;
                const cy = my + dx * curve;
                const st = linkStyle[s.kind];
                return (
                  <path
                    key={i}
                    d={`M${a[0]},${a[1]} Q${cx},${cy} ${b[0]},${b[1]}`}
                    fill="none"
                    stroke={st.stroke}
                    strokeWidth={st.width}
                    strokeDasharray={st.dash}
                    strokeLinecap="round"
                    markerEnd={s.kind === "proposed" ? "url(#arrow-proposed)" : undefined}
                    style={{ opacity: shown ? 0.9 : 0, transition: "opacity 600ms" }}
                  >
                    <title>{`${t.spread[s.kind]} — ${s.note[locale]}`}</title>
                  </path>
                );
              })}

              {points.map((n) => {
                const p = xy(n.id);
                if (!p) return null;
                const shown = n.date!.year <= year;
                const sel = selectedId === n.id;
                const label = `${placeShort(n.place!.name[locale])} ${n.date!.year}`;
                const left = p[0] > W - 160;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${p[0]},${p[1]})`}
                    style={{ opacity: shown ? 1 : 0, transition: "opacity 500ms", cursor: "pointer" }}
                    onClick={() => onSelect(n.id)}
                    role="button"
                    tabIndex={shown ? 0 : -1}
                    aria-label={label}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") onSelect(n.id);
                    }}
                  >
                    <circle r={sel ? 9 : 6.5} fill="var(--k-event)" stroke="#fffdf8" strokeWidth={2} />
                    <text
                      x={left ? -12 : 12}
                      y={4}
                      textAnchor={left ? "end" : "start"}
                      className="font-serif"
                      fontSize={19}
                      fill="var(--ink)"
                      paintOrder="stroke"
                      stroke="#fbf8f0"
                      strokeWidth={4}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </figure>

          <aside className="space-y-4 text-sm">
            <ul className="space-y-2.5">
              {(["documented", "proposed", "similarity"] as SpreadLinkKind[]).map((k) => {
                const count = index.dossier.spread.filter((s) => s.kind === k).length;
                return (
                  <li key={k} className="flex items-center gap-3">
                    <svg width="38" height="10" aria-hidden>
                      <line x1="2" y1="5" x2="36" y2="5" stroke={linkStyle[k].stroke} strokeWidth={linkStyle[k].width} strokeDasharray={linkStyle[k].dash} strokeLinecap="round" />
                    </svg>
                    <span className="text-ink-2">
                      {t.spread[k]} <span className="text-muted">({count})</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <ul className="space-y-2 border-t border-rule-2 pt-3">
              {index.dossier.spread.map((s, i) => (
                <li key={i} className="text-xs text-ink-2">
                  <span className="font-medium text-ink">
                    {placeShort(index.byId.get(s.from)!.place!.name[locale])} → {placeShort(index.byId.get(s.to)!.place!.name[locale])}
                  </span>
                  <br />
                  {s.note[locale]}
                </li>
              ))}
            </ul>
            {placeless.length > 0 && (
              <div className="border-t border-rule-2 pt-3 text-xs text-muted">
                {t.geo.noPlace}{" "}
                {placeless.map((n, i) => (
                  <span key={n.id}>
                    {i > 0 && ", "}
                    <button className="underline hover:text-ink" onClick={() => onSelect(n.id)}>
                      {n.title[locale]}
                    </button>
                  </span>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
