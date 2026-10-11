import { NextResponse, type NextRequest } from "next/server";
import { cleanMemo, cleanNote, cleanReferences, newSlug, SLUG_RE, type DocKind } from "@/lib/docs";
import { saveRevision, undoRevision } from "@/lib/store";

interface Body {
  kind?: DocKind;
  action?: "save" | "delete" | "undo";
  slug?: string;
  data?: Record<string, unknown>;
  items?: unknown;
}

const KINDS: DocKind[] = ["notes", "aims", "memos", "references"];

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Anyone may save, delete, or undo. Every save is a new revision, so undo restores the previous one.
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Body | null;
  if (!body?.kind || !KINDS.includes(body.kind)) return fail("잘못된 요청입니다.");
  const { kind, action = "save" } = body;

  const slug = kind === "references" ? "all" : body.slug || (action === "save" ? newSlug() : "");
  if (kind !== "references" && !SLUG_RE.test(slug)) return fail("잘못된 문서 주소입니다.");

  try {
    if (action === "undo") {
      return (await undoRevision(kind, slug))
        ? NextResponse.json({ slug })
        : fail("되돌릴 수정 기록이 없습니다.", 404);
    }
    if (action === "delete") {
      if (kind === "references") return fail("참고 자료 목록 전체는 삭제할 수 없습니다.");
      await saveRevision(kind, slug, { deleted: true });
      return NextResponse.json({ slug });
    }
    if (kind === "references") {
      const items = cleanReferences(body.items);
      if (!items.length) return fail("자료가 하나 이상 있어야 합니다.");
      await saveRevision(kind, slug, { data: { slug, items } });
      return NextResponse.json({ slug });
    }
    const data = kind === "memos" ? cleanMemo(body.data ?? {}, slug) : cleanNote(body.data ?? {}, slug);
    await saveRevision(kind, slug, { data });
    return NextResponse.json({ slug });
  } catch {
    return fail("저장하지 못했습니다. 잠시 후 다시 시도해 주세요.", 500);
  }
}
