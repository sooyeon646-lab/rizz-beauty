import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { defaultSiteData } from "@/data/site";
import { isLinkVisible, type SiteData } from "@/types/site";

const channelLinkClassName =
  "inline-flex h-[48px] min-w-[160px] items-center justify-center rounded-full border border-black/18 px-8 text-[14px] font-medium tracking-[-0.01em] text-[#111111] transition-colors duration-300 hover:border-black/30 hover:bg-beige-light md:h-[50px] md:min-w-[168px] md:px-9 md:text-[15px]";

const serviceImageSize: Record<string, { width: number; height: number }> = {
  "women-eyebrow": { width: 1536, height: 1536 },
  "men-eyebrow": { width: 1490, height: 1536 },
  lip: { width: 1536, height: 1536 },
};

export default function Services({
  data = defaultSiteData,
}: {
  data?: SiteData;
}) {
  const services = data.services.filter((service) => service.visible);
  const { links } = data;

  return (
    <section id="services" className="border-t border-border bg-white section-padding !pb-0">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-lg">
            <p className="section-label mb-5">Services</p>
            <h2 className="heading-section">
              당신에게 맞는
              <br />
              시술을 찾아보세요
            </h2>
          </div>
          <p className="body-premium max-w-xs md:text-right">
            모든 시술은 상담을 통해 시작됩니다.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {services.map((service, index) => {
            const photos = service.images.filter(Boolean);

            return (
              <ScrollReveal key={service.id} delay={index * 100}>
                <article
                  id={service.id}
                  className={
                    photos.length > 0
                      ? "card-premium"
                      : "card-premium overflow-hidden"
                  }
                >
                  {photos.length > 0 ? (
                    <div className="flex w-full flex-col gap-5">
                      {photos.map((photo, photoIndex) => (
                        <Image
                          key={`${service.id}-${photo}-${photoIndex}`}
                          src={photo}
                          alt={`${service.name} 전후 사진`}
                          width={serviceImageSize[service.id]?.width ?? 1536}
                          height={serviceImageSize[service.id]?.height ?? 1536}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          quality={95}
                          className="block h-auto w-full rounded-[16px] object-contain"
                        />
                      ))}
                    </div>
                  ) : service.comingSoon ? (
                    <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden border-b border-black/[0.06] bg-[#f7f5f2] px-6 text-center">
                      <p className="text-[13px] font-medium tracking-[0.22em] text-[#111111] md:text-[14px]">
                        COMING SOON
                      </p>
                      <p className="mt-3 text-[13px] leading-[1.6] tracking-[-0.01em] text-[#555555] md:text-[14px]">
                        헤어라인 시술 사례 준비 중입니다.
                      </p>
                    </div>
                  ) : null}

                  <div className="p-8 text-left md:p-10 lg:p-12">
                    <h3 className="text-2xl font-normal tracking-[-0.02em] text-heading-sub md:text-[1.75rem]">
                      {service.name}
                    </h3>
                    {service.description ? (
                      <p className="mt-2 text-[15px] tracking-[-0.01em] text-body md:text-base">
                        {service.description}
                      </p>
                    ) : null}
                    <p className="mt-2 text-[15px] tracking-[-0.01em] text-body md:text-base">
                      {service.price}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal className="mt-24 border-t border-border pt-20 pb-28 text-center md:mt-32 md:pt-24 md:pb-36 lg:mt-36 lg:pt-28 lg:pb-40">
          <h3 className="text-[1.375rem] font-medium leading-[1.35] tracking-[-0.02em] text-[#111111] md:text-[1.75rem] lg:text-[2rem]">
            더 많은 시술 사례 확인하기
          </h3>
          <p className="mt-4 text-[14px] leading-[1.75] tracking-[-0.01em] text-[#555555] md:mt-5 md:text-[15px]">
            리즈뷰티의 다양한 시술 사례를 만나보세요.
          </p>
          {isLinkVisible(links.instagram) || isLinkVisible(links.blog) ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            {isLinkVisible(links.instagram) ? (
              <a
                href={links.instagram.url.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className={channelLinkClassName}
              >
                인스타그램
              </a>
            ) : null}
            {isLinkVisible(links.blog) ? (
              <a
                href={links.blog.url.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className={channelLinkClassName}
              >
                네이버 블로그
              </a>
            ) : null}
          </div>
          ) : null}
        </ScrollReveal>
      </div>
    </section>
  );
}
