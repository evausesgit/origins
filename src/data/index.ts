import { norwich1144 } from "./dossiers/norwich-1144";
import type { Dossier, GraphNode, Locale, Relation, Source } from "./types";

export * from "./types";

export const dossiers: Dossier[] = [norwich1144];

export function getDossier(slug: string): Dossier | undefined {
  return dossiers.find((d) => d.slug === slug);
}

export function tr<T extends Record<Locale, string>>(value: T | undefined, locale: Locale): string {
  return value ? value[locale] : "";
}

/** Precomputed lookups for one dossier. Pure: safe on server and client. */
export interface GraphIndex {
  dossier: Dossier;
  byId: Map<string, GraphNode>;
  children: Map<string, GraphNode[]>;
  sources: Map<string, Source>;
  relationsOf: Map<string, Relation[]>;
}

const cache = new WeakMap<Dossier, GraphIndex>();

export function indexDossier(dossier: Dossier): GraphIndex {
  const hit = cache.get(dossier);
  if (hit) return hit;
  const byId = new Map(dossier.nodes.map((n) => [n.id, n]));
  const children = new Map<string, GraphNode[]>();
  for (const node of dossier.nodes) {
    if (!node.parent) continue;
    const list = children.get(node.parent) ?? [];
    list.push(node);
    children.set(node.parent, list);
  }
  const relationsOf = new Map<string, Relation[]>();
  for (const r of dossier.relations) {
    for (const id of [r.from, r.to]) {
      const list = relationsOf.get(id) ?? [];
      list.push(r);
      relationsOf.set(id, list);
    }
  }
  const index: GraphIndex = {
    dossier,
    byId,
    children,
    sources: new Map(dossier.sources.map((s) => [s.id, s])),
    relationsOf,
  };
  cache.set(dossier, index);
  return index;
}

/** Path from the root to `id`, inclusive. */
export function ancestry(index: GraphIndex, id: string): GraphNode[] {
  const path: GraphNode[] = [];
  let current = index.byId.get(id);
  while (current) {
    path.unshift(current);
    current = current.parent ? index.byId.get(current.parent) : undefined;
  }
  return path;
}

export function depthOf(index: GraphIndex, id: string): number {
  return ancestry(index, id).length - 1;
}

/** Nodes of the tree that reference a given library source. */
export function nodesForSource(index: GraphIndex, sourceId: string): GraphNode[] {
  return index.dossier.nodes.filter((n) => n.sourceId === sourceId);
}

/** Claims a source is tied to, through evidence nodes or relations. */
export function claimsForSource(index: GraphIndex, sourceId: string): GraphNode[] {
  const ids = new Set<string>();
  for (const n of index.dossier.nodes) {
    if (n.sourceId === sourceId && n.kind === "evidence" && n.parent) ids.add(n.parent);
  }
  for (const r of index.dossier.relations) {
    if (!r.sourceIds.includes(sourceId)) continue;
    for (const id of [r.from, r.to]) if (index.byId.get(id)?.kind === "claim") ids.add(id);
  }
  return [...ids].map((id) => index.byId.get(id)!).filter(Boolean);
}

/** Full derivation chain of a source (what it depends on, recursively). */
export function sourceLineage(index: GraphIndex, sourceId: string, seen = new Set<string>()): Source[] {
  const src = index.sources.get(sourceId);
  if (!src || seen.has(sourceId)) return [];
  seen.add(sourceId);
  return (src.derivedFrom ?? []).flatMap((id) => {
    const parent = index.sources.get(id);
    return parent ? [parent, ...sourceLineage(index, id, seen)] : [];
  });
}

/** Sources that derive (directly) from this one. */
export function sourceDescendants(index: GraphIndex, sourceId: string): Source[] {
  return index.dossier.sources.filter((s) => s.derivedFrom?.includes(sourceId));
}

/** Strip accents and case for search. */
export function normalize(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}
