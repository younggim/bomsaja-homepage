import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { NoteMeta } from "@/lib/docs";
import { formatDate } from "@/lib/format";
import { AttachmentList } from "@/components/editors/Attachments";
import { refTypes, type Reference } from "@/content/references";

export function NoteCard({ note, basePath = "/notes" }: { note: NoteMeta; basePath?: string }) {
  return (
    <Link
      href={`${basePath}/${note.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent"
    >
      <time dateTime={note.date} className="font-mono text-xs text-muted">
        {formatDate(note.date)}
      </time>
      <h3 className="mt-2 text-lg font-bold group-hover:text-accent-ink">{note.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{note.summary}</p>
      {!!note.attachmentCount && <p className="mt-2 text-xs text-muted">📎 첨부 {note.attachmentCount}개</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {note.tags.map((t) => (
          <span key={t} className="text-xs text-accent-ink">
            #{t}
          </span>
        ))}
      </div>
    </Link>
  );
}

const STATUS_STYLE: Record<string, string> = {
  "읽는 중": "bg-spring-soft text-fg border-spring",
  완료: "text-accent-ink border-accent/40",
  예정: "text-muted border-border",
};

export function ReferenceCard({ item }: { item: Reference }) {
  const type = refTypes.find((t) => t.id === item.type)!;
  // The card is a container; when there is a URL the title's ::after stretches over the
  // whole card so it stays clickable, while attachment links sit above it (z-10).
  return (
    <div
      className={`group relative flex h-full flex-col rounded-xl border border-border bg-surface p-5 ${
        item.url ? "transition hover:-translate-y-0.5 hover:border-accent" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span aria-hidden>{type.icon}</span>
        <span className="text-muted">{type.label}</span>
        <span className="rounded-full border border-trace/60 px-2 py-0.5">{item.level}</span>
        {item.lang === "ko" && <span className="rounded-full border border-border px-2 py-0.5">한국어</span>}
        {item.status && (
          <span className={`rounded-full border px-2 py-0.5 ${STATUS_STYLE[item.status]}`}>{item.status}</span>
        )}
      </div>
      <h3 className="mt-3 font-bold group-hover:text-accent-ink">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-1 after:absolute after:inset-0 after:content-['']"
          >
            <span>{item.title}</span>
            <ArrowUpRight size={16} aria-hidden className="mt-1 shrink-0" />
            <span className="sr-only"> (새 탭에서 열림)</span>
          </a>
        ) : (
          item.title
        )}
      </h3>
      {item.author && <p className="mt-0.5 text-sm text-muted">{item.author}</p>}
      <p className="mt-2 flex-1 text-sm">{item.note}</p>
      {!item.url && !item.attachments?.length && (
        <p className="mt-2 text-xs text-muted">교재 (도서관, 서점에서 확인)</p>
      )}
      <AttachmentList items={item.attachments ?? []} compact />
    </div>
  );
}

export function PageHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-sm text-accent-ink">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
      {desc && <p className="mt-3 max-w-2xl text-muted">{desc}</p>}
    </div>
  );
}
