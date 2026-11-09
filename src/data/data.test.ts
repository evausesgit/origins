import { describe, expect, it } from "vitest";
import { ancestry, dossiers, indexDossier, sourceLineage } from "@/data";
import { LOCALES, RELATION_TYPES, STATUSES, type L } from "@/data/types";
import { dictionaries } from "@/lib/i18n";
import { CARD_HEIGHT, CARD_WIDTH, computeLayout, visibleIds } from "@/lib/layout";

const isL = (v: unknown): v is L => typeof v === "object" && v !== null && LOCALES.every((l) => typeof (v as L)[l] === "string");

/** Walks any value and returns the paths of localized strings with an empty locale. */
function emptyLocales(value: unknown, path = "", out: string[] = []): string[] {
  if (isL(value)) {
    for (const l of LOCALES) if (!value[l].trim()) out.push(`${path}.${l}`);
  } else if (Array.isArray(value)) value.forEach((v, i) => emptyLocales(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) emptyLocales(v, `${path}.${k}`, out);
  return out;
}

describe.each(dossiers.map((d) => [d.slug, d] as const))("dossier %s", (_slug, d) => {
  const index = indexDossier(d);

  it("has unique ids", () => {
    expect(new Set(d.nodes.map((n) => n.id)).size).toBe(d.nodes.length);
    expect(new Set(d.sources.map((s) => s.id)).size).toBe(d.sources.length);
  });

  it("forms a single tree rooted at rootId", () => {
    const roots = d.nodes.filter((n) => !n.parent);
    expect(roots.map((r) => r.id)).toEqual([d.rootId]);
    for (const n of d.nodes) {
      if (n.parent) expect(index.byId.has(n.parent), `${n.id} → missing parent ${n.parent}`).toBe(true);
      expect(ancestry(index, n.id)[0].id).toBe(d.rootId); // reaches the root, so no cycles
    }
  });

  it("has 5 to 7 main branches", () => {
    const branches = index.children.get(d.rootId) ?? [];
    expect(branches.length).toBeGreaterThanOrEqual(5);
    expect(branches.length).toBeLessThanOrEqual(7);
  });

  it("is fully bilingual", () => {
    expect(emptyLocales(d)).toEqual([]);
  });

  it("references only existing nodes and sources", () => {
    for (const n of d.nodes) if (n.sourceId) expect(index.sources.has(n.sourceId), `${n.id} → ${n.sourceId}`).toBe(true);
    for (const r of d.relations) {
      expect(index.byId.has(r.from), `${r.id} from ${r.from}`).toBe(true);
      expect(index.byId.has(r.to), `${r.id} to ${r.to}`).toBe(true);
      expect(RELATION_TYPES).toContain(r.type);
      for (const s of r.sourceIds) expect(index.sources.has(s), `${r.id} → source ${s}`).toBe(true);
    }
    for (const s of d.sources) for (const p of s.derivedFrom ?? []) expect(index.sources.has(p), `${s.id} → ${p}`).toBe(true);
    for (const s of d.spread) {
      expect(index.byId.get(s.from)?.place, s.from).toBeTruthy();
      expect(index.byId.get(s.to)?.place, s.to).toBeTruthy();
    }
    for (const step of d.narration) expect(index.byId.has(step.focus)).toBe(true);
  });

  it("justifies every relation with at least one source", () => {
    for (const r of d.relations) expect(r.sourceIds.length, r.id).toBeGreaterThan(0);
  });

  it("assesses every claim, with consistent status and history", () => {
    for (const n of d.nodes.filter((x) => x.kind === "claim")) {
      expect(n.assessment, n.id).toBeDefined();
      expect(n.status).toBe(n.assessment!.status);
      expect(STATUSES).toContain(n.status);
      expect(n.assessment!.history.at(-1)!.status).toBe(n.status);
      expect(n.assessment!.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("never calls something refuted without positive contrary evidence", () => {
    for (const n of d.nodes.filter((x) => x.status === "refuted" && x.assessment)) {
      expect(n.assessment!.contrary.length, n.id).toBeGreaterThan(0);
    }
  });

  it("reads every piece of evidence at levels A, B and C, from a known source", () => {
    for (const n of d.nodes.filter((x) => x.kind === "evidence")) {
      expect(n.reading, n.id).toBeDefined();
      expect(n.sourceId, n.id).toBeDefined();
    }
  });

  it("only links to verified-or-partly-verified sources and never shows unverified quotes", () => {
    for (const s of d.sources) {
      if (s.url) expect(s.verification.status, s.id).not.toBe("to_verify");
      if (s.url) expect(s.url).toMatch(/^https:\/\//);
      if (s.quote) expect(s.verification.status, `${s.id} has a quote`).toBe("verified");
    }
  });

  it("does not claim a documented transmission without a source", () => {
    for (const s of d.spread) {
      expect(s.sourceIds.length).toBeGreaterThan(0);
      if (s.kind === "documented") expect(s.sourceIds.some((id) => index.sources.get(id)?.nature === "primary")).toBe(true);
    }
  });

  it("has acyclic source dependencies", () => {
    for (const s of d.sources) expect(sourceLineage(index, s.id).map((x) => x.id)).not.toContain(s.id);
  });

  it("dates events used by the timeline and map", () => {
    for (const n of d.nodes.filter((x) => x.kind === "event")) expect(n.date, n.id).toBeDefined();
  });

  it("lays out every node and only reveals one path at a time", () => {
    const layout = computeLayout(index);
    expect(layout.size).toBe(d.nodes.length);
    for (const p of layout.values()) expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
    const atRoot = visibleIds(index, d.rootId);
    expect(atRoot.size).toBe(1 + (index.children.get(d.rootId)?.length ?? 0));
    // Whatever the focus, no two visible cards overlap.
    const overlaps: string[] = [];
    for (const focus of d.nodes) {
      const vis = [...visibleIds(index, focus.id)].map((id) => layout.get(id)!);
      for (let i = 0; i < vis.length; i++)
        for (let j = i + 1; j < vis.length; j++) {
          const a = vis[i], b = vis[j];
          const dx = Math.abs(a.x - b.x) - (CARD_WIDTH * (a.scale + b.scale)) / 2;
          const dy = Math.abs(a.y - b.y) - (CARD_HEIGHT * (a.scale + b.scale)) / 2;
          if (dx < 0 && dy < 0) overlaps.push(`${focus.id}: ${a.id} × ${b.id}`);
        }
    }
    expect([...new Set(overlaps)]).toEqual([]);
  });
});

describe("dictionaries", () => {
  it("have the same keys in every locale", () => {
    const keys = (o: object, p = ""): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
    expect(keys(dictionaries.en).sort()).toEqual(keys(dictionaries.fr).sort());
    expect(dictionaries.en.method.rules.length).toBe(dictionaries.fr.method.rules.length);
  });
});
