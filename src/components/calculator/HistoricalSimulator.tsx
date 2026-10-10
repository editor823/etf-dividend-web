'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  History,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  simulateHistoricalInvestment,
} from '@/lib/calculator/historical-simulator';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import HistoricalSimulatorGuide from './guides/HistoricalSimulatorGuide';

export default function HistoricalSimulator() {
  const [ticker, setTicker] = useState<string>('SCHD');
  const [periodMonths, setPeriodMonths] = useState<number>(60); // 기본 5년 (60개월)
  const [initialInvestment, setInitialInvestment] = useState<number>(10000); // 초기 $10,000
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500); // 매월 $500
  const [isDripEnabled, setIsDripEnabled] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const periodOptions = [
    { label: '1년 (1Y)', months: 12 },
    { label: '3년 (3Y)', months: 36 },
    { label: '5년 (5Y)', months: 60 },
    { label: '10년 (10Y)', months: 120 },
  ];

  const availableTickers = [
    { ticker: 'SCHD', name: 'Schwab U.S. Dividend Equity' },
    { ticker: 'JEPI', name: 'JPMorgan Equity Premium Income' },
    { ticker: 'JEPQ', name: 'JPMorgan Nasdaq Premium Income' },
    { ticker: 'VOO', name: 'Vanguard S&P 500 ETF' },
    { ticker: 'QQQ', name: 'Invesco QQQ Trust' },
  ];

  // 시뮬레이션 계산
  const result = useMemo(() => {
    return simulateHistoricalInvestment({
      ticker,
      periodMonths,
      initialInvestment,
      monthlyContribution,
      isDripEnabled,
    });
  }, [ticker, periodMonths, initialInvestment, monthlyContribution, isDripEnabled]);

  // 환율 1,350원 기준 원화 환산
  const EXCHANGE_RATE = 1350;

  // 활성 표시 기준 (DRIP 켜져 있으면 DRIP, 꺼져 있으면 현금 수령)
  const activeEndingValue = isDripEnabled ? result.dripEndingValue : result.cashEndingTotalValue;
  const activeReturnRate = isDripEnabled ? result.dripTotalReturnRate : result.cashTotalReturnRate;
  const activeDividends = isDripEnabled ? result.dripTotalDividendsReceived : result.cashTotalDividendsReceived;
  const activeYoc = isDripEnabled ? result.dripYieldOnCost : result.cashYieldOnCost;

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 설명 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-income" />
            <span>기능 3: What-If 과거 타임머신</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            과거 ETF 타임머신 계산기
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            과거 1년/3년/5년 전부터 거치 및 매월 적립식으로 투자했을 때의 실제 총자산과 배당 복리(DRIP) 성과를 역추적합니다.
          </p>
        </div>

        {/* DRIP 재투자 토글 스위치 */}
        <div className="flex items-center gap-3 p-2 bg-brand-bg rounded-2xl border border-subtle-border self-start sm:self-auto">
          <span className="text-xs font-bold text-brand-primary pl-2">
            배당 재투자 (DRIP)
          </span>
          <button
            type="button"
            onClick={() => setIsDripEnabled(!isDripEnabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              isDripEnabled ? 'bg-income justify-end' : 'bg-gray-300 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. 컨트롤 입력 패널 (종목, 기간, 초기투자금, 월적립금) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-brand-bg rounded-2xl border border-subtle-border">
        {/* 종목 선택 */}
        <div>
          <label className="text-xs font-bold text-brand-primary block mb-1.5">
            대상 ETF 선택
          </label>
          <select
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="w-full px-3 py-2.5 bg-white rounded-xl border border-subtle-border text-sm font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
          >
            {availableTickers.map((item) => (
              <option key={item.ticker} value={item.ticker}>
                {item.ticker} ({item.name.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* 기간 선택 버튼들 */}
        <div>
          <label className="text-xs font-bold text-brand-primary block mb-1.5">
            과거 투자 기간
          </label>
          <div className="grid grid-cols-4 gap-1">
            {periodOptions.map((opt) => (
              <button
                key={opt.months}
                type="button"
                onClick={() => setPeriodMonths(opt.months)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  periodMonths === opt.months
                    ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                    : 'bg-white border-subtle-border text-brand-muted hover:text-brand-primary'
                }`}
              >
                {opt.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 초기 투자금 */}
        <div>
          <label className="text-xs font-bold text-brand-primary block mb-1.5">
            초기 목돈 투자금 ($)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-brand-muted">
              $
            </span>
            <input
              type="number"
              min="0"
              step="500"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value)))}
              className="w-full pl-7 pr-3 py-2 bg-white rounded-xl border border-subtle-border text-sm num-font font-bold focus:outline-none focus:ring-2 focus:ring-income"
            />
          </div>
        </div>

        {/* 매월 정기 적립액 */}
        <div>
          <label className="text-xs font-bold text-brand-primary block mb-1.5">
            매월 추가 적립액 ($)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-brand-muted">
              $
            </span>
            <input
              type="number"
              min="0"
              step="50"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
              className="w-full pl-7 pr-3 py-2 bg-white rounded-xl border border-subtle-border text-sm num-font font-bold focus:outline-none focus:ring-2 focus:ring-income"
            />
          </div>
        </div>
      </div>

      {/* 3. 중앙 4대 핵심 결과 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 현재 총 평가액 */}
        <div className="bg-gradient-to-br from-brand-primary to-brand-dark text-white rounded-2xl p-5 shadow-card space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>현재 총 자산 평가액</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-income text-white text-[10px] font-bold">
              <ArrowUpRight className="w-3 h-3" />
              {formatPercent(activeReturnRate)}
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black num-font">
              {formatCurrency(activeEndingValue, 'USD')}
            </div>
            <p className="text-xs text-white/80 num-font mt-0.5">
              약 {formatCurrency(activeEndingValue * EXCHANGE_RATE, 'KRW')}
            </p>
          </div>
          <div className="text-[11px] text-white/60 pt-2 border-t border-white/10 flex items-center justify-between">
            <span>연평균 복리(CAGR)</span>
            <span className="num-font font-bold text-income-light">
              {formatPercent(result.dripCagr)}
            </span>
          </div>
        </div>

        {/* 누적 세후 배당금 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border shadow-card space-y-2">
          <span className="text-xs text-brand-muted block">누적 수령 배당금 (세후)</span>
          <div>
            <div className="text-2xl font-bold num-font text-income">
              +{formatCurrency(activeDividends, 'USD')}
            </div>
            <p className="text-xs text-brand-muted num-font mt-0.5">
              약 +{formatCurrency(activeDividends * EXCHANGE_RATE, 'KRW')}
            </p>
          </div>
          <div className="text-[11px] text-brand-muted pt-2 border-t border-subtle-border flex items-center justify-between">
            <span>미국 배당세 15%</span>
            <span className="font-semibold text-brand-primary">자동 차감 반영</span>
          </div>
        </div>

        {/* 원금 대비 현재 배당수익률 (YoC) */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-muted">원금 대비 배당률 (YoC)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-secondary text-brand-primary font-bold">
              Yield on Cost
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold num-font text-brand-primary">
              {formatPercent(activeYoc)}
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              초기 투자 원금 대비 연 수익률
            </p>
          </div>
          <div className="text-[11px] text-brand-muted pt-2 border-t border-subtle-border flex items-center justify-between">
            <span>최종 보유 주식수</span>
            <span className="num-font font-bold text-brand-primary">
              {formatNumber(isDripEnabled ? result.dripEndingShares : result.cashEndingShares, 1)}주
            </span>
          </div>
        </div>

        {/* 총 투자 원금 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border shadow-card space-y-2">
          <span className="text-xs text-brand-muted block">총 투자 원금</span>
          <div>
            <div className="text-2xl font-bold num-font text-brand-primary">
              {formatCurrency(result.totalPrincipal, 'USD')}
            </div>
            <p className="text-xs text-brand-muted num-font mt-0.5">
              약 {formatCurrency(result.totalPrincipal * EXCHANGE_RATE, 'KRW')}
            </p>
          </div>
          <div className="text-[11px] text-brand-muted pt-2 border-t border-subtle-border flex items-center justify-between">
            <span>거치 + 적립 합산</span>
            <span className="num-font font-medium text-brand-primary">
              {periodMonths}개월간 누적
            </span>
          </div>
        </div>
      </div>

      {/* 4. 하단 Recharts 3중 비교 시계열 차트 */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-income" />
              자산 성장 시뮬레이션 곡선 (원금 vs 현금수령 vs DRIP 재투자)
            </h3>
            <p className="text-xs text-brand-muted">
              배당금을 인출하지 않고 꾸준히 재투자(DRIP)했을 때 자산이 눈덩이처럼 불어나는 복리 효과를 비교합니다.
            </p>
          </div>
        </div>

        {/* Recharts 그래프 컨테이너 */}
        <div className="w-full h-80 sm:h-96 bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={result.chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <defs>
                  {/* DRIP 포레스트 그린 그라데이션 */}
                  <linearGradient id="dripGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.0} />
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
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: unknown) => [`$${Number(value ?? 0).toLocaleString()}`, '']}
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
                {/* 1. 투자 원금 (회색 점선) */}
                <Line
                  type="monotone"
                  dataKey="principal"
                  name="누적 투자 원금"
                  stroke="#a8a29e"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                {/* 2. 현금 수령 총자산 (슬레이트 블루 실선) */}
                <Line
                  type="monotone"
                  dataKey="cashPayoutTotalValue"
                  name="현금 수령 시 (주식+배당)"
                  stroke="#4b5563"
                  strokeWidth={2}
                  dot={false}
                />
                {/* 3. DRIP 재투자 총평가액 (포레스트 그린 굵은 실선 + 면적) */}
                <Area
                  type="monotone"
                  dataKey="dripValue"
                  name="배당 재투자(DRIP) 복리"
                  stroke="#2d6a4f"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#dripGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-brand-muted">
              차트 로딩 중...
            </div>
          )}
        </div>

        {/* 5. 스노우볼 복리 격차 인사이트 카드 */}
        <div className="p-5 rounded-2xl bg-income-light/40 border border-income/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-income flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-brand-primary">
                DRIP 복리 재투자의 스노우볼 보너스 격차
              </h4>
              <p className="text-xs text-brand-muted mt-0.5 leading-relaxed">
                배당금을 쓰지 않고 재투자했을 때, 현금으로 인출한 경우보다{' '}
                <strong className="text-income">
                  +{formatCurrency(result.dripAdvantageAmount, 'USD')} (약 +
                  {formatCurrency(result.dripAdvantageAmount * EXCHANGE_RATE, 'KRW')})
                </strong>
                의 추가 자산 복리 격차(약 +{result.dripAdvantagePercent.toFixed(1)}%)가 발생했습니다.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
            <span className="text-xs font-bold text-income px-3 py-1.5 bg-white rounded-xl border border-income/20 num-font shadow-2xs">
              추가 누적 주식: +{(result.dripEndingShares - result.cashEndingShares).toFixed(1)}주
            </span>
          </div>
        </div>

        {/* E-E-A-T 정적 해설 가이드 섹션 */}
        <HistoricalSimulatorGuide />
      </div>
    </div>
  );
}
