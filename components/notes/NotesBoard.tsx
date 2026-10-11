"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { NOTE_KINDS, type NoteKind, type NoteMeta } from "@/lib/docs";
import { NoteEditor } from "@/components/editors/NoteEditor";
import { NotesFilter } from "./NotesFilter";

export function NotesBoard({ kind, notes }: { kind: NoteKind; notes: NoteMeta[] }) {
  const { path, item, itemSubj } = NOTE_KINDS[kind];
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-6">
      {creating ? (
        <NoteEditor kind={kind} onCancel={() => setCreating(false)} onSaved={(slug) => router.push(`${path}/${slug}`)} />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent-ink px-4 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
        >
          <Plus size={16} aria-hidden /> 새 {item}
        </button>
      )}
      {notes.length ? (
        <NotesFilter notes={notes} basePath={path} />
      ) : (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">아직 {itemSubj} 없습니다.</p>
      )}
    </div>
  );
}
