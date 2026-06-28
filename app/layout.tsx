import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Noto_Serif_KR, Nanum_Pen_Script } from "next/font/google";
import { company } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

const nanumPen = Nanum_Pen_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-nanum-pen",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "드림상조협동조합 — 마지막 길을, 가장 따뜻하게",
    template: "%s | 드림상조협동조합",
  },
  description:
    "상조는 금융상품이 아닙니다. 드림상조협동조합은 매월 납입 없는 후불제 비영리 상조 협동조합입니다. 출자·가입비 10만원 한 번으로 가족 모두가 정중하고 고결한 배웅을 준비합니다. 24시간 상담.",
  keywords: [
    "상조",
    "상조 협동조합",
    "비영리 상조",
    "후불제 상조",
    "월납입 없는 상조",
    "드림상조",
    "장례",
    "장례 의전",
    "사전 상조 상담",
    "구로 상조",
  ],
  authors: [{ name: company.name }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: company.name,
    title: "드림상조협동조합 — 마지막 길을, 가장 따뜻하게",
    description:
      "매월 납입 없는 후불제 비영리 상조 협동조합. 출자·가입비 10만원 한 번으로 가족 모두가 정중한 배웅을 준비합니다.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2e3a38",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "FuneralHome",
  name: company.name,
  legalName: company.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`, // TODO: 실제 로고 파일 추가
  image: `${SITE_URL}/opengraph-image`,
  description:
    "매월 납입 없는 후불제 비영리 상조 협동조합. 고인을 정중하고 고결하게 배웅합니다.",
  telephone: company.tel,
  address: {
    "@type": "PostalAddress",
    addressLocality: "서울특별시 구로구",
    addressCountry: "KR",
  },
  founder: { "@type": "Person", name: company.rep },
  sameAs: [], // TODO: 네이버 플레이스/블로그/페이스북 등 채널 URL
  areaServed: "KR",
  availableLanguage: "ko",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${notoSans.variable} ${notoSerif.variable} ${nanumPen.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
