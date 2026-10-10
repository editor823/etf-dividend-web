import React from 'react';
import { BookOpen, History, LineChart, Shield, Flame } from 'lucide-react';

export default function HistoricalSimulatorGuide() {
  return (
    <section className="mt-8 pt-8 border-t border-subtle-border/80 space-y-6 text-brand-primary">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-income-light text-income">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-income uppercase tracking-wider">
            E-E-A-T Quantitative Backtesting
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-brand-primary">
            과거 백테스트 시 배당 재투자(DRIP) 유무에 따른 MDD 완화 및 원금회수율(YoC) 분석 원리
          </h3>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-xs sm:text-sm text-brand-muted leading-relaxed space-y-4">
        <p>
          주식 시장에서 &lsquo;과거 수익률이 미래 수익률을 보장하지 않는다&rsquo;는 격언은 진리입니다. 
          그럼에도 불구하고 투자자가 과거 시계열 데이터를 백테스팅(Backtesting)해야 하는 이유는 
          <strong>최대 낙폭(MDD, Maximum Drawdown)</strong>과 <strong>배당 재투자 유무에 따른 자산 복리 격차</strong>를 
          수치로 직접 체감하여 폭락장을 견딜 수 있는 심리적 방어력을 갖추기 위함입니다.
        </p>

        {/* 2대 핵심 지표 박스 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl bg-white border border-subtle-border space-y-1.5 shadow-2xs">
            <span className="text-xs font-bold text-income flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> 1. 최대 낙폭 (MDD, Maximum Drawdown)
            </span>
            <p className="text-xs text-brand-muted leading-relaxed">
              특정 투자 기간 동안 최고점(Peak) 대비 최저점(Trough)까지의 최대 하락 비율입니다. 
              배당금을 인출하지 않고 하락장에서 주식을 더 많이 매수(DRIP)할 경우, 
              계좌의 저점 회복 기간(Recovery Period)이 극적으로 단축됩니다.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-subtle-border space-y-1.5 shadow-2xs">
            <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-income" /> 2. 원금 대비 배당수익률 (YoC, Yield on Cost)
            </span>
            <p className="text-xs text-brand-muted leading-relaxed">
              현재 주가가 아니라 <strong>내가 과거에 매수한 원금(매입 단가) 대비 현재 수령하는 연간 배당금의 비율</strong>입니다. 
              시가배당률이 3%인 ETF라도, 매년 배당금이 성장하고 재투자로 주식 수가 불어나면 5~10년 후 나의 YoC는 10~15%를 넘어서게 됩니다.
            </p>
          </div>
        </div>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <LineChart className="w-4 h-4 text-income" />
          1. 배당 재투자(DRIP)가 폭락장에서 발휘하는 &lsquo;역발상 매수 효과&rsquo;
        </h4>
        <p>
          본 타임머신 계산기에서 [배당 재투자]를 켜고 끄는 토글을 조작해보면, 
          2022년 금리 인상기나 2020년 팬데믹 같은 폭락 국면에서 흥미로운 현상이 관찰됩니다.
        </p>
        <p>
          주가가 20~30% 폭락하면 일반 투자자는 공포에 질려 매수를 중단하거나 손절합니다. 
          그러나 자동 배당 재투자가 설정되어 있으면, <strong>평소보다 30% 저렴해진 가격에 배당금으로 주식을 평소보다 1.4배 더 많이 매수</strong>하게 됩니다. 
          이것이 바로 시장 타이밍을 재지 않고 자동으로 실행되는 &lsquo;저점 추가 매수(Cost Averaging)&rsquo;이며, 
          이후 시장이 반등할 때 계좌 총자산이 폭발적으로 튀어오르는 원동력이 됩니다.
        </p>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <History className="w-4 h-4 text-income" />
          2. 백테스트 결과 해석 시 주의해야 할 3가지 편향
        </h4>
        <ul className="space-y-1.5 list-disc list-inside pl-1 text-xs">
          <li>
            <strong>생존 편향(Survivorship Bias)</strong>: 망하거나 상장폐지된 종목은 지수에서 퇴출되고 우량한 기업만 남아 과거 데이터가 왜곡될 수 있습니다. 
            SCHD처럼 지수 자체의 리밸런싱 메커니즘을 점검해야 합니다.
          </li>
          <li>
            <strong>최근성 편향(Recency Bias)</strong>: 최근 2~3년 동안 특정 테마나 고배당 커버드콜이 좋았다고 해서, 
            향후 10년의 인플레이션 국면이나 저금리 국면에서도 동일한 우위를 보일 것이라 과신해서는 안 됩니다.
          </li>
          <li>
            <strong>세금 및 환율 현실 반영</strong>: 본 백테스터는 15% 미국 원천징수 배당소득세를 매월 정밀하게 공제한 실수령 데이터만을 집계하므로, 
            세전 이론치 백테스트보다 훨씬 더 현실에 근접한 자산 추정치를 보여줍니다.
          </li>
        </ul>
      </div>
    </section>
  );
}
