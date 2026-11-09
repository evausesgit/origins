/**
 * ORIGINES — generic knowledge-graph model.
 *
 * Nothing here is specific to antisemitism: a "dossier" is any investigation
 * of a claim. Every human-readable string is bilingual (`L`).
 */

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** A localized string. */
export type L = Record<Locale, string>;

export type NodeKind =
  | "concept" // an idea, belief or accusation (also the central question and the branches)
  | "claim" // a precise statement that can be assessed on its own
  | "event" // a dated (and when possible geolocated) historical event
  | "source" // a node pointing to a source sheet in the library
  | "evidence" // a precise element drawn from a source and tied to a claim
  | "person"
  | "interpretation" // a historiographical reading
  | "conclusion" // the current state of an assessment
  | "question"; // an open, unresolved question

/** Assessment scale. Deliberately qualitative: no arbitrary percentages. */
export const STATUSES = [
  "established",
  "strong",
  "plausible",
  "not_demonstrated",
  "contradicted",
  "refuted",
  "undetermined",
] as const;
export type Status = (typeof STATUSES)[number];

export type Confidence = "high" | "medium" | "low";

export const RELATION_TYPES = [
  "ORIGINATED_FROM",
  "EVOLVED_INTO",
  "SUPPORTS",
  "CONTRADICTS",
  "DOCUMENTS",
  "REFERS_TO",
  "REINTERPRETS",
  "DERIVED_FROM",
  "CONTEXTUALIZES",
] as const;
export type RelationType = (typeof RELATION_TYPES)[number];

/** One version of the published assessment of a claim. */
export interface AssessmentVersion {
  date: string; // ISO date of the (re)assessment
  status: Status;
  note: L; // why it was set / why it changed
}

export interface Assessment {
  status: Status;
  confidence: Confidence;
  favorable: L[]; // elements that point towards the claim
  contrary: L[]; // elements that point against it
  limits: L[]; // limits of the available sources
  reasoning: L; // synthesis
  lastReviewed: string; // ISO date
  history: AssessmentVersion[];
}

/** The three levels at which any piece of evidence must be read. */
export interface EvidenceReading {
  /** Level A — is the document authentic? */
  authenticity: L;
  /** Level B — what exactly does the author state, in what context? */
  content: L;
  /** Level C — what does it actually prove about the claim at hand? */
  probative: L;
}

export interface Place {
  name: L;
  lat: number;
  lon: number;
}

export interface GraphNode {
  id: string;
  kind: NodeKind;
  /** Parent in the exploration tree (the mind map). Undefined only for the root. */
  parent?: string;
  title: L;
  /** One-line teaser shown on the card. */
  short?: L;
  /** Synthetic explanation shown in the side panel. */
  summary: L;
  /** Visible epistemic status (claims, but also events whose details are uncertain). */
  status?: Status;
  assessment?: Assessment;
  /** For events. `year` drives the timeline and the map. */
  date?: { label: L; year: number };
  place?: Place;
  /** For `source` and `evidence` nodes: id in the source library. */
  sourceId?: string;
  /** For `evidence` nodes. */
  reading?: EvidenceReading;
  /** Precise location in the source (folio, page, annal…) when known. */
  locator?: L;
}

export interface Relation {
  id: string;
  from: string;
  to: string;
  type: RelationType;
  /** Why this relation exists. */
  justification: L;
  /** Sources backing the relation (library ids). */
  sourceIds: string[];
}

export type SourceNature = "primary" | "secondary" | "reference";

export type VerificationStatus = "verified" | "partial" | "to_verify";

export interface Source {
  id: string;
  title: string; // titles stay in their original language
  author: string;
  date: L; // date of writing / publication, possibly approximate
  nature: SourceNature;
  type: L; // manuscript, chronicle, monograph, encyclopedia article…
  provenance?: L;
  holding?: L; // institution of conservation
  language: L; // original language
  edition?: L; // edition or translation used
  url?: string; // only links that were actually checked
  /**
   * An exact quotation. Left empty unless it has been checked against the
   * source with its precise location: ORIGINES never invents quotations.
   */
  quote?: { text: string; locator: L; translation?: L };
  description: L;
  verification: { status: VerificationStatus; checkedOn: string; note: L };
  /** Library ids this source depends on (copies, editions, translations, retellings). */
  derivedFrom?: string[];
}

/** A link between places on the propagation map. */
export type SpreadLinkKind = "documented" | "proposed" | "similarity";

export interface SpreadLink {
  from: string; // event node id
  to: string; // event node id
  kind: SpreadLinkKind;
  note: L;
  sourceIds: string[];
}

export interface NarrationStep {
  focus: string; // node id to zoom to
  title: L;
  text: L;
}

/** Scale of the timeline. `break` compresses everything after it into the last 14 % (long gaps). */
export interface TimelineScale {
  min: number;
  max: number;
  break?: number;
  ticks: number[];
}

export interface Dossier {
  slug: string;
  rootId: string;
  /** Short name, e.g. "Norwich, 1144". */
  title: L;
  /** Period covered, e.g. "1144 – 1475". */
  period: L;
  timeline: TimelineScale;
  /** The claim as it circulates. */
  accusation: L;
  intro: L;
  updated: string;
  nodes: GraphNode[];
  relations: Relation[];
  sources: Source[];
  spread: SpreadLink[];
  narration: NarrationStep[];
}
