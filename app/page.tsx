import Header from "../components/Header";
export default function Home() {
  return (
    <>
    <Header />
    <main className="min-h-screen bg-white text-gray-900">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-sm tracking-[0.5em] text-gray-500">
          RIZZ BEAUTY
        </p>

        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
          민낯에도
          <br />
          자신 있는 눈썹
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-gray-600">
          리즈뷰티만의 고객 니즈를 찾아
          <br />
          단 하나의 눈썹을 디자인합니다.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="rounded-full bg-black px-8 py-4 text-white transition hover:opacity-90">
            전후사진 보기
          </button>

          <button className="rounded-full border border-black px-8 py-4 transition hover:bg-black hover:text-white">
            가격 확인
          </button>
        </div>
      </section>
    </main>
    </>
  );
}