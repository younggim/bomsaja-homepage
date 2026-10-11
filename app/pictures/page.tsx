import type { Metadata } from "next";
import { PageHeader } from "@/components/Cards";
import { PictureGallery } from "./PictureGallery";

export const metadata: Metadata = { title: "Pictures" };

export default function PicturesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader
        eyebrow="Pictures"
        title="사진첩"
        desc="누구나 사진을 올리고 설명을 고칠 수 있는 공용 사진첩입니다. 회로, 실험, 스터디 사진을 나눠 주세요."
      />
      <PictureGallery />
    </div>
  );
}
