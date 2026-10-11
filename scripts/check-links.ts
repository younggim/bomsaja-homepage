// Verifies that every reference URL responds. Run with `bun run check-links`.
import { references } from "../content/references";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36";

// Official pages that open in a browser but block or stall automated requests (Akamai/Cloudflare).
const BOT_BLOCKED = new Set(["ltspice", "stm32", "allaboutcircuits", "gnuradio"]);

async function check(url: string): Promise<number> {
  for (const method of ["HEAD", "GET"] as const) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        headers: { "user-agent": UA },
        signal: AbortSignal.timeout(20_000),
      });
      if (res.ok || method === "GET") return res.status;
    } catch {
      if (method === "GET") return 0;
    }
  }
  return 0;
}

const targets = references.filter((r) => r.url);
const results = await Promise.all(
  targets.map(async (r) => ({ id: r.id, url: r.url!, status: await check(r.url!) })),
);

let failed = 0;
for (const r of results) {
  const ok = r.status >= 200 && r.status < 400;
  const blocked = !ok && BOT_BLOCKED.has(r.id);
  const mark = ok ? "OK " : blocked ? "BOT" : "ERR";
  if (!ok && !blocked) failed++;
  console.log(`${mark} ${String(r.status).padStart(3)}  ${r.id.padEnd(20)} ${r.url}`);
}
console.log(`\n${targets.length} links, ${failed} failed`);
process.exit(failed ? 1 : 0);
