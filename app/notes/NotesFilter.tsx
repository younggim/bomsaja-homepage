"use client";

import { useState } from "react";
import type { NoteMeta } from "@/lib/docs";
import { NoteCard } from "@/components/Cards";
import { Chip } from "@/components/Chip";

export function NotesFilter({ notes }: { notes: NoteMeta[] }) {
  const tags = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const [tag, setTag] = useState<string | null>(null);
  const shown = tag ? notes.filter((n) => n.tags.includes(tag)) : notes;

  return (
    <>
      <div role="group" aria-label="태그 필터" className="mb-6 flex flex-wrap gap-2">
        <Chip active={tag === null} onClick={() => setTag(null)}>
          All
        </Chip>
        {tags.map((t) => (
          <Chip key={t} active={tag === t} onClick={() => setTag(t)}>
            #{t}
          </Chip>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((n) => (
          <NoteCard key={n.slug} note={n} />
        ))}
      </div>
    </>
  );
}
