"use client";

import { FilePlus2 } from "lucide-react";
import { newFileUrl } from "@/lib/edit";

const TEMPLATES = {
  memo: (date: string) => `---\ntitle: "새 메모"\ndate: "${date}"\n---\n\n- \n`,
  note: (date: string) =>
    `---\ntitle: "새 노트 제목"\ndate: "${date}"\ntags: ["회로이론"]\nsummary: "한 줄 요약"\n---\n\n## 배운 것\n\n`,
};

const DIRS = { memo: "content/memos", note: "content/notes" };

// Builds the GitHub "new file" link on click so the template carries today's date.
export function NewFileButton({ kind, label }: { kind: keyof typeof TEMPLATES; label: string }) {
  const open = () => {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const stamp = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    const ext = kind === "memo" ? "md" : "mdx";
    window.open(newFileUrl(DIRS[kind], `${date}-${stamp}-${kind}.${ext}`, TEMPLATES[kind](date)), "_blank", "noopener");
  };
  return (
    <button
      type="button"
      onClick={open}
      title="GitHub 편집기가 새 탭에서 열립니다. 저장(Commit)하면 약 30초 뒤 사이트에 반영됩니다."
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-accent-ink bg-accent-ink px-3 py-2 text-sm font-semibold text-bg transition hover:opacity-90"
    >
      <FilePlus2 size={16} aria-hidden />
      {label}
    </button>
  );
}
