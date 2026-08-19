import { readdir, unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { MAX_SERVICES, type ServiceItem } from "@/types/site";
import { mutateServices } from "@/lib/site-file";

export const runtime = "nodejs";

async function removeServiceUploads(serviceId: string) {
  const publicDir = path.join(process.cwd(), "public");
  const prefix = `service-${serviceId}-`;
  const files = await readdir(publicDir);

  await Promise.all(
    files
      .filter((name) => name.startsWith(prefix))
      .map((name) => unlink(path.join(publicDir, name))),
  );
}

function createServiceId(existing: ServiceItem[]) {
  const ids = new Set(existing.map((service) => service.id));
  let nextId = `s-${Date.now()}`;
  let suffix = 0;
  while (ids.has(nextId)) {
    suffix += 1;
    nextId = `s-${Date.now()}-${suffix}`;
  }
  return nextId;
}

export async function POST() {
  const nextServices = await mutateServices((services) => {
    if (services.length >= MAX_SERVICES) return null;
    const created: ServiceItem = {
      id: createServiceId(services),
      name: "새 서비스",
      description: "",
      price: "",
      images: [],
      visible: true,
    };
    return [...services, created];
  });

  if (!nextServices || nextServices.length === 0) {
    return NextResponse.json(
      { error: "서비스를 추가하지 못했습니다. 최대 20개까지 등록할 수 있습니다." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    service: nextServices[nextServices.length - 1],
    services: nextServices,
  });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { serviceId?: string };
  const serviceId = body.serviceId ?? "";
  if (!serviceId) {
    return NextResponse.json({ error: "서비스를 찾을 수 없습니다." }, { status: 400 });
  }

  let found = false;
  const nextServices = await mutateServices((services) => {
    found = services.some((service) => service.id === serviceId);
    if (!found) return null;
    return services.filter((service) => service.id !== serviceId);
  });

  if (!found || !nextServices) {
    return NextResponse.json({ error: "서비스를 찾을 수 없습니다." }, { status: 400 });
  }

  await removeServiceUploads(serviceId);

  return NextResponse.json({ services: nextServices });
}
