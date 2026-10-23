'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Bookmark,
  CheckCircle2,
  FolderHeart,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { saveUserPortfolio, SavePortfolioPayload } from '@/lib/services/etf-service';
import { isSupabaseConfigured } from '@/lib/supabase';

interface SavePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHoldings: Array<{
    ticker: string;
    shares: number;
    targetWeight?: number;
  }>;
  monthlyContribution?: number;
  dripEnabled?: boolean;
}

export default function SavePortfolioModal({
  isOpen,
  onClose,
  currentHoldings,
  monthlyContribution = 500,
  dripEnabled = true,
}: SavePortfolioModalProps) {
  const { user, signInWithGoogle, signInWithDemo } = useAuth();
  const [portfolioName, setPortfolioName] = useState('나의 미국 배당 포트폴리오');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setErrorMsg('');

    const payload: SavePortfolioPayload = {
      portfolioName,
      monthlyContribution,
      dripEnabled,
      holdings: currentHoldings.filter((h) => h.shares > 0),
    };

    const res = await saveUserPortfolio(user.id, payload);
    setIsSaving(false);

    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1800);
    } else {
      setErrorMsg(res.error || '저장에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-subtle-border p-6 sm:p-8 relative">
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-brand-muted hover:bg-brand-bg hover:text-brand-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. 비로그인 상태 UI */}
        {!user ? (
          <div className="space-y-6 text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-secondary text-brand-primary flex items-center justify-center mx-auto shadow-sm">
              <FolderHeart className="w-7 h-7 text-income" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-brand-primary">
                포트폴리오 클라우드 저장
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                로그인하시면 지금 시뮬레이션한 주식 수와 배당 전략이 Supabase DB에 안전하게 보관되어 언제든 다시 불러올 수 있습니다.
              </p>
            </div>

            <div className="p-4 bg-brand-bg rounded-2xl border border-subtle-border text-left space-y-2">
              <span className="text-[11px] font-bold text-brand-muted block uppercase tracking-wider">
                현재 저장 예정 종목:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentHoldings
                  .filter((h) => h.shares > 0)
                  .map((h) => (
                    <span
                      key={h.ticker}
                      className="px-2.5 py-1 rounded-lg bg-white border border-subtle-border text-xs font-bold text-brand-primary"
                    >
                      {h.ticker} {h.shares}주
                    </span>
                  ))}
              </div>
            </div>

            {/* 로그인 버튼들 */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-primary text-white text-sm font-bold flex items-center justify-center gap-3 hover:bg-brand-dark transition-all shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google 계정으로 원클릭 로그인</span>
              </button>

              {!isSupabaseConfigured && (
                <button
                  type="button"
                  onClick={signInWithDemo}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-secondary text-brand-primary text-xs font-bold hover:bg-brand-secondaryHover transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-income" />
                  <span>데모 계정으로 1초 로그인 (테스트용)</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* 2. 로그인 완료 후 저장 입력 UI */
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-subtle-border">
              <div className="w-10 h-10 rounded-xl bg-income-light text-income flex items-center justify-center font-bold">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-primary">
                  포트폴리오 저장하기
                </h3>
                <p className="text-xs text-brand-muted">
                  접속 계정: <span className="font-semibold text-brand-primary">{user.email}</span>
                </p>
              </div>
            </div>

            {saveSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-income mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-brand-primary">
                  성공적으로 저장되었습니다!
                </h4>
                <p className="text-xs text-brand-muted">
                  {isSupabaseConfigured ? 'Supabase 데이터베이스에 동기화 완료' : '로컬 브라우저 저장소에 저장 완료'}
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-brand-primary block mb-1.5">
                    포트폴리오 이름
                  </label>
                  <input
                    type="text"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    placeholder="예: 나의 SCHD 배당 전략"
                    className="w-full px-4 py-2.5 bg-brand-bg rounded-xl border border-subtle-border text-sm font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-income"
                  />
                </div>

                {/* 포함될 종목 목록 미리보기 */}
                <div className="p-3.5 bg-brand-bg rounded-xl border border-subtle-border space-y-2">
                  <span className="text-[11px] font-bold text-brand-muted block">
                    저장될 보유 종목 내역:
                  </span>
                  <div className="space-y-1">
                    {currentHoldings
                      .filter((h) => h.shares > 0)
                      .map((h) => (
                        <div
                          key={h.ticker}
                          className="flex justify-between text-xs py-0.5"
                        >
                          <span className="font-bold text-brand-primary">
                            {h.ticker}
                          </span>
                          <span className="num-font text-income font-bold">
                            {h.shares}주
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-alert-light text-alert text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? '저장 중...' : '클라우드에 저장 완료'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
