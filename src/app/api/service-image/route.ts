import { readdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { MAX_SERVICE_IMAGES } from "@/types/site";
import {
  getServiceImagesFromSource,
  siteFilePath,
  updateServiceImages,
} from "@/lib/site-file";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;

function getExtension(file: File): ".jpg" | ".png" | ".webp" | null {
  if (file.type === "image/jpeg" || file.type === "image/jpg") return ".jpg";
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";

  const name = file.name.toLowerCase();
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return ".jpg";
  if (name.endsWith(".png")) return ".png";
  if (name.endsWith(".webp")) return ".webp";
  return null;
}

async function readCurrentImages(serviceId: string) {
  const source = await readFile(siteFilePath, "utf8");
  return getServiceImagesFromSource(source, serviceId);
}

async function removeUnusedUploads(serviceId: string, nextImages: string[]) {
  const publicDir = path.join(process.cwd(), "public");
  const prefix = `service-${serviceId}-`;
  const files = await readdir(publicDir);

  await Promise.all(
    files
      .filter((name) => name.startsWith(prefix) && !nextImages.includes(`/${name}`))
      .map((name) => unlink(path.join(publicDir, name))),
  );
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const serviceId = String(formData.get("serviceId") ?? "");
  const file = formData.get("file");

  if (!serviceId) {
    return NextResponse.json({ error: "서비스를 찾을 수 없습니다." }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "이미지 파일을 선택해주세요." }, { status: 400 });
  }

  const currentImages = await readCurrentImages(serviceId);
  if (!currentImages) {
    return NextResponse.json({ error: "서비스를 찾을 수 없습니다." }, { status: 400 });
  }

  if (currentImages.length >= MAX_SERVICE_IMAGES) {
    return NextResponse.json(
      { error: "한 서비스당 사진은 최대 6장까지 등록할 수 있습니다." },
      { status: 400 },
    );
  }

  const extension = getExtension(file);
  if (!extension) {
    return NextResponse.json(
      { error: "jpg, png, webp 이미지만 사용할 수 있습니다." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "이미지는 8MB 이하로 선택해주세요." },
      { status: 400 },
    );
  }

  const filename = `service-${serviceId}-${Date.now()}${extension}`;
  const publicPath = `/${filename}`;
  await writeFile(
    path.join(process.cwd(), "public", filename),
    Buffer.from(await file.arrayBuffer()),
  );

  const nextImages = [...currentImages, publicPath];
  const saved = await updateServiceImages(serviceId, nextImages);
  if (!saved) {
    return NextResponse.json(
      { error: "시술 사진을 데이터 파일에 저장하지 못했습니다." },
      { status: 500 },
    );
  }

  return NextResponse.json({ path: publicPath, images: nextImages });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    serviceId?: string;
    images?: string[];
  };
  const serviceId = body.serviceId ?? "";
  const images = body.images;

  if (!serviceId || !Array.isArray(images)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if ((await readCurrentImages(serviceId)) === null) {
    return NextResponse.json({ error: "서비스를 찾을 수 없습니다." }, { status: 400 });
  }

  if (images.length > MAX_SERVICE_IMAGES) {
    return NextResponse.json(
      { error: "한 서비스당 사진은 최대 6장까지 등록할 수 있습니다." },
      { status: 400 },
    );
  }

  const nextImages = images.filter(
    (imagePath) =>
      typeof imagePath === "string" && /^\/[A-Za-z0-9._-]+$/.test(imagePath),
  );
  const saved = await updateServiceImages(serviceId, nextImages);
  if (!saved) {
    return NextResponse.json(
      { error: "시술 사진을 데이터 파일에 저장하지 못했습니다." },
      { status: 500 },
    );
  }

  await removeUnusedUploads(serviceId, nextImages);

  return NextResponse.json({ images: nextImages });
}
