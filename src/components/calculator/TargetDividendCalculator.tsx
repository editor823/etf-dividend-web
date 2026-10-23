'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  Coins,
  Search,
  X,
  AlertTriangle,
  Check,
  ShieldCheck,
} from 'lucide-react';
import {
  calculateTargetDividend,
  POPULAR_ETFS,
  US_DIVIDEND_TAX_RATE,
} from '@/lib/calculator/target-dividend';
import { ETF_LIST, ETF_MAP, ETFCategory } from '@/data/etfList';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import TargetDividendGuide from './guides/TargetDividendGuide';

export default function TargetDividendCalculator() {
  // 상태 관리
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [targetAmount, setTargetAmount] = useState<number>(1000000); // 기본 100만 원
  const [selectedTicker, setSelectedTicker] = useState<string>('SCHD');
  const [monthlySharesToAdd, setMonthlySharesToAdd] = useState<number>(10); // 매월 10주 적립
  const [exchangeRate, setExchangeRate] = useState<number>(1350); // 기본 환율

  // 1) 카테고리 필터 및 검색창 상태
  const [selectedCategory, setSelectedCategory] = useState<ETFCategory>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: ETFCategory[] = [
    '전체',
    '배당성장',
    '월배당·커버드콜',
    '시장지수',
    '리츠·채권',
  ];

  // 퀵 금액 선택 버튼 목록
  const quickAmountsKRW = [
    { label: '50만 원', value: 500000 },
    { label: '100만 원', value: 1000000 },
    { label: '200만 원', value: 2000000 },
    { label: '300만 원', value: 3000000 },
  ];

  const quickAmountsUSD = [
    { label: '$500', value: 500 },
    { label: '$1,000', value: 1000 },
    { label: '$2,000', value: 2000 },
    { label: '$3,000', value: 3000 },
  ];

  // 통화 전환 핸들러
  const handleCurrencyChange = (newCurrency: 'KRW' | 'USD') => {
    if (newCurrency === currency) return;
    if (newCurrency === 'USD') {
      const usdVal = Math.round(targetAmount / exchangeRate);
      setTargetAmount(usdVal > 0 ? usdVal : 1000);
    } else {
      const krwVal = Math.round(targetAmount * exchangeRate);
      setTargetAmount(krwVal > 0 ? krwVal : 1000000);
    }
    setCurrency(newCurrency);
  };

  // 연산 수행 (메모이제이션)
  const result = useMemo(() => {
    return calculateTargetDividend({
      targetMonthlyAmount: targetAmount,
      currency,
      ticker: selectedTicker,
      monthlySharesToAdd,
      exchangeRate,
    });
  }, [targetAmount, currency, selectedTicker, monthlySharesToAdd, exchangeRate]);

  // 현재 활성화된 ETF 정보
  const activeEtf =
    ETF_MAP[selectedTicker] || POPULAR_ETFS[selectedTicker] || ETF_LIST[0];

  // 연간 세전 배당금 (원화 환산)
  const annualGrossDividendKRW =
    result.annualGrossDividendUSD * result.exchangeRate;
  // 금융소득 종합과세 기준: 연 2,000만 원 초과 여부
  const isComprehensiveTaxExceeded = annualGrossDividendKRW > 20000000;

  // 3) 검색 및 카테고리에 맞게 실시간 필터링된 20개 종목 목록
  const filteredEtfs = useMemo(() => {
    return ETF_LIST.filter((etf) => {
      const matchCategory =
        selectedCategory === '전체' ||
        etf.category === selectedCategory ||
        (selectedCategory === '배당성장' && etf.category === '고배당/배당귀족');
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        etf.ticker.toLowerCase().includes(q) ||
        etf.name.toLowerCase().includes(q) ||
        etf.nameEn.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 통화 토글 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5 text-income" />
            <span>기능 1: 세후 현금흐름 정밀 역산</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            월 목표 배당 역산 계산기
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            미국 배당소득세(15% 원천징수)를 제외한 순수{' '}
            <strong className="text-brand-primary">세후 실수령액</strong> 기준
            필요 주식 수와 자본금을 산출합니다.
          </p>
        </div>

        {/* 통화(₩ / $) 선택 버튼 */}
        <div className="inline-flex p-1 bg-brand-bg rounded-xl border border-subtle-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleCurrencyChange('KRW')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              currency === 'KRW'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            원화 (KRW ₩)
          </button>
          <button
            type="button"
            onClick={() => handleCurrencyChange('USD')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              currency === 'USD'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            달러 (USD $)
          </button>
        </div>
      </div>

      {/* 2. 입력 영역: 목표 금액, ETF 종목 전면 개편 영역, 부가 변수 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 좌측: 금액 입력 및 퀵 버튼 + ETF 종목 선택 (20개 종목 카테고리 & 검색) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 금액 입력 영역 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-brand-primary flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-income" />
                희망하는 매월 세후 실수령 배당금
              </label>
              <span className="text-xs text-brand-muted font-mono">
                현재 목표:{' '}
                {currency === 'KRW'
                  ? formatCurrency(targetAmount, 'KRW')
                  : formatCurrency(targetAmount, 'USD')}
              </span>
            </div>

            {/* 메인 숫자 입력창 */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-muted font-bold text-lg">
                {currency === 'KRW' ? '₩' : '$'}
              </div>
              <input
                type="number"
                min={currency === 'KRW' ? 10000 : 10}
                step={currency === 'KRW' ? 100000 : 50}
                value={targetAmount}
                onChange={(e) =>
                  setTargetAmount(Math.max(0, Number(e.target.value)))
                }
                className="w-full pl-11 pr-4 py-3.5 bg-brand-bg rounded-2xl border border-subtle-border focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income num-font text-2xl font-bold text-brand-primary transition-all"
                placeholder="0"
              />
            </div>

            {/* 퀵 선택 버튼 목록 */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="text-xs font-semibold text-brand-muted mr-1">
                빠른 금액:
              </span>
              {(currency === 'KRW' ? quickAmountsKRW : quickAmountsUSD).map(
                (item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setTargetAmount(item.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      targetAmount === item.value
                        ? 'bg-income-light text-income border-income'
                        : 'bg-brand-bg text-brand-primary border-subtle-border hover:bg-brand-secondary'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* ★ 작업 2 핵심: 20개 종목 선택 영역 전면 개편 ★ */}
          <div className="space-y-3 pt-3 border-t border-subtle-border">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-brand-primary flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-income" />
                <span>투자 대상 ETF 선택 (20개 대표 종목)</span>
              </label>
              <span className="text-xs text-brand-muted font-mono">
                {filteredEtfs.length}개 종목 표시 중
              </span>
            </div>

            {/* 1) 상단 [전체 / 배당성장 / 월배당·커버드콜 / 시장지수 / 리츠·채권] 카테고리 필터 탭 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-brand-primary text-white shadow-xs'
                        : 'bg-brand-bg text-brand-primary/80 hover:bg-brand-secondary border border-subtle-border'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* 2) 티커/종목명 실시간 검색창 (Input) */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="티커(SCHD, JEPI, QQQI, VOO, SGOV...) 또는 종목명을 검색하세요"
                className="w-full pl-9 pr-8 py-2.5 bg-brand-bg rounded-xl border border-subtle-border text-xs sm:text-sm font-medium text-brand-primary focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-brand-muted hover:text-brand-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 3) 검색 및 카테고리에 맞게 필터링된 종목 카드 스크롤 그리드 & 클릭 시 즉시 역산기 대상 종목 교체 */}
            <div className="max-h-72 overflow-y-auto pr-1 space-y-2 overscroll-contain rounded-2xl border border-subtle-border p-2 bg-brand-bg/40">
              {filteredEtfs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredEtfs.map((item) => {
                    const isSelected = selectedTicker === item.ticker;
                    return (
                      <div
                        key={item.ticker}
                        onClick={() => setSelectedTicker(item.ticker)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between text-left ${
                          isSelected
                            ? 'bg-white border-2 border-income shadow-md ring-2 ring-income/20'
                            : 'bg-white border-subtle-border hover:border-income/40 hover:bg-brand-bg'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-sm text-brand-primary tracking-tight">
                              {item.ticker}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-brand-secondary text-brand-primary">
                              {item.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                item.payoutCycle === '월배당'
                                  ? 'bg-income-light text-income'
                                  : 'bg-brand-secondary text-brand-primary'
                              }`}
                            >
                              {item.payoutCycle}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-income stroke-[3]" />
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] font-medium text-brand-primary/90 line-clamp-1 mb-2">
                          {item.name}
                        </p>

                        <div className="flex items-center justify-between pt-1.5 border-t border-subtle-border/60 text-[11px]">
                          <span className="num-font text-brand-muted">
                            ${item.currentPriceUSD.toFixed(2)}
                          </span>
                          <span className="num-font font-black text-income">
                            연 {(item.dividendYield * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-brand-muted">
                  검색어 &quot;{searchQuery}&quot;에 일치하는 종목이 없습니다.
                </div>
              )}
            </div>

            {/* 현재 선택된 종목 하이라이트 요약 바 */}
            <div className="p-3 rounded-xl bg-income-light/30 border border-income/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-brand-primary">
                  선택됨: {activeEtf.ticker}
                </span>
                <span className="text-brand-muted hidden sm:inline">
                  - {activeEtf.name}
                </span>
              </div>
              <div className="flex items-center gap-3 num-font font-bold">
                <span className="text-brand-muted">
                  ${activeEtf.currentPriceUSD || activeEtf.currentPrice}
                </span>
                <span className="text-income font-black">
                  배당률 {formatPercent(activeEtf.dividendYield)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 추가 시뮬레이션 파라미터 (적립 주식수, 환율) */}
        <div className="lg:col-span-5 bg-brand-bg rounded-2xl p-6 border border-subtle-border flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-sm font-bold text-brand-primary flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-income" />
              적립 계획 &amp; 환율 설정
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              목표 배당 도달까지 매달 추가 매수할 수 있는 주식 수와 기준 환율을
              지정합니다.
            </p>
          </div>

          <div className="space-y-4">
            {/* 매월 추가 적립 주식 수 */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-brand-primary">
                  매월 정기 매수 주식 수
                </span>
                <span className="text-xs font-bold text-income num-font">
                  +{monthlySharesToAdd}주 / 월
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={monthlySharesToAdd}
                onChange={(e) => setMonthlySharesToAdd(Number(e.target.value))}
                className="w-full h-2 bg-brand-secondary rounded-lg appearance-none cursor-pointer accent-income"
              />
              <div className="flex justify-between text-[10px] text-brand-muted mt-1 font-mono">
                <span>0주 (일시금)</span>
                <span>25주</span>
                <span>50주</span>
                <span>100주</span>
              </div>
            </div>

            {/* 원/달러 기준 환율 */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-brand-primary">
                  적용 환율 (USD/KRW)
                </span>
                <span className="text-xs font-mono text-brand-muted font-semibold">
                  1 USD = ₩{formatNumber(exchangeRate)}
                </span>
              </div>
              <input
                type="number"
                min="1000"
                max="2000"
                step="5"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-subtle-border text-sm font-mono text-brand-primary focus:outline-none focus:ring-2 focus:ring-income/30"
              />
            </div>
          </div>

          {/* 선택된 ETF 상세 스펙 요약 뱃지 박스 */}
          <div className="bg-white rounded-xl p-4 border border-subtle-border text-xs text-brand-muted space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-brand-primary">
                {activeEtf.name}
              </span>
              <span className="text-income font-bold num-font">
                {formatPercent(activeEtf.dividendYield)}
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>
                지급 주기: {activeEtf.payoutCycle || activeEtf.frequencyLabel}
              </span>
              <span className="num-font">
                $
                {(
                  activeEtf.currentPriceUSD || activeEtf.currentPrice
                )?.toFixed(2)}
              </span>
            </div>
            {activeEtf.summary && (
              <p className="text-[11px] text-brand-muted line-clamp-2 pt-1 border-t border-subtle-border/60">
                {activeEtf.summary}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. 중앙 하이라이트 결과 카드 (필요 주식 수 & 필요 총 자본금) */}
      <div className="bg-gradient-to-br from-brand-primary to-brand-dark rounded-3xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-income/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* 필요 총 주식 수 */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-income-light text-xs font-semibold backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-income-light" />
              목표 달성에 필요한 총 주식 수
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight num-font text-white">
                {formatNumber(result.requiredShares)}
              </span>
              <span className="text-2xl font-bold text-white/70">주</span>
            </div>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              1주당 연간 세후 배당금:{' '}
              <span className="num-font text-white font-bold">
                ${result.netDividendPerShareAnnualUSD.toFixed(2)}
              </span>{' '}
              (미국 원천징수세 {formatPercent(US_DIVIDEND_TAX_RATE, 0)} 차감 후)
            </p>
          </div>

          {/* 현재가 기준 필요 총 원금 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
            <span className="text-xs uppercase font-mono tracking-wider text-white/70">
              현재가 기준 필요 투자 원금
            </span>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold num-font text-white">
                {formatCurrency(result.totalCapitalKRW, 'KRW')}
              </div>
              <div className="text-sm font-semibold num-font text-white/80">
                약 {formatCurrency(result.totalCapitalUSD, 'USD')}
              </div>
            </div>
            <div className="text-[11px] text-white/60 pt-2 border-t border-white/10 flex items-center justify-between">
              <span>적용 주가: ${result.etf.currentPrice.toFixed(2)}</span>
              <span>환율: ₩{formatNumber(result.exchangeRate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4) 연간 세전 배당금 2,000만 원 초과 시 경고 뱃지 */}
      {isComprehensiveTaxExceeded ? (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-5 flex items-start gap-3.5 text-amber-900 shadow-xs animate-in fade-in duration-300">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="font-extrabold text-sm sm:text-base flex items-center gap-2 text-amber-950">
              <span>
                ⚠️ 연간 배당 2,000만 원 초과로 금융소득종합과세 대상이 될 수 있습니다
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              현재 목표 달성 시 산출되는{' '}
              <strong>
                연간 세전 배당금은 약{' '}
                {formatCurrency(annualGrossDividendKRW, 'KRW')}
              </strong>
              (세전 ${formatNumber(result.annualGrossDividendUSD)})으로 기준치인
              2,000만 원을 초과합니다. 초과분은 다른 종합소득과 합산 과세되며,
              직장가입자의 건강보험 피부양자 자격 박탈 또는 지역가입자 건보료
              인상 대상이 될 수 있습니다.
            </p>
            <div className="pt-2 text-xs text-amber-950 font-semibold flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-200/60">
                💡 절세 팁 1: 국내상장 해외 ETF ISA 계좌 활용
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-200/60">
                💡 절세 팁 2: 연금저축 &amp; IRP로 과세이연
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-200/60">
                💡 절세 팁 3: 배우자 증여를 통한 분산 투자
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-income-light/30 border border-income/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-income">
          <ShieldCheck className="w-4 h-4 text-income flex-shrink-0" />
          <span>
            연간 세전 배당금 약{' '}
            <strong>{formatCurrency(annualGrossDividendKRW, 'KRW')}</strong>:
            연 2,000만 원 이하 구간으로, 금융소득종합과세 걱정 없이{' '}
            <strong>15.4% 분리과세(미국 원천징수 15%)</strong>로 종결되는 안전
            구간입니다.
          </span>
        </div>
      )}

      {/* 5. 세부 현금흐름 요약 4단 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          <span className="text-xs text-brand-muted block mb-1">
            월 세후 실수령액
          </span>
          <p className="text-lg sm:text-xl font-bold text-income num-font">
            {formatCurrency(result.monthlyNetDividendKRW, 'KRW')}
          </p>
          <span className="text-xs text-brand-muted num-font">
            {formatCurrency(result.monthlyNetDividendUSD, 'USD')} / 월
          </span>
        </div>

        <div className="bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          <span className="text-xs text-brand-muted block mb-1">
            연간 세전 배당금
          </span>
          <p className="text-lg sm:text-xl font-bold text-brand-primary num-font">
            {formatCurrency(result.annualGrossDividendUSD, 'USD')}
          </p>
          <span className="text-xs text-brand-muted num-font">
            약 {formatCurrency(annualGrossDividendKRW, 'KRW')}
          </span>
        </div>

        <div className="bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          <span className="text-xs text-alert block mb-1">
            미국 배당세 (15%)
          </span>
          <p className="text-lg sm:text-xl font-bold text-alert num-font">
            -{formatCurrency(result.annualTaxUSD, 'USD')}
          </p>
          <span className="text-xs text-alert/80 num-font">
            약 -{formatCurrency(result.annualTaxUSD * result.exchangeRate, 'KRW')}
          </span>
        </div>

        <div className="bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          <span className="text-xs text-brand-muted block mb-1">
            연간 세후 실수령액
          </span>
          <p className="text-lg sm:text-xl font-bold text-brand-primary num-font">
            {formatCurrency(result.annualNetDividendUSD, 'USD')}
          </p>
          <span className="text-xs text-income num-font font-bold">
            실수령율 85.0%
          </span>
        </div>
      </div>

      {/* 6. D-Day & 4단계 마일스톤 로드맵 */}
      <div className="pt-6 border-t border-subtle-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-brand-primary flex items-center gap-2">
              <Calendar className="w-5 h-5 text-income" />
              목표 달성 로드맵 &amp; 4단계 마일스톤
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              매월 {result.monthlySharesToAdd}주씩 꾸준히 적립 매수할 때의
              단계별 성취 지점입니다.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-secondary text-brand-primary text-xs font-bold self-start sm:self-auto">
            <Clock className="w-4 h-4 text-income" />
            <span>
              예상 소요 기간:{' '}
              <strong className="text-income text-sm">
                {result.yearsAndMonths}
              </strong>
            </span>
            <span className="text-brand-muted">
              ({result.targetDDayDate} 도달 예정)
            </span>
          </div>
        </div>

        {/* 4단계 마일스톤 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {result.milestones.map((step) => {
            const isFinished = step.percent === 100;
            return (
              <div
                key={step.percent}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isFinished
                    ? 'border-income bg-income-light/40 shadow-xs'
                    : 'border-subtle-border bg-brand-bg/60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        isFinished
                          ? 'bg-income text-white'
                          : 'bg-brand-secondary text-brand-primary'
                      }`}
                    >
                      {step.percent}% 달성
                    </span>
                    <span className="text-xs text-brand-muted font-medium">
                      {step.targetDate}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-brand-primary mb-2">
                    {step.label}
                  </h4>

                  <div className="space-y-1.5 text-xs text-brand-muted">
                    <div className="flex justify-between">
                      <span>누적 주식 수</span>
                      <strong className="num-font text-brand-primary">
                        {formatNumber(step.shares)}주
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>누적 투자금</span>
                      <strong className="num-font text-brand-primary">
                        {formatCurrency(step.totalCapitalKRW, 'KRW')}
                      </strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-subtle-border/60">
                      <span className="text-income font-medium">월 배당 수령</span>
                      <strong className="num-font text-income font-bold">
                        {formatCurrency(step.monthlyNetDividendKRW, 'KRW')}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-subtle-border/60 text-[11px] text-brand-muted flex items-center justify-between">
                  <span>소요 기간</span>
                  <span className="num-font font-semibold text-brand-primary">
                    {step.monthsToReach}개월
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 세금 및 유의사항 안내 팁 박스 */}
        <div className="p-4 rounded-2xl bg-brand-bg border border-subtle-border flex items-start gap-3 text-xs text-brand-muted">
          <Info className="w-4 h-4 text-income mt-0.5 flex-shrink-0" />
          <div className="leading-relaxed">
            <span className="font-semibold text-brand-primary">
              투자 안내 및 계산 기준:{' '}
            </span>
            본 시뮬레이션은 미국 현지 원천징수 배당소득세 15%를 필수로 적용한
            세후 기준입니다. 국내 금융소득종합과세(연간 금융소득 2,000만 원 초과
            시)나 환율 변동, 주가 및 배당금 변동에 따라 실제 수령액은 차이가
            있을 수 있습니다.
          </div>
        </div>

        {/* E-E-A-T 정적 해설 가이드 섹션 */}
        <TargetDividendGuide />
      </div>
    </div>
  );
}
