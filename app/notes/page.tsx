import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { loadNotes } from "@/lib/store";
import { noteMeta } from "@/lib/docs";
import { PageHeader } from "@/components/Cards";
import { NotesBoard } from "@/components/notes/NotesBoard";

export const metadata: Metadata = { title: "Lab Notes" };

async function NotesSection() {
  await connection();
  const { notes } = await loadNotes();
  return <NotesBoard kind="notes" notes={notes.map(noteMeta)} />;
}

export default function NotesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader
        eyebrow="Lab Notes"
        title="학습 노트"
        desc="컴퓨터공학도의 시선으로 전자공학을 공부하며 정리한 기록입니다. 누구나 노트를 쓰고 고칠 수 있어요."
      />
      <Suspense fallback={<p className="text-muted">노트를 불러오는 중…</p>}>
        <NotesSection />
      </Suspense>
    </div>
  );
}
