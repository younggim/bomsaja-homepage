import { PencilLine } from "lucide-react";

export function EditButton({ href, label = "수정하기" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub에서 편집합니다. 저장(Commit)하면 약 30초 뒤 사이트에 반영됩니다."
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent-ink"
    >
      <PencilLine size={16} aria-hidden />
      {label}
      <span className="sr-only"> (GitHub 편집기가 새 탭에서 열림)</span>
    </a>
  );
}
