import { NextResponse, type NextRequest } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { FILE_LIMITS, FILE_PATH_RE, FILE_TYPES, fileExt } from "@/lib/docs";

const ALLOWED = [...new Set(Object.values(FILE_TYPES))];

// Issues a short-lived token so the browser uploads attachments straight to Blob storage.
export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!FILE_PATH_RE.test(pathname) || !FILE_TYPES[fileExt(pathname)]) {
          throw new Error("허용되지 않는 파일입니다.");
        }
        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: FILE_LIMITS.bytes,
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
