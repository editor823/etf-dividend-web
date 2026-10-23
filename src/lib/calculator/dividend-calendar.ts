/**
 * 20개 ETF 데이터베이스 기반 12개월 배당 캘린더 & 현금흐름 엔진
 * 경로: src/lib/calculator/dividend-calendar.ts
 */

import { ETF_MAP } from '@/data/etfList';

export interface PortfolioPosition {
  ticker: string;
  shares: number;
  amountKRW: number;
}

export interface MonthlyDividendEvent {
  ticker: string;
  name: string;
  exDateApprox: string; // 예: "3월 20일경"
  payDateApprox: string; // 예: "3월 28일경"
  frequency: '월배당' | '분기배당';
  shares: number;
  grossAmountUSD: number;
  netAmountUSD: number;
  netAmountKRW: number;
}

export interface MonthFlowData {
  month: number; // 1 ~ 12
  monthLabel: string; // "1월", "2월" ...
  totalNetKRW: number; // 세후 실수령액 (원화)
  totalNetUSD: number; // 세후 실수령액 (달러)
  events: MonthlyDividendEvent[];
  isEmpty: boolean; // 해당 월 배당이 없는지 여부
  hasBonusIncome: boolean; // 분기 보너스 등 배당이 터지는 달인지 여부
}

export interface PipelineDiagnosis {
  isComplete: boolean; // 12개월 모두 채워졌는지 여부
  paidMonthsCount: number; // 배당이 나오는 개월 수 (0~12)
  emptyMonths: number[]; // 배당이 비는 월 목록 (예: [2, 5, 8, 11])
  recommendationMessage: string; // 추천 가이드 메시지
  recommendedTickers: string[]; // 공백을 메우기 위한 추천 ETF
}

export interface CalendarCalculationResult {
  exchangeRate: number;
  totalPortfolioKRW: number;
  totalPortfolioUSD: number;
  totalAnnualGrossUSD: number;
  totalAnnualTaxUSD: number;
  totalAnnualNetUSD: number;
  totalAnnualNetKRW: number;
  monthlyAverageNetKRW: number;
  monthlyAverageNetUSD: number;
  effectiveNetYield: number; // 포트폴리오 실질 세후 배당률 (%)
  maxMonthFlow: { month: number; monthLabel: string; netKRW: number };
  minMonthFlow: { month: number; monthLabel: string; netKRW: number };
  flowDeviationPercent: number; // 최고 월 대비 최저 월 편차율
  monthlyFlows: MonthFlowData[];
  diagnosis: PipelineDiagnosis;
}

/**
 * 20개 ETF별 상세 배당 스케줄 (지급월, 배당락 시즌, 지급일 시즌)
 */
export interface ETFScheduleInfo {
  ticker: string;
  payoutCycle: '월배당' | '분기배당';
  payMonths: number[]; // 지급 월 목록 [1..12] or [3, 6, 9, 12] or [4, 7, 10, 12]
  exDateSeason: string; // 배당락일 시즌
  payDateSeason: string; // 실제 지급일 시즌
}

export const ETF_SCHEDULES: Record<string, ETFScheduleInfo> = {
  // 1. 배당성장
  SCHD: {
    ticker: 'SCHD',
    payoutCycle: '분기배당',
    payMonths: [3, 6, 9, 12],
    exDateSeason: '매 분기 20일경',
    payDateSeason: '매 분기 말일경 (3/6/9/12월)',
  },
  DGRO: {
    ticker: 'DGRO',
    payoutCycle: '분기배당',
    payMonths: [3, 6, 9, 12],
    exDateSeason: '매 분기 중순',
    payDateSeason: '매 분기 말일경 (3/6/9/12월)',
  },
  VIG: {
    ticker: 'VIG',
    payoutCycle: '분기배당',
    payMonths: [3, 6, 9, 12],
    exDateSeason: '매 분기 20일경',
    payDateSeason: '매 분기 말일경 (3/6/9/12월)',
  },

  // 2. 월배당 커버드콜
  JEPI: {
    ticker: 'JEPI',
    payoutCycle: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    exDateSeason: '매월 1일 전후',
    payDateSeason: '매월 5~7일경',
  },
  JEPQ: {
    ticker: 'JEPQ',
    payoutCycle: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    exDateSeason: '매월 1일 전후',
    payDateSeason: '매월 5~7일경',
  },
  SPYI: {
    ticker: 'SPYI',
    payoutCycle: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    exDateSeason: '매월 20일경',
    payDateSeason: '매월 말일경',
  },
  QQQI: {
    ticker: 'QQQI',
    payoutCycle: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    exDateSeason: '매월 20일경',
    payDateSeason: '매월 말일경',
  },
  DIVO: {
    ticker: 'DIVO',
    payoutCycle: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    exDateSeason: '매월 말일경',
    payDateSeason: '매월 말일~익월 초',
  },

  // 3. 시장지수 / 성장
  VOO: {
    ticker: 'VOO',
    payoutCycle: '분기배당',
    payMonths: [3, 6, 9, 12],
    exDateSeason: '매 분기 20일경',
    payDateSeason: '매 분기 말일경 (3/6/9/12월)',
  },
  QQQ: {
    ticker: 'QQQ',
    payoutCycle: '분기배당',
    payMonths: [4, 7, 10, 12],
    exDateSeason: '매 분기 18일경',
    payDateSeason: '4, 7, 10월 및 12월 말',
  },
  DIA: {
    ticker: 'DIA',
    payoutCycle: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    exDateSeason: '매월 15일경',
    payDateSeason: '매월 중하순',
  },
  SCHG: {
    ticker: 'SCHG',
    payoutCycle: '분기배당',
    payMonths: [3, 6, 9, 12],
    exDateSeason: '매 분기 중순',
    payDateSeason: '매 분기 말일경 (3/6/9/12월)',
  },

  // 4. 고배당 / 배당귀족
  NOBL: {
    ticker: 'NOBL',
    payoutCycle: '분기배당',
    payMonths: [3, 6, 9, 12],
    exDateSeason: '매 분기 하순',
    payDateSeason: '매 분기 말일경 (3/6/9/12월)',
  },
  VYM: {
    ticker: 'VYM',
    payoutCycle: '분기배당',
    payMonths: [3, 6, 9, 12],
    exDateSeason: '매 분기 하순',
    payDateSeason: '매 분기 말일경 (3/6/9/12월)',
  },
  HDV: {
    ticker: 'HDV',
    payoutCycle: '분기배당',
    payMonths: [3, 6, 9, 12],
    exDateSeason: '매 분기 중순',
    payDateSeason: '매 분기 말일경 (3/6/9/12월)',
  },

  // 5. 월배당 리츠 / 채권
  O: {
    ticker: 'O',
    payoutCycle: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    exDateSeason: '매월 말일경',
    payDateSeason: '매월 15일경 (익월 중순)',
  },
  VNQ: {
    ticker: 'VNQ',
    payoutCycle: '분기배당',
    payMonths: [3, 6, 9, 12],
    exDateSeason: '매 분기 20일경',
    payDateSeason: '매 분기 말일경 (3/6/9/12월)',
  },
  TLT: {
    ticker: 'TLT',
    payoutCycle: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    exDateSeason: '매월 1일 전후',
    payDateSeason: '매월 초 (1~7일)',
  },
  SGOV: {
    ticker: 'SGOV',
    payoutCycle: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    exDateSeason: '매월 1일 전후',
    payDateSeason: '매월 초 (1~7일)',
  },
  MAIN: {
    ticker: 'MAIN',
    payoutCycle: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    exDateSeason: '매월 20일경',
    payDateSeason: '매월 15일경 (익월 중순)',
  },
};

/**
 * 하위 호환용 TICKER_SCHEDULES export
 */
export const TICKER_SCHEDULES: Record<
  string,
  {
    name: string;
    frequency: 'monthly' | 'quarterly';
    payMonths: number[];
    dayLabel: string;
    dpsPerPayment: number;
    isEstimated: boolean;
  }
> = Object.fromEntries(
  Object.entries(ETF_SCHEDULES).map(([ticker, sched]) => {
    const etf = ETF_MAP[ticker];
    const annualDps = etf ? etf.currentPriceUSD * etf.dividendYield : 2;
    const paymentsCount = sched.payMonths.length;
    return [
      ticker,
      {
        name: etf?.name || ticker,
        frequency: sched.payoutCycle === '월배당' ? 'monthly' : 'quarterly',
        payMonths: sched.payMonths,
        dayLabel: sched.payDateSeason,
        dpsPerPayment: Number((annualDps / paymentsCount).toFixed(3)),
        isEstimated: sched.payoutCycle === '월배당',
      },
    ];
  })
);

/**
 * 원클릭 '완벽한 12개월 월급 조합' 프리셋 3종
 */
export interface SalaryPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  weights: Record<string, number>; // { SCHD: 0.5, JEPI: 0.5 }
}

export const SALARY_PRESETS: SalaryPreset[] = [
  {
    id: 'starter_combo',
    name: '[초보자 추천] SCHD 50% + JEPI 50%',
    badge: '분기성장 + 매월 고배당',
    description:
      '매월 초 JEPI에서 연 7~8%대 고배당 월급을 받고, 3·6·9·12월에는 SCHD의 배당성장 보너스를 얹어 받는 국민 배당 듀오 조합',
    weights: { SCHD: 0.50, JEPI: 0.50 },
  },
  {
    id: 'growth_income_reits',
    name: '[지수 & 테크] VOO 40% + QQQ 30% + O 30%',
    badge: '시장 성장 + 리츠 월배당',
    description:
      'S&P 500과 나스닥 혁신 성장으로 자본 차익을 극대화하면서, 리얼티인컴(O)의 안정적인 연 5%대 월세 배당으로 현금흐름 보완',
    weights: { VOO: 0.40, QQQ: 0.30, O: 0.30 },
  },
  {
    id: 'rotation_pipeline',
    name: '[전통 분기 순환] SCHD 40% + DIA 30% + MAIN 30%',
    badge: '월배당 + 다우블루칩 + BDC',
    description:
      '3-6-9-12월 배당성장의 제왕 SCHD와 매달 배당을 주는 다우 30 블루칩(DIA), 초고배당 BDC(MAIN)를 엮어 12달 내내 풍성한 현금흐름 완성',
    weights: { SCHD: 0.40, DIA: 0.30, MAIN: 0.30 },
  },
];

/**
 * 총 투자 예산(원화)을 비율에 따라 각 종목 주수 및 금액으로 배분
 */
export function allocateBudgetToPositions(
  totalBudgetKRW: number,
  weights: Record<string, number>,
  exchangeRate = 1350
): Record<string, number> {
  const result: Record<string, number> = {};
  const totalUSD = totalBudgetKRW / exchangeRate;

  Object.entries(weights).forEach(([ticker, weight]) => {
    const etf = ETF_MAP[ticker];
    if (etf && etf.currentPriceUSD > 0 && weight > 0) {
      const allocatedUSD = totalUSD * weight;
      const shares = Math.floor(allocatedUSD / etf.currentPriceUSD);
      result[ticker] = Math.max(0, shares);
    } else {
      result[ticker] = 0;
    }
  });

  return result;
}

/**
 * 12개월 배당 캘린더 연산 메인 함수
 */
export function calculate12MonthCalendar(
  portfolioShares: Record<string, number>, // { SCHD: 200, JEPI: 300 }
  exchangeRate = 1350
): CalendarCalculationResult {
  const TAX_RATE = 0.15; // 미국 배당 원천징수세 15%

  // 1월부터 12월까지 월별 컨테이너 초기화
  const monthlyFlows: MonthFlowData[] = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      month,
      monthLabel: `${month}월`,
      totalNetKRW: 0,
      totalNetUSD: 0,
      events: [],
      isEmpty: true,
      hasBonusIncome: false,
    };
  });

  let totalPortfolioUSD = 0;
  let totalAnnualGrossUSD = 0;

  // 포트폴리오에 담긴 종목별 배당 계산
  Object.entries(portfolioShares).forEach(([ticker, shares]) => {
    if (shares <= 0) return;
    const etf = ETF_MAP[ticker];
    const schedule = ETF_SCHEDULES[ticker];
    if (!etf || !schedule) return;

    const positionUSD = shares * etf.currentPriceUSD;
    totalPortfolioUSD += positionUSD;

    const annualDividendUSD = positionUSD * etf.dividendYield;
    const paymentsCount = schedule.payMonths.length;
    const dpsPerPaymentUSD = (etf.currentPriceUSD * etf.dividendYield) / paymentsCount;

    totalAnnualGrossUSD += annualDividendUSD;

    // 해당 종목의 지급 월들에 배당 이벤트 분배
    schedule.payMonths.forEach((payMonth) => {
      const monthIdx = payMonth - 1;
      const grossPaymentUSD = shares * dpsPerPaymentUSD;
      const netPaymentUSD = grossPaymentUSD * (1 - TAX_RATE);
      const netPaymentKRW = netPaymentUSD * exchangeRate;

      const event: MonthlyDividendEvent = {
        ticker,
        name: etf.name.split('(')[0].trim(),
        exDateApprox: schedule.exDateSeason,
        payDateApprox: schedule.payDateSeason,
        frequency: schedule.payoutCycle,
        shares,
        grossAmountUSD: grossPaymentUSD,
        netAmountUSD: netPaymentUSD,
        netAmountKRW: Math.round(netPaymentKRW),
      };

      const monthFlow = monthlyFlows[monthIdx];
      monthFlow.events.push(event);
      monthFlow.totalNetUSD += netPaymentUSD;
      monthFlow.totalNetKRW += Math.round(netPaymentKRW);
      monthFlow.isEmpty = false;
      if (schedule.payoutCycle === '분기배당') {
        monthFlow.hasBonusIncome = true;
      }
    });
  });

  const totalPortfolioKRW = Math.round(totalPortfolioUSD * exchangeRate);
  const totalAnnualTaxUSD = totalAnnualGrossUSD * TAX_RATE;
  const totalAnnualNetUSD = totalAnnualGrossUSD - totalAnnualTaxUSD;
  const totalAnnualNetKRW = Math.round(totalAnnualNetUSD * exchangeRate);
  const monthlyAverageNetUSD = totalAnnualNetUSD / 12;
  const monthlyAverageNetKRW = Math.round(totalAnnualNetKRW / 12);

  const effectiveNetYield =
    totalPortfolioUSD > 0 ? (totalAnnualNetUSD / totalPortfolioUSD) * 100 : 0;

  // 최고 및 최저 배당 월 산출
  let maxMonthFlow = { month: 1, monthLabel: '1월', netKRW: 0 };
  let minMonthFlow = { month: 1, monthLabel: '1월', netKRW: Infinity };

  monthlyFlows.forEach((flow) => {
    if (flow.totalNetKRW > maxMonthFlow.netKRW) {
      maxMonthFlow = { month: flow.month, monthLabel: flow.monthLabel, netKRW: flow.totalNetKRW };
    }
    if (flow.totalNetKRW < minMonthFlow.netKRW) {
      minMonthFlow = { month: flow.month, monthLabel: flow.monthLabel, netKRW: flow.totalNetKRW };
    }
  });

  if (minMonthFlow.netKRW === Infinity) {
    minMonthFlow.netKRW = 0;
  }

  const flowDeviationPercent =
    maxMonthFlow.netKRW > 0
      ? Number((((maxMonthFlow.netKRW - minMonthFlow.netKRW) / maxMonthFlow.netKRW) * 100).toFixed(1))
      : 0;

  // 파이프라인 완성도 진단
  const emptyMonths = monthlyFlows.filter((m) => m.isEmpty).map((m) => m.month);
  const paidMonthsCount = 12 - emptyMonths.length;
  const isComplete = paidMonthsCount === 12;

  let recommendationMessage = '';
  let recommendedTickers: string[] = [];

  if (isComplete) {
    recommendationMessage =
      '🎯 12개월 중 12개월 모두 배당 입금 달성! 공백 없이 1년 내내 월급처럼 돈이 들어오는 100% 완벽한 배당 파이프라인입니다.';
  } else {
    const emptyListStr = emptyMonths.map((m) => `${m}월`).join(', ');
    recommendationMessage = `⚠️ 1년 중 ${emptyListStr}에 배당 입금이 비어있습니다. 해당 월에 배당을 지급하는 월배당 ETF(예: JEPI, O, MAIN, DIA 등)를 포트폴리오에 추가하면 빈틈없는 12개월 월급 파이프라인을 완성할 수 있습니다.`;
    recommendedTickers = ['JEPI', 'O', 'MAIN', 'DIA', 'SPYI'];
  }

  return {
    exchangeRate,
    totalPortfolioKRW,
    totalPortfolioUSD: Math.round(totalPortfolioUSD),
    totalAnnualGrossUSD,
    totalAnnualTaxUSD: Math.round(totalAnnualTaxUSD),
    totalAnnualNetUSD: Math.round(totalAnnualNetUSD),
    totalAnnualNetKRW,
    monthlyAverageNetKRW,
    monthlyAverageNetUSD: Math.round(monthlyAverageNetUSD),
    effectiveNetYield: Number(effectiveNetYield.toFixed(2)),
    maxMonthFlow,
    minMonthFlow,
    flowDeviationPercent,
    monthlyFlows,
    diagnosis: {
      isComplete,
      paidMonthsCount,
      emptyMonths,
      recommendationMessage,
      recommendedTickers,
    },
  };
}
