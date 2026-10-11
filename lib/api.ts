import type { DocKind } from "./docs";

export async function postContent(body: {
  kind: DocKind;
  action?: "save" | "delete" | "undo";
  slug?: string;
  data?: object;
  items?: object[];
}): Promise<{ slug: string }> {
  const res = await fetch("/api/content", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { slug?: string; error?: string };
  if (!res.ok) throw new Error(json.error ?? "요청이 실패했습니다.");
  return { slug: json.slug ?? "" };
}

export function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
