import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { loadNotes } from "@/lib/store";
import { noteMeta } from "@/lib/docs";
import { PageHeader } from "@/components/Cards";
import { NotesBoard } from "@/components/notes/NotesBoard";

export const metadata: Metadata = { title: "AIM&Future" };

async function AimSection() {
  await connection();
  const { notes } = await loadNotes("aims");
  return <NotesBoard kind="aims" notes={notes.map(noteMeta)} />;
}

export default function AimPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader
        eyebrow="AIM&Future"
        title="목표와 미래"
        desc="어디를 향해 가고 있는지, 무엇을 이루고 싶은지 적어 두는 곳입니다. 노트처럼 편하게 쓰고 고칠 수 있어요."
      />
      <Suspense fallback={<p className="text-muted">불러오는 중…</p>}>
        <AimSection />
      </Suspense>
    </div>
  );
}
