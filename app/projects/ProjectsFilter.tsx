"use client";

import { useState } from "react";
import type { ProjectMeta, ProjectTag } from "@/lib/content";
import { ProjectCard } from "@/components/Cards";
import { Chip } from "@/components/Chip";

const FILTERS: ("All" | ProjectTag)[] = ["All", "Software", "Embedded", "Hardware"];

export function ProjectsFilter({ projects }: { projects: ProjectMeta[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <>
      <div role="group" aria-label="태그 필터" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}
