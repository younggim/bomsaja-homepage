import { Marked, type Token } from "marked";

// Anyone can edit notes and memos, so rendering must never execute user-supplied markup:
// raw HTML is shown as text and links/images may only use http(s), mailto, or relative URLs.

const SAFE_PROTOCOLS = new Set(["http", "https", "mailto"]);

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function isSafeHref(href: string): boolean {
  const normalized = href
    .replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);?/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&colon;?/gi, ":")
    .replace(/[\u0000- \u007f-\u009f]/g, "");
  const proto = /^([a-z][a-z0-9+.-]*):/i.exec(normalized);
  return !proto || SAFE_PROTOCOLS.has(proto[1].toLowerCase());
}

const md = new Marked({
  gfm: true,
  walkTokens(token: Token) {
    if ((token.type === "link" || token.type === "image") && !isSafeHref(token.href)) token.href = "#";
  },
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
  },
});

export function renderMarkdown(body: string): string {
  return md.parse(body, { async: false });
}
