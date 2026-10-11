import type { Metadata } from "next";
import { NoteIndexPage } from "@/components/notes/pages";

export const metadata: Metadata = { title: "Projects" };

export default function Page() {
  return (
    <NoteIndexPage
      kind="projects"
      title="만든 것들"
      desc="소프트웨어에서 시작해 임베디드와 하드웨어로 넓혀 가는 프로젝트 기록입니다. 누구나 글과 파일(회로도, 코드, 사진 등)을 함께 올리고 고칠 수 있어요."
    />
  );
}
