import type { Metadata } from "next";
import Link from "next/link";
import { SquareCheck, Square } from "lucide-react";
import { profile, type Skill, type SkillLevel } from "@/content/profile";
import { PageHeader } from "@/components/Cards";

export const metadata: Metadata = { title: "About" };

const LEVEL_STYLE: Record<SkillLevel, string> = {
  "사용 중": "border-accent/50 text-accent-ink",
  "학습 중": "border-spring bg-spring-soft",
  목표: "border-dashed border-trace text-muted",
};

function SkillList({ title, skills }: { title: string; skills: Skill[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-4 space-y-2">
        {skills.map((s) => (
          <li key={s.name} className="flex items-center justify-between gap-3 text-sm">
            <span>{s.name}</span>
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${LEVEL_STYLE[s.level]}`}>
              {s.level}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      {items.length ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted">준비 중</p>
      )}
    </div>
  );
}

export default function AboutPage() {
  const done = profile.roadmap.filter((r) => r.done).length;
  const pct = Math.round((done / profile.roadmap.length) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader eyebrow="About" title={`${profile.nameKo} (${profile.name})`} desc={profile.role} />

      <section className="max-w-3xl space-y-4 leading-8">
        {profile.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Skills · 기술 스택</h2>
        <p className="mt-2 text-sm text-muted">사용 중 / 학습 중 / 목표</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <SkillList title="Software" skills={profile.skills.software} />
          <SkillList title="Hardware (학습 중)" skills={profile.skills.hardware} />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Roadmap · 학습 로드맵</h2>
        <div className="mt-4 flex items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="로드맵 진행률"
          >
            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
          <span className="font-mono text-sm text-muted">
            {done}/{profile.roadmap.length}
          </span>
        </div>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {profile.roadmap.map((r) => (
            <li key={r.label}>
              <Link
                href={`/references?cat=${r.category}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm transition hover:border-accent"
              >
                {r.done ? (
                  <SquareCheck size={18} className="text-accent-ink" aria-label="완료" />
                ) : (
                  <Square size={18} className="text-muted" aria-label="미완료" />
                )}
                <span className={r.done ? "text-muted line-through" : ""}>{r.label}</span>
                <span className="ml-auto text-xs text-muted">참고서 →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 grid gap-8 sm:grid-cols-3">
        <InfoList title="학력" items={profile.education} />
        <InfoList title="수상" items={profile.awards} />
        <InfoList title="자격증" items={profile.certificates} />
      </section>
    </div>
  );
}
