import type { Metadata } from "next";
import { NoteDocPage, staticParamsFor } from "@/components/notes/pages";

export const metadata: Metadata = { title: "AI성장" };

export function generateStaticParams() {
  return staticParamsFor("ai");
}

export default function Page({ params }: PageProps<"/ai-growth/[slug]">) {
  return <NoteDocPage kind="ai" params={params} />;
}
