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
  Trophy,
  Layers,
  Clock,
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
  compareEtfs,
  calculateCrossoverBattle,
} from '@/lib/calculator/etf-comparison';
import { ETF_LIST } from '@/data/etfList';
import { formatCurrency, formatPercent } from '@/lib/utils';
import EtfComparisonGuide from './guides/EtfComparisonGuide';

export default function EtfComparison() {
  const [tickerA, setTickerA] = useState<string>('JEPI');
  const [tickerB, setTickerB] = useState<string>('SCHD');
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [initialCapital, setInitialCapital] = useState<number>(10000000); // 기본값: 1,000만 원
  const [investmentYears, setInvestmentYears] = useState<number>(15); // 기본값: 15년
  const exchangeRate = 1350;

  // 1:1 맞짱 추천 프리셋 버튼
  const battlePresets = [
    { label: 'JEPI vs SCHD', a: 'JEPI', b: 'SCHD', desc: '당장 고배당 vs 복리 배당성장' },
    { label: 'VOO vs SCHD', a: 'VOO', b: 'SCHD', desc: '시장 지수 vs 배당성장' },
    { label: 'JEPQ vs QQQI', a: 'JEPQ', b: 'QQQI', desc: '나스닥 커버드콜 대결' },
    { label: 'SCHD vs DGRO', a: 'SCHD', b: 'DGRO', desc: '배당성장 양대 산맥' },
    { label: 'O vs TLT', a: 'O', b: 'TLT', desc: '월배당 리츠 vs 미국 장기국채' },
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

  // 퀵 투자 기간 버튼
  const quickYears = [5, 10, 15, 20];

  // 두 종목 자리 바꾸기(Swap)
  const handleSwap = () => {
    const temp = tickerA;
    setTickerA(tickerB);
    setTickerB(temp);
  };

  // 통화 전환 핸들러
  const handleCurrencyChange = (newCurrency: 'KRW' | 'USD') => {
    if (newCurrency === currency) return;
    if (newCurrency === 'USD') {
      const usd = Math.round(initialCapital / exchangeRate);
      setInitialCapital(usd > 0 ? usd : 10000);
    } else {
      const krw = Math.round(initialCapital * exchangeRate);
      setInitialCapital(krw > 0 ? krw : 10000000);
    }
    setCurrency(newCurrency);
  };

  // 지표 비교 연산
  const comparison = useMemo(() => {
    return compareEtfs(tickerA, tickerB);
  }, [tickerA, tickerB]);

  // 골든크로스 & 기간 시뮬레이션 연산
  const crossoverBattle = useMemo(() => {
    return calculateCrossoverBattle(
      tickerA,
      tickerB,
      initialCapital,
      investmentYears,
      currency,
      exchangeRate
    );
  }, [tickerA, tickerB, initialCapital, investmentYears, currency, exchangeRate]);

  const { etfA, etfB, metrics, scoreA, scoreB, finalWinner } = comparison;

  // 카테고리별로 그룹화된 20개 ETF 목록
  const categorizedEtfs = useMemo(() => {
    const groups: Record<string, typeof ETF_LIST> = {};
    ETF_LIST.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, []);

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
      return (
        <div className="bg-brand-primary text-white p-3.5 rounded-xl border border-white/10 shadow-xl text-xs space-y-2">
          <p className="font-extrabold text-amber-300 border-b border-white/10 pb-1">
            {label}년차 배당 및 자산 비교
          </p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-white/80">{etfA.ticker} 연 배당:</span>
              <span className="font-mono font-bold text-income-light">
                {formatCurrency(payload[0]?.value ?? 0, 'KRW')} / 년
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/80">{etfB.ticker} 연 배당:</span>
              <span className="font-mono font-bold text-amber-300">
                {formatCurrency(payload[1]?.value ?? 0, 'KRW')} / 년
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
      {/* 1. 상단 타이틀 & 소개 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5 text-income" />
            <span>기능 2: ETF 1:1 맞짱 비교 & 골든크로스 시뮬레이터</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            ETF 1:1 맞짱 비교기
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            20개 주요 미국 ETF 중 2개를 맞붙여 <strong className="text-brand-primary">초기 배당금 차이</strong>와{' '}
            <strong className="text-income">골든크로스(배당 역전 시점)</strong>, 그리고{' '}
            <strong className="text-brand-primary">10년 장기 총수익</strong>을 정밀 시뮬레이션합니다.
          </p>
        </div>

        {/* 종목 맞바꾸기 버튼 */}
        <button
          type="button"
          onClick={handleSwap}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-secondary/70 hover:bg-brand-secondary border border-subtle-border text-xs font-bold text-brand-primary transition-all self-start sm:self-auto shadow-2xs cursor-pointer active:scale-95"
          title="종목 A와 B의 위치를 서로 맞바꿉니다"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-income" />
          <span>종목 자리 바꾸기</span>
        </button>
      </div>

      {/* 2. 빠른 비교 추천 프리셋 뱃지 바 */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">
          🔥 자주 비교하는 인기 라이벌 매치
        </span>
        <div className="flex flex-wrap gap-2">
          {battlePresets.map((preset) => {
            const isMatch =
              (tickerA === preset.a && tickerB === preset.b) ||
              (tickerA === preset.b && tickerB === preset.a);
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setTickerA(preset.a);
                  setTickerB(preset.b);
                }}
                className={`px-3 py-2 rounded-xl text-xs border text-left transition-all cursor-pointer ${
                  isMatch
                    ? 'bg-brand-primary text-white border-brand-primary font-bold shadow-xs ring-2 ring-income/30'
                    : 'bg-white border-subtle-border text-brand-primary hover:bg-brand-bg hover:border-brand-primary/30'
                }`}
              >
                <span className="font-extrabold mr-1.5">{preset.label}</span>
                <span className={`text-[11px] ${isMatch ? 'text-white/80' : 'text-brand-muted'}`}>
                  ({preset.desc})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 대진표 셀렉터 슬롯 (A vs B) */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* 종목 A 슬롯 카드 */}
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
            <div>
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block mb-1">
                종목 A 선택 (Player A)
              </label>
              <select
                value={tickerA}
                onChange={(e) => setTickerA(e.target.value)}
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-subtle-border font-extrabold text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-income cursor-pointer shadow-2xs"
              >
                {Object.entries(categorizedEtfs).map(([cat, list]) => (
                  <optgroup key={cat} label={`-- ${cat} --`}>
                    {list.map((item) => (
                      <option key={item.ticker} value={item.ticker} disabled={item.ticker === tickerB}>
                        {item.ticker} - {item.name} ({formatPercent(item.dividendYield)})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black tracking-tight text-brand-primary">
                  {etfA.ticker}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-secondary text-brand-primary font-bold">
                  {etfA.category}
                </span>
                <span className="text-xs text-brand-muted font-mono">{etfA.frequencyLabel}</span>
              </div>
              <p className="text-xs text-brand-muted mt-1 truncate">
                {etfA.nameKo || etfA.name}
              </p>
            </div>

            <div className="pt-3 border-t border-subtle-border grid grid-cols-3 gap-2 text-center sm:text-left">
              <div>
                <span className="text-[10px] text-brand-muted block">현재가</span>
                <span className="text-sm sm:text-base font-bold num-font text-brand-primary">
                  ${etfA.currentPrice.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-brand-muted block">시가배당률</span>
                <span className="text-sm sm:text-base font-bold num-font text-income">
                  {(etfA.dividendYield * 100).toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-brand-muted block">5년 배당성장</span>
                <span className="text-sm sm:text-base font-bold num-font text-brand-primary">
                  {etfA.dividendGrowth5y ? `+${(etfA.dividendGrowth5y * 100).toFixed(1)}%` : '0.0%'}
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

        {/* 종목 B 슬롯 카드 */}
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
            <div>
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block mb-1">
                종목 B 선택 (Player B)
              </label>
              <select
                value={tickerB}
                onChange={(e) => setTickerB(e.target.value)}
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-subtle-border font-extrabold text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-income cursor-pointer shadow-2xs"
              >
                {Object.entries(categorizedEtfs).map(([cat, list]) => (
                  <optgroup key={cat} label={`-- ${cat} --`}>
                    {list.map((item) => (
                      <option key={item.ticker} value={item.ticker} disabled={item.ticker === tickerA}>
                        {item.ticker} - {item.name} ({formatPercent(item.dividendYield)})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black tracking-tight text-brand-primary">
                  {etfB.ticker}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-secondary text-brand-primary font-bold">
                  {etfB.category}
                </span>
                <span className="text-xs text-brand-muted font-mono">{etfB.frequencyLabel}</span>
              </div>
              <p className="text-xs text-brand-muted mt-1 truncate">
                {etfB.nameKo || etfB.name}
              </p>
            </div>

            <div className="pt-3 border-t border-subtle-border grid grid-cols-3 gap-2 text-center sm:text-left">
              <div>
                <span className="text-[10px] text-brand-muted block">현재가</span>
                <span className="text-sm sm:text-base font-bold num-font text-brand-primary">
                  ${etfB.currentPrice.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-brand-muted block">시가배당률</span>
                <span className="text-sm sm:text-base font-bold num-font text-income">
                  {(etfB.dividendYield * 100).toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-brand-muted block">5년 배당성장</span>
                <span className="text-sm sm:text-base font-bold num-font text-brand-primary">
                  {etfB.dividendGrowth5y ? `+${(etfB.dividendGrowth5y * 100).toFixed(1)}%` : '0.0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 시뮬레이션 설정 인풋: 투자금 & 기간 슬라이더 */}
      <div className="bg-brand-bg rounded-3xl p-6 sm:p-8 border border-subtle-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-brand-primary flex items-center gap-2">
              <Coins className="w-5 h-5 text-income" />
              시뮬레이션 인풋 (초기 투자금 & 투자 기간)
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              원하는 자본금과 보유 기간을 설정하면 1년차 월배당금부터 10년 후 총 자산 증식까지 자동으로 역산합니다.
            </p>
          </div>

          {/* 통화 토글 버튼 */}
          <div className="inline-flex p-1 bg-white rounded-xl border border-subtle-border self-start sm:self-auto shadow-2xs">
            <button
              type="button"
              onClick={() => handleCurrencyChange('KRW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              달러 ($)
            </button>
          </div>
        </div>

        {/* 1) 초기 투자금 입력 */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-brand-primary block">
            초기 투자금 입력 (기본: 10,000,000원)
          </label>
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
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-subtle-border text-xl font-bold num-font text-brand-primary focus:outline-none focus:ring-2 focus:ring-income shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(currency === 'KRW' ? quickCapitalsKRW : quickCapitalsUSD).map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setInitialCapital(item.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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

        {/* 2) 투자 기간 슬라이더 (1년 ~ 20년, 기본 15년) */}
        <div className="space-y-3 pt-4 border-t border-subtle-border/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-income" />
              투자 기간 설정 (1년 ~ 20년)
            </label>
            <span className="text-base font-black text-income num-font bg-income-light/60 px-3 py-1 rounded-xl">
              {investmentYears}년 시뮬레이션
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={investmentYears}
            onChange={(e) => setInvestmentYears(Number(e.target.value))}
            className="w-full accent-income h-2.5 bg-white rounded-lg cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-brand-muted font-mono">
            <span>1년 (단기)</span>
            <div className="flex gap-2">
              {quickYears.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setInvestmentYears(yr)}
                  className={`px-2.5 py-0.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    investmentYears === yr
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white border-subtle-border text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  {yr}년
                </button>
              ))}
            </div>
            <span>20년 (초장기 복리)</span>
          </div>
        </div>
      </div>

      {/* 5. 핵심 결과 1: 골든크로스(배당 역전 시점) 하이라이트 배너 */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-income/15 border-2 border-amber-400/40 space-y-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Zap className="w-4 h-4 fill-amber-200 text-amber-200" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase font-bold text-amber-900 tracking-wider">
              Golden-Cross Intelligence
            </span>
            <h4 className="text-base sm:text-lg font-black text-brand-primary">
              배당금 역전(골든크로스) 판정 결과
            </h4>
          </div>
        </div>

        <p className="text-base sm:text-lg font-extrabold text-brand-primary leading-relaxed bg-white/80 p-4 rounded-2xl border border-amber-300/60 shadow-2xs">
          ⚡ {crossoverBattle.crossoverSummaryText}
        </p>

        {crossoverBattle.crossoverYear ? (
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-brand-primary font-medium">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300/80">
              📅 골든크로스 시점: 투자 후 {crossoverBattle.crossoverYear}년차
            </span>
            <span className="text-brand-muted">
              초기에는 고배당 ETF의 수령액이 많지만, 장기 복리 배당성장이 누적되며 배당금 그래프가 교차합니다.
            </span>
          </div>
        ) : (
          <div className="text-xs text-brand-muted pt-1">
            선택하신 기간 동안 배당 역전 없이 초기의 배당률 우위 또는 성장 격차가 꾸준히 이어집니다.
          </div>
        )}
      </div>

      {/* 6. 핵심 결과 2: 승리 판정 배지 (초기 5년 현금흐름 승자 & 10년 장기 총수익 승자) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-income" />
          <h3 className="text-lg font-extrabold text-brand-primary">
            ETF 맞짱 최종 승리 판정 배지 (Verdict)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1) 초기 5년 현금흐름 승자 */}
          <div className="bg-gradient-to-br from-white to-income-light/30 rounded-3xl p-6 border-2 border-income/30 shadow-card space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-income text-white text-xs font-black flex items-center gap-1 shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                초기 5년 현금흐름 승자
              </span>
              <span className="text-xs font-mono text-brand-muted">월급형 인컴</span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-brand-primary">
                  {crossoverBattle.winner5yCashflow.winnerTicker}
                </span>
                <span className="text-xs font-bold text-income">
                  5년 누적 배당 1위 👑
                </span>
              </div>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                {crossoverBattle.winner5yCashflow.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-subtle-border/80 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-subtle-border">
                <span className="text-brand-muted block text-[11px]">{etfA.ticker} 5년 누적 배당</span>
                <span className="font-extrabold num-font text-brand-primary">
                  {formatCurrency(crossoverBattle.winner5yCashflow.total5yKRW_A, 'KRW')}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-subtle-border">
                <span className="text-brand-muted block text-[11px]">{etfB.ticker} 5년 누적 배당</span>
                <span className="font-extrabold num-font text-brand-primary">
                  {formatCurrency(crossoverBattle.winner5yCashflow.total5yKRW_B, 'KRW')}
                </span>
              </div>
            </div>
          </div>

          {/* 2) 10년 후 장기 총수익 승자 */}
          <div className="bg-gradient-to-br from-white to-amber-500/10 rounded-3xl p-6 border-2 border-amber-400/40 shadow-card space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black flex items-center gap-1 shadow-2xs">
                <Trophy className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
                10년 후 장기 총수익 승자
              </span>
              <span className="text-xs font-mono text-brand-muted">원금 + 누적배당</span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-brand-primary">
                  {crossoverBattle.winner10yTotalReturn.winnerTicker}
                </span>
                <span className="text-xs font-bold text-amber-700">
                  총 자산 증식 1위 🏆
                </span>
              </div>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                {crossoverBattle.winner10yTotalReturn.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-subtle-border/80 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-subtle-border">
                <span className="text-brand-muted block text-[11px]">{etfA.ticker} 10년 후 총 자산</span>
                <span className="font-extrabold num-font text-brand-primary">
                  {formatCurrency(crossoverBattle.winner10yTotalReturn.totalWealth10yKRW_A, 'KRW')}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-subtle-border">
                <span className="text-brand-muted block text-[11px]">{etfB.ticker} 10년 후 총 자산</span>
                <span className="font-extrabold num-font text-brand-primary">
                  {formatCurrency(crossoverBattle.winner10yTotalReturn.totalWealth10yKRW_B, 'KRW')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. 연도별 세후 배당금 & 원금 자산 평가액 비교 카드 (1, 3, 5, 10, 15년차) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-brand-primary flex items-center gap-2">
              <Layers className="w-5 h-5 text-income" />
              마일스톤별 세후 배당금 및 원금 자산 평가액 대조표
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              미국 원천징수 배당세 15% 차감 후 연간 실수령 배당금과 예상 주가 상승이 반영된 원금 평가액을 나란히 비교합니다.
            </p>
          </div>
          <span className="text-[11px] text-brand-muted font-mono self-start sm:self-auto">
            환율 ₩{exchangeRate.toLocaleString()} 기준
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crossoverBattle.milestones.map((m) => {
            const isDivA = m.divWinner === 'A';
            const isDivB = m.divWinner === 'B';
            const isAssetA = m.assetWinner === 'A';
            const isAssetB = m.assetWinner === 'B';

            return (
              <div
                key={m.year}
                className="bg-white rounded-2xl border border-subtle-border p-5 space-y-4 shadow-2xs hover:shadow-card transition-all"
              >
                <div className="flex items-center justify-between border-b border-subtle-border/80 pb-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-primary text-white text-xs font-black">
                    {m.year}년차 시점
                  </span>
                  <span className="text-[11px] font-mono text-brand-muted">
                    투자 원금: {formatCurrency(crossoverBattle.initialCapitalKRW, 'KRW')}
                  </span>
                </div>

                {/* 1) 연간 세후 배당금 비교 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-brand-muted block">
                    💰 연간 세후 배당금 (월 환산)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* A */}
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isDivA ? 'bg-income-light/50 border-income' : 'bg-brand-bg border-subtle-border'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-brand-primary">{etfA.ticker}</span>
                        {isDivA && (
                          <span className="text-[10px] font-black text-income">WIN</span>
                        )}
                      </div>
                      <div className="font-black num-font text-sm text-income mt-1">
                        {formatCurrency(m.netDividendAnnualKRW_A, 'KRW')}
                      </div>
                      <div className="text-[10px] text-brand-muted">
                        월 {formatCurrency(m.netDividendMonthlyKRW_A, 'KRW')}
                      </div>
                    </div>

                    {/* B */}
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isDivB ? 'bg-income-light/50 border-income' : 'bg-brand-bg border-subtle-border'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-brand-primary">{etfB.ticker}</span>
                        {isDivB && (
                          <span className="text-[10px] font-black text-income">WIN</span>
                        )}
                      </div>
                      <div className="font-black num-font text-sm text-income mt-1">
                        {formatCurrency(m.netDividendAnnualKRW_B, 'KRW')}
                      </div>
                      <div className="text-[10px] text-brand-muted">
                        월 {formatCurrency(m.netDividendMonthlyKRW_B, 'KRW')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2) 원금 자산 평가액 비교 */}
                <div className="space-y-2 pt-2 border-t border-subtle-border/60">
                  <span className="text-xs font-bold text-brand-muted block">
                    📈 원금 자산 평가액 (주가 변동 반영)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* A */}
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isAssetA ? 'bg-amber-50 border-amber-300' : 'bg-brand-bg border-subtle-border'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-brand-primary">{etfA.ticker}</span>
                        {isAssetA && (
                          <span className="text-[10px] font-black text-amber-700">WIN</span>
                        )}
                      </div>
                      <div className="font-black num-font text-sm text-brand-primary mt-1">
                        {formatCurrency(m.assetValueKRW_A, 'KRW')}
                      </div>
                    </div>

                    {/* B */}
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isAssetB ? 'bg-amber-50 border-amber-300' : 'bg-brand-bg border-subtle-border'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-brand-primary">{etfB.ticker}</span>
                        {isAssetB && (
                          <span className="text-[10px] font-black text-amber-700">WIN</span>
                        )}
                      </div>
                      <div className="font-black num-font text-sm text-brand-primary mt-1">
                        {formatCurrency(m.assetValueKRW_B, 'KRW')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3) 총 자산 (평가액 + 누적 배당금 합산) */}
                <div className="pt-2 border-t border-subtle-border/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] text-brand-muted">총 누적 가치:</span>
                  <span className="font-bold text-brand-primary">
                    {etfA.ticker} {Math.round(m.totalWealthKRW_A / 10000).toLocaleString()}만 vs{' '}
                    {etfB.ticker} {Math.round(m.totalWealthKRW_B / 10000).toLocaleString()}만
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. 1~20년차 연간 세후 배당금 성장 추이 Recharts 시각화 차트 */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-income" />
            1~{investmentYears}년차 연간 세후 배당금 성장 곡선 시뮬레이션
          </span>
          <span className="text-[11px] text-brand-muted font-mono">단위: 원화 (₩/년, 세후 15% 차감)</span>
        </div>

        <div className="h-72 sm:h-80 w-full bg-white p-4 rounded-3xl border border-subtle-border shadow-2xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={crossoverBattle.yearlyProjections}>
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

      {/* 9. 중앙 지표 대조 테이블 (시가배당률, 5년 성장률, 보수 등) */}
      <div className="overflow-hidden rounded-3xl border border-subtle-border shadow-xs">
        <div className="bg-brand-primary text-white px-6 py-4 flex items-center justify-between text-xs font-bold">
          <span>비교 핵심 금융 지표</span>
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

      {/* 10. 하단 맞춤 투자 성향 가이드 듀얼 카드 */}
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
