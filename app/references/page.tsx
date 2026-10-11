import type { Metadata } from "next";
import { Suspense } from "react";
import { learningPath, references } from "@/content/references";
import { PageHeader } from "@/components/Cards";
import { ReferenceLibrary } from "./ReferenceLibrary";

export const metadata: Metadata = {
  title: "EE Reference Library",
  description: "컴퓨터공학도가 전자공학으로 건너가며 모은 참고서, 오픈 강의, 도구 모음",
};

export default function ReferencesPage() {
  const path = learningPath.map((id) => references.find((r) => r.id === id)!);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader
        eyebrow="References"
        title="EE Reference Library"
        desc="컴퓨터공학도가 전자공학으로 건너가며 모은 참고서"
      />

      <section
        aria-labelledby="path-title"
        className="mb-12 rounded-2xl border border-border bg-surface p-5 sm:p-6"
      >
        <h2 id="path-title" className="font-bold">
          🌸 CS 전공자를 위한 EE 입문 루트
        </h2>
        <ol className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {path.map((r, i) => (
            <li key={r.id} className="flex items-center gap-2 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-trace font-mono text-xs">
                {i + 1}
              </span>
              <span>
                {r.title}
                <span className="text-muted"> · {r.author}</span>
              </span>
              {i < path.length - 1 && (
                <span aria-hidden className="hidden text-trace sm:inline">
                  ──
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      <Suspense fallback={<p className="text-muted">자료를 불러오는 중…</p>}>
        <ReferenceLibrary />
      </Suspense>

      <p className="mt-16 border-t border-border pt-6 text-xs text-muted">
        분류 체계 참고:{" "}
        <a
          href="https://cafe.naver.com/skkuecmc"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          성균관대 이동통신공학과 카페
        </a>{" "}
        강의 게시판. 카페 게시글과 첨부파일은 옮기지 않았으며, 모든 링크는 공식 공개 페이지입니다.
      </p>
    </div>
  );
}
