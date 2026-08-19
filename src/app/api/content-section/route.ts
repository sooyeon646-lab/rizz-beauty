import { NextResponse } from "next/server";
import {
  MAX_CONCERN_CARDS,
  MAX_WHY_CARDS,
  type ContentCard,
  type ContentSection,
  type ContentSectionKey,
} from "@/types/site";
import { updateContentSection } from "@/lib/site-file";

export const runtime = "nodejs";

function asCard(value: unknown): ContentCard | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id.trim() : "";
  if (!id) return null;
  return {
    id,
    title: typeof record.title === "string" ? record.title : "",
    description: typeof record.description === "string" ? record.description : "",
  };
}

function asSection(value: unknown, max: number): ContentSection | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.title !== "string") return null;
  if (typeof record.visible !== "boolean") return null;
  if (!Array.isArray(record.cards) || record.cards.length > max) return null;

  const cards: ContentCard[] = [];
  const ids = new Set<string>();
  for (const item of record.cards) {
    const card = asCard(item);
    if (!card || ids.has(card.id)) return null;
    ids.add(card.id);
    cards.push(card);
  }

  return {
    title: record.title,
    visible: record.visible,
    cards,
  };
}

function asKey(value: unknown): ContentSectionKey | null {
  if (value === "concerns" || value === "why") return value;
  return null;
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { key?: unknown; section?: unknown };
  const key = asKey(body.key);
  if (!key) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const max = key === "concerns" ? MAX_CONCERN_CARDS : MAX_WHY_CARDS;
  const section = asSection(body.section, max);
  if (!section) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const saved = await updateContentSection(key, section);
  if (!saved) {
    return NextResponse.json(
      { error: "섹션 정보를 데이터 파일에 저장하지 못했습니다." },
      { status: 500 },
    );
  }

  return NextResponse.json({ key, section: saved });
}
