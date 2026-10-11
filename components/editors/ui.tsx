"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2, PencilLine, Undo2 } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { postContent } from "@/lib/api";
import type { DocKind } from "@/lib/docs";

export const inputCls =
  "w-full rounded-lg border border-border bg-bg px-3 py-2 text-base outline-none placeholder:text-muted focus:border-accent";

export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}

export function EditToggleButton({ onClick, label = "수정하기" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent-ink"
    >
      <PencilLine size={16} aria-hidden />
      {label}
    </button>
  );
}

export function PrimaryButton({ children, busy, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean }) {
  return (
    <button
      {...rest}
      disabled={busy || rest.disabled}
      className="inline-flex items-center gap-1.5 rounded-lg bg-accent-ink px-4 py-2 text-sm font-semibold text-bg transition hover:opacity-90 disabled:opacity-60"
    >
      {busy && <Loader2 size={16} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function GhostButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm transition hover:border-accent disabled:opacity-60"
    >
      {children}
    </button>
  );
}

// Markdown textarea with a live preview rendered by the same sanitizing renderer as the site.
export function MarkdownField({ value, onChange, rows = 14 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  const [preview, setPreview] = useState(false);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-muted">본문 (Markdown)</span>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          aria-pressed={preview}
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent-ink"
        >
          <Eye size={14} aria-hidden /> {preview ? "편집으로" : "미리보기"}
        </button>
      </div>
      {preview ? (
        <div
          className="prose-pcb min-h-40 rounded-lg border border-border bg-bg p-4"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value || "_내용이 없습니다._") }}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${inputCls} font-mono text-sm leading-6`}
          placeholder={"## 제목\n\n- 목록\n- **굵게**, `코드`"}
        />
      )}
    </div>
  );
}

export function ErrorText({ error }: { error: string }) {
  return error ? (
    <p role="alert" className="text-sm font-semibold">
      ⚠ {error}
    </p>
  ) : null;
}

// Restores the previous revision of an inline-edited document.
export function UndoButton({ kind, slug, label = "이전 버전으로 되돌리기" }: { kind: DocKind; slug: string; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const undo = async () => {
    if (!confirm("가장 최근 수정을 취소하고 이전 버전으로 되돌릴까요?")) return;
    setBusy(true);
    setError("");
    try {
      await postContent({ kind, slug, action: "undo" });
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={undo}
        disabled={busy}
        className="inline-flex items-center gap-1 text-xs text-muted underline-offset-2 hover:text-fg hover:underline disabled:opacity-60"
      >
        <Undo2 size={13} aria-hidden /> {busy ? "되돌리는 중…" : label}
      </button>
      {error && <span className="text-xs">⚠ {error}</span>}
    </span>
  );
}
