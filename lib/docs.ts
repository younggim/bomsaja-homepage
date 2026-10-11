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

export interface Attachment {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface NoteDoc {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  body: string;
  attachments?: Attachment[];
}
export type NoteMeta = Omit<NoteDoc, "body" | "attachments"> & { attachmentCount?: number };

export interface MemoDoc {
  slug: string;
  title: string;
  date: string;
  pinned: boolean;
  body: string;
}
export type MemoMeta = Omit<MemoDoc, "body">;

export type NoteKind = "notes" | "aims" | "ai" | "prompts";
export type DocKind = NoteKind | "memos" | "references";
export const NOTE_KIND_IDS: NoteKind[] = ["notes", "aims", "ai", "prompts"];

// Note-shaped collections share the editor and pages; only paths and labels differ.
export const NOTE_KINDS: Record<NoteKind, { path: string; title: string; item: string; itemObj: string; itemSubj: string }> = {
  notes: { path: "/notes", title: "Lab Notes", item: "노트", itemObj: "노트를", itemSubj: "노트가" },
  aims: { path: "/aim", title: "AIM&Future", item: "글", itemObj: "글을", itemSubj: "글이" },
  ai: { path: "/ai-growth", title: "AI성장", item: "자료", itemObj: "자료를", itemSubj: "자료가" },
  prompts: { path: "/prompt-loop", title: "프롬프트&루프 연구", item: "연구 노트", itemObj: "연구 노트를", itemSubj: "연구 노트가" },
};

// Attachments: files uploaded to Blob under files/<kind>/<slug>/<timestamp>-<safe-name>.
export const FILE_LIMITS = { bytes: 20 * 1024 * 1024, perDoc: 20, name: 120 };
export const FILE_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  txt: "text/plain",
  md: "text/markdown",
  csv: "text/csv",
  json: "application/json",
  ipynb: "application/x-ipynb+json",
  py: "text/x-python",
  zip: "application/zip",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  hwp: "application/x-hwp",
};
export const FILE_PATH_RE = new RegExp(
  `^files/(${NOTE_KIND_IDS.join("|")})/[a-z0-9][a-z0-9-]{1,79}/\\d{13}-[A-Za-z0-9._-]{1,100}$`,
);

export function fileExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export function filePathname(kind: NoteKind, slug: string, name: string): string {
  const ext = fileExt(name);
  const base = name
    .slice(0, name.length - ext.length - 1)
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";
  return `files/${kind}/${slug}/${Date.now()}-${base}.${ext}`;
}

function cleanAttachments(v: unknown): Attachment[] {
  if (!Array.isArray(v)) return [];
  return v
    .slice(0, FILE_LIMITS.perDoc)
    .map((a) => a as Partial<Attachment>)
    .filter((a) => {
      try {
        const u = new URL(String(a.url));
        return (
          u.protocol === "https:" &&
          u.hostname.endsWith(".public.blob.vercel-storage.com") &&
          FILE_PATH_RE.test(decodeURIComponent(u.pathname.slice(1)))
        );
      } catch {
        return false;
      }
    })
    .map((a) => ({
      name: str(a.name, FILE_LIMITS.name) || "file",
      url: String(a.url),
      size: Math.max(0, Number(a.size) || 0),
      type: str(a.type, 120),
    }));
}

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
    attachments: cleanAttachments(input.attachments),
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

export function noteMeta({ slug, title, date, tags, summary, attachments }: NoteDoc): NoteMeta {
  return { slug, title, date, tags, summary, attachmentCount: attachments?.length ?? 0 };
}
