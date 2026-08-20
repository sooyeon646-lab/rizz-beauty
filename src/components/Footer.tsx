import ScrollReveal from "./ScrollReveal";
import Visit from "./Visit";
import { KAKAO_CHANNEL_URL, NAVER_BOOKING_URL } from "@/config/booking";

const bookingButtonClass =
  "inline-flex h-[52px] min-w-[168px] flex-1 items-center justify-center rounded-full px-9 text-[15px] font-medium tracking-[-0.01em] transition-[filter] duration-300 sm:flex-none md:h-[54px]";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-white px-5 pt-16 pb-8 sm:px-6 md:px-10 md:pt-20 md:pb-10">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-10 overflow-hidden rounded-[1.5rem] bg-black px-8 py-14 text-center text-white md:mb-12 md:px-20 md:py-20">
            <h2 className="heading-display text-xl text-white md:text-2xl lg:text-[1.75rem]">
              예약 및 상담
            </h2>
            <p className="body-premium mt-4 text-white/55">
              예약 및 상담은 편하게 문의 해 주세요.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:gap-5">
              <a
                href={NAVER_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${bookingButtonClass} bg-[#03C75A] text-white hover:brightness-110`}
              >
                네이버 예약
              </a>
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${bookingButtonClass} bg-[#FEE500] text-black hover:brightness-105`}
              >
                카카오톡 상담
              </a>
            </div>
          </div>
        </ScrollReveal>

        <Visit />

        <ScrollReveal>
          <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-6 md:flex-row md:items-center md:gap-6 md:pt-7">
            <a
              href="#"
              className="inline-block text-[12px] font-medium tracking-[0.24em] text-black"
            >
              RIZZ BEAUTY
            </a>
            <p className="text-[12px] tracking-[0.02em] text-muted">
              © {new Date().getFullYear()} RIZZ BEAUTY. All rights reserved.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
