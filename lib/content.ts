import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { MemoDoc, NoteDoc } from "./docs";

export type { NoteMeta, MemoMeta } from "./docs";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Repo content is read synchronously; it is the seed that Blob edits (lib/store.ts) override.
function readCollection<T>(dir: string): { meta: T; body: string }[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, file), "utf8"));
      const slug = file.replace(/\.mdx?$/, "");
      return { meta: { slug, ...data } as T, body: content.trim() };
    })
    .sort((a, b) =>
      String((b.meta as { date: string }).date).localeCompare(String((a.meta as { date: string }).date)),
    );
}

// Repo folder for each note kind.
const NOTE_DIRS = { notes: "notes", aims: "aims", ai: "ai-growth", prompts: "prompt-loop", projects: "projects" } as const;

export function getRepoNotes(kind: keyof typeof NOTE_DIRS = "notes"): NoteDoc[] {
  const dir = NOTE_DIRS[kind];
  return readCollection<Omit<NoteDoc, "body"> & { github?: string }>(dir).map(({ meta: { github, ...meta }, body }) => ({
    ...meta,
    tags: meta.tags ?? [],
    // Project frontmatter may carry a repo link; surface it in the body so it stays editable.
    body: github ? `${body}\n\n[GitHub 저장소](${github})` : body,
  }));
}

export function getRepoMemos(): MemoDoc[] {
  return readCollection<Omit<MemoDoc, "body">>("memos").map(({ meta, body }) => ({
    ...meta,
    pinned: Boolean(meta.pinned),
    body,
  }));
}
