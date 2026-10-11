"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { ImagePlus, Loader2, PencilLine, Trash2, X } from "lucide-react";
import {
  ALLOWED_TYPES,
  buildPathname,
  cleanMeta,
  extFor,
  MAX_AUTHOR,
  MAX_CAPTION,
  MAX_FILE_BYTES,
  type Picture,
} from "@/lib/pictures";
import { formatDate } from "@/lib/format";

async function fetchPictures(): Promise<Picture[]> {
  const res = await fetch("/api/pictures", { cache: "no-store" });
  if (!res.ok) throw new Error("load failed");
  return ((await res.json()) as { pictures: Picture[] }).pictures;
}

const inputCls =
  "w-full rounded-lg border border-border bg-bg px-3 py-2 text-base outline-none placeholder:text-muted focus:border-accent";

function UploadForm({ onUploaded }: { onUploaded: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [author, setAuthor] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const pick = (list: FileList | null) => {
    setError("");
    const chosen = Array.from(list ?? []);
    const bad = chosen.find((f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_FILE_BYTES);
    if (bad) {
      setError(`${bad.name}: JPG, PNG, WEBP, GIF 형식의 10MB 이하 파일만 올릴 수 있습니다.`);
      setFiles([]);
      return;
    }
    setFiles(chosen);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) return setError("사진을 선택해 주세요.");
    setBusy(true);
    setError("");
    const meta = cleanMeta({ caption, author });
    try {
      for (const [i, file] of files.entries()) {
        setProgress(`${i + 1}/${files.length} 올리는 중…`);
        await upload(buildPathname(meta, extFor(file.type)!), file, {
          access: "public",
          handleUploadUrl: "/api/pictures/upload",
          contentType: file.type,
        });
      }
      setFiles([]);
      setCaption("");
      if (fileRef.current) fileRef.current.value = "";
      onUploaded();
    } catch (err) {
      setError((err as Error).message || "업로드하지 못했습니다.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="flex items-center gap-2 font-bold">
        <ImagePlus size={18} aria-hidden className="text-accent-ink" /> 사진 올리기
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm text-muted">사진 (여러 장 선택 가능, 장당 10MB 이하)</span>
          <input
            ref={fileRef}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            multiple
            onChange={(e) => pick(e.target.files)}
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-spring-soft file:px-3 file:py-2 file:text-fg"
          />
        </label>
        <label>
          <span className="mb-1 block text-sm text-muted">설명</span>
          <input
            value={caption}
            maxLength={MAX_CAPTION}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="예: 처음 납땜한 LED 회로"
            className={inputCls}
          />
        </label>
        <label>
          <span className="mb-1 block text-sm text-muted">올린 사람</span>
          <input
            value={author}
            maxLength={MAX_AUTHOR}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="이름 또는 닉네임"
            className={inputCls}
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-ink px-4 py-2.5 text-sm font-semibold text-bg disabled:opacity-60"
        >
          {busy && <Loader2 size={16} className="animate-spin" aria-hidden />}
          {busy ? progress : files.length > 1 ? `${files.length}장 올리기` : "올리기"}
        </button>
        <p className="text-xs text-muted">개인정보나 타인의 얼굴이 담긴 사진은 올리지 말아 주세요.</p>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-fg">
          ⚠ {error}
        </p>
      )}
    </form>
  );
}

function PictureCard({ picture, onChanged }: { picture: Picture; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(picture.caption);
  const [author, setAuthor] = useState(picture.author);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const call = async (method: "PATCH" | "DELETE", body: object) => {
    setBusy(true);
    setError("");
    const res = await fetch("/api/pictures", {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) {
      setError(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "요청이 실패했습니다.");
      return false;
    }
    return true;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await call("PATCH", { pathname: picture.pathname, caption, author })) {
      setEditing(false);
      onChanged();
    }
  };

  const remove = async () => {
    if (!confirm("이 사진을 삭제할까요? 되돌릴 수 없습니다.")) return;
    if (await call("DELETE", { pathname: picture.pathname })) onChanged();
  };

  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <a href={picture.url} target="_blank" rel="noopener noreferrer" className="block aspect-[4/3] bg-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={picture.url}
          alt={picture.caption || "업로드된 사진"}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </a>
      <div className="flex flex-1 flex-col p-4">
        {editing ? (
          <form onSubmit={save} className="space-y-2">
            <input
              value={caption}
              maxLength={MAX_CAPTION}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="설명"
              aria-label="설명"
              className={inputCls}
            />
            <input
              value={author}
              maxLength={MAX_AUTHOR}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="올린 사람"
              aria-label="올린 사람"
              className={inputCls}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-accent-ink px-3 py-1.5 text-sm font-semibold text-bg disabled:opacity-60"
              >
                {busy ? "저장 중…" : "저장"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setCaption(picture.caption);
                  setAuthor(picture.author);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm"
              >
                <X size={14} aria-hidden /> 취소
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="flex-1 font-semibold">{picture.caption || <span className="text-muted">설명 없음</span>}</p>
            <p className="mt-1 text-xs text-muted">
              {picture.author || "익명"} · {formatDate(picture.uploadedAt.slice(0, 10))}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold hover:border-accent hover:text-accent-ink"
              >
                <PencilLine size={14} aria-hidden /> 편집
              </button>
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted hover:border-spring hover:text-fg"
              >
                <Trash2 size={14} aria-hidden /> 삭제
              </button>
            </div>
          </>
        )}
        {error && (
          <p role="alert" className="mt-2 text-xs font-semibold">
            ⚠ {error}
          </p>
        )}
      </div>
    </li>
  );
}

export function PictureGallery() {
  const [pictures, setPictures] = useState<Picture[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(
    () =>
      fetchPictures().then(
        (list) => {
          setPictures(list);
          setLoadError(false);
        },
        () => setLoadError(true),
      ),
    [],
  );

  useEffect(() => {
    let alive = true;
    fetchPictures().then(
      (list) => alive && setPictures(list),
      () => alive && setLoadError(true),
    );
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <UploadForm onUploaded={load} />
      <section aria-live="polite">
        {loadError ? (
          <p className="text-muted">사진을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
        ) : pictures === null ? (
          <p className="flex items-center gap-2 text-muted">
            <Loader2 size={16} className="animate-spin" aria-hidden /> 사진을 불러오는 중…
          </p>
        ) : pictures.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
            아직 사진이 없습니다. 첫 사진을 올려 주세요!
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">{pictures.length}장</p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pictures.map((p) => (
                <PictureCard key={p.pathname} picture={p} onChanged={load} />
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
