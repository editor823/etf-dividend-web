/**
 * 월별 배당 캘린더 및 현금흐름 집계 엔진
 */

export interface PortfolioStockInput {
  ticker: string;
  shares: number;
}

export interface DividendEventDetail {
  ticker: string;
  name: string;
  paymentDateApprox: string; // 예: "매월 5일경", "3월 25일경"
  dps: number; // 1주당 해당 회차 배당금 ($)
  frequency: 'monthly' | 'quarterly';
  shares: number;
  grossAmountUSD: number; // 세전 총 배당 ($)
  netAmountUSD: number; // 세후 실수령 ($)
  netAmountKRW: number; // 세후 실수령 (₩)
  isEstimated: boolean; // 예상치 여부
  isQuarterlyBonus: boolean; // 분기 보너스 여부
}

export interface MonthlyCashFlow {
  month: number; // 1 ~ 12
  monthLabel: string; // "1월", "2월" ...
  grossTotalUSD: number;
  netTotalUSD: number;
  netTotalKRW: number;
  events: DividendEventDetail[];
  hasBonusIncome: boolean; // 분기 보너스 포함 여부 (SCHD 등)
  isEmpty: boolean; // 해당 월 배당 없음 여부
}

export interface CalendarSummaryResult {
  exchangeRate: number;
  totalAnnualGrossUSD: number;
  totalAnnualTaxUSD: number;
  totalAnnualNetUSD: number;
  totalAnnualNetKRW: number;
  monthlyAverageNetUSD: number;
  monthlyAverageNetKRW: number;
  emptyMonthsCount: number; // 배당이 비어있는 달 개수
  hasQuarterlyBonuses: boolean;
  monthlyCashFlows: MonthlyCashFlow[]; // 1월~12월 배열
}

export interface CalendarPreset {
  id: string;
  name: string;
  description: string;
  portfolio: Record<string, number>; // { SCHD: 200, JEPI: 300 }
}

/**
 * 주요 ETF별 배당 스펙 및 지급 월/일정
 */
interface TickerDividendSchedule {
  name: string;
  frequency: 'monthly' | 'quarterly';
  payMonths: number[]; // 지급 월 목록 [1,2..12] 또는 [3,6,9,12]
  dayLabel: string; // "매월 5일경", "분기말 25일경"
  dpsPerPayment: number; // 1회 지급당 주당 배당금 ($)
  isEstimated: boolean;
}

import { ETF_DATABASE } from '@/lib/data/etf-database';

export const TICKER_SCHEDULES: Record<string, TickerDividendSchedule> = Object.fromEntries(
  Object.values(ETF_DATABASE).map((etf) => {
    const annualDps = etf.currentPrice * etf.dividendYield;
    const paymentsCount = etf.frequency === 'monthly' ? 12 : 4;
    return [
      etf.ticker,
      {
        name: etf.nameKo ? `${etf.nameKo} (${etf.ticker})` : etf.name,
        frequency: etf.frequency,
        payMonths: etf.payMonths,
        dayLabel: etf.payMonthsLabel,
        dpsPerPayment: Number((annualDps / paymentsCount).toFixed(3)),
        isEstimated: etf.frequency === 'monthly',
      },
    ];
  })
);

/**
 * 추천 포트폴리오 프리셋
 */
export const CALENDAR_PRESETS: CalendarPreset[] = [
  {
    id: 'monthly_salary',
    name: '황금 월급형 (SCHD+JEPI+JEPQ)',
    description: '매월 1일 고인컴 월배당 + 분기말(3,6,9,12월) 보너스 배당이 쏟아지는 빈틈없는 현금흐름 포트폴리오',
    portfolio: { SCHD: 200, JEPI: 300, JEPQ: 200 },
  },
  {
    id: 'growth_focus',
    name: '배당성장 집중형 (SCHD 500주)',
    description: 'SCHD 위주로 모아가며 3, 6, 9, 12월 분기마다 큼직한 배당 보너스를 챙기는 자본성장 중심형',
    portfolio: { SCHD: 500, JEPI: 100 },
  },
  {
    id: 'high_income_all',
    name: '초고인컴 월배당 올인형 (JEPI+JEPQ)',
    description: '매월 초 12달 내내 일정하고 풍부한 8~9%대 현금흐름으로 생활비를 충당하는 은퇴 파이어형',
    portfolio: { JEPI: 500, JEPQ: 500 },
  },
];

const TAX_RATE = 0.15; // 미국 배당 원천징수세 15%

/**
 * 사용자의 보유 주식 수를 바탕으로 1~12월 배당 캘린더 및 현금흐름 집계 함수
 */
export function calculateDividendCalendar(
  portfolio: Record<string, number>, // { SCHD: 200, JEPI: 300 }
  exchangeRate = 1350
): CalendarSummaryResult {
  // 1월부터 12월까지 초기화
  const monthlyCashFlows: MonthlyCashFlow[] = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      month,
      monthLabel: `${month}월`,
      grossTotalUSD: 0,
      netTotalUSD: 0,
      netTotalKRW: 0,
      events: [],
      hasBonusIncome: false,
      isEmpty: true,
    };
  });

  let totalAnnualGrossUSD = 0;

  // 포트폴리오 각 종목 순회
  Object.entries(portfolio).forEach(([ticker, shares]) => {
    if (shares <= 0) return;
    const schedule = TICKER_SCHEDULES[ticker];
    if (!schedule) return;

    schedule.payMonths.forEach((payMonth) => {
      const monthIndex = payMonth - 1;
      const grossAmountUSD = shares * schedule.dpsPerPayment;
      const netAmountUSD = grossAmountUSD * (1 - TAX_RATE);
      const netAmountKRW = netAmountUSD * exchangeRate;

      const isBonus = schedule.frequency === 'quarterly';

      const event: DividendEventDetail = {
        ticker,
        name: schedule.name,
        paymentDateApprox: `${payMonth}월 ${schedule.dayLabel}`,
        dps: schedule.dpsPerPayment,
        frequency: schedule.frequency,
        shares,
        grossAmountUSD: Math.round(grossAmountUSD * 100) / 100,
        netAmountUSD: Math.round(netAmountUSD * 100) / 100,
        netAmountKRW: Math.round(netAmountKRW),
        isEstimated: schedule.isEstimated,
        isQuarterlyBonus: isBonus,
      };

      const monthFlow = monthlyCashFlows[monthIndex];
      monthFlow.grossTotalUSD += grossAmountUSD;
      monthFlow.netTotalUSD += netAmountUSD;
      monthFlow.netTotalKRW += netAmountKRW;
      monthFlow.events.push(event);
      if (isBonus) {
        monthFlow.hasBonusIncome = true;
      }
      monthFlow.isEmpty = false;

      totalAnnualGrossUSD += grossAmountUSD;
    });
  });

  // 금액 반올림 정리
  monthlyCashFlows.forEach((flow) => {
    flow.grossTotalUSD = Math.round(flow.grossTotalUSD);
    flow.netTotalUSD = Math.round(flow.netTotalUSD);
    flow.netTotalKRW = Math.round(flow.netTotalKRW);
  });

  const totalAnnualTaxUSD = totalAnnualGrossUSD * TAX_RATE;
  const totalAnnualNetUSD = totalAnnualGrossUSD - totalAnnualTaxUSD;
  const totalAnnualNetKRW = totalAnnualNetUSD * exchangeRate;
  const monthlyAverageNetUSD = totalAnnualNetUSD / 12;
  const monthlyAverageNetKRW = totalAnnualNetKRW / 12;

  const emptyMonthsCount = monthlyCashFlows.filter((m) => m.isEmpty).length;
  const hasQuarterlyBonuses = monthlyCashFlows.some((m) => m.hasBonusIncome);

  return {
    exchangeRate,
    totalAnnualGrossUSD: Math.round(totalAnnualGrossUSD),
    totalAnnualTaxUSD: Math.round(totalAnnualTaxUSD),
    totalAnnualNetUSD: Math.round(totalAnnualNetUSD),
    totalAnnualNetKRW: Math.round(totalAnnualNetKRW),
    monthlyAverageNetUSD: Math.round(monthlyAverageNetUSD),
    monthlyAverageNetKRW: Math.round(monthlyAverageNetKRW),
    emptyMonthsCount,
    hasQuarterlyBonuses,
    monthlyCashFlows,
  };
}
