import { NextResponse } from "next/server";
import {
  getServiceImagesFromSource,
  siteFilePath,
  updateServiceText,
} from "@/lib/site-file";
import { readFile } from "fs/promises";

export const runtime = "nodejs";

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    serviceId?: string;
    name?: unknown;
    description?: unknown;
    price?: unknown;
  };
  const serviceId = body.serviceId ?? "";
  const name = asString(body.name);
  const description = asString(body.description);
  const price = asString(body.price);

  if (!serviceId) {
    return NextResponse.json({ error: "서비스를 찾을 수 없습니다." }, { status: 400 });
  }

  const source = await readFile(siteFilePath, "utf8");
  if (getServiceImagesFromSource(source, serviceId) === null) {
    return NextResponse.json({ error: "서비스를 찾을 수 없습니다." }, { status: 400 });
  }

  const saved = await updateServiceText(serviceId, { name, description, price });
  if (!saved) {
    return NextResponse.json(
      { error: "서비스 정보를 데이터 파일에 저장하지 못했습니다." },
      { status: 500 },
    );
  }

  return NextResponse.json({ name, description, price });
}
