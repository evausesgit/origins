"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ancestry, getDossier, indexDossier } from "@/data";
import type { Locale } from "@/data/types";
import { getDictionary } from "@/lib/i18n";
import { boundsOf, CARD_HEIGHT, CARD_WIDTH, computeLayout, visibleIds, type Bounds } from "@/lib/layout";
import { relationColor } from "@/lib/theme";
import { ContributeDialog } from "./ContributeDialog";
import { GeoMap } from "./GeoMap";
import { Legend } from "./Legend";
import { MindNode, type MindFlowNode, type NodeState } from "./MindNode";
import { MobileFocus } from "./MobileFocus";
import { NarrationBar } from "./NarrationBar";
import { NodePanel } from "./NodePanel";
import { SearchDialog } from "./SearchDialog";
import { Timeline } from "./Timeline";
import { useMediaQuery } from "./useMediaQuery";

type View = "mindmap" | "timeline" | "map";
const nodeTypes = { mind: MindNode };
const MOVE_MS = 650;

interface Props {
  locale: Locale;
  slug: string;
  initialNodeId?: string;
}

export function Explorer(props: Props) {
  return (
    <ReactFlowProvider>
      <ExplorerInner {...props} />
    </ReactFlowProvider>
  );
}

function ExplorerInner({ locale, slug, initialNodeId }: Props) {
  const t = getDictionary(locale);
  const dossier = getDossier(slug)!;
  const index = useMemo(() => indexDossier(dossier), [dossier]);
  const layout = useMemo(() => computeLayout(index), [index]);
  const rootId = dossier.rootId;
  const reduce = useReducedMotion() ?? false;
  const isPhone = useMediaQuery("(max-width: 639px)");
  const rf = useReactFlow();

  const start = initialNodeId && index.byId.has(initialNodeId) ? initialNodeId : rootId;
  const [focusId, setFocusId] = useState(start);
  const [selectedId, setSelectedId] = useState<string | null>(start === rootId ? null : start);
  const [view, setView] = useState<View>("mindmap");
  const [narration, setNarration] = useState({ active: false, step: 0, playing: false });
  const [searchOpen, setSearchOpen] = useState(false);
  const [contributeFor, setContributeFor] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  // ───────────── URL sync: one shareable URL per node ─────────────
  const urlFor = useCallback((id: string) => `/${locale}/dossier/${slug}${id === rootId ? "" : `/${id}`}`, [locale, slug, rootId]);

  const navigate = useCallback(
    (id: string, opts: { push?: boolean; select?: boolean } = {}) => {
      if (!index.byId.has(id)) return;
      const { push = true, select = true } = opts;
      setFocusId(id);
      setSelectedId(select && id !== rootId ? id : null);
      const url = urlFor(id);
      if (typeof window !== "undefined" && window.location.pathname !== url) {
        if (push) window.history.pushState(null, "", url);
        else window.history.replaceState(null, "", url);
      }
    },
    [index, rootId, urlFor],
  );

  const userNavigate = useCallback(
    (id: string) => {
      setNarration((n) => (n.active ? { ...n, playing: false } : n));
      navigate(id, { select: !isPhone || id === focusId });
    },
    [navigate, isPhone, focusId],
  );

  const overview = useCallback(() => navigate(rootId), [navigate, rootId]);

  useEffect(() => {
    const onPop = () => {
      const last = window.location.pathname.split("/").filter(Boolean).pop() ?? "";
      const id = index.byId.has(last) ? last : rootId;
      setFocusId(id);
      setSelectedId(id === rootId ? null : id);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [index, rootId]);

  // Narration drives the camera: each step zooms to its node.
  const goStep = useCallback(
    (step: number, playing?: boolean) => {
      setNarration((n) => ({ active: true, step, playing: playing ?? n.playing }));
      setView("mindmap");
      navigate(dossier.narration[step].focus, { push: false, select: false });
    },
    [dossier, navigate],
  );
  const stopNarration = useCallback(() => setNarration({ active: false, step: 0, playing: false }), []);

  // Start the story from a "#narration" link (home page button).
  useEffect(() => {
    if (window.location.hash !== "#narration") return;
    history.replaceState(null, "", window.location.pathname);
    const id = requestAnimationFrame(() => goStep(0, true));
    return () => cancelAnimationFrame(id);
  }, [goStep]);

  // ───────────── Visible nodes, with an entrance tween from the parent ─────────────
  const visible = useMemo(() => visibleIds(index, focusId), [index, focusId]);
  const pathIds = useMemo(() => new Set(ancestry(index, focusId).map((n) => n.id)), [index, focusId]);
  const selectedRelations = useMemo(() => (selectedId ? index.relationsOf.get(selectedId) ?? [] : []), [index, selectedId]);
  const relatedIds = useMemo(() => new Set(selectedRelations.flatMap((r) => [r.from, r.to])), [selectedRelations]);

  const prevVisible = useRef<Set<string> | null>(null);
  const [anim, setAnim] = useState<{ from: Map<string, { x: number; y: number }>; t0: number } | null>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const prev = prevVisible.current;
    prevVisible.current = visible;
    if (!prev || reduce) return;
    const entering = [...visible].filter((id) => !prev.has(id));
    if (entering.length === 0) return;
    const from = new Map(
      entering.map((id) => {
        const parent = index.byId.get(id)?.parent;
        const p = layout.get(parent ?? id)!;
        return [id, { x: p.x, y: p.y }];
      }),
    );
    setAnim({ from, t0: performance.now() });
  }, [visible, index, layout, reduce]);

  useEffect(() => {
    if (!anim) return;
    let raf = 0;
    const loop = (now: number) => {
      setFrame(now);
      if (now - anim.t0 < MOVE_MS) raf = requestAnimationFrame(loop);
      else setAnim(null);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [anim]);

  const built = useMemo<MindFlowNode[]>(() => {
    const progress = anim ? Math.min(1, (frame - anim.t0) / MOVE_MS) : 1;
    const ease = 1 - Math.pow(1 - Math.max(0, progress), 3);
    let order = 0;
    return [...visible].map((id) => {
      const L = layout.get(id)!;
      const node = index.byId.get(id)!;
      const from = anim?.from.get(id);
      const x = from ? from.x + (L.x - from.x) * ease : L.x;
      const y = from ? from.y + (L.y - from.y) * ease : L.y;
      const kids = index.children.get(id) ?? [];
      const state: NodeState = id === focusId ? "focus" : pathIds.has(id) ? "path" : node.parent === focusId ? "child" : "context";
      return {
        id,
        type: "mind",
        position: { x, y },
        draggable: false,
        selectable: false,
        zIndex: 10 + L.depth,
        ariaLabel: `${t.kind[node.kind]} : ${node.title[locale]}`,
        data: {
          node,
          locale,
          scale: L.scale,
          depth: L.depth,
          state,
          childCount: kids.length,
          expanded: pathIds.has(id) && kids.length > 0,
          selected: selectedId === id,
          related: relatedIds.has(id) && selectedId !== id,
          order: from ? order++ : 0,
        },
      };
    });
  }, [visible, layout, index, anim, frame, focusId, pathIds, selectedId, relatedIds, locale, t]);

  const [nodes, setNodes, onNodesChange] = useNodesState<MindFlowNode>([]);
  useEffect(() => {
    // Merge so React Flow keeps the measured dimensions of existing nodes.
    setNodes((prev) => {
      const map = new Map(prev.map((n) => [n.id, n]));
      return built.map((b) => {
        const p = map.get(b.id);
        return p ? { ...p, position: b.position, data: b.data, zIndex: b.zIndex, ariaLabel: b.ariaLabel } : b;
      });
    });
  }, [built, setNodes]);

  const edges = useMemo<Edge[]>(() => {
    const out: Edge[] = [];
    for (const id of visible) {
      const n = index.byId.get(id)!;
      if (!n.parent || !visible.has(n.parent)) continue;
      const L = layout.get(id)!;
      const onPath = pathIds.has(id);
      out.push({
        id: `tree-${id}`,
        source: n.parent,
        target: id,
        type: "straight",
        selectable: false,
        focusable: false,
        style: { stroke: onPath ? "var(--ink-2)" : "var(--rule)", strokeWidth: (onPath ? 2.2 : 1.4) * L.scale },
      });
    }
    for (const r of selectedRelations) {
      if (!visible.has(r.from) || !visible.has(r.to)) continue;
      const s = Math.min(layout.get(r.from)!.scale, layout.get(r.to)!.scale);
      out.push({
        id: `rel-${r.id}`,
        source: r.from,
        target: r.to,
        type: "straight",
        selectable: false,
        focusable: false,
        animated: !reduce,
        zIndex: 5,
        style: { stroke: relationColor(r.type), strokeWidth: 2 * s, strokeDasharray: `${6 * s} ${5 * s}`, opacity: 0.9 },
      });
    }
    return out;
  }, [visible, index, layout, pathIds, selectedRelations, reduce]);

  // ───────────── Camera ─────────────
  const fly = useCallback(
    (id: string, duration: number) => {
      // A leaf is shown within its group of siblings, so its context stays visible.
      const node = index.byId.get(id)!;
      const target = (index.children.get(id)?.length ?? 0) > 0 || !node.parent ? id : node.parent;
      const kids = (index.children.get(target) ?? []).map((k) => layout.get(k.id)!);
      const t0 = layout.get(target)!;
      const raw: Bounds = boundsOf([t0, ...kids]);
      // Never frame tighter than a few cards' worth, even for a single child.
      const minW = CARD_WIDTH * t0.scale * 2.6;
      const minH = CARD_HEIGHT * t0.scale * 3.2;
      const w = Math.max(raw.width, minW);
      const h = Math.max(raw.height, minH);
      const b: Bounds = { x: raw.x + raw.width / 2 - w / 2, y: raw.y + raw.height / 2 - h / 2, width: w, height: h };
      // Leave room at the bottom for the story caption.
      if (narration.active) b.height *= 1.4;
      rf.fitBounds(b, { padding: 0.1, duration: reduce ? 0 : duration });
    },
    [index, layout, rf, reduce, narration.active],
  );

  const ready = useRef(false);
  useEffect(() => {
    if (view !== "mindmap" || isPhone !== false || !ready.current) return;
    // Wait one frame so a panel opening/closing has resized the canvas.
    const id = window.setTimeout(() => fly(focusId, narration.active ? 1400 : 900), 40);
    return () => window.clearTimeout(id);
  }, [focusId, selectedId, view, fly, isPhone, narration.active]);

  // ───────────── Full screen ─────────────
  function toggleFullscreen() {
    if (!document.fullscreenElement) container.current?.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }

  // ───────────── Keyboard ─────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (searchOpen || contributeFor || el.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (e.key === "f" && !e.metaKey && !e.ctrlKey) {
        toggleFullscreen();
        return;
      }
      if (view !== "mindmap") return;
      const cursor = selectedId ?? focusId;
      const node = index.byId.get(cursor)!;
      const siblings = node.parent ? index.children.get(node.parent) ?? [] : [];
      const kids = index.children.get(cursor) ?? [];
      const i = siblings.findIndex((s) => s.id === cursor);
      if (e.key === "ArrowDown" || e.key === "Enter") {
        if (kids[0]) userNavigate(kids[0].id);
      } else if (e.key === "ArrowUp" || e.key === "Backspace") {
        if (node.parent) userNavigate(node.parent);
      } else if (e.key === "ArrowRight" && siblings.length > 1) {
        userNavigate(siblings[(i + 1) % siblings.length].id);
      } else if (e.key === "ArrowLeft" && siblings.length > 1) {
        userNavigate(siblings[(i - 1 + siblings.length) % siblings.length].id);
      } else if (e.key === "Escape") {
        if (narration.active) stopNarration();
        else if (selectedId) setSelectedId(null);
        else overview();
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ───────────── Share ─────────────
  useEffect(() => {
    const on = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  const share = useCallback(
    async (id: string) => {
      const url = `${window.location.origin}${urlFor(id)}`;
      const title = `${index.byId.get(id)!.title[locale]} — ORIGINES`;
      try {
        if (navigator.share && isPhone) {
          await navigator.share({ title, url });
          return;
        }
        await navigator.clipboard.writeText(url);
        setToast(t.explorer.copied);
      } catch {
        /* user cancelled */
      }
    },
    [urlFor, index, locale, isPhone, t],
  );
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  // ───────────── Render ─────────────
  const path = ancestry(index, focusId);
  const selected = selectedId ? index.byId.get(selectedId) : undefined;
  const showPanel = !!selected && !(narration.active && narration.playing);
  const selectFromView = (id: string) => {
    setFocusId(id);
    setSelectedId(id);
    window.history.pushState(null, "", urlFor(id));
  };

  return (
    <div ref={container} className={`relative flex overflow-hidden bg-paper ${fullscreen ? "h-dvh" : "h-[calc(100dvh-3.5rem)]"}`}>
      <div className="relative min-w-0 flex-1">
        {/* Top bar: breadcrumb + views + tools */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start gap-2 p-2 max-sm:pointer-events-auto max-sm:border-b max-sm:border-rule-2 max-sm:bg-paper/90 max-sm:backdrop-blur sm:p-3">
          <nav aria-label="breadcrumb" className="pointer-events-auto flex min-w-0 max-w-full items-center gap-1 overflow-x-auto rounded-full border border-rule bg-card/90 px-1.5 py-1 text-sm shadow-sm backdrop-blur [scrollbar-width:none]">
            <button onClick={overview} className={`shrink-0 rounded-full px-3 py-1 ${focusId === rootId ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-2"}`}>
              {t.explorer.overview}
            </button>
            {path.slice(1).map((p, i) => (
              <span key={p.id} className="flex shrink-0 items-center gap-1">
                <span aria-hidden className="text-rule">/</span>
                <button
                  onClick={() => userNavigate(p.id)}
                  className={`max-w-[11rem] truncate rounded-full px-2.5 py-1 ${i === path.length - 2 ? "font-medium text-ink" : "text-ink-2 hover:bg-paper-2"}`}
                  aria-current={i === path.length - 2 ? "location" : undefined}
                >
                  {p.title[locale]}
                </button>
              </span>
            ))}
          </nav>

          <div className="pointer-events-auto ml-auto flex items-center gap-1.5">
            <div role="tablist" aria-label="Views" className="flex rounded-full border border-rule bg-card/90 p-0.5 text-sm shadow-sm backdrop-blur">
              {(["mindmap", "timeline", "map"] as View[]).map((v) => (
                <button
                  key={v}
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => {
                    setView(v);
                    stopNarration();
                  }}
                  className={`rounded-full px-3 py-1 ${view === v ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-2"}`}
                >
                  {t.explorer[v]}
                </button>
              ))}
            </div>
            <ToolButton label={t.explorer.search} onClick={() => setSearchOpen(true)} kbd="/">
              <path d="M10.5 18a7.5 7.5 0 1 1 5.3-2.2L21 21" />
            </ToolButton>
            <ToolButton label={fullscreen ? t.explorer.exitFullscreen : t.explorer.fullscreen} onClick={toggleFullscreen} className="hidden sm:grid">
              {fullscreen ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
            </ToolButton>
            <ToolButton label={t.explorer.shareDossier} onClick={() => share(rootId)}>
              <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
            </ToolButton>
          </div>
        </div>

        {/* Views */}
        {view === "mindmap" && isPhone === false && (
          <div className="absolute inset-0" aria-label={t.explorer.mindmapLabel}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              nodeTypes={nodeTypes}
              nodeOrigin={[0.5, 0.5]}
              onNodeClick={(_, n) => userNavigate(n.id)}
              onInit={() => {
                ready.current = true;
                fly(focusId, 0);
              }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              edgesFocusable={false}
              minZoom={0.08}
              maxZoom={14}
              zoomOnDoubleClick={false}
              proOptions={{ hideAttribution: true }}
              disableKeyboardA11y
            >
              <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#d8cfbb" />
              <Controls showInteractive={false} position="bottom-right" onFitView={() => fly(focusId, 700)} fitViewOptions={{ duration: 700 }} />
            </ReactFlow>
          </div>
        )}
        {view === "mindmap" && isPhone === true && (
          <MobileFocus index={index} locale={locale} focusId={focusId} onNavigate={(id) => navigate(id, { select: false })} onDetails={(id) => setSelectedId(id)} />
        )}
        {view === "timeline" && (
          <div className="absolute inset-0 pt-14">
            <Timeline index={index} locale={locale} onSelect={selectFromView} selectedId={selectedId ?? undefined} />
          </div>
        )}
        {view === "map" && (
          <div className="absolute inset-0 pt-14">
            <GeoMap index={index} locale={locale} onSelect={selectFromView} selectedId={selectedId ?? undefined} />
          </div>
        )}

        {/* Bottom-left: story + legend */}
        {!narration.active && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex flex-col items-start gap-2 sm:bottom-4 sm:left-4">
            {legendOpen && view === "mindmap" && <Legend locale={locale} onClose={() => setLegendOpen(false)} />}
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                onClick={() => goStep(0, true)}
                className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper shadow-lg hover:bg-ink-2"
              >
                <span aria-hidden>▶</span> {t.narration.start}
              </button>
              {view === "mindmap" && (
                <button onClick={() => setLegendOpen((o) => !o)} aria-expanded={legendOpen} className="rounded-full border border-rule bg-card/90 px-3.5 py-2.5 text-sm text-ink-2 shadow-sm backdrop-blur hover:bg-paper-2">
                  {t.explorer.legend}
                </button>
              )}
            </div>
            {view === "mindmap" && isPhone === false && focusId === rootId && !selectedId && (
              <p className="max-w-xs text-xs text-muted">{t.explorer.zoomHint}</p>
            )}
          </div>
        )}

        {narration.active && (
          <NarrationBar
            steps={dossier.narration}
            step={narration.step}
            playing={narration.playing}
            locale={locale}
            onStep={(i) => goStep(i)}
            onPlaying={(p) => setNarration((n) => ({ ...n, playing: p }))}
            onExit={stopNarration}
          />
        )}

        <p className="sr-only" aria-live="polite">
          {path.map((p) => p.title[locale]).join(" › ")}
        </p>
        <p className="sr-only">{t.explorer.keyboardHelp}</p>
      </div>

      {/* Detail panel: right column on desktop, bottom sheet on phones */}
      <AnimatePresence>
        {showPanel && selected && (
          <motion.aside
            key="panel"
            initial={reduce ? false : isPhone ? { y: "100%" } : { x: 40, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={reduce ? undefined : isPhone ? { y: "100%" } : { x: 40, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 h-[78dvh] overflow-hidden rounded-t-3xl border-t border-rule bg-card shadow-[0_-20px_50px_-20px_rgba(60,45,20,0.35)] sm:static sm:z-auto sm:h-auto sm:w-[380px] sm:rounded-none sm:border-l sm:border-t-0 sm:shadow-none lg:w-[430px]"
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-rule sm:hidden" aria-hidden />
            <NodePanel
              key={selected.id}
              index={index}
              node={selected}
              locale={locale}
              onNavigate={(id) => navigate(id, { select: true })}
              onClose={() => setSelectedId(null)}
              onContribute={setContributeFor}
              onShare={share}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {searchOpen && <SearchDialog index={index} locale={locale} onClose={() => setSearchOpen(false)} onNavigate={(id) => { setView("mindmap"); userNavigate(id); }} />}
      {contributeFor && <ContributeDialog index={index} locale={locale} targetId={contributeFor} onClose={() => setContributeFor(null)} />}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-paper shadow-lg"
            role="status"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolButton({ label, onClick, children, kbd, className = "grid" }: { label: string; onClick: () => void; children: React.ReactNode; kbd?: string; className?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={kbd ? `${label} (${kbd})` : label}
      className={`${className} size-9 place-items-center rounded-full border border-rule bg-card/90 text-ink-2 shadow-sm backdrop-blur hover:bg-paper-2`}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
