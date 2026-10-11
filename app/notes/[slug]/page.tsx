import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getNote, getNotes } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return getNotes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  return note ? { title: note.meta.title, description: note.meta.summary } : {};
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();
  const { meta, html } = note;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/notes" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent-ink">
        <ArrowLeft size={14} aria-hidden /> Lab Notes
      </Link>
      <time dateTime={meta.date} className="mt-6 block font-mono text-sm text-muted">
        {formatDate(meta.date)}
      </time>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{meta.title}</h1>
      <p className="mt-3 text-muted">{meta.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {meta.tags.map((t) => (
          <span key={t} className="text-sm text-accent-ink">
            #{t}
          </span>
        ))}
      </div>
      <div className="prose-pcb mt-10" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
