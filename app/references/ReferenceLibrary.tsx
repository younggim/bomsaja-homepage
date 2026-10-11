"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PencilLine, Plus, Search } from "lucide-react";
import {
  categories,
  levels,

  refTypes,
  type RefCategory,
  type RefLevel,
  type RefType,
  type Reference,
} from "@/content/references";
import { ReferenceCard } from "@/components/Cards";
import { Chip } from "@/components/Chip";
import { ReferenceForm } from "@/components/editors/ReferenceForm";
import { UndoButton } from "@/components/editors/ui";
import { postContent } from "@/lib/api";

const CATEGORY_IDS = categories.map((c) => c.id) as string[];

export function ReferenceLibrary({ items, edited }: { items: Reference[]; edited: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const catParam = searchParams.get("cat");
  const cat: RefCategory | "all" = catParam && CATEGORY_IDS.includes(catParam) ? (catParam as RefCategory) : "all";

  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<RefType[]>([]);
  const [level, setLevel] = useState<RefLevel | null>(null);
  const [lang, setLang] = useState<"ko" | "en" | null>(null);

  const setCat = (next: RefCategory | "all") => {
    const qs = next === "all" ? "" : `?cat=${next}`;
    router.replace(`${pathname}${qs}`, { scroll: false });
  };

  const toggleType = (t: RefType) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (r) =>
        (cat === "all" || r.category === cat) &&
        (types.length === 0 || types.includes(r.type)) &&
        (!level || r.level === level) &&
        (!lang || r.lang === lang) &&
        (!q || [r.title, r.author ?? "", r.note].some((s) => s.toLowerCase().includes(q))),
    );
  }, [items, cat, types, level, lang, query]);

  const current = categories.find((c) => c.id === cat);
  const hasFilters = types.length > 0 || level || lang || query;

  // Inline editing: "new" for the add form, an id for an open card editor, or null.
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const commit = async (next: Reference[]) => {
    setBusy(true);
    setError("");
    try {
      await postContent({ kind: "references", items: next });
      setEditing(null);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const saveItem = (ref: Reference) => {
    if (editing === "new") return commit([ref, ...items]);
    commit(items.map((r) => (r.id === editing ? { ...ref, id: r.id } : r)));
  };

  const deleteItem = (id: string) => {
    if (!confirm("이 자료를 삭제할까요? '이전 버전으로 되돌리기'로 복구할 수 있습니다.")) return;
    commit(items.filter((r) => r.id !== id));
  };

  const openEditor = (id: string) => {
    setError("");
    setEditing(id);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {editing !== "new" && (
          <button
            type="button"
            onClick={() => openEditor("new")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent-ink px-4 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
          >
            <Plus size={16} aria-hidden /> 자료 추가
          </button>
        )}
        {edited && <UndoButton kind="references" slug="all" label="마지막 수정 되돌리기" />}
      </div>
      {editing === "new" && (
        <div className="mb-6">
          <ReferenceForm
            defaultCategory={cat === "all" ? undefined : cat}
            busy={busy}
            error={error}
            onSave={saveItem}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <label className="relative block">
        <span className="sr-only">자료 검색</span>
        <Search size={18} aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목, 저자, 메모로 검색"
          className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-base outline-none placeholder:text-muted focus:border-accent"
        />
      </label>

      <div
        role="tablist"
        aria-label="분야"
        className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {[{ id: "all" as const, label: "All" }, ...categories].map((c) => (
          <button
            key={c.id}
            role="tab"
            type="button"
            aria-selected={cat === c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-lg border px-3.5 py-2 text-sm transition ${
              cat === c.id
                ? "border-accent-ink bg-accent-ink text-bg font-semibold"
                : "border-border bg-surface hover:border-accent"
            }`}
          >
            {c.label}
            <span className="ml-1.5 font-mono text-xs opacity-70">
              {c.id === "all" ? items.length : items.filter((r) => r.category === c.id).length}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <p className="mt-3 text-sm text-muted">
          {current.desc} <span className="opacity-80">· 카페 강의: {current.cafe}</span>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 text-sm">
        <div role="group" aria-label="유형" className="flex flex-wrap items-center gap-2">
          <span className="w-12 shrink-0 text-muted">유형</span>
          {refTypes.map((t) => (
            <Chip key={t.id} active={types.includes(t.id)} onClick={() => toggleType(t.id)}>
              <span aria-hidden>{t.icon} </span>
              {t.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div role="group" aria-label="난이도" className="flex flex-wrap items-center gap-2">
            <span className="w-12 shrink-0 text-muted">난이도</span>
            {levels.map((l) => (
              <Chip key={l} active={level === l} onClick={() => setLevel(level === l ? null : l)}>
                {l}
              </Chip>
            ))}
          </div>
          <div role="group" aria-label="언어" className="flex flex-wrap items-center gap-2">
            <span className="w-12 shrink-0 text-muted sm:w-auto">언어</span>
            <Chip active={lang === "ko"} onClick={() => setLang(lang === "ko" ? null : "ko")}>
              한국어
            </Chip>
            <Chip active={lang === "en"} onClick={() => setLang(lang === "en" ? null : "en")}>
              English
            </Chip>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-muted" aria-live="polite">
        <span>{shown.length}개 자료</span>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTypes([]);
              setLevel(null);
              setLang(null);
            }}
            className="underline underline-offset-2 hover:text-fg"
          >
            필터 초기화
          </button>
        )}
      </div>

      {shown.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) =>
            editing === r.id ? (
              <ReferenceForm
                key={r.id}
                item={r}
                busy={busy}
                error={error}
                onSave={saveItem}
                onCancel={() => setEditing(null)}
                onDelete={() => deleteItem(r.id)}
              />
            ) : (
              <div key={r.id} className="relative">
                <ReferenceCard item={r} />
                <button
                  type="button"
                  onClick={() => openEditor(r.id)}
                  aria-label={`${r.title} 수정하기`}
                  title="수정하기"
                  className="absolute bottom-3 right-3 z-20 rounded-md border border-border bg-surface p-1.5 text-muted transition hover:border-accent hover:text-accent-ink"
                >
                  <PencilLine size={14} aria-hidden />
                </button>
              </div>
            ),
          )}
        </div>
      ) : (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-muted">
          조건에 맞는 자료가 없습니다.
        </p>
      )}
    </div>
  );
}
