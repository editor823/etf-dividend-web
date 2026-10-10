import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { GUIDE_POSTS } from '@/lib/data/guides-data';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return GUIDE_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = GUIDE_POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: '가이드를 찾을 수 없습니다 | ETF Intelligence',
    };
  }

  return {
    title: `${post.title} | ETF Intelligence 심층 리포트`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      url: `https://etf-dividend-web.pages.dev/guides/${post.slug}`,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default function GuideDetailPage({ params }: Props) {
  const post = GUIDE_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col selection:bg-brand-secondary selection:text-brand-primary">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-subtle-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-md group-hover:bg-brand-dark transition-colors">
              <TrendingUp className="w-5 h-5 text-income" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-brand-primary block leading-none">
                DIVIDEND INTEL
              </span>
              <span className="text-xs text-brand-muted font-mono">
                투자 인사이트 리서치
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-secondary hover:bg-brand-secondaryHover text-brand-primary text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>가이드 목록</span>
            </Link>
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition-all"
            >
              <span>계산기 대시보드</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 아티클 본문 영역 */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        {/* 상단 메타 헤더 */}
        <div className="space-y-4 border-b border-subtle-border pb-8">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="px-3 py-1 rounded-md bg-income-light text-income font-bold">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-brand-muted font-mono">
              <Clock className="w-3.5 h-3.5" />
              읽는 시간: {post.readTime}
            </span>
            <span className="flex items-center gap-1 text-brand-muted font-mono">
              <Calendar className="w-3.5 h-3.5" />
              발행일: {post.publishedDate}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-primary tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed font-medium">
            {post.subtitle}
          </p>

          {/* 작성자 정보 (E-E-A-T) */}
          <div className="pt-4 flex items-center justify-between text-xs border-t border-subtle-border/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                EI
              </div>
              <div>
                <p className="font-bold text-brand-primary">{post.author.name}</p>
                <p className="text-[11px] text-brand-muted">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] text-income font-semibold bg-income-light px-2.5 py-1 rounded-md">
                E-E-A-T 검증 완료
              </span>
            </div>
          </div>
        </div>

        {/* 핵심 요약 콜아웃 (Executive Summary) */}
        <div className="bg-brand-secondary/40 border border-brand-primary/10 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
            <BookOpen className="w-4 h-4 text-income" />
            <span>핵심 리서치 요약 (Key Takeaways)</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-brand-primary/85 leading-relaxed">
            {post.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-income shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 본문 텍스트 (Typography 최적화) */}
        <article className="prose prose-neutral max-w-none text-brand-primary/90 text-sm sm:text-base leading-relaxed space-y-6">
          {post.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // H2 제목
            if (trimmed.startsWith('## ')) {
              return (
                <h2
                  key={index}
                  className="text-2xl sm:text-3xl font-extrabold text-brand-primary pt-8 pb-2 border-b border-subtle-border"
                >
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }

            // H3 제목
            if (trimmed.startsWith('### ')) {
              return (
                <h3
                  key={index}
                  className="text-lg sm:text-xl font-bold text-brand-primary pt-4 text-income"
                >
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }

            // 구분선
            if (trimmed === '---') {
              return <hr key={index} className="my-8 border-subtle-border" />;
            }

            // 인용구
            if (trimmed.startsWith('> ')) {
              return (
                <blockquote
                  key={index}
                  className="border-l-4 border-income bg-income-light/30 p-4 rounded-r-xl text-xs sm:text-sm italic text-brand-primary/80 my-4"
                >
                  {trimmed.replace(/> /g, '')}
                </blockquote>
              );
            }

            // 테이블 감지 (마크다운 표 변환)
            if (trimmed.includes('|') && trimmed.includes('\n|')) {
              const rows = trimmed.split('\n').filter((r) => r.trim().startsWith('|'));
              if (rows.length >= 2) {
                const headerCells = rows[0]
                  .split('|')
                  .filter((c) => c.trim().length > 0)
                  .map((c) => c.trim());
                const bodyRows = rows.slice(2);

                return (
                  <div key={index} className="overflow-x-auto my-6">
                    <table className="w-full text-xs sm:text-sm border-collapse bg-white rounded-xl shadow-xs overflow-hidden border border-subtle-border">
                      <thead>
                        <tr className="bg-brand-secondary text-brand-primary text-left">
                          {headerCells.map((h, hIdx) => (
                            <th key={hIdx} className="p-3 font-bold border-b border-subtle-border">
                              {h.replace(/\*\*/g, '')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bodyRows.map((row, rIdx) => {
                          const cells = row
                            .split('|')
                            .filter((c) => c.trim().length > 0)
                            .map((c) => c.trim());
                          return (
                            <tr
                              key={rIdx}
                              className="border-b border-subtle-border/60 hover:bg-brand-bg/50 transition-colors"
                            >
                              {cells.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3">
                                  {cell.replace(/\*\*/g, '')}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
            }

            // 불릿 목록
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
              const items = trimmed.split('\n').filter((l) => l.trim().length > 0);
              return (
                <ul key={index} className="space-y-1.5 list-disc list-inside text-xs sm:text-sm my-3 pl-2">
                  {items.map((item, iIdx) => (
                    <li key={iIdx} className="leading-relaxed">
                      {item.replace(/^[*|-]\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                    </li>
                  ))}
                </ul>
              );
            }

            // 일반 문단
            return (
              <p key={index} className="text-xs sm:text-sm sm:leading-loose text-brand-primary/85">
                {trimmed}
              </p>
            );
          })}
        </article>

        {/* 아티클 하단 CTA */}
        <div className="pt-10 border-t border-subtle-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-card border border-subtle-border">
          <div>
            <h4 className="text-base font-bold text-brand-primary">
              실제 내 투자금으로 직접 시뮬레이션해 보세요
            </h4>
            <p className="text-xs text-brand-muted mt-1">
              목표 월배당 역산기, 1:1 맞짱 비교기, 과거 타임머신을 무료로 체험할 수 있습니다.
            </p>
          </div>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition-all text-center shrink-0 shadow-sm"
          >
            계산기 대시보드 바로가기
          </Link>
        </div>
      </main>

      {/* 글로벌 푸터 */}
      <Footer />
    </div>
  );
}
