import type { Metadata } from "next";
import { BriefcaseBusiness, FolderGit2, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { PageHeader } from "@/components/Cards";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const { email, github, linkedin } = profile.links;
  const links = [
    email && { label: "Email", value: email, href: `mailto:${email}`, icon: Mail, external: false },
    github && { label: "GitHub", value: github.replace(/^https?:\/\//, ""), href: github, icon: FolderGit2, external: true },
    linkedin && {
      label: "LinkedIn",
      value: linkedin.replace(/^https?:\/\//, ""),
      href: linkedin,
      icon: BriefcaseBusiness,
      external: true,
    },
  ].filter(Boolean) as { label: string; value: string; href: string; icon: typeof Mail; external: boolean }[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <PageHeader
        eyebrow="Contact"
        title="연락하기"
        desc="회로, 임베디드, 통신 이야기라면 언제든 환영합니다. 스터디나 프로젝트 제안도 좋아요."
      />
      {links.length ? (
        <ul className="space-y-3">
          {links.map(({ label, value, href, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition hover:border-accent"
              >
                <Icon size={22} aria-hidden className="text-accent-ink" />
                <span>
                  <span className="block text-sm text-muted">{label}</span>
                  <span className="font-mono break-all">{value}</span>
                </span>
                {external && <span className="sr-only"> (새 탭에서 열림)</span>}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
          연락처를 준비 중입니다.
        </p>
      )}
    </div>
  );
}
