"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { motion, useReducedMotion } from "motion/react";
import { memo } from "react";
import type { GraphNode, Locale } from "@/data/types";
import { StatusGlyph } from "@/components/Status";
import { getDictionary } from "@/lib/i18n";
import { CARD_WIDTH } from "@/lib/layout";
import { kindColor, statusColor } from "@/lib/theme";

export type NodeState = "focus" | "path" | "child" | "context";

export interface MindNodeData extends Record<string, unknown> {
  node: GraphNode;
  locale: Locale;
  scale: number;
  depth: number;
  state: NodeState;
  childCount: number;
  expanded: boolean;
  selected: boolean;
  related: boolean; // linked to the selected node by a relation
  order: number; // for staggered appearance
}

export type MindFlowNode = Node<MindNodeData, "mind">;

const center = { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };

function MindNodeImpl({ data }: NodeProps<MindFlowNode>) {
  const { node, locale, scale, depth, state, childCount, expanded, selected, related, order } = data;
  const reduce = useReducedMotion();
  const t = getDictionary(locale);
  const isRoot = depth === 0;
  const accent = node.status && (node.kind === "claim" || node.kind === "question" || isRoot) ? statusColor(node.status) : kindColor(node.kind);
  const width = CARD_WIDTH * scale;
  const dim = state === "context" && !related;

  return (
    <div style={{ width, fontSize: 16 * scale }} className="relative">
      <Handle type="target" position={Position.Top} style={center} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} style={center} isConnectable={false} />
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.55 }}
        animate={{ opacity: dim ? 0.42 : 1, scale: 1 }}
        transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : Math.min(order, 12) * 0.035, ease: [0.22, 1, 0.36, 1] }}
        className="mind-card relative overflow-hidden bg-card text-left"
        style={{
          borderRadius: "0.9em",
          padding: isRoot ? "1.1em 1.25em 1.05em 1.45em" : "0.75em 0.9em 0.8em 1.1em",
          // Inset shadows instead of borders: browsers round borders up to 1px
          // before the map is scaled, which would make them thick when zoomed in.
          boxShadow: [
            `inset 0 0 0 ${selected ? 0.13 : 0.07}em ${selected ? accent : related ? `color-mix(in srgb, ${accent} 55%, var(--rule))` : "var(--rule)"}`,
            selected
              ? `0 0.6em 1.8em -0.6em color-mix(in srgb, ${accent} 45%, transparent)`
              : "0 0.35em 1.2em -0.7em rgba(60, 45, 20, 0.35)",
          ].join(", "),
        }}
      >
        <span aria-hidden className="absolute inset-y-0 left-0" style={{ width: "0.3em", background: accent }} />
        <div className="flex items-center justify-between gap-[0.5em]" style={{ fontSize: "0.72em" }}>
          <span className="smallcaps font-semibold" style={{ color: kindColor(node.kind) }}>
            {isRoot ? t.home.firstDossier : depth === 1 ? "" : t.kind[node.kind]}
          </span>
          {node.date && <span className="tabular-nums text-muted">{node.date.label[locale]}</span>}
        </div>

        <div
          className="font-serif text-ink"
          style={{
            fontSize: isRoot ? "1.42em" : depth === 1 ? "1.22em" : "1.04em",
            lineHeight: 1.22,
            fontWeight: isRoot || depth === 1 ? 600 : 500,
            marginTop: "0.25em",
          }}
        >
          {node.title[locale]}
        </div>

        {node.short && (
          <div className="text-ink-2" style={{ fontSize: "0.8em", lineHeight: 1.35, marginTop: "0.35em" }}>
            {node.short[locale]}
          </div>
        )}

        {(node.status || (childCount > 0 && !expanded)) && (
          <div className="flex items-center justify-between gap-[0.5em]" style={{ marginTop: "0.6em", fontSize: "0.74em" }}>
            {node.status ? (
              <span className="inline-flex items-center gap-[0.4em] font-medium" style={{ color: statusColor(node.status) }}>
                <StatusGlyph status={node.status} size={11 * scale * 1.1} />
                {t.status[node.status]}
              </span>
            ) : (
              <span />
            )}
            {childCount > 0 && !expanded && (
              <span
                className="rounded-full bg-paper-2 text-ink-2"
                style={{ padding: "0.1em 0.6em" }}
                aria-label={t.explorer.children(childCount)}
              >
                +{childCount}
              </span>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export const MindNode = memo(MindNodeImpl);
