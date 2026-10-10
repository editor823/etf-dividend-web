import React from 'react';
import { BookOpen, RefreshCw, Compass, ShieldCheck } from 'lucide-react';

export default function BarbellOptimizerGuide() {
  return (
    <section className="mt-8 pt-8 border-t border-subtle-border/80 space-y-6 text-brand-primary">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-income-light text-income">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-income uppercase tracking-wider">
            E-E-A-T Portfolio Construction Theory
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-brand-primary">
            바벨 전략(Barbell Strategy) 이론: 배당성장주(SCHD)와 고인컴(JEPI/JEPQ)의 이상적 결합과 리밸런싱
          </h3>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-xs sm:text-sm text-brand-muted leading-relaxed space-y-4">
        <p>
          금융공학과 월가 헤지펀드에서 널리 쓰이는 <strong>바벨 전략(Barbell Strategy)</strong>은 
          역도 선수가 양쪽에 무거운 원판을 꽂은 바벨을 드는 것처럼, 
          <strong>극단적으로 성격이 다른 두 자산을 결합하여 중간의 어중간한 위험을 회피하는 자산배분 기법</strong>입니다.
        </p>

        {/* 바벨 구조 다이어그램 카드 */}
        <div className="p-4 rounded-xl bg-brand-secondary/40 border border-brand-primary/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-brand-primary">
            <span>자본성장 & 인플레이션 헤지 (좌측)</span>
            <span className="text-income">월 현금흐름 & 생활비 (우측)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-3 bg-white rounded-lg border border-subtle-border">
              <p className="font-bold text-brand-primary text-sm">SCHD (배당성장)</p>
              <p className="text-[11px] text-brand-muted mt-1">시가배당률 3.4% • 5년 성장률 11.8%</p>
              <p className="text-[11px] text-income font-medium mt-0.5">상방 무제한 주가 성장</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-subtle-border">
              <p className="font-bold text-income text-sm">JEPI / JEPQ (고인컴)</p>
              <p className="text-[11px] text-brand-muted mt-1">시가배당률 8~11% • 월지급</p>
              <p className="text-[11px] text-brand-muted font-medium mt-0.5">월별 안정적 캐시플로우</p>
            </div>
          </div>
        </div>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <Compass className="w-4 h-4 text-income" />
          1. 왜 단일 종목 몰빵보다 바벨 배분이 안전한가?
        </h4>
        <ul className="space-y-1.5 list-disc list-inside pl-1 text-xs">
          <li>
            <strong>SCHD에만 100% 몰빵할 경우의 문제</strong>: 은퇴 직후 월 300만 원의 생활비가 필요한데 배당률이 3.4%에 불과하므로 
            약 12억 원이라는 막대한 초기 자본금이 필요합니다. 자본금이 부족하면 원금을 헐어 파는 손실 위험에 직면합니다.
          </li>
          <li>
            <strong>JEPI에만 100% 몰빵할 경우의 문제</strong>: 초기 배당률 8% 덕분에 5억 원으로도 월 300만 원을 만들 수 있지만, 
            물가상승률(연 3~4%)을 감안하면 10년 후 주가 정체와 구매력 하락으로 실질 자산 가치가 녹아내리게 됩니다.
          </li>
          <li>
            <strong>바벨 결합의 시너지 (7:3 또는 6:4)</strong>: 
            JEPI/JEPQ에서 나오는 강력한 월 배당으로 당장의 생활비나 추가 적립금을 충당하고, 
            SCHD의 두 자릿수 배당성장률이 포트폴리오 전체의 장기 구매력을 든든하게 지켜줍니다.
          </li>
        </ul>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-income" />
          2. 최적의 리밸런싱(Rebalancing) 주기와 세금 절약 팁
        </h4>
        <p>
          바벨 포트폴리오를 구성한 뒤 주가 변동으로 인해 초기 설정한 비율(예: 70:30)이 깨졌을 때, 
          이를 다시 맞춰주는 리밸런싱은 <strong>연 1회(매년 12월 또는 1월)</strong> 또는 
          <strong>비중 괴리가 10% 이상 벌어졌을 때(Band Rebalancing)</strong> 실행하는 것이 가장 합리적입니다.
        </p>
        <div className="p-3.5 rounded-xl bg-white border border-subtle-border text-xs text-brand-muted leading-relaxed">
          <span className="font-semibold text-brand-primary flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-income" /> 세금 없는 스마트 리밸런싱 (현금흐름 리밸런싱)
          </span>
          기존에 보유한 주식을 매도하여 비중을 맞추면 22%의 양도소득세가 발생할 수 있습니다. 
          따라서 기존 주식을 팔지 않고, <strong>매월 JEPI에서 지급되는 풍부한 월배당금으로 상대적으로 비중이 낮아진 SCHD를 추가 매수</strong>하는 
          &lsquo;현금흐름 리밸런싱&rsquo; 방식을 사용하면 세금을 0원으로 아끼면서 자연스럽게 목표 비중을 유지할 수 있습니다.
        </div>
      </div>
    </section>
  );
}
