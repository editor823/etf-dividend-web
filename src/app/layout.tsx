import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import AdSenseScript from "@/components/ads/AdSenseScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const BASE_URL = "https://etf-dividend-web.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "디비던드 인텔 | 미국 배당 ETF 정밀 계산기 & 인컴 투자 분석",
    template: "%s | 디비던드 인텔 (DIVIDEND INTEL)",
  },
  description:
    "SCHD, JEPI, JEPQ 배당 역산기, 1:1 맞짱 비교, DRIP 복리 스노우볼, 과거 백테스트 및 월별 배당 캘린더까지 제공하는 무료 배당 플랫폼",
  keywords: [
    "미국 배당 ETF",
    "SCHD",
    "JEPI",
    "JEPQ",
    "배당 계산기",
    "DRIP 복리",
    "배당 캘린더",
    "은퇴 현금흐름",
    "월배당",
    "배당소득세",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "디비던드 인텔 | 미국 배당 ETF 정밀 계산기 & 인컴 투자 분석",
    description:
      "SCHD, JEPI, JEPQ 배당 역산기, 1:1 맞짱 비교, DRIP 복리 스노우볼, 과거 백테스트 및 월별 배당 캘린더까지 제공하는 무료 배당 플랫폼",
    url: BASE_URL,
    siteName: "디비던드 인텔 (DIVIDEND INTEL)",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "디비던드 인텔 미국 배당 ETF 시뮬레이터",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "디비던드 인텔 | 미국 배당 ETF 정밀 계산기 & 인컴 투자 분석",
    description:
      "SCHD, JEPI, JEPQ 배당 역산기, 1:1 맞짱 비교, DRIP 복리 스노우볼 및 월별 배당 캘린더",
    images: ["/og-image.jpg"],
  },
};

// JSON-LD 구조화 데이터 (Google Rich Results 규격)
const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "DIVIDEND INTEL",
      url: BASE_URL,
      logo: `${BASE_URL}/favicon.ico`,
      email: "editor823@gmail.com",
    },
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/#webapp`,
      name: "디비던드 인텔 미국 배당 ETF 시뮬레이터",
      url: BASE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      description:
        "SCHD, JEPI, JEPQ, VOO 배당 역산 및 복리 스노우볼 시뮬레이션 금융 도구",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "KRW",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-screen bg-brand-bg text-brand-primary antialiased">
        <AdSenseScript />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
