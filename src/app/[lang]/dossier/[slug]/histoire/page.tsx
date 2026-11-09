import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryPlayer } from "@/components/story/StoryPlayer";
import { getDossier } from "@/data";
import { getStory } from "@/data/stories";
import { getDictionary, isLocale } from "@/lib/i18n";

type Params = { lang: string; slug: string };

function resolve(p: Params) {
  if (!isLocale(p.lang)) return null;
  const dossier = getDossier(p.slug);
  const story = getStory(p.slug);
  if (!dossier || !story) return null;
  return { locale: p.lang, dossier, story };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const t = getDictionary(r.locale);
  const title = `${r.dossier.title[r.locale]} — ${t.story.title}`;
  const description = r.dossier.intro[r.locale];
  const path = `/${r.locale}/dossier/${r.dossier.slug}/histoire`;
  const image = `/${r.locale}/dossier/${r.dossier.slug}/opengraph-image`;
  return {
    title,
    description,
    alternates: { canonical: path, languages: { fr: path.replace(/^\/(fr|en)/, "/fr"), en: path.replace(/^\/(fr|en)/, "/en") } },
    openGraph: { title, description, url: path, type: "video.other", images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function StoryPage({ params }: { params: Promise<Params> }) {
  const r = resolve(await params);
  if (!r) notFound();
  return (
    <main>
      <h1 className="sr-only">
        {r.dossier.title[r.locale]} — {getDictionary(r.locale).story.title}
      </h1>
      <StoryPlayer story={r.story} locale={r.locale} dossierTitle={r.dossier.title[r.locale]} />
    </main>
  );
}
