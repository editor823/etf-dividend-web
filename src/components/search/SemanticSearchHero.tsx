'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  X,
  Target,
  Zap,
} from 'lucide-react';
import { searchSemanticEtf, SemanticSearchResult } from '@/lib/semanticSearchEngine';
import { ETF_LIST } from '@/data/etfList';

interface SemanticSearchHeroProps {
  onSelectEtfForCalculator: (ticker: string) => void;
}

export default function SemanticSearchHero({ onSelectEtfForCalculator }: SemanticSearchHeroProps) {
  // 모드 상태: 'ai' (자연어 시맨틱) | 'normal' (일반 티커/단어 검색)
  const [searchMode, setSearchMode] = useState<'ai' | 'normal'>('ai');
  const [query, setQuery] = useState('');

  // 빠른 질문 추천 칩 3종
  const quickPromptChips = [
    {
      label: '10년 뒤 은퇴 준비용 복리 ETF',
      query: '10년 뒤 은퇴 준비용으로 복리 스노우볼 극대화되는 배당성장 ETF',
    },
    {
      label: '매달 꼬박꼬박 생활비 나오는 월배당',
      query: '매달 꼬박꼬박 생활비처럼 통장에 꽂히는 안전한 고배당 월배당',
    },
    {
      label: '달러 예수금 묶어둘 안전한 파킹',
      query: '원금 안 깨지고 달러 예수금 묶어둘 안전한 무위험 파킹통장',
    },
  ];

  // AI 시맨틱 검색 결과 (쿼리 입력 시 실시간/디바운스 연산)
  const aiResults: SemanticSearchResult[] = useMemo(() => {
    if (searchMode !== 'ai' || !query.trim()) {
      return [];
    }
    return searchSemanticEtf(query, 3);
  }, [query, searchMode]);

  // 일반 키워드 검색 결과
  const normalResults = useMemo(() => {
    if (searchMode !== 'normal' || !query.trim()) {
      return [];
    }
    const q = query.trim().toLowerCase();
    return ETF_LIST.filter(
      (etf) =>
        etf.ticker.toLowerCase().includes(q) ||
        etf.name.toLowerCase().includes(q) ||
        etf.nameEn.toLowerCase().includes(q) ||
        etf.category.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query, searchMode]);

  const handleChipClick = (chipQuery: string) => {
    setSearchMode('ai');
    setQuery(chipQuery);
  };

  const handleApplyToCalculator = (ticker: string) => {
    onSelectEtfForCalculator(ticker);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* 1. 검색 모드 전환 토글 바 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-brand-primary">AI 맞춤 검색</span>
            </div>
            <p className="text-[11px] text-brand-muted hidden sm:block">
              어려운 금융 용어 대신 내 고민을 자연어로 편하게 물어보세요
            </p>
          </div>
        </div>

        {/* 세그먼트 토글 버튼 */}
        <div className="flex items-center p-1 bg-white border border-subtle-border rounded-xl shadow-2xs">
          <button
            type="button"
            onClick={() => setSearchMode('ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              searchMode === 'ai'
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xs'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 자연어 추천</span>
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('normal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              searchMode === 'normal'
                ? 'bg-brand-primary text-white shadow-xs'
                : 'text-brand-muted hover:text-brand-primary'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>일반 종목 검색</span>
          </button>
        </div>
      </div>

      {/* 2. 대형 검색 입력창 */}
      <div className="relative group">
        <div
          className={`relative flex items-center bg-white rounded-2xl border-2 transition-all shadow-md overflow-hidden ${
            searchMode === 'ai'
              ? 'border-rose-300 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-100'
              : 'border-subtle-border focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-gray-100'
          }`}
        >
          <div className="pl-4 pr-2 text-brand-muted flex items-center justify-center">
            {searchMode === 'ai' ? (
              <Sparkles className="w-5 h-5 text-rose-500" />
            ) : (
              <Search className="w-5 h-5 text-gray-400" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === 'ai'
                ? '예: 매달 월급처럼 배당받고 싶은데 하락장 방어 잘 되는 거'
                : '티커 또는 종목명 입력 (예: SCHD, JEPI, 배당성장, 리얼티인컴)'
            }
            className="w-full py-4 pr-12 text-sm sm:text-base font-medium text-brand-primary placeholder:text-gray-400 bg-transparent focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="검색어 지우기"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. 빠른 질문 추천 칩 3종 (AI 모드일 때만 표시) */}
      {searchMode === 'ai' && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-brand-muted flex items-center gap-1 shrink-0">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            추천 질문:
          </span>
          {quickPromptChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip.query)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-200/80 text-xs font-semibold transition-all shadow-2xs hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer text-left"
            >
              <span className="text-rose-500">💬</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* 4. AI 검색 결과 (상위 3개 카드 팝업 레이아웃) */}
      {searchMode === 'ai' && query.trim() && (
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-rose-50/60 to-white border border-rose-200/80 shadow-md space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-extrabold shadow-2xs">
                🎯
              </span>
              <h3 className="text-sm font-extrabold text-brand-primary">
                AI 분석 매칭 결과 <span className="text-xs font-normal text-rose-700">(적합도 순)</span>
              </h3>
            </div>
            <span className="text-[11px] text-brand-muted">
              8차원 코사인 유사도 분석 완료
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiResults.map((result, idx) => (
              <div
                key={result.ticker}
                className="relative flex flex-col justify-between p-4 rounded-xl bg-white border border-rose-200 hover:border-rose-400 hover:shadow-lg transition-all group"
              >
                {/* 상단 랭킹 & 적합도 뱃지 */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                        idx === 0
                          ? 'bg-amber-500 shadow-2xs'
                          : idx === 1
                          ? 'bg-gray-400'
                          : 'bg-amber-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-black text-brand-primary tracking-tight">
                      {result.ticker}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700">
                      {result.category}
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-2xs shrink-0">
                    적합도 {result.matchPercentage}%
                  </div>
                </div>

                {/* 하이라이트 배지 */}
                <div className="text-[11px] font-bold text-rose-700 mb-2">
                  {result.highlightBadge}
                </div>

                {/* 1줄 추천 사유 */}
                <p className="text-xs text-brand-muted leading-relaxed mb-3 line-clamp-3 bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
                  &ldquo;{result.recommendationReason}&rdquo;
                </p>

                {/* 매칭 키워드 태그 */}
                {result.matchedDimensions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {result.matchedDimensions.slice(0, 2).map((dim, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-100"
                      >
                        #{dim}
                      </span>
                    ))}
                  </div>
                )}

                {/* 역산기로 바로 계산하기 버튼 */}
                <button
                  type="button"
                  onClick={() => handleApplyToCalculator(result.ticker)}
                  className="w-full mt-auto py-2 px-3 rounded-lg bg-brand-primary hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 group-hover:bg-rose-600 cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>역산기로 바로 계산하기</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. 일반 검색 결과 (일반 모드일 때) */}
      {searchMode === 'normal' && query.trim() && (
        <div className="mt-3 p-3 bg-white rounded-xl border border-subtle-border shadow-md space-y-2">
          {normalResults.length === 0 ? (
            <div className="p-4 text-center text-xs text-brand-muted">
              검색된 ETF가 없습니다. 티커명(SCHD, JEPI 등)이나 한글명을 입력해 보세요.
            </div>
          ) : (
            normalResults.map((etf) => (
              <div
                key={etf.ticker}
                className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-0 border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-sm text-brand-primary">{etf.ticker}</span>
                  <span className="text-xs text-brand-muted">{etf.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                    {etf.category}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyToCalculator(etf.ticker)}
                  className="px-3 py-1 rounded-md bg-brand-secondary hover:bg-brand-primary hover:text-white text-brand-primary text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>계산기 적용</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
