'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Layers,
  Gift,
  Wallet,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  TrendingUp,
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
import { ETF_LIST, ETF_MAP } from '@/data/etfList';
import {
  calculate12MonthCalendar,
  SALARY_PRESETS,
  SalaryPreset,
  allocateBudgetToPositions,
  ETF_SCHEDULES,
} from '@/lib/calculator/dividend-calendar';
import { formatCurrency, formatNumber } from '@/lib/utils';
import DividendCalendarGuide from './guides/DividendCalendarGuide';

// 빠른 투자 금액 설정 버튼
const QUICK_BUDGET_KRW = [
  { label: '1,000만 원', value: 10000000 },
  { label: '3,000만 원', value: 30000000 },
  { label: '5,000만 원', value: 50000000 },
  { label: '1억 원', value: 100000000 },
  { label: '2억 원', value: 200000000 },
];

export default function DividendCalendar() {
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('starter_combo');
  const [totalBudgetKRW, setTotalBudgetKRW] = useState<number>(50000000); // 기본 5,000만 원
  const [selectedAddTicker, setSelectedAddTicker] = useState<string>('');

  const exchangeRate = 1350;

  // 포트폴리오 주식 수 상태: 초기값은 '초보자 추천' 프리셋으로 자동 할당
  const [portfolioShares, setPortfolioShares] = useState<Record<string, number>>(() => {
    return allocateBudgetToPositions(50000000, SALARY_PRESETS[0].weights, 1350);
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 총 투자 예산 변경 핸들러
  const handleBudgetChange = (newBudgetKRW: number) => {
    const safeAmount = Math.max(0, newBudgetKRW);
    setTotalBudgetKRW(safeAmount);

    const activePreset = SALARY_PRESETS.find((p) => p.id === selectedPresetId);
    if (activePreset) {
      const newShares = allocateBudgetToPositions(safeAmount, activePreset.weights, exchangeRate);
      setPortfolioShares(newShares);
    } else {
      // 커스텀 상태일 때: 기존 종목들의 비율을 유지하며 예산 스케일링
      const currentPositions = Object.entries(portfolioShares).filter(([, s]) => s > 0);
      if (currentPositions.length > 0) {
        const currentTotalUSD = currentPositions.reduce((acc, [t, s]) => {
          const price = ETF_MAP[t]?.currentPriceUSD || 0;
          return acc + s * price;
        }, 0);

        if (currentTotalUSD > 0) {
          const ratio = (safeAmount / exchangeRate) / currentTotalUSD;
          const updatedShares: Record<string, number> = {};
          currentPositions.forEach(([t, s]) => {
            updatedShares[t] = Math.max(0, Math.round(s * ratio));
          });
          setPortfolioShares(updatedShares);
        }
      }
    }
  };

  // 프리셋 적용 핸들러
  const applyPreset = (preset: SalaryPreset) => {
    setSelectedPresetId(preset.id);
    const newShares = allocateBudgetToPositions(totalBudgetKRW, preset.weights, exchangeRate);
    setPortfolioShares(newShares);
  };

  // 특정 종목의 주식 수 직접 변경 핸들러
  const handleSharesChange = (ticker: string, shares: number) => {
    const validShares = Math.max(0, Math.floor(shares));
    const nextShares = {
      ...portfolioShares,
      [ticker]: validShares,
    };
    setPortfolioShares(nextShares);
    setSelectedPresetId('custom');

    // 변경된 주수에 맞춰 총 투자 예산도 실시간 동기화
    let newTotalUSD = 0;
    Object.entries(nextShares).forEach(([t, s]) => {
      const price = ETF_MAP[t]?.currentPriceUSD || 0;
      newTotalUSD += s * price;
    });
    setTotalBudgetKRW(Math.round(newTotalUSD * exchangeRate));
  };

  // 특정 종목의 투자 금액(원화) 직접 변경 핸들러
  const handleAmountKRWChange = (ticker: string, amountKRW: number) => {
    const etf = ETF_MAP[ticker];
    if (!etf || etf.currentPriceUSD <= 0) return;
    const sharePriceKRW = etf.currentPriceUSD * exchangeRate;
    const targetShares = Math.max(0, Math.floor(amountKRW / sharePriceKRW));
    handleSharesChange(ticker, targetShares);
  };

  // 종목 삭제 핸들러
  const handleRemoveTicker = (ticker: string) => {
    const nextShares = { ...portfolioShares };
    delete nextShares[ticker];
    setPortfolioShares(nextShares);
    setSelectedPresetId('custom');

    let newTotalUSD = 0;
    Object.entries(nextShares).forEach(([t, s]) => {
      const price = ETF_MAP[t]?.currentPriceUSD || 0;
      newTotalUSD += s * price;
    });
    setTotalBudgetKRW(Math.round(newTotalUSD * exchangeRate));
  };

  // 신규 종목 추가 핸들러
  const handleAddTicker = (t: string) => {
    if (!t) return;
    if (portfolioShares[t] !== undefined && portfolioShares[t] > 0) return;

    // 기본 10주 추가
    handleSharesChange(t, 10);
    setSelectedAddTicker('');
  };

  // 12개월 캘린더 연산 수행
  const result = useMemo(() => {
    return calculate12MonthCalendar(portfolioShares, exchangeRate);
  }, [portfolioShares, exchangeRate]);

  // 차트용 데이터
  const chartData = useMemo(() => {
    return result.monthlyFlows.map((flow) => ({
      monthLabel: flow.monthLabel,
      amountKRW: flow.totalNetKRW,
      amountUSD: flow.totalNetUSD,
      isEmpty: flow.isEmpty,
      hasBonus: flow.hasBonusIncome,
    }));
  }, [result]);

  // 현재 포트폴리오에 담긴 종목 목록 (주수 > 0)
  const activePositions = useMemo(() => {
    return Object.entries(portfolioShares)
      .filter(([, s]) => s > 0)
      .map(([ticker, shares]) => {
        const etf = ETF_MAP[ticker] || ETF_LIST[0];
        const schedule = ETF_SCHEDULES[ticker];
        const amountUSD = shares * etf.currentPriceUSD;
        const amountKRW = Math.round(amountUSD * exchangeRate);
        const annualDivKRW = Math.round(amountUSD * etf.dividendYield * (1 - 0.15) * exchangeRate);
        return {
          ticker,
          etf,
          schedule,
          shares,
          amountKRW,
          annualDivKRW,
        };
      });
  }, [portfolioShares, exchangeRate]);

  // 아직 포트폴리오에 없는 종목 목록 (드롭다운 추가용)
  const availableTickersToAdd = useMemo(() => {
    const currentTickers = new Set(Object.keys(portfolioShares).filter((t) => portfolioShares[t] > 0));
    return ETF_LIST.filter((item) => !currentTickers.has(item.ticker));
  }, [portfolioShares]);

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 통화 토글 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-income" />
            <span>기능 6: 12개월 배당 파이프라인</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            12개월 배당 캘린더 &amp; 월급 파이프라인
          </h2>
          <p className="text-sm text-brand-muted mt-1 leading-relaxed">
            내가 보유한 ETF들을 조합했을 때, 1월부터 12월까지 매월 며칠에 얼마의 배당금이 입금되는지 확인하고 배당이 비는 달이 없는 &lsquo;빈틈없는 12개월 월급 파이프라인&rsquo;을 설계합니다.
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

      {/* 2. 캘린더 설정 및 포트폴리오 빌더 인풋 */}
      <div className="p-6 bg-gradient-to-br from-brand-bg via-white to-amber-50/20 rounded-3xl border border-subtle-border space-y-6 shadow-xs">
        {/* 상단 1: 총 투자 예산 직접 입력 */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-sm font-extrabold text-brand-primary flex items-center gap-2">
              <Wallet className="w-4 h-4 text-income" />
              <span>총 투자 금액 (원금 직접 입력)</span>
            </label>
            <span className="text-xs text-brand-muted font-medium">
              환율 1 USD = {formatNumber(exchangeRate)}원 / 미국 배당세 15% 차감 반영
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
                step="1000000"
                value={currency === 'KRW' ? totalBudgetKRW : Math.round(totalBudgetKRW / exchangeRate)}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  handleBudgetChange(currency === 'KRW' ? val : val * exchangeRate);
                }}
                placeholder="투자할 총 금액을 입력하세요"
                className="w-full pl-9 pr-4 py-3 bg-white rounded-2xl border-2 border-subtle-border text-lg sm:text-xl num-font font-black text-brand-primary focus:outline-none focus:border-income focus:ring-2 focus:ring-income/20 transition-all shadow-inner"
              />
            </div>

            {/* 빠른 원클릭 금액 칩 버튼 */}
            <div className="flex flex-wrap items-center gap-1.5">
              {QUICK_BUDGET_KRW.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => handleBudgetChange(btn.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    totalBudgetKRW === btn.value
                      ? 'bg-income text-white border-income shadow-2xs'
                      : 'bg-white hover:bg-brand-secondary border-subtle-border text-brand-primary'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 상단 2: 원클릭 '완벽한 12개월 월급 조합' 프리셋 3종 */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-brand-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-income" />
              원클릭 &lsquo;완벽한 12개월 월급 조합&rsquo; 프리셋 선택
            </span>
            <span className="text-[11px] text-brand-muted">
              선택한 비율에 따라 입력한 총 원금이 각 종목에 자동 분배됩니다.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SALARY_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
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
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <h4 className="text-xs sm:text-sm font-extrabold truncate">
                        {preset.name}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          isSelected
                            ? 'bg-income text-white'
                            : 'bg-brand-secondary text-brand-primary'
                        }`}
                      >
                        {preset.badge}
                      </span>
                    </div>
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

        {/* 상단 3: 내 포트폴리오 ETF 추가/삭제 및 세부 수정 그리드 */}
        <div className="pt-4 border-t border-subtle-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-brand-primary block">
                포트폴리오 종목 구성 (금액 &amp; 보유 주수 실시간 연동)
              </span>
              <span className="text-[11px] text-brand-muted">
                20개 ETF 데이터베이스에서 원하는 종목을 마음대로 추가하거나 금액을 직접 조정해 보세요.
              </span>
            </div>

            {/* 신규 종목 추가 드롭다운 */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <select
                value={selectedAddTicker}
                onChange={(e) => handleAddTicker(e.target.value)}
                className="px-3 py-1.5 bg-white rounded-xl border border-subtle-border text-xs font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
              >
                <option value="">＋ 새 ETF 종목 추가하기...</option>
                {availableTickersToAdd.map((etf) => (
                  <option key={etf.ticker} value={etf.ticker}>
                    {etf.ticker} - {etf.name.split('(')[0].trim()} ({etf.payoutCycle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 현재 담긴 종목 카드 목록 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activePositions.map((pos) => {
              return (
                <div
                  key={pos.ticker}
                  className="p-4 rounded-2xl bg-white border border-income/30 shadow-xs ring-1 ring-income/10 space-y-3 relative group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-brand-primary">
                          {pos.ticker}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-income-light text-income">
                          {pos.etf.payoutCycle}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-muted truncate max-w-[180px]">
                        {pos.etf.name.split('(')[0].trim()}
                      </p>
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={() => handleRemoveTicker(pos.ticker)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                      title="종목 제거"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 세부 수량 & 금액 입력 */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-brand-muted block mb-1">
                        투자 금액 (원화)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100000"
                        value={pos.amountKRW}
                        onChange={(e) =>
                          handleAmountKRWChange(pos.ticker, Number(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 bg-brand-bg rounded-xl border border-subtle-border text-xs num-font font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-brand-muted block mb-1">
                        보유 주수 (주)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={pos.shares}
                        onChange={(e) =>
                          handleSharesChange(pos.ticker, Number(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 bg-brand-bg rounded-xl border border-subtle-border text-xs num-font font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-subtle-border/60 flex items-center justify-between text-[11px] text-brand-muted">
                    <span>예상 세후 연배당</span>
                    <span className="font-bold text-income num-font">
                      +{formatCurrency(pos.annualDivKRW, 'KRW')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. 파이프라인 진단 및 연간 총 배당 통계 요약 (4대 요약 카드) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 카드 1: 파이프라인 완성도 진단 카드 */}
        <div
          className={`rounded-2xl p-5 border shadow-card space-y-2 ${
            result.diagnosis.isComplete
              ? 'bg-gradient-to-br from-emerald-900 to-brand-dark text-white border-income'
              : 'bg-white border-amber-300 text-brand-primary'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className={result.diagnosis.isComplete ? 'text-white/80' : 'text-brand-muted'}>
              파이프라인 완성도
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                result.diagnosis.isComplete
                  ? 'bg-income text-white'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {result.diagnosis.paidMonthsCount}/12개월 달성
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black num-font">
              {result.diagnosis.isComplete ? '100% 월급 완성' : `${12 - result.diagnosis.paidMonthsCount}개월 공백`}
            </div>
            <p
              className={`text-xs mt-0.5 line-clamp-2 ${
                result.diagnosis.isComplete ? 'text-white/80' : 'text-brand-muted'
              }`}
            >
              {result.diagnosis.isComplete
                ? '🎯 12달 내내 쉬지 않고 돈이 들어옵니다!'
                : `⚠️ ${result.diagnosis.emptyMonths.map((m) => `${m}월`).join(', ')} 입금 없음`}
            </p>
          </div>
          <div
            className={`pt-2 border-t text-[11px] flex items-center justify-between ${
              result.diagnosis.isComplete ? 'border-white/10 text-white/70' : 'border-subtle-border text-brand-muted'
            }`}
          >
            <span>현금흐름 안전성</span>
            <span className="font-bold text-income">
              {result.diagnosis.isComplete ? '최상급 (월급형)' : '보완 추천'}
            </span>
          </div>
        </div>

        {/* 카드 2: 연간 총 세후 배당금 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>연간 총 세후 배당 실수령</span>
            <span className="px-2 py-0.5 rounded-full bg-income-light text-income text-[10px] font-bold">
              15% 세금 차감
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black num-font text-income">
              {currency === 'KRW'
                ? formatCurrency(result.totalAnnualNetKRW, 'KRW')
                : formatCurrency(result.totalAnnualNetUSD, 'USD')}
            </div>
            <p className="text-xs text-brand-muted num-font mt-0.5">
              {currency === 'KRW'
                ? `약 ${formatCurrency(result.totalAnnualNetUSD, 'USD')}`
                : `약 ${formatCurrency(result.totalAnnualNetKRW, 'KRW')}`}
            </p>
          </div>
          <div className="pt-2 border-t border-subtle-border text-[11px] text-brand-muted flex items-center justify-between">
            <span>실질 세후 배당수익률</span>
            <span className="font-bold text-brand-primary num-font">
              연 {result.effectiveNetYield}%
            </span>
          </div>
        </div>

        {/* 카드 3: 월평균 환산 실수령액 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>월평균 환산 실수령액</span>
            <span className="px-2 py-0.5 rounded-full bg-brand-secondary text-brand-primary text-[10px] font-bold">
              제2의 월급
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black num-font text-brand-primary">
              {currency === 'KRW'
                ? formatCurrency(result.monthlyAverageNetKRW, 'KRW')
                : formatCurrency(result.monthlyAverageNetUSD, 'USD')}
            </div>
            <p className="text-xs text-brand-muted num-font mt-0.5">
              12개월 균등 환산 기준
            </p>
          </div>
          <div className="pt-2 border-t border-subtle-border text-[11px] text-brand-muted flex items-center justify-between">
            <span>총 투자 원금</span>
            <span className="font-bold text-brand-primary num-font">
              {formatCurrency(result.totalPortfolioKRW, 'KRW')}
            </span>
          </div>
        </div>

        {/* 카드 4: 최고 입금 월 vs 최저 입금 월 편차 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>월별 입금 편차율</span>
            <span className="px-2 py-0.5 rounded-full bg-brand-secondary text-brand-primary text-[10px] font-bold">
              고저차: {result.flowDeviationPercent}%
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold num-font text-brand-primary truncate">
              {result.maxMonthFlow.monthLabel} (최고) vs {result.minMonthFlow.monthLabel}
            </div>
            <p className="text-xs text-brand-muted num-font mt-0.5">
              최고: {formatCurrency(result.maxMonthFlow.netKRW, 'KRW')} / 최저: {formatCurrency(result.minMonthFlow.netKRW, 'KRW')}
            </p>
          </div>
          <div className="pt-2 border-t border-subtle-border text-[11px] text-brand-muted flex items-center justify-between">
            <span>현금흐름 균등도</span>
            <span className="font-semibold text-income">
              {result.flowDeviationPercent < 40 ? '매우 균등' : '분기 집중형'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. 월별 현금흐름 밸런스 막대 차트 */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-income" />
              월별 현금흐름 밸런스 막대 차트
            </h3>
            <p className="text-xs text-brand-muted">
              1월부터 12월까지 매월 들어오는 배당금의 높낮이를 비교하여, 특정 달에만 몰려 있는지 고르게 들어오는지 한눈에 파악합니다.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-brand-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#2d6a4f]" />
              <span>분기 보너스달</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#84a98c]" />
              <span>일반 월배당</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#e5e7eb]" />
              <span>배당 없음</span>
            </div>
          </div>
        </div>

        <div className="w-full h-72 sm:h-80 bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="monthLabel" tickLine={false} stroke="#78716c" tick={{ fontSize: 12 }} />
                <YAxis
                  tickLine={false}
                  stroke="#78716c"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) =>
                    currency === 'KRW'
                      ? `${Math.round(val / 10000).toLocaleString()}만`
                      : `$${val}`
                  }
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    currency === 'KRW'
                      ? formatCurrency(Number(value ?? 0), 'KRW')
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
                <Bar
                  dataKey={currency === 'KRW' ? 'amountKRW' : 'amountUSD'}
                  radius={[6, 6, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isEmpty ? '#e5e7eb' : entry.hasBonus ? '#2d6a4f' : '#84a98c'}
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

      {/* 5. 12개월 배당 캘린더 매트릭스 뷰 (12개 월 카드 그리드) */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
              <Layers className="w-5 h-5 text-income" />
              1~12월 연간 배당 캘린더 매트릭스
            </h3>
            <p className="text-xs text-brand-muted">
              각 월 카드에서 입금 예정 금액과 해당 월에 배당을 주는 종목 배지, 배당락일 시즌을 확인하세요.
            </p>
          </div>
          <span className="text-xs text-brand-muted">
            15% 미국 원천징수 차감 세후 실수령액 기준
          </span>
        </div>

        {/* 12개 월 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {result.monthlyFlows.map((flow) => {
            return (
              <div
                key={flow.month}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  flow.isEmpty
                    ? 'border-subtle-border bg-brand-bg/50 opacity-70'
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
                        ? formatCurrency(flow.totalNetKRW, 'KRW')
                        : formatCurrency(flow.totalNetUSD, 'USD')}
                    </div>
                    <span className="text-[11px] text-brand-muted num-font">
                      {currency === 'KRW'
                        ? `($${flow.totalNetUSD.toFixed(1)})`
                        : `(₩${formatNumber(flow.totalNetKRW)})`}
                    </span>
                  </div>

                  {/* 지급 이벤트 종목 배지 리스트 */}
                  <div className="space-y-1.5 pt-2 border-t border-subtle-border/60">
                    {flow.events.length > 0 ? (
                      flow.events.map((ev, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-0.5 bg-white/60 px-2 py-1 rounded-lg border border-subtle-border/40"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-bold text-brand-primary">
                              {ev.ticker}
                            </span>
                            <span className="text-[10px] text-brand-muted">
                              ({ev.shares}주)
                            </span>
                          </div>
                          <span className="num-font font-bold text-income">
                            +{formatCurrency(ev.netAmountKRW, 'KRW')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-2 text-center space-y-1">
                        <p className="text-[11px] text-alert font-medium flex items-center justify-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          배당 공백 발생
                        </p>
                        <p className="text-[10px] text-brand-muted">
                          월배당 ETF(O, MAIN 등)를 담아 메꿔보세요.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 배당락 및 지급일 시즌 안내 */}
                <div className="pt-3 mt-3 border-t border-subtle-border/60 text-[10px] text-brand-muted flex items-center justify-between">
                  <span>지급 시기:</span>
                  <span className="font-medium text-brand-primary truncate max-w-[150px]">
                    {flow.events.length > 0
                      ? flow.events[0].payDateApprox
                      : '일정 없음'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. 파이프라인 자동 진단 및 E-E-A-T 가이드 배너 */}
        <div className="p-5 rounded-2xl bg-white border border-subtle-border shadow-card space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-income-light text-income shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-brand-primary">
                파이프라인 인텔리전스 진단 결과
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                {result.diagnosis.recommendationMessage}
              </p>
              {!result.diagnosis.isComplete && result.diagnosis.recommendedTickers.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-brand-primary">공백 메우기 추천 종목:</span>
                  {result.diagnosis.recommendedTickers.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddTicker(t)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-income-light text-income hover:bg-income hover:text-white transition-all border border-income/30"
                    >
                      <Plus className="w-3 h-3" />
                      [{t}] 포트폴리오에 추가
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* E-E-A-T 정적 해설 가이드 섹션 */}
        <DividendCalendarGuide />
      </div>
    </div>
  );
}
