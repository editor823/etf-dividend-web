'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  X,
  Server,
  Database,
  Cpu,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  KeyRound,
  AlertCircle,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSupabaseConfigured: boolean;
}

const ADMIN_PASSWORD_HASH = '!ekrnfl8259';
const STORAGE_KEY = 'etf_admin_auth';

export default function AdminDashboardModal({
  isOpen,
  onClose,
  isSupabaseConfigured,
}: AdminDashboardModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = sessionStorage.getItem(STORAGE_KEY);
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // 모달이 열려있을 때 뒷배경(바탕화면) 마우스 휠 스크롤 방지
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD_HASH) {
      setIsAuthenticated(true);
      setErrorMsg('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      }
    } else {
      setErrorMsg('비밀번호가 올바르지 않습니다. 다시 입력해주세요.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setErrorMsg('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-brand-primary/15 overflow-hidden">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 bg-brand-primary text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              {isAuthenticated ? (
                <Unlock className="w-4 h-4 text-income" />
              ) : (
                <Lock className="w-4 h-4 text-amber-300" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">시스템 인프라 관리자 모드</h3>
              <p className="text-[11px] text-white/70">
                {isAuthenticated ? '인증 완료 • 관리자 전용 대시보드' : '보안 접근 통제 구역'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 바디 컨텐츠 */}
        <div className="p-6">
          {!isAuthenticated ? (
            /* 비밀번호 입력 폼 */
            <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto py-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-secondary flex items-center justify-center text-brand-primary">
                <KeyRound className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-brand-primary">관리자 비밀번호 확인</h4>
                <p className="text-xs text-brand-muted">
                  내부 아키텍처 및 시스템 진단 정보를 열람하려면 관리자 암호를 입력하세요.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-left">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="관리자 비밀번호"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-subtle-border focus:outline-none focus:ring-2 focus:ring-income/30 focus:border-income text-sm"
                />
                {errorMsg && (
                  <p className="text-xs text-alert flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMsg}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-sm font-bold transition-all shadow-sm"
              >
                관리자 모드 접속
              </button>
            </form>
          ) : (
            /* 관리자 전용 시스템 진단 대시보드 */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-brand-secondary/40 border border-brand-primary/10">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-income/10 text-income text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Phase 4 파이프라인 가동 중
                  </span>
                  <span className="text-xs text-brand-muted">
                    24시간 0원 서버리스 아키텍처
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-alert hover:underline font-semibold text-right"
                >
                  관리자 모드 잠금(로그아웃)
                </button>
              </div>

              {/* 시스템 진단 카드 3종 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-subtle-border shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-brand-primary">
                    <div className="p-2 rounded-lg bg-brand-secondary">
                      <Server className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-brand-muted font-medium">프레임워크</span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-primary">Next.js 14 App Router</h4>
                  <p className="text-[11px] text-income mt-1 font-mono font-semibold">
                    Static Export Ready
                  </p>
                  <p className="text-[11px] text-brand-muted mt-0.5">Cloudflare Pages Edge CDN</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-subtle-border shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-income">
                    <div className="p-2 rounded-lg bg-income-light">
                      <Database className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-brand-muted font-medium">백엔드 연동</span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-primary">Supabase PostgreSQL</h4>
                  <p className="text-[11px] text-income mt-1 font-mono font-semibold">
                    {isSupabaseConfigured ? 'API Connected' : '하이브리드 모드 가동'}
                  </p>
                  <p className="text-[11px] text-brand-muted mt-0.5">Row Level Security (RLS)</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-subtle-border shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-brand-primary">
                    <div className="p-2 rounded-lg bg-brand-secondary">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-brand-muted font-medium">인터랙티브 모듈</span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-primary">6대 핵심 엔진 가동</h4>
                  <p className="text-[11px] text-income mt-1 font-mono font-semibold">
                    포트폴리오 저장 연동
                  </p>
                  <p className="text-[11px] text-brand-muted mt-0.5">역산/비교/타임머신/바벨/복리/달력</p>
                </div>
              </div>

              {/* 자동화 크론 및 인프라 상태 세부정보 */}
              <div className="p-4 rounded-2xl bg-white border border-subtle-border space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-subtle-border pb-2">
                  <span className="font-bold text-brand-primary flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-income" />
                    자동화 파이프라인 (GitHub Actions)
                  </span>
                  <span className="font-mono text-income bg-income/10 px-2 py-0.5 rounded">
                    cron: 0 22 * * 1-5 (KST 07:00)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-brand-muted">대상 ETF:</span>{' '}
                    <span className="font-mono font-semibold text-brand-primary">
                      SCHD, JEPI, JEPQ, VOO, QQQ, DIVO
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-muted">데이터 소스:</span>{' '}
                    <span className="font-semibold text-brand-primary">Yahoo Finance v4</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">배포 호스팅:</span>{' '}
                    <span className="font-semibold text-brand-primary">Cloudflare Pages</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">배포 URL:</span>{' '}
                    <a
                      href="https://etf-dividend-web.pages.dev"
                      target="_blank"
                      rel="noreferrer"
                      className="text-income underline inline-flex items-center gap-0.5"
                    >
                      etf-dividend-web.pages.dev
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-dark transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
