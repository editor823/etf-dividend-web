'use client';

import React, { useState, useMemo } from 'react';
import {
  Coins,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  PiggyBank,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

const QUICK_AMOUNTS = [
  { label: '500만 원', value: 5000000 },
  { label: '1,000만 원', value: 10000000 },
  { label: '2,000만 원', value: 20000000 },
  { label: '3,000만 원', value: 30000000 },
];

export default function TaxComparisonSimulator() {
  const [annualDividendKRW, setAnnualDividendKRW] = useState<number>(10000000);
  const [isaType, setIsaType] = useState<'standard' | 'lowIncome'>('standard'); // 일반형(200만) vs 서민형(400만)

  // 1. 미국 직투 계좌 세금 연산
  // 미국 배당세 15% 원천징수
  const directTax = useMemo(() => {
    return Math.round(annualDividendKRW * 0.15);
  }, [annualDividendKRW]);

  const directNetIncome = annualDividendKRW - directTax;
  const isDirectHighTaxRisk = annualDividendKRW > 20000000; // 2,000만 원 초과 시 금융소득종합과세

  // 2. 국내 ISA 계좌 세금 연산
  // 비과세 한도 (일반 200만, 서민 400만) + 초과분 9.9% 분리과세
  const isaExemptionLimit = isaType === 'standard' ? 2000000 : 4000000;
  const isaTax = useMemo(() => {
    if (annualDividendKRW <= isaExemptionLimit) {
      return 0;
    }
    const taxableAmount = annualDividendKRW - isaExemptionLimit;
    return Math.round(taxableAmount * 0.099); // 9.9% 지방소득세 포함
  }, [annualDividendKRW, isaExemptionLimit]);

  const isaNetIncome = annualDividendKRW - isaTax;
  const isaTaxSaved = Math.max(0, directTax - isaTax); // 직투 대비 절세액

  // 3. 연금저축 / IRP 계좌 (과세이연)
  // 투자 기간 중 배당소득세 0원 (인출 시 3.3%~5.5% 연금소득세)
  const pensionNetDuringInvestment = annualDividendKRW;

  return (
    <div className="bg-gradient-to-br from-white via-amber-50/20 to-income-light/20 rounded-3xl border border-subtle-border p-6 sm:p-8 shadow-card space-y-6">
      {/* 1. 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle-border pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-300/40 text-amber-900 text-xs font-bold mb-2">
            <PiggyBank className="w-3.5 h-3.5 text-orange-600" />
            <span>실전 절세 비교 시뮬레이터</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-brand-primary tracking-tight">
            미국 직투 vs 국내 절세계좌(ISA·연금) 세금 계산기
          </h3>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            연간 받는 배당금 규모에 따라 내 통장에 실제로 남는 세후 금액과 절약되는 세금을 비교해 드립니다.
          </p>
        </div>

        {/* ISA 유형 선택 */}
        <div className="flex items-center gap-2 p-1.5 bg-brand-bg rounded-2xl border border-subtle-border self-start sm:self-auto shrink-0">
          <span className="text-[11px] font-bold text-brand-muted pl-2">ISA 유형:</span>
          <button
            type="button"
            onClick={() => setIsaType('standard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isaType === 'standard'
                ? 'bg-brand-primary text-white shadow-2xs'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            일반형 (200만 비과세)
          </button>
          <button
            type="button"
            onClick={() => setIsaType('lowIncome')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isaType === 'lowIncome'
                ? 'bg-income text-white shadow-2xs'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            서민형 (400만 비과세)
          </button>
        </div>
      </div>

      {/* 2. 입력 컨트롤: 연간 목표 배당금 */}
      <div className="space-y-3 p-5 bg-white rounded-2xl border border-subtle-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-extrabold text-brand-primary flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-income" />
            <span>연간 목표 세전 배당금 입력</span>
          </label>
          <span className="text-xs font-bold text-income num-font">
            월 약 {formatCurrency(annualDividendKRW / 12, 'KRW')} 수령 목표
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-base font-bold text-income pointer-events-none">
              ₩
            </span>
            <input
              type="number"
              min="0"
              step="1000000"
              value={annualDividendKRW}
              onChange={(e) => setAnnualDividendKRW(Math.max(0, Number(e.target.value)))}
              className="w-full pl-9 pr-4 py-3 bg-brand-bg rounded-2xl border border-subtle-border text-lg font-black text-brand-primary focus:outline-none focus:border-income focus:ring-2 focus:ring-income/20 num-font"
            />
          </div>

          {/* 원클릭 빠른 칩 버튼 */}
          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_AMOUNTS.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => setAnnualDividendKRW(b.value)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  annualDividendKRW === b.value
                    ? 'bg-income text-white border-income shadow-2xs'
                    : 'bg-white hover:bg-brand-secondary border-subtle-border text-brand-primary'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 핵심 3대 계좌 세후 비교 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 카드 1: 미국 직투 계좌 */}
        <div className="p-5 rounded-2xl bg-white border border-subtle-border shadow-card space-y-3 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-extrabold text-blue-900 flex items-center gap-1.5">
                🇺🇸 미국 직투 일반 계좌
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                15% 원천징수
              </span>
            </div>

            <div className="space-y-1 mb-3">
              <span className="text-[11px] text-brand-muted block">세후 연간 실수령액</span>
              <div className="text-2xl font-black text-brand-primary num-font">
                {formatCurrency(directNetIncome, 'KRW')}
              </div>
              <p className="text-xs text-red-600 font-bold num-font">
                차감 세금: -{formatCurrency(directTax, 'KRW')} (15%)
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-brand-muted pt-3 border-t border-subtle-border/60">
              <div className="flex justify-between">
                <span>월 실수령 환산:</span>
                <span className="font-bold text-brand-primary num-font">
                  약 {formatCurrency(directNetIncome / 12, 'KRW')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>금융소득종합과세:</span>
                <span className={isDirectHighTaxRisk ? 'font-bold text-red-600' : 'text-brand-primary'}>
                  {isDirectHighTaxRisk ? '⚠️ 2,000만 초과 주의' : '해당 없음'}
                </span>
              </div>
            </div>
          </div>

          {isDirectHighTaxRisk && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-700 leading-relaxed flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>연 2,000만 원 초과분은 근로/사업소득과 합산되어 최고 45% 누진세율이 적용될 수 있습니다.</span>
            </div>
          )}
        </div>

        {/* 카드 2: 국내 ISA 계좌 (절세 승리) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-white border-2 border-income shadow-card space-y-3 relative flex flex-col justify-between">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-income text-white text-[10px] font-black shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            절세 추천 No.1
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                🇰🇷 국내 ISA 절세 계좌
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                비과세 + 9.9% 분리과세
              </span>
            </div>

            <div className="space-y-1 mb-3">
              <span className="text-[11px] text-brand-muted block">세후 연간 실수령액</span>
              <div className="text-2xl font-black text-income num-font">
                {formatCurrency(isaNetIncome, 'KRW')}
              </div>
              <p className="text-xs text-income font-bold num-font">
                차감 세금: -{formatCurrency(isaTax, 'KRW')} (실효 {annualDividendKRW > 0 ? ((isaTax / annualDividendKRW) * 100).toFixed(1) : 0}%)
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-brand-muted pt-3 border-t border-income/20">
              <div className="flex justify-between">
                <span>월 실수령 환산:</span>
                <span className="font-bold text-income num-font">
                  약 {formatCurrency(isaNetIncome / 12, 'KRW')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>종합과세 분리과세:</span>
                <span className="font-bold text-emerald-800">전액 분리과세 (건보료 안전)</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-income/30 text-xs font-bold text-income flex items-center justify-between">
            <span>미국 직투 대비 절세액:</span>
            <span className="num-font text-sm">+{formatCurrency(isaTaxSaved, 'KRW')} 절약!</span>
          </div>
        </div>

        {/* 카드 3: 연금저축 / IRP 계좌 (과세이연 100%) */}
        <div className="p-5 rounded-2xl bg-white border border-subtle-border shadow-card space-y-3 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-extrabold text-purple-900 flex items-center gap-1.5">
                🏛️ 연금저축 / IRP 계좌
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                배당세 0원 (과세이연)
              </span>
            </div>

            <div className="space-y-1 mb-3">
              <span className="text-[11px] text-brand-muted block">운용 중 세후 배당 실수령</span>
              <div className="text-2xl font-black text-purple-900 num-font">
                {formatCurrency(pensionNetDuringInvestment, 'KRW')}
              </div>
              <p className="text-xs text-purple-700 font-bold num-font">
                투자 기간 차감 세금: 0원 (100% 재투자)
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-brand-muted pt-3 border-t border-subtle-border/60">
              <div className="flex justify-between">
                <span>연말정산 세액공제:</span>
                <span className="font-bold text-brand-primary">연 최대 148.5만 환급</span>
              </div>
              <div className="flex justify-between">
                <span>55세 이후 연금소득세:</span>
                <span className="font-bold text-purple-800">3.3% ~ 5.5% 저율 과세</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-800 leading-relaxed flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-purple-600" />
            <span>배당금을 1원도 떼이지 않고 전액 재투자하여 복리 스노우볼을 가장 빠르게 굴릴 수 있습니다.</span>
          </div>
        </div>
      </div>

      {/* 4. 최종 인사이트 요약 배너 */}
      <div className="p-5 rounded-2xl bg-income text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black">
              💡 ISA 계좌로 투자 시 미국 직투 대비 연간 세금 {formatCurrency(isaTaxSaved, 'KRW')} 절약!
            </h4>
            <p className="text-xs text-white/80 mt-0.5">
              비과세 {formatNumber(isaExemptionLimit / 10000)}만 원 혜택과 9.9% 분리과세 적용으로 10년간 약{' '}
              <strong>{formatCurrency(isaTaxSaved * 10, 'KRW')}</strong>의 세금을 아낄 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
