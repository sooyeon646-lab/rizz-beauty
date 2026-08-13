import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const descriptionLines = [
  "극사실 눈썹을 시작하기 위해 가장 먼저 익히는 기초 클래스입니다.",
  "기술과 감각을 함께 키워드립니다.",
];

export default function Academy() {
  return (
    <section
      id="academy"
      className="border-t border-border bg-white px-5 pb-28 pt-20 sm:px-6 md:px-10 md:pb-36 md:pt-24 lg:pb-40 lg:pt-[7.5rem]"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-16 text-center md:mb-24">
          <p className="section-label mb-5">ACADEMY</p>
          <h2 className="heading-section text-[#111111]">
            아카데미 (이지클래스)
          </h2>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <ScrollReveal>
            <article className="card-premium overflow-hidden">
              <div className="image-premium relative aspect-[682/1024] w-full rounded-none bg-beige-light shadow-none">
                <Image
                  src="/academy-curriculum.jpg.png"
                  alt="RIZZ BEAUTY ACADEMY 이지클래스 커리큘럼"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  quality={95}
                />
              </div>

              <div className="p-8 text-left md:p-10 lg:p-12">
                <p className="body-premium text-[#555555]">
                  {descriptionLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <p className="mt-2 text-[15px] tracking-[-0.01em] text-[#555555] md:text-base">
                  690,000원
                </p>
                <p className="mt-2 text-[14px] leading-[1.85] tracking-[-0.01em] text-muted md:text-[15px]">
                  *재료비 별도
                </p>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
