import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { NoteMeta, ProjectMeta } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { refTypes, type Reference } from "@/content/references";

const TAG_STYLE: Record<string, string> = {
  Software: "border-accent/40 text-accent-ink",
  Embedded: "border-trace/60 text-fg",
  Hardware: "border-spring text-fg bg-spring-soft",
};

export function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {project.tags.map((t) => (
          <span key={t} className={`rounded-full border px-2 py-0.5 text-xs ${TAG_STYLE[t] ?? "border-border"}`}>
            {t}
          </span>
        ))}
        {project.sample && <span className="text-xs text-muted">· 예시</span>}
      </div>
      <h3 className="mt-3 font-mono text-lg font-bold group-hover:text-accent-ink">{project.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{project.summary}</p>
    </Link>
  );
}

export function NoteCard({ note }: { note: NoteMeta }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent"
    >
      <time dateTime={note.date} className="font-mono text-xs text-muted">
        {formatDate(note.date)}
      </time>
      <h3 className="mt-2 text-lg font-bold group-hover:text-accent-ink">{note.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{note.summary}</p>
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
  const body = (
    <>
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span aria-hidden>{type.icon}</span>
        <span className="text-muted">{type.label}</span>
        <span className="rounded-full border border-trace/60 px-2 py-0.5">{item.level}</span>
        {item.lang === "ko" && <span className="rounded-full border border-border px-2 py-0.5">한국어</span>}
        {item.status && (
          <span className={`rounded-full border px-2 py-0.5 ${STATUS_STYLE[item.status]}`}>{item.status}</span>
        )}
      </div>
      <h3 className="mt-3 flex items-start gap-1 font-bold group-hover:text-accent-ink">
        <span>{item.title}</span>
        {item.url && <ArrowUpRight size={16} aria-hidden className="mt-1 shrink-0" />}
      </h3>
      {item.author && <p className="mt-0.5 text-sm text-muted">{item.author}</p>}
      <p className="mt-2 flex-1 text-sm">{item.note}</p>
      {!item.url && <p className="mt-2 text-xs text-muted">교재 (도서관, 서점에서 확인)</p>}
    </>
  );
  const cls = "group flex h-full flex-col rounded-xl border border-border bg-surface p-5";
  return item.url ? (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} transition hover:-translate-y-0.5 hover:border-accent`}
    >
      {body}
      <span className="sr-only"> (새 탭에서 열림)</span>
    </a>
  ) : (
    <div className={cls}>{body}</div>
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
