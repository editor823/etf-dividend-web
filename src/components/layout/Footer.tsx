'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, TrendingUp, Lock, ShieldAlert, BookOpen, Calculator, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenAdminModal?: () => void;
}

export default function Footer({ onOpenAdminModal }: FooterProps) {
  return (
    <footer className="border-t border-subtle-border bg-white mt-20 text-brand-primary" aria-label="사이트 하단 정보">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* 상단 4개 열 네비게이션 & 정보 레이아웃 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* 1. 브랜드 및 플랫폼 소개 */}
          <div className="sm:col-span-2 space-y-3.5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center shadow-xs group-hover:bg-brand-dark transition-colors">
                <TrendingUp className="w-4 h-4 text-income" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-brand-primary">
                DIVIDEND INTEL
              </span>
            </Link>
            <p className="text-xs text-brand-muted leading-relaxed max-w-sm">
              미국 배당성장(SCHD, DGRO) 및 고인컴(JEPI, JEPQ, SPYI) ETF의 세후 실수령액 역산, 
              복리 스노우볼, 1:1 맞짱 비교 및 12개월 현금흐름 캘린더를 제공하는 독립 금융 인텔리전스 플랫폼입니다.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-brand-muted">
              <Mail className="w-3.5 h-3.5 text-income" />
              <span>문의 및 피드백: </span>
              <a
                href="mailto:editor823@gmail.com"
                className="text-income font-medium hover:underline font-mono"
              >
                editor823@gmail.com
              </a>
            </div>
          </div>

          {/* 2. 6대 핵심 배당 계산기 (내부링크 최적화) */}
          <nav className="space-y-3" aria-label="핵심 계산기 메뉴">
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-income" />
              핵심 배당 계산기
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <Link href="/?tab=reverse#interactive-tools" className="hover:text-brand-primary hover:underline transition-colors block">
                  1. 월 목표 배당 역산기
                </Link>
              </li>
              <li>
                <Link href="/?tab=compare#interactive-tools" className="hover:text-brand-primary hover:underline transition-colors block">
                  2. ETF 1:1 맞짱 비교기
                </Link>
              </li>
              <li>
                <Link href="/?tab=timemachine#interactive-tools" className="hover:text-brand-primary hover:underline transition-colors block">
                  3. 과거 타임머신 백테스터
                </Link>
              </li>
              <li>
                <Link href="/?tab=barbell#interactive-tools" className="hover:text-brand-primary hover:underline transition-colors block">
                  4. 바벨 포트폴리오 최적화기
                </Link>
              </li>
              <li>
                <Link href="/?tab=drip#interactive-tools" className="hover:text-brand-primary hover:underline transition-colors block">
                  5. DRIP 복리 스노우볼
                </Link>
              </li>
              <li>
                <Link href="/?tab=calendar#interactive-tools" className="hover:text-brand-primary hover:underline transition-colors block">
                  6. 12개월 배당 캘린더
                </Link>
              </li>
            </ul>
          </nav>

          {/* 3. 전문 투자 리포트 (심층 아티클 내부링크) */}
          <nav className="space-y-3" aria-label="배당 가이드 메뉴">
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider font-mono flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-income" />
              심층 배당 가이드
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <Link href="/guides" className="hover:text-brand-primary font-bold text-income flex items-center gap-1 transition-colors">
                  <span>전체 가이드 리포트</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/guides/schd-complete-guide" className="hover:text-brand-primary hover:underline transition-colors block line-clamp-1" title="SCHD 배당성장 완벽 분석">
                  SCHD 배당성장 완벽 분석
                </Link>
              </li>
              <li>
                <Link href="/guides/covered-call-mechanics" className="hover:text-brand-primary hover:underline transition-colors block line-clamp-1" title="커버드콜 JEPI·JEPQ 원리와 한계">
                  커버드콜 JEPI·JEPQ 원리
                </Link>
              </li>
              <li>
                <Link href="/guides/isa-vs-direct-investment" className="hover:text-brand-primary hover:underline transition-colors block line-clamp-1" title="국내상장 vs 직투 절세 가이드">
                  국내상장 vs 직투 절세 가이드
                </Link>
              </li>
              <li>
                <Link href="/guides/realty-income-o-vs-jepi" className="hover:text-brand-primary hover:underline transition-colors block line-clamp-1" title="리얼티인컴 vs JEPI 월배당 비교">
                  리얼티인컴 vs JEPI 월배당
                </Link>
              </li>
              <li>
                <Link href="/guides/dividend-barbell-portfolio-strategy" className="hover:text-brand-primary hover:underline transition-colors block line-clamp-1" title="미국 배당 ETF 바벨 포트폴리오 가이드">
                  바벨 포트폴리오 실전 가이드
                </Link>
              </li>
            </ul>
          </nav>

          {/* 4. 정책 및 법적 고지 (구글 애드센스 필수 링크) */}
          <nav className="space-y-3" aria-label="정책 및 소개 메뉴">
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider font-mono">
              회사 소개 &amp; 정책
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <Link href="/about" className="hover:text-brand-primary transition-colors block font-medium">
                  플랫폼 소개 (About Us)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-primary transition-colors block font-medium">
                  개인정보처리방침 (Privacy)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-primary transition-colors block">
                  서비스 이용약관 (Terms)
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-brand-primary transition-colors flex items-center gap-1 text-alert">
                  <ShieldAlert className="w-3 h-3" />
                  <span>투자 면책조항 (Disclaimer)</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* 법적 주의문구 및 하단 카피라이트 */}
        <div className="pt-8 border-t border-subtle-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-[11px] text-brand-muted/80">
              본 사이트에서 제공하는 모든 시뮬레이션 및 데이터는 투자 참고용 정보 제공 목적이며 금융투자상품의 매매 권유가 아닙니다. 모든 투자의 결과와 책임은 투자자 본인에게 귀속됩니다.
            </p>
            <p className="text-[11px] font-mono">
              Copyright © 2026 DIVIDEND INTEL. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {onOpenAdminModal && (
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-brand-secondary text-brand-muted hover:text-brand-primary transition-colors cursor-pointer text-xs"
                title="관리자 전용 시스템 모드"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>관리자 모드</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
