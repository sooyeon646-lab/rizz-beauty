import Image from "next/image";
import { defaultSiteData } from "@/data/site";
import type { SiteData } from "@/types/site";

export default function Hero({ data = defaultSiteData }: { data?: SiteData }) {
  const { hero } = data;
  const heroTitleLines = hero.title.split("\n");
  const heroDescriptionLines = hero.description.split("\n");
  return (
    <section className="flex min-h-[100dvh] items-center bg-white px-5 pb-14 pt-32 sm:px-6 md:px-10 md:pb-20 md:pt-28">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-7 md:gap-10 lg:grid-cols-[11fr_9fr] lg:gap-12">
        <div>
          <p className="mb-5 text-[11px] font-medium tracking-[0.24em] text-muted md:mb-6">
            SEMI-PERMANENT EYEBROW
          </p>

          <h1 className="text-[2.75rem] font-light leading-[1.12] tracking-[-0.03em] text-black md:text-[3.5rem] lg:text-[4rem]">
            {heroTitleLines.map((line, index) => (
              <span key={index}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-[1.85] tracking-[-0.01em] text-body md:mt-6 md:text-base md:leading-[1.9]">
            {heroDescriptionLines.map((line, index) => (
              <span key={index}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        </div>

        <div>
          <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-[1.25rem] shadow-[0_24px_56px_-20px_rgba(26,26,26,0.12)] lg:mx-0">
            <Image
              key={hero.image}
              src={hero.image}
              alt="리즈뷰티 대표 원장 프로필"
              fill
              priority
              quality={95}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-contain object-[30%_45%] sm:object-[30%_42%] lg:object-[28%_45%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
