"use client";

import { useRef, useState } from "react";
import { defaultSiteData } from "@/data/site";
import {
  MAX_CONCERN_CARDS,
  MAX_WHY_CARDS,
  type SiteData,
} from "@/types/site";
import LandingPreview from "./LandingPreview";
import ChannelLinksEditor from "./ChannelLinksEditor";
import ContentSectionEditor from "./ContentSectionEditor";
import ServicePhotosEditor from "./ServicePhotosEditor";

const fieldClassName =
  "mt-2 w-full rounded-lg border border-black/15 bg-white px-3 py-3 text-[15px] leading-relaxed text-[#111111] outline-none focus:border-black/40";

export default function EditorScreen() {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [imageStatus, setImageStatus] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  async function handleHeroImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImageUploading(true);
    setImageStatus("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/hero-image", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { path?: string; error?: string };

      if (!response.ok || !result.path) {
        setImageStatus(result.error ?? "이미지를 저장하지 못했습니다.");
        return;
      }

      const savedImagePath = result.path;
      setData((current) => ({
        ...current,
        hero: {
          ...current.hero,
          image: savedImagePath,
        },
      }));
      setImageStatus("대표 이미지가 저장되었습니다. 배포하면 랜딩페이지에도 유지됩니다.");
    } catch {
      setImageStatus("이미지를 저장하지 못했습니다. 로컬 개발 서버에서 다시 시도해주세요.");
    } finally {
      setImageUploading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f4f2] md:h-dvh md:flex-row md:overflow-hidden">
      <aside className="border-b border-black/10 bg-white px-5 py-6 md:w-[360px] md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r">
        <p className="text-[11px] font-medium tracking-[0.18em] text-[#666666]">
          EDITOR
        </p>
        <h1 className="mt-2 text-[22px] font-medium tracking-[-0.02em] text-[#111111]">
          랜딩페이지 편집
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-[#666666]">
          입력한 내용이 옆 미리보기에 바로 보여요.
          <br />
          상호명, 메인 제목, 소개 문구는 새로고침하면 처음 내용으로 돌아갑니다.
          <br />
          대표 이미지, 서비스 카드, 시술 사진, 예약 및 채널, 고민 섹션, 샵 설명
          설정은 프로젝트에 저장되어 배포 후에도 유지됩니다.
        </p>

        <div className="mt-8 space-y-6">
          <label className="block">
            <span className="text-[14px] font-medium text-[#111111]">상호명</span>
            <input
              type="text"
              value={data.siteName}
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  siteName: event.target.value,
                }))
              }
              className={fieldClassName}
            />
          </label>

          <label className="block">
            <span className="text-[14px] font-medium text-[#111111]">
              메인 제목
            </span>
            <textarea
              rows={3}
              value={data.hero.title}
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  hero: { ...current.hero, title: event.target.value },
                }))
              }
              className={`${fieldClassName} resize-y`}
            />
            <span className="mt-1.5 block text-[12px] text-[#888888]">
              줄을 바꾸려면 엔터를 누르세요.
            </span>
          </label>

          <label className="block">
            <span className="text-[14px] font-medium text-[#111111]">
              소개 문구
            </span>
            <textarea
              rows={4}
              value={data.hero.description}
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  hero: { ...current.hero, description: event.target.value },
                }))
              }
              className={`${fieldClassName} resize-y`}
            />
            <span className="mt-1.5 block text-[12px] text-[#888888]">
              줄을 바꾸려면 엔터를 누르세요.
            </span>
          </label>

          <div>
            <p className="text-[14px] font-medium text-[#111111]">대표 이미지</p>
            <input
              ref={heroImageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={handleHeroImageChange}
            />
            <button
              type="button"
              disabled={imageUploading}
              onClick={() => heroImageInputRef.current?.click()}
              className="mt-2 inline-flex h-[44px] items-center justify-center rounded-lg border border-black/15 bg-white px-4 text-[14px] font-medium text-[#111111] disabled:opacity-50"
            >
              {imageUploading ? "저장 중..." : "사진 선택"}
            </button>
            {imageStatus ? (
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#888888]">
                {imageStatus}
              </p>
            ) : (
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#888888]">
                jpg, png, webp 파일을 선택할 수 있습니다.
              </p>
            )}
          </div>

          <ChannelLinksEditor data={data} setData={setData} />

          <ContentSectionEditor
            data={data}
            setData={setData}
            sectionKey="concerns"
            heading="고민 섹션"
            helpText="제목과 카드 내용, 표시 여부는 저장되면 새로고침과 배포 후에도 유지됩니다. 숨기면 랜딩페이지에서 이 섹션이 사라집니다. 카드는 최대 6개까지 등록할 수 있습니다."
            addLabel="+ 고민 추가"
            deleteConfirm="이 고민 카드를 삭제할까요?"
            maxCards={MAX_CONCERN_CARDS}
          />

          <ContentSectionEditor
            data={data}
            setData={setData}
            sectionKey="why"
            heading="샵 설명"
            helpText="제목과 장점 카드, 표시 여부는 저장되면 새로고침과 배포 후에도 유지됩니다. 숨기면 랜딩페이지에서 이 섹션이 사라집니다. 카드는 최대 6개까지 등록할 수 있습니다."
            addLabel="+ 장점 추가"
            deleteConfirm="이 장점 카드를 삭제할까요?"
            maxCards={MAX_WHY_CARDS}
          />

          <ServicePhotosEditor data={data} setData={setData} />
        </div>
      </aside>

      <section className="flex min-h-[70vh] flex-1 flex-col md:min-h-0">
        <div className="border-b border-black/10 bg-white px-5 py-3">
          <p className="text-[13px] font-medium text-[#111111]">미리보기</p>
        </div>
        <div className="relative min-h-0 flex-1 overflow-auto bg-white [transform:translateZ(0)]">
          <div className="pointer-events-none">
            <LandingPreview data={data} />
          </div>
        </div>
      </section>
    </div>
  );
}
