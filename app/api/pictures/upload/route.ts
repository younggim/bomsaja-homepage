import { NextResponse, type NextRequest } from "next/server";
import { list } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ALLOWED_TYPES, MAX_FILE_BYTES, MAX_PICTURES, parsePathname, PICTURE_PREFIX } from "@/lib/pictures";

// Issues a short-lived token so the browser uploads straight to Blob storage.
export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!parsePathname(pathname)) throw new Error("잘못된 파일 경로입니다.");
        const { blobs } = await list({ prefix: PICTURE_PREFIX, limit: MAX_PICTURES });
        if (blobs.length >= MAX_PICTURES) throw new Error(`사진은 최대 ${MAX_PICTURES}장까지 올릴 수 있습니다.`);
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_FILE_BYTES,
          addRandomSuffix: false,
          allowOverwrite: false,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
