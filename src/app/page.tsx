'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Scale,
  Calendar,
  ArrowRight,
  History,
  Repeat,
  BookOpen,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import TargetDividendCalculator from '@/components/calculator/TargetDividendCalculator';
import EtfComparison from '@/components/calculator/EtfComparison';
import HistoricalSimulator from '@/components/calculator/HistoricalSimulator';
import BarbellOptimizer from '@/components/calculator/BarbellOptimizer';
import DripSimulator from '@/components/calculator/DripSimulator';
import DividendCalendar from '@/components/calculator/DividendCalendar';
import QuickGuideModal from '@/components/calculator/QuickGuideModal';
import SavePortfolioModal from '@/components/auth/SavePortfolioModal';
import AdminDashboardModal from '@/components/admin/AdminDashboardModal';
import SemanticSearchHero from '@/components/search/SemanticSearchHero';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdBannerSlot from '@/components/ads/AdBannerSlot';

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    'reverse' | 'compare' | 'timemachine' | 'barbell' | 'drip' | 'calendar'
  >('reverse');
  const [selectedCalculatorTicker, setSelectedCalculatorTicker] = useState<string>('SCHD');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const scrollToSection = (
    tab: 'reverse' | 'compare' | 'timemachine' | 'barbell' | 'drip' | 'calendar'
  ) => {
    setActiveTab(tab);
    const el = document.getElementById('interactive-tools');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // AI 시맨틱 검색 등에서 ETF를 선택했을 때 역산기로 즉시 반영 및 스크롤
  const handleSelectEtfForCalculator = (ticker: string) => {
    setSelectedCalculatorTicker(ticker);
    setActiveTab('reverse');
    const el = document.getElementById('interactive-tools');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // URL 쿼리 파라미터(?tab=...) 또는 해시 기반 탭 자동 활성화 & 스크롤
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const validTabs: Array<'reverse' | 'compare' | 'timemachine' | 'barbell' | 'drip' | 'calendar'> = [
      'reverse',
      'compare',
      'timemachine',
      'barbell',
      'drip',
      'calendar',
    ];
    const isTab = (val: string | null): val is 'reverse' | 'compare' | 'timemachine' | 'barbell' | 'drip' | 'calendar' =>
      validTabs.includes(val as 'reverse' | 'compare' | 'timemachine' | 'barbell' | 'drip' | 'calendar');

    if (isTab(tabParam)) {
      setActiveTab(tabParam);
      setTimeout(() => {
        const el = document.getElementById('interactive-tools');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // 저장용 기본 포트폴리오 예시 데이터
  const currentHoldingsToSave = [
    { ticker: 'SCHD', shares: 200, targetWeight: 50 },
    { ticker: 'JEPI', shares: 300, targetWeight: 30 },
    { ticker: 'JEPQ', shares: 200, targetWeight: 20 },
  ];

  const coreFeatures = [
    {
      id: 'reverse',
      step: '01',
      title: '월 목표 배당 역산 계산기',
      desc: '매달 세후 100만~300만 원 수령을 위해 필요한 ETF 매수 주식 수와 필요 원금을 정밀 역산합니다.',
      icon: DollarSign,
      badge: 'Cash-Flow',
      status: '🚀 지금 바로 사용 가능',
      isLive: true,
      tab: 'reverse' as const,
    },
    {
      id: 'compare',
      step: '02',
      title: 'ETF 1:1 맞짱 비교기',
      desc: 'SCHD vs JEPI, VOO vs SCHD 등 핵심 ETF를 지표별로 대조하여 왕관(👑)과 승패를 가립니다.',
      icon: Scale,
      badge: 'Head-to-Head',
      status: '👑 지금 바로 사용 가능',
      isLive: true,
      tab: 'compare' as const,
    },
    {
      id: 'timemachine',
      step: '03',
      title: '과거 ETF 타임머신 백테스터',
      desc: '과거 1년/3년/5년 전 투자 시 실제 배당금과 현재 평가액, YoC(원금대비 배당수익률)를 역추적합니다.',
      icon: History,
      badge: 'Time-Machine',
      status: '📈 지금 바로 사용 가능',
      isLive: true,
      tab: 'timemachine' as const,
    },
    {
      id: 'barbell',
      step: '04',
      title: '바벨 포트폴리오 최적화기',
      desc: '배당성장(SCHD)과 고인컴(JEPI/JEPQ)의 슬라이더 비중을 조절하여 맞춤형 현금흐름을 최적화합니다.',
      icon: PieChart,
      badge: 'Barbell Strategy',
      status: '⚖️ 지금 바로 사용 가능',
      isLive: true,
      tab: 'barbell' as const,
    },
    {
      id: 'drip',
      step: '05',
      title: 'DRIP 복리 스노우볼 시뮬레이터',
      desc: '미국 배당소득세 15% 원천징수를 반영하여 재투자 시 자산이 증식하는 복리 곡선을 시각화합니다.',
      icon: Repeat,
      badge: 'DRIP Snowball',
      status: '❄️ 지금 바로 사용 가능',
      isLive: true,
      tab: 'drip' as const,
    },
    {
      id: 'calendar',
      step: '06',
      title: '월별 배당 캘린더 대시보드',
      desc: '배당락일 및 지급일 기준 월초 고정 인컴과 분기 보너스 인컴을 타임라인으로 보여줍니다.',
      icon: Calendar,
      badge: 'Dividend Calendar',
      status: '📅 지금 바로 사용 가능',
      isLive: true,
      tab: 'calendar' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col selection:bg-brand-secondary selection:text-brand-primary">
      {/* 글로벌 상단 헤더 */}
      <Header
        activeTab={activeTab}
        onTabSelect={scrollToSection}
        onOpenSaveModal={() => setIsSaveModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
      />

      {/* 6대 계산기 초간단 활용 가이드 1줄 알림 배너 (헤더 바로 아래) */}
      <div className="w-full bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-income/10 border-b border-amber-300/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Lightbulb className="w-4 h-4" />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-sm text-brand-primary">
                처음 방문하셨나요? 6대 계산기 200% 활용 가이드
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/60">
                초보자 필수
              </span>
              <span className="text-xs text-brand-muted hidden md:inline">
                내 투자 상황에 딱 맞는 계산기 선택 기준과 실전 꿀팁을 확인하세요.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsGuideModalOpen(true)}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>활용 가이드 열기</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 메인 히어로 섹션 */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-income" />
            2026 미국 배당 ETF 실시간 인텔리전스 & 현금흐름 분석
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-brand-primary">
            미국 배당 ETF로 설계하는 <br className="hidden sm:inline" />
            <span className="text-income underline decoration-income/30 decoration-wavy">
              확실한 월급 현금흐름
            </span>
          </h1>

          <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
            SCHD, JEPI, JEPQ, VOO 등 미국 대표 배당 ETF의 세후 실수령액 역산부터 1:1 맞짱 비교, 복리 스노우볼, 배당 캘린더까지 한눈에 분석하세요.
          </p>

          {/* 일반 방문자용 주요 기능 빠른 안내 뱃지 바 */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-subtle-border shadow-2xs font-semibold text-brand-primary flex items-center gap-1.5">
              🎯 목표 월배당 역산
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-subtle-border shadow-2xs font-semibold text-brand-primary flex items-center gap-1.5">
              ⚔️ 1:1 ETF 맞짱 비교
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-subtle-border shadow-2xs font-semibold text-brand-primary flex items-center gap-1.5">
              ⚖️ 바벨 최적화
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-subtle-border shadow-2xs font-semibold text-brand-primary flex items-center gap-1.5">
              ❄️ DRIP 복리 시뮬레이터
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-subtle-border shadow-2xs font-semibold text-brand-primary flex items-center gap-1.5">
              📅 12개월 배당 캘린더
            </span>
            <Link
              href="/encyclopedia"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-income/40 shadow-2xs font-extrabold text-income flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              📖 미국 배당 ETF 20선 백과사전
            </Link>
            <Link
              href="/rankings"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 shadow-2xs font-extrabold text-amber-900 flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              🔥 서학 vs 동학 인기 랭킹
            </Link>
          </div>

          {/* AI 자연어 시맨틱 맞춤 검색 섹션 */}
          <div className="pt-4">
            <SemanticSearchHero onSelectEtfForCalculator={handleSelectEtfForCalculator} />
          </div>
        </div>

        {/* 인터랙티브 탭 & 툴 섹션 (상단 스티키 헤더 탭과 일원화되어 중복 탭 박스 없이 전용 뷰 직접 표시) */}
        <section id="interactive-tools" className="scroll-mt-28">
          <div>
            {activeTab === 'reverse' && (
              <TargetDividendCalculator initialTicker={selectedCalculatorTicker} />
            )}
            {activeTab === 'compare' && <EtfComparison />}
            {activeTab === 'timemachine' && <HistoricalSimulator />}
            {activeTab === 'barbell' && <BarbellOptimizer />}
            {activeTab === 'drip' && <DripSimulator />}
            {activeTab === 'calendar' && <DividendCalendar />}
          </div>
        </section>

        {/* 메인 계산기 하단 광고 슬롯 */}
        <AdBannerSlot slotId="home-calculator-bottom-slot" className="my-8" />

        {/* 6대 핵심 기능 로드맵 그리드 */}
        <div className="pt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-brand-muted">
                Core Modules Completed
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-primary mt-1">
                플랫폼 6대 핵심 금융 시뮬레이터 (전체 완성)
              </h2>
            </div>
            <p className="text-sm text-brand-muted max-w-md">
              클라이언트 고속 연산과 Recharts 시각화를 바탕으로 투자자에게 즉각적인 의사결정 인사이트를 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href="#interactive-tools"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.tab);
                  }}
                  title={`${item.title} 바로 실행하기`}
                  className="group bg-white rounded-2xl p-6 border border-income/40 shadow-card hover:shadow-elevated hover:-translate-y-1 cursor-pointer ring-1 ring-income/20 transition-all duration-300 relative flex flex-col justify-between text-left"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-income-light text-income">
                        {item.badge}
                      </span>
                      <span className="text-xs font-mono text-brand-muted font-bold">
                        {item.step}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-income-light text-income group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-brand-primary mb-2 group-hover:text-income transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-brand-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-subtle-border/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-income">
                      {item.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-income group-hover:translate-x-1.5 transition-all" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* 심층 리서치 가이드 아티클 섹션 (구글 애드센스 E-E-A-T 고품질 콘텐츠) */}
        <section className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-subtle-border pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-income-light text-income text-xs font-bold mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                전문가 심층 분석 리포트
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
                미국 배당 ETF 핵심 가이드 아티클
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                기초지수 스크리닝 알고리즘부터 파생 커버드콜 구조, 절세 계좌 전략까지 엄선된 전문 지식을 확인하세요.
              </p>
            </div>
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-income hover:underline self-start sm:self-auto"
            >
              <span>전체 가이드 목록 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/guides/schd-complete-guide"
              className="group bg-white rounded-2xl border border-subtle-border p-6 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-income-light text-income">
                  배당성장 심층분석
                </span>
                <h3 className="text-base font-bold text-brand-primary group-hover:text-income transition-colors line-clamp-2">
                  SCHD 배당성장 ETF 완벽 분석: 선별 기준, 10년 성장률 및 장기 보유 전략
                </h3>
                <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                  Dow Jones U.S. Dividend 100 지수의 엄격한 4단계 필터링과 복리 효과를 극대화하는 실전 투자 지침
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-subtle-border/60 flex items-center justify-between text-xs text-income font-bold">
                <span>리포트 읽기</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              href="/guides/covered-call-mechanics"
              className="group bg-white rounded-2xl border border-subtle-border p-6 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-income-light text-income">
                  고인컴/파생전략
                </span>
                <h3 className="text-base font-bold text-brand-primary group-hover:text-income transition-colors line-clamp-2">
                  커버드콜 ETF JEPI·JEPQ의 작동 원리와 상승장 언더퍼폼 한계 극복법
                </h3>
                <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                  ELN 구조화 채권과 OTM 콜옵션 매도를 통한 월배당 창출 메커니즘 및 원금 잠식 방어 가이드
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-subtle-border/60 flex items-center justify-between text-xs text-income font-bold">
                <span>리포트 읽기</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              href="/guides/isa-vs-direct-investment"
              className="group bg-white rounded-2xl border border-subtle-border p-6 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-income-light text-income">
                  세금/절세 전략
                </span>
                <h3 className="text-base font-bold text-brand-primary group-hover:text-income transition-colors line-clamp-2">
                  국내 상장 미국 배당 ETF vs 미국 직투 세금 차이 및 절세 계좌 완벽 가이드
                </h3>
                <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                  15% 원천징수, 금융소득종합과세 2,000만 원, ISA 비과세 혜택과 연금저축 과세이연 실전 비교
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-subtle-border/60 flex items-center justify-between text-xs text-income font-bold">
                <span>리포트 읽기</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </section>

        {/* 메인 하단 광고 슬롯 */}
        <AdBannerSlot slotId="home-footer-top-slot" className="my-8" />
      </main>

      {/* 포트폴리오 저장 모달 팝업 */}
      <SavePortfolioModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        currentHoldings={currentHoldingsToSave}
      />

      {/* 글로벌 푸터 */}
      <Footer onOpenAdminModal={() => setIsAdminModalOpen(true)} />

      {/* 관리자 모드 모달 */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isSupabaseConfigured={isSupabaseConfigured}
      />

      {/* 6대 계산기 초간단 활용 가이드 모달 */}
      <QuickGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onSelectTab={scrollToSection}
        defaultTab={activeTab}
      />
    </div>
  );
}
