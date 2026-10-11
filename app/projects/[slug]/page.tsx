import type { Metadata } from "next";
import { NoteDocPage, staticParamsFor } from "@/components/notes/pages";

export const metadata: Metadata = { title: "Projects" };

export function generateStaticParams() {
  return staticParamsFor("projects");
}

export default function Page({ params }: PageProps<"/projects/[slug]">) {
  return <NoteDocPage kind="projects" params={params} />;
}
