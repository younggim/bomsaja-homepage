import type { Metadata } from "next";
import { NoteDocPage, staticParamsFor } from "@/components/notes/pages";

export const metadata: Metadata = { title: "프롬프트&루프 연구" };

export function generateStaticParams() {
  return staticParamsFor("prompts");
}

export default function Page({ params }: PageProps<"/prompt-loop/[slug]">) {
  return <NoteDocPage kind="prompts" params={params} />;
}
