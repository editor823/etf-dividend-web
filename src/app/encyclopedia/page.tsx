'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Cog,
  Target,
  ChevronDown,
  ChevronUp,
  History,
  Repeat,
  ArrowRight,
  Filter,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  ETF_ENCYCLOPEDIA_LIST,
  ETFEncyclopediaItem,
} from '@/data/etfEncyclopediaData';
import { formatPercent } from '@/lib/utils';

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'ALL', label: '전체 (20종)' },
  { id: '배당성장', label: '🌱 배당성장' },
  { id: '월배당 커버드콜', label: '💰 월배당 커버드콜' },
  { id: '시장지수', label: '📈 시장지수' },
  { id: '배당귀족·가치', label: '👑 배당귀족·가치' },
  { id: '리츠·채권·BDC', label: '🏢 리츠·채권·BDC' },
];

export default function EncyclopediaPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  // 아코디언 상태 관리: 기본적으로 상위 3개(SCHD, DGRO, JEPI)는 펼쳐둠
  const [expandedTickers, setExpandedTickers] = useState<Record<string, boolean>>({
    SCHD: true,
    JEPI: true,
  });

  const toggleExpand = (ticker: string) => {
    setExpandedTickers((prev) => ({
      ...prev,
      [ticker]: !prev[ticker],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    ETF_ENCYCLOPEDIA_LIST.forEach((item) => {
      allExpanded[item.ticker] = true;
    });
    setExpandedTickers(allExpanded);
  };

  const collapseAll = () => {
    setExpandedTickers({});
  };

  // 검색 및 카테고리 필터링
  const filteredList = useMemo(() => {
    return ETF_ENCYCLOPEDIA_LIST.filter((item) => {
      // 카테고리 매칭
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // 검색어 매칭 (티커, 한글명, 영문명, 태그)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTicker = item.ticker.toLowerCase().includes(q);
        const matchNameKo = item.nameKo.toLowerCase().includes(q);
        const matchNameEn = item.nameEn.toLowerCase().includes(q);
        const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
        return matchTicker || matchNameKo || matchNameEn || matchTag;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col selection:bg-brand-secondary selection:text-brand-primary">
      {/* 상단 글로벌 헤더 */}
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 w-full">
        {/* 1. 상단 히어로 배너 */}
        <div className="bg-gradient-to-br from-brand-primary via-brand-dark to-[#1a382b] text-white rounded-3xl p-6 sm:p-10 shadow-elevated relative overflow-hidden space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-income-light text-xs font-bold border border-white/10">
            <BookOpen className="w-3.5 h-3.5" />
            <span>DIVIDEND INTEL MASTER RESEARCH</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            미국 배당 ETF 20선 완전정복 백과사전
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
            단순한 수익률 요약을 넘어, 초보자도 1초 만에 이해하는 <strong className="text-white">실생활 비유</strong>부터 지수 스크리닝 알고리즘, 숨겨진 리스크, 맞춤형 포트폴리오 비중까지 입체적으로 파헤친 <strong>국내 최고 수준의 배당 ETF 완벽 해설서</strong>입니다.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-income-light" />
              20개 대표 종목 수록
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              5대 심층 분석 섹션 완비
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              6대 계산기 즉시 연동
            </span>
          </div>
        </div>

        {/* 2. 상단 인터랙티브 검색 및 카테고리 필터 바 */}
        <div className="bg-white rounded-2xl border border-subtle-border p-4 sm:p-5 shadow-card space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* 검색 인풋 */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="티커(SCHD, JEPI...), 한글명(슈왑, 리얼티인컴...), 또는 키워드 검색"
                className="w-full pl-10 pr-4 py-2.5 bg-brand-bg rounded-xl border border-subtle-border text-sm font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-muted hover:text-brand-primary"
                >
                  지우기
                </button>
              )}
            </div>

            {/* 전체 펼치기 / 접기 버튼 */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0 text-xs">
              <button
                type="button"
                onClick={expandAll}
                className="px-3 py-2 rounded-xl bg-brand-bg hover:bg-brand-secondary border border-subtle-border text-brand-primary font-bold transition-all"
              >
                전체 상세 펼치기
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-3 py-2 rounded-xl bg-brand-bg hover:bg-brand-secondary border border-subtle-border text-brand-muted hover:text-brand-primary font-bold transition-all"
              >
                전체 접기
              </button>
            </div>
          </div>

          {/* 카테고리 필터 탭 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-subtle-border/60">
            <span className="text-xs font-bold text-brand-muted shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> 분류:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                    : 'bg-brand-bg text-brand-muted hover:text-brand-primary border-subtle-border hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 결과 카운트 안내 */}
        <div className="flex items-center justify-between text-xs text-brand-muted px-1">
          <span>
            총 <strong className="text-brand-primary font-bold">{filteredList.length}개</strong>의 ETF 백과사전 분석 리포트가 준비되어 있습니다.
          </span>
          {searchQuery && (
            <span>
              &lsquo;{searchQuery}&rsquo; 검색 결과
            </span>
          )}
        </div>

        {/* 3. ETF 20선 상세 카드 리스트 */}
        <div className="space-y-6">
          {filteredList.map((item: ETFEncyclopediaItem) => {
            const isExpanded = !!expandedTickers[item.ticker];

            return (
              <article
                key={item.ticker}
                id={item.ticker}
                className="bg-white rounded-3xl border border-subtle-border shadow-card hover:shadow-elevated transition-all overflow-hidden scroll-mt-24"
              >
                {/* 카드 상단 헤더 (클릭 시 아코디언 토글) */}
                <div
                  onClick={() => toggleExpand(item.ticker)}
                  className="p-5 sm:p-7 bg-gradient-to-r from-white via-brand-bg/30 to-brand-bg/60 border-b border-subtle-border cursor-pointer select-none transition-colors hover:bg-brand-secondary/40"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* 좌측: 티커, 한글명, 카테고리, 태그 */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight font-mono">
                          {item.ticker}
                        </span>
                        <h2 className="text-base sm:text-lg font-extrabold text-brand-primary">
                          {item.nameKo}
                        </h2>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-brand-secondary text-brand-primary border border-subtle-border">
                          {item.category}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            item.payoutCycle === '월배당'
                              ? 'bg-income-light text-income'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {item.payoutCycle}
                        </span>
                      </div>

                      {/* 실생활 비유 헤드라인 (요약 노출) */}
                      <p className="text-xs sm:text-sm font-bold text-income flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 shrink-0" />
                        <span>{item.analogy.headline}</span>
                      </p>

                      {/* 태그 목록 */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-subtle-border text-brand-muted font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 우측: 핵심 수치 배지 4종 + 펼치기 버튼 */}
                    <div className="flex items-center gap-3 sm:gap-5 self-end md:self-auto shrink-0">
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-right">
                        <div>
                          <span className="text-[10px] text-brand-muted block font-mono">
                            시가배당률
                          </span>
                          <span className="text-sm sm:text-base font-black text-income font-mono">
                            {formatPercent(item.dividendYield, 2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-brand-muted block font-mono">
                            5년 배당성장
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-brand-primary font-mono">
                            +{formatPercent(item.fiveYearGrowth, 1)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-brand-muted block font-mono">
                            운용보수
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-brand-muted font-mono">
                            {item.expenseRatio}%
                          </span>
                        </div>
                      </div>

                      {/* 아코디언 토글 아이콘 버튼 */}
                      <div className="w-8 h-8 rounded-full bg-brand-bg border border-subtle-border flex items-center justify-center text-brand-muted hover:text-brand-primary">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 카드 본문: 5대 상세 본문 섹션 (아코디언 토글 대상) */}
                {isExpanded && (
                  <div className="p-5 sm:p-8 space-y-6 animate-fadeIn text-xs sm:text-sm leading-relaxed">
                    {/* 섹션 1: 💡 개요 및 쉬운 실생활 비유 */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                      <h3 className="font-extrabold text-brand-primary flex items-center gap-2 text-sm sm:text-base">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>1. 개요 및 쉬운 실생활 비유</span>
                      </h3>
                      <div className="space-y-1.5 text-brand-muted">
                        <p className="font-semibold text-brand-primary">
                          &ldquo;{item.analogy.metaphor}&rdquo;
                        </p>
                        <p>{item.analogy.simpleDescription}</p>
                      </div>
                    </div>

                    {/* 섹션 2: ⚙️ 운용 메커니즘 및 편입 기준 */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-brand-bg border border-subtle-border space-y-3">
                      <h3 className="font-extrabold text-brand-primary flex items-center gap-2 text-sm sm:text-base">
                        <Cog className="w-4 h-4 text-brand-muted shrink-0" />
                        <span>2. 포트폴리오 선별 기준 및 운용 메커니즘</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-subtle-border/80 space-y-1">
                          <span className="text-[11px] font-bold text-brand-primary block">
                            추종 기초지수
                          </span>
                          <p className="font-mono text-brand-muted">{item.mechanism.benchmarkIndex}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-subtle-border/80 space-y-1">
                          <span className="text-[11px] font-bold text-brand-primary block">
                            리밸런싱 주기 및 가중 방식
                          </span>
                          <p className="text-brand-muted">
                            {item.mechanism.rebalancingFrequency} ({item.mechanism.weightingCap})
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-subtle-border/80 space-y-1 text-xs">
                        <span className="text-[11px] font-bold text-income block">
                          핵심 스크리닝 필터링 요건
                        </span>
                        <p className="text-brand-primary">{item.mechanism.screeningRules}</p>
                        <p className="text-brand-muted mt-1">{item.mechanism.coreDetail}</p>
                      </div>
                    </div>

                    {/* 2열 배치: 🛡️ 핵심 장점 vs ⚠️ 한계점 및 리스크 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 섹션 3: 🛡️ 핵심 장점과 하방 방어력 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-income-light/30 border border-income/30 space-y-3">
                        <h3 className="font-extrabold text-brand-primary flex items-center gap-2 text-sm">
                          <ShieldCheck className="w-4 h-4 text-income shrink-0" />
                          <span>3. 핵심 장점과 하방 방어력</span>
                        </h3>
                        <p className="text-xs font-bold text-income">
                          {item.strengths.keyTheme}
                        </p>
                        <ul className="space-y-1.5 list-disc list-inside text-xs text-brand-muted pl-1">
                          {item.strengths.points.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>

                      {/* 섹션 4: ⚠️ 반드시 알아야 할 한계점 및 리스크 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-red-50/50 border border-red-200/60 space-y-3">
                        <h3 className="font-extrabold text-brand-primary flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                          <span>4. 반드시 알아야 할 한계점 및 리스크</span>
                        </h3>
                        <p className="text-xs font-bold text-red-700">
                          {item.risks.warningTitle}
                        </p>
                        <ul className="space-y-1.5 list-disc list-inside text-xs text-brand-muted pl-1">
                          {item.risks.points.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 섹션 5: 🎯 실전 투자 팁 및 이상적인 투자자 */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-brand-primary/20 space-y-3">
                      <h3 className="font-extrabold text-brand-primary flex items-center gap-2 text-sm sm:text-base">
                        <Target className="w-4 h-4 text-income shrink-0" />
                        <span>5. 실전 투자 팁 및 추천 포트폴리오 가이드</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-3 bg-brand-bg rounded-xl border border-subtle-border space-y-0.5">
                          <span className="text-[10px] text-brand-muted block">추천 투자자 성향</span>
                          <span className="font-bold text-brand-primary block">{item.strategy.idealInvestor}</span>
                        </div>
                        <div className="p-3 bg-brand-bg rounded-xl border border-subtle-border space-y-0.5">
                          <span className="text-[10px] text-brand-muted block">포트폴리오 내 역할</span>
                          <span className="font-bold text-income block">{item.strategy.portfolioRole}</span>
                        </div>
                        <div className="p-3 bg-brand-bg rounded-xl border border-subtle-border space-y-0.5">
                          <span className="text-[10px] text-brand-muted block">권장 편입 비중</span>
                          <span className="font-bold text-brand-primary block">{item.strategy.recommendedWeight}</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-income-light/40 border border-income/30 text-xs text-brand-primary font-medium">
                        <strong>💡 실전 운용 꿀팁:</strong> {item.strategy.actionableTip}
                      </div>
                    </div>

                    {/* 하단 인터랙티브 계산기 퀵 링크 바 */}
                    <div className="pt-3 border-t border-subtle-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-brand-muted font-medium">
                        이 종목을 플랫폼 6대 계산기에서 바로 테스트해 보세요:
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/?tab=compare&ticker1=${item.ticker}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-subtle-border font-bold text-brand-primary hover:bg-brand-secondary hover:border-income transition-all shadow-2xs"
                        >
                          <Scale className="w-3.5 h-3.5 text-income" />
                          <span>1:1 맞짱 비교</span>
                        </Link>
                        <Link
                          href={`/?tab=timemachine&ticker=${item.ticker}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-subtle-border font-bold text-brand-primary hover:bg-brand-secondary hover:border-income transition-all shadow-2xs"
                        >
                          <History className="w-3.5 h-3.5 text-income" />
                          <span>타임머신 백테스트</span>
                        </Link>
                        <Link
                          href={`/?tab=drip&ticker=${item.ticker}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-income text-white font-bold hover:bg-income-dark transition-all shadow-2xs"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>DRIP 복리 시뮬레이션</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* 4. 하단 안내 및 랭킹 센터 링크 배너 */}
        <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border border-amber-200/80 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
              <span>🔥 국내 상장 한국판 대체 종목(TIGER, ACE, SOL)도 궁금하신가요?</span>
            </h4>
            <p className="text-amber-900/80 leading-relaxed">
              ISA·연금저축 계좌에서 세금을 아낄 수 있는 한국판 대체 종목과 실질 총비용(TER) 순위를 &lsquo;서학 vs 동학 랭킹 센터&rsquo;에서 한눈에 비교해 보세요.
            </p>
          </div>
          <Link
            href="/rankings"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold transition-all shadow-2xs shrink-0 self-start sm:self-auto text-center"
          >
            서학 vs 동학 랭킹 보러가기 ↗
          </Link>
        </div>
      </main>

      {/* 글로벌 푸터 */}
      <Footer />
    </div>
  );
}
