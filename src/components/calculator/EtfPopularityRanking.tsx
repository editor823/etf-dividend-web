'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Copy,
  Check,
  Flame,
  PiggyBank,
  Info,
  Scale,
} from 'lucide-react';
import {
  SEOHAK_RANKINGS_DATA,
  DONGHAK_RANKINGS_DATA,
  RankingCategory,
  SeohakRankItem,
  DonghakRankItem,
} from '@/lib/data/etf-rankings';

const CATEGORIES: { id: RankingCategory; label: string }[] = [
  { id: 'ALL', label: '전체 TOP' },
  { id: '배당성장', label: '🌱 배당성장' },
  { id: '고배당 커버드콜', label: '💰 고배당 커버드콜' },
  { id: '시장지수/빅테크', label: '📈 시장지수/빅테크' },
  { id: '월배당 리츠/채권', label: '🏢 리츠/채권' },
];

export default function EtfPopularityRanking() {
  const [activeTab, setActiveTab] = useState<'seohak' | 'donghak'>('seohak');
  const [selectedCategory, setSelectedCategory] = useState<RankingCategory>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  // 카테고리 필터링된 서학 데이터
  const filteredSeohak = useMemo(() => {
    if (selectedCategory === 'ALL') return SEOHAK_RANKINGS_DATA;
    return SEOHAK_RANKINGS_DATA.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // 카테고리 필터링된 동학 데이터
  const filteredDonghak = useMemo(() => {
    if (selectedCategory === 'ALL') return DONGHAK_RANKINGS_DATA;
    return DONGHAK_RANKINGS_DATA.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section className="bg-white rounded-3xl border border-subtle-border p-5 sm:p-8 shadow-card space-y-6">
      {/* 1. 헤더 섹션 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-subtle-border pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-300/40 text-amber-800 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span>2026 대한민국 배당 투자자 실시간 인기 랭킹</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
            서학개미 vs 동학개미 ETF 인기 순위 &amp; 절세 매칭
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted">
            달러($)로 직접 사는 <strong className="text-brand-primary">서학개미 오리지널 종목</strong>과 ISA·연금계좌에서 세금을 아끼는 <strong className="text-brand-primary">동학개미 한국판 종목</strong>을 카테고리별로 완벽 비교하세요.
          </p>
        </div>

        {/* 서학 vs 동학 대형 토글 탭 */}
        <div className="inline-flex p-1 bg-brand-secondary/70 rounded-2xl border border-subtle-border shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('seohak')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'seohak'
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-brand-primary/70 hover:text-brand-primary'
            }`}
          >
            <span>🇺🇸 서학개미 랭킹</span>
            <span className="text-[10px] opacity-80 font-mono">(미국 직투)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('donghak')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'donghak'
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-brand-primary/70 hover:text-brand-primary'
            }`}
          >
            <span>🇰🇷 동학개미 랭킹</span>
            <span className="text-[10px] opacity-80 font-mono">(국내 상장/절세)</span>
          </button>
        </div>
      </div>

      {/* 2. 카테고리 필터 탭 바 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                : 'bg-brand-bg text-brand-muted hover:text-brand-primary border-subtle-border hover:bg-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. 탭별 핵심 특징 및 계좌 꿀팁 안내 배너 */}
      {activeTab === 'seohak' ? (
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-4 rounded-2xl border border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-blue-900 block text-xs sm:text-sm">
                서학개미 미국 직투 핵심 포인트
              </span>
              <span className="text-blue-950/80">
                일반 위탁계좌에서 <strong>달러($)</strong>로 매수 | 연간 <strong>250만 원 매매차익 비과세</strong> | 미국 배당소득세 15% 원천징수
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold font-mono self-start sm:self-auto shrink-0">
            원조 오리지널 종목
          </span>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-white p-4 rounded-2xl border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-emerald-900 block text-xs sm:text-sm">
                동학개미 절세 계좌 매수 핵심 포인트
              </span>
              <span className="text-emerald-950/80">
                <strong>ISA 계좌(최대 400만 비과세 + 9.9% 분리과세)</strong> &amp; <strong>연금저축/IRP(연 900만 세액공제 + 3.3~5.5% 과세이연)</strong> 전용
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold font-mono">
              실질 총비용(TER) 표기
            </span>
          </div>
        </div>
      )}

      {/* 4. 종목 랭킹 리스트 그리드 */}
      <div className="space-y-3">
        {activeTab === 'seohak' ? (
          // 서학개미 랭킹 카드 리스트
          filteredSeohak.map((item: SeohakRankItem) => (
            <div
              key={item.ticker}
              className="group p-4 sm:p-5 rounded-2xl bg-brand-bg/70 hover:bg-white border border-subtle-border hover:border-income/40 transition-all hover:shadow-md space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* 순위 + 종목 기본정보 */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                      item.rank === 1
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : item.rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : item.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-white border border-subtle-border text-brand-muted'
                    }`}
                  >
                    {item.rank <= 3 ? `👑 ${item.rank}` : item.rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base sm:text-lg text-brand-primary tracking-tight">
                        {item.ticker}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-brand-muted">
                        {item.nameKo}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.frequency === '월배당'
                            ? 'bg-income-light text-income'
                            : 'bg-brand-secondary text-brand-primary'
                        }`}
                      >
                        {item.frequency}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-brand-muted">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted line-clamp-1 mt-0.5">
                      {item.highlight}
                    </p>
                  </div>
                </div>

                {/* 배당 수치 및 보수 정보 */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 self-end sm:self-auto text-right">
                  <div>
                    <span className="text-[10px] text-brand-muted block font-mono">
                      시가배당률
                    </span>
                    <span className="text-sm sm:text-base font-black text-income font-mono">
                      연 {item.yieldPercent}%
                    </span>
                  </div>

                  {item.dividendGrowth5y && (
                    <div className="hidden xs:block">
                      <span className="text-[10px] text-brand-muted block font-mono">
                        5년 배당성장
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-brand-primary font-mono">
                        +{item.dividendGrowth5y}%
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] text-brand-muted block font-mono">
                      운용보수
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-brand-muted font-mono">
                      {item.expenseRatio}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 서학 ⇄ 동학 절세 매칭 연결 박스 */}
              <div className="p-3 rounded-xl bg-white border border-subtle-border/80 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-start md:items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] shrink-0 font-mono mt-0.5 md:mt-0">
                    🇰🇷 ISA/연금 대체 종목
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.matchedDonghak.map((dh) => (
                      <span
                        key={dh.code}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-secondary/60 text-brand-primary font-semibold text-xs border border-subtle-border/50 group/item"
                        title={`${dh.reason} (표기 보수: ${dh.statedExpense}% / 실질 총비용: 약 ${dh.realTotalExpense}%)`}
                      >
                        <span className="font-bold">{dh.name}</span>
                        <span className="text-[11px] font-mono text-income font-bold">
                          {dh.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(dh.code)}
                          className="hover:text-income transition-colors p-0.5"
                          title="종목코드 복사"
                        >
                          {copiedCode === dh.code ? (
                            <Check className="w-3.5 h-3.5 text-income" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-brand-muted" />
                          )}
                        </button>
                        {/* 실질 수수료 TER 배지 */}
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white text-brand-muted border border-subtle-border font-mono">
                          실질 {dh.realTotalExpense}%
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/?tab=compare"
                  className="inline-flex items-center gap-1 text-xs font-bold text-income hover:text-income-dark self-end md:self-auto shrink-0 group/btn"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>맞짱 비교기에서 분석</span>
                </Link>
              </div>
            </div>
          ))
        ) : (
          // 동학개미 랭킹 카드 리스트
          filteredDonghak.map((item: DonghakRankItem) => (
            <div
              key={item.code}
              className="group p-4 sm:p-5 rounded-2xl bg-brand-bg/70 hover:bg-white border border-subtle-border hover:border-income/40 transition-all hover:shadow-md space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* 순위 + 종목 기본정보 */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                      item.rank === 1
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : item.rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : item.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-white border border-subtle-border text-brand-muted'
                    }`}
                  >
                    {item.rank <= 3 ? `👑 ${item.rank}` : item.rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base sm:text-lg text-brand-primary tracking-tight">
                        {item.nameKo}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.code)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-secondary text-brand-primary text-xs font-mono font-bold hover:bg-income hover:text-white transition-colors"
                        title="종목코드 복사"
                      >
                        <span>{item.code}</span>
                        {copiedCode === item.code ? (
                          <Check className="w-3 h-3 text-income" />
                        ) : (
                          <Copy className="w-3 h-3 opacity-60" />
                        )}
                      </button>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.frequency === '월배당'
                            ? 'bg-income-light text-income'
                            : 'bg-brand-secondary text-brand-primary'
                        }`}
                      >
                        {item.frequency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brand-muted mt-0.5">
                      <span>{item.issuer}</span>
                      <span>•</span>
                      <span>순자산 {item.aum}</span>
                    </div>
                  </div>
                </div>

                {/* 배당 수치 및 실질 총보수(TER) 정보 */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 self-end sm:self-auto text-right">
                  <div>
                    <span className="text-[10px] text-brand-muted block font-mono">
                      연 분배율
                    </span>
                    <span className="text-sm sm:text-base font-black text-income font-mono">
                      연 {item.yieldPercent}%
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-brand-muted font-mono">
                      <span>실질 총비용(TER)</span>
                      <Info className="w-3 h-3 text-brand-muted" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-brand-muted line-through">
                        {item.statedExpense}%
                      </span>
                      <span className="text-xs sm:text-sm font-black text-brand-primary font-mono">
                        약 {item.realTotalExpense}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 매칭된 미국 오리지널 종목 & 절세계좌 뱃지 */}
              <div className="p-3 rounded-xl bg-white border border-subtle-border/80 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px] shrink-0 font-mono">
                    🇺🇸 원조 미국 종목
                  </span>
                  <span className="font-bold text-brand-primary">
                    {item.matchedSeohakTicker} ({item.matchedSeohakName.split(' ')[0]})
                  </span>
                  <span className="text-brand-muted text-[11px] hidden sm:inline">
                    동일 지수/전략 추종
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ISA 비과세
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                    연금저축/IRP 세액공제
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. 실질 수수료(TER) 안내 박스 */}
      <div className="p-4 rounded-2xl bg-brand-bg border border-subtle-border text-xs text-brand-muted space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-brand-primary">
          <Info className="w-4 h-4 text-income" />
          <span>💡 한국 상장 ETF &lsquo;숨은 실질 수수료(TER)&rsquo;란 무엇인가요?</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          운용사 홈페이지나 증권사 앱에 표기된 <strong>&lsquo;총보수(운용보수, 예: 0.01%)&rsquo;</strong> 외에도, 펀드 운용 과정에서 발생하는 <strong>기타비용(사무수탁, 평가보수 등)</strong>과 <strong>매매·중개 수수료율</strong>이 매일 펀드 순자산가치(NAV)에서 자동으로 차감됩니다. 본 플랫폼은 금융투자협회 공시 기준 <strong>실질 총비용</strong>을 투명하게 안내합니다.
        </p>
      </div>
    </section>
  );
}
