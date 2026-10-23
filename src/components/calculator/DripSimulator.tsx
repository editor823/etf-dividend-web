'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Repeat,
  Clock,
  TrendingUp,
  Coins,
  Zap,
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
} from '@/lib/calculator/drip-simulator';
import { ETF_LIST, ETF_MAP } from '@/data/etfList';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import DripSimulatorGuide from './guides/DripSimulatorGuide';

export default function DripSimulator() {
  const [selectedTicker, setSelectedTicker] = useState<string>('SCHD');
  const [initialInvestment, setInitialInvestment] = useState<number>(10000000); // 초기 1,000만 원
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500000); // 매월 50만 원
  const [years, setYears] = useState<number>(10); // 기본 10년
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [dripMode, setDripMode] = useState<'on' | 'off'>('on'); // DRIP ON/OFF 토글
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const exchangeRate = 1350;

  // 퀵 초기 투자금 버튼
  const quickInitialKRW = [
    { label: '500만 원', value: 5000000 },
    { label: '1,000만 원', value: 10000000 },
    { label: '3,000만 원', value: 30000000 },
    { label: '5,000만 원', value: 50000000 },
  ];

  const quickInitialUSD = [
    { label: '$5,000', value: 5000 },
    { label: '$10,000', value: 10000 },
    { label: '$25,000', value: 25000 },
    { label: '$40,000', value: 40000 },
  ];

  // 퀵 매월 적립금 버튼
  const quickMonthlyKRW = [
    { label: '0원 (거치식)', value: 0 },
    { label: '30만 원', value: 300000 },
    { label: '50만 원', value: 500000 },
    { label: '100만 원', value: 1000000 },
    { label: '200만 원', value: 2000000 },
  ];

  // 퀵 투자 기간 버튼
  const quickYears = [5, 10, 15, 20, 30];

  // 통화 전환 핸들러
  const handleCurrencyChange = (newCurrency: 'KRW' | 'USD') => {
    if (newCurrency === currency) return;
    if (newCurrency === 'USD') {
      setInitialInvestment(Math.round(initialInvestment / exchangeRate));
      setMonthlyContribution(Math.round(monthlyContribution / exchangeRate));
    } else {
      setInitialInvestment(Math.round(initialInvestment * exchangeRate));
      setMonthlyContribution(Math.round(monthlyContribution * exchangeRate));
    }
    setCurrency(newCurrency);
  };

  // 시뮬레이션 연산
  const result = useMemo(() => {
    return simulateDripSnowball({
      ticker: selectedTicker,
      initialInvestment,
      monthlyContribution,
      years,
      currency,
      exchangeRate,
    });
  }, [selectedTicker, initialInvestment, monthlyContribution, years, currency, exchangeRate]);

  const currentEtf = ETF_MAP[selectedTicker] || ETF_MAP['SCHD'];

  // 차트 커스텀 툴팁
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; name?: string }>;
    label?: string | number;
  }) => {
    if (active && payload && payload.length) {
      const dripVal = Number(payload[0]?.value ?? 0);
      const nonDripVal = Number(payload[1]?.value ?? 0);
      const advantage = dripVal - nonDripVal;

      return (
        <div className="bg-brand-primary text-white p-3.5 rounded-2xl border border-white/10 shadow-xl text-xs space-y-2">
          <p className="font-extrabold text-amber-300 border-b border-white/10 pb-1">
            {label} 시점 누적 자산 평가
          </p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-white/80">🟢 DRIP 재투자 자산:</span>
              <span className="font-mono font-bold text-income-light">
                {formatCurrency(dripVal, 'KRW')}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/80">⚪ 단순 인출 시 자산:</span>
              <span className="font-mono font-bold text-gray-300">
                {formatCurrency(nonDripVal, 'KRW')}
              </span>
            </div>
            <div className="pt-1 border-t border-white/10 flex justify-between gap-4 text-amber-300 font-bold">
              <span>⚡ 스노우볼 초과 자산:</span>
              <span className="font-mono">+{formatCurrency(advantage, 'KRW')}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 설명 & 통화 토글 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <Repeat className="w-3.5 h-3.5 text-income" />
            <span>기능 5: DRIP 배당 재투자 복리 스노우볼</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            DRIP 복리 시뮬레이터 (배당 재투자 스노우볼)
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            배당금을 현금으로 꺼내 쓰지 않고 전액 주식으로 재매수(DRIP)했을 때, 주식이 스스로 주식을 낳으며
            자산이 기하급수적으로 증식하는 <strong className="text-income">복리 스노우볼 효과</strong>를 시각화합니다.
          </p>
        </div>

        {/* 통화 토글 버튼 */}
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

      {/* 2. 대상 ETF 선택기 & 4대 인기 프리셋 버튼 */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">
          🌟 대상 ETF 선택 및 인기 모델 프리셋
        </span>

        {/* 4대 원클릭 프리셋 버튼: [SCHD] [JEPI] [VOO] [SPYI] */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {DRIP_PRESETS.map((p) => {
            const isSelected = selectedTicker === p.ticker;
            return (
              <button
                key={p.ticker}
                type="button"
                onClick={() => setSelectedTicker(p.ticker)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-brand-primary bg-brand-primary text-white shadow-md ring-2 ring-income/30 scale-101'
                    : 'border-subtle-border bg-white text-brand-primary hover:border-brand-muted/40 hover:bg-brand-bg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black">{p.ticker}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-brand-secondary text-brand-primary'
                      }`}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-mono font-bold mb-1 ${
                      isSelected ? 'text-amber-200' : 'text-income'
                    }`}
                  >
                    배당 {(p.dividendYield * 100).toFixed(2)}% · 성장 {(p.dividendGrowthRate * 100).toFixed(1)}%
                  </div>
                  <p
                    className={`text-[11px] leading-tight truncate ${
                      isSelected ? 'text-white/80' : 'text-brand-muted'
                    }`}
                  >
                    {p.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 20개 ETF 전체 드롭다운 선택기 */}
        <div className="bg-brand-bg p-3.5 rounded-2xl border border-subtle-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-primary">직접 다른 ETF 선택:</span>
            <select
              value={selectedTicker}
              onChange={(e) => setSelectedTicker(e.target.value)}
              className="px-3 py-1.5 bg-white rounded-xl border border-subtle-border text-xs sm:text-sm font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income cursor-pointer"
            >
              {ETF_LIST.map((item) => (
                <option key={item.ticker} value={item.ticker}>
                  {item.ticker} - {item.name} (배당 {formatPercent(item.dividendYield)}, {item.category})
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-brand-muted font-mono">
            현재가: ${currentEtf.currentPriceUSD.toFixed(2)} • 배당률:{' '}
            <strong className="text-income">{formatPercent(currentEtf.dividendYield)}</strong> • 배당성장률: +
            {(currentEtf.fiveYearGrowth * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 3. 투자 플랜 설정 인풋 (초기 투자금, 매월 적립금, 기간, DRIP On/Off) */}
      <div className="p-6 sm:p-8 bg-brand-bg rounded-3xl border border-subtle-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base sm:text-lg font-extrabold text-brand-primary flex items-center gap-2">
            <Coins className="w-5 h-5 text-income" />
            투자 플랜 및 DRIP 재투자 모드 설정
          </h3>

          {/* 핵심 토글: [DRIP ON (전액 재투자)] vs [DRIP OFF (현금 인출)] */}
          <div className="inline-flex p-1 bg-white rounded-2xl border border-subtle-border shadow-2xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setDripMode('on')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                dripMode === 'on'
                  ? 'bg-income text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>배당금 전액 재투자 (DRIP ON)</span>
            </button>
            <button
              type="button"
              onClick={() => setDripMode('off')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                dripMode === 'off'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              <span>배당금 현금 인출 (DRIP OFF)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1) 초기 투자금 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-primary block">
              초기 투자금 ({currency === 'KRW' ? '₩' : '$'})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-brand-muted">
                {currency === 'KRW' ? '₩' : '$'}
              </span>
              <input
                type="number"
                min="0"
                step={currency === 'KRW' ? 5000000 : 1000}
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-3 py-2.5 bg-white rounded-xl border border-subtle-border text-base num-font font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income shadow-2xs"
              />
            </div>
            {/* 퀵 초기금 버튼 */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(currency === 'KRW' ? quickInitialKRW : quickInitialUSD).map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setInitialInvestment(item.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    initialInvestment === item.value
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white border-subtle-border text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2) 매월 추가 적립금 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-brand-primary">
                매월 추가 적립금 ({currency === 'KRW' ? '₩' : '$'})
              </label>
              <span className="font-black num-font text-income">
                {currency === 'KRW'
                  ? formatCurrency(monthlyContribution, 'KRW')
                  : formatCurrency(monthlyContribution, 'USD')}
                /월
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={currency === 'KRW' ? 3000000 : 2500}
              step={currency === 'KRW' ? 100000 : 50}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full accent-income h-2 bg-white rounded-lg cursor-pointer"
            />
            {/* 퀵 적립금 버튼 */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickMonthlyKRW.map((item) => {
                const val = currency === 'KRW' ? item.value : Math.round(item.value / exchangeRate);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setMonthlyContribution(val)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      monthlyContribution === val
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white border-subtle-border text-brand-muted hover:text-brand-primary'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3) 투자 시뮬레이션 기간 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-brand-primary flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-income" />
                투자 기간 설정
              </label>
              <span className="font-black num-font text-income text-sm">
                {years}년 ({years * 12}개월 복리)
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="30"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-income h-2 bg-white rounded-lg cursor-pointer"
            />
            {/* 퀵 기간 버튼 */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickYears.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setYears(yr)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    years === yr
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white border-subtle-border text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  {yr}년
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. 핵심 복리 성과 지표 4단 카드 (Metrics Cards 4종) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1) DRIP 적용 시 최종 총자산 */}
        <div
          className={`rounded-2xl p-5 shadow-card space-y-1.5 transition-all ${
            dripMode === 'on'
              ? 'bg-gradient-to-br from-brand-primary to-brand-dark text-white ring-2 ring-income/40'
              : 'bg-white border border-subtle-border'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className={dripMode === 'on' ? 'text-white/80' : 'text-brand-muted'}>
              DRIP 재투자 최종 총자산
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                dripMode === 'on' ? 'bg-income text-white' : 'bg-brand-secondary text-brand-primary'
              }`}
            >
              스노우볼 완성
            </span>
          </div>
          <div
            className={`text-2xl sm:text-3xl font-black num-font ${
              dripMode === 'on' ? 'text-white' : 'text-brand-primary'
            }`}
          >
            {formatCurrency(result.dripEndingValueKRW, 'KRW')}
          </div>
          <p className={`text-[11px] ${dripMode === 'on' ? 'text-white/80' : 'text-brand-muted'}`}>
            총 납입원금 {formatCurrency(result.totalPrincipalKRW, 'KRW')} 대비{' '}
            <strong className="text-income font-bold">
              +{((result.dripTotalReturnRate) * 100).toFixed(0)}% 복리 성장
            </strong>
          </p>
        </div>

        {/* 2) DRIP 미적용(인출) 대비 초과 자산 */}
        <div className="bg-gradient-to-br from-income-light/50 to-white rounded-2xl p-5 border-2 border-income/30 shadow-card space-y-1.5">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span className="font-bold text-brand-primary">배당 재투자 초과 이익</span>
            <span className="px-2 py-0.5 rounded-full bg-income text-white text-[10px] font-bold">
              DRIP 보너스
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black num-font text-income">
            +{formatCurrency(result.snowballAdvantageKRW, 'KRW')}
          </div>
          <p className="text-[11px] text-brand-muted leading-tight">
            배당 재투자만으로{' '}
            <strong className="text-income font-bold">
              +{formatCurrency(result.snowballAdvantageKRW, 'KRW')} (+{result.snowballAdvantagePercent.toFixed(1)}%)
            </strong>{' '}
            더 모았습니다.
          </p>
        </div>

        {/* 3) 최종 연도 월 세후 배당금 */}
        <div className="bg-white rounded-2xl p-5 border border-subtle-border shadow-card space-y-1.5">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>{years}년 뒤 월 세후 배당금</span>
            <span className="px-2 py-0.5 rounded-full bg-income-light text-income text-[10px] font-bold">
              매월 연금소득
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black num-font text-brand-primary">
            {formatCurrency(result.dripEndingMonthlyNetDividendKRW, 'KRW')}
          </div>
          <p className="text-[11px] text-brand-muted">
            {years}년 뒤 매달 통장에 꽂히는 실수령액 (연간{' '}
            {formatCurrency(result.dripEndingAnnualNetDividendKRW, 'KRW')})
          </p>
        </div>

        {/* 4) 총 보유 주수 증가량 */}
        <div className="bg-brand-bg rounded-2xl p-5 border border-subtle-border shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>총 보유 주수 증가량</span>
            <span className="text-[10px] font-bold text-brand-primary">주식 복리</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black num-font text-brand-primary">
            {formatNumber(result.dripEndingShares, 0)}주
          </div>
          <p className="text-[11px] text-brand-muted">
            초기 {formatNumber(result.dripInitialShares, 0)}주 ➔ 복리로 불어난 최종{' '}
            {formatNumber(result.dripEndingShares, 0)}주 (배당으로만{' '}
            <strong className="text-income font-bold">
              +{formatNumber(result.snowballExtraShares, 0)}주 무상 취득
            </strong>
            )
          </p>
        </div>
      </div>

      {/* 5. 실전 복리 인사이트 코멘트 (티핑 포인트 & 15% 세율 반영) */}
      <div className="space-y-3">
        {/* 티핑 포인트 배너 */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-income/15 border-2 border-amber-400/40 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Zap className="w-4 h-4 fill-amber-200 text-amber-200" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-amber-900 tracking-wider">
                Compounding Tipping Point
              </span>
              <h4 className="text-base font-black text-brand-primary">
                배당 눈덩이 자립(티핑 포인트) 시점 분석
              </h4>
            </div>
          </div>

          <p className="text-sm sm:text-base font-extrabold text-brand-primary leading-relaxed bg-white/80 p-3.5 rounded-xl border border-amber-300/60 shadow-2xs">
            💡 {result.tippingPoint.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-brand-primary">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300/70">
              세율 반영 검증
            </span>
            <span className="text-brand-muted">
              미국 배당소득세 15% 원천징수가 자동 차감된 순수 세후 실수령액으로 주식을 재매수하도록 정밀 설계되었습니다.
            </span>
          </div>
        </div>
      </div>

      {/* 6. 스노우볼 곡선 시각화 차트 (Recharts AreaChart) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-brand-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-income" />
              1~{years}년차 배당 재투자(DRIP) vs 단순 인출 자산 격차 곡선
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              시간이 지날수록 초록색 선(DRIP)과 회색 점선 사이의 간격(연한 초록색 음영)이 기하급수적으로 벌어집니다.
            </p>
          </div>
          <span className="text-[11px] text-brand-muted font-mono self-start sm:self-auto">
            단위: 원화 (₩)
          </span>
        </div>

        <div className="w-full h-80 sm:h-96 bg-white rounded-3xl p-4 sm:p-6 border border-subtle-border shadow-2xs">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={result.chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dripSnowballGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
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
                  tickFormatter={(val) => `${Math.round(val / 100000000)}억`}
                  width={65}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
                {/* 1. 투자 원금 (연한 점선) */}
                <Line
                  type="monotone"
                  dataKey="principalKRW"
                  name="누적 납입 원금"
                  stroke="#a8a29e"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                {/* 2. 단순 인출 시 총자산 (회색 실선) */}
                <Line
                  type="monotone"
                  dataKey="nonDripTotalValueKRW"
                  name="단순 인출 시 (주식+누적배당)"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                />
                {/* 3. DRIP 재투자 시 자산 (초록색 굵은 실선 + 면적) */}
                <Area
                  type="monotone"
                  dataKey="dripValueKRW"
                  name="DRIP 재투자 복리 자산"
                  stroke="#2d6a4f"
                  strokeWidth={3.5}
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

        {/* 10년/20년 경과 시점 최종 요약 대조 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-5 rounded-2xl bg-income-light/40 border border-income/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-income">🟢 DRIP 재투자 모드 ({years}년 후)</span>
              <span className="font-mono text-brand-muted">스노우볼 가속</span>
            </div>
            <div className="text-2xl font-black num-font text-brand-primary">
              {formatCurrency(result.dripEndingValueKRW, 'KRW')}
            </div>
            <div className="text-xs text-brand-muted flex justify-between border-t border-subtle-border/60 pt-1.5">
              <span>{years}년 뒤 월 실수령액:</span>
              <strong className="text-income font-bold">
                {formatCurrency(result.dripEndingMonthlyNetDividendKRW, 'KRW')} / 월
              </strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-brand-bg border border-subtle-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-brand-muted">⚪ 단순 인출 모드 ({years}년 후)</span>
              <span className="font-mono text-brand-muted">선형 증가</span>
            </div>
            <div className="text-2xl font-black num-font text-brand-primary">
              {formatCurrency(result.nonDripEndingTotalValueKRW, 'KRW')}
            </div>
            <div className="text-xs text-brand-muted flex justify-between border-t border-subtle-border/60 pt-1.5">
              <span>{years}년 뒤 월 실수령액:</span>
              <strong className="text-brand-primary font-bold">
                {formatCurrency(result.nonDripEndingMonthlyNetDividendKRW, 'KRW')} / 월
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 7. E-E-A-T 정적 해설 가이드 섹션 */}
      <DripSimulatorGuide />
    </div>
  );
}
