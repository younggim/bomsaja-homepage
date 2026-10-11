import { profile } from "@/content/profile";

const STATUS = {
  done: { label: "완료", dot: "bg-accent", text: "text-accent-ink" },
  now: { label: "진행 중", dot: "bg-spring", text: "text-fg" },
  next: { label: "목표", dot: "bg-bg border-2 border-trace", text: "text-muted" },
} as const;

export function Timeline() {
  return (
    <ol className="relative grid gap-6 md:grid-cols-3 md:gap-4">
      {/* copper trace connecting the stages */}
      <span
        aria-hidden
        className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-trace/60 md:left-3 md:right-3 md:top-[11px] md:bottom-auto md:h-0.5 md:w-auto"
      />
      {profile.journey.map((step, i) => {
        const s = STATUS[step.status];
        return (
          <li key={step.stage} className="relative pl-10 md:pl-0 md:pt-10">
            <span
              aria-hidden
              className={`absolute left-0 top-0 h-6 w-6 rounded-full ring-4 ring-bg ${s.dot}`}
            />
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="font-mono text-xs text-muted">
                STEP {i + 1} · {step.stage}
              </p>
              <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
              <p className={`mt-1 text-xs font-semibold ${s.text}`}>{s.label}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {step.items.map((item) => (
                  <li key={item} className="rounded-full border border-border px-2.5 py-1 text-xs">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
