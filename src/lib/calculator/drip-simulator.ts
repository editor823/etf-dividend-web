import { ETF_MAP, ETFItem } from '@/data/etfList';

/**
 * 배당 재투자(DRIP) 스노우볼 복리 시뮬레이터 연산 엔진
 */

export interface DripInput {
  ticker?: string; // 기본: 'SCHD'
  initialInvestment: number; // 초기 투자 원금 (선택 통화 기준)
  monthlyContribution: number; // 매월 정기 추가 적립액 (선택 통화 기준)
  years: number; // 투자 기간 (1 ~ 30년, 기본 10년)
  currency?: 'KRW' | 'USD'; // 기본 'KRW'
  exchangeRate?: number; // 기본 1,350
  customDividendYield?: number; // 수동 수정 시 시가배당률 (0.035 = 3.5%)
  customDividendGrowthRate?: number; // 수동 수정 시 배당성장률 (0.08 = 8.0%)
  customPriceAppreciationRate?: number; // 수동 수정 시 주가상승률 (0.055 = 5.5%)
}

export interface DripYearlyPoint {
  year: number;
  yearLabel: string; // "1년차", "10년차"
  principalKRW: number;
  principalUSD: number;
  dripValueKRW: number;
  dripValueUSD: number;
  nonDripTotalValueKRW: number;
  nonDripTotalValueUSD: number;
  nonDripStockValueKRW: number;
  accumulatedCashDividendsKRW: number;
  snowballAdvantageKRW: number;
  dripShares: number;
  nonDripShares: number;
  dripMonthlyNetDividendKRW: number;
  nonDripMonthlyNetDividendKRW: number;
}

export interface DripSimulationResult {
  ticker: string;
  etfName: string;
  totalPrincipalUSD: number;
  totalPrincipalKRW: number;
  years: number;
  exchangeRate: number;

  // DRIP 재투자 최종 결과
  dripEndingValueUSD: number;
  dripEndingValueKRW: number;
  dripEndingShares: number;
  dripInitialShares: number;
  dripShareMultiplier: number; // 주식 수 몇 배 증가? (예: 4.2배)
  dripTotalDividendsReinvestedUSD: number;
  dripTotalDividendsReinvestedKRW: number;
  dripEndingAnnualNetDividendUSD: number;
  dripEndingAnnualNetDividendKRW: number;
  dripEndingMonthlyNetDividendUSD: number;
  dripEndingMonthlyNetDividendKRW: number;
  dripYieldOnCost: number; // 원금 대비 최종 배당수익률 (YoC %)
  dripTotalReturnRate: number; // 총 수익률 (%)

  // Non-DRIP (현금 인출) 최종 결과
  nonDripEndingStockValueUSD: number;
  nonDripEndingStockValueKRW: number;
  nonDripAccumulatedCashDividendsUSD: number;
  nonDripAccumulatedCashDividendsKRW: number;
  nonDripEndingTotalValueUSD: number;
  nonDripEndingTotalValueKRW: number;
  nonDripEndingShares: number;
  nonDripEndingMonthlyNetDividendUSD: number;
  nonDripEndingMonthlyNetDividendKRW: number;
  nonDripTotalReturnRate: number;

  // DRIP의 복리 스노우볼 격차
  snowballAdvantageUSD: number;
  snowballAdvantageKRW: number;
  snowballAdvantagePercent: number; // 격차 비율 (%)
  snowballExtraShares: number; // 재투자로 늘어난 추가 주식 수

  // 티핑 포인트 (Tipping Point)
  tippingPoint: {
    reached: boolean;
    year: number | null;
    month: number | null;
    monthlyDividendKRW: number;
    monthlyContributionKRW: number;
    description: string;
  };

  // 연도별 차트 데이터
  chartData: DripYearlyPoint[];
}

/**
 * 대표 ETF 시뮬레이션 프리셋 (원클릭)
 */
export interface DripPreset {
  id: string;
  name: string;
  ticker: string;
  dividendYield: number;
  dividendGrowthRate: number;
  priceAppreciationRate: number;
  description: string;
  badge: string;
}

export const DRIP_PRESETS: DripPreset[] = [
  {
    id: 'SCHD',
    name: 'SCHD 배당성장',
    ticker: 'SCHD',
    dividendYield: 0.0348, // 3.48%
    dividendGrowthRate: 0.0892, // 8.92%
    priceAppreciationRate: 0.055, // 5.5%
    description: '연 9%에 달하는 강력한 배당성장과 주가 복리가 결합된 대한민국 1위 배당성장 스노우볼 모델',
    badge: '👑 배당성장 제왕',
  },
  {
    id: 'JEPI',
    name: 'JEPI 고인컴',
    ticker: 'JEPI',
    dividendYield: 0.0780, // 7.80%
    dividendGrowthRate: 0.0450, // 4.50%
    priceAppreciationRate: 0.020, // 2.0%
    description: '초기 7.8%의 풍부한 월배당을 즉시 재투자하여 초반 주식 수 모으기 속도가 압도적인 인컴 모델',
    badge: '💰 풍부한 월배당',
  },
  {
    id: 'VOO',
    name: 'VOO 시장지수',
    ticker: 'VOO',
    dividendYield: 0.0145, // 1.45%
    dividendGrowthRate: 0.0575, // 5.75%
    priceAppreciationRate: 0.080, // 8.0%
    description: '워런 버핏의 S&P 500 지수. 배당률은 낮지만 강력한 시세 차익(연 8%)으로 원금 자산 자체가 거대화',
    badge: '🚀 S&P 500 지수',
  },
  {
    id: 'SPYI',
    name: 'SPYI 초고인컴',
    ticker: 'SPYI',
    dividendYield: 0.1180, // 11.80%
    dividendGrowthRate: 0.0420, // 4.20%
    priceAppreciationRate: 0.020, // 2.0%
    description: '연 11%대 극대화된 월인컴을 전액 재매수하여 주식 수가 매달 눈덩이처럼 불어나는 초고속 재투자',
    badge: '⚡ 연 11% 부스터',
  },
];

export const DEFAULT_PRICE_GROWTH_RATES: Record<string, number> = {
  VOO: 0.080,
  QQQ: 0.105,
  SCHG: 0.100,
  DIA: 0.065,
  SCHD: 0.055,
  DGRO: 0.058,
  VIG: 0.052,
  NOBL: 0.045,
  VYM: 0.042,
  HDV: 0.038,
  JEPI: 0.020,
  JEPQ: 0.025,
  SPYI: 0.020,
  QQQI: 0.020,
  DIVO: 0.035,
  O: 0.022,
  MAIN: 0.025,
  VNQ: 0.025,
  TLT: 0.015,
  SGOV: 0.000,
};

const TAX_RATE = 0.15; // 미국 배당소득세 원천징수 15%

function getEtfData(ticker: string): ETFItem {
  if (ETF_MAP[ticker]) return ETF_MAP[ticker];
  return {
    ticker,
    name: ticker,
    nameEn: ticker,
    category: '배당성장',
    currentPriceUSD: 82.5,
    currentPrice: 82.5,
    dividendYield: 0.035,
    payoutCycle: '분기배당',
    frequencyLabel: '분기배당',
    fiveYearGrowth: 0.08,
    summary: '대표 배당 ETF',
  };
}

/**
 * 배당 재투자(DRIP) 스노우볼 시뮬레이션 함수 (월 단위 정밀 연산)
 */
export function simulateDripSnowball(input: DripInput): DripSimulationResult {
  const {
    ticker = 'SCHD',
    initialInvestment,
    monthlyContribution,
    years = 10,
    currency = 'KRW',
    exchangeRate = 1350,
    customDividendYield,
    customDividendGrowthRate,
    customPriceAppreciationRate,
  } = input;

  const etf = getEtfData(ticker);
  const dividendYield = customDividendYield ?? etf.dividendYield;
  const dividendGrowthRate = customDividendGrowthRate ?? etf.fiveYearGrowth;
  const priceAppreciationRate =
    customPriceAppreciationRate ?? (DEFAULT_PRICE_GROWTH_RATES[ticker] || 0.05);

  const initialUSD =
    currency === 'USD' ? initialInvestment : initialInvestment / exchangeRate;
  const monthlyUSD =
    currency === 'USD' ? monthlyContribution : monthlyContribution / exchangeRate;

  const safeYears = Math.min(30, Math.max(1, years));
  const totalMonths = safeYears * 12;

  let price = etf.currentPriceUSD || 80;
  let annualDPS = price * dividendYield; // 1주당 연간 세전 배당금 ($)

  let principalUSD = initialUSD;
  let dripShares = initialUSD > 0 ? initialUSD / price : 0;
  let nonDripShares = initialUSD > 0 ? initialUSD / price : 0;
  const initialShares = dripShares;

  let accumulatedCashDividendsUSD = 0;
  let accumulatedDripDividendsUSD = 0;

  // 월간 복리 성장률
  const monthlyPriceGrowth = Math.pow(1 + priceAppreciationRate, 1 / 12) - 1;
  const monthlyDivGrowth = Math.pow(1 + dividendGrowthRate, 1 / 12) - 1;

  const chartData: DripYearlyPoint[] = [];

  // 티핑 포인트 추적 (월 배당금 >= 월 적립금 시점)
  let tippingPointMonth: number | null = null;
  let tippingPointDividendUSD = 0;

  // 0년차 (시작 시점) 기록
  chartData.push({
    year: 0,
    yearLabel: '시작',
    principalKRW: Math.round(principalUSD * exchangeRate),
    principalUSD: Math.round(principalUSD),
    dripValueKRW: Math.round(dripShares * price * exchangeRate),
    dripValueUSD: Math.round(dripShares * price),
    nonDripTotalValueKRW: Math.round(nonDripShares * price * exchangeRate),
    nonDripTotalValueUSD: Math.round(nonDripShares * price),
    nonDripStockValueKRW: Math.round(nonDripShares * price * exchangeRate),
    accumulatedCashDividendsKRW: 0,
    snowballAdvantageKRW: 0,
    dripShares: Number(dripShares.toFixed(1)),
    nonDripShares: Number(nonDripShares.toFixed(1)),
    dripMonthlyNetDividendKRW: Math.round(
      ((dripShares * annualDPS * (1 - TAX_RATE)) / 12) * exchangeRate
    ),
    nonDripMonthlyNetDividendKRW: Math.round(
      ((nonDripShares * annualDPS * (1 - TAX_RATE)) / 12) * exchangeRate
    ),
  });

  // 월별 루프 (1개월 ~ totalMonths)
  for (let m = 1; m <= totalMonths; m++) {
    // 1. 당월 주가 및 주당 배당금 업데이트
    price = price * (1 + monthlyPriceGrowth);
    annualDPS = annualDPS * (1 + monthlyDivGrowth);
    const monthlyNetDPS = (annualDPS / 12) * (1 - TAX_RATE); // 세후 주당 월배당금

    // 2. 월 정기 추가 적립금으로 주식 매수
    if (monthlyUSD > 0) {
      principalUSD += monthlyUSD;
      const contributedShares = monthlyUSD / price;
      dripShares += contributedShares;
      nonDripShares += contributedShares;
    }

    // 3. 당월 배당금 발생 (세후 15% 차감)
    const nonDripMonthDiv = nonDripShares * monthlyNetDPS;
    accumulatedCashDividendsUSD += nonDripMonthDiv;

    const dripMonthDiv = dripShares * monthlyNetDPS;
    accumulatedDripDividendsUSD += dripMonthDiv;

    // 티핑 포인트 감지: DRIP 월 배당금이 월 적립금을 처음으로 넘어서는 달
    if (
      tippingPointMonth === null &&
      monthlyUSD > 0 &&
      dripMonthDiv >= monthlyUSD
    ) {
      tippingPointMonth = m;
      tippingPointDividendUSD = dripMonthDiv;
    }

    // 4. DRIP 재투자: 세후 배당금으로 주식을 즉시 추가 매수
    dripShares += dripMonthDiv / price;

    // 매 12개월(1년 단위)마다 연도별 포인트 기록
    if (m % 12 === 0) {
      const currentYear = m / 12;
      const nonDripStockValUSD = nonDripShares * price;
      const nonDripTotValUSD = nonDripStockValUSD + accumulatedCashDividendsUSD;
      const dripTotValUSD = dripShares * price;
      const advantageUSD = dripTotValUSD - nonDripTotValUSD;

      chartData.push({
        year: currentYear,
        yearLabel: `${currentYear}년차`,
        principalKRW: Math.round(principalUSD * exchangeRate),
        principalUSD: Math.round(principalUSD),
        dripValueKRW: Math.round(dripTotValUSD * exchangeRate),
        dripValueUSD: Math.round(dripTotValUSD),
        nonDripTotalValueKRW: Math.round(nonDripTotValUSD * exchangeRate),
        nonDripTotalValueUSD: Math.round(nonDripTotValUSD),
        nonDripStockValueKRW: Math.round(nonDripStockValUSD * exchangeRate),
        accumulatedCashDividendsKRW: Math.round(
          accumulatedCashDividendsUSD * exchangeRate
        ),
        snowballAdvantageKRW: Math.round(advantageUSD * exchangeRate),
        dripShares: Number(dripShares.toFixed(1)),
        nonDripShares: Number(nonDripShares.toFixed(1)),
        dripMonthlyNetDividendKRW: Math.round(
          dripMonthDiv * exchangeRate
        ),
        nonDripMonthlyNetDividendKRW: Math.round(
          nonDripMonthDiv * exchangeRate
        ),
      });
    }
  }

  // 최종 결과 정리
  const lastPoint = chartData[chartData.length - 1];
  const dripEndingValueUSD = lastPoint.dripValueUSD;
  const dripEndingValueKRW = lastPoint.dripValueKRW;

  const nonDripEndingTotalValueUSD = lastPoint.nonDripTotalValueUSD;
  const nonDripEndingTotalValueKRW = lastPoint.nonDripTotalValueKRW;

  const snowballAdvantageUSD = dripEndingValueUSD - nonDripEndingTotalValueUSD;
  const snowballAdvantageKRW = dripEndingValueKRW - nonDripEndingTotalValueKRW;
  const snowballAdvantagePercent =
    nonDripEndingTotalValueUSD > 0
      ? (snowballAdvantageUSD / nonDripEndingTotalValueUSD) * 100
      : 0;
  const snowballExtraShares = Number((dripShares - nonDripShares).toFixed(1));

  const dripShareMultiplier =
    initialShares > 0 ? Number((dripShares / initialShares).toFixed(1)) : 1;

  const dripTotalReturnRate =
    principalUSD > 0 ? (dripEndingValueUSD - principalUSD) / principalUSD : 0;
  const nonDripTotalReturnRate =
    principalUSD > 0
      ? (nonDripEndingTotalValueUSD - principalUSD) / principalUSD
      : 0;

  const finalMonthlyDPS = (annualDPS / 12) * (1 - TAX_RATE);
  const dripEndingMonthlyNetDividendUSD = dripShares * finalMonthlyDPS;
  const dripEndingMonthlyNetDividendKRW =
    dripEndingMonthlyNetDividendUSD * exchangeRate;
  const dripEndingAnnualNetDividendUSD = dripEndingMonthlyNetDividendUSD * 12;
  const dripEndingAnnualNetDividendKRW = dripEndingMonthlyNetDividendKRW * 12;

  const dripYieldOnCost =
    principalUSD > 0 ? dripEndingAnnualNetDividendUSD / principalUSD : 0;

  // 티핑 포인트 코멘트
  const tippingYear = tippingPointMonth ? Math.ceil(tippingPointMonth / 12) : null;
  const tippingPointResult = {
    reached: tippingPointMonth !== null,
    year: tippingYear,
    month: tippingPointMonth,
    monthlyDividendKRW: Math.round(tippingPointDividendUSD * exchangeRate),
    monthlyContributionKRW: Math.round(monthlyUSD * exchangeRate),
    description:
      monthlyUSD <= 0
        ? '매월 추가 적립금이 없는 완전 자립 복리 시스템입니다. 초기 배당금만으로 무한 증식합니다.'
        : tippingYear !== null
        ? `${tippingYear}년 차(약 ${tippingPointMonth}개월)부터는 '내가 넣는 월 적립금'보다 '주식이 스스로 벌어오는 월 배당금'이 더 커지는 자립 시점에 도달합니다!`
        : `선택하신 ${safeYears}년 시뮬레이션 기간 동안 월 적립금이 지속되며, 장기적으로 배당 눈덩이가 불어납니다.`,
  };

  return {
    ticker: etf.ticker,
    etfName: etf.name,
    totalPrincipalUSD: Math.round(principalUSD),
    totalPrincipalKRW: Math.round(principalUSD * exchangeRate),
    years: safeYears,
    exchangeRate,
    dripEndingValueUSD,
    dripEndingValueKRW,
    dripEndingShares: Number(dripShares.toFixed(1)),
    dripInitialShares: Number(initialShares.toFixed(1)),
    dripShareMultiplier,
    dripTotalDividendsReinvestedUSD: Math.round(accumulatedDripDividendsUSD),
    dripTotalDividendsReinvestedKRW: Math.round(
      accumulatedDripDividendsUSD * exchangeRate
    ),
    dripEndingAnnualNetDividendUSD,
    dripEndingAnnualNetDividendKRW,
    dripEndingMonthlyNetDividendUSD,
    dripEndingMonthlyNetDividendKRW,
    dripYieldOnCost,
    dripTotalReturnRate,
    nonDripEndingStockValueUSD: lastPoint.nonDripStockValueKRW / exchangeRate,
    nonDripEndingStockValueKRW: lastPoint.nonDripStockValueKRW,
    nonDripAccumulatedCashDividendsUSD:
      lastPoint.accumulatedCashDividendsKRW / exchangeRate,
    nonDripAccumulatedCashDividendsKRW: lastPoint.accumulatedCashDividendsKRW,
    nonDripEndingTotalValueUSD,
    nonDripEndingTotalValueKRW,
    nonDripEndingShares: Number(nonDripShares.toFixed(1)),
    nonDripEndingMonthlyNetDividendUSD:
      lastPoint.nonDripMonthlyNetDividendKRW / exchangeRate,
    nonDripEndingMonthlyNetDividendKRW:
      lastPoint.nonDripMonthlyNetDividendKRW,
    nonDripTotalReturnRate,
    snowballAdvantageUSD,
    snowballAdvantageKRW,
    snowballAdvantagePercent,
    snowballExtraShares,
    tippingPoint: tippingPointResult,
    chartData,
  };
}
