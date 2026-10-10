'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  Coins,
} from 'lucide-react';
import {
  calculateTargetDividend,
  POPULAR_ETFS,
  US_DIVIDEND_TAX_RATE,
} from '@/lib/calculator/target-dividend';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';

export default function TargetDividendCalculator() {
  // 상태 관리
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [targetAmount, setTargetAmount] = useState<number>(1000000); // 기본 100만 원
  const [selectedTicker, setSelectedTicker] = useState<string>('SCHD');
  const [monthlySharesToAdd, setMonthlySharesToAdd] = useState<number>(10); // 매월 10주 적립
  const [exchangeRate, setExchangeRate] = useState<number>(1350); // 기본 환율

  // 퀵 선택 버튼 목록
  const quickAmountsKRW = [
    { label: '50만 원', value: 500000 },
    { label: '100만 원', value: 1000000 },
    { label: '200만 원', value: 2000000 },
    { label: '300만 원', value: 3000000 },
  ];

  const quickAmountsUSD = [
    { label: '$500', value: 500 },
    { label: '$1,000', value: 1000 },
    { label: '$2,000', value: 2000 },
    { label: '$3,000', value: 3000 },
  ];

  // 통화 전환 핸들러
  const handleCurrencyChange = (newCurrency: 'KRW' | 'USD') => {
    if (newCurrency === currency) return;
    if (newCurrency === 'USD') {
      // KRW -> USD 대략적인 환산
      const usdVal = Math.round(targetAmount / exchangeRate);
      setTargetAmount(usdVal > 0 ? usdVal : 1000);
    } else {
      // USD -> KRW 환산
      const krwVal = Math.round(targetAmount * exchangeRate);
      setTargetAmount(krwVal > 0 ? krwVal : 1000000);
    }
    setCurrency(newCurrency);
  };

  // 연산 수행 (메모이제이션)
  const result = useMemo(() => {
    return calculateTargetDividend({
      targetMonthlyAmount: targetAmount,
      currency,
      ticker: selectedTicker,
      monthlySharesToAdd,
      exchangeRate,
    });
  }, [targetAmount, currency, selectedTicker, monthlySharesToAdd, exchangeRate]);

  const activeEtf = POPULAR_ETFS[selectedTicker] || POPULAR_ETFS['SCHD'];

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 통화 토글 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5 text-income" />
            <span>기능 1: 세후 현금흐름 역산</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            월 목표 배당 역산 계산기
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            미국 배당소득세(15% 원천징수)를 제외한 순수 <strong className="text-brand-primary">세후 실수령액</strong> 기준 필요 주식 수와 자본금을 산출합니다.
          </p>
        </div>

        {/* 통화(₩ / $) 선택 버튼 */}
        <div className="inline-flex p-1 bg-brand-bg rounded-xl border border-subtle-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleCurrencyChange('KRW')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              currency === 'KRW'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            원화 (KRW ₩)
          </button>
          <button
            type="button"
            onClick={() => handleCurrencyChange('USD')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              currency === 'USD'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            달러 (USD $)
          </button>
        </div>
      </div>

      {/* 2. 입력 영역: 목표 금액, ETF 선택, 부가 변수 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 좌측: 금액 입력 및 퀵 버튼 */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-brand-primary flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-income" />
                희망하는 매월 세후 실수령 배당금
              </label>
              <span className="text-xs text-brand-muted font-mono">
                현재 목표: {currency === 'KRW' ? formatCurrency(targetAmount, 'KRW') : formatCurrency(targetAmount, 'USD')}
              </span>
            </div>

            {/* 메인 숫자 입력창 */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-muted font-bold text-lg">
                {currency === 'KRW' ? '₩' : '$'}
              </div>
              <input
                type="number"
                min={currency === 'KRW' ? 10000 : 10}
                step={currency === 'KRW' ? 100000 : 50}
                value={targetAmount}
                onChange={(e) => setTargetAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-11 pr-4 py-3.5 bg-brand-bg rounded-2xl border border-subtle-border focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income num-font text-2xl font-bold text-brand-primary transition-all"
                placeholder="0"
              />
            </div>

            {/* 퀵 선택 칩 버튼들 */}
            <div className="flex flex-wrap gap-2 mt-3">
              {(currency === 'KRW' ? quickAmountsKRW : quickAmountsUSD).map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setTargetAmount(item.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    targetAmount === item.value
                      ? 'bg-brand-secondary border-brand-primary/20 text-brand-primary font-bold shadow-xs'
                      : 'bg-white border-subtle-border text-brand-muted hover:bg-brand-bg hover:text-brand-primary'
                  }`}
                >
                  +{item.label}
                </button>
              ))}
            </div>
          </div>

          {/* ETF 종목 선택 칩 */}
          <div>
            <label className="text-sm font-bold text-brand-primary flex items-center gap-1.5 mb-2.5">
              <TrendingUp className="w-4 h-4 text-income" />
              투자 대상 ETF 선택
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.values(POPULAR_ETFS).map((etf) => {
                const isSelected = selectedTicker === etf.ticker;
                return (
                  <button
                    key={etf.ticker}
                    type="button"
                    onClick={() => setSelectedTicker(etf.ticker)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-brand-primary bg-brand-primary text-white shadow-md ring-2 ring-brand-primary/20'
                        : 'border-subtle-border bg-white text-brand-primary hover:border-brand-muted/40 hover:bg-brand-bg'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-base tracking-tight">
                          {etf.ticker}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-brand-secondary text-brand-primary'
                          }`}
                        >
                          {etf.frequencyLabel}
                        </span>
                      </div>
                      <p
                        className={`text-xs truncate ${
                          isSelected ? 'text-white/80' : 'text-brand-muted'
                        }`}
                      >
                        {etf.category}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-baseline justify-between">
                      <span
                        className={`text-[11px] ${
                          isSelected ? 'text-white/70' : 'text-brand-muted'
                        }`}
                      >
                        배당률
                      </span>
                      <span
                        className={`num-font text-sm font-bold ${
                          isSelected ? 'text-income-light' : 'text-income'
                        }`}
                      >
                        {formatPercent(etf.dividendYield)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 우측: 추가 시뮬레이션 파라미터 (적립 주식수, 환율) */}
        <div className="lg:col-span-5 bg-brand-bg rounded-2xl p-6 border border-subtle-border flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-sm font-bold text-brand-primary flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-income" />
              적립 계획 & 환율 설정
            </h3>
            <p className="text-xs text-brand-muted mb-4">
              매월 꾸준히 모아갈 주식 수를 입력하면 목표 달성 D-day를 예측해 드립니다.
            </p>

            <div className="space-y-4">
              {/* 매월 추가 적립 주식 수 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-medium text-brand-primary">매월 추가 매수 주식 수</span>
                  <span className="num-font font-bold text-income text-sm">
                    {monthlySharesToAdd}주 / 월
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={monthlySharesToAdd}
                  onChange={(e) => setMonthlySharesToAdd(Number(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-brand-muted font-mono mt-1">
                  <span>1주</span>
                  <span>50주</span>
                  <span>100주</span>
                </div>
              </div>

              {/* 환율 입력 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-medium text-brand-primary">적용 환율 (USD/KRW)</span>
                  <span className="num-font font-bold text-brand-primary">
                    ₩{formatNumber(exchangeRate)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-brand-muted">
                    ₩
                  </span>
                  <input
                    type="number"
                    min="1000"
                    max="2000"
                    step="10"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-subtle-border text-sm num-font font-bold focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 종목 요약 안내 */}
          <div className="p-3.5 bg-white rounded-xl border border-subtle-border text-xs text-brand-muted space-y-1">
            <div className="flex items-center justify-between text-brand-primary font-bold">
              <span>{activeEtf.ticker} 현재가</span>
              <span className="num-font">${activeEtf.currentPrice.toFixed(2)}</span>
            </div>
            <p className="text-[11px] leading-relaxed pt-1 border-t border-subtle-border/60">
              {activeEtf.description}
            </p>
          </div>
        </div>
      </div>

      {/* 3. 중앙 하이라이트 결과 카드 (필요 주식 수 & 필요 총 자본금) */}
      <div className="bg-gradient-to-br from-brand-primary to-brand-dark rounded-3xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
        {/* 배경 은은한 데코레이션 원 */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-income/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* 필요 총 주식 수 */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-income-light text-xs font-semibold backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-income-light" />
              목표 달성에 필요한 총 주식 수
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight num-font text-white">
                {formatNumber(result.requiredShares)}
              </span>
              <span className="text-2xl font-bold text-white/70">주</span>
            </div>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              1주당 연간 세후 배당금: <span className="num-font text-white font-bold">${result.netDividendPerShareAnnualUSD.toFixed(2)}</span>
              {' '}(미국 원천징수세 {formatPercent(US_DIVIDEND_TAX_RATE, 0)} 차감 후)
            </p>
          </div>

          {/* 현재가 기준 필요 총 원금 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
            <span className="text-xs uppercase font-mono tracking-wider text-white/70">
              현재가 기준 필요 투자 원금
            </span>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold num-font text-white">
                {formatCurrency(result.totalCapitalKRW, 'KRW')}
              </div>
              <div className="text-sm font-semibold num-font text-white/80">
                약 {formatCurrency(result.totalCapitalUSD, 'USD')}
              </div>
            </div>
            <div className="text-[11px] text-white/60 pt-2 border-t border-white/10 flex items-center justify-between">
              <span>적용 주가: ${result.etf.currentPrice.toFixed(2)}</span>
              <span>환율: ₩{formatNumber(result.exchangeRate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 세부 현금흐름 요약 4단 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          <span className="text-xs text-brand-muted block mb-1">월 세후 실수령액</span>
          <p className="text-lg sm:text-xl font-bold text-income num-font">
            {formatCurrency(result.monthlyNetDividendKRW, 'KRW')}
          </p>
          <span className="text-xs text-brand-muted num-font">
            {formatCurrency(result.monthlyNetDividendUSD, 'USD')} / 월
          </span>
        </div>

        <div className="bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          <span className="text-xs text-brand-muted block mb-1">연간 세전 배당금</span>
          <p className="text-lg sm:text-xl font-bold text-brand-primary num-font">
            {formatCurrency(result.annualGrossDividendUSD, 'USD')}
          </p>
          <span className="text-xs text-brand-muted num-font">
            약 {formatCurrency(result.annualGrossDividendUSD * result.exchangeRate, 'KRW')}
          </span>
        </div>

        <div className="bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          <span className="text-xs text-alert block mb-1">미국 배당세 (15%)</span>
          <p className="text-lg sm:text-xl font-bold text-alert num-font">
            -{formatCurrency(result.annualTaxUSD, 'USD')}
          </p>
          <span className="text-xs text-alert/80 num-font">
            약 -{formatCurrency(result.annualTaxUSD * result.exchangeRate, 'KRW')}
          </span>
        </div>

        <div className="bg-brand-bg rounded-2xl p-4 border border-subtle-border">
          <span className="text-xs text-brand-muted block mb-1">연간 세후 실수령액</span>
          <p className="text-lg sm:text-xl font-bold text-brand-primary num-font">
            {formatCurrency(result.annualNetDividendUSD, 'USD')}
          </p>
          <span className="text-xs text-income num-font font-bold">
            실수령율 85.0%
          </span>
        </div>
      </div>

      {/* 5. 하단: D-Day & 4단계 마일스톤 로드맵 */}
      <div className="pt-6 border-t border-subtle-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-brand-primary flex items-center gap-2">
              <Calendar className="w-5 h-5 text-income" />
              목표 달성 로드맵 & 4단계 마일스톤
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              매월 {result.monthlySharesToAdd}주씩 꾸준히 적립 매수할 때의 단계별 성취 지점입니다.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-secondary text-brand-primary text-xs font-bold self-start sm:self-auto">
            <Clock className="w-4 h-4 text-income" />
            <span>예상 소요 기간: <strong className="text-income text-sm">{result.yearsAndMonths}</strong></span>
            <span className="text-brand-muted">({result.targetDDayDate} 도달 예정)</span>
          </div>
        </div>

        {/* 4단계 마일스톤 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {result.milestones.map((step) => {
            const isFinished = step.percent === 100;
            return (
              <div
                key={step.percent}
                className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  isFinished
                    ? 'border-income bg-income-light/30 shadow-sm'
                    : 'border-subtle-border bg-white hover:border-brand-primary/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${
                        isFinished
                          ? 'bg-income text-white'
                          : 'bg-brand-secondary text-brand-primary'
                      }`}
                    >
                      {step.percent}% 달성
                    </span>
                    <span className="text-xs text-brand-muted font-medium">
                      {step.targetDate}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-brand-primary mb-2">
                    {step.label}
                  </h4>

                  <div className="space-y-1.5 text-xs text-brand-muted">
                    <div className="flex justify-between">
                      <span>누적 주식 수</span>
                      <strong className="num-font text-brand-primary">
                        {formatNumber(step.shares)}주
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>누적 투자금</span>
                      <strong className="num-font text-brand-primary">
                        {formatCurrency(step.totalCapitalKRW, 'KRW')}
                      </strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-subtle-border/60">
                      <span className="text-income font-medium">월 배당 수령</span>
                      <strong className="num-font text-income font-bold">
                        {formatCurrency(step.monthlyNetDividendKRW, 'KRW')}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-subtle-border/60 text-[11px] text-brand-muted flex items-center justify-between">
                  <span>소요 기간</span>
                  <span className="num-font font-semibold text-brand-primary">
                    {step.monthsToReach}개월
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 세금 및 유의사항 안내 팁 박스 */}
        <div className="p-4 rounded-2xl bg-brand-bg border border-subtle-border flex items-start gap-3 text-xs text-brand-muted">
          <Info className="w-4 h-4 text-income mt-0.5 flex-shrink-0" />
          <div className="leading-relaxed">
            <span className="font-semibold text-brand-primary">투자 안내 및 계산 기준: </span>
            본 시뮬레이션은 미국 현지 원천징수 배당소득세 15%를 필수로 적용한 세후 기준입니다.
            국내 금융소득종합과세(연간 금융소득 2,000만 원 초과 시)나 환율 변동, 주가 및 배당금 변동에 따라 실제 수령액은 차이가 있을 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
