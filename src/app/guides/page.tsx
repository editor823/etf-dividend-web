import Link from 'next/link';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  BookmarkCheck,
} from 'lucide-react';
import { GUIDE_POSTS } from '@/lib/data/guides-data';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdBannerSlot from '@/components/ads/AdBannerSlot';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '전문 배당 투자 가이드 & 심층 분석 리포트',
  description:
    'SCHD 10년 배당성장률 검증, 커버드콜 JEPI·JEPQ 옵션 작동 원리와 한계, 국내 상장 ETF vs 미국 직투 세금 비교 등 실전 투자자를 위한 E-E-A-T 검증 배당 리포트 모음.',
  openGraph: {
    title: '전문 배당 투자 가이드 & 분석 리포트 | 디비던드 인텔',
    description:
      'SCHD 10년 배당성장률 검증, 커버드콜 JEPI·JEPQ 옵션 작동 원리 및 세금 비교 심층 리포트',
    url: 'https://etf-dividend-web.pages.dev/guides',
    siteName: '디비던드 인텔 (DIVIDEND INTEL)',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '디비던드 인텔 배당 투자 가이드',
      },
    ],
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col selection:bg-brand-secondary selection:text-brand-primary">
      {/* 전역 통합 헤더 */}
      <Header />

      {/* 가이드 목록 메인 영역 */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
        {/* 상단 히어로 헤더 섹션 (E-E-A-T 전문성 강조) */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-income-light text-income text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
            <span>E-E-A-T 금융 리서치 & 퀀트 분석 가이드</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-primary tracking-tight leading-tight">
            전문 배당 투자 가이드 &amp; <br className="hidden sm:inline" />
            <span className="text-income underline decoration-income/30 decoration-wavy">
              심층 분석 리포트
            </span>
          </h1>

          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            단순한 과거 배당률 나열을 넘어, 기초지수의 4단계 필터링 알고리즘부터
            커버드콜 옵션 구조, ISA 및 연금저축 계좌 절세 전략까지 데이터로 엄밀히
            검증된 투자 인사이트를 무료로 제공합니다.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-brand-muted font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-income" />
              100% 무료 공개
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-income" />
              미국 증시 최신 메커니즘 반영
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-income" />
              세무·옵션 실전 시뮬레이션 연계
            </span>
          </div>
        </section>

        {/* 상단 광고 슬롯 (구글 애드센스 승인 후 표시) */}
        <AdBannerSlot slotId="guides-list-top-slot" className="my-4" />

        {/* 3대 심층 가이드 아티클 매거진 카드 그리드 */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-subtle-border pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-brand-primary">
              <BookOpen className="w-4 h-4 text-income" />
              <span>최신 심층 리포트 (전체 {GUIDE_POSTS.length}편)</span>
            </div>
            <span className="text-xs text-brand-muted font-mono">
              Updated: 2026.10
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {GUIDE_POSTS.map((post, idx) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-subtle-border p-6 sm:p-7 shadow-card hover:shadow-elevated hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* 상단 액센트 바 */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-secondary via-income to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  {/* 카테고리 뱃지 & 읽는 시간 & 발행일 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-income-light text-income font-extrabold text-[11px]">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-brand-muted font-mono text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.publishedDate}
                      </span>
                    </div>
                  </div>

                  {/* 제목 */}
                  <h2 className="text-lg sm:text-xl font-bold text-brand-primary group-hover:text-income transition-colors line-clamp-2 leading-snug">
                    <Link href={`/guides/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  {/* 핵심 요약 2줄 */}
                  <p className="text-xs sm:text-sm text-brand-muted line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>

                  {/* 핵심 체크포인트 1개 미리보기 */}
                  {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                    <div className="p-3 rounded-xl bg-brand-bg/70 border border-subtle-border/60 text-[11px] text-brand-primary/80 flex items-start gap-2">
                      <BookmarkCheck className="w-3.5 h-3.5 text-income shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{post.keyTakeaways[0]}</span>
                    </div>
                  )}

                  {/* 작성자 정보 */}
                  <div className="pt-2 border-t border-subtle-border/60 flex items-center justify-between text-[11px] text-brand-muted">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3 h-3 text-income" />
                      {post.author.name}
                    </span>
                    <span className="font-mono text-brand-muted/70">
                      Report #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* 가이드 읽기 버튼 */}
                <div className="pt-6 mt-4">
                  <Link
                    href={`/guides/${post.slug}`}
                    className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-brand-secondary group-hover:bg-brand-primary group-hover:text-white text-brand-primary text-xs font-bold transition-all shadow-2xs"
                  >
                    <span>가이드 읽기</span>
                    <ArrowRight className="w-4 h-4 text-income group-hover:text-white group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 하단 계산기 바로가기 배너 */}
        <section className="bg-brand-primary text-white rounded-3xl p-8 sm:p-10 shadow-elevated relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-income-light text-xs font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-income" />
              <span>INTERACTIVE TOOLS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              이론을 배웠다면, 직접 시뮬레이션해 보세요
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
              목표 월배당 역산기, 1:1 맞짱 비교기, 과거 타임머신, 바벨 전략, DRIP
              스노우볼, 12개월 캘린더까지 모두 무료로 제공됩니다.
            </p>
          </div>

          <Link
            href="/"
            className="z-10 px-6 py-3.5 rounded-xl bg-white hover:bg-brand-secondary text-brand-primary text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>계산기 대시보드 바로가기</span>
            <ArrowRight className="w-4 h-4 text-income" />
          </Link>
        </section>

        {/* 하단 광고 슬롯 */}
        <AdBannerSlot slotId="guides-list-bottom-slot" className="my-6" />
      </main>

      {/* 글로벌 푸터 */}
      <Footer />
    </div>
  );
}
