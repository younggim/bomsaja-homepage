"use client";

import { Moon, Sun } from "lucide-react";

function currentTheme(): "light" | "dark" {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const toggle = () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  // Both icons render; CSS tokens decide which one is visible, so server and client markup match.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="다크/라이트 모드 전환"
      className="rounded-md p-2 text-muted hover:text-fg"
    >
      <Sun size={18} className="theme-icon-sun" />
      <Moon size={18} className="theme-icon-moon" />
    </button>
  );
}
