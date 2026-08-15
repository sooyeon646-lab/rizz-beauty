import ScrollReveal from "./ScrollReveal";

const reasons = [
  {
    title: "1:1 맞춤 상담",
    description: "얼굴형에 맞는 당신만을 위한 디자인을 함께 만듭니다.",
  },
  {
    title: "섬세한 기술력",
    description: "한 올 한 올 정성스럽게. 자연스러운 결과를 위한 노하우를 쌓아왔습니다.",
  },
  {
    title: "프리미엄 재료",
    description: "피부에 안전한 고급 색소만을 사용해, 시간이 지나도 아름답게.",
  },
  {
    title: "지속적인 케어",
    description: "시술 후에도 변화를 함께 지켜보며, 만족스러운 결과를 위해 동행합니다.",
  },
];

export default function WhyRizzBeauty() {
  return (
    <section id="why" className="bg-white section-padding border-t border-border">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-16 text-center md:mb-24">
          <p className="section-label mb-5">Why Rizz Beauty</p>
          <h2 className="heading-section">
            리즈뷰티가
            <br />
            다른 이유
          </h2>
        </ScrollReveal>

        <div className="grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-14 lg:grid-cols-4 lg:gap-10">
          {reasons.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 80}>
              <div className="text-center lg:text-left">
                <div className="mx-auto mb-6 h-px w-8 bg-black/15 lg:mx-0" />
                <h3 className="mb-4 text-[15px] font-medium tracking-[-0.01em] text-heading-sub md:text-base">
                  {item.title}
                </h3>
                <p className="body-premium !text-[14px] md:!text-[15px]">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
