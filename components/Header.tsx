export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <h1 className="text-xl font-bold tracking-[0.3em]">
          RIZZ BEAUTY
        </h1>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#">극사실 눈썹</a>
          <a href="#">헤어라인</a>
          <a href="#">입술</a>
          <a href="#">교육</a>
          <a href="#">전후사진</a>
          <a href="#">가격</a>

          <button className="rounded-full bg-black px-6 py-3 text-white">
            예약하기
          </button>
        </nav>
      </div>
    </header>
  );
}