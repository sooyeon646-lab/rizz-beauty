import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Concerns from "@/components/Concerns";
import WhyRizzBeauty from "@/components/WhyRizzBeauty";
import Services from "@/components/Services";
import Academy from "@/components/Academy";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import type { SiteData } from "@/types/site";

export default function LandingPreview({ data }: { data: SiteData }) {
  return (
    <>
      <Header data={data} />
      <main>
        <Hero data={data} />
        <Concerns data={data} />
        <WhyRizzBeauty data={data} />
        <Services data={data} />
        <Academy />
      </main>
      <Footer data={data} />
      <ScrollToTop />
    </>
  );
}
