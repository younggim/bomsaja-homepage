import type { Metadata } from "next";
import { NoteIndexPage } from "@/components/notes/pages";

export const metadata: Metadata = { title: "프롬프트&루프 연구" };

export default function Page() {
  return (
    <NoteIndexPage
      kind="prompts"
      title="프롬프트 & 루프 연구"
      desc="프롬프트 설계, 에이전트 루프, 실험 결과를 정리하는 연구 노트입니다. 실험 파일과 자료를 함께 올릴 수 있어요."
    />
  );
}
