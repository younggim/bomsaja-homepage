// Picture metadata (caption, author) lives inside the blob pathname, so listing is the
// single source of truth and edits are a rename — no shared manifest to go stale.
//   pictures/<timestamp>-<id>/<base64url({c,a})>.<ext>

export const PICTURE_PREFIX = "pictures/";
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_PICTURES = 300;
export const MAX_CAPTION = 200;
export const MAX_AUTHOR = 30;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const PATH_RE = /^pictures\/(\d{13})-([a-z0-9]{6,16})\/([A-Za-z0-9_-]{2,1200})\.(jpg|png|webp|gif)$/;

export interface PictureMeta {
  caption: string;
  author: string;
}

export interface Picture extends PictureMeta {
  pathname: string;
  url: string;
  uploadedAt: string;
  size: number;
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function cleanMeta(meta: Partial<PictureMeta>): PictureMeta {
  return {
    caption: String(meta.caption ?? "").trim().slice(0, MAX_CAPTION),
    author: String(meta.author ?? "").trim().slice(0, MAX_AUTHOR),
  };
}

export function extFor(contentType: string): string | undefined {
  return EXT_BY_TYPE[contentType];
}

export function buildPathname(meta: PictureMeta, ext: string, folder?: string): string {
  const dir = folder ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10).padEnd(6, "0")}`;
  const encoded = toBase64Url(JSON.stringify({ c: meta.caption, a: meta.author }));
  return `${PICTURE_PREFIX}${dir}/${encoded}.${ext}`;
}

export function parsePathname(pathname: string): (PictureMeta & { folder: string; ext: string }) | null {
  const m = PATH_RE.exec(pathname);
  if (!m) return null;
  try {
    const data = JSON.parse(fromBase64Url(m[3])) as { c?: string; a?: string };
    return { ...cleanMeta({ caption: data.c, author: data.a }), folder: `${m[1]}-${m[2]}`, ext: m[4] };
  } catch {
    return null;
  }
}
