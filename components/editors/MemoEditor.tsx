"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { postContent, localToday } from "@/lib/api";
import { LIMITS, type MemoDoc } from "@/lib/docs";
import { ErrorText, Field, GhostButton, inputCls, MarkdownField, PrimaryButton } from "./ui";

export function MemoEditor({
  memo,
  onDone,
  onCancel,
}: {
  memo?: MemoDoc;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(memo?.title ?? "");
  const [date, setDate] = useState(memo?.date ?? localToday());
  const [pinned, setPinned] = useState(memo?.pinned ?? false);
  const [body, setBody] = useState(memo?.body ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
      onDone();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError("제목을 입력해 주세요.");
    run(() => postContent({ kind: "memos", slug: memo?.slug, data: { title, date, pinned, body } }));
  };

  const remove = () => {
    if (!memo || !confirm("이 메모를 삭제할까요? '이전 버전으로 되돌리기'로 복구할 수 있습니다.")) return;
    run(() => postContent({ kind: "memos", slug: memo.slug, action: "delete" }));
  };

  return (
    <form onSubmit={save} className="space-y-4 rounded-xl border-2 border-accent bg-surface p-5">
      <p className="font-mono text-xs text-accent-ink">{memo ? "메모 수정" : "새 메모"}</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Field label="제목">
          <input value={title} maxLength={LIMITS.title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </Field>
        <Field label="날짜">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </Field>
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
        📌 맨 위에 고정
      </label>
      <MarkdownField value={body} onChange={setBody} rows={8} />
      <ErrorText error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <PrimaryButton type="submit" busy={busy}>
          {busy ? "저장 중…" : "저장"}
        </PrimaryButton>
        <GhostButton onClick={onCancel} disabled={busy}>
          <X size={14} aria-hidden /> 취소
        </GhostButton>
        {memo && (
          <GhostButton onClick={remove} disabled={busy}>
            <Trash2 size={14} aria-hidden /> 삭제
          </GhostButton>
        )}
      </div>
    </form>
  );
}
