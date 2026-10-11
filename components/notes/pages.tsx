import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getRepoNotes } from "@/lib/content";
import { loadNotes } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown";
import { NOTE_KINDS, noteMeta, type NoteKind } from "@/lib/docs";
import { PageHeader } from "@/components/Cards";
import { NotesBoard } from "./NotesBoard";
import { NoteView } from "./NoteView";

// Server shells shared by every note-shaped section (AIM&Future, AI성장, 프롬프트&루프 연구).

async function BoardSection({ kind }: { kind: NoteKind }) {
  await connection();
  const { notes } = await loadNotes(kind);
  return <NotesBoard kind={kind} notes={notes.map(noteMeta)} />;
}

export function NoteIndexPage({ kind, title, desc }: { kind: NoteKind; title: string; desc: string }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader eyebrow={NOTE_KINDS[kind].title} title={title} desc={desc} />
      <Suspense fallback={<p className="text-muted">불러오는 중…</p>}>
        <BoardSection kind={kind} />
      </Suspense>
    </div>
  );
}

async function DocSection({ kind, params }: { kind: NoteKind; params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const { notes, edited } = await loadNotes(kind);
  const doc = notes.find((n) => n.slug === slug);
  if (!doc) notFound();
  return <NoteView kind={kind} note={doc} html={renderMarkdown(doc.body)} edited={edited.has(slug)} />;
}

export function NoteDocPage({ kind, params }: { kind: NoteKind; params: Promise<{ slug: string }> }) {
  const { path, title } = NOTE_KINDS[kind];
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href={path} className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent-ink">
        <ArrowLeft size={14} aria-hidden /> {title}
      </Link>
      <Suspense fallback={<p className="mt-6 text-muted">불러오는 중…</p>}>
        <DocSection kind={kind} params={params} />
      </Suspense>
    </article>
  );
}

export function staticParamsFor(kind: NoteKind) {
  return getRepoNotes(kind).map((n) => ({ slug: n.slug }));
}
