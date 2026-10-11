import type { Metadata } from "next";
import { NoteIndexPage } from "@/components/notes/pages";

export const metadata: Metadata = { title: "AI성장" };

export default function Page() {
  return (
    <NoteIndexPage
      kind="ai"
      title="AI와 함께 성장하기"
      desc="AI를 배우고 활용하며 성장한 기록과 자료를 모읍니다. 글을 쓰고 PDF, 이미지, 노트북 파일 등을 첨부할 수 있어요."
    />
  );
}
