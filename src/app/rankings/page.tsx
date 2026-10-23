import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TaxComparisonSimulator from '@/components/calculator/TaxComparisonSimulator';
import EtfPopularityRanking from '@/components/calculator/EtfPopularityRanking';
import { ArrowLeft, Calculator, BookOpen, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: '2026 미국 배당 ETF 인기 랭킹 & 절세 매칭 | 서학개미 vs 동학개미',
  description:
    '미국 직투(SCHD, JEPI, VOO, QQQ)와 국내 상장 절세 ETF(TIGER, ACE, SOL)의 2026 실시간 인기 순위, 실질 총보수(TER), ISA·연금 세금 비교 시뮬레이터를 제공합니다.',
  keywords: [
    '미국 배당 ETF 순위',
    '서학개미 인기 ETF',
    '한국판 SCHD',
    'TIGER 미국배당다우존스',
    'ACE 미국배당다우존스',
    'ISA 계좌 배당 ETF',
    '연금저축 미국 ETF',
    '배당소득세 절세',
  ],
  openGraph: {
    title: '2026 미국 배당 ETF 인기 랭킹 & 절세 매칭 | 서학개미 vs 동학개미',
    description:
      '달러 직투 오리지널 종목과 국내 절세계좌 대체 종목의 실질 수수료(TER) 및 세후 실수령액을 한눈에 비교하세요.',
    type: 'website',
  },
};

export default function RankingsPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col selection:bg-brand-secondary selection:text-brand-primary">
      {/* 글로벌 상단 헤더 */}
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 w-full">
        {/* 상단 브레드크럼 & 뒤로가기 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>메인 계산기 대시보드로 돌아가기</span>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/guides/isa-vs-direct-investment"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-subtle-border font-bold text-income hover:bg-income-light/50 transition-all shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>직투 vs ISA 세금 가이드 읽기</span>
            </Link>
            <Link
              href="/#interactive-tools"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-dark transition-all shadow-2xs"
            >
              <Calculator className="w-3.5 h-3.5 text-income" />
              <span>6대 계산기 실행</span>
            </Link>
          </div>
        </div>

        {/* 1. 상단 타이틀 배너 */}
        <div className="text-center sm:text-left space-y-2 border-b border-subtle-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-orange-500/10 to-amber-500/10 border border-orange-300/40 text-orange-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>2026 대한민국 스마트 배당 투자자 리포트</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-primary tracking-tight">
            서학 vs 동학 배당 ETF 인기 랭킹 &amp; 절세 매칭 센터
          </h1>
          <p className="text-sm text-brand-muted max-w-3xl leading-relaxed">
            달러($)로 직접 매수하는 미국 오리지널 ETF와 국내 절세계좌(ISA, 연금저축, IRP)에서 세금을 아끼는 한국판 종목을 1:1로 매칭하고, 내 배당금 규모에 맞는 최적의 계좌를 찾아드립니다.
          </p>
        </div>

        {/* 2. 상단 고도화 기능: '직투 vs ISA/연금' 실전 세금 시뮬레이터 */}
        <TaxComparisonSimulator />

        {/* 3. 메인 콘텐츠: 카테고리별 서학 vs 동학 인기 랭킹 & 실질 보수(TER) 매칭 보드 */}
        <EtfPopularityRanking />

        {/* 4. E-E-A-T 계좌 선택 핵심 지침 */}
        <div className="p-6 bg-white rounded-3xl border border-subtle-border shadow-card space-y-4">
          <h3 className="text-base sm:text-lg font-extrabold text-brand-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-income" />
            서학개미(미국 직투) vs 동학개미(절세계좌) 선택 가이드 3원칙
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-brand-muted">
            <div className="p-4 rounded-2xl bg-brand-bg/70 border border-subtle-border space-y-1.5">
              <strong className="text-blue-900 font-bold block text-sm">
                1. 미국 직투가 유리한 경우
              </strong>
              <p>
                매년 <strong>매매차익 250만 원 비과세</strong>를 활용할 수 있고, 원화 가치 하락에 대비해 <strong>달러($) 현금 자산</strong>을 장기 보유하고 싶은 경우에 적합합니다.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-brand-bg/70 border border-subtle-border space-y-1.5">
              <strong className="text-emerald-950 font-bold block text-sm">
                2. ISA 계좌가 유리한 경우
              </strong>
              <p>
                배당금이 <strong>연 2,000만 원 이하</strong>이며, 3년 만기 후 비과세(최대 400만)와 <strong>9.9% 분리과세</strong>로 세금을 아끼고 건강보험료 피부양자 자격을 지키고 싶은 경우에 필수적입니다.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-brand-bg/70 border border-subtle-border space-y-1.5">
              <strong className="text-purple-900 font-bold block text-sm">
                3. 연금저축/IRP가 유리한 경우
              </strong>
              <p>
                연 최대 900만 원 납입으로 <strong>연말정산 118만~148만 원 세액공제</strong>를 돌려받고, 배당세를 1원도 안 내며 복리로 자산을 굴려 55세 이후 연금(3.3~5.5%)으로 받을 분에게 최적입니다.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 글로벌 푸터 */}
      <Footer />
    </div>
  );
}
