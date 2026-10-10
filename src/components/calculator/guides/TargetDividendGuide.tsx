import React from 'react';
import { BookOpen, ShieldAlert, Calculator, Percent } from 'lucide-react';

export default function TargetDividendGuide() {
  return (
    <section className="mt-8 pt-8 border-t border-subtle-border/80 space-y-6 text-brand-primary">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-income-light text-income">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-income uppercase tracking-wider">
            E-E-A-T Financial Research
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-brand-primary">
            미국 배당소득세 15% 원천징수 계산 공식과 금융소득종합과세 2,000만 원 절세 가이드
          </h3>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-xs sm:text-sm text-brand-muted leading-relaxed space-y-4">
        <p>
          미국 배당 ETF에 투자하여 매월 안정적인 현금흐름을 설계할 때 가장 먼저 고려해야 하는 변수는 <strong>세금(Tax)</strong>입니다. 
          증권사 앱이나 금융 포털에 표시되는 배당수익률은 대부분 <strong>세전(Gross)</strong> 기준이며, 
          투자자가 실제로 계좌에 입금받는 배당금은 미국 국세청(IRS)의 원천징수 세율 15%가 차감된 <strong>세후(Net) 실수령액</strong>입니다.
        </p>

        {/* 핵심 공식 박스 */}
        <div className="p-4 rounded-xl bg-brand-secondary/40 border border-brand-primary/10 space-y-2">
          <div className="flex items-center gap-2 font-bold text-brand-primary text-xs">
            <Calculator className="w-4 h-4 text-income" />
            <span>미국 배당 ETF 세후 실수령액 계산 공식</span>
          </div>
          <div className="font-mono text-xs text-income font-bold bg-white p-3 rounded-lg border border-subtle-border">
            세후 실수령액 = [보유 주식 수 × 주당 배당금(DPS) × 환율] × (1 - 0.15)
          </div>
          <p className="text-[11px] text-brand-muted">
            * 한미 조세조약에 따라 미국 현지에서 15%가 원천징수되며, 한국의 기본 배당소득세율인 14%(지방소득세 포함 15.4%) 중 
            외국납부세액공제로 14%가 충당되므로 미국 주식 직투 시 추가 차감 없이 15%로 원천징수가 종결됩니다.
          </p>
        </div>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <Percent className="w-4 h-4 text-income" />
          1. 금융소득종합과세 2,000만 원 기준선과 건강보험료 영향
        </h4>
        <p>
          연간 수령하는 세전 배당금과 이자소득의 합계액이 <strong>2,000만 원(월평균 약 166만 원)</strong>을 초과하는 순간, 
          초과분에 대해 다른 종합소득(근로소득, 사업소득, 연금소득 등)과 합산되어 <strong>최저 6%에서 최고 45%(지방세 포함 49.5%)의 누진세율</strong>이 적용됩니다.
        </p>

        {/* 비교 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-subtle-border rounded-xl bg-white overflow-hidden">
            <thead>
              <tr className="bg-brand-secondary text-brand-primary font-bold">
                <th className="p-2.5 text-left border-b border-subtle-border">구분</th>
                <th className="p-2.5 text-left border-b border-subtle-border">연간 배당 2,000만 원 이하</th>
                <th className="p-2.5 text-left border-b border-subtle-border">연간 배당 2,000만 원 초과</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle-border">
              <tr>
                <td className="p-2.5 font-semibold text-brand-primary">과세 방식</td>
                <td className="p-2.5 text-income font-medium">15% 분리과세로 종결</td>
                <td className="p-2.5 text-alert font-medium">다른 소득과 합산 누진과세</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-brand-primary">건강보험료</td>
                <td className="p-2.5">피부양자 자격 유지 (타 소득 요건 충족 시)</td>
                <td className="p-2.5 text-alert">피부양자 자격 박탈 및 지역가입자 전환</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-brand-primary">직장인 건보료</td>
                <td className="p-2.5">추가 납부 없음</td>
                <td className="p-2.5 text-alert">보수 외 소득 월별 건보료 추가 부과</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-income" />
          2. 월 200만~300만 원 목표 시 필수 절세 포트폴리오 전략
        </h4>
        <p>
          본 계산기에서 월 목표 실수령액을 200만 원(연 2,400만 원) 이상으로 설정할 경우, 
          미국 직투 단일 계좌로만 운영하면 금융소득종합과세 구간에 진입하게 됩니다. 이를 합법적으로 방어하는 3대 전략은 다음과 같습니다:
        </p>
        <ul className="space-y-1.5 list-disc list-inside pl-1 text-xs">
          <li>
            <strong>계좌 분산 전략 (가족 간 분산)</strong>: 배우자 증여공제(10년간 6억 원 비과세)를 활용하여 부부 명의로 자산을 분할하면, 
            가구 합산 연간 4,000만 원(각각 2,000만 원)까지 분리과세 혜택을 온전히 누릴 수 있습니다.
          </li>
          <li>
            <strong>중개형 ISA 활용</strong>: 국내 상장 미국배당다우존스(한국판 SCHD)를 ISA 계좌에서 운용하면, 
            순이익 200만~400만 원까지 비과세되며 초과분은 9.9% 분리과세되어 금융소득종합과세에 일절 합산되지 않습니다.
          </li>
          <li>
            <strong>배당성장주(SCHD) 중심 구성</strong>: 초기 배당수익률이 8~10%인 고배당 커버드콜 대신 배당수익률 3.5% 수준인 SCHD 위주로 운용하면, 
            자산 증식기 동안 배당금 규모를 2,000만 원 이하로 통제하면서 주가 상승분(양도차익은 종합과세 미합산)으로 자산을 키울 수 있습니다.
          </li>
        </ul>
      </div>
    </section>
  );
}
