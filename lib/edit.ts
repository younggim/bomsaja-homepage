import { profile } from "@/content/profile";

const base = `https://github.com/${profile.repo.name}`;

// Opens the file in GitHub's web editor. Committing there triggers a Vercel redeploy.
export function editUrl(path: string): string {
  return `${base}/edit/${profile.repo.branch}/${path}`;
}

// Opens GitHub's "new file" editor in `dir`, prefilled with `template`.
export function newFileUrl(dir: string, filename: string, template: string): string {
  const qs = new URLSearchParams({ filename, value: template });
  return `${base}/new/${profile.repo.branch}/${dir}?${qs.toString()}`;
}
