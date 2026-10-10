'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Layers,
  Gift,
  Coins,
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
import {
  calculateDividendCalendar,
  CALENDAR_PRESETS,
  TICKER_SCHEDULES,
  CalendarPreset,
} from '@/lib/calculator/dividend-calendar';
import { formatCurrency, formatNumber } from '@/lib/utils';
import DividendCalendarGuide from './guides/DividendCalendarGuide';

export default function DividendCalendar() {
  // 포트폴리오 기본 상태 (황금 월급형: SCHD 200주, JEPI 300주, JEPQ 200주)
  const [portfolio, setPortfolio] = useState<Record<string, number>>({
    SCHD: 200,
    JEPI: 300,
    JEPQ: 200,
    VOO: 0,
    DIVO: 0,
  });
  const [selectedPreset, setSelectedPreset] = useState<string>('monthly_salary');
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const exchangeRate = 1350;

  // 주식 수 변경 핸들러
  const handleSharesChange = (ticker: string, shares: number) => {
    setPortfolio((prev) => ({
      ...prev,
      [ticker]: Math.max(0, shares),
    }));
    setSelectedPreset('custom');
  };

  // 프리셋 적용 핸들러
  const applyPreset = (preset: CalendarPreset) => {
    setSelectedPreset(preset.id);
    setPortfolio({
      SCHD: preset.portfolio.SCHD || 0,
      JEPI: preset.portfolio.JEPI || 0,
      JEPQ: preset.portfolio.JEPQ || 0,
      VOO: preset.portfolio.VOO || 0,
      DIVO: preset.portfolio.DIVO || 0,
    });
  };

  // 캘린더 연산 수행
  const result = useMemo(() => {
    return calculateDividendCalendar(portfolio, exchangeRate);
  }, [portfolio, exchangeRate]);

  // 차트용 데이터 가공
  const chartData = useMemo(() => {
    return result.monthlyCashFlows.map((flow) => ({
      monthLabel: flow.monthLabel,
      amountUSD: flow.netTotalUSD,
      amountKRW: flow.netTotalKRW,
      hasBonus: flow.hasBonusIncome,
      isEmpty: flow.isEmpty,
    }));
  }, [result]);

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 통화 토글 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-income" />
            <span>기능 6: 연간 현금흐름 타임라인</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            월별 배당 캘린더 & 현금흐름 대시보드
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            내 보유 종목의 배당락일/지급일을 기준으로 1월부터 12월까지 매월 꽂히는 실제 세후 실수령액을 시각화합니다.
          </p>
        </div>

        {/* 통화 선택 */}
        <div className="inline-flex p-1 bg-brand-bg rounded-xl border border-subtle-border self-start sm:self-auto">
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

      {/* 2. 포트폴리오 간편 세팅기 & 추천 프리셋 */}
      <div className="p-6 bg-brand-bg rounded-3xl border border-subtle-border space-y-6">
        <div>
          <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2.5">
            🎯 원클릭 추천 포트폴리오 프리셋
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CALENDAR_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary text-white shadow-md ring-2 ring-brand-primary/20'
                      : 'border-subtle-border bg-white text-brand-primary hover:border-brand-muted/40 hover:bg-brand-bg'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-extrabold mb-1">{preset.name}</h4>
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

        {/* 종목별 보유 주식 수 직접 입력창 */}
        <div className="pt-4 border-t border-subtle-border">
          <label className="text-xs font-bold text-brand-primary block mb-3">
            보유 주식 수 직접 수정 (주)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.keys(TICKER_SCHEDULES).map((ticker) => {
              const count = portfolio[ticker] || 0;
              const schedule = TICKER_SCHEDULES[ticker];
              return (
                <div
                  key={ticker}
                  className="bg-white p-3.5 rounded-2xl border border-subtle-border shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-brand-primary">
                      {ticker}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-brand-secondary text-brand-primary">
                      {schedule.frequency === 'monthly' ? '월배당' : '분기배당'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={count}
                      onChange={(e) =>
                        handleSharesChange(ticker, Number(e.target.value))
                      }
                      className="w-full px-3 py-1.5 bg-brand-bg rounded-xl border border-subtle-border text-sm num-font font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
                    />
                    <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-brand-muted pointer-events-none">
                      주
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. 중앙 연간 요약 카드 3종 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 연간 총 세후 배당금 */}
        <div className="bg-gradient-to-br from-brand-primary to-brand-dark text-white rounded-2xl p-6 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>연간 총 세후 배당금</span>
            <span className="px-2 py-0.5 rounded-full bg-income text-white text-[10px] font-bold">
              순수 통장 실수령
            </span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black num-font text-white">
              {currency === 'KRW'
                ? formatCurrency(result.totalAnnualNetKRW, 'KRW')
                : formatCurrency(result.totalAnnualNetUSD, 'USD')}
            </div>
            <p className="text-xs text-white/80 num-font mt-0.5">
              {currency === 'KRW'
                ? `약 ${formatCurrency(result.totalAnnualNetUSD, 'USD')}`
                : `약 ${formatCurrency(result.totalAnnualNetKRW, 'KRW')}`}
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 text-xs text-white/70 flex items-center justify-between">
            <span>미국 원천징수세(15%)</span>
            <span className="num-font font-semibold text-alert">
              -{formatCurrency(result.totalAnnualTaxUSD, 'USD')}
            </span>
          </div>
        </div>

        {/* 월평균 예상 실수령액 */}
        <div className="bg-white rounded-2xl p-6 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>월평균 예상 실수령액</span>
            <span className="px-2 py-0.5 rounded-full bg-income-light text-income text-[10px] font-bold">
              제2의 월급
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold num-font text-income">
              {currency === 'KRW'
                ? formatCurrency(result.monthlyAverageNetKRW, 'KRW')
                : formatCurrency(result.monthlyAverageNetUSD, 'USD')}
            </div>
            <p className="text-xs text-brand-muted num-font mt-0.5">
              {currency === 'KRW'
                ? `월 약 ${formatCurrency(result.monthlyAverageNetUSD, 'USD')}`
                : `월 약 ${formatCurrency(result.monthlyAverageNetKRW, 'KRW')}`}
            </p>
          </div>
          <div className="pt-2 border-t border-subtle-border text-xs text-brand-muted flex items-center justify-between">
            <span>12개월 분할 환산</span>
            <span className="num-font font-medium text-brand-primary">연 12회 기준</span>
          </div>
        </div>

        {/* 현금흐름 안정성 지표 (공백 월 체크) */}
        <div className="bg-white rounded-2xl p-6 border border-subtle-border shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>현금흐름 빈틈 체크</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                result.emptyMonthsCount === 0
                  ? 'bg-income-light text-income'
                  : 'bg-alert-light text-alert'
              }`}
            >
              {result.emptyMonthsCount === 0 ? '공백 없는 완벽한 월급' : `${result.emptyMonthsCount}개 월 배당 없음`}
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold num-font text-brand-primary">
              {12 - result.emptyMonthsCount}개월 수령
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              1년 12달 중 배당이 지급되는 활성 월수
            </p>
          </div>
          <div className="pt-2 border-t border-subtle-border text-xs text-brand-muted flex items-center justify-between">
            <span>분기 보너스 포함</span>
            <span className="font-semibold text-income flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" />
              3, 6, 9, 12월 증액
            </span>
          </div>
        </div>
      </div>

      {/* 4. 하단 1: 1~12월 연간 배당 바 차트 (Recharts BarChart) */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
              <Coins className="w-5 h-5 text-income" />
              월별 배당 현금흐름 분포 차트
            </h3>
            <p className="text-xs text-brand-muted">
              짙은 녹색 막대는 분기 보너스(SCHD 등)가 함께 터지는 달(3, 6, 9, 12월)을 나타냅니다.
            </p>
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
                    currency === 'KRW' ? `${(val / 10000).toFixed(0)}만` : `$${val}`
                  }
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    currency === 'KRW'
                      ? formatCurrency(Number(value ?? 0) * exchangeRate, 'KRW')
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
                <Bar dataKey="amountUSD" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.hasBonus ? '#2d6a4f' : '#84a98c'}
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

      {/* 5. 하단 2: 월별 12개 카드 캘린더 그리드 */}
      <div className="space-y-4 pt-4 border-t border-subtle-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
            <Layers className="w-5 h-5 text-income" />
            1~12월 상세 배당 캘린더 그리드
          </h3>
          <span className="text-xs text-brand-muted">
            15% 원천징수 차감 세후 실수령액
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {result.monthlyCashFlows.map((flow) => {
            return (
              <div
                key={flow.month}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  flow.isEmpty
                    ? 'border-subtle-border bg-brand-bg/50 opacity-60'
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
                        ? formatCurrency(flow.netTotalKRW, 'KRW')
                        : formatCurrency(flow.netTotalUSD, 'USD')}
                    </div>
                    <span className="text-[11px] text-brand-muted num-font">
                      {currency === 'KRW'
                        ? `($${flow.netTotalUSD})`
                        : `(₩${formatNumber(flow.netTotalKRW)})`}
                    </span>
                  </div>

                  {/* 지급 이벤트 종목 리스트 */}
                  <div className="space-y-1.5 pt-2 border-t border-subtle-border/60">
                    {flow.events.length > 0 ? (
                      flow.events.map((ev, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-0.5"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-bold text-brand-primary">
                              {ev.ticker}
                            </span>
                            <span className="text-[10px] text-brand-muted">
                              ({ev.shares}주)
                            </span>
                          </div>
                          <span className="num-font font-semibold text-brand-primary">
                            +${ev.netAmountUSD.toFixed(1)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-brand-muted py-1 text-center">
                        배당 지급 일정이 없습니다.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-subtle-border/60 text-[10px] text-brand-muted flex items-center justify-between">
                  <span>지급 패턴</span>
                  <span>{flow.hasBonusIncome ? '월초 + 분기말' : flow.isEmpty ? '-' : '월초 고정'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* E-E-A-T 정적 해설 가이드 섹션 */}
        <DividendCalendarGuide />
      </div>
    </div>
  );
}
