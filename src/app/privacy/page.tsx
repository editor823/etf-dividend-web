import Link from 'next/link';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 (Privacy Policy)',
  description:
    'DIVIDEND INTEL의 개인정보처리방침 및 구글 애드센스(Google AdSense) 쿠키 수집 방침 안내입니다.',
  alternates: {
    canonical: 'https://etf-dividend-web.pages.dev/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col selection:bg-brand-secondary selection:text-brand-primary">
      {/* 전역 통합 헤더 */}
      <Header />

      {/* 본문 */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        {/* 상단 브레드크럼 (Breadcrumb) 네비게이션 */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-muted font-medium">
          <Link href="/" className="hover:text-brand-primary hover:underline">홈</Link>
          <span className="text-brand-muted/60">/</span>
          <span className="text-brand-primary font-bold">개인정보처리방침 (Privacy Policy)</span>
        </nav>

        <div className="space-y-3 border-b border-subtle-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-income-light text-income text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            GDPR &amp; 대한민국 개인정보보호법 준수
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-primary tracking-tight">
            개인정보처리방침 (Privacy Policy)
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted font-mono">
            최종 개정일자: 2026년 3월 15일 | 시행일자: 2026년 3월 15일
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-subtle-border p-8 shadow-card space-y-8 text-xs sm:text-sm text-brand-primary/85 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              1. 총칙 및 개인정보의 수집 항목
            </h2>
            <p>
              DIVIDEND INTEL(이하 &lsquo;회사&rsquo; 또는 &lsquo;사이트&rsquo;)은 정보주체의 자유와 권리 보호를 위해 
              「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.
            </p>
            <p>사이트는 원칙적으로 회원가입 없이 대부분의 계산기 및 시뮬레이션 기능을 자유롭게 이용할 수 있습니다. 단, 아래의 경우에 한하여 최소한의 정보가 수집될 수 있습니다:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-brand-muted">
              <li><strong>포트폴리오 저장 및 간편 로그인 이용 시</strong>: 구글(Google) OAuth 인증을 통한 이메일 주소, 프로필 이름, 고유 사용자 식별자(ID)</li>
              <li><strong>서비스 이용 및 접속 과정에서 자동 생성되는 정보</strong>: IP 주소, 브라우저 종류 및 운영체제, 방문 일시, 쿠키(Cookie), 서비스 이용 기록</li>
              <li><strong>고객 문의 접수 시</strong>: 이메일 주소, 문의 내용 및 첨부자료</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary flex items-center gap-2">
              <Lock className="w-4 h-4 text-income" />
              2. 구글 애드센스(Google AdSense) 및 제3자 광고 쿠키 정책 (필수 고지)
            </h2>
            <p>
              본 웹사이트는 운영비 충당 및 무료 서비스 유지를 위해 구글(Google LLC)이 제공하는 광고 서비스인 <strong>Google AdSense</strong>를 게재할 수 있습니다.
            </p>
            <div className="p-4 rounded-2xl bg-brand-secondary/40 border border-brand-primary/10 space-y-2 text-xs">
              <p>
                • 구글 및 제3자 광고 공급업체는 사용자가 본 사이트 또는 다른 웹사이트를 방문한 기록을 바탕으로 관심 기반 맞춤형 광고를 게재하기 위해 <strong>쿠키(Cookie)</strong>를 사용합니다.
              </p>
              <p>
                • 사용자는 구글의 광고 설정 페이지(
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-income underline font-semibold"
                >
                  https://adssettings.google.com
                </a>
                )를 방문하여 개인 맞춤 광고 게재를 거부(Opt-out)할 수 있습니다.
              </p>
              <p>
                • 또한 사용자는 
                <a
                  href="https://www.aboutads.info/choices"
                  target="_blank"
                  rel="noreferrer"
                  className="text-income underline font-semibold ml-1"
                >
                  www.aboutads.info
                </a>
                를 방문하여 제3자 공급업체의 맞춤형 광고 쿠키 사용을 전면 차단할 수 있습니다.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              3. 개인정보의 처리 목적 및 보유 기간
            </h2>
            <p>
              수집된 개인정보는 다음의 목적에 한하여 처리되며, 목적이 달성된 후에는 지체 없이 파기합니다:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-brand-muted">
              <li><strong>회원 관리</strong>: 포트폴리오 저장, 불러오기 및 본인 확인 (회원 탈퇴 시 즉시 영구 삭제)</li>
              <li><strong>서비스 개선 및 통계 분석</strong>: 접속 빈도 분석, 계산기 사용 통계 및 서비스 품질 고도화</li>
              <li><strong>불법 이용 방지</strong>: 비정상적 트래픽(DDoS) 차단 및 시스템 안정성 확보</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              4. 개인정보의 제3자 제공 및 위탁 안내
            </h2>
            <p>
              사이트는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만, 안정적인 글로벌 인프라 제공을 위해 다음과 같이 데이터 처리가 위탁됩니다:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-brand-muted">
              <li><strong>Supabase Inc.</strong>: 회원 인증 및 사용자 포트폴리오 데이터베이스 호스팅 (미국 소재 암호화 서버)</li>
              <li><strong>Cloudflare Inc.</strong>: 전 세계 Edge CDN 호스팅, 웹방화벽(WAF) 및 트래픽 보호</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              5. 이용자의 권리와 행사 방법
            </h2>
            <p>
              이용자는 언제든지 등록되어 있는 자신의 개인정보를 열람, 정정, 삭제하거나 계정 삭제를 요청할 수 있습니다. 
              관련 문의는 아래의 개인정보 보호책임자에게 이메일로 요청하시면 지체 없이 조치해 드립니다.
            </p>
          </section>

          <section className="p-4 rounded-2xl bg-brand-bg border border-subtle-border space-y-2">
            <h2 className="text-sm font-bold text-brand-primary flex items-center gap-2">
              <Mail className="w-4 h-4 text-income" />
              6. 개인정보 보호책임자 및 문의처
            </h2>
            <div className="text-xs text-brand-muted space-y-1">
              <p>• 성명 / 소속: DIVIDEND INTEL 개인정보보호담당부서</p>
              <p>• 이메일: <a href="mailto:editor823@gmail.com" className="text-income underline font-mono font-medium">editor823@gmail.com</a></p>
              <p>• 이용자는 개인정보 침해에 대한 피해구제, 상담 등을 개인정보분쟁조정위원회(kopico.go.kr), 대검찰청 사이버수사과(spo.go.kr) 등에 신청할 수 있습니다.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
