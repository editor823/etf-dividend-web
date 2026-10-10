import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";

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

export const metadata: Metadata = {
  title: "미국 배당 ETF 인텔리전스 | 배당 현금흐름 시뮬레이터",
  description:
    "SCHD, JEPI, JEPQ, VOO 배당성장 및 고인컴 ETF 현금흐름 역산, 1:1 맞짱 비교, DRIP 복리 시뮬레이션 플랫폼",
  keywords: [
    "미국 배당주",
    "배당 ETF",
    "SCHD",
    "JEPI",
    "JEPQ",
    "배당 계산기",
    "DRIP",
    "월배당",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-brand-bg text-brand-primary antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
