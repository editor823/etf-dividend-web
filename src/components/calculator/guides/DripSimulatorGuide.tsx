import React from 'react';
import { BookOpen, Repeat, AlertOctagon, Sparkles } from 'lucide-react';

export default function DripSimulatorGuide() {
  return (
    <section className="mt-8 pt-8 border-t border-subtle-border/80 space-y-6 text-brand-primary">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-income-light text-income">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-income uppercase tracking-wider">
            E-E-A-T Compounding Mathematics
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-brand-primary">
            DRIP(배당 재투자) 스노우볼 복리 효과의 수학적 원리와 배당 삭감(Cut) 방어 전략
          </h3>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-xs sm:text-sm text-brand-muted leading-relaxed space-y-4">
        <p>
          알베르트 아인슈타인은 &lsquo;복리(Compound Interest)는 인류 역사상 가장 위대한 수학적 발견이자 세계 8대 불가사의&rsquo;라고 칭송했습니다. 
          주식 투자에서 복리의 핵심 엔진은 바로 <strong>DRIP(Dividend Re-Investment Plan, 배당금 자동 재투자)</strong>입니다.
        </p>

        {/* 3차원 복리 동력학 */}
        <div className="p-4 rounded-xl bg-brand-secondary/40 border border-brand-primary/10 space-y-2">
          <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-income" /> DRIP 복리 스노우볼의 3대 가속 엔진
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className="p-2.5 bg-white rounded-lg border border-subtle-border">
              <strong className="text-brand-primary block">1. 주식 수의 증가</strong>
              <p className="text-[11px] text-brand-muted mt-0.5">배당금으로 매달 새 주식을 사 모음</p>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-subtle-border">
              <strong className="text-brand-primary block">2. 주당 배당금의 증가</strong>
              <p className="text-[11px] text-brand-muted mt-0.5">우량 배당성장 기업의 자체 DPS 인상</p>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-subtle-border">
              <strong className="text-brand-primary block">3. 주가 자체의 상승</strong>
              <p className="text-[11px] text-brand-muted mt-0.5">경제 성장에 따른 자본 차익(CAGR)</p>
            </div>
          </div>
        </div>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <Repeat className="w-4 h-4 text-income" />
          1. 10년, 20년 후 재투자 vs 단순 인출의 자산 격차
        </h4>
        <p>
          본 시뮬레이터 차트에서 볼 수 있듯이, 투자 초기 1~3년 차에는 배당금을 재투자하나 그냥 통장으로 꺼내 쓰나 계좌 잔고의 차이가 미미해 보입니다. 
          그러나 시간이 지날수록 그래프의 기울기는 완만한 직선에서 가파른 기하급수 곡선(Exponential Curve)으로 전환됩니다.
        </p>
        <p>
          예를 들어, 연 8% 총수익률(배당 4% + 주가성장 4%) 환경에서 20년간 투자할 경우:
          <br />
          • <strong>배당금 인출 시</strong>: 원금의 약 2.2배 수준 자산 형성
          <br />
          • <strong>배당금 전액 재투자 시</strong>: 원금의 <strong>약 4.6배 이상</strong>으로 자산이 2배 넘게 벌어집니다. 
          이는 &lsquo;배당금이 낳은 자식 주식이 다시 손자 배당금을 낳는&rsquo; 연쇄 증식 반응 덕분입니다.
        </p>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-alert" />
          2. 치명적인 위험: 배당 삭감(Dividend Cut) 리스크 방어법
        </h4>
        <p>
          복리 스노우볼을 굴릴 때 가장 경계해야 할 재앙은 <strong>배당 삭감</strong>입니다. 
          배당이 깎이면 현금흐름이 줄어들 뿐만 아니라 실망 매물로 인해 주가까지 폭락하는 이중 타격을 입게 됩니다. 
          안전한 DRIP 투자를 위해 점검해야 할 3대 원칙:
        </p>
        <ul className="space-y-1.5 list-disc list-inside pl-1 text-xs">
          <li>
            <strong>배당성향(Payout Ratio) 검증</strong>: 순이익 대비 배당금 지급 비율이 70%를 초과하는 개별 기업은 피하고, 
            이익의 40~50% 수준을 건전하게 배당하는 종목을 편입한 ETF(SCHD 등)를 선택합니다.
          </li>
          <li>
            <strong>단일 종목 의존도 탈피</strong>: 배당 귀족주(25년 연속 배당 인상 기업)라 하더라도 개별 기업은 업황 악화로 배당을 삭감할 수 있습니다. 
            최소 100개 종목 이상으로 분산된 ETF를 통해 개별 기업의 돌발 배당 삭감 리스크를 구조적으로 분산해야 합니다.
          </li>
          <li>
            <strong>15% 원천징수 고려한 실제 수량 계산</strong>: 본 계산기처럼 세금을 차감한 &lsquo;순배당금&rsquo;으로 재투자 주식 수를 올림 없이 소수점 단위까지 정확히 모델링해야 현실적인 은퇴 자산 계획이 완성됩니다.
          </li>
        </ul>
      </div>
    </section>
  );
}
