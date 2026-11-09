import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-serif text-5xl text-ink">404</p>
      <p className="mt-3 text-ink-2">Page introuvable · Page not found</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-ink px-5 py-2 text-sm text-paper">
        ORIGINES
      </Link>
    </main>
  );
}
