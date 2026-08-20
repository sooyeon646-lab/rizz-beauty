import ScrollReveal from "./ScrollReveal";

export default function Visit() {
  return (
    <div id="visit" className="pb-6 md:pb-8">
      <ScrollReveal className="max-w-xl">
        <h3 className="mb-1 text-[15px] font-medium not-italic tracking-[-0.01em] text-heading-sub md:text-base">
          오시는 길
        </h3>
        <p className="body-premium not-italic">
          전주시 완산구 기린대로 135, 2층
        </p>

        <div className="my-4 h-px w-8 bg-black/15" />

        <h3 className="mb-1 text-[15px] font-medium not-italic tracking-[-0.01em] text-heading-sub md:text-base">
          주차 안내
        </h3>
        <p className="body-premium not-italic">
          건물 후면 주차장을 이용해 주세요.
        </p>
        <p className="mt-0.5 text-[13px] leading-[1.75] not-italic tracking-[-0.01em] text-muted md:text-[14px]">
          1층 알레르망 뒤편으로 이동하시면 주차장이 있습니다.
        </p>
      </ScrollReveal>
    </div>
  );
}
