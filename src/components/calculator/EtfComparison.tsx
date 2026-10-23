'use client';

import React, { useState, useMemo } from 'react';
import {
  Scale,
  Crown,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRightLeft,
  Coins,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  COMPARISON_ETFS,
  compareEtfs,
  calculateCrossoverBattle,
} from '@/lib/calculator/etf-comparison';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import EtfComparisonGuide from './guides/EtfComparisonGuide';

export default function EtfComparison() {
  const [tickerA, setTickerA] = useState<string>('SCHD');
  const [tickerB, setTickerB] = useState<string>('JEPI');
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [initialCapital, setInitialCapital] = useState<number>(50000000); // 기본 5,000만 원
  const exchangeRate = 1350;

  // 빠른 비교 추천 프리셋 (17종 확장 반영)
  const battlePresets = [
    { label: 'SCHD vs JEPI', a: 'SCHD', b: 'JEPI', desc: '배당성장 vs 고인컴 월배당' },
    { label: 'VOO vs SCHD', a: 'VOO', b: 'SCHD', desc: '시장지수 성장 vs 배당성장' },
    { label: 'JEPI vs SPYI', a: 'JEPI', b: 'SPYI', desc: '7%대 vs 11%대 커버드콜' },
    { label: 'SCHD vs DGRO', a: 'SCHD', b: 'DGRO', desc: '배당성장 양대 산맥' },
    { label: 'O vs TLT', a: 'O', b: 'TLT', desc: '월배당 리츠 vs 월배당 미국채' },
  ];

  // 퀵 투자금액 버튼
  const quickCapitalsKRW = [
    { label: '1천만 원', value: 10000000 },
    { label: '3천만 원', value: 30000000 },
    { label: '5천만 원', value: 50000000 },
    { label: '1억 원', value: 100000000 },
  ];

  const quickCapitalsUSD = [
    { label: '$10,000', value: 10000 },
    { label: '$30,000', value: 30000 },
    { label: '$50,000', value: 50000 },
    { label: '$100,000', value: 100000 },
  ];

  // 두 종목 스왑(교체) 핸들러
  const handleSwap = () => {
    setTickerA(tickerB);
    setTickerB(tickerA);
  };

  // 통화 전환 핸들러
  const handleCurrencyChange = (newCurrency: 'KRW' | 'USD') => {
    if (newCurrency === currency) return;
    if (newCurrency === 'USD') {
      const usd = Math.round(initialCapital / exchangeRate);
      setInitialCapital(usd > 0 ? usd : 30000);
    } else {
      const krw = Math.round(initialCapital * exchangeRate);
      setInitialCapital(krw > 0 ? krw : 50000000);
    }
    setCurrency(newCurrency);
  };

  // 비교 지표 연산
  const comparison = useMemo(() => {
    return compareEtfs(tickerA, tickerB);
  }, [tickerA, tickerB]);

  // 골든크로스 및 초기 배당금 연산
  const crossoverBattle = useMemo(() => {
    return calculateCrossoverBattle(tickerA, tickerB, initialCapital, currency, exchangeRate);
  }, [tickerA, tickerB, initialCapital, currency, exchangeRate]);

  const { etfA, etfB, metrics, scoreA, scoreB, finalWinner } = comparison;
  const etfKeys = Object.keys(COMPARISON_ETFS);

  // 차트 툴팁 커스텀
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string | number;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-dark/95 backdrop-blur-md text-white p-3.5 rounded-xl border border-white/10 shadow-xl text-xs space-y-1.5">
          <p className="font-bold text-income-light border-b border-white/10 pb-1">
            {label}년차 배당 비교 (원금 기준)
          </p>
          <div className="flex justify-between gap-4">
            <span className="text-white/80">{etfA.ticker}:</span>
            <span className="font-mono font-bold text-income">
              {formatCurrency(payload[0]?.value ?? 0, 'KRW')} / 년
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/80">{etfB.ticker}:</span>
            <span className="font-mono font-bold text-amber-400">
              {formatCurrency(payload[1]?.value ?? 0, 'KRW')} / 년
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 프리셋 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5 text-income" />
            <span>기능 2: 1:1 Head-to-Head & 골든크로스</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            ETF 1:1 맞짱 비교기
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            두 종목을 선택하고 투자금을 입력하면, <strong className="text-brand-primary">초기 월배당금</strong>과 배당성장으로 인한 <strong className="text-income">역전 시점(골든크로스)</strong>을 정밀 시뮬레이션합니다.
          </p>
        </div>

        {/* 종목 맞바꾸기 버튼 */}
        <button
          type="button"
          onClick={handleSwap}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-bg hover:bg-brand-secondary border border-subtle-border text-xs font-bold text-brand-primary transition-all self-start sm:self-auto shadow-2xs"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-income" />
          <span>종목 자리 바꾸기</span>
        </button>
      </div>

      {/* 추천 프리셋 배틀 칩 */}
      <div>
        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2">
          🔥 자주 비교하는 인기 라이벌 매치
        </span>
        <div className="flex flex-wrap gap-2">
          {battlePresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setTickerA(preset.a);
                setTickerB(preset.b);
              }}
              className={`px-3 py-2 rounded-xl text-xs border text-left transition-all ${
                (tickerA === preset.a && tickerB === preset.b) ||
                (tickerA === preset.b && tickerB === preset.a)
                  ? 'bg-brand-primary text-white border-brand-primary font-bold shadow-sm'
                  : 'bg-white border-subtle-border text-brand-primary hover:bg-brand-bg'
              }`}
            >
              <span className="font-extrabold mr-1.5">{preset.label}</span>
              <span className="opacity-75 text-[11px]">({preset.desc})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. 대결 헤더 카드 (종목 A vs 종목 B 대진표 셀렉터) */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* 종목 A 카드 */}
        <div
          className={`md:col-span-5 p-6 rounded-3xl border transition-all relative ${
            finalWinner === 'A'
              ? 'bg-gradient-to-b from-income-light/40 to-white border-income shadow-card ring-2 ring-income/20'
              : 'bg-brand-bg border-subtle-border'
          }`}
        >
          {finalWinner === 'A' && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-income text-white text-xs font-bold shadow-xs">
              <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>종합 우세 ({scoreA}승)</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="w-full">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block mb-1">
                선수 1 (Player A)
              </label>
              <select
                value={tickerA}
                onChange={(e) => setTickerA(e.target.value)}
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-subtle-border font-extrabold text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
              >
                {etfKeys.map((key) => {
                  const itm = COMPARISON_ETFS[key];
                  return (
                    <option key={key} value={key} disabled={key === tickerB}>
                      {key} - {itm.nameKo || itm.name} ({itm.category})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black tracking-tight text-brand-primary">
                  {etfA.ticker}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-brand-secondary text-brand-primary font-medium">
                  {etfA.category}
                </span>
              </div>
              <p className="text-xs text-brand-muted mt-1 truncate">
                {etfA.nameKo ? `${etfA.nameKo} (${etfA.name})` : etfA.name}
              </p>
            </div>

            <div className="pt-3 border-t border-subtle-border flex items-center justify-between">
              <div>
                <span className="text-[11px] text-brand-muted block">현재가</span>
                <span className="text-lg font-bold num-font text-brand-primary">
                  ${etfA.currentPrice.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-brand-muted block">시가배당률</span>
                <span className="text-lg font-bold num-font text-income">
                  {(etfA.dividendYield * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 중앙 VS 배지 */}
        <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0">
          <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-black text-sm tracking-wider shadow-md border-4 border-white">
            VS
          </div>
        </div>

        {/* 종목 B 카드 */}
        <div
          className={`md:col-span-5 p-6 rounded-3xl border transition-all relative ${
            finalWinner === 'B'
              ? 'bg-gradient-to-b from-income-light/40 to-white border-income shadow-card ring-2 ring-income/20'
              : 'bg-brand-bg border-subtle-border'
          }`}
        >
          {finalWinner === 'B' && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-income text-white text-xs font-bold shadow-xs">
              <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>종합 우세 ({scoreB}승)</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="w-full">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block mb-1">
                선수 2 (Player B)
              </label>
              <select
                value={tickerB}
                onChange={(e) => setTickerB(e.target.value)}
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-subtle-border font-extrabold text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
              >
                {etfKeys.map((key) => {
                  const itm = COMPARISON_ETFS[key];
                  return (
                    <option key={key} value={key} disabled={key === tickerA}>
                      {key} - {itm.nameKo || itm.name} ({itm.category})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black tracking-tight text-brand-primary">
                  {etfB.ticker}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-brand-secondary text-brand-primary font-medium">
                  {etfB.category}
                </span>
              </div>
              <p className="text-xs text-brand-muted mt-1 truncate">
                {etfB.nameKo ? `${etfB.nameKo} (${etfB.name})` : etfB.name}
              </p>
            </div>

            <div className="pt-3 border-t border-subtle-border flex items-center justify-between">
              <div>
                <span className="text-[11px] text-brand-muted block">현재가</span>
                <span className="text-lg font-bold num-font text-brand-primary">
                  ${etfB.currentPrice.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-brand-muted block">시가배당률</span>
                <span className="text-lg font-bold num-font text-income">
                  {(etfB.dividendYield * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-1. 초기 투자금 설정 & 초기 월배당금 맞짱 비교 (요구사항 4) */}
      <div className="bg-brand-bg rounded-3xl p-6 sm:p-8 border border-subtle-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-brand-primary flex items-center gap-2">
              <Coins className="w-5 h-5 text-income" />
              초기 투자금 설정 및 1년차 월배당금 비교
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              동일한 자본금을 투자했을 때 매월 통장에 꽂히는 초기 세후 월 실수령액을 대조합니다.
            </p>
          </div>

          {/* 통화 토글 */}
          <div className="inline-flex p-1 bg-white rounded-xl border border-subtle-border self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleCurrencyChange('KRW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === 'KRW'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              원화 (₩)
            </button>
            <button
              type="button"
              onClick={() => handleCurrencyChange('USD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              달러 ($)
            </button>
          </div>
        </div>

        {/* 투자금 입력창 & 퀵 버튼 */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-muted font-bold text-lg">
              {currency === 'KRW' ? '₩' : '$'}
            </div>
            <input
              type="number"
              min={1000}
              step={currency === 'KRW' ? 10000000 : 5000}
              value={initialCapital}
              onChange={(e) => setInitialCapital(Math.max(0, Number(e.target.value)))}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-subtle-border text-xl font-bold num-font focus:outline-none focus:ring-2 focus:ring-income"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(currency === 'KRW' ? quickCapitalsKRW : quickCapitalsUSD).map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setInitialCapital(item.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  initialCapital === item.value
                    ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                    : 'bg-white border-subtle-border text-brand-muted hover:bg-brand-bg hover:text-brand-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1년차 월배당금 비교 듀얼 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-subtle-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-brand-primary">{etfA.ticker} 1년차 월 배당금</span>
              <span className="text-brand-muted">{etfA.frequencyLabel}</span>
            </div>
            <div className="text-2xl font-black num-font text-income">
              {formatCurrency(crossoverBattle.initialMonthlyNetKRW_A, 'KRW')}
              <span className="text-xs font-normal text-brand-muted ml-1.5">/ 월</span>
            </div>
            <p className="text-xs text-brand-muted pt-1 border-t border-subtle-border/60">
              연간 세후: ${formatNumber(crossoverBattle.initialAnnualNetUSD_A)} (배당률 {formatPercent(etfA.dividendYield)})
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-subtle-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-brand-primary">{etfB.ticker} 1년차 월 배당금</span>
              <span className="text-brand-muted">{etfB.frequencyLabel}</span>
            </div>
            <div className="text-2xl font-black num-font text-amber-600">
              {formatCurrency(crossoverBattle.initialMonthlyNetKRW_B, 'KRW')}
              <span className="text-xs font-normal text-brand-muted ml-1.5">/ 월</span>
            </div>
            <p className="text-xs text-brand-muted pt-1 border-t border-subtle-border/60">
              연간 세후: ${formatNumber(crossoverBattle.initialAnnualNetUSD_B)} (배당률 {formatPercent(etfB.dividendYield)})
            </p>
          </div>
        </div>

        {/* 골든크로스(역전 시점) 하이라이트 배너 */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-secondary to-income-light/30 border border-income/30 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-income" />
            <h4 className="text-sm font-extrabold text-brand-primary">
              배당성장 골든크로스(역전) 분석 결과
            </h4>
          </div>
          <p className="text-sm text-brand-primary font-medium leading-relaxed">
            {crossoverBattle.crossoverSummaryText}
          </p>
          {crossoverBattle.crossoverYear && (
            <div className="pt-2 flex items-center gap-3 text-xs text-brand-muted font-mono">
              <span>📅 역전 예상 시점: <strong>{crossoverBattle.crossoverYear}년차</strong></span>
              <span>•</span>
              <span>
                15년차 연 배당금: {etfA.ticker} ₩{formatNumber(crossoverBattle.yearlyProjections[14].dividendAnnualKRW_A)} vs {etfB.ticker} ₩{formatNumber(crossoverBattle.yearlyProjections[14].dividendAnnualKRW_B)}
              </span>
            </div>
          )}
        </div>

        {/* 15개년 배당금 성장 추이 Recharts 시각화 차트 */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-income" />
              1~15년차 연간 세후 배당금 성장 추이 곡선 (골든크로스 시뮬레이션)
            </span>
            <span className="text-[11px] text-brand-muted">단위: 원화 (₩/년)</span>
          </div>

          <div className="h-64 sm:h-72 w-full bg-white p-4 rounded-2xl border border-subtle-border">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={crossoverBattle.yearlyProjections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tickFormatter={(v) => `${v}년`} tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `${(v / 10000).toLocaleString()}만`}
                  tick={{ fontSize: 11 }}
                  width={65}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 6 }}
                  formatter={(value) => (value === 'dividendAnnualKRW_A' ? etfA.ticker : etfB.ticker)}
                />
                <Line
                  type="monotone"
                  dataKey="dividendAnnualKRW_A"
                  name="dividendAnnualKRW_A"
                  stroke="#2d6a4f"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="dividendAnnualKRW_B"
                  name="dividendAnnualKRW_B"
                  stroke="#d97706"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. 중앙 지표 대조 테이블 */}
      <div className="overflow-hidden rounded-2xl border border-subtle-border shadow-xs">
        <div className="bg-brand-primary text-white px-6 py-3.5 flex items-center justify-between text-xs font-bold">
          <span>비교 핵심 지표</span>
          <div className="flex gap-16 pr-4">
            <span className="w-24 text-right">{etfA.ticker}</span>
            <span className="w-24 text-right">{etfB.ticker}</span>
          </div>
        </div>

        <div className="divide-y divide-subtle-border bg-white text-sm">
          {Object.entries(metrics).map(([key, item]) => {
            const isWinnerA = item.winner === 'A';
            const isWinnerB = item.winner === 'B';

            return (
              <div
                key={key}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-brand-bg/50 transition-colors"
              >
                <div className="max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-primary">{item.label}</span>
                    {item.isExpense && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-secondary text-brand-primary">
                        낮을수록 유리
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted mt-0.5">{item.description}</p>
                </div>

                {/* 지표 수치 대조 */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12 pt-2 sm:pt-0">
                  {/* A 수치 */}
                  <div className="w-32 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isWinnerA && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black bg-income-light text-income">
                          <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          WIN
                        </span>
                      )}
                      <span
                        className={`num-font text-base font-extrabold ${
                          isWinnerA ? 'text-income' : 'text-brand-muted'
                        }`}
                      >
                        {item.formattedA}
                      </span>
                    </div>
                  </div>

                  {/* 구분 바 */}
                  <div className="text-brand-muted/30 font-light">|</div>

                  {/* B 수치 */}
                  <div className="w-32 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isWinnerB && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black bg-income-light text-income">
                          <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          WIN
                        </span>
                      )}
                      <span
                        className={`num-font text-base font-extrabold ${
                          isWinnerB ? 'text-income' : 'text-brand-muted'
                        }`}
                      >
                        {item.formattedB}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 하단: 맞춤 투자 성향 가이드 듀얼 카드 */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-income" />
          <h3 className="text-lg font-bold text-brand-primary">
            전문가 투자 성향별 맞춤 가이드
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 종목 A 가이드 카드 */}
          <div className="bg-brand-bg rounded-2xl p-6 border border-subtle-border space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-brand-primary text-white">
                  {etfA.ticker} 선택 가이드
                </span>
                <span className="text-xs text-brand-muted font-medium">
                  {etfA.targetAudience}
                </span>
              </div>

              <p className="text-sm font-semibold text-brand-primary leading-relaxed bg-white p-3.5 rounded-xl border border-subtle-border/60">
                &ldquo;{etfA.summaryGuide}&rdquo;
              </p>

              {/* 핵심 장점 */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-brand-muted block">핵심 강점:</span>
                {etfA.pros.map((pro, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-brand-primary">
                    <Check className="w-3.5 h-3.5 text-income flex-shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 주의점 */}
            <div className="pt-3 border-t border-subtle-border/80">
              <span className="text-xs font-bold text-alert block mb-1">투자 시 유의점:</span>
              {etfA.cons.map((con, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-brand-muted">
                  <AlertCircle className="w-3.5 h-3.5 text-alert flex-shrink-0 mt-0.5" />
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 종목 B 가이드 카드 */}
          <div className="bg-brand-bg rounded-2xl p-6 border border-subtle-border space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-brand-primary text-white">
                  {etfB.ticker} 선택 가이드
                </span>
                <span className="text-xs text-brand-muted font-medium">
                  {etfB.targetAudience}
                </span>
              </div>

              <p className="text-sm font-semibold text-brand-primary leading-relaxed bg-white p-3.5 rounded-xl border border-subtle-border/60">
                &ldquo;{etfB.summaryGuide}&rdquo;
              </p>

              {/* 핵심 장점 */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-brand-muted block">핵심 강점:</span>
                {etfB.pros.map((pro, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-brand-primary">
                    <Check className="w-3.5 h-3.5 text-income flex-shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 주의점 */}
            <div className="pt-3 border-t border-subtle-border/80">
              <span className="text-xs font-bold text-alert block mb-1">투자 시 유의점:</span>
              {etfB.cons.map((con, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-brand-muted">
                  <AlertCircle className="w-3.5 h-3.5 text-alert flex-shrink-0 mt-0.5" />
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* E-E-A-T 정적 해설 가이드 섹션 */}
        <EtfComparisonGuide />
      </div>
    </div>
  );
}
