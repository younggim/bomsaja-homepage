import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getRepoNotes } from "@/lib/content";
import { loadNotes } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown";
import { NoteView } from "@/components/notes/NoteView";

export const metadata: Metadata = { title: "AIM&Future" };

export function generateStaticParams() {
  return getRepoNotes("aims").map((n) => ({ slug: n.slug }));
}

async function AimSection({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const { notes, edited } = await loadNotes("aims");
  const doc = notes.find((n) => n.slug === slug);
  if (!doc) notFound();
  return <NoteView kind="aims" note={doc} html={renderMarkdown(doc.body)} edited={edited.has(slug)} />;
}

export default function AimDocPage({ params }: PageProps<"/aim/[slug]">) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/aim" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent-ink">
        <ArrowLeft size={14} aria-hidden /> AIM&amp;Future
      </Link>
      <Suspense fallback={<p className="mt-6 text-muted">불러오는 중…</p>}>
        <AimSection params={params} />
      </Suspense>
    </article>
  );
}
