import React from 'react';
import { BookOpen, Scale, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function EtfComparisonGuide() {
  return (
    <section className="mt-8 pt-8 border-t border-subtle-border/80 space-y-6 text-brand-primary">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-income-light text-income">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-income uppercase tracking-wider">
            E-E-A-T Comparative Analysis
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-brand-primary">
            SCHD vs JEPI: 배당성장형 vs 커버드콜 인컴형의 구조적 차이와 국면별 성과 비교
          </h3>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-xs sm:text-sm text-brand-muted leading-relaxed space-y-4">
        <p>
          미국 배당 ETF 투자자들 사이에서 가장 치열하게 대립하는 두 종목이 바로 <strong>SCHD(Schwab U.S. Dividend Equity ETF)</strong>와 
          <strong>JEPI(JPMorgan Equity Premium Income ETF)</strong>입니다. 
          두 종목은 겉보기에 모두 &lsquo;고배당 ETF&rsquo;처럼 보이지만, 현금흐름을 창출하는 금융공학적 구조와 목표 투자자 계층이 근본적으로 다릅니다.
        </p>

        {/* 비교 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-subtle-border rounded-xl bg-white overflow-hidden">
            <thead>
              <tr className="bg-brand-secondary text-brand-primary font-bold">
                <th className="p-2.5 text-left border-b border-subtle-border">비교 항목</th>
                <th className="p-2.5 text-left border-b border-subtle-border">SCHD (배당성장)</th>
                <th className="p-2.5 text-left border-b border-subtle-border">JEPI (커버드콜 인컴)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle-border">
              <tr>
                <td className="p-2.5 font-semibold text-brand-primary">수익의 원천</td>
                <td className="p-2.5">기업의 실질 영업이익 배당금 (100%)</td>
                <td className="p-2.5">주식 배당(20%) + 콜옵션 매도 프리미엄(80%)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-brand-primary">시가 배당률</td>
                <td className="p-2.5 font-mono">연 3.3% ~ 3.6%</td>
                <td className="p-2.5 font-mono text-income font-bold">연 7.5% ~ 8.5%</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-brand-primary">5년 배당성장률</td>
                <td className="p-2.5 font-mono text-income font-bold">연평균 11.8%</td>
                <td className="p-2.5 font-mono">연평균 3~4% (옵션 변동성에 의존)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-brand-primary">운용 보수</td>
                <td className="p-2.5 font-mono text-income">연 0.06% (초저보수 패시브)</td>
                <td className="p-2.5 font-mono">연 0.35% (액티브 ELN 구조화)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-brand-primary">배당 주기</td>
                <td className="p-2.5">분기 배당 (3, 6, 9, 12월)</td>
                <td className="p-2.5 text-income font-medium">월 배당 (매월 1~7일경)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-brand-primary">주가 상승 상방(Cap)</td>
                <td className="p-2.5 text-income font-medium">제한 없음 (지수 상승 100% 추종)</td>
                <td className="p-2.5 text-alert font-medium">상방 제한 (옵션 행사가격 상한)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <Scale className="w-4 h-4 text-income" />
          1. 시장 국면별 성과와 기회비용 분석
        </h4>
        <p>
          단순히 배당률 숫자만 보고 JEPI를 선택하면, 대세 상승장에서 <strong>극심한 상대적 박탈감(Underperformance)</strong>을 경험하게 됩니다. 
          반대로 하락장이나 횡보장에서는 JEPI의 두둑한 옵션 프리미엄이 훌륭한 방패 역할을 합니다.
        </p>
        <ul className="space-y-1.5 list-disc list-inside pl-1 text-xs">
          <li>
            <strong>박스권 횡보장</strong>: 주가가 오르지도 내리지도 않는 지루한 장세에서는 JEPI의 일방적인 압승입니다. 
            SCHD는 주가 정체로 연 3%대에 머무는 반면, JEPI는 옵션 프리미엄을 온전히 회수하여 연 8~9%의 실현 수익을 안겨줍니다.
          </li>
          <li>
            <strong>대세 상승장</strong>: S&P 500과 나스닥이 연 20~30% 폭등하는 장세에서는 SCHD가 우세합니다. 
            JEPI는 콜옵션 매도로 인해 주가 상방이 1~2% 내외로 잘려나가기 때문에 상승장 수익률을 대부분 놓치게 됩니다.
          </li>
          <li>
            <strong>장기 누적 총수익률(Total Return)</strong>: 10년 이상 장기 투자 시, 배당금을 모두 재투자한다고 가정했을 때 
            배당성장과 주가 성장이 함께 일어나는 SCHD의 총자산 형성 속도가 커버드콜 ETF를 압도합니다.
          </li>
        </ul>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-income" />
          2. 투자자 세대별 맞춤 포트폴리오 가이드
        </h4>
        <p>
          두 종목은 대립 관계가 아니라 상호 보완 관계입니다. 투자자의 연령과 생애주기 현금흐름 요구치에 따라 비중을 조절해야 합니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white border border-subtle-border space-y-1">
            <span className="text-xs font-bold text-income flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3040 자산 증식기 (은퇴 10년 이상 전)
            </span>
            <p className="text-xs text-brand-muted">
              <strong>SCHD 80% + QQQ/VOO 20%</strong> 권장. 
              당장 쓸 생활비가 아니라면 배당성장률이 두 자릿수인 SCHD를 모아가며 주식 수를 극대화해야 합니다.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-subtle-border space-y-1">
            <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-income" /> 5060 은퇴 생활자 (즉각 현금흐름 필요)
            </span>
            <p className="text-xs text-brand-muted">
              <strong>SCHD 50% + JEPI/JEPQ 50%</strong> 바벨 구성 권장. 
              매월 생활비는 JEPI의 고배당으로 충당하고, SCHD가 인플레이션 방어와 자산 잠식을 막아줍니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
