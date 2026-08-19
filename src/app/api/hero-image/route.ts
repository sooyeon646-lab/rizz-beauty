import { readdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

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

function setHeroImagePath(source: string, nextPath: string): string | null {
  const heroIndex = source.indexOf("hero:");
  if (heroIndex < 0) return null;

  const imageKeyIndex = source.indexOf("image:", heroIndex);
  if (imageKeyIndex < 0) return null;

  const quoteStart = source.indexOf('"', imageKeyIndex);
  const quoteEnd = source.indexOf('"', quoteStart + 1);
  if (quoteStart < 0 || quoteEnd < 0) return null;

  return source.slice(0, quoteStart + 1) + nextPath + source.slice(quoteEnd);
}

async function removeOldHeroUploads(publicDir: string, keepFilename: string) {
  const files = await readdir(publicDir);
  await Promise.all(
    files
      .filter(
        (name) =>
          name !== keepFilename && /^hero-main-\d+\.(jpg|png|webp)$/i.test(name),
      )
      .map((name) => unlink(path.join(publicDir, name))),
  );
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "이미지 파일을 선택해주세요." }, { status: 400 });
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

  const filename = `hero-main-${Date.now()}${extension}`;
  const publicPath = `/${filename}`;
  const publicDir = path.join(process.cwd(), "public");
  await writeFile(path.join(publicDir, filename), Buffer.from(await file.arrayBuffer()));
  await removeOldHeroUploads(publicDir, filename);

  const siteFile = path.join(process.cwd(), "src", "data", "site.ts");
  const current = await readFile(siteFile, "utf8");
  const updated = setHeroImagePath(current, publicPath);

  if (!updated) {
    return NextResponse.json(
      { error: "이미지 경로를 데이터 파일에 저장하지 못했습니다." },
      { status: 500 },
    );
  }

  await writeFile(siteFile, updated, "utf8");

  return NextResponse.json({ path: publicPath });
}
