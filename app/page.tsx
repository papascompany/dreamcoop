import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import Services from "@/components/sections/Services";
import Band from "@/components/sections/Band";
import Process from "@/components/sections/Process";
import Coop from "@/components/sections/Coop";
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
        <Services />
        <Band />
        <Process />
        <Coop />
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
