import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { loadMemos } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown";
import { PageHeader } from "@/components/Cards";
import { MemoBoard } from "./MemoBoard";

export const metadata: Metadata = { title: "Memo" };

async function MemoSection() {
  await connection();
  const { memos, edited } = await loadMemos();
  return (
    <MemoBoard
      memos={memos.map((m) => ({ memo: m, html: renderMarkdown(m.body), edited: edited.has(m.slug) }))}
    />
  );
}

export default function MemoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <PageHeader
        eyebrow="Memo"
        title="메모장"
        desc="떠오른 아이디어, 할 일, 짧은 기록을 남겨 두는 곳입니다. 누구나 메모를 쓰고 고칠 수 있어요."
      />
      <Suspense fallback={<p className="text-muted">메모를 불러오는 중…</p>}>
        <MemoSection />
      </Suspense>
    </div>
  );
}
