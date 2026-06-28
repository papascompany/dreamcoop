import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import FourDreams from "@/components/sections/FourDreams";
import Services from "@/components/sections/Services";
import Product from "@/components/sections/Product";
import Band from "@/components/sections/Band";
import Process from "@/components/sections/Process";
import MemberBenefits from "@/components/sections/MemberBenefits";
import Coop from "@/components/sections/Coop";
import Campaign from "@/components/sections/Campaign";
import Contact from "@/components/sections/Contact";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import { faq } from "@/lib/content";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "ko-KR",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        본문 바로가기
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Philosophy />
        <FourDreams />
        <Services />
        <Product />
        <Band />
        <Process />
        <MemberBenefits />
        <Coop />
        <Campaign />
        <Contact />
        <Faq />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
