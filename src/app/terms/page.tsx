import Link from 'next/link';
import { FileText, Mail, AlertTriangle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '서비스 이용약관 (Terms of Service)',
  description:
    'DIVIDEND INTEL 웹사이트의 서비스 이용약관, 저작권 안내 및 사용자 권리/의무 규정입니다.',
  alternates: {
    canonical: 'https://etf-dividend-web.pages.dev/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col selection:bg-brand-secondary selection:text-brand-primary">
      {/* 전역 통합 헤더 */}
      <Header />

      {/* 본문 */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        {/* 상단 브레드크럼 (Breadcrumb) 네비게이션 */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-muted font-medium">
          <Link href="/" className="hover:text-brand-primary hover:underline">홈</Link>
          <span className="text-brand-muted/60">/</span>
          <span className="text-brand-primary font-bold">서비스 이용약관 (Terms)</span>
        </nav>

        <div className="space-y-3 border-b border-subtle-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-bold">
            <FileText className="w-4 h-4 text-income" />
            플랫폼 운영 및 이용 규정
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-primary tracking-tight">
            서비스 이용약관 (Terms of Service)
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted font-mono">
            최종 개정일자: 2026년 3월 15일 | 시행일자: 2026년 3월 15일
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-subtle-border p-8 shadow-card space-y-8 text-xs sm:text-sm text-brand-primary/85 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              제1조 (목적)
            </h2>
            <p>
              본 약관은 DIVIDEND INTEL(이하 &lsquo;사이트&rsquo;)이 제공하는 미국 배당 ETF 시뮬레이션, 
              현금흐름 역산 계산기 및 금융 분석 콘텐츠(이하 &lsquo;서비스&rsquo;)의 이용과 관련하여 
              사이트와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              제2조 (서비스의 내용 및 무료 이용)
            </h2>
            <p>
              사이트는 이용자에게 미국 배당 ETF(SCHD, JEPI, JEPQ, VOO 등)에 관한 데이터 분석 도구를 제공합니다:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-brand-muted">
              <li>월 목표 배당 역산 계산기 및 단계별 마일스톤 산출</li>
              <li>ETF 1:1 맞짱 비교기 및 지표별 자동 우위 판정</li>
              <li>과거 타임머신 백테스터 및 DRIP(배당 재투자) 복리 시뮬레이터</li>
              <li>바벨 포트폴리오 최적화기 및 12개월 배당 캘린더</li>
            </ul>
            <p className="pt-1">
              본 서비스는 모든 이용자에게 무료로 제공되며, 사이트는 운영 정책에 따라 서비스의 일부 또는 전부를 수정하거나 중단할 수 있습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              제3조 (지적재산권 및 콘텐츠 저작권)
            </h2>
            <p>
              1. 사이트가 자체 제작한 연산 알고리즘 코드, 텍스트 분석 리포트, UI/UX 디자인 및 그래픽 저작물에 대한 저작권은 
              DIVIDEND INTEL에 귀속됩니다.
            </p>
            <p>
              2. 이용자는 사이트의 사전 서면 승낙 없이 본 사이트의 콘텐츠를 무단 복제, 배포, 크롤링, 전송하거나 
              영리 목적으로 상업적 재가공할 수 없습니다. 비영리 목적으로 출처(URL)를 명시한 인용은 허용됩니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-alert" />
              제4조 (서비스 이용의 제한 및 금지행위)
            </h2>
            <p>이용자는 다음 각 호의 행위를 하여서는 안 됩니다:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-brand-muted">
              <li>자동화된 봇(Bot), 스크레이퍼 등을 이용해 비정상적인 대량의 트래픽을 유발하는 행위</li>
              <li>사이트의 서버나 네트워크를 방해하거나 취약점을 공격하는 행위</li>
              <li>타인의 구글 계정을 도용하여 포트폴리오 저장 기능을 부정하게 이용하는 행위</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              제5조 (면책 조항)
            </h2>
            <p>
              1. 사이트는 천재지변, 인터넷 통신망 장애, 외부 데이터 공급처(Yahoo Finance, Supabase 등)의 
              일시적 오류로 인한 서비스 중단에 대해 책임을 지지 않습니다.
            </p>
            <p>
              2. 본 서비스에서 산출되는 모든 계산 결과는 과거 데이터 및 모델링에 기초한 가상의 추정치이며, 
              실제 투자 결과의 성공을 보장하지 않습니다. 자세한 면책 조항은 &lsquo;투자 면책조항(Disclaimer)&rsquo; 페이지를 참조하시기 바랍니다.
            </p>
          </section>

          <section className="p-4 rounded-2xl bg-brand-bg border border-subtle-border space-y-2">
            <h2 className="text-sm font-bold text-brand-primary flex items-center gap-2">
              <Mail className="w-4 h-4 text-income" />
              제6조 (문의 및 분쟁 해결)
            </h2>
            <p className="text-xs text-brand-muted">
              약관에 관한 문의 사항이나 이의 제기는 공식 이메일(
              <a href="mailto:editor823@gmail.com" className="text-income underline font-mono font-medium">
                editor823@gmail.com
              </a>
              )로 접수해주시기 바랍니다. 본 약관은 대한민국 법령을 준거법으로 합니다.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
