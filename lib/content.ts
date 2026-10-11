import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

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

export interface NoteMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

// Content is read synchronously so every page can be prerendered at build time.
function readCollection<T>(dir: string): { meta: T; body: string }[] {
  const full = path.join(CONTENT_DIR, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, file), "utf8"));
      const slug = file.replace(/\.mdx?$/, "");
      return { meta: { slug, ...data } as T, body: content };
    })
    .sort((a, b) =>
      String((b.meta as { date: string }).date).localeCompare(String((a.meta as { date: string }).date)),
    );
}

function render(body: string): string {
  return marked.parse(body, { async: false });
}

export function getProjects(): ProjectMeta[] {
  return readCollection<ProjectMeta>("projects").map((p) => p.meta);
}

export function getProject(slug: string) {
  const item = readCollection<ProjectMeta>("projects").find((p) => p.meta.slug === slug);
  return item ? { meta: item.meta, html: render(item.body) } : null;
}

export function getNotes(): NoteMeta[] {
  return readCollection<NoteMeta>("notes").map((n) => n.meta);
}

export function getNote(slug: string) {
  const item = readCollection<NoteMeta>("notes").find((n) => n.meta.slug === slug);
  return item ? { meta: item.meta, html: render(item.body) } : null;
}
