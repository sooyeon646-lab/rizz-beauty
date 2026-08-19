"use client";

import { useRef, useState } from "react";
import { MAX_SERVICE_IMAGES, MAX_SERVICES, type SiteData } from "@/types/site";

const buttonClassName =
  "inline-flex h-[36px] items-center justify-center rounded-md border border-black/15 bg-white px-3 text-[12px] font-medium text-[#111111] disabled:opacity-40";

const fieldClassName =
  "mt-1.5 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-[13px] leading-relaxed text-[#111111] outline-none focus:border-black/40";

type ServicePhotosEditorProps = {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
};

export default function ServicePhotosEditor({
  data,
  setData,
}: ServicePhotosEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataRef = useRef(data);
  dataRef.current = data;
  const [activeServiceId, setActiveServiceId] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  function updateServiceField(
    serviceId: string,
    field: "name" | "description" | "price",
    value: string,
  ) {
    setData((current) => ({
      ...current,
      services: current.services.map((service) =>
        service.id === serviceId ? { ...service, [field]: value } : service,
      ),
    }));
  }

  async function persistServiceText(
    serviceId: string,
    patch: Partial<{ name: string; description: string; price: string }>,
  ) {
    const service = dataRef.current.services.find((item) => item.id === serviceId);
    if (!service) return;

    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/service-text", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          name: patch.name ?? service.name,
          description: patch.description ?? service.description,
          price: patch.price ?? service.price,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus(result.error ?? "서비스 정보를 저장하지 못했습니다.");
        return;
      }
      setStatus("서비스 정보가 저장되었습니다.");
    } catch {
      setStatus("서비스 정보를 저장하지 못했습니다. 로컬 개발 서버에서 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  function updateServiceImages(serviceId: string, images: string[]) {
    setData((current) => ({
      ...current,
      services: current.services.map((service) =>
        service.id === serviceId ? { ...service, images } : service,
      ),
    }));
  }

  async function persistImages(serviceId: string, images: string[]) {
    const response = await fetch("/api/service-image", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, images }),
    });
    const result = (await response.json()) as { images?: string[]; error?: string };
    if (!response.ok || !result.images) {
      throw new Error(result.error ?? "시술 사진을 저장하지 못했습니다.");
    }
    updateServiceImages(serviceId, result.images);
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const serviceId = activeServiceId;
    event.target.value = "";
    if (!file || !serviceId) return;

    setBusy(true);
    setStatus("");

    const formData = new FormData();
    formData.append("serviceId", serviceId);
    formData.append("file", file);

    try {
      const response = await fetch("/api/service-image", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        images?: string[];
        error?: string;
      };
      if (!response.ok || !result.images) {
        setStatus(result.error ?? "시술 사진을 저장하지 못했습니다.");
        return;
      }
      updateServiceImages(serviceId, result.images);
      setStatus("시술 사진이 저장되었습니다.");
    } catch {
      setStatus("시술 사진을 저장하지 못했습니다. 로컬 개발 서버에서 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function moveImage(serviceId: string, index: number, offset: number) {
    const service = data.services.find((item) => item.id === serviceId);
    if (!service) return;
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= service.images.length) return;

    const images = [...service.images];
    const [moved] = images.splice(index, 1);
    images.splice(nextIndex, 0, moved);

    setBusy(true);
    setStatus("");
    try {
      await persistImages(serviceId, images);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "순서를 바꾸지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteImage(serviceId: string, index: number) {
    const service = data.services.find((item) => item.id === serviceId);
    if (!service) return;
    const images = service.images.filter((_, imageIndex) => imageIndex !== index);

    setBusy(true);
    setStatus("");
    try {
      await persistImages(serviceId, images);
      setStatus("시술 사진을 삭제했습니다.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "사진을 삭제하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function addService() {
    setBusy(true);
    setStatus("");
    setConfirmingDeleteId("");
    try {
      const response = await fetch("/api/services", { method: "POST" });
      const result = (await response.json()) as {
        services?: SiteData["services"];
        error?: string;
      };
      if (!response.ok || !result.services) {
        setStatus(result.error ?? "서비스를 추가하지 못했습니다.");
        return;
      }
      setData((current) => ({ ...current, services: result.services ?? current.services }));
      setStatus("서비스를 추가했습니다.");
    } catch {
      setStatus("서비스를 추가하지 못했습니다. 로컬 개발 서버에서 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteService(serviceId: string) {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      });
      const result = (await response.json()) as {
        services?: SiteData["services"];
        error?: string;
      };
      if (!response.ok || !result.services) {
        setStatus(result.error ?? "서비스를 삭제하지 못했습니다.");
        return;
      }
      setData((current) => ({ ...current, services: result.services ?? current.services }));
      setConfirmingDeleteId("");
      setStatus("서비스를 삭제했습니다.");
    } catch {
      setStatus("서비스를 삭제하지 못했습니다. 로컬 개발 서버에서 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[14px] font-medium text-[#111111]">서비스</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#888888]">
          서비스명, 설명, 가격과 사진은 저장되면 새로고침과 배포 후에도
          유지됩니다. 사진은 서비스마다 최대 6장까지 등록할 수 있습니다.
          서비스 카드도 추가하거나 삭제할 수 있습니다.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {data.services.map((service) => (
        <div key={service.id} className="rounded-lg border border-black/10 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-medium text-[#111111]">{service.name}</p>
            <p className="text-[12px] text-[#888888]">
              {service.images.length}/{MAX_SERVICE_IMAGES}
            </p>
          </div>

          <label className="mt-3 block">
            <span className="text-[12px] text-[#666666]">서비스명</span>
            <input
              type="text"
              value={service.name}
              onChange={(event) =>
                updateServiceField(service.id, "name", event.target.value)
              }
              onBlur={(event) =>
                void persistServiceText(service.id, { name: event.target.value })
              }
              className={fieldClassName}
            />
          </label>

          <label className="mt-3 block">
            <span className="text-[12px] text-[#666666]">서비스 설명</span>
            <textarea
              rows={3}
              value={service.description}
              onChange={(event) =>
                updateServiceField(service.id, "description", event.target.value)
              }
              onBlur={(event) =>
                void persistServiceText(service.id, {
                  description: event.target.value,
                })
              }
              className={`${fieldClassName} resize-y`}
            />
          </label>

          <label className="mt-3 block">
            <span className="text-[12px] text-[#666666]">가격</span>
            <input
              type="text"
              value={service.price}
              onChange={(event) =>
                updateServiceField(service.id, "price", event.target.value)
              }
              onBlur={(event) =>
                void persistServiceText(service.id, { price: event.target.value })
              }
              className={fieldClassName}
            />
          </label>

          <div className="mt-3 space-y-2">
            {service.images.length === 0 ? (
              <p className="text-[12px] text-[#888888]">등록된 사진이 없습니다.</p>
            ) : (
              service.images.map((imagePath, index) => (
                <div
                  key={`${service.id}-${imagePath}-${index}`}
                  className="flex items-center gap-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePath}
                    alt={`${service.name} 사진 ${index + 1}`}
                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                  />
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      className={buttonClassName}
                      disabled={busy || index === 0}
                      onClick={() => void moveImage(service.id, index, -1)}
                    >
                      위로
                    </button>
                    <button
                      type="button"
                      className={buttonClassName}
                      disabled={busy || index === service.images.length - 1}
                      onClick={() => void moveImage(service.id, index, 1)}
                    >
                      아래로
                    </button>
                    <button
                      type="button"
                      className={buttonClassName}
                      disabled={busy}
                      onClick={() => void deleteImage(service.id, index)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            className={`${buttonClassName} mt-3 h-[40px] px-4 text-[13px]`}
            disabled={busy || service.images.length >= MAX_SERVICE_IMAGES}
            onClick={() => {
              setActiveServiceId(service.id);
              fileInputRef.current?.click();
            }}
          >
            사진 추가
          </button>

          {confirmingDeleteId === service.id ? (
            <div className="mt-3 rounded-md bg-[#f7f5f2] px-3 py-3">
              <p className="text-[12px] leading-relaxed text-[#111111]">
                이 서비스를 삭제할까요?
              </p>
              <div className="mt-2 flex gap-1">
                <button
                  type="button"
                  className={buttonClassName}
                  disabled={busy}
                  onClick={() => void deleteService(service.id)}
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
          ) : (
            <button
              type="button"
              className={`${buttonClassName} mt-3 h-[40px] px-4 text-[13px]`}
              disabled={busy}
              onClick={() => setConfirmingDeleteId(service.id)}
            >
              서비스 삭제
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className={`${buttonClassName} h-[44px] w-full px-4 text-[13px]`}
        disabled={busy || data.services.length >= MAX_SERVICES}
        onClick={() => void addService()}
      >
        + 서비스 추가
      </button>

      {status ? (
        <p className="text-[12px] leading-relaxed text-[#888888]">{status}</p>
      ) : null}
    </div>
  );
}
