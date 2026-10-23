import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Calculator,
  TrendingUp,
} from 'lucide-react';
import { GUIDE_POSTS } from '@/lib/data/guides-data';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdBannerSlot from '@/components/ads/AdBannerSlot';
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
      title: '가이드를 찾을 수 없습니다',
    };
  }

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `https://etf-dividend-web.pages.dev/guides/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | 디비던드 인텔`,
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

  const BASE_URL = 'https://etf-dividend-web.pages.dev';

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    image: [`${BASE_URL}/og-image.jpg`],
    datePublished: `${post.publishedDate}T09:00:00+09:00`,
    dateModified: `${post.publishedDate}T09:00:00+09:00`,
    author: [
      {
        '@type': 'Person',
        name: post.author.name,
        jobTitle: post.author.role,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'DIVIDEND INTEL',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/guides/${post.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '배당 투자 가이드',
        item: `${BASE_URL}/guides`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${BASE_URL}/guides/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col selection:bg-brand-secondary selection:text-brand-primary">
      {/* 구글 검색엔진용 Article & Breadcrumb 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 전역 통합 헤더 */}
      <Header />

      {/* 아티클 본문 영역 */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        {/* 상단 브레드크럼 (Breadcrumb) 네비게이션 */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-muted font-medium">
          <Link href="/" className="hover:text-brand-primary hover:underline">홈</Link>
          <span className="text-brand-muted/60">/</span>
          <Link href="/guides" className="hover:text-brand-primary hover:underline">배당 투자 가이드</Link>
          <span className="text-brand-muted/60">/</span>
          <span className="text-brand-primary font-bold truncate max-w-[200px] sm:max-w-md">{post.category}</span>
        </nav>

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

        {/* 상단 광고 슬롯 */}
        <AdBannerSlot slotId="guide-top-slot" className="my-6" />

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

        {/* 하단 광고 슬롯 */}
        <AdBannerSlot slotId="guide-bottom-slot" className="my-8" />

        {/* 1. 관련 핵심 계산기 바로가기 배너 */}
        <div className="pt-8 border-t border-subtle-border">
          <div className="bg-gradient-to-br from-brand-secondary/60 to-income-light/30 border border-subtle-border p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-income" />
              <h4 className="text-base font-bold text-brand-primary">
                리포트 전략을 내 자본금으로 직접 시뮬레이션해 보세요
              </h4>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              본 가이드에서 다룬 배당성장 및 커버드콜 종목을 바탕으로 목표 월배당액, 1:1 골든크로스 역전 시점, 12개월 캘린더를 무료로 계산할 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <Link
                href="/?tab=reverse#interactive-tools"
                className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>1. 목표 월배당 역산기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/?tab=compare#interactive-tools"
                className="px-4 py-2 rounded-xl bg-white hover:bg-brand-secondary text-brand-primary border border-subtle-border text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span>2. ETF 1:1 맞짱 비교기</span>
                <ArrowRight className="w-3.5 h-3.5 text-income" />
              </Link>
              <Link
                href="/?tab=barbell#interactive-tools"
                className="px-4 py-2 rounded-xl bg-white hover:bg-brand-secondary text-brand-primary border border-subtle-border text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span>3. 바벨 포트폴리오 최적화기</span>
                <ArrowRight className="w-3.5 h-3.5 text-income" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. 다른 추천 배당 리포트 이어보기 (오프라인/막다른 길 방지) */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-brand-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-income" />
              다른 심층 분석 리포트 이어보기
            </h4>
            <Link
              href="/guides"
              className="text-xs font-bold text-income hover:underline flex items-center gap-1"
            >
              <span>전체 목록</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GUIDE_POSTS.filter((p) => p.slug !== post.slug).map((otherPost) => (
              <Link
                key={otherPost.slug}
                href={`/guides/${otherPost.slug}`}
                className="group bg-white rounded-2xl border border-subtle-border p-5 shadow-xs hover:shadow-card hover:border-income/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-secondary text-brand-primary">
                    {otherPost.category}
                  </span>
                  <h5 className="text-sm font-bold text-brand-primary group-hover:text-income transition-colors line-clamp-2">
                    {otherPost.title}
                  </h5>
                  <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                    {otherPost.summary}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-subtle-border/60 flex items-center justify-between text-xs text-income font-bold">
                  <span>리포트 읽기</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* 글로벌 푸터 */}
      <Footer />
    </div>
  );
}
