import type { Metadata } from "next";
import { NoteDocPage, staticParamsFor } from "@/components/notes/pages";

export const metadata: Metadata = { title: "AIM&Future" };

export function generateStaticParams() {
  return staticParamsFor("aims");
}

export default function Page({ params }: PageProps<"/aim/[slug]">) {
  return <NoteDocPage kind="aims" params={params} />;
}
