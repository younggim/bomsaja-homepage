// Editable document shapes and their validation, shared by the API (server) and editors (client).
import {
  categories,
  levels,
  refTypes,
  type Reference,
  type RefCategory,
  type RefLevel,
  type RefStatus,
  type RefType,
} from "@/content/references";

export interface NoteDoc {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  body: string;
}
export type NoteMeta = Omit<NoteDoc, "body">;

export interface MemoDoc {
  slug: string;
  title: string;
  date: string;
  pinned: boolean;
  body: string;
}
export type MemoMeta = Omit<MemoDoc, "body">;

export type DocKind = "notes" | "memos" | "references";

export const LIMITS = { title: 120, summary: 300, tag: 20, tags: 8, body: 50_000, refs: 300, refText: 300 };

export const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,79}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function todayKST(): string {
  return new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
}

export function newSlug(): string {
  return `${todayKST()}-${Math.random().toString(36).slice(2, 8).padEnd(4, "0")}`;
}

function cleanDate(v: unknown): string {
  const s = str(v, 10);
  return DATE_RE.test(s) ? s : todayKST();
}

export function cleanNote(input: Partial<NoteDoc>, slug: string): NoteDoc {
  const tags = Array.isArray(input.tags) ? input.tags : String(input.tags ?? "").split(",");
  return {
    slug,
    title: str(input.title, LIMITS.title) || "제목 없음",
    date: cleanDate(input.date),
    tags: tags
      .map((t) => str(String(t).replace(/^#/, ""), LIMITS.tag))
      .filter(Boolean)
      .slice(0, LIMITS.tags),
    summary: str(input.summary, LIMITS.summary),
    body: typeof input.body === "string" ? input.body.slice(0, LIMITS.body) : "",
  };
}

export function cleanMemo(input: Partial<MemoDoc>, slug: string): MemoDoc {
  return {
    slug,
    title: str(input.title, LIMITS.title) || "제목 없음",
    date: cleanDate(input.date),
    pinned: Boolean(input.pinned),
    body: typeof input.body === "string" ? input.body.slice(0, LIMITS.body) : "",
  };
}

const CATEGORY_IDS = categories.map((c) => c.id) as string[];
const TYPE_IDS = refTypes.map((t) => t.id) as string[];
const STATUSES: RefStatus[] = ["읽는 중", "완료", "예정"];

function cleanUrl(v: unknown): string | undefined {
  const s = str(v, 500);
  if (!s) return undefined;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function cleanReference(input: Partial<Reference>): Reference {
  const id = str(input.id, 60).toLowerCase().replace(/[^a-z0-9-]/g, "-") || `ref-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    title: str(input.title, LIMITS.refText) || "제목 없음",
    author: str(input.author, 120) || undefined,
    category: (CATEGORY_IDS.includes(String(input.category)) ? input.category : "circuits") as RefCategory,
    type: (TYPE_IDS.includes(String(input.type)) ? input.type : "book") as RefType,
    level: (levels.includes(input.level as RefLevel) ? input.level : "입문") as RefLevel,
    url: cleanUrl(input.url),
    lang: input.lang === "ko" ? "ko" : "en",
    note: str(input.note, LIMITS.refText),
    status: STATUSES.includes(input.status as RefStatus) ? (input.status as RefStatus) : undefined,
  };
}

export function cleanReferences(items: unknown): Reference[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  return items.slice(0, LIMITS.refs).map((raw) => {
    const ref = cleanReference(raw as Partial<Reference>);
    while (seen.has(ref.id)) ref.id = `${ref.id}-${Math.random().toString(36).slice(2, 5)}`;
    seen.add(ref.id);
    return ref;
  });
}

export function noteMeta({ slug, title, date, tags, summary }: NoteDoc): NoteMeta {
  return { slug, title, date, tags, summary };
}
