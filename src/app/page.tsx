import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Concerns from "@/components/Concerns";
import WhyRizzBeauty from "@/components/WhyRizzBeauty";
import Services from "@/components/Services";
import Academy from "@/components/Academy";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Concerns />
        <WhyRizzBeauty />
        <Services />
        <Academy />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
