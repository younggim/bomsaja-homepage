import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getRepoNotes } from "@/lib/content";
import { loadNotes } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown";
import { NoteView } from "./NoteView";

export const metadata: Metadata = { title: "Lab Notes" };

export function generateStaticParams() {
  return getRepoNotes().map((n) => ({ slug: n.slug }));
}

async function NoteSection({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const { notes, edited } = await loadNotes();
  const note = notes.find((n) => n.slug === slug);
  if (!note) notFound();
  return <NoteView note={note} html={renderMarkdown(note.body)} edited={edited.has(slug)} />;
}

export default function NotePage({ params }: PageProps<"/notes/[slug]">) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/notes" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent-ink">
        <ArrowLeft size={14} aria-hidden /> Lab Notes
      </Link>
      <Suspense fallback={<p className="mt-6 text-muted">노트를 불러오는 중…</p>}>
        <NoteSection params={params} />
      </Suspense>
    </article>
  );
}
