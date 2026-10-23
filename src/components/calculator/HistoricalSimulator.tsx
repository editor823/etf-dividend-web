'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  History,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Coins,
  Wallet,
  CalendarDays,
  CheckCircle2,
  PiggyBank,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { ETF_LIST, ETF_MAP } from '@/data/etfList';
import {
  runHistoricalBacktest,
  BacktestResult,
} from '@/lib/calculator/historical-simulator';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import HistoricalSimulatorGuide from './guides/HistoricalSimulatorGuide';

// 인기 4대 프리셋 ETF
const POPULAR_PRESETS = ['SCHD', 'VOO', 'JEPI', 'QQQ'];

// 과거 시작 시점 기간 프리셋
const PERIOD_PRESETS = [
  { label: '1년 전', years: 1, desc: '최근 1년 단기' },
  { label: '3년 전', years: 3, desc: '중기 추세' },
  { label: '5년 전', years: 5, desc: '2022년 조정장 관통' },
  { label: '10년 전', years: 10, desc: '장기 복리' },
];

// 초기 목돈 프리셋
const INITIAL_PRESETS = [
  { label: '0원', value: 0 },
  { label: '500만 원', value: 5000000 },
  { label: '1,000만 원', value: 10000000 },
  { label: '3,000만 원', value: 30000000 },
];

// 매월 적립금 프리셋
const MONTHLY_PRESETS = [
  { label: '0원', value: 0 },
  { label: '30만 원', value: 300000 },
  { label: '50만 원', value: 500000 },
  { label: '100만 원', value: 1000000 },
  { label: '200만 원', value: 2000000 },
];

export default function HistoricalSimulator() {
  const [ticker, setTicker] = useState<string>('SCHD');
  const [periodYears, setPeriodYears] = useState<number>(5); // 기본 5년 전
  const [initialCapitalKRW, setInitialCapitalKRW] = useState<number>(10000000); // 기본 1,000만 원
  const [monthlyContributionKRW, setMonthlyContributionKRW] = useState<number>(500000); // 기본 50만 원
  const [isDripEnabled, setIsDripEnabled] = useState<boolean>(true); // 기본 DRIP 재투자
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const selectedEtf = ETF_MAP[ticker] || ETF_LIST[0];

  // 백테스트 연산 실행
  const result: BacktestResult = useMemo(() => {
    return runHistoricalBacktest({
      ticker,
      periodYears,
      initialCapitalKRW,
      monthlyContributionKRW,
      isDripEnabled,
      exchangeRate: 1350,
    });
  }, [ticker, periodYears, initialCapitalKRW, monthlyContributionKRW, isDripEnabled]);

  // 하단 연도별 배당금 추이 막대 데이터 (연도별 마지막 달 배당금 집계)
  const annualDividendSummary = useMemo(() => {
    const yearMap = new Map<string, number>();
    result.chartData.forEach((pt) => {
      const year = pt.dateLabel.split('.')[0];
      // 연도별 최종 시점의 월 배당금
      yearMap.set(year, pt.monthlyDividendKRW);
    });

    return Array.from(yearMap.entries()).map(([year, monthlyDiv]) => ({
      year: `${year}년`,
      monthlyDivKRW: monthlyDiv,
      annualDivKRW: monthlyDiv * 12,
    }));
  }, [result.chartData]);

  // 만원 단위 포맷 도우미
  const formatManwon = (won: number) => {
    if (Math.abs(won) >= 100000000) {
      const eok = (won / 100000000).toFixed(1);
      return `${eok}억 원`;
    }
    const man = Math.round(won / 10000);
    return `${man.toLocaleString()}만 원`;
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & DRIP 모드 선택 세그먼트 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-income" />
            <span>기능 3: 타임머신 적립식 백테스트</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            과거 ETF 타임머신 계산기
          </h2>
          <p className="text-sm text-brand-muted mt-1 leading-relaxed">
            &ldquo;내가 {periodYears}년 전부터 매월 {formatManwon(monthlyContributionKRW)}을 꾸준히 이 ETF에 적립 매수해 왔다면, 현재 내 총자산과 월 배당금은 얼마일까?&rdquo;
          </p>
        </div>

        {/* 배당 재투자(DRIP) 여부 토글 버튼 */}
        <div className="bg-brand-bg p-1.5 rounded-2xl border border-subtle-border flex items-center gap-1.5 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setIsDripEnabled(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isDripEnabled
                ? 'bg-income text-white shadow-xs'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            과거 배당금 전액 재투자 (DRIP)
          </button>
          <button
            type="button"
            onClick={() => setIsDripEnabled(false)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              !isDripEnabled
                ? 'bg-brand-primary text-white shadow-xs'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            과거 배당금 현금 인출
          </button>
        </div>
      </div>

      {/* 2. 시뮬레이션 입력 컨트롤 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 bg-brand-bg rounded-2xl border border-subtle-border">
        {/* 컨트롤 1: 대상 ETF 선택기 (4열) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-brand-primary block">
              1. 대상 ETF 선택 (20개 데이터베이스)
            </label>
            <span className="text-[11px] text-income font-semibold">
              {selectedEtf.category}
            </span>
          </div>

          {/* 20개 ETF 드롭다운 */}
          <select
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-subtle-border text-sm font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
          >
            {ETF_LIST.map((item) => (
              <option key={item.ticker} value={item.ticker}>
                {item.ticker} - {item.name.split('(')[0].trim()} ({formatPercent(item.dividendYield, 1)}, {item.payoutCycle})
              </option>
            ))}
          </select>

          {/* 인기 프리셋 빠른 선택 버튼 */}
          <div className="space-y-1">
            <span className="text-[11px] text-brand-muted font-medium">인기 프리셋:</span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_PRESETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTicker(t)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                    ticker === t
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white border-subtle-border text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  [{t}]
                </button>
              ))}
            </div>
          </div>

          {/* 선택 종목 정보 요약 카드 */}
          <div className="p-2.5 bg-white/80 rounded-xl border border-subtle-border/60 text-xs text-brand-muted space-y-1">
            <div className="flex justify-between font-medium">
              <span>현재 주가 (USD):</span>
              <span className="text-brand-primary font-bold num-font">${selectedEtf.currentPriceUSD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>시가배당률 / 주기:</span>
              <span className="text-income font-bold num-font">
                {formatPercent(selectedEtf.dividendYield)} ({selectedEtf.payoutCycle})
              </span>
            </div>
          </div>
        </div>

        {/* 컨트롤 2: 과거 투자 시작 시점 선택 (4열) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-brand-primary block">
              2. 과거 투자 시작 시점 (기간)
            </label>
            <span className="text-xs font-extrabold text-brand-primary num-font">
              {periodYears}년 전 ({periodYears * 12}개월)
            </span>
          </div>

          {/* 원클릭 칩 버튼 */}
          <div className="grid grid-cols-4 gap-1.5">
            {PERIOD_PRESETS.map((opt) => (
              <button
                key={opt.years}
                type="button"
                onClick={() => setPeriodYears(opt.years)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                  periodYears === opt.years
                    ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                    : 'bg-white border-subtle-border text-brand-muted hover:text-brand-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* 슬라이더 컨트롤 */}
          <div className="space-y-1 pt-1">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={periodYears}
              onChange={(e) => setPeriodYears(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
            <div className="flex justify-between text-[11px] text-brand-muted font-medium">
              <span>시작: {result.startDateLabel}</span>
              <span>종료: {result.endDateLabel}</span>
            </div>
          </div>

          <div className="p-2.5 bg-white/80 rounded-xl border border-subtle-border/60 text-xs text-brand-muted flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-income shrink-0" />
            <span>총 {result.periodMonths}개월간 분할 적립 매수 진행</span>
          </div>
        </div>

        {/* 컨트롤 3: 투자 금액 설정 인풋 (4열) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-brand-primary">
                3. 초기 목돈 (시작 자본)
              </label>
              <span className="text-xs font-bold text-brand-primary num-font">
                {formatManwon(initialCapitalKRW)}
              </span>
            </div>
            {/* 목돈 칩 버튼 */}
            <div className="grid grid-cols-4 gap-1">
              {INITIAL_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setInitialCapitalKRW(p.value)}
                  className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                    initialCapitalKRW === p.value
                      ? 'bg-income text-white border-income shadow-2xs'
                      : 'bg-white border-subtle-border text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-subtle-border/60">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-brand-primary">
                매월 정기 적립금
              </label>
              <span className="text-xs font-extrabold text-income num-font">
                월 {formatManwon(monthlyContributionKRW)}
              </span>
            </div>

            {/* 적립금 슬라이더 */}
            <input
              type="range"
              min="0"
              max="3000000"
              step="100000"
              value={monthlyContributionKRW}
              onChange={(e) => setMonthlyContributionKRW(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-income"
            />

            {/* 적립금 빠른 칩 버튼 */}
            <div className="flex flex-wrap gap-1">
              {MONTHLY_PRESETS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMonthlyContributionKRW(m.value)}
                  className={`px-2 py-1 text-[10px] font-bold rounded border transition-all ${
                    monthlyContributionKRW === m.value
                      ? 'bg-income text-white border-income'
                      : 'bg-white border-subtle-border text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. 백테스트 핵심 결과 카드 4종 (Tremor Financial Metrics Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 카드 1: 현재 총 평가 자산 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border border-l-4 border-l-income shadow-card hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-muted flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-income" />
              1. 현재 총 평가 자산
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-income-light text-income text-[11px] font-bold">
              <ArrowUpRight className="w-3 h-3" />
              {result.totalReturnRate >= 0 ? '+' : ''}
              {formatPercent(result.totalReturnRate, 1)}
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black num-font tracking-tight text-brand-primary">
              {formatCurrency(result.currentTotalAssetKRW, 'KRW')}
            </div>
            <p className="text-xs text-brand-muted num-font mt-0.5">
              순수익: <span className="text-income font-bold">+{formatCurrency(result.totalProfitKRW, 'KRW')}</span>
            </p>
          </div>
          <div className="text-[11px] text-brand-muted pt-2 border-t border-subtle-border/80 flex items-center justify-between">
            <span>연평균 복리 (CAGR)</span>
            <span className="num-font font-black text-income">
              +{formatPercent(result.cagr, 1)}
            </span>
          </div>
        </div>

        {/* 카드 2: 총 납입 원금 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border border-l-4 border-l-slate-600 shadow-card hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-muted flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-slate-600" />
              2. 총 납입 원금
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
              {result.periodMonths}회 분할
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black num-font tracking-tight text-brand-primary">
              {formatCurrency(result.totalPrincipalKRW, 'KRW')}
            </div>
            <p className="text-xs text-brand-muted mt-0.5 truncate">
              초기 {formatManwon(initialCapitalKRW)} + 매월 적립 누적
            </p>
          </div>
          <div className="text-[11px] text-brand-muted pt-2 border-t border-subtle-border/80 flex items-center justify-between">
            <span>총 납입 횟수</span>
            <span className="font-bold text-brand-primary num-font">
              {result.periodMonths}개월 연속 적립
            </span>
          </div>
        </div>

        {/* 카드 3: 현재 월 세후 배당 실수령액 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border border-l-4 border-l-emerald-600 shadow-card hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-muted flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              3. 현재 월 세후 실수령액
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
              15.4% 세후
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black num-font tracking-tight text-income">
              +{formatCurrency(result.currentMonthlyDividendKRW, 'KRW')}
              <span className="text-xs text-brand-muted font-normal"> / 월</span>
            </div>
            <p className="text-xs text-brand-muted num-font mt-0.5">
              연간 환산: 약 {formatCurrency(result.currentAnnualDividendKRW, 'KRW')}
            </p>
          </div>
          <div className="text-[11px] text-brand-muted pt-2 border-t border-subtle-border/80 flex items-center justify-between">
            <span>최종 보유 주식수</span>
            <span className="font-black text-brand-primary num-font">
              {formatNumber(result.endingShares, 1)}주
            </span>
          </div>
        </div>

        {/* 카드 4: 누적 수령 배당금 총액 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border border-l-4 border-l-amber-500 shadow-card hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-muted flex items-center gap-1.5">
              <PiggyBank className="w-3.5 h-3.5 text-amber-600" />
              4. 누적 수령 배당 총액
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
              {periodYears}년 누적
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black num-font tracking-tight text-brand-primary">
              +{formatCurrency(result.accumulatedDividendsKRW, 'KRW')}
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              과거 {periodYears}년 동안 꽂힌 총 배당금
            </p>
          </div>
          <div className="text-[11px] text-brand-muted pt-2 border-t border-subtle-border/80 flex items-center justify-between">
            <span>원금 대비 배당률 (YoC)</span>
            <span className="font-black text-income num-font">
              연 {result.yieldOnCost.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* 3-1. 퀀트 실질 구매력 & 인플레이션 보존율 바 */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-income/10 border border-amber-300/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            ⚖️
          </span>
          <div>
            <span className="font-extrabold text-brand-primary">
              퀀트 실질 구매력 분석 (연 물가상승률 2.5% 감가상각 반영)
            </span>
            <p className="text-[11px] text-brand-muted mt-0.5">
              과거 {periodYears}년 전 화폐가치 기준 현재 실질 자산은{' '}
              <strong className="text-brand-primary font-bold">
                {formatCurrency(result.realTotalAssetKRW, 'KRW')}
              </strong>
              이며, 실질 월배당금은{' '}
              <strong className="text-brand-primary font-bold">
                {formatCurrency(result.realMonthlyDividendKRW, 'KRW')}
              </strong>
              입니다. (화폐 구매력 보존율: {result.purchasingPowerPercent}%)
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
          <span className="text-[10px] text-brand-muted block font-semibold">원금회수율 (YoC)</span>
          <span className="text-sm font-black text-income num-font">
            연 {result.yieldOnCost.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 4. 자산 성장 및 배당금 누적 차트 */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-income" />
              자산 성장 및 누적 원금 비교 차트
            </h3>
            <p className="text-xs text-brand-muted">
              초록색 영역(총 평가 자산)이 회색 점선(누적 납입 원금) 위로 벌어질수록 복리 자본수익과 배당금 효과가 커집니다.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-brand-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2d6a4f]" />
              <span>총 평가 자산</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#a8a29e] border-t border-dashed border-[#a8a29e]" />
              <span>누적 납입 원금</span>
            </div>
          </div>
        </div>

        {/* 메인 AreaChart 그래프 컨테이너 */}
        <div className="w-full h-80 sm:h-96 bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={result.chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="assetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="dateLabel"
                  tickLine={false}
                  stroke="#78716c"
                  tick={{ fontSize: 11 }}
                  minTickGap={25}
                />
                <YAxis
                  tickLine={false}
                  stroke="#78716c"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `${Math.round(val / 10000).toLocaleString()}만`}
                />
                <Tooltip
                  formatter={(value: unknown, name: unknown) => {
                    const numVal = Number(value ?? 0);
                    return [`${formatCurrency(numVal, 'KRW')}`, String(name)];
                  }}
                  labelFormatter={(label) => `시점: ${label}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
                {/* 1. 순수 누적 원금 (회색 점선) */}
                <Line
                  type="monotone"
                  dataKey="principalKRW"
                  name="순수 누적 원금 (내가 부은 돈)"
                  stroke="#a8a29e"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                {/* 2. 총 평가 자산 (초록색 영역) */}
                <Area
                  type="monotone"
                  dataKey="totalAssetKRW"
                  name="총 평가 자산 (원금+수익+배당)"
                  stroke="#2d6a4f"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#assetGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-brand-muted">
              차트 로딩 중...
            </div>
          )}
        </div>

        {/* 연도별로 늘어나는 '월 배당금 성장 추이' 막대 그래프 (서브 차트) */}
        <div className="p-5 bg-brand-bg rounded-2xl border border-subtle-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-brand-primary flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-income" />
                연도별 월 배당금 성장 추이 (통장에 찍히는 월세)
              </h4>
              <p className="text-xs text-brand-muted mt-0.5">
                적립 매수와 배당 재투자가 누적되며 매월 입금되는 세후 배당금이 계단식으로 불어나는 모습입니다.
              </p>
            </div>
            <span className="text-xs font-bold text-income num-font">
              현재: {formatCurrency(result.currentMonthlyDividendKRW, 'KRW')} / 월
            </span>
          </div>

          <div className="w-full h-44">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualDividendSummary} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="year" tickLine={false} stroke="#78716c" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickLine={false}
                    stroke="#78716c"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => `${Math.round(val / 10000)}만`}
                  />
                  <Tooltip
                    formatter={(val: unknown) => [
                      `${formatCurrency(Number(val ?? 0), 'KRW')}/월 (연 약 ${formatCurrency(Number(val ?? 0) * 12, 'KRW')})`,
                      '월 배당금',
                    ]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="monthlyDivKRW"
                    name="월 배당금"
                    fill="#2d6a4f"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* 5. 과거 위기 극복 및 현실 검증 인사이트 카드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 실제 겪었던 하락장 방어력 코멘트 */}
          <div className="p-5 rounded-2xl bg-white border border-subtle-border shadow-card space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-income-light text-income">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-income uppercase">
                  Stress-Test Verification
                </span>
                <h4 className="text-sm font-bold text-brand-primary">
                  {result.crisisInsightTitle}
                </h4>
              </div>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              {result.crisisInsightBody}
            </p>
            <div className="p-3 rounded-xl bg-brand-bg border border-subtle-border text-xs text-brand-primary leading-relaxed">
              <strong>적립식 매수(DCA) 효과:</strong> {result.dcaEffectComment}
            </div>
          </div>

          {/* 배당 재투자(DRIP) 스노우볼 격차 & 세율/환율 기준 박스 */}
          <div className="p-5 rounded-2xl bg-income-light/30 border border-income/30 shadow-card flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white text-income shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-income uppercase">
                    DRIP Compound Advantage
                  </span>
                  <h4 className="text-sm font-bold text-brand-primary">
                    배당 재투자(DRIP) 스노우볼 보너스
                  </h4>
                </div>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                배당금을 현금으로 쓰지 않고 전액 주식 재매수에 투입했을 때, 현금 인출 대비 약{' '}
                <strong className="text-income font-bold">
                  +{formatCurrency(result.dripBonusKRW, 'KRW')} ({result.dripBonusPercent}%)
                </strong>
                의 추가 자산 복리 격차가 발생했습니다.
              </p>
            </div>

            {/* 환율 & 세율 일관성 배너 */}
            <div className="p-3 bg-white rounded-xl border border-income/20 text-[11px] text-brand-muted space-y-1">
              <div className="flex justify-between">
                <span>적용 환율:</span>
                <span className="font-bold text-brand-primary num-font">1 USD = 1,350원 고정</span>
              </div>
              <div className="flex justify-between">
                <span>배당소득세:</span>
                <span className="font-bold text-brand-primary">미국 원천징수 15% 전액 차감 반영</span>
              </div>
            </div>
          </div>
        </div>

        {/* E-E-A-T 정적 해설 가이드 섹션 */}
        <HistoricalSimulatorGuide />
      </div>
    </div>
  );
}
