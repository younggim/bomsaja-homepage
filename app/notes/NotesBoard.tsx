"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type { NoteMeta } from "@/lib/docs";
import { NoteEditor } from "@/components/editors/NoteEditor";
import { NotesFilter } from "./NotesFilter";

export function NotesBoard({ notes }: { notes: NoteMeta[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-6">
      {creating ? (
        <NoteEditor onCancel={() => setCreating(false)} onSaved={(slug) => router.push(`/notes/${slug}`)} />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent-ink px-4 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
        >
          <Plus size={16} aria-hidden /> 새 노트
        </button>
      )}
      <NotesFilter notes={notes} />
    </div>
  );
}
