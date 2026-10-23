'use client';

import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Shield,
  RotateCcw,
} from 'lucide-react';
import {
  calculateBarbellPortfolio,
  BARBELL_PRESETS,
} from '@/lib/calculator/barbell-optimizer';
import { ETF_DATABASE } from '@/lib/data/etf-database';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import BarbellOptimizerGuide from './guides/BarbellOptimizerGuide';

export default function BarbellOptimizer() {
  const [growthTicker, setGrowthTicker] = useState<string>('SCHD');
  const [incomeTicker, setIncomeTicker] = useState<string>('JEPI');
  const [growthWeight, setGrowthWeight] = useState<number>(50); // 기본 50:50
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [totalCapital, setTotalCapital] = useState<number>(50000000); // 기본 5,000만 원
  const [isReverseMode, setIsReverseMode] = useState<boolean>(false);
  const [targetMonthlyDividend, setTargetMonthlyDividend] = useState<number>(1000000); // 역산 목표 100만 원

  const exchangeRate = 1350;

  // 성장 및 배당성장 후보군
  const growthCandidates = ['SCHD', 'VOO', 'QQQ', 'VIG', 'DGRO', 'DIA', 'NOBL', 'VYM', 'HDV'];
  // 고배당 커버드콜 및 월배당 인컴 후보군
  const incomeCandidates = ['JEPI', 'JEPQ', 'SPYI', 'DIVO', 'O', 'MAIN', 'BST', 'TLT'];

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
  }, [growthTicker, incomeTicker, growthWeight, totalCapital, currency, exchangeRate, isReverseMode, targetMonthlyDividend]);

  const incomeWeight = 100 - growthWeight;
  const growthEtf = ETF_DATABASE[growthTicker] || ETF_DATABASE['SCHD'];
  const incomeEtf = ETF_DATABASE[incomeTicker] || ETF_DATABASE['JEPI'];

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 통화 선택 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <PieChart className="w-3.5 h-3.5 text-income" />
            <span>기능 4: 맞춤형 배당 바벨 전략</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            배당 바벨 포트폴리오 최적화기
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            <strong className="text-brand-primary">시장지수/성장 엔진</strong>과 <strong className="text-income">고배당 커버드콜</strong>의 비중 슬라이더를 조절하여 합성 배당률과 매월 세후 현금흐름을 최적화합니다.
          </p>
        </div>

        {/* 통화 선택 */}
        <div className="inline-flex p-1 bg-brand-bg rounded-xl border border-subtle-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleCurrencyChange('KRW')}
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
            onClick={() => handleCurrencyChange('USD')}
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

      {/* 2. 원클릭 3대 전략 프리셋 버튼 */}
      <div>
        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2.5">
          🎯 검증된 3대 바벨 전략 프리셋 선택
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BARBELL_PRESETS.map((preset) => {
            const isSelected = growthWeight === preset.growthWeight;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setGrowthWeight(preset.growthWeight)}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-primary bg-brand-primary text-white shadow-md ring-2 ring-brand-primary/20'
                    : 'border-subtle-border bg-white text-brand-primary hover:border-brand-muted/40 hover:bg-brand-bg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold">{preset.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-brand-secondary text-brand-primary'
                      }`}
                    >
                      {preset.badge}
                    </span>
                  </div>
                  <div className="text-sm font-bold num-font mb-1.5">
                    {preset.subtitle}
                  </div>
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

      {/* 3. 종목 선택 및 비중 슬라이더 조절 패널 */}
      <div className="p-6 bg-brand-bg rounded-3xl border border-subtle-border space-y-6">
        {/* 양날개 종목 선택기 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 좌측: 성장/배당성장 종목 선택 */}
          <div className="bg-white p-4 rounded-2xl border border-subtle-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary inline-block" />
                성장 / 시장지수 / 배당성장
              </span>
              <span className="text-xs text-income font-bold num-font">
                {formatPercent(growthEtf.dividendYield)}
              </span>
            </div>
            <select
              value={growthTicker}
              onChange={(e) => setGrowthTicker(e.target.value)}
              className="w-full px-3 py-2 bg-brand-bg rounded-xl border border-subtle-border text-sm font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
            >
              {growthCandidates.map((ticker) => {
                const item = ETF_DATABASE[ticker];
                return (
                  <option key={ticker} value={ticker}>
                    {ticker} - {item.nameKo || item.name} ({formatPercent(item.dividendYield)})
                  </option>
                );
              })}
            </select>
            <p className="text-[11px] text-brand-muted truncate">
              {growthEtf.description}
            </p>
          </div>

          {/* 우측: 고배당 커버드콜 / 월배당 인컴 종목 선택 */}
          <div className="bg-white p-4 rounded-2xl border border-subtle-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-income flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-income inline-block" />
                고배당 커버드콜 / 월배당 인컴
              </span>
              <span className="text-xs text-income font-bold num-font">
                {formatPercent(incomeEtf.dividendYield)}
              </span>
            </div>
            <select
              value={incomeTicker}
              onChange={(e) => setIncomeTicker(e.target.value)}
              className="w-full px-3 py-2 bg-brand-bg rounded-xl border border-subtle-border text-sm font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
            >
              {incomeCandidates.map((ticker) => {
                const item = ETF_DATABASE[ticker];
                return (
                  <option key={ticker} value={ticker}>
                    {ticker} - {item.nameKo || item.name} ({formatPercent(item.dividendYield)})
                  </option>
                );
              })}
            </select>
            <p className="text-[11px] text-brand-muted truncate">
              {incomeEtf.description}
            </p>
          </div>
        </div>

        {/* 대형 비중 게이지 바 */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-primary inline-block" />
              <span className="font-extrabold text-brand-primary text-base">
                {growthTicker} {growthWeight}%
              </span>
              <span className="text-xs text-brand-muted">({growthEtf.category})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-muted">({incomeEtf.category})</span>
              <span className="font-extrabold text-income text-base">
                {incomeTicker} {incomeWeight}%
              </span>
              <span className="w-3 h-3 rounded-full bg-income inline-block" />
            </div>
          </div>

          {/* 듀얼 컬러 비중 바 */}
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-subtle-border shadow-inner">
            <div
              className="bg-brand-primary transition-all duration-200"
              style={{ width: `${growthWeight}%` }}
            />
            <div
              className="bg-income transition-all duration-200"
              style={{ width: `${incomeWeight}%` }}
            />
          </div>

          {/* 슬라이더 조작 인풋 */}
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={growthWeight}
            onChange={(e) => setGrowthWeight(Number(e.target.value))}
            className="w-full accent-brand-primary cursor-pointer"
          />

          <div className="flex justify-between text-[11px] font-mono text-brand-muted">
            <span>0% (올인컴)</span>
            <span>25%</span>
            <span>50% (황금 밸런스)</span>
            <span>75%</span>
            <span>100% (올성장)</span>
          </div>
        </div>

        {/* 자본금 입력 패널 */}
        <div className="pt-4 border-t border-subtle-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-72">
            <label className="text-xs font-bold text-brand-primary block mb-1">
              총 투자 자본금 ({currency === 'KRW' ? '₩' : '$'})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-brand-muted">
                {currency === 'KRW' ? '₩' : '$'}
              </span>
              <input
                type="number"
                min="0"
                step={currency === 'KRW' ? 1000000 : 1000}
                value={totalCapital}
                onChange={(e) => setTotalCapital(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-subtle-border text-sm num-font font-bold focus:outline-none focus:ring-2 focus:ring-income"
              />
            </div>
          </div>

          {/* 역산 모드 토글 */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-subtle-border">
            <RotateCcw className="w-4 h-4 text-income" />
            <div className="text-xs">
              <span className="font-bold text-brand-primary block">목표 월 배당 역산</span>
              <span className="text-[11px] text-brand-muted">이 바벨 비중으로 월 N원 받으려면?</span>
            </div>
            <button
              type="button"
              onClick={() => setIsReverseMode(!isReverseMode)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                isReverseMode ? 'bg-income justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>
        </div>

        {/* 역산 모드 활성화 시 입력 박스 */}
        {isReverseMode && (
          <div className="p-4 bg-income-light/50 rounded-2xl border border-income/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-brand-primary block">
                희망하는 매월 세후 실수령 배당금
              </span>
              <span className="text-[11px] text-brand-muted">
                15% 배당세 차감 후 순수 입금 기준
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

      {/* 4. 중앙 핵심 지표 3단 하이라이트 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 복합 배당수익률 */}
        <div className="bg-gradient-to-br from-income to-income-dark text-white rounded-2xl p-6 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>포트폴리오 합성 배당률</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
              연간 세전 기대치
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black num-font">
            {formatPercent(result.combinedDividendYield)}
          </div>
          <p className="text-xs text-white/80">
            {growthTicker}({(growthEtf.dividendYield * 100).toFixed(1)}%) + {incomeTicker}(
            {(incomeEtf.dividendYield * 100).toFixed(1)}%) 가중평균
          </p>
        </div>

        {/* 복합 5년 배당성장률 */}
        <div className="bg-brand-primary text-white rounded-2xl p-6 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>복합 5년 배당성장률 (CAGR)</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
              물가 방어력
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black num-font text-income-light">
            +{formatPercent(result.combinedDividendGrowth5y)}
          </div>
          <p className="text-xs text-white/80">
            {growthTicker}의 성장 엔진으로 시간이 갈수록 배당금 증가
          </p>
        </div>

        {/* 월평균 세후 현금흐름 */}
        <div className="bg-white rounded-2xl p-6 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>월평균 세후 실수령액</span>
            <span className="px-2 py-0.5 rounded-full bg-income-light text-income text-[10px] font-bold">
              15% 세금 차감 후
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold num-font text-income">
            {currency === 'KRW'
              ? formatCurrency(result.monthlyNetDividendKRW, 'KRW')
              : formatCurrency(result.monthlyNetDividendUSD, 'USD')}
          </div>
          <p className="text-xs text-brand-muted num-font">
            연간 세후 약{' '}
            {currency === 'KRW'
              ? formatCurrency(result.annualNetDividendUSD * exchangeRate, 'KRW')
              : formatCurrency(result.annualNetDividendUSD, 'USD')}
          </p>
        </div>
      </div>

      {/* 5. 역산 모드 결과 카드 (활성화 시 표시) */}
      {isReverseMode && result.reverseCalculation && (
        <div className="p-6 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-3xl shadow-elevated space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-mono text-income-light font-bold">
              Reverse Calculation Result
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
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-[11px] text-white/70 block">필요 {growthTicker} 주식 수</span>
              <span className="text-lg font-bold num-font text-white">
                {formatNumber(result.reverseCalculation.requiredGrowthShares)}주
              </span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
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

      {/* 6. 하단 종목별 세부 배분 현황 듀얼 카드 */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
          <Shield className="w-5 h-5 text-income" />
          종목별 포트폴리오 세부 배분 명세
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 성장 자산 카드 */}
          <div className="bg-brand-bg rounded-2xl p-6 border border-subtle-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-brand-primary">{growthTicker}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-brand-primary text-white font-bold">
                    {result.growthWeight}%
                  </span>
                </div>
                <p className="text-xs text-brand-muted mt-0.5">
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

            <div className="p-3.5 bg-white rounded-xl border border-subtle-border/80 text-xs text-brand-muted">
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
          <div className="bg-brand-bg rounded-2xl p-6 border border-subtle-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-income">
                    {incomeTicker}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-income text-white font-bold">
                    {result.incomeWeight}%
                  </span>
                </div>
                <p className="text-xs text-brand-muted mt-0.5">
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

            <div className="p-3.5 bg-white rounded-xl border border-subtle-border/80 text-xs text-brand-muted">
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
