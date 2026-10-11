"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Download, FileText, Image as ImageIcon, Loader2, Paperclip, X } from "lucide-react";
import { FILE_LIMITS, FILE_TYPES, fileExt, filePathname, type Attachment, type DocKind } from "@/lib/docs";

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const ACCEPT = Object.keys(FILE_TYPES)
  .map((e) => `.${e}`)
  .join(",");

// Editor section: uploads files immediately and keeps the list until the document is saved.
export function AttachmentsField({
  kind,
  slug,
  value,
  onChange,
  onBusy,
}: {
  kind: DocKind;
  slug: string;
  value: Attachment[];
  onChange: (next: Attachment[]) => void;
  onBusy: (busy: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const pick = async (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    setError("");
    if (value.length + files.length > FILE_LIMITS.perDoc) {
      setError(`첨부 파일은 최대 ${FILE_LIMITS.perDoc}개까지 올릴 수 있습니다.`);
      return;
    }
    const bad = files.find((f) => !FILE_TYPES[fileExt(f.name)] || f.size > FILE_LIMITS.bytes);
    if (bad) {
      setError(`${bad.name}: 지원하지 않는 형식이거나 20MB를 넘습니다.`);
      return;
    }
    onBusy(true);
    const added: Attachment[] = [];
    try {
      for (const [i, file] of files.entries()) {
        setProgress(`${i + 1}/${files.length} 올리는 중…`);
        const type = FILE_TYPES[fileExt(file.name)];
        const res = await upload(filePathname(kind, slug, file.name), file, {
          access: "public",
          handleUploadUrl: "/api/files/upload",
          contentType: type,
        });
        added.push({ name: file.name, url: res.url, size: file.size, type });
      }
    } catch (e) {
      setError((e as Error).message || "업로드하지 못했습니다.");
    } finally {
      if (added.length) onChange([...value, ...added]);
      onBusy(false);
      setProgress("");
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-sm text-muted">첨부 자료 (PDF, 이미지, 문서, 코드, ZIP · 파일당 20MB)</span>
        <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-accent">
          {progress ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Paperclip size={14} aria-hidden />}
          {progress || "파일 추가"}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            disabled={!!progress}
            onChange={(e) => pick(e.target.files)}
            className="sr-only"
          />
        </label>
      </div>
      {value.length > 0 && (
        <ul className="space-y-1.5 rounded-lg border border-border bg-bg p-2">
          {value.map((a) => (
            <li key={a.url} className="flex items-center gap-2 text-sm">
              <FileIcon type={a.type} />
              <span className="min-w-0 flex-1 truncate">{a.name}</span>
              <span className="shrink-0 text-xs text-muted">{formatSize(a.size)}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x.url !== a.url))}
                aria-label={`${a.name} 첨부 빼기`}
                className="shrink-0 rounded p-1 text-muted hover:text-fg"
              >
                <X size={14} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="mt-1 text-sm font-semibold">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function FileIcon({ type }: { type: string }) {
  const Icon = type.startsWith("image/") ? ImageIcon : FileText;
  return <Icon size={16} aria-hidden className="shrink-0 text-accent-ink" />;
}

// Read-only list shown on the document page.
// `compact` is for lists inside cards (memos, references); the default suits a full document page.
export function AttachmentList({ items, compact = false }: { items: Attachment[]; compact?: boolean }) {
  if (!items.length) return null;
  return (
    <section
      aria-label="첨부 자료"
      className={compact ? "relative z-10 mt-3" : "mt-10 rounded-xl border border-border bg-surface p-5"}
    >
      <h2 className={`flex items-center gap-2 font-bold ${compact ? "text-sm" : ""}`}>
        <Paperclip size={16} aria-hidden /> 첨부 자료 <span className="font-mono text-sm text-muted">{items.length}</span>
      </h2>
      <ul className={`mt-2 grid gap-2 ${compact ? "" : "sm:grid-cols-2"}`}>
        {items.map((a) => (
          <li key={a.url}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border bg-bg p-3 transition hover:border-accent"
            >
              {a.type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.url} alt="" className="h-10 w-10 shrink-0 rounded object-cover" loading="lazy" />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-spring-soft font-mono text-[10px] font-bold uppercase">
                  {fileExt(a.name).slice(0, 4)}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{a.name}</span>
                <span className="text-xs text-muted">{formatSize(a.size)}</span>
              </span>
              <Download size={16} aria-hidden className="shrink-0 text-muted" />
              <span className="sr-only"> (새 탭에서 열림)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
