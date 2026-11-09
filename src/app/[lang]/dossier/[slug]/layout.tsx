import { dossiers } from "@/data";

export function generateStaticParams() {
  return dossiers.map((d) => ({ slug: d.slug }));
}

export default function DossierLayout({ children }: LayoutProps<"/[lang]/dossier/[slug]">) {
  return children;
}
