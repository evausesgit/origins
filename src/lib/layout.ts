import type { GraphIndex } from "@/data";
import type { GraphNode } from "@/data/types";

/**
 * "Fractal" radial layout.
 *
 * Every node gets a fixed position (the map never reshuffles, like a real map).
 * Each depth is drawn smaller than the previous one, so zooming in on a node
 * is literally descending one level: its children become readable only when
 * the camera gets close, which keeps the screen uncluttered at every scale.
 */

export const CARD_WIDTH = 250;
export const CARD_HEIGHT = 112; // estimate, used for camera bounds only

const SCALE = [1.6, 1, 0.4, 0.17, 0.075, 0.033];
/** First ring is an ellipse: screens are wider than tall. */
const RING = { rx: 590, ry: 410 };
const BASE_RADIUS = [0, 178, 54, 23, 10];

export function scaleForDepth(depth: number): number {
  return SCALE[Math.min(depth, SCALE.length - 1)];
}

export interface LayoutNode {
  id: string;
  /** Estimated card height in world units (already multiplied by `scale`). */
  h: number;
  x: number; // centre
  y: number; // centre
  depth: number;
  scale: number;
  angle: number; // outward direction from its parent
}

/**
 * Rough height of a card at scale 1, from its text (mirrors MindNode's typography:
 * 16px base, title 1.42em root / 1.22em branch / 1.04em otherwise, short 0.8em).
 */
export function estimateHeight(node: GraphNode, depth: number, hasKids: boolean): number {
  const [titleSize, charsPerLine] = depth === 0 ? [22.7, 17] : depth === 1 ? [19.5, 21] : [16.6, 25];
  const titleLines = Math.ceil(node.title.en.length / charsPerLine);
  const shortLines = node.short ? Math.ceil(node.short.en.length / 33) : 0;
  return (
    (depth === 0 ? 34 : 25) + // padding
    16 + // kind label
    titleLines * titleSize * 1.22 +
    (shortLines ? shortLines * 17 + 6 : 0) +
    (node.status || hasKids ? 24 : 0)
  );
}

export function computeLayout(index: GraphIndex): Map<string, LayoutNode> {
  const out = new Map<string, LayoutNode>();
  const rootId = index.dossier.rootId;
  const heightOf = (id: string, depth: number, scale: number) =>
    estimateHeight(index.byId.get(id)!, depth, (index.children.get(id)?.length ?? 0) > 0) * scale;
  const rootH = heightOf(rootId, 0, SCALE[0]);
  out.set(rootId, { id: rootId, x: 0, y: 0, depth: 0, scale: SCALE[0], angle: -Math.PI / 2, h: rootH });
  // A tall central question pushes the ring of branches outwards.
  const ry = Math.max(RING.ry, rootH / 2 + 290);
  const rx = Math.max(RING.rx, ry * 1.44);

  const visit = (parentId: string) => {
    const parent = out.get(parentId)!;
    const kids = index.children.get(parentId) ?? [];
    const n = kids.length;
    if (n === 0) return;
    const d = parent.depth;
    const childScale = scaleForDepth(d + 1);
    const needed = n * CARD_WIDTH * childScale * 1.35; // arc length so that cards do not touch

    kids.forEach((kid, i) => {
      let a: number, x: number, y: number;
      if (d === 0) {
        // Branches evenly around an ellipse, first one at the top.
        a = -Math.PI / 2 + (2 * Math.PI * i) / n;
        x = rx * Math.cos(a);
        y = ry * Math.sin(a);
      } else {
        // Children fan out around their parent, leaving a gap towards the grandparent.
        const maxArc = d === 1 ? 1.75 * Math.PI : 0.8 * Math.PI;
        const ringRadius = Math.max(BASE_RADIUS[Math.min(d, BASE_RADIUS.length - 1)], needed / maxArc);
        const arc = d === 1 ? maxArc : Math.min(maxArc, Math.max(needed / ringRadius, n * 0.22 * Math.PI));
        a = n === 1 ? parent.angle : d === 1 ? parent.angle - arc / 2 + (arc * (i + 0.5)) / n : parent.angle - arc / 2 + (arc * i) / (n - 1);
        // Cards are wide rectangles: keep clear of the parent's card in every direction.
        const childH = heightOf(kid.id, d + 1, childScale);
        const clear = halfExtent(parent.scale, parent.h, a) + halfExtent(childScale, childH, a) + 14 * childScale;
        const radius = Math.max(ringRadius, clear);
        x = parent.x + radius * Math.cos(a);
        y = parent.y + radius * Math.sin(a);
      }
      out.set(kid.id, { id: kid.id, x, y, depth: d + 1, scale: childScale, angle: a, h: heightOf(kid.id, d + 1, childScale) });
      visit(kid.id);
    });
  };
  visit(rootId);
  return out;
}

/** Distance from a card's centre to its edge in direction `a`. */
function halfExtent(scale: number, h: number, a: number): number {
  const hw = (CARD_WIDTH * scale) / 2;
  const hh = h / 2;
  const c = Math.abs(Math.cos(a));
  const s = Math.abs(Math.sin(a));
  return Math.min(c > 1e-6 ? hw / c : Infinity, s > 1e-6 ? hh / s : Infinity);
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function boundsOf(nodes: LayoutNode[]): Bounds {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    const hw = (CARD_WIDTH * n.scale) / 2;
    const hh = n.h / 2;
    minX = Math.min(minX, n.x - hw);
    maxX = Math.max(maxX, n.x + hw);
    minY = Math.min(minY, n.y - hh);
    maxY = Math.max(maxY, n.y + hh);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/**
 * Which nodes are visible when `focusId` is the current focus:
 * the root, and the children of every node on the path to the focus.
 * Only one path is open at a time, so the screen never overflows; once the
 * camera is two levels deep, the other main branches step aside.
 */
export function visibleIds(index: GraphIndex, focusId: string): Set<string> {
  const visible = new Set<string>([index.dossier.rootId]);
  const path: string[] = [];
  let cur = index.byId.get(focusId);
  while (cur) {
    path.unshift(cur.id);
    cur = cur.parent ? index.byId.get(cur.parent) : undefined;
  }
  if (path.length === 0) path.push(index.dossier.rootId);
  const deep = path.length > 2;
  for (const id of path) {
    visible.add(id);
    if (deep && id === path[0]) continue; // other branches step aside
    for (const child of index.children.get(id) ?? []) visible.add(child.id);
  }
  return visible;
}
