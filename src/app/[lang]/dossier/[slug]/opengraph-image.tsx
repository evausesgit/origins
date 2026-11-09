import { ImageResponse } from "next/og";
import { getDossier } from "@/data";
import { getDictionary, isLocale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ORIGINES";

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : "fr";
  const t = getDictionary(locale);
  const dossier = getDossier(slug);
  const root = dossier?.nodes.find((n) => n.id === dossier.rootId);
  const status = root?.status ? t.status[root.status] : "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#f7f3ea", color: "#23211c", fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, letterSpacing: 10, color: "#7a3e2a" }}>
          <div style={{ display: "flex", width: 26, height: 26, borderRadius: 999, border: "3px solid #7a3e2a", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: "#7a3e2a" }} />
          </div>
          ORIGINES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 30, color: "#7a7466" }}>{dossier?.accusation[locale]}</div>
          <div style={{ fontSize: 62, lineHeight: 1.12, fontWeight: 700 }}>{root?.title[locale]}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 28 }}>
          <div style={{ display: "flex", padding: "10px 26px", borderRadius: 999, border: "2px solid #8b2d2d", color: "#8b2d2d" }}>{status}</div>
          <div style={{ color: "#4a463d" }}>{locale === "fr" ? "Norwich 1144 · Trente 1475" : "Norwich 1144 · Trent 1475"}</div>
        </div>
      </div>
    ),
    size,
  );
}
