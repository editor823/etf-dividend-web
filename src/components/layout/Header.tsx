'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  Bookmark,
  User,
  LogOut,
  Lock,
  BookOpen,
  Calculator,
  Info,
  Menu,
  X,
  Lightbulb,
  Flame,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export type CalculatorTab =
  | 'reverse'
  | 'compare'
  | 'timemachine'
  | 'barbell'
  | 'drip'
  | 'calendar';

interface HeaderProps {
  activeTab?: CalculatorTab;
  onTabSelect?: (tab: CalculatorTab) => void;
  onOpenSaveModal?: () => void;
  onOpenAdminModal?: () => void;
  onOpenGuideModal?: () => void;
}

export default function Header({
  activeTab,
  onTabSelect,
  onOpenSaveModal,
  onOpenAdminModal,
  onOpenGuideModal,
}: HeaderProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isGuides = pathname.startsWith('/guides');
  const isAbout = pathname === '/about';
  const isRankings = pathname === '/rankings';
  const isEncyclopedia = pathname.startsWith('/encyclopedia') || pathname.startsWith('/dictionary');

  const tabList: { id: CalculatorTab; label: string; icon: string }[] = [
    { id: 'reverse', label: '1. 역산기', icon: '🎯' },
    { id: 'compare', label: '2. 1:1 맞짱', icon: '⚔️' },
    { id: 'timemachine', label: '3. 타임머신', icon: '📈' },
    { id: 'barbell', label: '4. 바벨 포트폴리오', icon: '⚖️' },
    { id: 'drip', label: '5. DRIP 복리', icon: '❄️' },
    { id: 'calendar', label: '6. 배당 캘린더', icon: '📅' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-subtle-border transition-all">
      {/* 1. 최상단 메인 헤더 바 (h-16) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 좌측 로고 (클릭 시 메인 홈 / 이동) */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-md group-hover:bg-brand-dark transition-all duration-200 group-hover:scale-105">
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
        </Link>

        {/* 데스크톱 우측 네비게이션 */}
        <div className="hidden lg:flex items-center gap-2">
          {/* 주요 글로벌 링크 (계산기 대시보드 / 투자 가이드 / ETF 백과사전 / 사이트 소개 / 랭킹) */}
          <nav className="flex items-center gap-1.5">
            {!isHome && (
              <Link
                href="/"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-brand-primary hover:bg-brand-secondary transition-all flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-brand-muted" />
                <span>계산기 대시보드</span>
              </Link>
            )}

            <Link
              href="/encyclopedia"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isEncyclopedia
                  ? 'bg-income text-white font-extrabold shadow-2xs'
                  : 'text-brand-primary hover:bg-brand-secondary hover:text-income'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${isEncyclopedia ? 'text-white' : 'text-income'}`} />
              <span>ETF 백과사전</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isEncyclopedia ? 'bg-white/20 text-white' : 'bg-income text-white'}`}>
                20선
              </span>
            </Link>

            <Link
              href="/guides"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isGuides
                  ? 'bg-income-light text-income font-extrabold ring-1 ring-income/30'
                  : 'text-brand-muted hover:text-brand-primary hover:bg-brand-secondary'
              }`}
            >
              <span>투자 가이드</span>
            </Link>

            <Link
              href="/about"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isAbout
                  ? 'bg-brand-secondary text-brand-primary font-extrabold'
                  : 'text-brand-muted hover:text-brand-primary hover:bg-brand-secondary/70'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>사이트 소개</span>
            </Link>

            <Link
              href="/rankings"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                isRankings
                  ? 'bg-orange-600 text-white border-orange-600 font-extrabold shadow-xs'
                  : 'text-orange-700 bg-orange-50 hover:bg-orange-100/80 border-orange-200/60'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${isRankings ? 'text-white' : 'text-orange-600'}`} />
              <span>서학·동학 랭킹</span>
            </Link>

            {onOpenGuideModal && (
              <button
                type="button"
                onClick={onOpenGuideModal}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100/80 transition-all flex items-center gap-1.5 border border-amber-200/60 shadow-2xs cursor-pointer"
                title="6대 계산기 초간단 사용법 및 활용 꿀팁 보기"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>계산기 사용법</span>
              </button>
            )}
          </nav>

          {/* 구분선 */}
          <div className="h-5 w-px bg-subtle-border mx-1" />

          {/* 포트폴리오 저장 버튼 */}
          {onOpenSaveModal && (
            <button
              type="button"
              onClick={onOpenSaveModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-secondary hover:bg-brand-secondaryHover text-brand-primary text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-income" />
              <span>포트폴리오 저장</span>
            </button>
          )}

          {/* 사용자 로그인 / 계정 상태 */}
          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <div
                className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold shadow-2xs"
                title={user.email}
              >
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <button
                type="button"
                onClick={() => signOut()}
                title="로그아웃"
                className="p-1.5 rounded-lg text-brand-muted hover:text-alert transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            onOpenSaveModal && (
              <button
                type="button"
                onClick={onOpenSaveModal}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>로그인</span>
              </button>
            )
          )}

          {/* 관리자 모드 버튼 */}
          {onOpenAdminModal && (
            <button
              type="button"
              onClick={onOpenAdminModal}
              className="p-1.5 rounded-xl text-brand-muted hover:text-brand-primary hover:bg-brand-secondary transition-colors ml-0.5 cursor-pointer"
              title="시스템 관리자 모드"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 태블릿/모바일 우측 버튼 영역 */}
        <div className="flex lg:hidden items-center gap-1.5">
          <Link
            href="/guides"
            className="px-2.5 py-1.5 rounded-lg bg-income-light text-income text-xs font-bold flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>가이드</span>
          </Link>

          {onOpenSaveModal && (
            <button
              type="button"
              onClick={onOpenSaveModal}
              className="p-2 rounded-xl bg-brand-secondary text-brand-primary hover:bg-brand-secondaryHover"
              title="포트폴리오 저장"
            >
              <Bookmark className="w-4 h-4 text-income" />
            </button>
          )}

          {/* 모바일 햄버거 토글 버튼 */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-brand-primary hover:bg-brand-secondary transition-colors ml-1 cursor-pointer"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* 2. 6대 계산기 완전 일원화 네비게이션 탭 바 (홈 화면 스티키 탭) */}
      {isHome && onTabSelect && (
        <div className="border-t border-subtle-border/80 bg-white/95 backdrop-blur-md shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-start md:justify-center gap-1.5 py-2 overflow-x-auto no-scrollbar">
              {tabList.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabSelect(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-brand-primary text-white shadow-sm ring-2 ring-income/40 scale-102'
                        : 'text-brand-primary/70 hover:text-brand-primary hover:bg-brand-secondary/70'
                    }`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. 모바일 드롭다운 메뉴 (반응형 햄버거 메뉴) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-subtle-border bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors ${
                isHome
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-bg hover:bg-brand-secondary text-brand-primary'
              }`}
            >
              <span className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-income" />
                <span>계산기 대시보드 (메인)</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">6대 툴</span>
            </Link>

            <Link
              href="/guides"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors ${
                isGuides
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-bg hover:bg-brand-secondary text-brand-primary'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-income" />
                <span>투자 가이드 리포트</span>
              </span>
              <span className="text-[10px] bg-income text-white px-2 py-0.5 rounded-full font-mono">
                신규 칼럼
              </span>
            </Link>

            <Link
              href="/encyclopedia"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors ${
                isEncyclopedia
                  ? 'bg-income text-white shadow-xs'
                  : 'bg-income-light/40 border border-income/30 text-income hover:bg-income-light/70'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>📖 미국 배당 ETF 20선 백과사전</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${isEncyclopedia ? 'bg-white/20 text-white' : 'bg-income text-white'}`}>
                20종 심층해설
              </span>
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors ${
                isAbout
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-bg hover:bg-brand-secondary text-brand-primary'
              }`}
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-income" />
                <span>플랫폼 및 운영진 소개 (About)</span>
              </span>
              <span className="text-[10px] text-brand-muted">E-E-A-T</span>
            </Link>

            <Link
              href="/rankings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-xs font-bold bg-orange-50/80 border border-orange-200/80 text-orange-900 hover:bg-orange-100/80 transition-colors shadow-2xs"
            >
              <span className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>🔥 서학 vs 동학 ETF 인기 랭킹</span>
              </span>
              <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full font-mono">
                랭킹 센터
              </span>
            </Link>

            {onOpenGuideModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenGuideModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold bg-amber-50 border border-amber-200/80 text-amber-900 hover:bg-amber-100/80 transition-colors shadow-2xs cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>💡 6대 계산기 초간단 활용 가이드</span>
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  도움말
                </span>
              </button>
            )}

            {/* 6대 핵심 배당 계산기 바로가기 */}
            <div className="pt-2">
              <span className="text-[10px] text-brand-muted font-mono uppercase tracking-wider px-1 block mb-1.5">
                핵심 배당 계산기 탭 전환
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {tabList.map((tab) => {
                  if (isHome && onTabSelect) {
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          onTabSelect(tab.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold text-left border flex items-center gap-1.5 transition-all ${
                          activeTab === tab.id
                            ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                            : 'bg-white border-subtle-border text-brand-primary hover:bg-brand-secondary'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={tab.id}
                      href={`/?tab=${tab.id}#interactive-tools`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl text-xs font-bold text-left border bg-white border-subtle-border text-brand-primary hover:bg-brand-secondary flex items-center gap-1.5 transition-colors"
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 하단 유틸리티 (로그인, 관리자) */}
            <div className="pt-3 border-t border-subtle-border flex items-center justify-between">
              {user ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-brand-primary">
                    {user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-alert underline font-semibold"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                onOpenSaveModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSaveModal();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-xs text-brand-primary font-bold"
                  >
                    <User className="w-3.5 h-3.5 text-income" />
                    <span>구글 계정 로그인</span>
                  </button>
                )
              )}

              {onOpenAdminModal && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAdminModal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-xs text-brand-muted hover:text-brand-primary font-mono"
                  title="관리자 모드"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
