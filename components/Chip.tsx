"use client";

import type { ReactNode } from "react";

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
        active
          ? "border-accent-ink bg-accent-ink text-bg"
          : "border-border bg-surface text-fg hover:border-accent"
      }`}
    >
      {children}
    </button>
  );
}
