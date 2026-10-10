/**
 * 배당 재투자(DRIP) 스노우볼 복리 시뮬레이터 연산 엔진
 */

export interface DripInput {
  initialInvestment: number; // 초기 투자 원금 ($)
  monthlyContribution: number; // 매월 정기 적립액 ($)
  dividendYield: number; // 초기 시가배당률 (예: 0.035 = 3.5%)
  dividendGrowthRate: number; // 연간 배당성장률 (예: 0.07 = 7.0%)
  priceAppreciationRate: number; // 연평균 주가상승률 (예: 0.05 = 5.0%)
  years: number; // 투자 기간 (1 ~ 30년)
  baseSharePrice?: number; // 기준 초기 주가 (기본 $100)
}

export interface DripYearlyPoint {
  year: number;
  yearLabel: string; // "1년차", "10년차"
  principal: number; // 누적 총 투자 원금 ($)
  nonDripStockValue: number; // 배당 인출 시 순수 주식 평가액 ($)
  accumulatedCashDividends: number; // 배당 인출 시 누적 수령 현금 배당 ($)
  nonDripTotalValue: number; // 배당 인출 시 총자산 (주식 + 누적배당) ($)
  dripValue: number; // DRIP 재투자 시 총 평가액 ($)
  dripShares: number; // DRIP 보유 주식 수
  nonDripShares: number; // 배당 인출 시 보유 주식 수
  dripAnnualNetDividend: number; // 해당 연도 세후 연간 배당금 ($)
  nonDripAnnualNetDividend: number;
}

export interface DripSimulationResult {
  totalPrincipal: number; // 총 투자 원금 ($)
  years: number;
  
  // DRIP 재투자 최종 결과
  dripEndingValue: number;
  dripEndingShares: number;
  dripInitialShares: number;
  dripShareMultiplier: number; // 주식 수 몇 배 증가? (예: 4.2배)
  dripTotalDividendsReinvested: number; // 누적 재투자 배당금 ($)
  dripEndingAnnualNetDividend: number; // 최종 시점 연간 세후 배당금 ($)
  dripEndingMonthlyNetDividend: number; // 최종 시점 월 세후 배당금 ($)
  dripYieldOnCost: number; // 원금 대비 최종 배당수익률 (YoC %)
  dripTotalReturnRate: number; // 총 수익률 (%)
  dripCagr: number; // 연평균 복리 수익률 (%)

  // Non-DRIP (현금 인출) 최종 결과
  nonDripEndingStockValue: number;
  nonDripAccumulatedCashDividends: number;
  nonDripEndingTotalValue: number;
  nonDripEndingShares: number;
  nonDripEndingAnnualNetDividend: number;
  nonDripEndingMonthlyNetDividend: number;
  nonDripTotalReturnRate: number;

  // DRIP의 복리 스노우볼 격차
  snowballAdvantageAmount: number; // DRIP 최종평가액 - 현금인출 총자산 ($)
  snowballAdvantagePercent: number; // 격차 비율 (%)
  snowballExtraShares: number; // 재투자로 늘어난 추가 주식 수

  // 연도별 차트 데이터
  chartData: DripYearlyPoint[];
}

/**
 * 대표 ETF 시뮬레이션 프리셋
 */
export interface DripPreset {
  id: string;
  name: string;
  ticker: string;
  dividendYield: number;
  dividendGrowthRate: number;
  priceAppreciationRate: number;
  description: string;
}

export const DRIP_PRESETS: DripPreset[] = [
  {
    id: 'schd',
    name: 'SCHD 배당성장형',
    ticker: 'SCHD',
    dividendYield: 0.035, // 3.5%
    dividendGrowthRate: 0.075, // 7.5%
    priceAppreciationRate: 0.055, // 5.5%
    description: '적절한 초기 배당률(3.5%)과 높은 배당 성장(7.5%)으로 시간이 지날수록 복리가 폭발하는 정석 모델',
  },
  {
    id: 'jepi',
    name: 'JEPI 고인컴형',
    ticker: 'JEPI',
    dividendYield: 0.075, // 7.5%
    dividendGrowthRate: 0.02, // 2.0%
    priceAppreciationRate: 0.025, // 2.5%
    description: '초기부터 풍부한 7.5% 배당금을 즉시 재투자하여 초반 주식 수 모으기 속도가 압도적인 인컴 모델',
  },
  {
    id: 'voo',
    name: 'VOO 시장지수 성장형',
    ticker: 'VOO',
    dividendYield: 0.014, // 1.4%
    dividendGrowthRate: 0.06, // 6.0%
    priceAppreciationRate: 0.09, // 9.0%
    description: '배당률은 낮지만 강력한 시세 차익(9.0%)과 안정적인 장기 우상향을 추구하는 시장지수 모델',
  },
];

const TAX_RATE = 0.15; // 미국 배당 원천징수세 15%

/**
 * 배당 재투자(DRIP) 스노우볼 시뮬레이션 함수 (월 단위 정밀 연산)
 */
export function simulateDripSnowball(input: DripInput): DripSimulationResult {
  const {
    initialInvestment,
    monthlyContribution,
    dividendYield,
    dividendGrowthRate,
    priceAppreciationRate,
    years,
    baseSharePrice = 100,
  } = input;

  const totalMonths = Math.max(1, years * 12);
  let principal = initialInvestment;

  // t=0 초기 상태
  let price = baseSharePrice;
  let annualDPS = price * dividendYield; // 1주당 연간 세전 배당금

  let dripShares = initialInvestment > 0 ? initialInvestment / price : 0;
  let nonDripShares = initialInvestment > 0 ? initialInvestment / price : 0;
  const initialShares = dripShares;

  let accumulatedCashDividends = 0;
  let accumulatedDripDividends = 0;

  // 월간 복리 성장률
  const monthlyPriceGrowth = Math.pow(1 + priceAppreciationRate, 1 / 12) - 1;
  const monthlyDivGrowth = Math.pow(1 + dividendGrowthRate, 1 / 12) - 1;

  const chartData: DripYearlyPoint[] = [];

  // 0년차 (시작 시점) 기록
  chartData.push({
    year: 0,
    yearLabel: '시작',
    principal: Math.round(principal),
    nonDripStockValue: Math.round(nonDripShares * price),
    accumulatedCashDividends: 0,
    nonDripTotalValue: Math.round(nonDripShares * price),
    dripValue: Math.round(dripShares * price),
    dripShares: Number(dripShares.toFixed(1)),
    nonDripShares: Number(nonDripShares.toFixed(1)),
    dripAnnualNetDividend: Math.round(dripShares * annualDPS * (1 - TAX_RATE)),
    nonDripAnnualNetDividend: Math.round(nonDripShares * annualDPS * (1 - TAX_RATE)),
  });

  // 월별 루프 (1개월 ~ totalMonths)
  for (let m = 1; m <= totalMonths; m++) {
    // 1. 당월 주가 및 주당 배당금 업데이트
    price = price * (1 + monthlyPriceGrowth);
    annualDPS = annualDPS * (1 + monthlyDivGrowth);
    const monthlyNetDPS = (annualDPS / 12) * (1 - TAX_RATE);

    // 2. 월 정기 적립 매수
    if (monthlyContribution > 0) {
      principal += monthlyContribution;
      const contributedShares = monthlyContribution / price;
      dripShares += contributedShares;
      nonDripShares += contributedShares;
    }

    // 3. 당월 배당금 발생
    const nonDripMonthDiv = nonDripShares * monthlyNetDPS;
    accumulatedCashDividends += nonDripMonthDiv;

    const dripMonthDiv = dripShares * monthlyNetDPS;
    accumulatedDripDividends += dripMonthDiv;

    // 4. DRIP 재투자: 세후 배당금으로 주식 즉시 추가 매수
    dripShares += dripMonthDiv / price;

    // 매 12개월(1년 단위)마다 연도별 포인트 기록
    if (m % 12 === 0) {
      const currentYear = m / 12;
      const nonDripStockVal = nonDripShares * price;
      const nonDripTotVal = nonDripStockVal + accumulatedCashDividends;
      const dripTotVal = dripShares * price;

      chartData.push({
        year: currentYear,
        yearLabel: `${currentYear}년`,
        principal: Math.round(principal),
        nonDripStockValue: Math.round(nonDripStockVal),
        accumulatedCashDividends: Math.round(accumulatedCashDividends),
        nonDripTotalValue: Math.round(nonDripTotVal),
        dripValue: Math.round(dripTotVal),
        dripShares: Number(dripShares.toFixed(1)),
        nonDripShares: Number(nonDripShares.toFixed(1)),
        dripAnnualNetDividend: Math.round(dripShares * annualDPS * (1 - TAX_RATE)),
        nonDripAnnualNetDividend: Math.round(nonDripShares * annualDPS * (1 - TAX_RATE)),
      });
    }
  }

  // 최종 결과 정리
  const lastPoint = chartData[chartData.length - 1];
  const dripEndingValue = lastPoint.dripValue;
  const nonDripEndingTotalValue = lastPoint.nonDripTotalValue;

  const snowballAdvantageAmount = dripEndingValue - nonDripEndingTotalValue;
  const snowballAdvantagePercent =
    nonDripEndingTotalValue > 0 ? (snowballAdvantageAmount / nonDripEndingTotalValue) * 100 : 0;
  const snowballExtraShares = Number((dripShares - nonDripShares).toFixed(1));

  const dripShareMultiplier =
    initialShares > 0 ? Number((dripShares / initialShares).toFixed(1)) : 1;

  const dripTotalReturnRate =
    principal > 0 ? (dripEndingValue - principal) / principal : 0;
  const nonDripTotalReturnRate =
    principal > 0 ? (nonDripEndingTotalValue - principal) / principal : 0;

  const dripCagr =
    principal > 0 && years > 0
      ? Math.pow(dripEndingValue / principal, 1 / years) - 1
      : 0;

  const dripEndingAnnualNetDividend = lastPoint.dripAnnualNetDividend;
  const dripEndingMonthlyNetDividend = dripEndingAnnualNetDividend / 12;
  const dripYieldOnCost =
    principal > 0 ? dripEndingAnnualNetDividend / principal : 0;

  return {
    totalPrincipal: Math.round(principal),
    years,
    dripEndingValue,
    dripEndingShares: Number(dripShares.toFixed(1)),
    dripInitialShares: Number(initialShares.toFixed(1)),
    dripShareMultiplier,
    dripTotalDividendsReinvested: Math.round(accumulatedDripDividends),
    dripEndingAnnualNetDividend,
    dripEndingMonthlyNetDividend,
    dripYieldOnCost,
    dripTotalReturnRate,
    dripCagr,
    nonDripEndingStockValue: lastPoint.nonDripStockValue,
    nonDripAccumulatedCashDividends: Math.round(accumulatedCashDividends),
    nonDripEndingTotalValue,
    nonDripEndingShares: Number(nonDripShares.toFixed(1)),
    nonDripEndingAnnualNetDividend: lastPoint.nonDripAnnualNetDividend,
    nonDripEndingMonthlyNetDividend: lastPoint.nonDripAnnualNetDividend / 12,
    nonDripTotalReturnRate,
    snowballAdvantageAmount,
    snowballAdvantagePercent,
    snowballExtraShares,
    chartData,
  };
}
