import {
  Target,
  ShieldCheck,
  Cpu,
  Mail,
  CheckCircle2,
  Users,
  Database,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '플랫폼 소개 (About Us) | DIVIDEND INTEL 미국 배당 ETF 인텔리전스',
  description:
    'DIVIDEND INTEL은 미국 배당성장 및 고인컴 ETF의 현금흐름을 과학적으로 설계하고 분석하는 퀀트 리서치 플랫폼입니다.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col selection:bg-brand-secondary selection:text-brand-primary">
      {/* 전역 통합 헤더 */}
      <Header />

      {/* 본문 */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        {/* 히어로 헤더 */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-secondary text-brand-primary text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-income" />
            E-E-A-T 금융 리서치 및 엔지니어링
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-primary tracking-tight leading-tight">
            배당 투자를 직관이 아닌 <br />
            <span className="text-income underline decoration-income/30 decoration-wavy">
              데이터와 공식으로 설계합니다
            </span>
          </h1>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            DIVIDEND INTEL은 미국 대표 배당 ETF를 기반으로 안정적인 경제적 자유와 
            지속 가능한 은퇴 현금흐름을 준비하는 투자자들을 위한 독립 금융 인텔리전스 플랫폼입니다.
          </p>
        </div>

        {/* 설립 목적 & 핵심 철학 */}
        <section className="bg-white rounded-3xl border border-subtle-border p-8 shadow-card space-y-6">
          <div className="flex items-center gap-3 border-b border-subtle-border pb-4">
            <div className="p-2.5 rounded-xl bg-income-light text-income">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-primary">1. 플랫폼 설립 목적 및 비전</h2>
              <p className="text-xs text-brand-muted">우리가 해결하고자 하는 문제</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-brand-primary/85 leading-relaxed">
            <p>
              많은 투자자들이 시가배당률 8~10%라는 현혹적인 숫자만 보고 초고배당 커버드콜 ETF를 매수했다가 
              주가 하락으로 인한 원금 잠식과 세금 폭탄에 고통받고 있습니다. 반대로, 배당성장률이 우수한 종목을 샀음에도 
              구체적인 월 목표 생활비(예: 세후 200만 원)를 만들기 위해 몇 주를 언제까지 사야 하는지 계산하지 못해 중도 포기하곤 합니다.
            </p>
            <p>
              <strong>DIVIDEND INTEL</strong>은 이러한 불투명성을 걷어내기 위해 탄생했습니다. 
              미국 배당소득세(15% 원천징수)를 필수로 차감한 <strong>&lsquo;세후 순수 실수령액&rsquo;</strong>을 기준으로, 
              필요 주식 수와 소요 기간을 역산하고, 배당 재투자(DRIP)의 스노우볼 복리 궤적을 투명하게 시뮬레이션합니다.
            </p>
          </div>
        </section>

        {/* 데이터 처리 및 분석 방법론 (E-E-A-T 신뢰성) */}
        <section className="bg-white rounded-3xl border border-subtle-border p-8 shadow-card space-y-6">
          <div className="flex items-center gap-3 border-b border-subtle-border pb-4">
            <div className="p-2.5 rounded-xl bg-brand-secondary text-brand-primary">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-primary">2. 데이터 수집 및 정밀 가공 프로세스</h2>
              <p className="text-xs text-brand-muted">신뢰할 수 있는 데이터 무결성 원칙</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-brand-bg border border-subtle-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-brand-primary">
                <Cpu className="w-4 h-4 text-income" /> 실시간 시장 시세 연동
              </div>
              <p className="text-brand-muted leading-relaxed">
                뉴욕 증시 마감 후 매일 정기 스케줄러(GitHub Actions)를 통해 
                Yahoo Finance API v4 기반 공식 종가 및 공시 배당금을 자동 동기화합니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-bg border border-subtle-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-brand-primary">
                <CheckCircle2 className="w-4 h-4 text-income" /> 15% 세후 실수령액 필터
              </div>
              <p className="text-brand-muted leading-relaxed">
                모든 시뮬레이터와 역산 엔진은 세전 이론치가 아닌 한미 조세조약 15% 원천징수세를 사전 공제한 
                실제 입금액 기준 계산을 원칙으로 합니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-bg border border-subtle-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-brand-primary">
                <ShieldCheck className="w-4 h-4 text-income" /> 편향 없는 독립 분석
              </div>
              <p className="text-brand-muted leading-relaxed">
                특정 자산운용사(Vanguard, Schwab, JPMorgan 등)의 상품 홍보 대가를 일절 받지 않으며, 
                공개된 지표와 팩트 기반의 객관적 분석만을 제공합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 운영자 소개 및 공식 연락처 */}
        <section className="bg-brand-secondary/40 rounded-3xl border border-brand-primary/10 p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white text-brand-primary shadow-2xs">
              <Users className="w-5 h-5 text-income" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-primary">3. 운영진 및 공식 문의 창구</h2>
              <p className="text-xs text-brand-muted">플랫폼 관리자 및 금융 리서처</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-brand-primary/80 leading-relaxed">
            DIVIDEND INTEL은 장기 배당성장 투자를 연구하는 핀테크 엔지니어와 퀀트 데이터 리서처에 의해 기획·운영되고 있습니다. 
            서비스 내 계산 오류 제보, 신규 ETF 추가 제안, 데이터 라이선스 및 제휴 문의는 아래 공식 이메일로 연락주시면 신속히 답변해 드립니다.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-subtle-border shadow-2xs">
              <Mail className="w-4 h-4 text-income" />
              <span className="text-brand-muted">공식 문의 이메일:</span>
              <a
                href="mailto:editor823@gmail.com"
                className="font-bold text-income hover:underline font-mono"
              >
                editor823@gmail.com
              </a>
            </div>
            <span className="text-[11px] text-brand-muted">
              (영업일 기준 24~48시간 이내 회신)
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
