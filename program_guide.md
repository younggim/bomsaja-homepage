# Program Guide — Jaewon Kim (Bomsaja) 개인 홈페이지

> 이 문서는 Claude Code에게 전달하는 개발 지침서입니다.
> 개발 환경은 [claude-hunt 사전 준비 가이드](https://docs.claude-hunt.com/learn/prerequisites)를 기준으로 하며,
> 배포 흐름은 같은 코스의 "Deploy Todo with Vercel" 레슨(Next.js + Bun + GitHub + Vercel)을 그대로 따릅니다.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | `bomsaja-homepage` |
| 주인공 | **김재원 (Jaewon Kim)**, 닉네임 **Bomsaja (봄사자)** |
| 정체성 | **전자공학도를 꿈꾸는 컴퓨터공학 전공자**: 소프트웨어에서 출발해 하드웨어로 넘어가는 중인 사람 |
| 목적 | 자기소개, 학습 기록, 프로젝트 포트폴리오, 연락 창구 |
| 배포 주소 | `https://bomsaja-homepage.vercel.app` (Vercel 자동 생성 주소) |

### 핵심 메시지 (한 줄 소개)
> "코드로 세상을 이해했고, 이제 회로로 세상을 만들고 싶은 컴퓨터공학도"
> *From bits to electrons.*

---

## 2. 개발 환경 (사전 준비)

아래 도구가 모두 설치되어 있어야 합니다. VS Code 터미널(Windows는 PowerShell)에서 각 명령을 실행해 버전이 출력되는지 확인하세요.

```powershell
git --version      # Git
node --version     # Node.js (npm, npx 포함)
bun --version      # Bun: 패키지 매니저 및 실행기
gh --version       # GitHub CLI (gh auth login 완료 상태)
claude --version   # Claude Code
```

- **VS Code**: 편집기. 터미널은 `` Ctrl+` ``로 엽니다.
- **GitHub 계정**: `gh auth status`로 로그인 상태를 확인합니다.
- **Vercel 계정**: GitHub 계정으로 "Continue with GitHub"를 눌러 가입합니다.
- **Claude in Chrome** (선택): 배포한 페이지를 브라우저에서 시각적으로 검증할 때 씁니다.

---

## 3. 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | **Next.js (App Router)** + TypeScript | 코스 실습과 같은 스택이며 Vercel이 자동으로 인식함 |
| 런타임/패키지 | **Bun** (`bun install`, `bun dev`) | 코스 표준 |
| 스타일 | **Tailwind CSS** | 빠른 반응형 레이아웃 |
| 콘텐츠 | `content/` 폴더의 **MDX** 파일 | 블로그와 학습 노트를 코드 수정 없이 추가 |
| 아이콘 | `lucide-react` | 가벼운 SVG 아이콘 |
| 배포 | **Vercel** (GitHub `main` 브랜치 push 시 자동 배포) | 환경 변수 없이 배포 가능 |
| 저장소 | **Vercel Blob** (`bomsaja-pictures`, 서울 icn1, public) | Pictures 사진(4.7), 사이트 내 수정 버전(4.6) |

**제약 사항**: 기본은 외부 API 키나 DB를 쓰지 않는 **정적 사이트**입니다. **예외는 Pictures 페이지와 사이트 내 수정 기능(4.6)**으로, Vercel Blob을 쓰고 `BLOB_READ_WRITE_TOKEN` 환경 변수가 필요합니다. 이 토큰은 Blob 저장소를 프로젝트에 연결할 때 Vercel이 자동으로 넣어 주며, 로컬에서는 `vercel env pull`로 `.env.local`에 받습니다(git에는 올리지 않음).

---

## 4. 사이트 구조 (페이지 명세)

```
/                → Home
/about           → About (전공, 진로, 기술 스택)
/projects        → Projects 목록
/projects/[slug] → 프로젝트 상세
/aim             → AIM&Future (목표와 미래, 누구나 쓰고 고치기)
/aim/[slug]      → AIM&Future 글 상세
/notes           → Lab Notes (학습 기록 / 블로그)
/notes/[slug]    → 노트 상세
/references      → EE Reference Library (전자공학 참고서 모음, 12장 참고)
/memo            → Memo (메모장)
/pictures        → Pictures (누구나 올리고 편집하는 공용 사진첩)
/contact         → Contact
/api/pictures            → 사진 목록(GET), 설명 수정(PATCH), 삭제(DELETE)
/api/pictures/upload     → 브라우저 직접 업로드용 토큰 발급(POST)
/api/content             → Notes/AIM&Future/Memo/References 저장, 삭제, 되돌리기(POST)
```

### 4.1 Home (`/`)
- **Hero**: 이름 `Jaewon Kim`, 닉네임 `Bomsaja`, 한 줄 소개, CTA 버튼 2개(`Projects 보기`, `Contact`).
- **Transition 섹션**: "CS → EE" 여정을 3단계 타임라인으로 시각화합니다.
  1. **Software**: 알고리즘, 자료구조, 웹 개발
  2. **Bridge**: 컴퓨터 구조, 운영체제, 임베디드 C
  3. **Hardware (목표)**: 회로이론, 전자회로, 디지털 설계(Verilog), PCB
- **최근 프로젝트 3개**, **최근 노트 3개** 카드.

### 4.2 About (`/about`)
- 자기소개 문단: 왜 컴퓨터공학에서 전자공학으로 관심이 옮겨 갔는지.
- **기술 스택**을 두 축으로 나눠 표시합니다.
  - *Software*: C, C++, Python, TypeScript, Linux, Git
  - *Hardware (학습 중)*: Arduino, Raspberry Pi, STM32, Verilog/FPGA, KiCad, 오실로스코프/멀티미터
  - 각 항목에 숙련도 배지를 붙입니다: `사용 중` / `학습 중` / `목표`
- **학습 로드맵**: 체크리스트 형태 (예: ☑ 컴퓨터 구조, ☐ 회로이론, ☐ 전자회로 I, ☐ 신호및시스템, ☐ 디지털 시스템 설계).
- 학력, 수상, 자격증 (자리만 마련하고 실제 내용은 `content/profile.ts`에서 채움).

### 4.3 Projects (`/projects`)
- 필터 태그: `All` · `Software` · `Embedded` · `Hardware`
- 카드 구성: 썸네일, 제목, 한 줄 설명, 태그, GitHub 링크
- 초기 예시 데이터 (placeholder, 나중에 실제 프로젝트로 교체):
  - `led-matrix-clock`: Arduino 기반 LED 매트릭스 시계 (Embedded)
  - `riscv-sim`: 간단한 RISC-V 명령어 시뮬레이터 (Software ↔ Hardware 브리지)
  - `fpga-uart`: Verilog로 구현한 UART 송수신기 (Hardware)
  - `bomsaja-homepage`: 지금 이 사이트 (Software)

### 4.4 Lab Notes (`/notes`)
- MDX 기반 학습 기록. frontmatter 형식:
  ```yaml
  ---
  title: "옴의 법칙부터 다시 시작하기"
  date: "2026-10-11"
  tags: ["회로이론", "기초"]
  summary: "CS 전공자가 회로를 처음 공부하며 정리한 노트"
  ---
  ```
- 최신순으로 정렬하고 태그로 필터링합니다.

### 4.5 Contact (`/contact`)
- 상단에 채용 메시지 카드: "삼성전자, LG전자, SK Hynix, 현대자동차와 함께 할 미래를 꿈꾸며 성장하고자 합니다."
- 이메일(`bomsaja890@gmail.com`), 전화(`010-5586-2034`, 누르면 바로 전화)를 둡니다. GitHub 링크는 표시하지 않습니다(`links.github`를 비워 둠). 폼은 만들지 않습니다.
- 실제 값은 `content/profile.ts`의 `links`와 `contactMessage`에서 관리합니다.

### 4.6 사이트 안에서 바로 수정하기 (Notes, AIM&Future, References, Memo)
- **누구나** 로그인 없이 사이트에서 바로 수정하고 저장할 수 있습니다. 저장하면 **Vercel Blob**에 들어가고 즉시 반영됩니다(재배포 없음).
- **Notes**: 목록에 `새 노트`, 상세 페이지에 `수정하기`(제목, 날짜, 요약, 태그, Markdown 본문, 미리보기, 삭제).
- **References**: `자료 추가`, 카드마다 연필 버튼으로 수정과 삭제(분야, 유형, 난이도, 언어, 상태, 링크, 메모).
- **Memo** (`/memo`): `새 메모`, 메모별 `수정하기`, `📌 맨 위에 고정`, 삭제.
- **저장 구조**: 저장할 때마다 불변 버전 파일을 하나 만듭니다.
  `edits/<notes|aims|memos|references>/<slug>/<timestamp>-<rand>.json` → `{ data }` 또는 `{ deleted: true }`
  화면에는 저장소의 원본 파일(`content/notes`, `content/memos`, `content/references.ts`)에 **가장 최신 버전을 덮어** 보여 줍니다. 버전마다 경로가 달라 CDN 캐시 문제가 없습니다.
- **되돌리기**: 수정된 문서에는 `이전 버전으로 되돌리기` 링크가 보입니다. 가장 최신 버전 파일을 지워 직전 상태(또는 저장소 원본)로 돌아갑니다. 삭제도 버전으로 기록되므로 되돌리기로 복구할 수 있습니다.
- **안전장치**
  - Markdown 안의 HTML은 실행하지 않고 글자로 보여 줍니다(`<script>` 등 XSS 차단).
  - 링크와 이미지는 `http(s)`, `mailto`, 상대 경로만 허용하고 `javascript:` 등은 무효화합니다.
  - 참고 자료 링크는 `http(s)`만 저장합니다.
  - 길이 제한: 제목 120자, 요약 300자, 태그 8개, 본문 5만 자, 참고 자료 300개.
- **API**: `POST /api/content` `{ kind, action: save|delete|undo, slug?, data? | items? }`
- **주의**: 누구나 고칠 수 있으므로 장난 편집이 생길 수 있습니다. 되돌리기로 복구하거나, Vercel 대시보드 → Storage → `bomsaja-pictures`의 `edits/` 폴더에서 버전 파일을 직접 정리합니다. 사이트에서 고친 내용은 git에 커밋되지 않으므로, 오래 남길 내용은 가끔 저장소 파일에 옮겨 적는 것을 권장합니다.

### 4.8 AIM&Future (`/aim`)
- 메뉴에서 **Projects 바로 옆**에 있습니다. 목표, 진로, 미래 계획을 적는 공간입니다.
- **Notes와 똑같이** 쓰고 고칩니다: `새 글`, `수정하기`(제목, 날짜, 요약, 태그, Markdown 본문, 미리보기), 삭제, 이전 버전으로 되돌리기. 저장은 4.6과 같은 방식(Vercel Blob 버전, `edits/aims/...`)입니다.
- 저장소 원본은 `content/aims/*.md`이며, 시작용 초안 `my-aim.md`(최종 목표, 1·3·10년 목표, 왜 이 길인가)가 들어 있습니다.
- 구현: Notes와 AIM&Future는 `components/notes/`의 공용 컴포넌트(`NotesBoard`, `NotesFilter`, `NoteView`)와 `NoteEditor`를 `kind`("notes" | "aims")로 나눠 씁니다. 경로와 이름표는 `lib/docs.ts`의 `NOTE_KINDS`에서 관리합니다.

### 4.7 Pictures (`/pictures`)
- **누구나** 로그인 없이 사진을 올리고, 설명과 올린 사람을 편집하고, 삭제할 수 있는 공용 사진첩입니다.
- **업로드**: 브라우저에서 Vercel Blob으로 직접 올립니다(`@vercel/blob/client`의 `upload`). 서버는 짧게 유효한 업로드 토큰만 발급합니다.
- **메타데이터 저장 방식**: 설명과 올린 사람을 Blob 경로에 인코딩합니다.
  `pictures/<timestamp>-<id>/<base64url({c: 설명, a: 올린 사람})>.<ext>`
  목록 조회가 곧 단일 진실 공급원이 되고, 편집은 `rename`으로 처리하므로 별도의 목록 파일(manifest)과 CDN 캐시 불일치 문제가 없습니다.
- **안전장치**
  - 허용 형식: JPG, PNG, WEBP, GIF (SVG 금지: 스크립트 삽입 방지)
  - 장당 최대 10MB, 전체 최대 300장
  - 설명 200자, 올린 사람 30자 제한
  - 서버에서 경로 형식을 검증해 `pictures/` 밖의 파일은 수정하거나 삭제할 수 없음
- **운영 주의**: 누구나 삭제할 수 있으므로 장난이나 부적절한 사진이 올라올 수 있습니다. 문제가 생기면 Vercel 대시보드 → Storage → `bomsaja-pictures`에서 직접 정리하거나, 편집/삭제를 비밀번호로 보호하는 방식으로 바꿉니다.

---

## 5. 디자인 가이드

- **컨셉**: "회로 기판 위의 봄(Spring on a PCB)". 닉네임 *봄사자*의 따뜻함과 전자공학의 정밀함을 함께 담습니다.
- **컬러 토큰** (`:root` CSS 변수로 정의하고 다크 모드를 지원합니다)

| 토큰 | Light | Dark | 용도 |
|---|---|---|---|
| `--bg` | `#FAFAF7` | `#0E1411` | 배경 |
| `--fg` | `#1B1F1D` | `#E6EDE8` | 본문 |
| `--accent` | `#2E8B57` (PCB 그린) | `#4FD18B` | 링크, 강조 |
| `--spring` | `#F4A7B9` (벚꽃 핑크) | `#F7B8C6` | 포인트, 하이라이트 |
| `--trace` | `#C9A227` (구리 배선) | `#E0BE4A` | 구분선, 타임라인 |

- **타이포**: 본문 `Pretendard`, 코드와 수치 `JetBrains Mono`.
- **모티프**: Hero 배경에 얇은 PCB 배선(SVG line + via 점)을 은은하게 깔고, 타임라인 연결선도 배선 모양으로 그립니다.
- **반응형**: 모바일 우선. 좌우 여백 16px 이상, 가로 스크롤이 생기지 않아야 합니다.
- **접근성**: 명도 대비 WCAG AA 이상, 모든 이미지에 `alt`, 키보드 탐색 가능.
- 다크/라이트 토글 버튼을 헤더에 둡니다.

---

## 6. 폴더 구조

```
bomsaja-homepage/
├─ app/
│  ├─ layout.tsx          # 헤더, 푸터, 테마
│  ├─ page.tsx            # Home
│  ├─ about/page.tsx
│  ├─ projects/page.tsx
│  ├─ projects/[slug]/page.tsx
│  ├─ notes/page.tsx
│  ├─ notes/[slug]/page.tsx
│  ├─ references/page.tsx
│  ├─ aim/page.tsx, aim/[slug]/page.tsx
│  ├─ memo/page.tsx
│  ├─ pictures/page.tsx + PictureGallery.tsx
│  ├─ api/pictures/route.ts, api/pictures/upload/route.ts
│  └─ contact/page.tsx
├─ components/            # Timeline, Cards, ThemeToggle, PcbBackground, editors/(NoteEditor, MemoEditor, ReferenceForm), notes/(NotesBoard, NotesFilter, NoteView)
├─ lib/
│  ├─ content.ts          # MDX/MD 읽기 (projects, notes, memos)
│  ├─ docs.ts             # 편집 문서 타입과 검증
│  ├─ store.ts            # Blob 버전 저장, 병합, 되돌리기
│  ├─ markdown.ts         # 안전한 Markdown 렌더러 (XSS 차단)
│  └─ pictures.ts         # 사진 경로 인코딩, 제한 값
├─ content/
│  ├─ profile.ts          # 이름, 소개, 링크, 기술 스택, 로드맵, 저장소 (단일 진실 공급원)
│  ├─ references.ts       # 전자공학 참고서, 강의, 도구 목록 (12장)
│  ├─ projects/*.mdx
│  ├─ notes/*.mdx
│  ├─ aims/*.md           # AIM&Future 원본
│  └─ memos/*.md
├─ public/images/
├─ CLAUDE.md              # Claude Code용 프로젝트 규칙 (아래 8장 참고)
└─ program_guide.md       # 이 문서
```

---

## 7. 개발 단계 (Claude Code 작업 순서)

각 단계가 끝날 때마다 `bun dev`로 `http://localhost:3000`에서 확인하고 커밋합니다.

| 단계 | 작업 | 완료 기준 |
|---|---|---|
| **0. 초기화** | Next.js + TypeScript + Tailwind 프로젝트를 Bun으로 생성하고 `git init` | `bun dev`로 기본 페이지가 뜸 |
| **1. 레이아웃** | 헤더(네비게이션, 테마 토글), 푸터, 컬러 토큰, 폰트 | 전 페이지 공통 레이아웃과 다크 모드 동작 |
| **2. 프로필 데이터** | `content/profile.ts` 작성 | 모든 페이지가 이 파일에서 정보를 읽음 |
| **3. Home** | Hero, CS→EE 타임라인, 최근 카드 | 모바일과 데스크톱 모두 깨지지 않음 |
| **4. About** | 소개, 기술 스택 배지, 로드맵 체크리스트 | 숙련도 배지 3종 표시 |
| **5. Projects** | MDX 로딩, 태그 필터, 상세 페이지 | 필터 동작, 상세 페이지 라우팅 |
| **6. Notes** | MDX 노트 목록과 상세, 태그 | 날짜순 정렬 |
| **7. Contact** | 링크 페이지 | 외부 링크가 새 탭에서 열림 |
| **7.5 References** | `content/references.ts` 작성, 분야 탭, 유형 필터, 검색, 링크 검증 | 모든 링크 응답 200, 분야별 3개 이상 등록 |
| **8. 마감** | 메타 태그(OG 이미지, title, description), 파비콘, `bun run build` 통과 | 빌드 에러 0건 |
| **9. 배포** | GitHub 저장소 생성, push, Vercel import | `.vercel.app` 주소에서 접속됨 |
| **10. 편집 기능** | Notes/References/Memo 사이트 내 수정·저장 (Vercel Blob 버전 저장, 되돌리기) | 저장 즉시 반영, XSS 차단·되돌리기 시험 통과 |
| **12. AIM&Future** | Projects 옆 메뉴, 노트형 쓰기·수정 페이지 | 생성·수정·되돌리기 시험 통과 |
| **11. Pictures** | Vercel Blob 저장소 생성, 업로드/편집/삭제 API, 갤러리 | 실제 Blob에서 업로드→수정→삭제 시험 통과 |

---

## 8. CLAUDE.md에 넣을 규칙

```markdown
# bomsaja-homepage 규칙
- 패키지 매니저는 반드시 Bun (npm/yarn 사용 금지)
- 개인 정보(이름, 링크, 스택)는 content/profile.ts에만 작성하고 하드코딩 금지
- 색상은 CSS 변수 토큰만 사용 (hex 직접 사용 금지)
- 외부 API, 환경 변수, DB를 추가하지 않는다 (예외: Pictures와 사이트 내 수정의 Vercel Blob)
- 커밋 전 `bun run build`와 `bun run lint`가 통과해야 한다
- UI 문구는 한국어 기본, 이름과 섹션 제목은 영어 병기
- 참고 자료는 content/references.ts에만 추가하고, 공개 URL만 등록한다 (로그인 필요, 불법 PDF 금지)
- 참고 자료를 추가하거나 수정한 뒤에는 `bun run check-links`로 링크가 실제로 열리는지 확인한다
- .env.local(토큰)은 절대 커밋하지 않는다
```

---

## 9. 배포 절차 (코스 Deploy 레슨 방식)

> **현재 배포 상태 (2026-10-11)**
> - 사이트: https://bomsaja-homepage.vercel.app
> - GitHub: https://github.com/younggim/bomsaja-homepage (`main` push 시 Vercel 자동 배포)
> - Vercel 팀: `skylogics-8085s-projects`, Blob 저장소: `bomsaja-pictures`

1. **GitHub 저장소 생성 및 push**: Claude Code에게 이렇게 요청합니다.
   > "내 GitHub 계정에 public `bomsaja-homepage` 저장소를 만들고 `main` 브랜치를 push한 뒤 origin을 그 저장소로 설정해줘."
2. **Vercel**: Dashboard → **Add New → Project** → `bomsaja-homepage` 검색 → **Import**.
3. Framework Preset이 **Next.js**로 자동 인식되는지 확인하고, Environment Variables는 **비워 둔 채** **Deploy**를 누릅니다.
4. 생성된 `https://bomsaja-homepage.vercel.app`에 접속해 확인합니다.
5. 이후에는 `main`에 push할 때마다 같은 주소에 자동으로 반영됩니다.
   기능 단위 작업은 브랜치를 만들고 `gh pr create`로 PR을 연 뒤 merge합니다.

---

## 10. 최종 체크리스트

- [ ] 5개 도구(git, node, bun, gh, claude) 버전 확인
- [ ] 모든 페이지가 모바일(375px)과 데스크톱에서 정상 표시
- [ ] 다크/라이트 모드 모두 대비 확보
- [ ] `content/profile.ts`에 실제 정보 입력 (placeholder 제거)
- [ ] `/references`의 모든 외부 링크 정상 동작 (404 없음)
- [ ] `bun run build` 성공
- [ ] Vercel 배포 URL 접속 확인 (Claude in Chrome으로 시각 검증 가능)
- [ ] README에 사이트 주소와 기술 스택 기재

---

## 11. 확장 아이디어 (선택)

- **Hardware Gallery**: 납땜하거나 브레드보드로 만든 회로 사진 갤러리
- **Interactive Circuit**: 간단한 논리 게이트(AND/OR/NOT) 시뮬레이터 위젯을 Home에 배치
- **학습 진행률**: 로드맵 체크리스트를 진행률 바로 시각화
- **영문 버전**: `/en` 경로로 다국어 지원

---

## 12. EE Reference Library (`/references`): 전자공학 참고서 페이지

### 12.1 기획 배경과 참고 출처
- **참고 출처**: [성균관대학교 이동통신공학과 네이버 카페](https://cafe.naver.com/skkuecmc) (2009년 개설)
- 카페 게시글은 회원 전용이라 **본문을 복사하지 않습니다.** 카페의 **강의 게시판 구성(커리큘럼)**과 **링크 메뉴(MIT OCW, i-Campus 등)**를 뼈대로 삼고, 각 주제의 **공개 자료**(교재, 오픈 강의, 도구)를 직접 모읍니다.
- 페이지 하단에 출처를 표기합니다: *"분류 체계 참고: 성균관대 이동통신공학과 카페 강의 게시판"*

### 12.2 카페 구조 분석 결과

| 카페 메뉴 | 내용 | 홈페이지 반영 |
|---|---|---|
| 강의게시판 | 선형 시스템, 디지털통신시스템, 이동통신망, 이동통신시스템설계, RF집적회로, 임베디드시스템응용, 디지털 영상처리, 네트워크 구조 및 설계, 초고속광대역통합망, 모바일 컴퓨팅, 고급운영체제설계, 분산시스템 특론, 알고리즘 특론 등 | **분야(카테고리)**로 재구성 |
| 링크 메뉴 | MIT OpenCourseWare, i-Campus(성균관대 LMS) | **오픈 강의** 유형으로 반영 |
| 논문 게시판 | ICACT 등 학회 마감일, 졸업 논문 | **학회/논문** 유형으로 반영 |
| 관심분야 및 스터디 | LED(조명, 통신), 안드로이드, 아이폰, AI Study | **스터디 주제** 태그로 반영 |

### 12.3 분야 분류 (탭)
CS 전공자가 EE로 넘어가는 순서에 맞춰 **기초에서 응용 순서**로 배치합니다.

| 순서 | 분야 (id) | 카페 강의 매핑 | 다루는 내용 |
|---|---|---|---|
| 1 | 회로 기초 (`circuits`) | (선수 과목) | 회로이론, 전자회로, 소자 |
| 2 | 신호 및 시스템 (`signals`) | 선형 시스템, 디지털 영상처리 | LTI 시스템, 푸리에/라플라스, DSP |
| 3 | 디지털 설계 (`digital`) | 임베디드시스템응용 | 논리설계, Verilog, FPGA, 컴퓨터 구조 |
| 4 | 임베디드 (`embedded`) | 임베디드시스템응용, 고급운영체제설계 | MCU, RTOS, 펌웨어 |
| 5 | 통신 (`comm`) | 디지털통신시스템, 이동통신망, 이동통신시스템설계, 초고속광대역통합망 | 변복조, 정보이론, 무선/이동통신, 5G |
| 6 | RF/아날로그 IC (`rf`) | RF집적회로 | RF 회로, 아날로그 IC 설계 |
| 7 | 네트워크 (`network`) | 네트워크 구조 및 설계, 모바일 컴퓨팅, 분산시스템 특론 | 네트워크 구조, 모바일 컴퓨팅 |
| 8 | 연구/논문 (`research`) | 논문 게시판, IT 영어논문 | 학회, 논문 검색, 논문 작성 |

### 12.4 자료 유형 (필터)
`📘 교재(book)` · `🎓 오픈 강의(course)` · `🛠 도구/시뮬레이터(tool)` · `📄 논문/표준(paper)` · `🧪 실습(practice)`

### 12.5 데이터 스키마 (`content/references.ts`)
```ts
export type RefCategory =
  | "circuits" | "signals" | "digital" | "embedded"
  | "comm" | "rf" | "network" | "research";
export type RefType = "book" | "course" | "tool" | "paper" | "practice";
export type RefLevel = "입문" | "중급" | "심화";

export interface Reference {
  id: string;
  title: string;
  author?: string;        // 교재 저자 또는 강의 기관
  category: RefCategory;
  type: RefType;
  level: RefLevel;
  url?: string;           // 공개 URL만 (교재는 출판사/공식 페이지)
  lang: "ko" | "en";
  note: string;           // 한 줄 추천 이유 (재원 님의 코멘트)
  status?: "읽는 중" | "완료" | "예정";  // 개인 학습 진행 상태
}
```

### 12.6 초기 자료 목록 (Seed)
아래 목록은 초기값입니다. 구현할 때 Claude Code는 **각 URL이 열리는지 확인**하고, 바뀐 주소는 공식 페이지로 고쳐서 등록합니다.

**1. 회로 기초**
- 📘 *Microelectronic Circuits*, Sedra & Smith (중급): 전자회로 표준 교재
- 📘 *The Art of Electronics*, Horowitz & Hill (중급): 실무 감각의 회로 바이블
- 🎓 MIT OCW 6.002 *Circuits and Electronics* (입문)
- 🎓 KOCW 회로이론, 전자회로 강의 (입문, 한국어): kocw.net
- 🛠 Falstad Circuit Simulator (입문): 브라우저 회로 시뮬레이터
- 🛠 LTspice (중급): SPICE 시뮬레이션
- 📘 All About Circuits 온라인 교재 (입문)

**2. 신호 및 시스템**
- 📘 *Signals and Systems*, Oppenheim & Willsky (중급)
- 📘 *Discrete-Time Signal Processing*, Oppenheim & Schafer (심화)
- 🎓 MIT OCW 6.003 *Signals and Systems* (중급)
- 🛠 Python `numpy`/`scipy.signal` 실습 (입문): CS 강점 활용

**3. 디지털 설계**
- 📘 *Digital Design and Computer Architecture*, Harris & Harris (입문)
- 🎓 Nand2Tetris (입문): CS에서 EE로 넘어가는 최고의 다리
- 🎓 MIT OCW 6.004 *Computation Structures* (중급)
- 🧪 HDLBits (입문): 브라우저 Verilog 연습 문제
- 🛠 DigitalJS (입문): 브라우저 Verilog 합성/시뮬레이터 (EDA Playground가 503으로 내려가 있어 교체, 2026-10-11)
- 🛠 Icarus Verilog (중급): 로컬 Verilog 시뮬레이터

**4. 임베디드**
- 📘 *Making Embedded Systems*, Elecia White (중급)
- 🛠 Arduino, STM32 공식 문서 (입문)
- 🎓 FreeRTOS 공식 튜토리얼 (중급)

**5. 통신**
- 📘 *Digital Communications*, Proakis (심화)
- 📘 *Wireless Communications*, Andrea Goldsmith (심화)
- 📘 *Fundamentals of Wireless Communication*, Tse & Viswanath (심화, 저자 공개 PDF)
- 🎓 MIT OCW 6.450 *Principles of Digital Communication I* (심화)
- 📄 3GPP 표준 문서 (심화): 5G NR 규격 원문
- 🛠 GNU Radio (중급): SDR 실습

**6. RF/아날로그 IC**
- 📘 *RF Microelectronics*, Behzad Razavi (심화)
- 📘 *Design of Analog CMOS Integrated Circuits*, Razavi (심화)
- 🎓 Razavi 교수 UCLA 공개 강의 (YouTube) (심화)

**7. 네트워크**
- 📘 *Computer Networking: A Top-Down Approach*, Kurose & Ross (입문)
- 🛠 Wireshark (입문)

**8. 연구/논문**
- 📄 IEEE Xplore (논문 검색), Google Scholar, RISS(국내 학위논문)
- 📄 ICACT (카페 논문 게시판에서 다룬 학회) 공식 사이트
- 📄 IEEE Communications Society 학회 일정

### 12.7 UI 명세
- **상단**: 제목 `EE Reference Library`, 부제 "컴퓨터공학도가 전자공학으로 건너가며 모은 참고서", 검색창(제목, 저자, 메모 검색)
- **분야 탭**: 12.3의 8개 분야 + `All`. 선택한 탭은 URL 쿼리(`?cat=signals`)에 반영해 공유할 수 있게 합니다.
- **필터**: 유형 칩(다중 선택), 난이도(입문/중급/심화), 언어(ko/en)
- **카드**: 유형 아이콘, 제목, 저자, 난이도 배지, 진행 상태 배지, 한 줄 메모, 외부 링크(새 탭, `rel="noopener noreferrer"`)
- **추천 학습 경로**: 페이지 상단에 "CS 전공자를 위한 EE 입문 루트" 카드를 둡니다.
  `Nand2Tetris → Harris & Harris → 6.002 회로 → Oppenheim 신호 → Proakis 통신`
- **About 연동**: About의 학습 로드맵 항목을 누르면 해당 분야 탭(`/references?cat=...`)으로 이동합니다.
- **Home 연동**: "지금 읽는 중" (`status: "읽는 중"`) 자료 3개를 Home에 노출합니다.
- 페이지 하단에 출처 표기(12.1)를 넣습니다.

### 12.8 저작권과 운영 원칙
- 교재 PDF를 업로드하거나 비공식 링크를 걸지 않습니다. 출판사, 저자, 강의 공식 페이지만 링크합니다.
- 네이버 카페 게시글, 첨부파일, 회원 정보는 옮기지 않습니다. 분류 체계만 참고합니다.
- 새 자료를 추가하는 방법은 `content/references.ts`에 항목 하나를 추가하고 커밋, push하는 것입니다. 그러면 Vercel에 자동으로 반영됩니다.
- Claude Code에 요청하는 예시:
  > "references.ts에 '신호 및 시스템' 분야로 *Think DSP* (Allen Downey, 입문, 무료 공개)를 추가하고 링크가 열리는지 확인해줘."
