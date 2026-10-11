import type { Metadata } from "next";
import { NoteIndexPage } from "@/components/notes/pages";

export const metadata: Metadata = { title: "AIM&Future" };

export default function Page() {
  return (
    <NoteIndexPage
      kind="aims"
      title="목표와 미래"
      desc="어디를 향해 가고 있는지, 무엇을 이루고 싶은지 적어 두는 곳입니다. 노트처럼 편하게 쓰고 고칠 수 있어요."
    />
  );
}
