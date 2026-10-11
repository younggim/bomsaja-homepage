"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type { MemoDoc } from "@/lib/docs";
import { formatDate } from "@/lib/format";
import { MemoEditor } from "@/components/editors/MemoEditor";
import { EditToggleButton, UndoButton } from "@/components/editors/ui";
import { AttachmentList } from "@/components/editors/Attachments";

interface Item {
  memo: MemoDoc;
  html: string;
  edited: boolean;
}

export function MemoBoard({ memos }: { memos: Item[] }) {
  const router = useRouter();
  // "new" for the create form, a slug for an open editor, or null.
  const [open, setOpen] = useState<string | null>(null);
  const done = () => {
    setOpen(null);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {open === "new" ? (
        <MemoEditor onDone={done} onCancel={() => setOpen(null)} />
      ) : (
        <button
          type="button"
          onClick={() => setOpen("new")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent-ink px-4 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
        >
          <Plus size={16} aria-hidden /> 새 메모
        </button>
      )}

      {memos.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">아직 메모가 없습니다.</p>
      )}

      <ul className="space-y-4">
        {memos.map(({ memo, html, edited }) =>
          open === memo.slug ? (
            <li key={memo.slug}>
              <MemoEditor memo={memo} onDone={done} onCancel={() => setOpen(null)} />
            </li>
          ) : (
            <li
              key={memo.slug}
              className={`rounded-xl border bg-surface p-5 ${memo.pinned ? "border-spring" : "border-border"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-muted">
                    {memo.pinned && <span className="mr-2 text-fg">📌 고정</span>}
                    <time dateTime={memo.date}>{formatDate(memo.date)}</time>
                  </p>
                  <h2 className="mt-1 text-lg font-bold">{memo.title}</h2>
                </div>
                <EditToggleButton onClick={() => setOpen(memo.slug)} />
              </div>
              <div className="prose-pcb mt-3" dangerouslySetInnerHTML={{ __html: html }} />
              <AttachmentList items={memo.attachments ?? []} compact />
              {edited && (
                <div className="mt-2 text-right">
                  <UndoButton kind="memos" slug={memo.slug} />
                </div>
              )}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
