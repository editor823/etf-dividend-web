import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, TrendingUp, Sparkles, Home } from 'lucide-react';
import { GUIDE_POSTS } from '@/lib/data/guides-data';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '미국 배당 ETF 심층 투자 가이드 & 분석 리포트 | ETF Intelligence',
  description:
    'SCHD 10년 배당성장 분석, 커버드콜 JEPI·JEPQ 작동 원리, ISA 및 연금저축 절세 전략 등 실전 미국 배당 투자 가이드를 확인하세요.',
};

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-subtle-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-md group-hover:bg-brand-dark transition-colors">
              <TrendingUp className="w-5 h-5 text-income" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-brand-primary block leading-none">
                DIVIDEND INTEL
              </span>
              <span className="text-xs text-brand-muted font-mono">
                투자 인사이트 가이드
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-secondary hover:bg-brand-secondaryHover text-brand-primary text-xs font-bold transition-all"
          >
            <Home className="w-4 h-4 text-income" />
            <span>대시보드로 돌아가기</span>
          </Link>
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold">
            <BookOpen className="w-4 h-4 text-income" />
            E-E-A-T 검증 전문 투자 리서치
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight">
            미국 배당 ETF 심층 분석 가이드
          </h1>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            단순한 수익률 나열을 넘어 지수 선별 알고리즘, 파생상품 옵션 구조,
            세법상 절세 계좌 비교까지 정밀하게 검증된 심층 리포트를 제공합니다.
          </p>
        </div>

        {/* 아티클 카드 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDE_POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-2xl border border-subtle-border p-6 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-income-light text-income font-bold">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-brand-muted font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-brand-primary group-hover:text-income transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-brand-muted line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>

                <div className="pt-2 border-t border-subtle-border/60">
                  <p className="text-[11px] text-brand-muted flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-income" />
                    작성: {post.author.name}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4">
                <Link
                  href={`/guides/${post.slug}`}
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-brand-secondary group-hover:bg-brand-primary group-hover:text-white text-brand-primary text-xs font-bold transition-all"
                >
                  <span>상세 리포트 읽기</span>
                  <ArrowRight className="w-4 h-4 text-income group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* 글로벌 푸터 */}
      <Footer />
    </div>
  );
}
