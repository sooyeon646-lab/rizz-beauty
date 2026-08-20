"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ServicePhotoGalleryProps = {
  serviceId: string;
  serviceName: string;
  photos: string[];
  width: number;
  height: number;
};

export default function ServicePhotoGallery({
  serviceId,
  serviceName,
  photos,
  width,
  height,
}: ServicePhotoGalleryProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swipeAxis = useRef<"h" | "v" | null>(null);

  useEffect(() => {
    setIndex((current) => {
      if (photos.length === 0) return 0;
      return Math.min(current, photos.length - 1);
    });
  }, [photos]);

  if (photos.length === 0) return null;

  const showControls = photos.length > 1;

  function goTo(nextIndex: number) {
    setIndex(Math.max(0, Math.min(photos.length - 1, nextIndex)));
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (!showControls) return;
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    swipeAxis.current = null;
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (
      !showControls ||
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    if (!swipeAxis.current) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
      swipeAxis.current = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
    }
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (
      !showControls ||
      touchStartX.current === null ||
      swipeAxis.current !== "h"
    ) {
      touchStartX.current = null;
      touchStartY.current = null;
      swipeAxis.current = null;
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    if (deltaX <= -40) goTo(index + 1);
    if (deltaX >= 40) goTo(index - 1);

    touchStartX.current = null;
    touchStartY.current = null;
    swipeAxis.current = null;
  }

  return (
    <div>
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex w-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {photos.map((photo, photoIndex) => (
            <div key={`${serviceId}-${photo}-${photoIndex}`} className="w-full shrink-0 basis-full">
              <Image
                src={photo}
                alt={`${serviceName} 전후 사진 ${photoIndex + 1}`}
                width={width}
                height={height}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={95}
                draggable={false}
                className="block h-auto w-full rounded-[16px] object-contain"
              />
            </div>
          ))}
        </div>

        {showControls ? (
          <>
            <button
              type="button"
              aria-label="이전 사진"
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
              className="absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white text-[#111111] shadow-[0_4px_16px_-8px_rgba(26,26,26,0.35)] disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M8.75 3.5 5.25 7l3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="다음 사진"
              disabled={index === photos.length - 1}
              onClick={() => goTo(index + 1)}
              className="absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white text-[#111111] shadow-[0_4px_16px_-8px_rgba(26,26,26,0.35)] disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M5.25 3.5 8.75 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {showControls ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {photos.map((photo, photoIndex) => (
            <button
              key={`${serviceId}-dot-${photo}-${photoIndex}`}
              type="button"
              aria-label={`${photoIndex + 1}번째 사진`}
              onClick={() => goTo(photoIndex)}
              className="flex h-4 w-4 items-center justify-center"
            >
              <span
                className={`block h-1.5 w-1.5 rounded-full ${
                  photoIndex === index ? "bg-[#111111]" : "bg-black/20"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
