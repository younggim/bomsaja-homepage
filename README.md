# Bomsaja · 봄사자

**Jaewon Kim (김재원)**의 개인 홈페이지입니다. 전자공학도를 꿈꾸는 컴퓨터공학 전공자의 기록을 담았습니다.

> From bits to electrons.

- 사이트: https://bomsaja-homepage.vercel.app
- 기획 문서: [program_guide.md](program_guide.md)

## 기술 스택

Next.js (App Router) · TypeScript · Bun · Tailwind CSS · Vercel

## 페이지

| 경로 | 내용 |
|---|---|
| `/` | Hero, CS→EE 타임라인, 최근 프로젝트·노트·읽는 중인 자료 |
| `/about` | 자기소개, 기술 스택, 학습 로드맵 |
| `/projects` | 프로젝트 (태그 필터, 상세 페이지) |
| `/notes` | Lab Notes 학습 기록 |
| `/references` | EE Reference Library: 전자공학 참고서 모음 |
| `/contact` | 연락처 |

## 개발

```bash
bun install
bun dev              # http://localhost:3000
bun run build        # 배포 전 빌드 확인
bun run check-links  # 참고 자료 링크 검증
```

## 콘텐츠 수정

| 하고 싶은 일 | 수정할 파일 |
|---|---|
| 이름, 소개, 스택, 로드맵, 연락처 | `content/profile.ts` |
| 참고 자료 추가 | `content/references.ts` |
| 프로젝트 추가 | `content/projects/<slug>.mdx` |
| 학습 노트 추가 | `content/notes/<slug>.mdx` |

`main` 브랜치에 push하면 Vercel에 자동으로 배포됩니다.
