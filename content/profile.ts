import type { RefCategory } from "./references";

export type SkillLevel = "사용 중" | "학습 중" | "목표";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface RoadmapItem {
  label: string;
  done: boolean;
  category: RefCategory;
}

export const profile = {
  name: "Jaewon Kim",
  nameKo: "김재원",
  nickname: "Bomsaja",
  nicknameKo: "봄사자",
  tagline: "코드로 세상을 이해했고, 이제 회로로 세상을 만들고 싶은 컴퓨터공학도",
  motto: "From bits to electrons.",
  role: "Computer Science student · Aspiring Electronics Engineer",
  siteUrl: "https://bomsaja-homepage.vercel.app",
  // GitHub 저장소: 수정하기 버튼이 이 저장소의 웹 편집기를 엽니다.
  repo: { name: "younggim/bomsaja-homepage", branch: "main" },

  about: [
    "컴퓨터공학을 전공하며 알고리즘과 운영체제, 웹 개발을 배웠습니다. 그런데 코드를 깊이 파고들수록 그 코드를 실제로 실행하는 회로와 전자가 궁금해졌습니다.",
    "명령어 한 줄이 트랜지스터의 스위칭이 되고, 그 신호가 안테나를 통해 공기 중으로 퍼져 나가는 과정을 처음부터 끝까지 이해하고 싶습니다. 그래서 지금은 회로이론과 신호 및 시스템, 디지털 설계를 공부하며 전자공학으로 건너가는 중입니다.",
    "이 사이트는 그 여정의 기록입니다. 배운 것은 Lab Notes에, 만든 것은 Projects에, 공부한 자료는 References에 모아 둡니다.",
  ],

  journey: [
    {
      stage: "Software",
      title: "소프트웨어",
      status: "done" as const,
      items: ["알고리즘", "자료구조", "웹 개발"],
    },
    {
      stage: "Bridge",
      title: "브리지",
      status: "now" as const,
      items: ["컴퓨터 구조", "운영체제", "임베디드 C"],
    },
    {
      stage: "Hardware",
      title: "하드웨어 (목표)",
      status: "next" as const,
      items: ["회로이론", "전자회로", "디지털 설계(Verilog)", "PCB"],
    },
  ],

  skills: {
    software: [
      { name: "C", level: "사용 중" },
      { name: "C++", level: "사용 중" },
      { name: "Python", level: "사용 중" },
      { name: "TypeScript", level: "사용 중" },
      { name: "Linux", level: "사용 중" },
      { name: "Git", level: "사용 중" },
    ] satisfies Skill[],
    hardware: [
      { name: "Arduino", level: "학습 중" },
      { name: "Raspberry Pi", level: "학습 중" },
      { name: "STM32", level: "목표" },
      { name: "Verilog / FPGA", level: "학습 중" },
      { name: "KiCad", level: "목표" },
      { name: "오실로스코프 / 멀티미터", level: "목표" },
    ] satisfies Skill[],
  },

  roadmap: [
    { label: "컴퓨터 구조", done: true, category: "digital" },
    { label: "회로이론", done: false, category: "circuits" },
    { label: "전자회로 I", done: false, category: "circuits" },
    { label: "신호 및 시스템", done: false, category: "signals" },
    { label: "디지털 시스템 설계", done: false, category: "digital" },
    { label: "임베디드 시스템", done: false, category: "embedded" },
    { label: "디지털 통신", done: false, category: "comm" },
  ] satisfies RoadmapItem[],

  // TODO: 실제 정보로 채워 주세요. 빈 배열이면 화면에 "준비 중"으로 표시됩니다.
  education: [] as string[],
  awards: [] as string[],
  certificates: [] as string[],

  // 빈 문자열이면 Contact 페이지에서 숨겨집니다.
  links: {
    email: "bomsaja890@gmail.com",
    phone: "010-5586-2034",
    github: "https://github.com/younggim",
    linkedin: "",
  },

  contactMessage: {
    title: "SK hynix · 삼성전자 · LG전자에서 필요하시면 언제든 달려가겠습니다!",
    body: "반도체, 전자회로, 임베디드, 통신 분야라면 어디든 배우고 기여할 준비가 되어 있습니다. 인턴, 채용, 프로젝트 제안 모두 환영합니다.",
  },
};
