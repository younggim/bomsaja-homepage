import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © 2026 {profile.name} ({profile.nickname})
        </p>
        <p className="font-mono">{profile.motto}</p>
      </div>
    </footer>
  );
}
