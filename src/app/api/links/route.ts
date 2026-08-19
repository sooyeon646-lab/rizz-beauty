import { NextResponse } from "next/server";
import type { SiteLinks } from "@/types/site";
import { updateLinks } from "@/lib/site-file";

export const runtime = "nodejs";

const LINK_KEYS = ["naverBooking", "kakao", "instagram", "blog"] as const;

function asLinks(value: unknown): SiteLinks | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const links = {} as SiteLinks;

  for (const key of LINK_KEYS) {
    const item = record[key];
    if (!item || typeof item !== "object") return null;
    const url = "url" in item ? String((item as { url?: unknown }).url ?? "") : "";
    const enabled = Boolean((item as { enabled?: unknown }).enabled);
    links[key] = { url: url.trim(), enabled };
  }

  return links;
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { links?: unknown };
  const links = asLinks(body.links);
  if (!links) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const saved = await updateLinks(links);
  if (!saved) {
    return NextResponse.json(
      { error: "채널 정보를 데이터 파일에 저장하지 못했습니다." },
      { status: 500 },
    );
  }

  return NextResponse.json({ links });
}
