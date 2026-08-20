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
    description: "예전 모양과 색이 남아 새로운 디자인이 걱정되는 분",
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

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {concerns.map((item) => (
            <ScrollReveal key={item.title}>
              <div className="card-premium flex w-full min-w-0 flex-col items-start justify-start border-[#111111] px-12 py-8 text-left md:px-14 md:py-10 lg:px-16">
                <h3 className="whitespace-nowrap text-[13px] font-semibold leading-none tracking-[-0.02em] text-heading-sub sm:text-[14px] lg:text-[15px]">
                  {item.title}
                </h3>
                <p className="mt-2 w-full whitespace-nowrap text-[12px] leading-none tracking-[-0.01em] text-body sm:text-[13px]">
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
