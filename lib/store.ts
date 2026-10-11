// Inline edits live in Vercel Blob as immutable revisions:
//   edits/<kind>/<slug>/<timestamp>-<rand>.json   →  { deleted?: true, data?: ... }
// The newest revision per slug overrides the repo file. Unique pathnames mean the CDN
// never serves a stale version, and older revisions make "undo" a simple delete.
import { del, list, put } from "@vercel/blob";
import { references as repoReferences, type Reference } from "@/content/references";
import { getRepoMemos, getRepoNotes } from "./content";
import type { DocKind, MemoDoc, NoteDoc, NoteKind } from "./docs";

const PREFIX = "edits/";
const REV_RE = /^edits\/(notes|aims|memos|references)\/([a-z0-9-]+)\/(\d{13})-[a-z0-9]+\.json$/;

interface Revision {
  slug: string;
  ts: number;
  url: string;
  pathname: string;
}

interface RevisionBody<T> {
  deleted?: boolean;
  data?: T;
}

async function listRevisions(kind: DocKind): Promise<Map<string, Revision[]>> {
  const bySlug = new Map<string, Revision[]>();
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: `${PREFIX}${kind}/`, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      const m = REV_RE.exec(blob.pathname);
      if (!m) continue;
      const rev = { slug: m[2], ts: Number(m[3]), url: blob.url, pathname: blob.pathname };
      bySlug.set(rev.slug, [...(bySlug.get(rev.slug) ?? []), rev]);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  for (const revs of bySlug.values()) revs.sort((a, b) => b.ts - a.ts);
  return bySlug;
}

async function readRevision<T>(rev: Revision): Promise<RevisionBody<T> | null> {
  try {
    const res = await fetch(rev.url, { cache: "force-cache" }); // revisions are immutable
    return res.ok ? ((await res.json()) as RevisionBody<T>) : null;
  } catch {
    return null;
  }
}

// Repo docs overridden by their newest Blob revision; slugs only in Blob are added.
async function merge<T extends { slug: string }>(
  kind: DocKind,
  seed: T[],
): Promise<{ docs: T[]; edited: Set<string> }> {
  const docs = new Map(seed.map((d) => [d.slug, d]));
  const edited = new Set<string>();
  let revisions: Map<string, Revision[]>;
  try {
    revisions = await listRevisions(kind);
  } catch {
    return { docs: seed, edited }; // Blob unavailable: fall back to repo content
  }
  await Promise.all(
    [...revisions.entries()].map(async ([slug, revs]) => {
      const body = await readRevision<T>(revs[0]);
      if (!body) return;
      edited.add(slug);
      if (body.deleted) docs.delete(slug);
      else if (body.data) docs.set(slug, { ...body.data, slug });
    }),
  );
  return { docs: [...docs.values()], edited };
}

const byDateDesc = <T extends { date: string }>(a: T, b: T) => b.date.localeCompare(a.date);

export async function loadNotes(kind: NoteKind = "notes") {
  const { docs, edited } = await merge<NoteDoc>(kind, getRepoNotes(kind));
  return { notes: docs.sort(byDateDesc), edited };
}

export async function loadMemos() {
  const { docs, edited } = await merge<MemoDoc>("memos", getRepoMemos());
  docs.sort(byDateDesc);
  return { memos: [...docs.filter((m) => m.pinned), ...docs.filter((m) => !m.pinned)], edited };
}

export async function loadReferences(): Promise<{ items: Reference[]; edited: boolean }> {
  const seed = [{ slug: "all", items: repoReferences }];
  const { docs, edited } = await merge<{ slug: string; items: Reference[] }>("references", seed);
  return { items: docs[0]?.items ?? repoReferences, edited: edited.has("all") };
}

export async function saveRevision<T>(kind: DocKind, slug: string, body: RevisionBody<T>) {
  const rand = Math.random().toString(36).slice(2, 8).padEnd(4, "0");
  await put(`${PREFIX}${kind}/${slug}/${Date.now()}-${rand}.json`, JSON.stringify(body), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 31_536_000,
  });
}

// Removes the newest revision so the previous one (or the repo file) shows again.
export async function undoRevision(kind: DocKind, slug: string): Promise<boolean> {
  const revs = (await listRevisions(kind)).get(slug);
  if (!revs?.length) return false;
  await del(revs[0].pathname);
  return true;
}
