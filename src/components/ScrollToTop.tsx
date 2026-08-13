"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 400;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="맨 위로"
      onClick={scrollToTop}
      className={`fixed bottom-6 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-white transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:bottom-8 md:right-8 md:h-11 md:w-11 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <span className="text-[15px] leading-none md:text-base" aria-hidden>
        ↑
      </span>
    </button>
  );
}
