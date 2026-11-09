"use client";

/**
 * Norwich, 1144 — the animated story's scenes.
 * Places, dates and statuses come from the dossier itself; every on-screen
 * phrase follows nodes.ts. Timing comes from the voice-over (story-timing.json).
 */
import type { ReactNode } from "react";
import { norwich1144 } from "@/data/dossiers/norwich-1144";
import type { L, Locale, SpreadLinkKind, Status } from "@/data/types";
import { getDictionary } from "@/lib/i18n";
import { type Clock, easeInOut, easeOut, lerp, prog, wrap } from "@/lib/story";
import { statusColor } from "@/lib/theme";
import { type Basemap, Land, useBasemap } from "../basemap";
import { Appear, Card, cardHeight, DrawLine, H, Kicker, Lines, Manuscript, Pin, Stamp, W } from "../kit";

const l = (fr: string, en: string): L => ({ fr, en });
const node = (id: string) => {
  const n = norwich1144.nodes.find((x) => x.id === id);
  if (!n) throw new Error(`Unknown node ${id}`);
  return n;
};
const statusOf = (id: string) => node(id).status as Status;

export interface SceneProps {
  t: number;
  locale: Locale;
  c: Clock;
}

/** Cross-fades a scene in and out around its slot on the timeline. */
function Scene({ t, slot, children }: { t: number; slot: { start: number; end: number }; children: ReactNode }) {
  const o = easeOut(prog(t, slot.start, 0.9)) * (1 - easeInOut(prog(t, slot.end - 0.35, 0.8)));
  if (o <= 0.001) return null;
  return <g opacity={o}>{children}</g>;
}

const stampLabel = (s: Status, locale: Locale) => (s === "plausible" ? "Plausible" : getDictionary(locale).status[s]);

// ── Map ────────────────────────────────────────────────────────────────────────

const FRAME = { lon: [-6.5, 13] as [number, number], lat: [45.2, 55.6] as [number, number] };

interface Camera {
  x: number; // stage point to centre on
  y: number;
  s: number; // zoom
  ox?: number; // where that point lands on screen
  oy?: number;
}
const camLerp = (a: Camera, b: Camera, p: number): Camera => ({
  x: lerp(a.x, b.x, p),
  y: lerp(a.y, b.y, p),
  s: lerp(a.s, b.s, p),
  ox: lerp(a.ox ?? W / 2, b.ox ?? W / 2, p),
  oy: lerp(a.oy ?? H / 2, b.oy ?? H / 2, p),
});
const toScreen = (cam: Camera, [x, y]: [number, number]): [number, number] => [(x - cam.x) * cam.s + (cam.ox ?? W / 2), (y - cam.y) * cam.s + (cam.oy ?? H / 2)];

function MapLayer({ map, cam, children }: { map: Basemap; cam: Camera; children?: ReactNode }) {
  return (
    <g>
      <rect width={W} height={H} fill="#e9e3d4" opacity={0.55} />
      <g transform={`translate(${cam.ox ?? W / 2} ${cam.oy ?? H / 2}) scale(${cam.s}) translate(${-cam.x} ${-cam.y})`}>
        <Land paths={map.paths} />
      </g>
      {children}
    </g>
  );
}

const placeOf = (id: string) => node(id).place!;

// ── 1. The accusation ─────────────────────────────────────────────────────────

function Accusation({ t, locale, c }: SceneProps) {
  const quote = norwich1144.accusation[locale];
  const words = quote.split(" ");
  const shown = Math.ceil(easeOut(prog(t, c.at("quote") + 0.3, (c.end("quote") - c.at("quote")) * 0.7)) * words.length);
  const lines = wrap(words.slice(0, shown).join(" "), 40);
  const lift = easeInOut(prog(t, c.at("questions") - 0.2, 1.2));
  // The rewind: from today back to 1144.
  const rw = easeInOut(prog(t, c.within("questions", 0.62), c.scene("accusation").end - c.within("questions", 0.62) + 0.4));
  const year = Math.round(lerp(2026, 1144, rw));
  const qs = locale === "fr" ? ["D'où vient-elle ?", "Sur quoi repose-t-elle ?"] : ["Where does it come from?", "What does it rest on?"];
  return (
    <g>
      <g transform={`translate(${W / 2} ${lerp(330, 200, lift)}) scale(${lerp(1, 0.72, lift)})`} opacity={lerp(1, 0.55, lift)}>
        <Appear t={t} at={c.at("quote") - 0.6}>
          <Kicker x={0} y={-110} anchor="middle" text={locale === "fr" ? "Une accusation" : "An accusation"} />
        </Appear>
        <Lines lines={lines} x={0} y={-20} size={54} lh={1.3} anchor="middle" className="font-serif" italic />
      </g>
      {qs.map((q, i) => (
        <Appear key={q} t={t} at={c.within("questions", i * 0.22)} dy={20}>
          <text x={W / 2} y={420 + i * 76} textAnchor="middle" fontSize={50} className="font-serif" fontWeight={600} fill="var(--accent)">
            {q}
          </text>
        </Appear>
      ))}
      <Appear t={t} at={c.within("questions", 0.6)}>
        <line x1={260} x2={1340} y1={700} y2={700} stroke="var(--rule)" strokeWidth={2} />
        {Array.from({ length: 23 }, (_, i) => {
          // ticks scroll as the years rewind
          const x = 260 + ((i * 50 + rw * 900) % 1100);
          return <line key={i} x1={x} x2={x} y1={692} y2={708} stroke="var(--rule)" strokeWidth={2} />;
        })}
        <text x={W / 2} y={670} textAnchor="middle" fontSize={84} className="font-serif" fontWeight={600} fill="var(--ink)" style={{ fontVariantNumeric: "tabular-nums" }}>
          {year}
        </text>
        <Kicker x={W / 2} y={750} anchor="middle" text={locale === "fr" ? "Remonter à la source" : "Back to the source"} />
      </Appear>
    </g>
  );
}

// ── 2. Norwich, 1144 ──────────────────────────────────────────────────────────

function Norwich({ t, locale, c, map }: SceneProps & { map: Basemap }) {
  const nor = map.project(placeOf("o-death").lon, placeOf("o-death").lat);
  const eng = map.project(-1.6, 52.6);
  const start = c.scene("norwich").start;
  const p = easeInOut(prog(t, start, c.within("death", 0.5) - start));
  const cam = camLerp({ x: eng[0], y: eng[1], s: 1.6, ox: 520 }, { x: nor[0], y: nor[1], s: 2.7, ox: 560, oy: 430 }, p);
  const [px, py] = toScreen(cam, nor);
  const death = node("o-death");
  const x = 860;
  const w = 640;
  return (
    <MapLayer map={map} cam={cam}>
      <Appear t={t} at={c.within("death", 0.15)}>
        <Pin x={px} y={py} t={t} />
        <text x={px} y={py - 26} textAnchor="middle" fontSize={26} className="font-serif" fontWeight={600} fill="var(--ink)">
          Norwich
        </text>
      </Appear>
      <Appear t={t} at={c.within("death", 0.35)}>
        <Card
          x={x}
          y={120}
          w={w}
          kicker={death.date!.label[locale]}
          title={death.title[locale]}
          body={locale === "fr" ? "Apprenti pelletier d'environ douze ans. Corps découvert dans le bois de Thorpe, au nord de la ville." : "An apprentice skinner of about twelve. His body is found in Thorpe Wood, north of the town."}
          accent="var(--k-event)"
        />
        <Stamp t={t} at={c.within("killer", 0.25)} x={x + w - 120} y={130} status={statusOf("o-death")} label={stampLabel(statusOf("o-death"), locale)} size={0.85} />
      </Appear>
      <Appear t={t} at={c.within("killer", 0.5)}>
        <Card x={x} y={350} w={w} title={locale === "fr" ? "Son meurtrier ?" : "His killer?"} body={node("u-killer").title[locale]} accent="var(--st-undetermined)" />
        <Stamp t={t} at={c.within("killer", 0.8)} x={x + w - 130} y={370} status={statusOf("u-killer")} label={stampLabel(statusOf("u-killer"), locale)} size={0.85} rotate={4} />
      </Appear>
      <Appear t={t} at={c.within("sheriff", 0.1)}>
        <Card
          x={x}
          y={540}
          w={w}
          kicker={locale === "fr" ? "Selon Thomas de Monmouth, plus tard" : "According to Thomas of Monmouth, later"}
          title={locale === "fr" ? "La famille accuse les Juifs ; le shérif les abrite au château" : "The family accuses the Jews; the sheriff shelters them in the castle"}
          accent="var(--st-plausible)"
        />
        <Stamp t={t} at={c.within("sheriff", 0.7)} x={x + w - 110} y={548} status={statusOf("o-sheriff")} label={stampLabel(statusOf("o-sheriff"), locale)} size={0.85} rotate={-3} />
      </Appear>
    </MapLayer>
  );
}

// ── 3. The first narrative ───────────────────────────────────────────────────

function Thomas({ t, locale, c }: SceneProps) {
  const x0 = 220;
  const x1 = 1380;
  const y = 200;
  const yearX = (yr: number) => x0 + ((yr - 1144) / 6) * (x1 - x0);
  const motifs = locale === "fr" ? ["« tué par des Juifs »", "« en imitant la crucifixion »", "« un complot »"] : ["“killed by Jews”", "“imitating the crucifixion”", "“a conspiracy”"];
  const gap = prog(t, c.within("silence", 0.15), 1.6);
  return (
    <g>
      <DrawLine t={t} at={c.at("silence") - 0.5} dur={1.2} x1={x0} y1={y} x2={x1} y2={y} stroke="var(--ink-2)" width={2.5} />
      {[1144, 1145, 1146, 1147, 1148, 1149, 1150].map((yr, i) => (
        <Appear key={yr} t={t} at={c.at("silence") - 0.4 + i * 0.12} dy={6}>
          <line x1={yearX(yr)} x2={yearX(yr)} y1={y - 8} y2={y + 8} stroke="var(--ink-2)" strokeWidth={2} />
          <text x={yearX(yr)} y={y + 40} textAnchor="middle" fontSize={22} fill="var(--muted)">
            {yr}
          </text>
        </Appear>
      ))}
      <Appear t={t} at={c.at("silence") - 0.2}>
        <Pin x={x0} y={y} t={t} r={10} pulse={false} />
        <text x={x0} y={y - 26} textAnchor="middle" fontSize={22} fontWeight={600} fill="var(--ink)">
          {locale === "fr" ? "Mort de Guillaume" : "William's death"}
        </text>
      </Appear>
      {gap > 0 && (
        <g opacity={easeOut(gap)}>
          <rect x={x0 + 14} y={y - 34} width={(yearX(1149.6) - x0 - 14) * easeOut(gap)} height={68} rx={8} fill="var(--st-undetermined)" fillOpacity={0.1} />
          <text x={(x0 + yearX(1149.6)) / 2} y={y - 50} textAnchor="middle" fontSize={24} fontStyle="italic" className="font-serif" fill="var(--st-undetermined)">
            {locale === "fr" ? "six ans · aucune source" : "six years · no source"}
          </text>
        </g>
      )}
      <Appear t={t} at={c.within("vita", 0.15)}>
        <Pin x={yearX(1150)} y={y} t={t} r={10} />
        <text x={yearX(1150)} y={y - 26} textAnchor="middle" fontSize={22} fontWeight={600} fill="var(--accent)">
          {locale === "fr" ? "v. 1150" : "c. 1150"}
        </text>
      </Appear>
      <Appear t={t} at={c.within("vita", 0.3)} dy={30}>
        <Manuscript t={t} at={c.within("vita", 0.3)} x={260} y={300} w={360} h={470} title="Vita et passio sancti Willelmi" dur={4} />
        <Lines lines={wrap(node("o-thomas").title[locale], 30)} x={660} y={350} size={34} className="font-serif" weight={600} />
        <Lines
          lines={wrap(locale === "fr" ? "Moine de Norwich, arrivé après les faits. Il n'a rien vu de ce qu'il raconte." : "A Norwich monk who arrived after the events. He saw none of what he relates.", 42)}
          x={660}
          y={396}
          size={22}
          fill="var(--ink-2)"
        />
      </Appear>
      {motifs.map((m, i) => {
        const at = c.within("ritual", 0.08 + i * 0.16);
        return (
          <Appear key={m} t={t} at={at} dy={0}>
            <g transform={`translate(${lerp(560, 660, easeOut(prog(t, at, 0.7)))} ${500 + i * 62})`}>
              <rect x={0} y={-34} width={m.length * 12.4 + 40} height={48} rx={24} fill="var(--card)" stroke="var(--accent)" strokeWidth={1.5} />
              <text x={20} y={-3} fontSize={25} className="font-serif" fontStyle="italic" fill="var(--accent)">
                {m}
              </text>
            </g>
          </Appear>
        );
      })}
      <Appear t={t} at={c.within("ritual", 0.68)}>
        <text x={660} y={730} fontSize={30} className="font-serif" fontWeight={700} fill="var(--ink)">
          {locale === "fr" ? "Le premier récit connu de « meurtre rituel »" : "The first known “ritual murder” narrative"}
        </text>
      </Appear>
    </g>
  );
}

// ── 4. Context ────────────────────────────────────────────────────────────────

function Context({ t, locale, c }: SceneProps) {
  const cx = W / 2;
  const cy = 450;
  const cards: { at: number; x: number; y: number; kicker: string; title: string; body: string; accent: string; tag?: string }[] = [
    { at: c.within("anarchy", 0.05), x: 90, y: 110, kicker: "1138 – 1153", title: locale === "fr" ? "L'« Anarchie »" : "The “Anarchy”", body: locale === "fr" ? "Guerre civile en Angleterre." : "Civil war in England.", accent: "var(--k-concept)" },
    { at: c.within("anarchy", 0.55), x: 1030, y: 110, kicker: "1147 – 1149", title: locale === "fr" ? "La deuxième croisade" : "The Second Crusade", body: locale === "fr" ? "L'Europe se mobilise." : "Europe mobilises.", accent: "var(--k-concept)" },
    {
      at: c.within("lenders", 0.05),
      x: 90,
      y: 520,
      kicker: locale === "fr" ? "Depuis 1066" : "Since 1066",
      title: locale === "fr" ? "Les Juifs d'Angleterre" : "England's Jews",
      body: locale === "fr" ? "Sous la protection du roi, ils prêtent de l'argent : des débiteurs leur en veulent." : "Under royal protection, they lend money: debtors resent them.",
      accent: "var(--k-person)",
    },
    {
      at: c.within("novers", 0.05),
      x: 1030,
      y: 430,
      kicker: node("o-novers").date!.label[locale],
      title: node("o-novers").title[locale],
      body: locale === "fr" ? "Un chevalier endetté, accusé du meurtre de son banquier juif, Deulesalt." : "An indebted knight, accused of murdering his Jewish banker, Deulesalt.",
      accent: "var(--k-event)",
      tag: locale === "fr" ? "Interprétation d'E. M. Rose · discutée" : "E. M. Rose's interpretation · debated",
    },
  ];
  return (
    <g>
      <Appear t={t} at={c.at("why") - 0.3}>
        <text x={cx} y={120} textAnchor="middle" fontSize={48} className="font-serif" fontWeight={600} fill="var(--ink)">
          {locale === "fr" ? "Pourquoi ce récit ?" : "Why this story?"}
        </text>
      </Appear>
      <Appear t={t} at={c.within("why", 0.3)}>
        <Manuscript t={t} at={c.within("why", 0.3) - 5} x={cx - 90} y={cy - 120} w={180} h={240} />
        <text x={cx} y={cy + 160} textAnchor="middle" fontSize={20} fill="var(--muted)">
          {locale === "fr" ? "Vie et Passion · v. 1150" : "Life and Passion · c. 1150"}
        </text>
      </Appear>
      {cards.map((k) => (
        <Appear key={k.title} t={t} at={k.at}>
          <DrawLine t={t} at={k.at + 0.2} x1={k.x < cx ? k.x + 480 : k.x} y1={k.y + 70} x2={k.x < cx ? cx - 100 : cx + 100} y2={cy} stroke="var(--rule)" dash="4 6" />
          <Card x={k.x} y={k.y} w={480} kicker={k.kicker} title={k.title} body={k.body} accent={k.accent} />
          {k.tag && (
            <g transform={`translate(${k.x + 24} ${k.y + cardHeight(k.title, k.body, 480, true) + 42})`}>
              <rect x={0} y={-26} width={k.tag.length * 10.2 + 28} height={38} rx={19} fill="var(--st-plausible)" fillOpacity={0.12} stroke="var(--st-plausible)" />
              <text x={14} y={0} fontSize={18} fontWeight={600} fill="var(--st-plausible)">
                {k.tag}
              </text>
            </g>
          )}
        </Appear>
      ))}
      <Appear t={t} at={c.within("cult", 0.1)}>
        <g transform={`translate(${cx} 800)`}>
          <rect x={-300} y={-44} width={600} height={70} rx={35} fill="var(--accent)" />
          <text x={0} y={2} textAnchor="middle" fontSize={27} className="font-serif" fontWeight={600} fill="var(--paper)">
            {locale === "fr" ? "Thomas : un saint, un tombeau, des pèlerins" : "Thomas: a saint, a tomb, pilgrims"}
          </text>
        </g>
      </Appear>
    </g>
  );
}

// ── 5. Questioning the document ──────────────────────────────────────────────

function DocumentScene({ t, locale, c }: SceneProps) {
  const rows = [
    {
      cue: "readA",
      letter: "A",
      q: locale === "fr" ? "Est-il authentique ?" : "Is it authentic?",
      a: locale === "fr" ? "Oui : un manuscrit du XIIe siècle." : "Yes: a twelfth-century manuscript.",
      color: "var(--st-established)",
    },
    {
      cue: "readB",
      letter: "B",
      q: locale === "fr" ? "Que dit-il, et qui parle ?" : "What does it say, and who speaks?",
      a: locale === "fr" ? "Un plaidoyer, écrit des années après, sans témoin direct." : "A plea, written years later, with no eyewitness.",
      color: "var(--st-plausible)",
    },
    {
      cue: "readC",
      letter: "C",
      q: locale === "fr" ? "Que prouve-t-il ?" : "What does it prove?",
      a: locale === "fr" ? "Que l'accusation existait v. 1150 — pas le meurtre." : "That the accusation existed c. 1150 — not the murder.",
      color: "var(--st-not_demonstrated)",
    },
  ];
  const copiesAt = c.at("copies");
  const deps: { id: string; x: number; dashed?: boolean }[] = [
    { id: "d-jessopp", x: 760 },
    { id: "d-rubin", x: 1060 },
    { id: "d-peterborough", x: 1360, dashed: true },
  ];
  return (
    <g>
      <Appear t={t} at={c.at("single") - 0.4}>
        <Manuscript t={t} at={c.at("single") - 6} x={110} y={150} w={380} h={540} title="Vita et passio sancti Willelmi" />
        <text x={300} y={740} textAnchor="middle" fontSize={22} fill="var(--muted)">
          {locale === "fr" ? "Un seul manuscrit" : "A single manuscript"}
        </text>
      </Appear>
      {rows.map((r, i) => {
        const y = 210 + i * 170;
        return (
          <Appear key={r.letter} t={t} at={c.at(r.cue) - 0.2} until={copiesAt - 0.4}>
            <circle cx={620} cy={y - 10} r={34} fill="none" stroke="var(--ink)" strokeWidth={2} />
            <text x={620} y={y + 2} textAnchor="middle" fontSize={32} className="font-serif" fontWeight={700} fill="var(--ink)">
              {r.letter}
            </text>
            <text x={680} y={y} fontSize={36} className="font-serif" fontWeight={600} fill="var(--ink)">
              {r.q}
            </text>
            <Appear t={t} at={c.within(r.cue, 0.35)} dy={8}>
              <rect x={680} y={y + 22} width={6} height={44} rx={3} fill={r.color} />
              <text x={700} y={y + 54} fontSize={26} fill={r.color} fontWeight={600}>
                {r.a}
              </text>
            </Appear>
          </Appear>
        );
      })}
      <Appear t={t} at={copiesAt}>
        <Card x={830} y={150} w={460} kicker={node("d-vita").short![locale]} title={node("d-vita").title[locale]} accent="var(--k-source)" />
        {deps.map((d, i) => {
          const at = c.within("copies", 0.08 + i * 0.22);
          const n = node(d.id);
          return (
            <Appear key={d.id} t={t} at={at}>
              <DrawLine t={t} at={at + 0.2} x1={d.x} y1={540} x2={1060} y2={320} stroke={d.dashed ? "var(--muted)" : "var(--k-source)"} width={2.5} dash={d.dashed ? "6 8" : undefined} />
              <g transform={`translate(${d.x - 140} 540)`}>
                <rect width={280} height={116} rx={12} fill="var(--card)" stroke="var(--rule)" />
                <Lines lines={wrap(n.title[locale], 24)} x={140} y={38} size={21} anchor="middle" className="font-serif" weight={600} />
                <text x={140} y={100} textAnchor="middle" fontSize={17} fill="var(--muted)">
                  {d.dashed ? (locale === "fr" ? "dépendance probable" : "probable dependency") : n.short![locale]}
                </text>
              </g>
            </Appear>
          );
        })}
        <Appear t={t} at={c.within("copies", 0.78)}>
          <text x={1060} y={720} textAnchor="middle" fontSize={34} className="font-serif" fontWeight={700} fill="var(--accent)">
            {locale === "fr" ? "Une copie n'est pas un second témoin" : "A copy is not a second witness"}
          </text>
        </Appear>
      </Appear>
    </g>
  );
}

// ── 6. The claims, one by one ────────────────────────────────────────────────

function Claims({ t, locale, c }: SceneProps) {
  const rows = [
    { cue: "clCirculated", id: "c-circulated", text: locale === "fr" ? "L'accusation circulait vers 1150" : "The accusation was circulating around 1150", at: 0.72 },
    { cue: "clKilled", id: "c-killed-by-jews", text: node("c-killed-by-jews").title[locale], at: 0.55 },
    { cue: "clCrucifixion", id: "c-crucifixion", text: node("c-crucifixion").title[locale], at: 0.45 },
    { cue: "clBlood", id: "c-blood", text: node("c-blood").title[locale], at: 0.22 },
  ];
  const chips = locale === "fr" ? ["Lévitique 17", "Frédéric II · 1236", "Innocent IV · 1247"] : ["Leviticus 17", "Frederick II · 1236", "Innocent IV · 1247"];
  return (
    <g>
      <Appear t={t} at={c.at("oneByOne") - 0.3}>
        <text x={W / 2} y={120} textAnchor="middle" fontSize={46} className="font-serif" fontWeight={600} fill="var(--ink)">
          {node("b-claims").title[locale]}
        </text>
      </Appear>
      {rows.map((r, i) => {
        const y = 220 + i * 128;
        const st = statusOf(r.id);
        return (
          <Appear key={r.id} t={t} at={c.at(r.cue) - 0.15}>
            <rect x={150} y={y} width={1300} height={100} rx={14} fill="var(--card)" stroke="var(--rule)" />
            <rect x={150} y={y + 16} width={5} height={68} rx={2} fill={prog(t, c.within(r.cue, r.at), 0.3) > 0 ? statusColor(st) : "var(--rule)"} />
            <Lines lines={wrap(r.text, 46)} x={185} y={wrap(r.text, 46).length > 1 ? y + 42 : y + 60} size={29} lh={1.2} className="font-serif" weight={600} />
            <Stamp t={t} at={c.within(r.cue, r.at)} x={1270} y={y + 50} status={st} label={stampLabel(st, locale)} size={0.9} rotate={i % 2 ? 3 : -4} />
          </Appear>
        );
      })}
      {chips.map((ch, i) => (
        <Appear key={ch} t={t} at={c.within("clBlood", 0.45 + i * 0.15)} dy={8}>
          <g transform={`translate(${185 + chips.slice(0, i).reduce((x, prev) => x + prev.length * 11.5 + 50, 0)} 755)`}>
            <rect x={0} y={-26} width={ch.length * 11.5 + 30} height={38} rx={19} fill="var(--st-refuted)" fillOpacity={0.08} stroke="var(--st-refuted)" />
            <text x={15} y={0} fontSize={19} fontWeight={600} fill="var(--st-refuted)">
              {ch}
            </text>
          </g>
        </Appear>
      ))}
    </g>
  );
}

// ── 7. The spread ────────────────────────────────────────────────────────────

const LINK_STYLE: Record<SpreadLinkKind, { stroke: string; dash?: string; width: number }> = {
  documented: { stroke: "var(--ink)", width: 3 },
  proposed: { stroke: "var(--accent)", width: 2.6 },
  similarity: { stroke: "var(--muted)", dash: "2 8", width: 2.4 },
};

function Spread({ t, locale, c, map }: SceneProps & { map: Basemap }) {
  const events: { id: string; at: number; dx: number; dy: number; anchor: "start" | "end" | "middle"; tag?: L; victims?: L }[] = [
    { id: "o-death", at: c.scene("spread").start, dx: 18, dy: -14, anchor: "start" },
    { id: "e-gloucester", at: c.within("england", 0.02), dx: -18, dy: 6, anchor: "end" },
    { id: "e-blois", at: c.within("england", 0.3), dx: 18, dy: 8, anchor: "start", victims: l("~ 31–33 brûlés", "~ 31–33 burned") },
    { id: "e-bury", at: c.within("england", 0.74), dx: 18, dy: 26, anchor: "start" },
    { id: "e-winchester", at: c.end("england") + 0.2, dx: -18, dy: 20, anchor: "end" },
    { id: "e-fulda", at: c.within("blood", 0.03), dx: 18, dy: 8, anchor: "start", tag: l("+ le sang", "+ blood"), victims: l("34 brûlés", "34 burned") },
    { id: "e-lincoln", at: c.within("blood", 0.5), dx: -18, dy: -10, anchor: "end", tag: l("crédit royal", "royal credence"), victims: l("18 exécutés", "18 executed") },
    { id: "e-trent", at: c.at("trent"), dx: 18, dy: 8, anchor: "start", tag: l("aveux sous la torture", "confessions under torture") },
  ];
  const start = c.scene("spread").start;
  const eng = map.project(-0.5, 52.4);
  const zoomOut = easeInOut(prog(t, c.within("england", 0.2), c.at("blood") - c.within("england", 0.2)));
  const cam = camLerp({ x: eng[0], y: eng[1], s: 2.3, ox: 760 }, { x: W / 2 + 60, y: H / 2 + 10, s: 1.02 }, zoomOut);
  const pos = (id: string) => toScreen(cam, map.project(placeOf(id).lon, placeOf(id).lat));
  const year = (() => {
    let y = 1144;
    for (const e of events) if (t >= e.at) y = node(e.id).date!.year;
    return y;
  })();
  const victimsAt = c.at("victims");
  const linksAt = c.at("links");
  return (
    <MapLayer map={map} cam={cam}>
      {norwich1144.spread.map((s) => {
        const to = events.find((e) => e.id === s.to);
        if (!to) return null;
        const at = to.at;
        const p = easeOut(prog(t, at, 1.1));
        if (p <= 0) return null;
        const [x1, y1] = pos(s.from);
        const [x2, y2] = pos(s.to);
        const mx = (x1 + x2) / 2 + (y2 - y1) * 0.18;
        const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.18 - 20;
        const st = LINK_STYLE[s.kind];
        const glow = prog(t, linksAt, 0.6) * (1 - prog(t, c.end("links"), 1));
        const d = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
        return st.dash ? (
          <path key={s.to + s.from} d={d} fill="none" stroke={st.stroke} strokeWidth={st.width + glow * 1.5} strokeDasharray={st.dash} strokeLinecap="round" opacity={p} />
        ) : (
          <path key={s.to + s.from} d={d} fill="none" stroke={st.stroke} strokeWidth={st.width + glow * 1.5} pathLength={1} strokeDasharray={`${p} 1`} strokeLinecap="round" />
        );
      })}
      {events.map((e) => {
        const p = prog(t, e.at, 0.6);
        if (p <= 0) return null;
        const [x, y] = pos(e.id);
        const n = node(e.id);
        const isOrigin = e.id === "o-death";
        return (
          <g key={e.id} opacity={easeOut(p)}>
            <Pin x={x} y={y} t={t} r={isOrigin ? 10 : 8} color={isOrigin ? "var(--accent)" : "var(--k-event)"} pulse={t - e.at < 3 || isOrigin} />
            <text x={x + e.dx} y={y + e.dy} textAnchor={e.anchor} fontSize={22} fontWeight={600} fill="var(--ink)" stroke="var(--paper)" strokeWidth={5} paintOrder="stroke">
              {(isOrigin ? "Norwich" : n.title[locale]) + " · " + n.date!.year}
            </text>
            {e.tag && (
              <Appear t={t} at={e.at + 0.6} dy={6}>
                <text x={x + e.dx} y={y + e.dy + 26} textAnchor={e.anchor} fontSize={19} fontStyle="italic" fill="var(--st-refuted)" stroke="var(--paper)" strokeWidth={5} paintOrder="stroke">
                  {e.tag[locale]}
                </text>
              </Appear>
            )}
            {e.victims && (
              <Appear t={t} at={victimsAt + 0.4 + (e.id === "e-fulda" ? 1.2 : e.id === "e-lincoln" ? 2.4 : 0)} dy={6}>
                <text x={x + e.dx} y={y + e.dy + (e.tag ? 50 : 26)} textAnchor={e.anchor} fontSize={19} fontWeight={700} fill="var(--ink-2)" stroke="var(--paper)" strokeWidth={5} paintOrder="stroke">
                  {e.victims[locale]}
                </text>
              </Appear>
            )}
          </g>
        );
      })}
      <Appear t={t} at={start + 0.4}>
        <text x={80} y={200} fontSize={110} className="font-serif" fontWeight={600} fill="var(--ink)" opacity={0.85} style={{ fontVariantNumeric: "tabular-nums" }}>
          {year}
        </text>
      </Appear>
      <Appear t={t} at={linksAt}>
        <g transform="translate(940 70)">
          <rect width={620} height={200} rx={16} fill="var(--card)" stroke="var(--rule)" />
          <line x1={30} x2={110} y1={52} y2={52} stroke={LINK_STYLE.proposed.stroke} strokeWidth={3} strokeLinecap="round" />
          <text x={130} y={60} fontSize={22} fill="var(--ink)">
            {locale === "fr" ? "Lien proposé par une historienne" : "Link proposed by a historian"}
          </text>
          <line x1={30} x2={110} y1={102} y2={102} stroke={LINK_STYLE.similarity.stroke} strokeWidth={3} strokeDasharray={LINK_STYLE.similarity.dash} strokeLinecap="round" />
          <text x={130} y={110} fontSize={22} fill="var(--ink)">
            {locale === "fr" ? "Simple ressemblance" : "Mere resemblance"}
          </text>
          <Lines
            lines={wrap(locale === "fr" ? "Aucune filiation attestée par un document d'époque." : "No lineage attested by a period document.", 52)}
            x={30}
            y={158}
            size={20}
            italic
            className="font-serif"
            fill="var(--accent)"
          />
        </g>
      </Appear>
    </MapLayer>
  );
}

// ── 8. Rejected in the Middle Ages ───────────────────────────────────────────

function Rejected({ t, locale, c }: SceneProps) {
  const y = 470;
  const X = (yr: number) => (yr <= 1500 ? 120 + ((yr - 1130) / 370) * 1080 : 1380 + (yr - 1965) * 2);
  const accusations = [1144, 1168, 1171, 1181, 1232, 1235, 1255, 1475];
  const marks: { yr: number; at: number; up: boolean; title: string; body: string; id: string }[] = [
    { yr: 1236, at: c.within("frederick", 0.02), up: true, id: "v-frederick", title: locale === "fr" ? "Frédéric II · 1236" : "Frederick II · 1236", body: locale === "fr" ? "Enquête impériale : aucun rite juif ne requiert de sang." : "Imperial inquiry: no Jewish rite requires blood." },
    { yr: 1247, at: c.within("frederick", 0.6), up: false, id: "v-innocent", title: locale === "fr" ? "Innocent IV · 1247" : "Innocent IV · 1247", body: locale === "fr" ? "Le pape condamne ces accusations." : "The pope condemns these accusations." },
    { yr: 1965, at: c.within("abolition", 0.1), up: true, id: "t-1965", title: "Trente · 1965", body: locale === "fr" ? "Abolition du culte de Simon de Trente." : "Simon of Trent's cult abolished." },
  ];
  if (locale === "en") marks[2].title = "Trent · 1965";
  return (
    <g>
      <Appear t={t} at={c.at("authorities") - 0.3}>
        <text x={W / 2} y={120} textAnchor="middle" fontSize={46} className="font-serif" fontWeight={600} fill="var(--ink)">
          {locale === "fr" ? "Rejetée dès le Moyen Âge" : "Rejected in the Middle Ages"}
        </text>
      </Appear>
      <DrawLine t={t} at={c.at("authorities")} dur={1.4} x1={110} y1={y} x2={1220} y2={y} stroke="var(--ink-2)" width={2.5} />
      <DrawLine t={t} at={c.at("authorities") + 1} dur={0.6} x1={1290} y1={y} x2={1480} y2={y} stroke="var(--ink-2)" width={2.5} />
      <Appear t={t} at={c.at("authorities") + 1}>
        <text x={1255} y={y + 9} textAnchor="middle" fontSize={26} fill="var(--muted)">
          ⋯
        </text>
        {[1150, 1250, 1350, 1450].map((yr) => (
          <text key={yr} x={X(yr)} y={y + 44} textAnchor="middle" fontSize={20} fill="var(--muted)">
            {yr}
          </text>
        ))}
        {accusations.map((yr, i) => (
          <circle key={yr} cx={X(yr)} cy={y} r={i === 0 ? 9 : 7} fill={i === 0 ? "var(--accent)" : "var(--k-event)"} opacity={0.85} />
        ))}
        <text x={X(1144)} y={y - 22} textAnchor="middle" fontSize={18} fill="var(--accent)" fontWeight={600}>
          Norwich
        </text>
        <text x={X(1475)} y={y - 22} textAnchor="middle" fontSize={18} fill="var(--k-event)" fontWeight={600}>
          {locale === "fr" ? "Trente" : "Trent"}
        </text>
      </Appear>
      <Appear t={t} at={c.within("authorities", 0.6)}>
        <text x={X(1144)} y={820} fontSize={19} fill="var(--k-event)">
          ● accusations
        </text>
        <text x={X(1144) + 170} y={820} fontSize={19} fill="var(--st-established)">
          {locale === "fr" ? "● rejets par les autorités" : "● rejections by the authorities"}
        </text>
      </Appear>
      {marks.map((m) => {
        const x = X(m.yr);
        const cardX = Math.min(Math.max(x - 200, 60), 1140);
        const cardBottom = 190 + cardHeight(m.title, m.body, 400, false);
        return (
          <Appear key={m.id} t={t} at={m.at}>
            <circle cx={x} cy={y} r={11} fill="var(--st-established)" stroke="var(--card)" strokeWidth={3} />
            <line x1={x} x2={x} y1={m.up ? y - 14 : y + 14} y2={m.up ? cardBottom : y + 120} stroke="var(--st-established)" strokeWidth={2} />
            <Card x={cardX} y={m.up ? 190 : y + 120} w={400} title={m.title} body={m.body} accent="var(--st-established)" />
          </Appear>
        );
      })}
    </g>
  );
}

// ── 9. What we know ──────────────────────────────────────────────────────────

function Conclusion({ t, locale, c }: SceneProps) {
  const lines = wrap(norwich1144.accusation[locale], 48);
  const strike = easeInOut(prog(t, c.within("verdict", 0.55), 0.9));
  const unknowns = [
    { id: "u-killer", x: 230 },
    { id: "u-transmission", x: 830 },
  ];
  const lessonAt = c.at("lesson");
  return (
    <g>
      <g transform={`translate(0 ${lerp(0, -40, easeInOut(prog(t, c.at("unknowns"), 1)))})`}>
        <Lines lines={lines} x={W / 2} y={200} size={44} lh={1.3} anchor="middle" className="font-serif" italic fill="var(--ink-2)" />
        {lines.map((ln, i) => (
          <line key={i} x1={W / 2 - ln.length * 9.6} x2={W / 2 - ln.length * 9.6 + ln.length * 19.2 * strike} y1={186 + i * 57} y2={186 + i * 57} stroke="var(--st-refuted)" strokeWidth={4} strokeLinecap="round" />
        ))}
        <Stamp t={t} at={c.within("verdict", 0.8)} x={W / 2 + 330} y={300} status="refuted" label={stampLabel(statusOf("q"), locale)} size={1.3} rotate={-8} />
      </g>
      {unknowns.map((u, i) => (
        <Appear key={u.id} t={t} at={c.within("unknowns", 0.25 + i * 0.3)} until={lessonAt + 1.2}>
          <Card x={u.x} y={430} w={540} kicker={locale === "fr" ? "Question ouverte" : "Open question"} title={node(u.id).title[locale]} accent="var(--st-undetermined)" />
          <Stamp t={t} at={c.within("unknowns", 0.45 + i * 0.3)} x={u.x + 430} y={440} status="undetermined" label={stampLabel("undetermined", locale)} size={0.7} rotate={4} />
        </Appear>
      ))}
      <Appear t={t} at={lessonAt + 1.6}>
        <Lines
          lines={wrap(locale === "fr" ? "On peut ignorer le nom d'un meurtrier, et savoir qu'une accusation est fausse." : "One can be unsure who the killer was, and still know an accusation is false.", 46)}
          x={W / 2}
          y={530}
          size={46}
          lh={1.3}
          anchor="middle"
          className="font-serif"
          weight={600}
          fill="var(--accent)"
        />
      </Appear>
    </g>
  );
}

// ── 10. The method ───────────────────────────────────────────────────────────

function Method({ t, locale, c }: SceneProps) {
  const steps =
    locale === "fr"
      ? [
          ["Remonter à la source", "Qui l'a dit en premier, et quand ?"],
          ["Interroger chaque document", "Authentique ? Que dit-il ? Que prouve-t-il ?"],
          ["Séparer l'établi de l'affirmé", "Un statut pour chaque affirmation."],
        ]
      : [
          ["Go back to the source", "Who said it first, and when?"],
          ["Question every document", "Authentic? What does it say? What does it prove?"],
          ["Separate established from asserted", "A status for every claim."],
        ];
  return (
    <g>
      <Appear t={t} at={c.at("method") - 0.3}>
        <Lines
          lines={wrap(locale === "fr" ? "Une accusation peut naître d'un récit, sans aucune preuve." : "An accusation can be born of a story, without any proof.", 50)}
          x={W / 2}
          y={150}
          size={42}
          anchor="middle"
          className="font-serif"
          weight={600}
        />
      </Appear>
      {steps.map(([title, sub], i) => {
        const x = 130 + i * 460;
        return (
          <Appear key={title} t={t} at={c.within("method", 0.38 + i * 0.17)}>
            <circle cx={x + 40} cy={330} r={36} fill="var(--accent)" />
            <text x={x + 40} y={343} textAnchor="middle" fontSize={36} className="font-serif" fontWeight={700} fill="var(--paper)">
              {i + 1}
            </text>
            <Lines lines={wrap(title, 22)} x={x} y={420} size={32} className="font-serif" weight={600} />
            <Lines lines={wrap(sub, 32)} x={x} y={500} size={22} fill="var(--ink-2)" />
          </Appear>
        );
      })}
      <Appear t={t} at={c.at("explore")}>
        <text x={W / 2} y={660} textAnchor="middle" fontSize={30} letterSpacing="0.3em" fontWeight={600} fill="var(--muted)">
          ORIGINES
        </text>
      </Appear>
    </g>
  );
}

// ── Assembly ─────────────────────────────────────────────────────────────────

export function NorwichStory({ t, locale, c }: SceneProps) {
  const map = useBasemap(FRAME);
  const sc = c.scene;
  return (
    <g>
      <Scene t={t} slot={sc("accusation")}>
        <Accusation t={t} locale={locale} c={c} />
      </Scene>
      {map && (
        <Scene t={t} slot={sc("norwich")}>
          <Norwich t={t} locale={locale} c={c} map={map} />
        </Scene>
      )}
      <Scene t={t} slot={sc("thomas")}>
        <Thomas t={t} locale={locale} c={c} />
      </Scene>
      <Scene t={t} slot={sc("context")}>
        <Context t={t} locale={locale} c={c} />
      </Scene>
      <Scene t={t} slot={sc("document")}>
        <DocumentScene t={t} locale={locale} c={c} />
      </Scene>
      <Scene t={t} slot={sc("claims")}>
        <Claims t={t} locale={locale} c={c} />
      </Scene>
      {map && (
        <Scene t={t} slot={sc("spread")}>
          <Spread t={t} locale={locale} c={c} map={map} />
        </Scene>
      )}
      <Scene t={t} slot={sc("rejected")}>
        <Rejected t={t} locale={locale} c={c} />
      </Scene>
      <Scene t={t} slot={sc("conclusion")}>
        <Conclusion t={t} locale={locale} c={c} />
      </Scene>
      <Scene t={t} slot={sc("method")}>
        <Method t={t} locale={locale} c={c} />
      </Scene>
    </g>
  );
}
