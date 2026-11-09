import type { NodeKind, RelationType, Status } from "@/data/types";

export const statusColor = (s: Status) => `var(--st-${s})`;
export const kindColor = (k: NodeKind) => `var(--k-${k})`;

export function relationColor(t: RelationType): string {
  if (t === "SUPPORTS") return "var(--r-supports)";
  if (t === "CONTRADICTS") return "var(--r-contradicts)";
  return "var(--r-neutral)";
}
