"use client";

import { geoConicConformal, geoPath } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
import { memo, useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";
import { H, W } from "./kit";

/** A fixed projection of western Europe on the stage; zooms are SVG transforms. */
export interface Basemap {
  paths: string[];
  project: (lon: number, lat: number) => [number, number];
}

export function useBasemap(frame: { lon: [number, number]; lat: [number, number] }): Basemap | null {
  const [land, setLand] = useState<FeatureCollection<Geometry> | null>(null);
  useEffect(() => {
    let alive = true;
    import("world-atlas/countries-50m.json").then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const topo = (mod as any).default ?? mod;
      if (alive) setLand(feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry>);
    });
    return () => {
      alive = false;
    };
  }, []);

  const [lon0, lon1] = frame.lon;
  const [lat0, lat1] = frame.lat;
  return useMemo(() => {
    if (!land) return null;
    const box: FeatureCollection<Geometry> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: { type: "MultiPoint", coordinates: [[lon0, lat0], [lon1, lat0], [lon0, lat1], [lon1, lat1], [(lon0 + lon1) / 2, lat1], [(lon0 + lon1) / 2, lat0]] },
        },
      ],
    };
    const projection = geoConicConformal()
      .parallels([lat0, lat1])
      .rotate([-(lon0 + lon1) / 2, 0])
      .fitExtent([[0, 0], [W, H]], box)
      .clipExtent([[-W, -H], [2 * W, 2 * H]]);
    const path = geoPath(projection);
    const paths = land.features.map((f) => path(f) ?? "").filter(Boolean);
    return { paths, project: (lon: number, lat: number) => projection([lon, lat]) as [number, number] };
  }, [land, lon0, lon1, lat0, lat1]);
}

/** The land masses, memoised: re-rendered only when the map itself changes. */
export const Land = memo(function Land({ paths }: { paths: string[] }) {
  return (
    <g>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="var(--paper-2)" stroke="#cfc4ab" strokeWidth={1} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      ))}
    </g>
  );
});
