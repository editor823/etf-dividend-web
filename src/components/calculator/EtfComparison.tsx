'use client';

import React, { useState, useMemo } from 'react';
import {
  Scale,
  Crown,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import {
  COMPARISON_ETFS,
  compareEtfs,
} from '@/lib/calculator/etf-comparison';
import EtfComparisonGuide from './guides/EtfComparisonGuide';

export default function EtfComparison() {
  const [tickerA, setTickerA] = useState<string>('SCHD');
  const [tickerB, setTickerB] = useState<string>('JEPI');

  // 빠른 비교 추천 프리셋
  const battlePresets = [
    { label: 'SCHD vs JEPI', a: 'SCHD', b: 'JEPI', desc: '배당성장 vs 고인컴 월배당' },
    { label: 'VOO vs SCHD', a: 'VOO', b: 'SCHD', desc: '시장지수 성장 vs 배당성장' },
    { label: 'JEPI vs JEPQ', a: 'JEPI', b: 'JEPQ', desc: 'S&P500 vs 나스닥 커버드콜' },
    { label: 'SCHD vs DIVO', a: 'SCHD', b: 'DIVO', desc: '정석 배당성장 vs 월배당 절충형' },
  ];

  // 두 종목 스왑(교체) 핸들러
  const handleSwap = () => {
    setTickerA(tickerB);
    setTickerB(tickerA);
  };

  // 비교 결과 계산
  const comparison = useMemo(() => {
    return compareEtfs(tickerA, tickerB);
  }, [tickerA, tickerB]);

  const { etfA, etfB, metrics, scoreA, scoreB, finalWinner } = comparison;

  const etfKeys = Object.keys(COMPARISON_ETFS);

  return (
    <div className="w-full bg-white rounded-3xl border border-subtle-border shadow-elevated p-6 sm:p-8 lg:p-10 space-y-8">
      {/* 1. 상단 섹션: 타이틀 & 프리셋 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5 text-income" />
            <span>기능 2: 1:1 Head-to-Head</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
            ETF 1:1 맞짱 비교기
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            두 개의 핵심 미국 배당 ETF를 지표별로 직접 대조하여 우위와 승패(👑)를 명확하게 가려냅니다.
          </p>
        </div>

        {/* 종목 맞바꾸기 버튼 */}
        <button
          type="button"
          onClick={handleSwap}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-bg hover:bg-brand-secondary border border-subtle-border text-xs font-bold text-brand-primary transition-all self-start sm:self-auto"
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

      {/* 2. 대결 헤더 카드 (종목 A vs 종목 B 대진표) */}
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
            <div className="w-48">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block mb-1">
                선수 1 (Player A)
              </label>
              <select
                value={tickerA}
                onChange={(e) => setTickerA(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-subtle-border font-extrabold text-base text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
              >
                {etfKeys.map((key) => (
                  <option key={key} value={key} disabled={key === tickerB}>
                    {key} - {COMPARISON_ETFS[key].name}
                  </option>
                ))}
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
              <p className="text-xs text-brand-muted mt-1 truncate">{etfA.name}</p>
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
            <div className="w-48">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block mb-1">
                선수 2 (Player B)
              </label>
              <select
                value={tickerB}
                onChange={(e) => setTickerB(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-subtle-border font-extrabold text-base text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
              >
                {etfKeys.map((key) => (
                  <option key={key} value={key} disabled={key === tickerA}>
                    {key} - {COMPARISON_ETFS[key].name}
                  </option>
                ))}
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
              <p className="text-xs text-brand-muted mt-1 truncate">{etfB.name}</p>
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
