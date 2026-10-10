import React from 'react';
import { BookOpen, Calendar, Clock, DollarSign } from 'lucide-react';

export default function DividendCalendarGuide() {
  return (
    <section className="mt-8 pt-8 border-t border-subtle-border/80 space-y-6 text-brand-primary">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-income-light text-income">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-income uppercase tracking-wider">
            E-E-A-T Cash Flow Engineering
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-brand-primary">
            1·4·7·10, 2·5·8·11, 3·6·9·12월 분기 배당 조합으로 매월 입금되는 월급형 포트폴리오 구축법
          </h3>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-xs sm:text-sm text-brand-muted leading-relaxed space-y-4">
        <p>
          미국 주식 시장에 상장된 대부분의 대형 우량 ETF(SCHD, VOO, VIG, DGRO 등)는 1년에 4번 배당금을 지급하는 
          <strong>분기 배당(Quarterly Dividend)</strong> 방식을 채택하고 있습니다. 
          따라서 단일 종목만 보유할 경우 3개월에 한 번씩만 돈이 들어와, 매월 고정비(관리비, 통신비, 대출 이자)를 지출해야 하는 
          투자자에게는 현금흐름의 불일치가 발생합니다.
        </p>

        {/* 12개월 월급 매핑 매트릭스 */}
        <div className="p-4 rounded-xl bg-white border border-subtle-border shadow-xs space-y-3">
          <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-income" /> 12개월 빈틈없는 분기 배당 ETF 3색 조합 매트릭스
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-lg bg-brand-secondary/40 border border-subtle-border space-y-1">
              <strong className="text-income font-bold block">A그룹 (1, 4, 7, 10월)</strong>
              <p className="font-semibold text-brand-primary">KO, PEP, MO, VNQ 등</p>
              <p className="text-[11px] text-brand-muted">새해 첫 달과 분기 초 고정 현금흐름 담당</p>
            </div>
            <div className="p-3 rounded-lg bg-brand-secondary/40 border border-subtle-border space-y-1">
              <strong className="text-brand-primary font-bold block">B그룹 (2, 5, 8, 11월)</strong>
              <p className="font-semibold text-brand-primary">PG, ABBV, JNJ, O 등</p>
              <p className="text-[11px] text-brand-muted">필수소비재 & 헬스케어 기반 탄탄한 방어력</p>
            </div>
            <div className="p-3 rounded-lg bg-brand-secondary/40 border border-subtle-border space-y-1">
              <strong className="text-income font-bold block">C그룹 (3, 6, 9, 12월)</strong>
              <p className="font-semibold text-brand-primary">SCHD, VOO, QQQ, VIG</p>
              <p className="text-[11px] text-brand-muted">분기 말 집중 배당으로 가장 풍성한 보너스 달</p>
            </div>
          </div>
        </div>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-income" />
          1. 월배당 커버드콜(JEPI/JEPQ)을 기저에 둔 &lsquo;스마트 하이브리드&rsquo; 배당 달력
        </h4>
        <p>
          분기 배당 종목 3가지를 매수하는 것보다 훨씬 간편하고 강력한 방법은, 
          <strong>매월 1~7일경 지급되는 JEPI나 JEPQ를 기초 베이스로 깔고</strong>, 
          그 위에 <strong>3·6·9·12월에 거액을 지급하는 SCHD나 VOO를 얹는</strong> 구조입니다.
        </p>
        <p>
          본 캘린더 대시보드 화면을 통해 시뮬레이션해 보시면, 
          1월부터 12월까지 매달 최소 100만 원의 기본 생활비가 입금되면서, 
          분기 말인 3, 6, 9, 12월에는 200만~250만 원의 &lsquo;분기 보너스 현금&rsquo;이 들어오는 
          이상적인 급여형 라이프사이클을 완성할 수 있습니다.
        </p>

        <h4 className="text-base font-bold text-brand-primary pt-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-income" />
          2. 배당락일(Ex-Dividend Date)과 매수 타이밍 주의사항
        </h4>
        <ul className="space-y-1.5 list-disc list-inside pl-1 text-xs">
          <li>
            <strong>결제일 T+1(영업일 기준 1일) 제도 반영</strong>: 
            미국 증시는 결제 주기가 T+1로 단축되었습니다. 따라서 배당을 받으려면 반드시 <strong>배당락일(Ex-Date) 최소 1영업일 전 미국 정규장 마감 전까지 매수</strong>를 완료해야 합니다.
          </li>
          <li>
            <strong>배당락(Dividend Drop) 현상</strong>: 배당락일 당일에는 주가가 지급되는 배당금만큼 하락하여 시작하는 것이 일반적입니다. 
            단기 배당금만 노리고 배당락 직전에 샀다가 당일 매도하는 전략은 세금(15%)과 거래비용 때문에 손실을 볼 확률이 매우 높습니다.
          </li>
          <li>
            <strong>현금흐름 재배치</strong>: 분기 배당이 집중되는 3, 6, 9, 12월에 들어온 잉여 배당금은 소비해 버리지 않고 
            즉시 다음 달(4, 7, 10, 1월)에 상대적으로 인컴이 적은 종목을 매수하는 종잣돈으로 재배치하는 습관이 중요합니다.
          </li>
        </ul>
      </div>
    </section>
  );
}
