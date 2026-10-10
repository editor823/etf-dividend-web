'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Repeat,
  Info,
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
  simulateDripSnowball,
  DRIP_PRESETS,
  DripPreset,
} from '@/lib/calculator/drip-simulator';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import DripSimulatorGuide from './guides/DripSimulatorGuide';

export default function DripSimulator() {
  const [initialInvestment, setInitialInvestment] = useState<number>(10000); // 초기 $10,000
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500); // 매월 $500
  const [years, setYears] = useState<number>(20); // 기본 20년
  const [dividendYield, setDividendYield] = useState<number>(3.5); // %
  const [dividendGrowthRate, setDividendGrowthRate] = useState<number>(7.5); // %
  const [priceAppreciationRate, setPriceAppreciationRate] = useState<number>(5.5); // %
  const [selectedPreset, setSelectedPreset] = useState<string>('schd');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const exchangeRate = 1350;

  // 프리셋 적용 핸들러
  const applyPreset = (preset: DripPreset) => {
    setSelectedPreset(preset.id);
    setDividendYield(preset.dividendYield * 100);
    setDividendGrowthRate(preset.dividendGrowthRate * 100);
    setPriceAppreciationRate(preset.priceAppreciationRate * 100);
  };

  // 시뮬레이션 연산
  const result = useMemo(() => {
    return simulateDripSnowball({
      initialInvestment,
      monthlyContribution,
      dividendYield: dividendYield / 100,
      dividendGrowthRate: dividendGrowthRate / 100,
      priceAppreciationRate: priceAppreciationRate / 100,
      years,
    });
  }, [
    initialInvestment,
    monthlyContribution,
    dividendYield,
    dividendGrowthRate,
    priceAppreciationRate,
    years,
  ]);

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 설명 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <Repeat className="w-3.5 h-3.5 text-income" />
            <span>기능 5: DRIP 복리 스노우볼</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            배당 재투자(DRIP) 스노우볼 복리 시뮬레이터
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            배당금을 인출하지 않고 전액 재투자했을 때 주식 수가 스스로 주식을 낳는 복리의 기적을 시각화합니다.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-income-light text-income text-xs font-bold self-start sm:self-auto">
          <Sparkles className="w-4 h-4" />
          <span>미국 세금 15% 원천징수 필수 차감</span>
        </div>
      </div>

      {/* 2. 대표 ETF 원클릭 프리셋 버튼 */}
      <div>
        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2">
          🌟 대표 ETF 복리 모델 프리셋
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DRIP_PRESETS.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-primary bg-brand-primary text-white shadow-md ring-2 ring-brand-primary/20'
                    : 'border-subtle-border bg-white text-brand-primary hover:border-brand-muted/40 hover:bg-brand-bg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-extrabold">{p.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-brand-secondary text-brand-primary'
                      }`}
                    >
                      {p.ticker}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-mono mb-2 ${
                      isSelected ? 'text-white/80' : 'text-income font-semibold'
                    }`}
                  >
                    배당 {(p.dividendYield * 100).toFixed(1)}% · 성장 {(p.dividendGrowthRate * 100).toFixed(1)}% · 주가 {(p.priceAppreciationRate * 100).toFixed(1)}%
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected ? 'text-white/70' : 'text-brand-muted'
                    }`}
                  >
                    {p.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 컨트롤 패널 (초기금, 월적립액, 기간 슬라이더, 변수 조절) */}
      <div className="p-6 bg-brand-bg rounded-3xl border border-subtle-border space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 초기 투자금 */}
          <div>
            <label className="text-xs font-bold text-brand-primary block mb-1">
              초기 투자 원금 ($)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-brand-muted">
                $
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                value={initialInvestment}
                onChange={(e) => {
                  setInitialInvestment(Math.max(0, Number(e.target.value)));
                  setSelectedPreset('custom');
                }}
                className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-subtle-border text-sm num-font font-bold focus:outline-none focus:ring-2 focus:ring-income"
              />
            </div>
            <span className="text-[11px] text-brand-muted font-mono mt-1 block">
              약 {formatCurrency(initialInvestment * exchangeRate, 'KRW')}
            </span>
          </div>

          {/* 매월 적립액 */}
          <div>
            <label className="text-xs font-bold text-brand-primary block mb-1">
              매월 추가 적립액 ($)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-brand-muted">
                $
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={monthlyContribution}
                onChange={(e) => {
                  setMonthlyContribution(Math.max(0, Number(e.target.value)));
                  setSelectedPreset('custom');
                }}
                className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-subtle-border text-sm num-font font-bold focus:outline-none focus:ring-2 focus:ring-income"
              />
            </div>
            <span className="text-[11px] text-brand-muted font-mono mt-1 block">
              약 {formatCurrency(monthlyContribution * exchangeRate, 'KRW')} / 월
            </span>
          </div>

          {/* 초기 시가배당률 */}
          <div>
            <label className="text-xs font-bold text-brand-primary block mb-1">
              초기 시가배당률 (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="25"
                step="0.1"
                value={dividendYield}
                onChange={(e) => {
                  setDividendYield(Math.max(0, Number(e.target.value)));
                  setSelectedPreset('custom');
                }}
                className="w-full pl-3 pr-7 py-2 bg-white rounded-xl border border-subtle-border text-sm num-font font-bold focus:outline-none focus:ring-2 focus:ring-income"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-brand-muted">
                %
              </span>
            </div>
          </div>

          {/* 연간 배당성장률 */}
          <div>
            <label className="text-xs font-bold text-brand-primary block mb-1">
              연간 배당성장률 (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="30"
                step="0.5"
                value={dividendGrowthRate}
                onChange={(e) => {
                  setDividendGrowthRate(Math.max(0, Number(e.target.value)));
                  setSelectedPreset('custom');
                }}
                className="w-full pl-3 pr-7 py-2 bg-white rounded-xl border border-subtle-border text-sm num-font font-bold focus:outline-none focus:ring-2 focus:ring-income"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-brand-muted">
                %
              </span>
            </div>
          </div>
        </div>

        {/* 투자 기간 슬라이더 (1~30년) */}
        <div className="pt-4 border-t border-subtle-border space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-brand-primary flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-income" />
              투자 기간 설정 (복리 가속 기간)
            </span>
            <span className="num-font text-base font-black text-income">
              {years}년 ({years * 12}개월 복리)
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-brand-primary cursor-pointer"
          />

          <div className="flex justify-between text-[11px] font-mono text-brand-muted">
            <span>1년</span>
            <span>10년</span>
            <span>20년 (은퇴 표준)</span>
            <span>30년 (스노우볼 극대화)</span>
          </div>
        </div>
      </div>

      {/* 4. 중앙 3대 핵심 성과 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 최종 예상 총 자산 (DRIP vs Non-DRIP) */}
        <div className="bg-gradient-to-br from-brand-primary to-brand-dark text-white rounded-2xl p-6 shadow-card space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>{years}년 후 DRIP 최종 자산</span>
            <span className="px-2 py-0.5 rounded-full bg-income text-white text-[10px] font-bold">
              스노우볼 완성
            </span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black num-font text-white">
              {formatCurrency(result.dripEndingValue, 'USD')}
            </div>
            <p className="text-xs text-white/80 num-font mt-0.5">
              약 {formatCurrency(result.dripEndingValue * exchangeRate, 'KRW')}
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 text-xs text-income-light font-bold flex items-center justify-between">
            <span>현금인출 대비 보너스</span>
            <span className="num-font text-sm">
              +{formatCurrency(result.snowballAdvantageAmount, 'USD')} (+{result.snowballAdvantagePercent.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* 은퇴 시점 연간/월간 배당금 */}
        <div className="bg-white rounded-2xl p-6 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>{years}년 후 월 실수령 배당금</span>
            <span className="px-2 py-0.5 rounded-full bg-income-light text-income text-[10px] font-bold">
              매월 연금 소득
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold num-font text-income">
              {formatCurrency(result.dripEndingMonthlyNetDividend * exchangeRate, 'KRW')}
            </div>
            <p className="text-xs text-brand-muted num-font mt-0.5">
              월 {formatCurrency(result.dripEndingMonthlyNetDividend, 'USD')} (연{' '}
              {formatCurrency(result.dripEndingAnnualNetDividend, 'USD')})
            </p>
          </div>
          <div className="pt-2 border-t border-subtle-border text-[11px] text-brand-muted flex items-center justify-between">
            <span>원금 대비 배당률 (YoC)</span>
            <strong className="num-font text-income text-sm">
              {formatPercent(result.dripYieldOnCost)}
            </strong>
          </div>
        </div>

        {/* 총 불어난 주식 수 */}
        <div className="bg-white rounded-2xl p-6 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>최종 보유 주식 수</span>
            <span className="px-2 py-0.5 rounded-full bg-brand-secondary text-brand-primary text-[10px] font-bold">
              주식 복리 증식
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold num-font text-brand-primary">
              {formatNumber(result.dripEndingShares, 0)}주
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              초기({formatNumber(result.dripInitialShares, 0)}주) 대비{' '}
              <strong className="text-income font-bold">
                약 {result.dripShareMultiplier}배 증가
              </strong>
            </p>
          </div>
          <div className="pt-2 border-t border-subtle-border text-[11px] text-brand-muted flex items-center justify-between">
            <span>순수 재투자 매수 주식</span>
            <strong className="num-font text-brand-primary text-sm">
              +{formatNumber(result.snowballExtraShares, 0)}주
            </strong>
          </div>
        </div>
      </div>

      {/* 5. 하단 Recharts 3중 비교 차트 (원금 vs 단순인출 vs DRIP) */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-income" />
              배당 재투자(DRIP) vs 현금 인출 자산 격차 곡선
            </h3>
            <p className="text-xs text-brand-muted">
              시간이 흐를수록 단순 인출선과 DRIP 복리선 사이의 간격(스노우볼 격차)이 기하급수적으로 벌어집니다.
            </p>
          </div>
        </div>

        <div className="w-full h-80 sm:h-96 bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={result.chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dripSnowballGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="yearLabel"
                  tickLine={false}
                  stroke="#78716c"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  stroke="#78716c"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    `$${Number(value ?? 0).toLocaleString()}`,
                    '',
                  ]}
                  labelFormatter={(label) => `경과 시점: ${label}`}
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
                  name="누적 납입 원금"
                  stroke="#a8a29e"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                {/* 2. 현금 인출 시 총자산 (슬레이트 블루) */}
                <Line
                  type="monotone"
                  dataKey="nonDripTotalValue"
                  name="단순 인출 시 (주식+누적배당)"
                  stroke="#4b5563"
                  strokeWidth={2}
                  dot={false}
                />
                {/* 3. DRIP 재투자 시 자산 (포레스트 그린 굵은 실선 + 면적) */}
                <Area
                  type="monotone"
                  dataKey="dripValue"
                  name="DRIP 재투자 복리 자산"
                  stroke="#2d6a4f"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#dripSnowballGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-brand-muted">
              차트 로딩 중...
            </div>
          )}
        </div>

        {/* 6. 하단 복리 격차 꿀팁 박스 */}
        <div className="p-4 rounded-2xl bg-brand-bg border border-subtle-border flex items-start gap-3 text-xs text-brand-muted">
          <Info className="w-4 h-4 text-income mt-0.5 flex-shrink-0" />
          <div className="leading-relaxed">
            <span className="font-semibold text-brand-primary">스노우볼(Snowball) 효과의 핵심: </span>
            투자 초기 3~5년은 재투자와 단순 인출의 차이가 미미해 보이지만, 10년이 넘어가는 순간 재투자된 배당금으로 산 주식이 또 배당을 낳으면서 자산 곡선이 수직으로 상승합니다. 은퇴 전까지는 무조건 배당 재투자(DRIP)를 켜두는 것이 자산 증식의 지름길입니다.
          </div>
        </div>

        {/* E-E-A-T 정적 해설 가이드 섹션 */}
        <DripSimulatorGuide />
      </div>
    </div>
  );
}
