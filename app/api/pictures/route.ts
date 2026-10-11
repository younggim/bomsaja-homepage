import { connection, NextResponse, type NextRequest } from "next/server";
import { del, list, rename } from "@vercel/blob";
import { buildPathname, cleanMeta, parsePathname, PICTURE_PREFIX, type Picture } from "@/lib/pictures";

async function listPictures(): Promise<Picture[]> {
  const pictures: Picture[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PICTURE_PREFIX, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      const meta = parsePathname(blob.pathname);
      if (!meta) continue;
      pictures.push({
        pathname: blob.pathname,
        url: blob.url,
        uploadedAt: new Date(blob.uploadedAt).toISOString(),
        size: blob.size,
        caption: meta.caption,
        author: meta.author,
      });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return pictures.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET() {
  await connection();
  return NextResponse.json({ pictures: await listPictures() }, { headers: { "cache-control": "no-store" } });
}

// Edit caption/author: the metadata is part of the pathname, so this is a rename.
export async function PATCH(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { pathname?: string; caption?: string; author?: string } | null;
  const current = body?.pathname ? parsePathname(body.pathname) : null;
  if (!body?.pathname || !current) return badRequest("잘못된 사진 경로입니다.");

  const next = buildPathname(cleanMeta(body), current.ext, current.folder);
  if (next === body.pathname) return NextResponse.json({ pathname: next });
  try {
    const result = await rename(body.pathname, next, { access: "public" });
    return NextResponse.json({ pathname: result.pathname, url: result.url });
  } catch {
    return NextResponse.json({ error: "수정하지 못했습니다. 이미 삭제된 사진일 수 있습니다." }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { pathname?: string } | null;
  if (!body?.pathname || !parsePathname(body.pathname)) return badRequest("잘못된 사진 경로입니다.");
  await del(body.pathname);
  return NextResponse.json({ ok: true });
}
