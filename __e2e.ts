const B = process.argv[2] ?? "http://localhost:3125";
const post = async (b: object) => { const r = await fetch(`${B}/api/content`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) }); return { status: r.status, ...(await r.json()) }; };
const page = async (p: string) => (await fetch(`${B}${p}`, { cache: "no-store" })).text();
const ok = (label: string, cond: boolean) => console.log(cond ? "PASS" : "FAIL", label);

// 1. create note with XSS attempts
const created = await post({ kind: "notes", data: { title: "E2E 테스트 노트", tags: "테스트, e2e", summary: "요약", body: "## 안녕\n\n<script>alert(1)</script>\n\n[나쁜 링크](javascript:alert(1)) [좋은 링크](https://example.com)\n\n<img src=x onerror=alert(1)>" } });
ok("create note", created.status === 200 && !!created.slug);
let html = await page(`/notes/${created.slug}`);
ok("new note page renders", html.includes("E2E 테스트 노트"));
ok("script escaped", !html.includes("<script>alert(1)</script>") && html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
ok("img onerror escaped", !html.includes("<img src=x onerror"));
ok("javascript: link neutralized", !/href="javascript:/i.test(html) && html.includes('href="https://example.com"'));
ok("listed on /notes", (await page("/notes")).includes("E2E 테스트 노트"));

// 2. edit repo note, then undo
await post({ kind: "notes", slug: "ohms-law-restart", data: { title: "수정된 옴의 법칙", date: "2026-10-11", tags: ["회로이론"], summary: "s", body: "수정 본문" } });
ok("repo note edited", (await page("/notes/ohms-law-restart")).includes("수정된 옴의 법칙"));
await post({ kind: "notes", slug: "ohms-law-restart", action: "undo" });
ok("undo restores repo note", (await page("/notes/ohms-law-restart")).includes("옴의 법칙부터 다시 시작하기"));

// 3. delete new note, then cleanup via undo x2
await post({ kind: "notes", slug: created.slug, action: "delete" });
ok("deleted note 404", (await fetch(`${B}/notes/${created.slug}`)).status === 404 || !(await page(`/notes/${created.slug}`)).includes("E2E 테스트 노트"));
await post({ kind: "notes", slug: created.slug, action: "undo" });
await post({ kind: "notes", slug: created.slug, action: "undo" });

// 4. memo create + cleanup
const memo = await post({ kind: "memos", data: { title: "E2E 메모", pinned: true, body: "- 하나" } });
ok("memo shows", (await page("/memo")).includes("E2E 메모"));
await post({ kind: "memos", slug: memo.slug, action: "undo" });
ok("memo removed by undo", !(await page("/memo")).includes("E2E 메모"));

// 5. references add + undo
const refsHtml = await page("/references");
const before = Number(/All<!-- -->.*?(\d+)/s.exec(refsHtml)?.[1] ?? 0);
await post({ kind: "references", items: [{ title: "E2E 자료", url: "javascript:alert(1)", category: "comm", type: "book", level: "입문", lang: "ko", note: "n" }] });
const after = await page("/references");
ok("references saved & bad url dropped", after.includes("E2E 자료") && !after.includes("javascript:alert"));
await post({ kind: "references", action: "undo" });
ok("references undo restores", (await page("/references")).includes("Microelectronic Circuits") && !(await page("/references")).includes("E2E 자료"));

// 6. validation
ok("bad slug rejected", (await post({ kind: "notes", slug: "../x", data: {} })).status === 400);
ok("bad kind rejected", (await post({ kind: "pictures" })).status === 400);
