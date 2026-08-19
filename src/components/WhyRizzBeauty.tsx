import ScrollReveal from "./ScrollReveal";
import { defaultSiteData } from "@/data/site";
import { hasCardContent, type SiteData } from "@/types/site";

export default function WhyRizzBeauty({
  data = defaultSiteData,
}: {
  data?: SiteData;
}) {
  const section = data.why;
  if (!section.visible) return null;

  const cards = section.cards.filter(hasCardContent);
  const titleLines = section.title.split("\n").filter((line) => line.length > 0);

  return (
    <section id="why" className="bg-white section-padding border-t border-border">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-16 text-center md:mb-24">
          <p className="section-label mb-5">Why Rizz Beauty</p>
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
          <div className="grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-14 lg:grid-cols-4 lg:gap-10">
            {cards.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 80}>
                <div className="text-center lg:text-left">
                  <div className="mx-auto mb-6 h-px w-8 bg-black/15 lg:mx-0" />
                  {item.title.trim() ? (
                    <h3 className="mb-4 text-[15px] font-medium tracking-[-0.01em] text-heading-sub md:text-base">
                      {item.title}
                    </h3>
                  ) : null}
                  {item.description.trim() ? (
                    <p className="body-premium !text-[14px] md:!text-[15px]">
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
