import type { Metadata } from "next";
import { getMemos } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { editUrl } from "@/lib/edit";
import { PageHeader } from "@/components/Cards";
import { EditButton } from "@/components/EditButton";
import { NewFileButton } from "@/components/NewFileButton";

export const metadata: Metadata = { title: "Memo" };

export default function MemoPage() {
  const memos = getMemos();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader eyebrow="Memo" title="메모장" desc="떠오른 아이디어, 할 일, 짧은 기록을 남겨 두는 곳입니다." />
        <NewFileButton kind="memo" label="새 메모" />
      </div>

      <ul className="space-y-4">
        {memos.map(({ meta, html }) => (
          <li
            key={meta.slug}
            className={`rounded-xl border bg-surface p-5 ${meta.pinned ? "border-spring" : "border-border"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-muted">
                  {meta.pinned && <span className="mr-2 text-fg">📌 고정</span>}
                  <time dateTime={meta.date}>{formatDate(meta.date)}</time>
                </p>
                <h2 className="mt-1 text-lg font-bold">{meta.title}</h2>
              </div>
              <EditButton href={editUrl(`content/memos/${meta.slug}.md`)} />
            </div>
            <div className="prose-pcb mt-3" dangerouslySetInnerHTML={{ __html: html }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
