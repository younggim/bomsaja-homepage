import type { Metadata } from "next";
import { getNotes } from "@/lib/content";
import { PageHeader } from "@/components/Cards";
import { NotesFilter } from "./NotesFilter";

export const metadata: Metadata = { title: "Lab Notes" };

export default function NotesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader
        eyebrow="Lab Notes"
        title="학습 노트"
        desc="컴퓨터공학도의 시선으로 전자공학을 공부하며 정리한 기록입니다."
      />
      <NotesFilter notes={getNotes()} />
    </div>
  );
}
