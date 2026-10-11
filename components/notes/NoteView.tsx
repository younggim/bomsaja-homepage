"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NOTE_KINDS, type NoteDoc, type NoteKind } from "@/lib/docs";
import { formatDate } from "@/lib/format";
import { NoteEditor } from "@/components/editors/NoteEditor";
import { EditToggleButton, UndoButton } from "@/components/editors/ui";

export function NoteView({ kind, note, html, edited }: { kind: NoteKind; note: NoteDoc; html: string; edited: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="mt-6">
        <NoteEditor
          kind={kind}
          note={note}
          onCancel={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            router.refresh();
          }}
          onDeleted={() => router.push(NOTE_KINDS[kind].path)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 flex items-start justify-between gap-4">
        <time dateTime={note.date} className="block font-mono text-sm text-muted">
          {formatDate(note.date)}
        </time>
        <EditToggleButton onClick={() => setEditing(true)} />
      </div>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{note.title}</h1>
      {note.summary && <p className="mt-3 text-muted">{note.summary}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        {note.tags.map((t) => (
          <span key={t} className="text-sm text-accent-ink">
            #{t}
          </span>
        ))}
        {edited && (
          <span className="ml-auto">
            <UndoButton kind={kind} slug={note.slug} />
          </span>
        )}
      </div>
      <div className="prose-pcb mt-10" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
