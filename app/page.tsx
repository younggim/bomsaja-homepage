import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { profile } from "@/content/profile";
import { Suspense } from "react";
import { connection } from "next/server";
import { loadNotes, loadReferences } from "@/lib/store";
import { noteMeta } from "@/lib/docs";
import { PcbBackground } from "@/components/PcbBackground";
import { Timeline } from "@/components/Timeline";
import { NoteCard, ReferenceCard } from "@/components/Cards";

function SectionTitle({ title, href, eyebrow }: { title: string; href?: string; eyebrow: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="font-mono text-xs text-accent-ink">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-bold">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm text-muted hover:text-accent-ink">
          전체 보기 <ArrowRight size={14} aria-hidden />
        </Link>
      )}
    </div>
  );
}

const GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

function CardsFallback() {
  return <p className="text-sm text-muted">불러오는 중…</p>;
}

async function RecentNotes() {
  await connection();
  const { notes } = await loadNotes();
  return (
    <div className={GRID}>
      {notes.slice(0, 3).map(noteMeta).map((n) => (
        <NoteCard key={n.slug} note={n} />
      ))}
    </div>
  );
}

async function RecentProjects() {
  await connection();
  const { notes } = await loadNotes("projects");
  return (
    <div className={GRID}>
      {notes.slice(0, 3).map(noteMeta).map((n) => (
        <NoteCard key={n.slug} note={n} basePath="/projects" />
      ))}
    </div>
  );
}

async function NowReading() {
  await connection();
  const { items } = await loadReferences();
  const reading = items.filter((r) => r.status === "읽는 중").slice(0, 3);
  if (!reading.length) return <p className="text-sm text-muted">지금 읽고 있는 자료가 없습니다.</p>;
  return (
    <div className={GRID}>
      {reading.map((r) => (
        <ReferenceCard key={r.id} item={r} />
      ))}
    </div>
  );
}

export default function Home() {

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <PcbBackground />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
            <span className="h-2 w-2 rounded-full bg-spring" aria-hidden />
            {profile.role}
          </p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            {profile.name}
            <span className="mt-2 block text-2xl font-bold text-muted sm:text-3xl">
              {profile.nameKo} · <span className="text-accent-ink">{profile.nickname}</span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg">{profile.tagline}</p>
          <p className="mt-2 font-mono text-sm text-muted">{profile.motto}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-lg bg-accent-ink px-5 py-3 text-sm font-semibold text-bg transition hover:opacity-90"
            >
              Projects 보기
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold transition hover:border-accent"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 pt-16 sm:px-6">
        <section aria-labelledby="journey">
          <SectionTitle eyebrow="CS → EE" title="From bits to electrons" />
          <span id="journey" className="sr-only">
            컴퓨터공학에서 전자공학으로
          </span>
          <Timeline />
        </section>

        <section>
          <SectionTitle eyebrow="Projects" title="최근 프로젝트" href="/projects" />
          <Suspense fallback={<CardsFallback />}>
            <RecentProjects />
          </Suspense>
        </section>

        <section>
          <SectionTitle eyebrow="Lab Notes" title="최근 노트" href="/notes" />
          <Suspense fallback={<CardsFallback />}>
            <RecentNotes />
          </Suspense>
        </section>

        <section>
          <SectionTitle eyebrow="Now Reading" title="지금 읽는 중" href="/references" />
          <Suspense fallback={<CardsFallback />}>
            <NowReading />
          </Suspense>
        </section>
      </div>
    </>
  );
}
