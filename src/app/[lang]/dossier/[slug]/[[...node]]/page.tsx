import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Explorer } from "@/components/explorer/Explorer";
import { getDossier, indexDossier } from "@/data";
import { getDictionary, isLocale } from "@/lib/i18n";

type Params = { lang: string; slug: string; node?: string[] };

export function generateStaticParams({ params }: { params: { slug: string } }) {
  const dossier = getDossier(params.slug);
  if (!dossier) return [];
  return [{ node: [] as string[] }, ...dossier.nodes.filter((n) => n.id !== dossier.rootId).map((n) => ({ node: [n.id] }))];
}

function resolve(p: Params) {
  if (!isLocale(p.lang)) return null;
  const dossier = getDossier(p.slug);
  if (!dossier) return null;
  if (p.node && p.node.length > 1) return null;
  const nodeId = p.node?.[0] ?? dossier.rootId;
  const index = indexDossier(dossier);
  const node = index.byId.get(nodeId);
  if (!node) return null;
  return { locale: p.lang, dossier, node };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const { locale, dossier, node } = r;
  const t = getDictionary(locale);
  const isRoot = node.id === dossier.rootId;
  const status = node.status ? ` — ${t.status[node.status]}` : "";
  const title = `${node.title[locale]}${status}`;
  const description = node.summary[locale].length > 220 ? node.summary[locale].slice(0, 217) + "…" : node.summary[locale];
  const path = `/${locale}/dossier/${dossier.slug}${isRoot ? "" : `/${node.id}`}`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { fr: path.replace(/^\/(fr|en)/, "/fr"), en: path.replace(/^\/(fr|en)/, "/en") },
    },
    openGraph: { title, description, url: path, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function DossierPage({ params }: { params: Promise<Params> }) {
  const r = resolve(await params);
  if (!r) notFound();
  return (
    <main>
      <h1 className="sr-only">{r.dossier.nodes.find((n) => n.id === r.dossier.rootId)!.title[r.locale]}</h1>
      <Explorer locale={r.locale} slug={r.dossier.slug} initialNodeId={r.node.id} />
    </main>
  );
}
