import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown } from "./markdown";
import type { MemoDoc, NoteDoc } from "./docs";

export type ProjectTag = "Software" | "Embedded" | "Hardware";

export interface ProjectMeta {
  slug: string;
  title: string;
  summary: string;
  tags: ProjectTag[];
  date: string;
  github?: string;
  sample?: boolean;
}

export type { NoteMeta, MemoMeta } from "./docs";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Repo content is read synchronously; it is the seed that Blob edits (lib/store.ts) override.
function readCollection<T>(dir: string): { meta: T; body: string }[] {
  const full = path.join(CONTENT_DIR, dir);
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

export function getProjects(): ProjectMeta[] {
  return readCollection<ProjectMeta>("projects").map((p) => p.meta);
}

export function getProject(slug: string) {
  const item = readCollection<ProjectMeta>("projects").find((p) => p.meta.slug === slug);
  return item ? { meta: item.meta, html: renderMarkdown(item.body) } : null;
}

export function getRepoNotes(dir: "notes" | "aims" = "notes"): NoteDoc[] {
  return readCollection<Omit<NoteDoc, "body">>(dir).map(({ meta, body }) => ({
    ...meta,
    tags: meta.tags ?? [],
    body,
  }));
}

export function getRepoMemos(): MemoDoc[] {
  return readCollection<Omit<MemoDoc, "body">>("memos").map(({ meta, body }) => ({
    ...meta,
    pinned: Boolean(meta.pinned),
    body,
  }));
}
