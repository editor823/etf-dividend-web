import { ShieldAlert, AlertTriangle, Mail } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '투자 면책조항 (Financial Disclaimer) | DIVIDEND INTEL',
  description:
    'DIVIDEND INTEL의 금융 투자 면책조항 및 리스크 안내입니다. 모든 시뮬레이션은 참고용 정보 제공 목적입니다.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col selection:bg-brand-secondary selection:text-brand-primary">
      {/* 전역 통합 헤더 */}
      <Header />

      {/* 본문 */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        <div className="space-y-3 border-b border-subtle-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alert/10 text-alert text-xs font-bold">
            <ShieldAlert className="w-4 h-4" />
            금융 소비자 보호 및 법적 고지
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-primary tracking-tight">
            투자 면책조항 (Financial Disclaimer)
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted font-mono">
            최종 개정일자: 2026년 3월 15일 | 필수 확인 사항
          </p>
        </div>

        {/* 붉은색 핵심 경고 박스 */}
        <div className="p-6 rounded-3xl bg-red-50/70 border border-alert/20 space-y-3 text-brand-primary shadow-xs">
          <div className="flex items-center gap-2 text-alert font-bold text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>핵심 면책 고지 (Core Legal Notice)</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold leading-relaxed text-brand-primary">
            &ldquo;본 사이트(DIVIDEND INTEL)에서 제공하는 모든 배당금 계산, 역산 시뮬레이션, 과거 백테스트 데이터 및 가이드 아티클은 
            순수한 정보 제공 및 학습 참고용 목적이며, 어떠한 경우에도 특정 금융투자상품의 매수·매도 추천, 투자 자문 또는 청약을 유도하는 것이 아닙니다. 
            모든 투자의 최종 결정과 손익에 대한 법적·경제적 책임은 전적으로 투자자 본인에게 있습니다.&rdquo;
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-subtle-border p-8 shadow-card space-y-8 text-xs sm:text-sm text-brand-primary/85 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              1. 과거 수익률과 미래 실적의 괴리 리스크
            </h2>
            <p>
              본 플랫폼의 &lsquo;타임머신 계산기&rsquo; 및 &lsquo;DRIP 복리 시뮬레이터&rsquo; 등은 과거 특정 기간의 공시 데이터나 
              가상의 수학적 모델링에 기반하여 동작합니다. <strong>과거의 배당금 지급 이력이나 주가 상승률이 미래의 동일한 배당금이나 수익률을 절대 보장하지 않습니다.</strong> 
              거시경제 변동, 기업 실적 악화, 금리 변화에 따라 배당금이 삭감(Dividend Cut)되거나 주가가 하락하여 원금 손실이 발생할 수 있습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              2. 세법 및 환율 변동에 따른 차이 안내
            </h2>
            <p>
              본 사이트의 모든 계산기는 미국 현지 배당소득세(15% 원천징수)를 필수로 반영하도록 설계되어 있습니다. 
              그러나 다음 요인에 의해 투자자의 실제 통장 입금액과 차이가 발생할 수 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-brand-muted">
              <li><strong>원/달러 환율 변동</strong>: 환율 상승이나 하락에 따른 원화 환산 배당금의 실시간 차이</li>
              <li><strong>국내 금융소득종합과세</strong>: 개인의 연간 금융소득(이자+배당)이 2,000만 원을 초과할 경우 적용되는 종합소득 누진세율 및 건강보험료 추가 부과</li>
              <li><strong>증권사별 환전 및 매매 수수료</strong>: 개인별 증권사 우대 환율이나 거래 수수료 차이</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              3. 파생상품(커버드콜 ETF)의 원금 잠식(ROC) 위험
            </h2>
            <p>
              JEPI, JEPQ 등 고인컴 커버드콜 ETF의 분배금은 주식 배당 외에 콜옵션 매도 프리미엄이 포함되어 있습니다. 
              시장이 급격히 하락하거나 장기 횡보할 경우, 높은 분배금 수령에도 불구하고 ETF의 순자산가치(NAV)가 하락하여 
              원금 손실이 발생할 수 있으므로 총수익률(Total Return) 관점에서 신중히 접근해야 합니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              4. 전문 금융 자문가의 조언 권고
            </h2>
            <p>
              DIVIDEND INTEL은 금융투자업 인가를 받은 투자자문사, 증권사 또는 투자일임사가 아닙니다. 
              투자자는 실제 자금을 집행하기 전에 공인된 금융 전문가(세무사, 재무설계사, 증권사 PB)와 
              자신의 재정 상태 및 감내 가능한 위험 수준에 대해 상담받으실 것을 강력히 권고합니다.
            </p>
          </section>

          <section className="p-4 rounded-2xl bg-brand-bg border border-subtle-border space-y-2">
            <h2 className="text-sm font-bold text-brand-primary flex items-center gap-2">
              <Mail className="w-4 h-4 text-income" />
              5. 문의 및 제휴
            </h2>
            <p className="text-xs text-brand-muted">
              본 면책조항에 관한 문의나 시뮬레이션 산출 공식 피드백은 공식 관리자 이메일(
              <a href="mailto:editor823@gmail.com" className="text-income underline font-mono font-medium">
                editor823@gmail.com
              </a>
              )로 접수해주시기 바랍니다.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
