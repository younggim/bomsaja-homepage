import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { PageHeader } from "@/components/Cards";
import { ProjectsFilter } from "./ProjectsFilter";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader
        eyebrow="Projects"
        title="만든 것들"
        desc="소프트웨어에서 시작해 임베디드와 하드웨어로 넓혀 가는 프로젝트 기록입니다."
      />
      <ProjectsFilter projects={getProjects()} />
    </div>
  );
}
