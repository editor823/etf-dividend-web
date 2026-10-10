'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, TrendingUp, Lock, ShieldAlert, BookOpen } from 'lucide-react';

interface FooterProps {
  onOpenAdminModal?: () => void;
}

export default function Footer({ onOpenAdminModal }: FooterProps) {
  return (
    <footer className="border-t border-subtle-border bg-white mt-20 text-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* 상단 3열 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 및 플랫폼 소개 */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center shadow-xs group-hover:bg-brand-dark transition-colors">
                <TrendingUp className="w-4 h-4 text-income" />
              </div>
              <span className="font-bold text-base tracking-tight text-brand-primary">
                DIVIDEND INTEL
              </span>
            </Link>
            <p className="text-xs text-brand-muted leading-relaxed max-w-sm">
              미국 배당성장 및 고인컴 ETF(SCHD, JEPI, JEPQ, VOO)의 세후 실수령액 역산, 
              복리 스노우볼, 1:1 맞짱 비교 및 12개월 현금흐름 캘린더를 제공하는 독립 금융 인텔리전스 플랫폼입니다.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-brand-muted">
              <Mail className="w-3.5 h-3.5 text-income" />
              <span>문의: </span>
              <a
                href="mailto:editor823@gmail.com"
                className="text-income font-medium hover:underline font-mono"
              >
                editor823@gmail.com
              </a>
            </div>
          </div>

          {/* 서비스 & 가이드 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider font-mono">
              서비스 & 분석
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <Link href="/" className="hover:text-brand-primary transition-colors">
                  계산기 대시보드
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-brand-primary transition-colors flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-income" />
                  배당 투자 가이드 리포트
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-primary transition-colors">
                  플랫폼 소개 (About Us)
                </Link>
              </li>
            </ul>
          </div>

          {/* 정책 및 법적 고지 (구글 애드센스 필수 링크) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider font-mono">
              정책 및 법적 고지
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <Link href="/privacy" className="hover:text-brand-primary transition-colors font-medium">
                  개인정보처리방침 (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-primary transition-colors">
                  서비스 이용약관 (Terms)
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-brand-primary transition-colors flex items-center gap-1 text-alert">
                  <ShieldAlert className="w-3 h-3" />
                  투자 면책조항 (Disclaimer)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 법적 주의문구 및 하단 카피라이트 */}
        <div className="pt-8 border-t border-subtle-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-[11px] text-brand-muted/80">
              본 사이트에서 제공하는 모든 시뮬레이션 및 데이터는 참고용 정보 제공 목적이며 금융투자상품의 매매 권유가 아닙니다. 모든 투자의 결과와 책임은 투자자 본인에게 귀속됩니다.
            </p>
            <p className="text-[11px] font-mono">
              Copyright © 2026 DIVIDEND INTEL. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {onOpenAdminModal && (
              <button
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
