@AGENTS.md

# bomsaja-homepage 규칙

전체 기획은 [program_guide.md](program_guide.md)를 따른다.

- 패키지 매니저는 반드시 Bun (npm/yarn 사용 금지)
- 개인 정보(이름, 링크, 스택)는 content/profile.ts에만 작성하고 하드코딩 금지
- 색상은 CSS 변수 토큰만 사용 (hex 직접 사용 금지). 토큰은 app/globals.css에 정의
- 외부 API, 환경 변수, DB를 추가하지 않는다 (예외: Pictures와 사이트 내 수정의 Vercel Blob, program_guide 4.6·4.7)
- 사용자 입력 Markdown은 반드시 lib/markdown.ts의 renderMarkdown으로 렌더링한다 (XSS 차단)
- .env.local(토큰)은 절대 커밋하지 않는다
- 커밋 전 `bun run build`가 통과해야 한다
- UI 문구는 한국어 기본, 이름과 섹션 제목은 영어 병기
- 참고 자료는 content/references.ts에만 추가하고, 공개 URL만 등록한다 (로그인 필요, 불법 PDF 금지)
- 참고 자료를 추가하거나 수정한 뒤에는 `bun run check-links`로 링크가 실제로 열리는지 확인한다
- 프로젝트는 content/projects/*.mdx, 학습 노트는 content/notes/*.mdx, AIM&Future는 content/aims/*.md, 메모는 content/memos/*.md에 frontmatter와 함께 추가한다
