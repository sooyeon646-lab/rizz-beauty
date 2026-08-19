"use client";

import { useRef, useState } from "react";
import { isLinkVisible, type SiteData, type SiteLinks } from "@/types/site";

const fieldClassName =
  "mt-1.5 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-[13px] leading-relaxed text-[#111111] outline-none focus:border-black/40";

const toggleClassName =
  "inline-flex h-[36px] items-center justify-center rounded-md border border-black/15 bg-white px-3 text-[12px] font-medium text-[#111111] disabled:opacity-40";

const CHANNELS: Array<{ key: keyof SiteLinks; label: string }> = [
  { key: "naverBooking", label: "네이버 예약" },
  { key: "kakao", label: "카카오 문의" },
  { key: "instagram", label: "인스타그램" },
  { key: "blog", label: "네이버 블로그" },
];

type ChannelLinksEditorProps = {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
};

export default function ChannelLinksEditor({
  data,
  setData,
}: ChannelLinksEditorProps) {
  const dataRef = useRef(data);
  dataRef.current = data;
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  function updateLink(
    key: keyof SiteLinks,
    patch: Partial<SiteLinks[keyof SiteLinks]>,
  ) {
    setData((current) => ({
      ...current,
      links: {
        ...current.links,
        [key]: {
          ...current.links[key],
          ...patch,
        },
      },
    }));
  }

  async function persistLinks(nextLinks: SiteLinks) {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: nextLinks }),
      });
      const result = (await response.json()) as {
        links?: SiteLinks;
        error?: string;
      };
      if (!response.ok || !result.links) {
        setStatus(result.error ?? "채널 정보를 저장하지 못했습니다.");
        return;
      }
      setData((current) => ({ ...current, links: result.links ?? current.links }));
      setStatus("채널 정보가 저장되었습니다.");
    } catch {
      setStatus("채널 정보를 저장하지 못했습니다. 로컬 개발 서버에서 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  function nextLinksFrom(
    key: keyof SiteLinks,
    patch: Partial<SiteLinks[keyof SiteLinks]>,
  ) {
    const current = dataRef.current.links;
    return {
      ...current,
      [key]: {
        ...current[key],
        ...patch,
      },
    };
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[14px] font-medium text-[#111111]">예약 및 채널</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#888888]">
          링크와 표시 여부는 저장되면 새로고침과 배포 후에도 유지됩니다. 숨기면
          랜딩페이지에서 해당 버튼이 사라집니다.
        </p>
      </div>

      {CHANNELS.map((channel) => {
        const link = data.links[channel.key];
        const visibleOnLanding = isLinkVisible(link);

        return (
          <div
            key={channel.key}
            className="rounded-lg border border-black/10 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-medium text-[#111111]">
                {channel.label}
              </p>
              <button
                type="button"
                className={toggleClassName}
                disabled={busy}
                onClick={() => {
                  const enabled = !link.enabled;
                  updateLink(channel.key, { enabled });
                  void persistLinks(nextLinksFrom(channel.key, { enabled }));
                }}
              >
                {link.enabled ? "표시 중" : "숨김"}
              </button>
            </div>

            <label className="mt-3 block">
              <span className="text-[12px] text-[#666666]">링크</span>
              <input
                type="text"
                value={link.url}
                placeholder="https://"
                onChange={(event) =>
                  updateLink(channel.key, { url: event.target.value })
                }
                onBlur={(event) => {
                  const url = event.target.value.trim();
                  updateLink(channel.key, { url });
                  void persistLinks(nextLinksFrom(channel.key, { url }));
                }}
                className={fieldClassName}
              />
            </label>

            {link.enabled && !visibleOnLanding ? (
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#888888]">
                https://로 시작하는 링크를 입력해야 랜딩페이지에 표시됩니다.
              </p>
            ) : null}
          </div>
        );
      })}

      {status ? (
        <p className="text-[12px] leading-relaxed text-[#888888]">{status}</p>
      ) : null}
    </div>
  );
}
