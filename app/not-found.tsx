import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm text-accent-ink">404 · OPEN CIRCUIT</p>
      <h1 className="mt-3 text-3xl font-bold">회로가 끊겼어요</h1>
      <p className="mt-3 text-muted">찾는 페이지가 없습니다.</p>
      <Link href="/" className="mt-8 inline-block rounded-lg bg-accent-ink px-5 py-3 text-sm font-semibold text-bg">
        홈으로
      </Link>
    </div>
  );
}
