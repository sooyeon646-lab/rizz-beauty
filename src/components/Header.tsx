"use client";

import { useEffect, useState } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/rizz__beauty";

const navLinks = [
  { href: "#why", label: "리즈뷰티" },
  { href: "#services", label: "시술" },
  { href: "#academy", label: "아카데미" },
  {
    href: INSTAGRAM_URL,
    label: "인스타그램",
    external: true,
  },
  { href: "#contact", label: "문의" },
];

function NavItems({ className }: { className: string }) {
  return (
    <>
      {navLinks.map((link) =>
        "external" in link && link.external ? (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {link.label}
          </a>
        ) : (
          <a key={link.href} href={link.href} className={className}>
            {link.label}
          </a>
        ),
      )}
    </>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? "border-b border-black/[0.06] bg-white/95 backdrop-blur-md"
          : "border-b border-transparent bg-white md:bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 md:px-10 md:py-5">
          <a
            href="#"
            className="text-[12px] font-semibold tracking-[0.22em] text-[#111111]"
          >
            RIZZ BEAUTY
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            <NavItems className="text-[13px] font-medium tracking-[-0.01em] text-[#111111] transition-colors duration-300 hover:text-[#7C6F64]" />
          </nav>

          <a
            href="#contact"
            className="inline-flex h-[40px] items-center justify-center rounded-full bg-black px-6 text-[13px] font-medium tracking-[-0.01em] text-white transition-[filter] duration-300 hover:brightness-110 md:h-[42px] md:px-7"
          >
            예약하기
          </a>
        </div>

        <nav
          aria-label="모바일 메뉴"
          className="flex w-full items-center justify-between gap-1 px-5 pb-3 sm:px-6 md:hidden"
        >
          <NavItems className="shrink-0 whitespace-nowrap text-[11px] font-medium tracking-[-0.01em] text-[#111111] transition-colors duration-300 hover:text-[#7C6F64] sm:text-[12px]" />
        </nav>
      </div>
    </header>
  );
}
