import ScrollReveal from "./ScrollReveal";
import { defaultSiteData } from "@/data/site";
import { hasCardContent, type SiteData } from "@/types/site";

export default function Concerns({
  data = defaultSiteData,
}: {
  data?: SiteData;
}) {
  const section = data.concerns;
  if (!section.visible) return null;

  const cards = section.cards.filter(hasCardContent);
  const titleLines = section.title.split("\n").filter((line) => line.length > 0);

  return (
    <section id="concerns" className="bg-white section-padding">
      <div className="mx-auto max-w-[100rem]">
        <ScrollReveal className="mb-16 text-center md:mb-24">
          <p className="section-label mb-5">Concerns</p>
          {titleLines.length > 0 ? (
            <h2 className="heading-section">
              {titleLines.map((line, index) => (
                <span key={`${line}-${index}`}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
            </h2>
          ) : null}
        </ScrollReveal>

        {cards.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {cards.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 100}>
                <div className="card-premium flex min-h-[240px] w-full min-w-0 flex-col items-start justify-start border-[#111111] px-10 py-16 text-left md:min-h-[280px] md:px-12 md:py-20 lg:px-14">
                  {item.title.trim() ? (
                    <h3 className="line-clamp-2 text-[17px] font-medium leading-[1.35] tracking-[-0.02em] text-heading-sub sm:text-[18px] md:text-[20px] lg:text-[21px]">
                      {item.title}
                    </h3>
                  ) : null}
                  {item.description.trim() ? (
                    <p
                      className={`w-full text-[14px] leading-[1.55] tracking-[-0.01em] text-body sm:text-[15px] md:text-[16px] lg:text-[17px]${
                        item.title.trim() ? " mt-7" : ""
                      }`}
                    >
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
