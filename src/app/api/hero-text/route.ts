import { NextResponse } from "next/server";
import { updateHeroSubtitle } from "@/lib/site-file";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  const body = (await request.json()) as { subtitle?: unknown };
  if (typeof body.subtitle !== "string") {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const subtitle = body.subtitle;
  const saved = await updateHeroSubtitle(subtitle);
  if (!saved) {
    return NextResponse.json(
      { error: "영문 서브 문구를 데이터 파일에 저장하지 못했습니다." },
      { status: 500 },
    );
  }

  return NextResponse.json({ subtitle });
}
