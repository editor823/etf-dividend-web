'use client';

import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Shield,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  Percent,
  Wallet,
  Calendar,
  Layers,
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
  calculateBarbellPortfolio,
  BARBELL_PRESETS,
} from '@/lib/calculator/barbell-optimizer';
import { ETF_MAP } from '@/data/etfList';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import BarbellOptimizerGuide from './guides/BarbellOptimizerGuide';

export default function BarbellOptimizer() {
  const [growthTicker, setGrowthTicker] = useState<string>('VOO');
  const [incomeTicker, setIncomeTicker] = useState<string>('JEPI');
  const [growthWeight, setGrowthWeight] = useState<number>(50); // 기본 50:50
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [totalCapital, setTotalCapital] = useState<number>(50000000); // 기본 5,000만 원
  const [chartMode, setChartMode] = useState<'wealth' | 'dividend'>('wealth'); // 차트 보기 모드
  const [isReverseMode, setIsReverseMode] = useState<boolean>(false);
  const [targetMonthlyDividend, setTargetMonthlyDividend] = useState<number>(1000000); // 역산 목표 100만 원

  const exchangeRate = 1350;

  // 1. 성장 / 시장지수 / 배당성장 후보군 (20개 마스터 DB 기반)
  const growthCandidates = [
    'VOO',
    'QQQ',
    'SCHD',
    'SCHG',
    'DGRO',
    'VIG',
    'DIA',
    'NOBL',
    'VYM',
    'HDV',
  ];

  // 2. 고배당 커버드콜 / 월배당 인컴 후보군
  const incomeCandidates = [
    'JEPI',
    'JEPQ',
    'SPYI',
    'QQQI',
    'DIVO',
    'O',
    'MAIN',
    'VNQ',
    'TLT',
    'SGOV',
  ];

  // 퀵 투자 자본금 버튼
  const quickCapitalsKRW = [
    { label: '3천만 원', value: 30000000 },
    { label: '5천만 원', value: 50000000 },
    { label: '1억 원', value: 100000000 },
    { label: '3억 원', value: 300000000 },
  ];

  const quickCapitalsUSD = [
    { label: '$25,000', value: 25000 },
    { label: '$40,000', value: 40000 },
    { label: '$75,000', value: 75000 },
    { label: '$200,000', value: 200000 },
  ];

  // 통화 전환 핸들러
  const handleCurrencyChange = (newCurrency: 'KRW' | 'USD') => {
    if (newCurrency === currency) return;
    if (newCurrency === 'USD') {
      setTotalCapital(Math.round(totalCapital / exchangeRate));
      setTargetMonthlyDividend(Math.round(targetMonthlyDividend / exchangeRate));
    } else {
      setTotalCapital(Math.round(totalCapital * exchangeRate));
      setTargetMonthlyDividend(Math.round(targetMonthlyDividend * exchangeRate));
    }
    setCurrency(newCurrency);
  };

  // 포트폴리오 연산
  const result = useMemo(() => {
    return calculateBarbellPortfolio({
      growthTicker,
      incomeTicker,
      growthWeight,
      totalCapital,
      currency,
      exchangeRate,
      targetMonthlyDividend: isReverseMode ? targetMonthlyDividend : undefined,
    });
  }, [
    growthTicker,
    incomeTicker,
    growthWeight,
    totalCapital,
    currency,
    exchangeRate,
    isReverseMode,
    targetMonthlyDividend,
  ]);

  const incomeWeight = 100 - growthWeight;
  const growthEtf = ETF_MAP[growthTicker] || ETF_MAP['VOO'];
  const incomeEtf = ETF_MAP[incomeTicker] || ETF_MAP['JEPI'];

  // 프리셋 적용 핸들러
  const applyPreset = (preset: (typeof BARBELL_PRESETS)[0]) => {
    setGrowthTicker(preset.growthTicker);
    setIncomeTicker(preset.incomeTicker);
    setGrowthWeight(preset.growthWeight);
  };

  // 차트 커스텀 툴팁
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; name?: string; stroke?: string }>;
    label?: string | number;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-primary text-white p-3.5 rounded-2xl border border-white/10 shadow-xl text-xs space-y-2">
          <p className="font-extrabold text-amber-300 border-b border-white/10 pb-1">
            {label}년차 {chartMode === 'wealth' ? '예상 총자산' : '월 세후 배당금'}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-white/80">
                🟢 바벨({growthTicker} {growthWeight}% : {incomeTicker} {incomeWeight}%):
              </span>
              <span className="font-mono font-bold text-income-light">
                {formatCurrency(payload[0]?.value ?? 0, 'KRW')}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/80">🔵 100% {growthTicker} 단독:</span>
              <span className="font-mono font-bold text-sky-300">
                {formatCurrency(payload[1]?.value ?? 0, 'KRW')}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/80">🟠 100% {incomeTicker} 단독:</span>
              <span className="font-mono font-bold text-amber-300">
                {formatCurrency(payload[2]?.value ?? 0, 'KRW')}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 통화 선택 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <PieChart className="w-3.5 h-3.5 text-income" />
            <span>기능 4: 맞춤형 바벨 포트폴리오 최적화기</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            바벨 포트폴리오 (Barbell Portfolio)
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            <strong className="text-brand-primary">성장 자산(지수/배당성장)</strong>과{' '}
            <strong className="text-income">고배당 인컴 자산(월배당 커버드콜)</strong>의 비중을
            슬라이더로 조절하여, 최적의 현금흐름과 자본 성장의 균형을 찾습니다.
          </p>
        </div>

        {/* 통화 선택 토글 */}
        <div className="inline-flex p-1 bg-brand-bg rounded-xl border border-subtle-border self-start sm:self-auto shadow-2xs">
          <button
            type="button"
            onClick={() => handleCurrencyChange('KRW')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currency === 'USD'
                ? 'bg-brand-primary text-white shadow-xs'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            달러 ($)
          </button>
        </div>
      </div>

      {/* 2. 원클릭 인기 바벨 프리셋 버튼 */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">
          🎯 원클릭 인기 바벨 전략 프리셋 선택
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BARBELL_PRESETS.map((preset) => {
            const isSelected =
              growthTicker === preset.growthTicker &&
              incomeTicker === preset.incomeTicker &&
              growthWeight === preset.growthWeight;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-brand-primary bg-brand-primary text-white shadow-md ring-2 ring-income/30 scale-101'
                    : 'border-subtle-border bg-white text-brand-primary hover:border-brand-muted/40 hover:bg-brand-bg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold">{preset.subtitle}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-brand-secondary text-brand-primary'
                      }`}
                    >
                      {preset.badge}
                    </span>
                  </div>
                  <div className="text-sm font-bold num-font mb-1.5">{preset.title}</div>
                  <p
                    className={`text-xs leading-relaxed ${
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

      {/* 3. 종목 선택 및 양방향 비중 슬라이더 조절 패널 */}
      <div className="p-6 sm:p-8 bg-brand-bg rounded-3xl border border-subtle-border space-y-6">
        {/* 양날개 듀얼 종목 선택기 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 좌측: 성장/지수 축 종목 선택 */}
          <div className="bg-white p-5 rounded-2xl border border-subtle-border space-y-2 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary inline-block" />
                성장 / 시장지수 / 배당성장 축
              </span>
              <span className="text-xs text-income font-bold num-font">
                시가배당률 {formatPercent(growthEtf.dividendYield)}
              </span>
            </div>
            <select
              value={growthTicker}
              onChange={(e) => setGrowthTicker(e.target.value)}
              className="w-full px-3 py-2.5 bg-brand-bg rounded-xl border border-subtle-border text-sm font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income cursor-pointer"
            >
              {growthCandidates.map((ticker) => {
                const item = ETF_MAP[ticker];
                return (
                  <option key={ticker} value={ticker}>
                    {ticker} - {item.name} ({formatPercent(item.dividendYield)})
                  </option>
                );
              })}
            </select>
            <p className="text-[11px] text-brand-muted truncate">{growthEtf.summary}</p>
          </div>

          {/* 우측: 고배당 커버드콜 / 월배당 인컴 종목 선택 */}
          <div className="bg-white p-5 rounded-2xl border border-subtle-border space-y-2 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-income flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-income inline-block" />
                고배당 커버드콜 / 월배당 인컴 축
              </span>
              <span className="text-xs text-income font-bold num-font">
                시가배당률 {formatPercent(incomeEtf.dividendYield)}
              </span>
            </div>
            <select
              value={incomeTicker}
              onChange={(e) => setIncomeTicker(e.target.value)}
              className="w-full px-3 py-2.5 bg-brand-bg rounded-xl border border-subtle-border text-sm font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income cursor-pointer"
            >
              {incomeCandidates.map((ticker) => {
                const item = ETF_MAP[ticker];
                return (
                  <option key={ticker} value={ticker}>
                    {ticker} - {item.name} ({formatPercent(item.dividendYield)})
                  </option>
                );
              })}
            </select>
            <p className="text-[11px] text-brand-muted truncate">{incomeEtf.summary}</p>
          </div>
        </div>

        {/* 대형 양방향 비중 슬라이더 & 듀얼 컬러 게이지 바 */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-brand-primary inline-block" />
              <span className="font-black text-brand-primary text-lg">
                {growthTicker} {growthWeight}%
              </span>
              <span className="text-xs text-brand-muted">
                ({currency === 'KRW'
                  ? formatCurrency(result.holdings.growth.allocatedCapitalKRW, 'KRW')
                  : formatCurrency(result.holdings.growth.allocatedCapitalUSD, 'USD')})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-muted">
                ({currency === 'KRW'
                  ? formatCurrency(result.holdings.income.allocatedCapitalKRW, 'KRW')
                  : formatCurrency(result.holdings.income.allocatedCapitalUSD, 'USD')})
              </span>
              <span className="font-black text-income text-lg">
                {incomeTicker} {incomeWeight}%
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-income inline-block" />
            </div>
          </div>

          {/* 듀얼 컬러 비중 바 */}
          <div className="w-full h-5 rounded-full overflow-hidden flex bg-subtle-border shadow-inner border border-subtle-border">
            <div
              className="bg-brand-primary transition-all duration-150 flex items-center justify-center text-[10px] text-white font-bold"
              style={{ width: `${growthWeight}%` }}
            >
              {growthWeight >= 15 ? `${growthWeight}%` : ''}
            </div>
            <div
              className="bg-income transition-all duration-150 flex items-center justify-center text-[10px] text-white font-bold"
              style={{ width: `${incomeWeight}%` }}
            >
              {incomeWeight >= 15 ? `${incomeWeight}%` : ''}
            </div>
          </div>

          {/* 슬라이더 조작 인풋 */}
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={growthWeight}
            onChange={(e) => setGrowthWeight(Number(e.target.value))}
            className="w-full accent-income h-2.5 bg-white rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] font-mono text-brand-muted">
            <button
              type="button"
              onClick={() => setGrowthWeight(0)}
              className="hover:text-brand-primary cursor-pointer"
            >
              0% (100% 인컴)
            </button>
            <button
              type="button"
              onClick={() => setGrowthWeight(30)}
              className="hover:text-brand-primary cursor-pointer"
            >
              30% (인컴 집중)
            </button>
            <button
              type="button"
              onClick={() => setGrowthWeight(50)}
              className="hover:text-brand-primary font-bold text-brand-primary cursor-pointer"
            >
              50% (황금 밸런스)
            </button>
            <button
              type="button"
              onClick={() => setGrowthWeight(70)}
              className="hover:text-brand-primary cursor-pointer"
            >
              70% (성장 집중)
            </button>
            <button
              type="button"
              onClick={() => setGrowthWeight(100)}
              className="hover:text-brand-primary cursor-pointer"
            >
              100% (100% 성장)
            </button>
          </div>
        </div>

        {/* 총 투자 자본금 입력 패널 & 퀵 버튼 */}
        <div className="pt-4 border-t border-subtle-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="w-full sm:w-80">
              <label className="text-xs font-bold text-brand-primary block mb-1">
                총 투자금 입력 ({currency === 'KRW' ? '₩' : '$'})
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-brand-muted">
                  {currency === 'KRW' ? '₩' : '$'}
                </span>
                <input
                  type="number"
                  min="0"
                  step={currency === 'KRW' ? 10000000 : 5000}
                  value={totalCapital}
                  onChange={(e) => setTotalCapital(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2.5 bg-white rounded-xl border border-subtle-border text-base num-font font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income shadow-2xs"
                />
              </div>
            </div>

            {/* 역산 모드 토글 */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-subtle-border self-start sm:self-auto shadow-2xs">
              <RotateCcw className="w-4 h-4 text-income" />
              <div className="text-xs">
                <span className="font-bold text-brand-primary block">목표 월 배당 역산 모드</span>
                <span className="text-[11px] text-brand-muted">이 비중으로 월 N원 받으려면?</span>
              </div>
              <button
                type="button"
                onClick={() => setIsReverseMode(!isReverseMode)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isReverseMode ? 'bg-income justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>
          </div>

          {/* 퀵 투자금 버튼 */}
          <div className="flex flex-wrap gap-2">
            {(currency === 'KRW' ? quickCapitalsKRW : quickCapitalsUSD).map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setTotalCapital(item.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  totalCapital === item.value
                    ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                    : 'bg-white border-subtle-border text-brand-muted hover:bg-brand-bg hover:text-brand-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 역산 모드 활성화 시 목표 월배당금 인풋 */}
        {isReverseMode && (
          <div className="p-4 bg-income-light/50 rounded-2xl border border-income/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-brand-primary block">
                희망하는 매월 세후 실수령 배당금
              </span>
              <span className="text-[11px] text-brand-muted">
                15% 배당세 차감 후 순수 통장에 입금되는 월 실수령액 기준
              </span>
            </div>
            <div className="relative w-full sm:w-60">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-income">
                {currency === 'KRW' ? '₩' : '$'}
              </span>
              <input
                type="number"
                min="0"
                step={currency === 'KRW' ? 100000 : 100}
                value={targetMonthlyDividend}
                onChange={(e) => setTargetMonthlyDividend(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-income text-sm num-font font-bold text-income focus:outline-none focus:ring-2 focus:ring-income"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. 바벨 핵심 지표 결과 4단 카드 (Tremor Financial Metrics Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1) 합성 시가배당률 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border border-l-4 border-l-income shadow-card hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-muted flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-income" />
              합성 시가배당률
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-income-light text-income text-[11px] font-bold">
              연간 세전
            </span>
          </div>
          <div className="text-3xl font-black num-font tracking-tight text-income">
            {formatPercent(result.combinedDividendYield)}
          </div>
          <p className="text-[11px] text-brand-muted truncate">
            {growthTicker}({(growthEtf.dividendYield * 100).toFixed(1)}%) + {incomeTicker}(
            {(incomeEtf.dividendYield * 100).toFixed(1)}%) 가중평균
          </p>
        </div>

        {/* 2) 예상 월 세후 실수령액 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border border-l-4 border-l-emerald-600 shadow-card hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-muted flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              예상 월 세후 실수령액
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
              15.4% 원천징수
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black num-font tracking-tight text-brand-primary">
            {currency === 'KRW'
              ? formatCurrency(result.monthlyNetDividendKRW, 'KRW')
              : formatCurrency(result.monthlyNetDividendUSD, 'USD')}
          </div>
          <p className="text-[11px] text-brand-muted">매월 계좌에 입금되는 순 배당소득</p>
        </div>

        {/* 3) 연간 총 세후 배당금 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border border-l-4 border-l-blue-600 shadow-card hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              연간 총 세후 배당금
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
              1년 누적
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black num-font tracking-tight text-brand-primary">
            {currency === 'KRW'
              ? formatCurrency(result.annualNetDividendKRW, 'KRW')
              : formatCurrency(result.annualNetDividendUSD, 'USD')}
          </div>
          <p className="text-[11px] text-brand-muted">
            세전 총액: {formatCurrency(result.annualGrossDividendKRW, 'KRW')}
          </p>
        </div>

        {/* 4) 종목별 필요 매수 주수 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border border-l-4 border-l-amber-500 shadow-card hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-muted flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              종목별 필요 매수 주수
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
              현재가 기준
            </span>
          </div>
          <div className="text-sm font-black text-brand-primary space-y-1 pt-0.5">
            <div className="flex justify-between items-center bg-brand-bg px-2.5 py-1 rounded-lg">
              <span className="text-xs text-brand-muted font-bold">{growthTicker}</span>
              <span className="num-font text-brand-primary font-black">
                {formatNumber(result.holdings.growth.sharesToBuy)}주
              </span>
            </div>
            <div className="flex justify-between items-center bg-income-light/40 px-2.5 py-1 rounded-lg text-income">
              <span className="text-xs font-bold">{incomeTicker}</span>
              <span className="num-font font-black">
                {formatNumber(result.holdings.income.sharesToBuy)}주
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 바벨 성향 판정 코멘트 & 종합과세 경고 배너 */}
      <div className="space-y-3">
        {/* 성향 판정 카드 */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-secondary/60 to-income-light/30 border border-subtle-border space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-primary text-white text-xs font-black">
              {result.personality.badge}
            </span>
            <span className="text-xs font-bold text-brand-primary">
              {result.personality.headline}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-primary leading-relaxed">
            {result.personality.comment}
          </p>
        </div>

        {/* 금융소득종합과세 주의 배지 (연간 세전 배당금 2,000만 원 초과 시) */}
        {result.isTaxWarning && (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3 shadow-2xs animate-in fade-in duration-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-extrabold text-sm block text-amber-950">
                ⚠️ 연간 세전 배당금 2,000만 원 초과 (금융소득종합과세 대상 주의)
              </span>
              <p className="leading-relaxed">
                현재 바벨 포트폴리오의 연간 세전 배당금은 약{' '}
                <strong>{formatCurrency(result.annualGrossDividendKRW, 'KRW')}</strong>로, 연간
                2,000만 원 기준을 초과합니다. 근로/사업 소득과 합산 과세될 수 있으므로 일반 계좌 외에{' '}
                <strong>ISA(개인종합자산관리계좌)</strong> 및{' '}
                <strong>연금저축/IRP 등 절세 계좌</strong>를 우선 활용하여 포트폴리오를 분산하는 것을
                강력히 권장합니다.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 6. 10년 복리 시뮬레이션 미니 차트 & 인사이트 시각화 */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-brand-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-income" />
              10년 복리 시뮬레이션: 바벨 vs 단독 100% 비교
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              단독 100% 몰빵 투자 대비 바벨 포트폴리오 조합이 가져다주는 현금흐름과 총자산 성장의
              시너지를 시각화합니다.
            </p>
          </div>

          {/* 차트 모드 토글 (총 자산 vs 월 배당금) */}
          <div className="inline-flex p-1 bg-brand-bg rounded-xl border border-subtle-border self-start sm:self-auto shadow-2xs">
            <button
              type="button"
              onClick={() => setChartMode('wealth')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartMode === 'wealth'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              10년 후 예상 총자산 (평가액+배당)
            </button>
            <button
              type="button"
              onClick={() => setChartMode('dividend')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartMode === 'dividend'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              연도별 월 세후 배당금 성장
            </button>
          </div>
        </div>

        {/* Recharts 시각화 라인 차트 */}
        <div className="h-72 sm:h-80 w-full bg-white p-4 rounded-3xl border border-subtle-border shadow-2xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.projections10y}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tickFormatter={(v) => `${v}년`} tick={{ fontSize: 11 }} />
              <YAxis
                tickFormatter={(v) => `${Math.round(v / 10000).toLocaleString()}만`}
                tick={{ fontSize: 11 }}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 6 }}
                formatter={(val) => {
                  if (val.includes('barbell'))
                    return `바벨(${growthTicker} ${growthWeight}% : ${incomeTicker} ${incomeWeight}%)`;
                  if (val.includes('growth')) return `100% ${growthTicker} 단독`;
                  return `100% ${incomeTicker} 단독`;
                }}
              />
              {chartMode === 'wealth' ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="barbellTotalWealthKRW"
                    name="barbellTotalWealthKRW"
                    stroke="#2d6a4f"
                    strokeWidth={3.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="growthOnlyTotalWealthKRW"
                    name="growthOnlyTotalWealthKRW"
                    stroke="#1e3a8a"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="incomeOnlyTotalWealthKRW"
                    name="incomeOnlyTotalWealthKRW"
                    stroke="#d97706"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                  />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="barbellMonthlyNetDivKRW"
                    name="barbellMonthlyNetDivKRW"
                    stroke="#2d6a4f"
                    strokeWidth={3.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="growthOnlyMonthlyDivKRW"
                    name="growthOnlyMonthlyDivKRW"
                    stroke="#1e3a8a"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="incomeOnlyMonthlyDivKRW"
                    name="incomeOnlyMonthlyDivKRW"
                    stroke="#d97706"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 10년 후 3대 조합 결과 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-income-light/60 to-white border border-income/30 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-income block">
              🟢 바벨 포트폴리오 (10년 후)
            </span>
            <div className="text-xl font-black num-font text-brand-primary">
              {formatCurrency(result.insights10y.year10BarbellWealthKRW, 'KRW')}
            </div>
            <p className="text-xs text-brand-muted">
              10년차 월 배당금:{' '}
              <strong className="text-income">
                {formatCurrency(result.insights10y.year10BarbellMonthlyDivKRW, 'KRW')}
              </strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-sky-800 block">
              🔵 100% {growthTicker} 단독 (10년 후)
            </span>
            <div className="text-xl font-black num-font text-brand-primary">
              {formatCurrency(result.insights10y.year10GrowthOnlyWealthKRW, 'KRW')}
            </div>
            <p className="text-xs text-brand-muted">
              10년차 월 배당금:{' '}
              <strong className="text-brand-primary">
                {formatCurrency(result.insights10y.year10GrowthOnlyMonthlyDivKRW, 'KRW')}
              </strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-800 block">
              🟠 100% {incomeTicker} 단독 (10년 후)
            </span>
            <div className="text-xl font-black num-font text-brand-primary">
              {formatCurrency(result.insights10y.year10IncomeOnlyWealthKRW, 'KRW')}
            </div>
            <p className="text-xs text-brand-muted">
              10년차 월 배당금:{' '}
              <strong className="text-brand-primary">
                {formatCurrency(result.insights10y.year10IncomeOnlyMonthlyDivKRW, 'KRW')}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* 7. 역산 모드 결과 카드 (활성화 시 표시) */}
      {isReverseMode && result.reverseCalculation && (
        <div className="p-6 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-3xl shadow-elevated space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-mono text-income-light font-bold">
              Reverse Calculation Result (목표 월배당 역산 결과)
            </span>
            <span className="text-xs text-white/80">
              목표 월 배당:{' '}
              {currency === 'KRW'
                ? formatCurrency(result.reverseCalculation.targetMonthlyNetKRW, 'KRW')
                : formatCurrency(result.reverseCalculation.targetMonthlyNetUSD, 'USD')}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <span className="text-xs text-white/70 block">필요 총 투자 원금</span>
              <div className="text-2xl sm:text-3xl font-black num-font">
                {currency === 'KRW'
                  ? formatCurrency(result.reverseCalculation.requiredTotalCapitalKRW, 'KRW')
                  : formatCurrency(result.reverseCalculation.requiredTotalCapitalUSD, 'USD')}
              </div>
            </div>
            <div className="p-3.5 bg-white/10 rounded-xl border border-white/10">
              <span className="text-[11px] text-white/70 block">필요 {growthTicker} 주식 수</span>
              <span className="text-lg font-bold num-font text-white">
                {formatNumber(result.reverseCalculation.requiredGrowthShares)}주
              </span>
            </div>
            <div className="p-3.5 bg-white/10 rounded-xl border border-white/10">
              <span className="text-[11px] text-white/70 block">
                필요 {incomeTicker} 주식 수
              </span>
              <span className="text-lg font-bold num-font text-income-light">
                {formatNumber(result.reverseCalculation.requiredIncomeShares)}주
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 8. 종목별 포트폴리오 세부 배분 명세 듀얼 카드 */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
          <Shield className="w-5 h-5 text-income" />
          종목별 포트폴리오 세부 배분 명세
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 성장 자산 카드 */}
          <div className="bg-brand-bg rounded-2xl p-6 border border-subtle-border space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-brand-primary">{growthTicker}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-primary text-white font-bold">
                    비중 {result.growthWeight}%
                  </span>
                </div>
                <p className="text-xs text-brand-muted mt-0.5 truncate">
                  {result.holdings.growth.name}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-brand-muted block">현재가</span>
                <span className="text-sm font-bold num-font text-brand-primary">
                  ${result.holdings.growth.currentPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-subtle-border/80 text-xs text-brand-muted">
              {result.holdings.growth.role}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-subtle-border/80">
                <span className="text-brand-muted block mb-0.5">배분 투자금</span>
                <strong className="num-font text-brand-primary text-sm">
                  {currency === 'KRW'
                    ? formatCurrency(result.holdings.growth.allocatedCapitalKRW, 'KRW')
                    : formatCurrency(result.holdings.growth.allocatedCapitalUSD, 'USD')}
                </strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-subtle-border/80">
                <span className="text-brand-muted block mb-0.5">권장 매수 주수</span>
                <strong className="num-font text-brand-primary text-sm">
                  {formatNumber(result.holdings.growth.sharesToBuy)}주
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-subtle-border flex items-center justify-between text-xs">
              <span className="text-brand-muted">월 실수령 배당금</span>
              <strong className="num-font text-income text-sm">
                {currency === 'KRW'
                  ? formatCurrency(result.holdings.growth.monthlyNetDividendKRW, 'KRW')
                  : formatCurrency(result.holdings.growth.monthlyNetDividendUSD, 'USD')}
              </strong>
            </div>
          </div>

          {/* 고인컴 자산 카드 */}
          <div className="bg-brand-bg rounded-2xl p-6 border border-subtle-border space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-income">{incomeTicker}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-income text-white font-bold">
                    비중 {result.incomeWeight}%
                  </span>
                </div>
                <p className="text-xs text-brand-muted mt-0.5 truncate">
                  {result.holdings.income.name}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-brand-muted block">현재가</span>
                <span className="text-sm font-bold num-font text-brand-primary">
                  ${result.holdings.income.currentPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-subtle-border/80 text-xs text-brand-muted">
              {result.holdings.income.role}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-subtle-border/80">
                <span className="text-brand-muted block mb-0.5">배분 투자금</span>
                <strong className="num-font text-brand-primary text-sm">
                  {currency === 'KRW'
                    ? formatCurrency(result.holdings.income.allocatedCapitalKRW, 'KRW')
                    : formatCurrency(result.holdings.income.allocatedCapitalUSD, 'USD')}
                </strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-subtle-border/80">
                <span className="text-brand-muted block mb-0.5">권장 매수 주수</span>
                <strong className="num-font text-brand-primary text-sm">
                  {formatNumber(result.holdings.income.sharesToBuy)}주
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-subtle-border flex items-center justify-between text-xs">
              <span className="text-brand-muted">월 실수령 배당금</span>
              <strong className="num-font text-income text-sm">
                {currency === 'KRW'
                  ? formatCurrency(result.holdings.income.monthlyNetDividendKRW, 'KRW')
                  : formatCurrency(result.holdings.income.monthlyNetDividendUSD, 'USD')}
              </strong>
            </div>
          </div>
        </div>

        {/* E-E-A-T 정적 해설 가이드 섹션 */}
        <BarbellOptimizerGuide />
      </div>
    </div>
  );
}
