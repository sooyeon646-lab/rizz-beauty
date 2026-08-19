"use client";

import { useRef, useState } from "react";
import type { ContentCard, ContentSection, ContentSectionKey, SiteData } from "@/types/site";

const fieldClassName =
  "mt-1.5 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-[13px] leading-relaxed text-[#111111] outline-none focus:border-black/40";

const buttonClassName =
  "inline-flex h-[36px] items-center justify-center rounded-md border border-black/15 bg-white px-3 text-[12px] font-medium text-[#111111] disabled:opacity-40";

type ContentSectionEditorProps = {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
  sectionKey: ContentSectionKey;
  heading: string;
  helpText: string;
  addLabel: string;
  deleteConfirm: string;
  maxCards: number;
};

export default function ContentSectionEditor({
  data,
  setData,
  sectionKey,
  heading,
  helpText,
  addLabel,
  deleteConfirm,
  maxCards,
}: ContentSectionEditorProps) {
  const dataRef = useRef(data);
  dataRef.current = data;
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState("");

  const section = data[sectionKey];

  function setSection(next: ContentSection) {
    setData((current) => ({
      ...current,
      [sectionKey]: next,
    }));
  }

  async function persistSection(next: ContentSection) {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/content-section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: sectionKey, section: next }),
      });
      const result = (await response.json()) as {
        section?: ContentSection;
        error?: string;
      };
      if (!response.ok || !result.section) {
        setStatus(result.error ?? "섹션 정보를 저장하지 못했습니다.");
        return;
      }
      setSection(result.section);
      setStatus("섹션 정보가 저장되었습니다.");
    } catch {
      setStatus("섹션 정보를 저장하지 못했습니다. 로컬 개발 서버에서 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  function currentSection() {
    return dataRef.current[sectionKey];
  }

  function updateTitle(title: string) {
    const next = { ...currentSection(), title };
    setSection(next);
    return next;
  }

  function updateVisible(visible: boolean) {
    const next = { ...currentSection(), visible };
    setSection(next);
    return next;
  }

  function updateCard(cardId: string, patch: Partial<ContentCard>) {
    const current = currentSection();
    const next: ContentSection = {
      ...current,
      cards: current.cards.map((card) =>
        card.id === cardId ? { ...card, ...patch } : card,
      ),
    };
    setSection(next);
    return next;
  }

  function addCard() {
    const current = currentSection();
    if (current.cards.length >= maxCards) return;
    const ids = new Set(current.cards.map((card) => card.id));
    let id = `${sectionKey}-${Date.now()}`;
    let suffix = 0;
    while (ids.has(id)) {
      suffix += 1;
      id = `${sectionKey}-${Date.now()}-${suffix}`;
    }
    const created: ContentCard = { id, title: "", description: "" };
    const next = { ...current, cards: [...current.cards, created] };
    setSection(next);
    setConfirmingDeleteId("");
    void persistSection(next);
  }

  function deleteCard(cardId: string) {
    const current = currentSection();
    const next = {
      ...current,
      cards: current.cards.filter((card) => card.id !== cardId),
    };
    setSection(next);
    setConfirmingDeleteId("");
    void persistSection(next);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[14px] font-medium text-[#111111]">{heading}</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#888888]">
          {helpText}
        </p>
      </div>

      <div className="rounded-lg border border-black/10 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] font-medium text-[#111111]">섹션 제목</p>
          <button
            type="button"
            className={buttonClassName}
            disabled={busy}
            onClick={() => void persistSection(updateVisible(!section.visible))}
          >
            {section.visible ? "표시 중" : "숨김"}
          </button>
        </div>

        <label className="mt-3 block">
          <span className="text-[12px] text-[#666666]">제목</span>
          <textarea
            rows={2}
            value={section.title}
            onChange={(event) => updateTitle(event.target.value)}
            onBlur={(event) =>
              void persistSection(updateTitle(event.target.value))
            }
            className={`${fieldClassName} resize-y`}
          />
        </label>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#888888]">
          줄을 바꾸려면 엔터를 누르세요.
        </p>
      </div>

      {section.cards.map((card, index) => (
        <div key={card.id} className="rounded-lg border border-black/10 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-medium text-[#111111]">
              {card.title.trim() || `카드 ${index + 1}`}
            </p>
            {confirmingDeleteId === card.id ? null : (
              <button
                type="button"
                className={buttonClassName}
                disabled={busy}
                onClick={() => setConfirmingDeleteId(card.id)}
              >
                삭제
              </button>
            )}
          </div>

          <label className="mt-3 block">
            <span className="text-[12px] text-[#666666]">제목</span>
            <input
              type="text"
              value={card.title}
              onChange={(event) =>
                updateCard(card.id, { title: event.target.value })
              }
              onBlur={(event) =>
                void persistSection(
                  updateCard(card.id, { title: event.target.value }),
                )
              }
              className={fieldClassName}
            />
          </label>

          <label className="mt-3 block">
            <span className="text-[12px] text-[#666666]">설명</span>
            <textarea
              rows={3}
              value={card.description}
              onChange={(event) =>
                updateCard(card.id, { description: event.target.value })
              }
              onBlur={(event) =>
                void persistSection(
                  updateCard(card.id, {
                    description: event.target.value,
                  }),
                )
              }
              className={`${fieldClassName} resize-y`}
            />
          </label>

          {confirmingDeleteId === card.id ? (
            <div className="mt-3 rounded-md bg-[#f7f5f2] px-3 py-3">
              <p className="text-[12px] leading-relaxed text-[#111111]">
                {deleteConfirm}
              </p>
              <div className="mt-2 flex gap-1">
                <button
                  type="button"
                  className={buttonClassName}
                  disabled={busy}
                  onClick={() => deleteCard(card.id)}
                >
                  확인
                </button>
                <button
                  type="button"
                  className={buttonClassName}
                  disabled={busy}
                  onClick={() => setConfirmingDeleteId("")}
                >
                  취소
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ))}

      <button
        type="button"
        className={`${buttonClassName} h-[44px] w-full px-4 text-[13px]`}
        disabled={busy || section.cards.length >= maxCards}
        onClick={() => addCard()}
      >
        {addLabel}
      </button>

      {status ? (
        <p className="text-[12px] leading-relaxed text-[#888888]">{status}</p>
      ) : null}
    </div>
  );
}
