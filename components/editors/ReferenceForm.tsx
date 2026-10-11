"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { categories, levels, refTypes, type Reference } from "@/content/references";
import { LIMITS } from "@/lib/docs";
import { ErrorText, Field, GhostButton, inputCls, PrimaryButton } from "./ui";

const EMPTY: Reference = {
  id: "",
  title: "",
  author: "",
  category: "circuits",
  type: "book",
  level: "입문",
  url: "",
  lang: "en",
  note: "",
};

export function ReferenceForm({
  item,
  defaultCategory,
  busy,
  error,
  onSave,
  onCancel,
  onDelete,
}: {
  item?: Reference;
  defaultCategory?: Reference["category"];
  busy: boolean;
  error: string;
  onSave: (ref: Reference) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [ref, setRef] = useState<Reference>(item ?? { ...EMPTY, category: defaultCategory ?? EMPTY.category });
  const set = <K extends keyof Reference>(key: K, value: Reference[K]) => setRef((r) => ({ ...r, [key]: value }));
  const [localError, setLocalError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.title.trim()) return setLocalError("제목을 입력해 주세요.");
    if (ref.url && !/^https?:\/\//i.test(ref.url.trim())) return setLocalError("링크는 http:// 또는 https://로 시작해야 합니다.");
    setLocalError("");
    onSave(ref);
  };

  return (
    <form onSubmit={submit} className="col-span-full space-y-3 rounded-xl border-2 border-accent bg-surface p-5">
      <p className="font-mono text-xs text-accent-ink">{item ? "자료 수정" : "새 자료"}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="제목">
          <input value={ref.title} maxLength={LIMITS.refText} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="저자 / 기관">
          <input value={ref.author ?? ""} maxLength={120} onChange={(e) => set("author", e.target.value)} className={inputCls} />
        </Field>
        <Field label="링크 (선택)" className="sm:col-span-2">
          <input
            type="url"
            value={ref.url ?? ""}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://"
            className={inputCls}
          />
        </Field>
        <Field label="분야">
          <select value={ref.category} onChange={(e) => set("category", e.target.value as Reference["category"])} className={inputCls}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="유형">
          <select value={ref.type} onChange={(e) => set("type", e.target.value as Reference["type"])} className={inputCls}>
            {refTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="난이도">
          <select value={ref.level} onChange={(e) => set("level", e.target.value as Reference["level"])} className={inputCls}>
            {levels.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="언어">
            <select value={ref.lang} onChange={(e) => set("lang", e.target.value as Reference["lang"])} className={inputCls}>
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </Field>
          <Field label="상태">
            <select
              value={ref.status ?? ""}
              onChange={(e) => set("status", (e.target.value || undefined) as Reference["status"])}
              className={inputCls}
            >
              <option value="">없음</option>
              <option>읽는 중</option>
              <option>완료</option>
              <option>예정</option>
            </select>
          </Field>
        </div>
        <Field label="한 줄 메모" className="sm:col-span-2">
          <input value={ref.note} maxLength={LIMITS.refText} onChange={(e) => set("note", e.target.value)} className={inputCls} />
        </Field>
      </div>
      <ErrorText error={localError || error} />
      <div className="flex flex-wrap gap-2">
        <PrimaryButton type="submit" busy={busy}>
          {busy ? "저장 중…" : "저장"}
        </PrimaryButton>
        <GhostButton onClick={onCancel} disabled={busy}>
          <X size={14} aria-hidden /> 취소
        </GhostButton>
        {onDelete && (
          <GhostButton onClick={onDelete} disabled={busy}>
            <Trash2 size={14} aria-hidden /> 삭제
          </GhostButton>
        )}
      </div>
    </form>
  );
}
