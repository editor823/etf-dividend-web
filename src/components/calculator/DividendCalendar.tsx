'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Layers,
  Gift,
  Coins,
  Wallet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  calculateDividendCalendar,
  CALENDAR_PRESETS,
  TICKER_SCHEDULES,
  CalendarPreset,
  allocateBudgetToPortfolio,
  calculatePortfolioTotalCapital,
} from '@/lib/calculator/dividend-calendar';
import { ETF_DATABASE } from '@/lib/data/etf-database';
import { formatCurrency, formatNumber } from '@/lib/utils';
import DividendCalendarGuide from './guides/DividendCalendarGuide';

export default function DividendCalendar() {
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('monthly_salary');
  const [inputMode, setInputMode] = useState<'budget' | 'shares'>('budget');

  // 총 투자 예정 금액 (기본값: 원화 5,000만 원 / 달러 환산 약 $37,037)
  const [totalBudgetKRW, setTotalBudgetKRW] = useState<number>(50000000);
  const [totalBudgetUSD, setTotalBudgetUSD] = useState<number>(37000);

  const exchangeRate = 1350;

  // 포트폴리오 기본 상태 (초기 5,000만 원 기준 황금 월급형 자동 할당)
  const [portfolio, setPortfolio] = useState<Record<string, number>>(() => {
    const preset = CALENDAR_PRESETS[0]; // 황금 월급형
    const initialUSD = 50000000 / 1350;
    return allocateBudgetToPortfolio(initialUSD, preset.weights);
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 총 투자 예산 변경 핸들러
  const handleBudgetChange = (amount: number, curr: 'KRW' | 'USD') => {
    let budgetInUSD = 0;
    if (curr === 'KRW') {
      const safeAmount = Math.max(0, amount);
      setTotalBudgetKRW(safeAmount);
      budgetInUSD = safeAmount / exchangeRate;
      setTotalBudgetUSD(Math.round(budgetInUSD));
    } else {
      const safeAmount = Math.max(0, amount);
      setTotalBudgetUSD(safeAmount);
      budgetInUSD = safeAmount;
      setTotalBudgetKRW(Math.round(safeAmount * exchangeRate));
    }

    // 현재 활성화된 프리셋 비율에 맞춰 각 종목 주수 자동 재배분
    const activePreset =
      CALENDAR_PRESETS.find((p) => p.id === selectedPreset) ||
      CALENDAR_PRESETS[0];
    const newPortfolio = allocateBudgetToPortfolio(
      budgetInUSD,
      activePreset.weights
    );
    setPortfolio(newPortfolio);
  };

  // 퀵 예산 증액/설정 버튼 핸들러
  const setQuickBudget = (amountKRW: number) => {
    handleBudgetChange(amountKRW, 'KRW');
  };

  // 프리셋 적용 핸들러
  const applyPreset = (preset: CalendarPreset) => {
    setSelectedPreset(preset.id);
    const budgetUSD =
      currency === 'KRW' ? totalBudgetKRW / exchangeRate : totalBudgetUSD;
    const newPortfolio = allocateBudgetToPortfolio(budgetUSD, preset.weights);
    setPortfolio(newPortfolio);
  };

  // 종목별 주식 수 직접 변경 핸들러
  const handleSharesChange = (ticker: string, shares: number) => {
    const validShares = Math.max(0, Math.floor(shares));
    const nextPortfolio = {
      ...portfolio,
      [ticker]: validShares,
    };
    setPortfolio(nextPortfolio);
    setSelectedPreset('custom');

    // 변경된 주수에 맞춰 총 투자 예산도 실시간 동기화
    const capital = calculatePortfolioTotalCapital(nextPortfolio, exchangeRate);
    setTotalBudgetKRW(capital.totalKRW);
    setTotalBudgetUSD(capital.totalUSD);
  };

  // 종목별 투자 금액 직접 변경 핸들러
  const handleTickerAmountChange = (
    ticker: string,
    amount: number,
    curr: 'KRW' | 'USD'
  ) => {
    const etf = ETF_DATABASE[ticker];
    if (!etf || etf.currentPrice <= 0) return;

    let targetShares = 0;
    if (curr === 'KRW') {
      const sharePriceKRW = etf.currentPrice * exchangeRate;
      targetShares = Math.floor(amount / sharePriceKRW);
    } else {
      targetShares = Math.floor(amount / etf.currentPrice);
    }

    handleSharesChange(ticker, targetShares);
  };

  // 캘린더 연산 수행
  const result = useMemo(() => {
    return calculateDividendCalendar(portfolio, exchangeRate);
  }, [portfolio, exchangeRate]);

  // 포트폴리오의 실질 총 투자 원금 계산
  const totalCapital = useMemo(() => {
    return calculatePortfolioTotalCapital(portfolio, exchangeRate);
  }, [portfolio, exchangeRate]);

  // 실질 연간 세후 배당수익률 (%)
  const effectiveYieldPercent = useMemo(() => {
    if (totalCapital.totalUSD <= 0) return '0.00';
    return ((result.totalAnnualNetUSD / totalCapital.totalUSD) * 100).toFixed(2);
  }, [result.totalAnnualNetUSD, totalCapital.totalUSD]);

  // 차트용 데이터 가공
  const chartData = useMemo(() => {
    return result.monthlyCashFlows.map((flow) => ({
      monthLabel: flow.monthLabel,
      amountUSD: flow.netTotalUSD,
      amountKRW: flow.netTotalKRW,
      hasBonus: flow.hasBonusIncome,
      isEmpty: flow.isEmpty,
    }));
  }, [result]);

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 통화 토글 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-income" />
            <span>기능 6: 연간 현금흐름 타임라인</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            월별 배당 캘린더 &amp; 현금흐름 대시보드
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            내 투자 금액(원금)이나 보유 종목을 넣으면, 1월부터 12월까지 매월 통장에 꽂히는 실제 세후 실수령액을 1초 만에 뽑아드립니다.
          </p>
        </div>

        {/* 통화 선택 */}
        <div className="inline-flex p-1 bg-brand-bg rounded-xl border border-subtle-border self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setCurrency('KRW')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currency === 'KRW'
                ? 'bg-brand-primary text-white shadow-xs'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            원화 (₩)
          </button>
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currency === 'USD'
                ? 'bg-brand-primary text-white shadow-xs'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            달러 ($)
          </button>
        </div>
      </div>

      {/* 2. 핵심 개선: 총 투자 금액(돈) 직접 입력 & 프리셋 자동 배분 카드 */}
      <div className="p-6 bg-gradient-to-br from-brand-bg via-white to-amber-50/30 rounded-3xl border border-subtle-border space-y-6 shadow-xs">
        {/* 상단: 총 투자 금액 입력 바 */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-sm font-extrabold text-brand-primary flex items-center gap-2">
              <Wallet className="w-4 h-4 text-income" />
              <span>내가 투자할 총 금액 (원금 직접 입력)</span>
            </label>
            <span className="text-xs text-brand-muted font-medium">
              환율 1 USD = {formatNumber(exchangeRate)}원 기준
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-base font-bold text-income pointer-events-none">
                {currency === 'KRW' ? '₩' : '$'}
              </span>
              <input
                type="number"
                min="0"
                step={currency === 'KRW' ? '1000000' : '1000'}
                value={currency === 'KRW' ? totalBudgetKRW : totalBudgetUSD}
                onChange={(e) =>
                  handleBudgetChange(Number(e.target.value), currency)
                }
                placeholder="투자할 총 금액을 입력하세요"
                className="w-full pl-9 pr-4 py-3 bg-white rounded-2xl border-2 border-subtle-border text-lg sm:text-xl num-font font-black text-brand-primary focus:outline-none focus:border-income focus:ring-2 focus:ring-income/20 transition-all shadow-inner"
              />
            </div>

            {/* 빠른 금액 추가 버튼 (원터치) */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(currency === 'KRW'
                ? [
                    { label: '1,000만', val: 10000000 },
                    { label: '3,000만', val: 30000000 },
                    { label: '5,000만', val: 50000000 },
                    { label: '1억', val: 100000000 },
                    { label: '2억', val: 200000000 },
                  ]
                : [
                    { label: '$10K', val: 10000 },
                    { label: '$30K', val: 30000 },
                    { label: '$50K', val: 50000 },
                    { label: '$100K', val: 100000 },
                    { label: '$200K', val: 200000 },
                  ]
              ).map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() =>
                    currency === 'KRW'
                      ? setQuickBudget(btn.val)
                      : handleBudgetChange(btn.val, 'USD')
                  }
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-brand-secondary border border-subtle-border hover:border-income/40 text-brand-primary transition-all shadow-2xs hover:scale-102"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 중단: 원클릭 추천 포트폴리오 프리셋 (비율 자동 배분) */}
        <div>
          <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2.5">
            🎯 추천 포트폴리오 조합 선택 (입력한 금액이 이 비율대로 자동 배분됩니다)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {CALENDAR_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary text-white shadow-md ring-2 ring-brand-primary/20 scale-102'
                      : 'border-subtle-border bg-white text-brand-primary hover:border-brand-muted/40 hover:bg-brand-bg/80'
                  }`}
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold mb-1">
                      {preset.name}
                    </h4>
                    <p
                      className={`text-[11px] leading-relaxed line-clamp-2 ${
                        isSelected ? 'text-white/80' : 'text-brand-muted'
                      }`}
                    >
                      {preset.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 하단: 종목별 세부 수정 섹션 (금액 & 주식 수 양방향 연동) */}
        <div className="pt-4 border-t border-subtle-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-brand-primary block">
                종목별 투자 금액 및 주식 수 세부 수정
              </span>
              <span className="text-[11px] text-brand-muted">
                금액을 바꾸면 주수가 자동 계산되고, 주수를 바꾸면 금액이 실시간으로 연동됩니다.
              </span>
            </div>

            {/* 입력 모드 토글 */}
            <div className="inline-flex p-1 bg-white rounded-xl border border-subtle-border self-start sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => setInputMode('budget')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  inputMode === 'budget'
                    ? 'bg-income text-white shadow-2xs'
                    : 'text-brand-muted hover:text-brand-primary'
                }`}
              >
                💰 금액 우선 보기
              </button>
              <button
                type="button"
                onClick={() => setInputMode('shares')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  inputMode === 'shares'
                    ? 'bg-income text-white shadow-2xs'
                    : 'text-brand-muted hover:text-brand-primary'
                }`}
              >
                🔢 주식 수 우선 보기
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.keys(TICKER_SCHEDULES).map((ticker) => {
              const count = portfolio[ticker] || 0;
              const schedule = TICKER_SCHEDULES[ticker];
              const etf = ETF_DATABASE[ticker];
              const priceUSD = etf?.currentPrice || 0;
              const priceKRW = priceUSD * exchangeRate;
              const tickerTotalUSD = count * priceUSD;
              const tickerTotalKRW = count * priceKRW;

              return (
                <div
                  key={ticker}
                  className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                    count > 0
                      ? 'bg-white border-income/40 shadow-xs ring-1 ring-income/10'
                      : 'bg-white/60 border-subtle-border/80 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-black text-sm text-brand-primary block">
                        {ticker}
                      </span>
                      <span className="text-[10px] text-brand-muted">
                        ${priceUSD} (약 {(priceKRW / 10000).toFixed(1)}만)
                      </span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        schedule.frequency === 'monthly'
                          ? 'bg-income-light text-income'
                          : 'bg-brand-secondary text-brand-primary'
                      }`}
                    >
                      {schedule.frequency === 'monthly' ? '월배당' : '분기배당'}
                    </span>
                  </div>

                  {/* 금액 입력 칸 */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-brand-muted block">
                      투자 금액 ({currency === 'KRW' ? '원' : '달러'})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step={currency === 'KRW' ? '100000' : '100'}
                        value={
                          currency === 'KRW'
                            ? Math.round(tickerTotalKRW)
                            : Math.round(tickerTotalUSD)
                        }
                        onChange={(e) =>
                          handleTickerAmountChange(
                            ticker,
                            Number(e.target.value),
                            currency
                          )
                        }
                        className="w-full px-2.5 py-1.5 bg-brand-bg rounded-xl border border-subtle-border text-xs num-font font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
                      />
                      <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[10px] text-brand-muted pointer-events-none">
                        {currency === 'KRW' ? '원' : '$'}
                      </span>
                    </div>
                  </div>

                  {/* 주식 수 입력 칸 */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-brand-muted block">
                      보유 주수 (주)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={count}
                        onChange={(e) =>
                          handleSharesChange(ticker, Number(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 bg-brand-bg rounded-xl border border-subtle-border text-xs num-font font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
                      />
                      <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[10px] text-brand-muted pointer-events-none">
                        주
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. 중앙 연간 요약 카드 4종 (총 투자금 + 총 배당금 + 월평균 + 빈틈체크) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1) 실질 총 투자 원금 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>총 투자 원금 (세팅액)</span>
            <span className="px-2 py-0.5 rounded-full bg-brand-secondary text-brand-primary text-[10px] font-bold">
              세후 연 {effectiveYieldPercent}%
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black num-font text-brand-primary">
              {currency === 'KRW'
                ? formatCurrency(totalCapital.totalKRW, 'KRW')
                : formatCurrency(totalCapital.totalUSD, 'USD')}
            </div>
            <p className="text-xs text-brand-muted num-font mt-0.5">
              {currency === 'KRW'
                ? `약 ${formatCurrency(totalCapital.totalUSD, 'USD')}`
                : `약 ${formatCurrency(totalCapital.totalKRW, 'KRW')}`}
            </p>
          </div>
          <div className="pt-2 border-t border-subtle-border text-[11px] text-brand-muted flex items-center justify-between">
            <span>실효 배당률</span>
            <span className="font-bold text-income">
              세후 연 {effectiveYieldPercent}%
            </span>
          </div>
        </div>

        {/* 2) 연간 총 세후 배당금 */}
        <div className="bg-gradient-to-br from-brand-primary to-brand-dark text-white rounded-2xl p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>연간 총 세후 배당금</span>
            <span className="px-2 py-0.5 rounded-full bg-income text-white text-[10px] font-bold">
              순수 통장 실수령
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black num-font text-white">
              {currency === 'KRW'
                ? formatCurrency(result.totalAnnualNetKRW, 'KRW')
                : formatCurrency(result.totalAnnualNetUSD, 'USD')}
            </div>
            <p className="text-xs text-white/80 num-font mt-0.5">
              {currency === 'KRW'
                ? `약 ${formatCurrency(result.totalAnnualNetUSD, 'USD')}`
                : `약 ${formatCurrency(result.totalAnnualNetKRW, 'KRW')}`}
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 text-[11px] text-white/70 flex items-center justify-between">
            <span>미국 원천징수세(15%)</span>
            <span className="num-font font-semibold text-alert">
              -{formatCurrency(result.totalAnnualTaxUSD, 'USD')}
            </span>
          </div>
        </div>

        {/* 3) 월평균 예상 실수령액 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>월평균 예상 실수령액</span>
            <span className="px-2 py-0.5 rounded-full bg-income-light text-income text-[10px] font-bold">
              제2의 월급
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold num-font text-income">
              {currency === 'KRW'
                ? formatCurrency(result.monthlyAverageNetKRW, 'KRW')
                : formatCurrency(result.monthlyAverageNetUSD, 'USD')}
            </div>
            <p className="text-xs text-brand-muted num-font mt-0.5">
              {currency === 'KRW'
                ? `월 약 ${formatCurrency(result.monthlyAverageNetUSD, 'USD')}`
                : `월 약 ${formatCurrency(result.monthlyAverageNetKRW, 'KRW')}`}
            </p>
          </div>
          <div className="pt-2 border-t border-subtle-border text-[11px] text-brand-muted flex items-center justify-between">
            <span>12개월 분할 환산</span>
            <span className="num-font font-medium text-brand-primary">연 12회 균등</span>
          </div>
        </div>

        {/* 4) 현금흐름 빈틈 체크 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>현금흐름 빈틈 체크</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                result.emptyMonthsCount === 0
                  ? 'bg-income-light text-income'
                  : 'bg-alert-light text-alert'
              }`}
            >
              {result.emptyMonthsCount === 0
                ? '공백 없는 완벽한 월급'
                : `${result.emptyMonthsCount}개 월 배당 없음`}
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold num-font text-brand-primary">
              {12 - result.emptyMonthsCount}개월 수령
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              1년 12달 중 배당이 꽂히는 달
            </p>
          </div>
          <div className="pt-2 border-t border-subtle-border text-[11px] text-brand-muted flex items-center justify-between">
            <span>분기 보너스 포함</span>
            <span className="font-semibold text-income flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" />
              3, 6, 9, 12월 증액
            </span>
          </div>
        </div>
      </div>

      {/* 4. 1~12월 연간 배당 바 차트 (Recharts BarChart) */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
              <Coins className="w-5 h-5 text-income" />
              월별 배당 현금흐름 분포 차트
            </h3>
            <p className="text-xs text-brand-muted">
              짙은 녹색 막대는 분기 보너스(SCHD 등)가 함께 터지는 달(3, 6, 9, 12월)을 나타냅니다.
            </p>
          </div>
        </div>

        <div className="w-full h-72 sm:h-80 bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="monthLabel"
                  tickLine={false}
                  stroke="#78716c"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  stroke="#78716c"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) =>
                    currency === 'KRW'
                      ? `${(val / 10000).toFixed(0)}만`
                      : `$${val}`
                  }
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    currency === 'KRW'
                      ? formatCurrency(
                          Number(value ?? 0) * exchangeRate,
                          'KRW'
                        )
                      : formatCurrency(Number(value ?? 0), 'USD'),
                    '세후 실수령액',
                  ]}
                  labelFormatter={(label) => `${label} 현금흐름`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="amountUSD" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.hasBonus ? '#2d6a4f' : '#84a98c'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-brand-muted">
              차트 로딩 중...
            </div>
          )}
        </div>
      </div>

      {/* 5. 1~12월 상세 배당 캘린더 그리드 */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
            <Layers className="w-5 h-5 text-income" />
            1~12월 상세 배당 캘린더 그리드
          </h3>
          <span className="text-xs text-brand-muted">
            15% 원천징수 차감 세후 실수령액
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {result.monthlyCashFlows.map((flow) => {
            return (
              <div
                key={flow.month}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  flow.isEmpty
                    ? 'border-subtle-border bg-brand-bg/50 opacity-60'
                    : flow.hasBonusIncome
                    ? 'border-income bg-income-light/30 shadow-2xs'
                    : 'border-subtle-border bg-white shadow-card'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-base text-brand-primary">
                      {flow.monthLabel}
                    </span>
                    {flow.hasBonusIncome && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-income text-white">
                        <Gift className="w-3 h-3" />
                        보너스달
                      </span>
                    )}
                    {flow.isEmpty && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-brand-muted">
                        지급 없음
                      </span>
                    )}
                  </div>

                  {/* 세후 금액 합계 */}
                  <div className="mb-3">
                    <div className="text-xl font-bold num-font text-income">
                      {currency === 'KRW'
                        ? formatCurrency(flow.netTotalKRW, 'KRW')
                        : formatCurrency(flow.netTotalUSD, 'USD')}
                    </div>
                    <span className="text-[11px] text-brand-muted num-font">
                      {currency === 'KRW'
                        ? `($${flow.netTotalUSD})`
                        : `(₩${formatNumber(flow.netTotalKRW)})`}
                    </span>
                  </div>

                  {/* 지급 이벤트 종목 리스트 */}
                  <div className="space-y-1.5 pt-2 border-t border-subtle-border/60">
                    {flow.events.length > 0 ? (
                      flow.events.map((ev, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-0.5"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-bold text-brand-primary">
                              {ev.ticker}
                            </span>
                            <span className="text-[10px] text-brand-muted">
                              ({ev.shares}주)
                            </span>
                          </div>
                          <span className="num-font font-semibold text-brand-primary">
                            +${ev.netAmountUSD.toFixed(1)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-brand-muted py-1 text-center">
                        배당 지급 일정이 없습니다.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-subtle-border/60 text-[10px] text-brand-muted flex items-center justify-between">
                  <span>지급 패턴</span>
                  <span>
                    {flow.hasBonusIncome
                      ? '월초 + 분기말'
                      : flow.isEmpty
                      ? '-'
                      : '월초 고정'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* E-E-A-T 정적 해설 가이드 섹션 */}
        <DividendCalendarGuide />
      </div>
    </div>
  );
}
