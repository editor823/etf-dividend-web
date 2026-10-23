import { ETF_DATABASE, ETFMasterData } from '@/lib/data/etf-database';

/**
 * 배당 바벨 포트폴리오 최적화기 연산 엔진
 * [성장/지수/배당성장] vs [고배당 커버드콜/인컴]의 슬라이더 배분 및 합성 현금흐름 연산
 */

export interface BarbellInput {
  growthTicker?: string; // 기본: 'SCHD' (VOO, QQQ, VIG, DGRO 등 선택 가능)
  incomeTicker?: string; // 기본: 'JEPI' (JEPQ, SPYI, DIVO, O 등 선택 가능)
  growthWeight: number; // 0 ~ 100 (%)
  
  // 기존 하위 호환 필드
  schdWeight?: number;
  partnerTicker?: string;

  totalCapital: number; // 총 투자 자본금
  currency: 'USD' | 'KRW'; // 통화
  exchangeRate?: number; // 기본 1,350
  targetMonthlyDividend?: number; // (역산 모드용) 목표 월 세후 배당금
}

export interface HoldingAllocation {
  ticker: string;
  name: string;
  role: string;
  weightPercent: number; // %
  allocatedCapitalUSD: number;
  allocatedCapitalKRW: number;
  currentPrice: number;
  sharesToBuy: number;
  dividendYield: number; // 시가배당률
  dividendGrowth5y: number; // 5년 배당성장률
  annualGrossDividendUSD: number;
  annualNetDividendUSD: number;
  monthlyNetDividendUSD: number;
  monthlyNetDividendKRW: number;
}

export interface BarbellPreset {
  id: string;
  title: string;
  subtitle: string;
  growthWeight: number;
  incomeWeight: number;
  description: string;
  badge: string;
}

export interface BarbellResult {
  growthTicker: string;
  incomeTicker: string;
  growthWeight: number;
  incomeWeight: number;
  exchangeRate: number;

  // 하위 호환용 필드
  schdWeight: number;
  partnerWeight: number;
  partnerTicker: string;

  // 종합 포트폴리오 핵심 지표
  combinedDividendYield: number; // 가중평균 시가배당률 (예: 0.0525 = 5.25%)
  combinedDividendGrowth5y: number; // 가중평균 5년 배당성장률
  
  // 자본금 & 배당금
  totalCapitalUSD: number;
  totalCapitalKRW: number;
  
  annualGrossDividendUSD: number; // 연간 세전 배당금
  annualTaxUSD: number; // 미국 세금 15%
  annualNetDividendUSD: number; // 연간 세후 실수령액
  monthlyNetDividendUSD: number; // 월평균 세후 배당금 ($)
  monthlyNetDividendKRW: number; // 월평균 세후 배당금 (₩)
  
  // 종목별 세부 배분 현황
  holdings: {
    growth: HoldingAllocation;
    income: HoldingAllocation;
    // 하위 호환
    schd: HoldingAllocation;
    partner: HoldingAllocation;
  };

  // 목표 월 배당금 달성을 위한 역산 결과
  reverseCalculation?: {
    targetMonthlyNetUSD: number;
    targetMonthlyNetKRW: number;
    requiredTotalCapitalUSD: number;
    requiredTotalCapitalKRW: number;
    requiredGrowthShares: number;
    requiredIncomeShares: number;
    requiredSchdShares: number;
    requiredPartnerShares: number;
  };
}

/**
 * 3가지 대표 바벨 전략 프리셋
 */
export const BARBELL_PRESETS: BarbellPreset[] = [
  {
    id: 'growth_focus',
    title: '성장 & 복리 집중형',
    subtitle: '성장 70% : 고인컴 30%',
    growthWeight: 70,
    incomeWeight: 30,
    description: '향후 10년 이상 배당 성장과 주가 상승을 극대화하며, 30%의 고인컴 월배당으로 재투자 가속화',
    badge: '성장 & 재투자 최적화',
  },
  {
    id: 'golden_balance',
    title: '황금 밸런스형',
    subtitle: '성장 50% : 고인컴 50%',
    growthWeight: 50,
    incomeWeight: 50,
    description: '자본 성장과 월급형 현금흐름의 완벽한 5:5 조화로 하락장 방어와 복리 성장을 동시 확보',
    badge: '최적의 공수 밸런스',
  },
  {
    id: 'income_focus',
    title: '은퇴 생활비 인컴형',
    subtitle: '성장 30% : 고인컴 70%',
    growthWeight: 30,
    incomeWeight: 70,
    description: '즉각적인 고배당 월 인컴으로 매월 풍부한 생활비를 확보하고, 30%의 성장주로 인플레이션 방어',
    badge: '즉각 월급 현금흐름',
  },
];

/**
 * 미국 배당소득세율 (15% 원천징수)
 */
const TAX_RATE = 0.15;

/**
 * 바벨 포트폴리오 연산 함수
 */
export function calculateBarbellPortfolio(input: BarbellInput): BarbellResult {
  const {
    growthTicker = 'SCHD',
    incomeTicker = input.partnerTicker || 'JEPI',
    totalCapital,
    currency,
    exchangeRate = 1350,
    targetMonthlyDividend,
  } = input;

  const actualGrowthWeight = input.growthWeight ?? input.schdWeight ?? 50;
  const growthWeight = Math.max(0, Math.min(100, actualGrowthWeight));
  const incomeWeight = 100 - growthWeight;

  const wGrowth = growthWeight / 100;
  const wIncome = incomeWeight / 100;

  const growthSpec: ETFMasterData = ETF_DATABASE[growthTicker] || ETF_DATABASE['SCHD'];
  const incomeSpec: ETFMasterData = ETF_DATABASE[incomeTicker] || ETF_DATABASE['JEPI'];

  // 총 자본금 달러/원화 통일
  const totalCapitalUSD =
    currency === 'USD' ? totalCapital : totalCapital / exchangeRate;
  const totalCapitalKRW =
    currency === 'KRW' ? totalCapital : totalCapital * exchangeRate;

  // 1. 포트폴리오 종합 지표 계산 (가중평균)
  const combinedDividendYield =
    wGrowth * growthSpec.dividendYield + wIncome * incomeSpec.dividendYield;

  const combinedDividendGrowth5y =
    wGrowth * (growthSpec.dividendGrowth5y ?? 0.05) +
    wIncome * (incomeSpec.dividendGrowth5y ?? 0.05);

  // 2. 종목별 배분 금액
  const growthCapitalUSD = totalCapitalUSD * wGrowth;
  const growthCapitalKRW = growthCapitalUSD * exchangeRate;
  const growthShares =
    growthSpec.currentPrice > 0 ? Math.floor(growthCapitalUSD / growthSpec.currentPrice) : 0;
  const growthAnnualGrossUSD = growthShares * (growthSpec.currentPrice * growthSpec.dividendYield);
  const growthAnnualNetUSD = growthAnnualGrossUSD * (1 - TAX_RATE);
  const growthMonthlyNetUSD = growthAnnualNetUSD / 12;

  const incomeCapitalUSD = totalCapitalUSD * wIncome;
  const incomeCapitalKRW = incomeCapitalUSD * exchangeRate;
  const incomeShares =
    incomeSpec.currentPrice > 0 ? Math.floor(incomeCapitalUSD / incomeSpec.currentPrice) : 0;
  const incomeAnnualGrossUSD = incomeShares * (incomeSpec.currentPrice * incomeSpec.dividendYield);
  const incomeAnnualNetUSD = incomeAnnualGrossUSD * (1 - TAX_RATE);
  const incomeMonthlyNetUSD = incomeAnnualNetUSD / 12;

  // 3. 종합 배당금 합산
  const annualGrossDividendUSD = growthAnnualGrossUSD + incomeAnnualGrossUSD;
  const annualTaxUSD = annualGrossDividendUSD * TAX_RATE;
  const annualNetDividendUSD = annualGrossDividendUSD - annualTaxUSD;
  const monthlyNetDividendUSD = annualNetDividendUSD / 12;
  const monthlyNetDividendKRW = monthlyNetDividendUSD * exchangeRate;

  // 4. (역산 모드 옵션) 목표 월 배당금 입력 시 필요 총 자본금 역산
  let reverseCalculation: BarbellResult['reverseCalculation'] | undefined;
  if (targetMonthlyDividend && targetMonthlyDividend > 0) {
    const targetMonthlyNetUSD =
      currency === 'USD' ? targetMonthlyDividend : targetMonthlyDividend / exchangeRate;
    const targetMonthlyNetKRW = targetMonthlyNetUSD * exchangeRate;
    const targetAnnualNetUSD = targetMonthlyNetUSD * 12;

    const netCombinedYield = combinedDividendYield * (1 - TAX_RATE);
    const requiredTotalCapitalUSD =
      netCombinedYield > 0 ? targetAnnualNetUSD / netCombinedYield : 0;
    const requiredTotalCapitalKRW = requiredTotalCapitalUSD * exchangeRate;

    const reqGrowthCap = requiredTotalCapitalUSD * wGrowth;
    const reqIncomeCap = requiredTotalCapitalUSD * wIncome;
    const requiredGrowthShares = Math.ceil(reqGrowthCap / growthSpec.currentPrice);
    const requiredIncomeShares = Math.ceil(reqIncomeCap / incomeSpec.currentPrice);

    reverseCalculation = {
      targetMonthlyNetUSD,
      targetMonthlyNetKRW,
      requiredTotalCapitalUSD,
      requiredTotalCapitalKRW,
      requiredGrowthShares,
      requiredIncomeShares,
      requiredSchdShares: requiredGrowthShares,
      requiredPartnerShares: requiredIncomeShares,
    };
  }

  const growthAllocation: HoldingAllocation = {
    ticker: growthSpec.ticker,
    name: growthSpec.nameKo ? `${growthSpec.nameKo} (${growthSpec.name})` : growthSpec.name,
    role: `자본성장 & 배당증액 엔진 (${growthSpec.category})`,
    weightPercent: growthWeight,
    allocatedCapitalUSD: growthCapitalUSD,
    allocatedCapitalKRW: growthCapitalKRW,
    currentPrice: growthSpec.currentPrice,
    sharesToBuy: growthShares,
    dividendYield: growthSpec.dividendYield,
    dividendGrowth5y: growthSpec.dividendGrowth5y,
    annualGrossDividendUSD: growthAnnualGrossUSD,
    annualNetDividendUSD: growthAnnualNetUSD,
    monthlyNetDividendUSD: growthMonthlyNetUSD,
    monthlyNetDividendKRW: growthMonthlyNetUSD * exchangeRate,
  };

  const incomeAllocation: HoldingAllocation = {
    ticker: incomeSpec.ticker,
    name: incomeSpec.nameKo ? `${incomeSpec.nameKo} (${incomeSpec.name})` : incomeSpec.name,
    role: `고인컴 월급 캐시카우 (${incomeSpec.category})`,
    weightPercent: incomeWeight,
    allocatedCapitalUSD: incomeCapitalUSD,
    allocatedCapitalKRW: incomeCapitalKRW,
    currentPrice: incomeSpec.currentPrice,
    sharesToBuy: incomeShares,
    dividendYield: incomeSpec.dividendYield,
    dividendGrowth5y: incomeSpec.dividendGrowth5y,
    annualGrossDividendUSD: incomeAnnualGrossUSD,
    annualNetDividendUSD: incomeAnnualNetUSD,
    monthlyNetDividendUSD: incomeMonthlyNetUSD,
    monthlyNetDividendKRW: incomeMonthlyNetUSD * exchangeRate,
  };

  return {
    growthTicker: growthSpec.ticker,
    incomeTicker: incomeSpec.ticker,
    growthWeight,
    incomeWeight,
    schdWeight: growthWeight,
    partnerWeight: incomeWeight,
    partnerTicker: incomeSpec.ticker,
    exchangeRate,
    combinedDividendYield,
    combinedDividendGrowth5y,
    totalCapitalUSD,
    totalCapitalKRW,
    annualGrossDividendUSD,
    annualTaxUSD,
    annualNetDividendUSD,
    monthlyNetDividendUSD,
    monthlyNetDividendKRW,
    holdings: {
      growth: growthAllocation,
      income: incomeAllocation,
      schd: growthAllocation,
      partner: incomeAllocation,
    },
    reverseCalculation,
  };
}
