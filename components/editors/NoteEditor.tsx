"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { postContent, localToday } from "@/lib/api";
import { LIMITS, NOTE_KINDS, type NoteDoc, type NoteKind } from "@/lib/docs";
import { ErrorText, Field, GhostButton, inputCls, MarkdownField, PrimaryButton } from "./ui";

export function NoteEditor({
  kind = "notes",
  note,
  onSaved,
  onCancel,
  onDeleted,
}: {
  kind?: NoteKind;
  note?: NoteDoc;
  onSaved: (slug: string) => void;
  onCancel: () => void;
  onDeleted?: () => void;
}) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [date, setDate] = useState(note?.date ?? localToday());
  const [tags, setTags] = useState(note?.tags.join(", ") ?? "");
  const [summary, setSummary] = useState(note?.summary ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError("제목을 입력해 주세요.");
    run(async () => {
      const { slug } = await postContent({
        kind,
        slug: note?.slug,
        data: { title, date, tags: tags.split(","), summary, body },
      });
      onSaved(slug);
    });
  };

  const remove = () => {
    if (!note || !confirm(`이 ${NOTE_KINDS[kind].itemObj} 삭제할까요? '이전 버전으로 되돌리기'로 복구할 수 있습니다.`)) return;
    run(async () => {
      await postContent({ kind, slug: note.slug, action: "delete" });
      onDeleted?.();
    });
  };

  return (
    <form onSubmit={save} className="space-y-4 rounded-2xl border-2 border-accent bg-surface p-5 sm:p-6">
      <p className="font-mono text-xs text-accent-ink">{note ? `${NOTE_KINDS[kind].item} 수정` : `새 ${NOTE_KINDS[kind].item}`}</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Field label="제목">
          <input value={title} maxLength={LIMITS.title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </Field>
        <Field label="날짜">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label="요약">
        <input value={summary} maxLength={LIMITS.summary} onChange={(e) => setSummary(e.target.value)} className={inputCls} />
      </Field>
      <Field label="태그 (쉼표로 구분)">
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="회로이론, 기초" className={inputCls} />
      </Field>
      <MarkdownField value={body} onChange={setBody} />
      <ErrorText error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <PrimaryButton type="submit" busy={busy}>
          {busy ? "저장 중…" : "저장"}
        </PrimaryButton>
        <GhostButton onClick={onCancel} disabled={busy}>
          <X size={14} aria-hidden /> 취소
        </GhostButton>
        {note && (
          <GhostButton onClick={remove} disabled={busy}>
            <Trash2 size={14} aria-hidden /> 삭제
          </GhostButton>
        )}
      </div>
    </form>
  );
}
