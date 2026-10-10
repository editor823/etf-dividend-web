'use client';

import Link from 'next/link';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f5ebe0]/30 flex items-center justify-center p-6 text-[#2a201c]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#2a201c]/10 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <p className="num-font text-6xl font-black text-[#2a201c] tracking-tight mb-2">404</p>
        <h1 className="text-xl font-bold text-[#2a201c] mb-3">페이지를 찾을 수 없습니다</h1>
        <p className="text-sm text-[#2a201c]/70 leading-relaxed mb-8">
          요청하신 배당 분석 페이지나 경로가 존재하지 않거나 이전되었습니다. 홈 대시보드로 돌아가 스마트한 ETF 인텔리전스를 이용해보세요.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2a201c] text-[#f5ebe0] text-sm font-semibold hover:bg-[#3d2f29] transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            메인 대시보드로 이동
          </Link>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.history.back();
            }}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#f5ebe0] text-[#2a201c] text-sm font-semibold hover:bg-[#e8ded3] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            이전 페이지
          </button>
        </div>
      </div>
    </main>
  );
}
