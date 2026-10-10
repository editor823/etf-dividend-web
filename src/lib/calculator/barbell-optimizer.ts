/**
 * SCHD + JEPI/JEPQ 배당 바벨 포트폴리오 최적화기 연산 엔진
 */

export type HighIncomePartner = 'JEPI' | 'JEPQ';

export interface BarbellInput {
  schdWeight: number; // 0 ~ 100 (%)
  partnerTicker: HighIncomePartner; // 'JEPI' | 'JEPQ'
  totalCapital: number; // 총 투자 자본금
  currency: 'USD' | 'KRW'; // 통화
  exchangeRate?: number; // 기본 1,350
  targetMonthlyDividend?: number; // (역산 모드용) 목표 월 세후 배당금
}

export interface HoldingAllocation {
  ticker: string;
  name: string;
  role: string; // '자본성장 & 배당증액 엔진' | '고인컴 월급 캐시카우'
  weightPercent: number; // %
  allocatedCapitalUSD: number;
  allocatedCapitalKRW: number;
  currentPrice: number;
  sharesToBuy: number; // 올림 정수 또는 소수점
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
  schdWeight: number;
  partnerWeight: number;
  description: string;
  badge: string;
}

export interface BarbellResult {
  schdWeight: number;
  partnerWeight: number;
  partnerTicker: HighIncomePartner;
  exchangeRate: number;
  
  // 종합 포트폴리오 핵심 지표
  combinedDividendYield: number; // 가중평균 시가배당률 (예: 0.0525 = 5.25%)
  combinedDividendGrowth5y: number; // 가중평균 5년 배당성장률 (예: 0.0712 = 7.12%)
  
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
    schd: HoldingAllocation;
    partner: HoldingAllocation;
  };

  // 목표 월 배당금 달성을 위한 역산 결과
  reverseCalculation?: {
    targetMonthlyNetUSD: number;
    targetMonthlyNetKRW: number;
    requiredTotalCapitalUSD: number;
    requiredTotalCapitalKRW: number;
    requiredSchdShares: number;
    requiredPartnerShares: number;
  };
}

/**
 * 기본 ETF 스펙
 */
const ETF_SPECS = {
  SCHD: {
    ticker: 'SCHD',
    name: 'Schwab U.S. Dividend Equity ETF',
    role: '자본성장 & 배당증액 엔진 (연 9% 배당성장)',
    currentPrice: 82.5,
    dividendYield: 0.0348, // 3.48%
    dividendGrowth5y: 0.0892, // 8.92%
  },
  JEPI: {
    ticker: 'JEPI',
    name: 'JPMorgan Equity Premium Income ETF',
    role: 'S&P 500 방어형 고인컴 월배당 캐시카우',
    currentPrice: 57.8,
    dividendYield: 0.0742, // 7.42%
    dividendGrowth5y: 0.051, // 5.10%
  },
  JEPQ: {
    ticker: 'JEPQ',
    name: 'JPMorgan Nasdaq Equity Premium Income ETF',
    role: '나스닥 100 기반 9%대 초고인컴 월배당 캐시카우',
    currentPrice: 55.2,
    dividendYield: 0.092, // 9.20%
    dividendGrowth5y: 0.062, // 6.20%
  },
};

/**
 * 3가지 원클릭 바벨 전략 프리셋
 */
export const BARBELL_PRESETS: BarbellPreset[] = [
  {
    id: 'growth',
    title: '3040 은퇴 준비형',
    subtitle: 'SCHD 70% : 고인컴 30%',
    schdWeight: 70,
    partnerWeight: 30,
    description: '향후 10년 이상 배당 성장과 주가 상승을 극대화하며, 30%의 월배당으로 재투자 속도를 높입니다.',
    badge: '성장 & 재투자 최적화',
  },
  {
    id: 'balance',
    title: '황금 밸런스형',
    subtitle: 'SCHD 50% : 고인컴 50%',
    schdWeight: 50,
    partnerWeight: 50,
    description: '자본 성장과 월급형 현금흐름의 완벽한 5:5 균형으로 시장 하락 방어와 안정성을 모두 확보합니다.',
    badge: '최적의 공수 밸런스',
  },
  {
    id: 'income',
    title: '5060 은퇴 생활형',
    subtitle: 'SCHD 30% : 고인컴 70%',
    schdWeight: 30,
    partnerWeight: 70,
    description: '즉각적인 7~8%대 고인컴 월배당으로 매월 풍부한 생활비를 확보하고, 30%의 SCHD로 물가 상승에 대응합니다.',
    badge: '즉각 월급 현금흐름',
  },
];

/**
 * 미국 배당소득세율
 */
const TAX_RATE = 0.15;

/**
 * 바벨 포트폴리오 연산 함수
 */
export function calculateBarbellPortfolio(input: BarbellInput): BarbellResult {
  const {
    schdWeight,
    partnerTicker,
    totalCapital,
    currency,
    exchangeRate = 1350,
    targetMonthlyDividend,
  } = input;

  const partnerWeight = Math.max(0, Math.min(100, 100 - schdWeight));
  const wSchd = schdWeight / 100;
  const wPartner = partnerWeight / 100;

  const schdSpec = ETF_SPECS.SCHD;
  const partnerSpec = ETF_SPECS[partnerTicker];

  // 총 자본금 달러/원화 통일
  const totalCapitalUSD =
    currency === 'USD' ? totalCapital : totalCapital / exchangeRate;
  const totalCapitalKRW =
    currency === 'KRW' ? totalCapital : totalCapital * exchangeRate;

  // 1. 포트폴리오 종합 지표 계산 (가중평균)
  const combinedDividendYield =
    wSchd * schdSpec.dividendYield + wPartner * partnerSpec.dividendYield;

  const combinedDividendGrowth5y =
    wSchd * schdSpec.dividendGrowth5y + wPartner * partnerSpec.dividendGrowth5y;

  // 2. 종목별 배분 금액
  const schdCapitalUSD = totalCapitalUSD * wSchd;
  const schdCapitalKRW = schdCapitalUSD * exchangeRate;
  const schdShares =
    schdSpec.currentPrice > 0 ? Math.floor(schdCapitalUSD / schdSpec.currentPrice) : 0;
  const schdAnnualGrossUSD = schdShares * (schdSpec.currentPrice * schdSpec.dividendYield);
  const schdAnnualNetUSD = schdAnnualGrossUSD * (1 - TAX_RATE);
  const schdMonthlyNetUSD = schdAnnualNetUSD / 12;

  const partnerCapitalUSD = totalCapitalUSD * wPartner;
  const partnerCapitalKRW = partnerCapitalUSD * exchangeRate;
  const partnerShares =
    partnerSpec.currentPrice > 0 ? Math.floor(partnerCapitalUSD / partnerSpec.currentPrice) : 0;
  const partnerAnnualGrossUSD =
    partnerShares * (partnerSpec.currentPrice * partnerSpec.dividendYield);
  const partnerAnnualNetUSD = partnerAnnualGrossUSD * (1 - TAX_RATE);
  const partnerMonthlyNetUSD = partnerAnnualNetUSD / 12;

  // 3. 종합 배당금 합산
  const annualGrossDividendUSD = schdAnnualGrossUSD + partnerAnnualGrossUSD;
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

    // 세후 종합 배당률 = combinedDividendYield * (1 - 0.15)
    const netCombinedYield = combinedDividendYield * (1 - TAX_RATE);
    const requiredTotalCapitalUSD =
      netCombinedYield > 0 ? targetAnnualNetUSD / netCombinedYield : 0;
    const requiredTotalCapitalKRW = requiredTotalCapitalUSD * exchangeRate;

    const reqSchdCap = requiredTotalCapitalUSD * wSchd;
    const reqPartnerCap = requiredTotalCapitalUSD * wPartner;
    const requiredSchdShares = Math.ceil(reqSchdCap / schdSpec.currentPrice);
    const requiredPartnerShares = Math.ceil(reqPartnerCap / partnerSpec.currentPrice);

    reverseCalculation = {
      targetMonthlyNetUSD,
      targetMonthlyNetKRW,
      requiredTotalCapitalUSD,
      requiredTotalCapitalKRW,
      requiredSchdShares,
      requiredPartnerShares,
    };
  }

  return {
    schdWeight,
    partnerWeight,
    partnerTicker,
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
      schd: {
        ticker: schdSpec.ticker,
        name: schdSpec.name,
        role: schdSpec.role,
        weightPercent: schdWeight,
        allocatedCapitalUSD: schdCapitalUSD,
        allocatedCapitalKRW: schdCapitalKRW,
        currentPrice: schdSpec.currentPrice,
        sharesToBuy: schdShares,
        dividendYield: schdSpec.dividendYield,
        dividendGrowth5y: schdSpec.dividendGrowth5y,
        annualGrossDividendUSD: schdAnnualGrossUSD,
        annualNetDividendUSD: schdAnnualNetUSD,
        monthlyNetDividendUSD: schdMonthlyNetUSD,
        monthlyNetDividendKRW: schdMonthlyNetUSD * exchangeRate,
      },
      partner: {
        ticker: partnerSpec.ticker,
        name: partnerSpec.name,
        role: partnerSpec.role,
        weightPercent: partnerWeight,
        allocatedCapitalUSD: partnerCapitalUSD,
        allocatedCapitalKRW: partnerCapitalKRW,
        currentPrice: partnerSpec.currentPrice,
        sharesToBuy: partnerShares,
        dividendYield: partnerSpec.dividendYield,
        dividendGrowth5y: partnerSpec.dividendGrowth5y,
        annualGrossDividendUSD: partnerAnnualGrossUSD,
        annualNetDividendUSD: partnerAnnualNetUSD,
        monthlyNetDividendUSD: partnerMonthlyNetUSD,
        monthlyNetDividendKRW: partnerMonthlyNetUSD * exchangeRate,
      },
    },
    reverseCalculation,
  };
}
