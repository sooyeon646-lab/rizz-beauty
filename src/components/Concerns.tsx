import ScrollReveal from "./ScrollReveal";

const concerns = [
  {
    title: "매일 눈썹 그리기가 번거로운 분",
    description: "아침마다 좌우 균형을 맞추느라 시간이 오래 걸리는 분",
  },
  {
    title: "민낯이면 인상이 흐려 보이는 분",
    description: "눈썹이 연하거나 비어 보여 또렷한 인상을 원하는 분",
  },
  {
    title: "기존 눈썹 잔흔이 마음에 들지 않는 분",
    description: "새로운 디자인을 원하시는 분",
  },
];

export default function Concerns() {
  return (
    <section id="concerns" className="bg-white section-padding">
      <div className="mx-auto max-w-[100rem]">
        <ScrollReveal className="mb-16 text-center md:mb-24">
          <p className="section-label mb-5">Concerns</p>
          <h2 className="heading-section">이런 분께 추천드립니다</h2>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {concerns.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 100}>
              <div className="card-premium flex min-h-[240px] w-full min-w-0 flex-col items-start justify-start border-[#111111] px-10 py-16 text-left md:min-h-[280px] md:px-12 md:py-20 lg:px-14">
                <h3 className="line-clamp-2 text-[17px] font-medium leading-[1.35] tracking-[-0.02em] text-heading-sub sm:text-[18px] md:text-[20px] lg:text-[21px]">
                  {item.title}
                </h3>
                <p className="mt-7 w-full text-[14px] leading-[1.55] tracking-[-0.01em] text-body sm:text-[15px] md:text-[16px] lg:text-[17px]">
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
