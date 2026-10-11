import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProject, getProjects } from "@/lib/content";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return project ? { title: project.meta.title, description: project.meta.summary } : {};
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { meta, html } = project;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent-ink">
        <ArrowLeft size={14} aria-hidden /> Projects
      </Link>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {meta.tags.map((t) => (
          <span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs">
            {t}
          </span>
        ))}
      </div>
      <h1 className="mt-3 font-mono text-3xl font-bold sm:text-4xl">{meta.title}</h1>
      <p className="mt-3 text-muted">{meta.summary}</p>
      {meta.github && (
        <a
          href={meta.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-accent-ink underline underline-offset-4"
        >
          GitHub 저장소
        </a>
      )}
      <div className="prose-pcb mt-10" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
