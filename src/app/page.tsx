'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Scale,
  Calendar,
  ArrowRight,
  History,
  Repeat,
  Bookmark,
  User,
  LogOut,
  Lock,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/auth-context';
import TargetDividendCalculator from '@/components/calculator/TargetDividendCalculator';
import EtfComparison from '@/components/calculator/EtfComparison';
import HistoricalSimulator from '@/components/calculator/HistoricalSimulator';
import BarbellOptimizer from '@/components/calculator/BarbellOptimizer';
import DripSimulator from '@/components/calculator/DripSimulator';
import DividendCalendar from '@/components/calculator/DividendCalendar';
import SavePortfolioModal from '@/components/auth/SavePortfolioModal';
import AdminDashboardModal from '@/components/admin/AdminDashboardModal';

export default function Home() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'reverse' | 'compare' | 'timemachine' | 'barbell' | 'drip' | 'calendar'
  >('reverse');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const scrollToSection = (
    tab: 'reverse' | 'compare' | 'timemachine' | 'barbell' | 'drip' | 'calendar'
  ) => {
    setActiveTab(tab);
    const el = document.getElementById('interactive-tools');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-subtle-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-income" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-brand-primary block leading-none">
                DIVIDEND INTEL
              </span>
              <span className="text-xs text-brand-muted font-mono">
                미국 배당 ETF 인텔리전스
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 네비게이션 탭 버튼들 */}
            <div className="hidden lg:flex items-center gap-1 bg-brand-secondary/40 p-1 rounded-xl">
              <button
                onClick={() => scrollToSection('reverse')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'reverse'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-brand-primary hover:bg-brand-secondary'
                }`}
              >
                역산기
              </button>
              <button
                onClick={() => scrollToSection('compare')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'compare'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-brand-primary hover:bg-brand-secondary'
                }`}
              >
                맞짱
              </button>
              <button
                onClick={() => scrollToSection('timemachine')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'timemachine'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-brand-primary hover:bg-brand-secondary'
                }`}
              >
                타임머신
              </button>
              <button
                onClick={() => scrollToSection('barbell')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'barbell'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-brand-primary hover:bg-brand-secondary'
                }`}
              >
                바벨
              </button>
              <button
                onClick={() => scrollToSection('drip')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'drip'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-brand-primary hover:bg-brand-secondary'
                }`}
              >
                DRIP
              </button>
              <button
                onClick={() => scrollToSection('calendar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-brand-primary hover:bg-brand-secondary'
                }`}
              >
                캘린더
              </button>
            </div>

            {/* 내 포트폴리오 저장 버튼 */}
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-secondary hover:bg-brand-secondaryHover text-brand-primary text-xs font-bold transition-all shadow-2xs"
            >
              <Bookmark className="w-3.5 h-3.5 text-income" />
              <span className="hidden sm:inline">포트폴리오 저장</span>
            </button>

            {/* 유저 로그인 상태 */}
            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={() => signOut()}
                  title="로그아웃"
                  className="p-1.5 rounded-lg text-brand-muted hover:text-alert transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSaveModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>로그인</span>
              </button>
            )}

            {/* 관리자 모드 버튼 */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="p-1.5 rounded-xl text-brand-muted hover:text-brand-primary hover:bg-brand-secondary transition-colors"
              title="시스템 관리자 모드"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

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
          </div>
        </div>

        {/* 인터랙티브 탭 & 툴 섹션 */}
        <section id="interactive-tools" className="scroll-mt-24 space-y-6">
          {/* 상단 탭 네비게이션 */}
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap justify-center p-1.5 bg-brand-secondary/70 rounded-2xl border border-subtle-border shadow-xs gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('reverse')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeTab === 'reverse'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-brand-primary/70 hover:text-brand-primary'
                }`}
              >
                <DollarSign className="w-4 h-4 text-income" />
                <span>1. 역산기</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('compare')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeTab === 'compare'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-brand-primary/70 hover:text-brand-primary'
                }`}
              >
                <Scale className="w-4 h-4 text-income" />
                <span>2. 1:1 맞짱</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('timemachine')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeTab === 'timemachine'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-brand-primary/70 hover:text-brand-primary'
                }`}
              >
                <History className="w-4 h-4 text-income" />
                <span>3. 타임머신</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('barbell')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeTab === 'barbell'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-brand-primary/70 hover:text-brand-primary'
                }`}
              >
                <PieChart className="w-4 h-4 text-income" />
                <span>4. 바벨 포트폴리오</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('drip')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeTab === 'drip'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-brand-primary/70 hover:text-brand-primary'
                }`}
              >
                <Repeat className="w-4 h-4 text-income" />
                <span>5. DRIP 복리</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-brand-primary/70 hover:text-brand-primary'
                }`}
              >
                <Calendar className="w-4 h-4 text-income" />
                <span>6. 배당 캘린더</span>
              </button>
            </div>
          </div>

          {/* 선택된 탭 컴포넌트 렌더링 */}
          <div>
            {activeTab === 'reverse' && <TargetDividendCalculator />}
            {activeTab === 'compare' && <EtfComparison />}
            {activeTab === 'timemachine' && <HistoricalSimulator />}
            {activeTab === 'barbell' && <BarbellOptimizer />}
            {activeTab === 'drip' && <DripSimulator />}
            {activeTab === 'calendar' && <DividendCalendar />}
          </div>
        </section>

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
                <div
                  key={index}
                  onClick={() => scrollToSection(item.tab)}
                  className="group bg-white rounded-2xl p-6 border border-income/40 shadow-card hover:shadow-elevated hover:-translate-y-1 cursor-pointer ring-1 ring-income/20 transition-all duration-300 relative flex flex-col justify-between"
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
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 포트폴리오 저장 모달 팝업 */}
      <SavePortfolioModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        currentHoldings={currentHoldingsToSave}
      />

      {/* 하단 푸터 */}
      <footer className="border-t border-subtle-border bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <p>© 2026 Dividend Intelligence Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-brand-secondary text-brand-muted hover:text-brand-primary transition-colors cursor-pointer"
              title="관리자 전용 시스템 모드"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>관리자 모드</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 관리자 모드 모달 */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isSupabaseConfigured={isSupabaseConfigured}
      />
    </div>
  );
}
