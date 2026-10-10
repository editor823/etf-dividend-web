/**
 * 과거 타임머신 시뮬레이터 연산 엔진
 */

export interface SimulatorInput {
  ticker: string; // 대상 ETF (SCHD, JEPI, JEPQ, VOO, QQQ 등)
  periodMonths: number; // 투자 기간 (12: 1년, 36: 3년, 60: 5년, 120: 10년/최대)
  initialInvestment: number; // 초기 투자금 ($)
  monthlyContribution: number; // 매월 정기 적립액 ($)
  isDripEnabled: boolean; // 배당 재투자(DRIP) 여부
}

export interface MonthlyDataPoint {
  monthIndex: number;
  dateLabel: string; // "2021.05"
  principal: number; // 누적 총 투자 원금 ($)
  cashPayoutStockValue: number; // 현금 수령 시 순수 주식 평가액 ($)
  accumulatedCashDividends: number; // 누적 수령 현금 배당금 ($)
  cashPayoutTotalValue: number; // 현금 수령 시 총 자산(주식+누적배당) ($)
  dripValue: number; // DRIP 배당 재투자 시 총 평가액 ($)
  dripShares: number; // DRIP 누적 보유 주식 수
  cashShares: number; // 현금 수령 누적 보유 주식 수
  monthlyDividendPaid: number; // 해당 월 발생 세후 배당금 ($)
}

export interface SimulatorResult {
  ticker: string;
  periodMonths: number;
  totalPrincipal: number; // 총 투자 원금 ($)
  
  // DRIP 적용 시 결과
  dripEndingValue: number; // DRIP 최종 평가액 ($)
  dripTotalReturnRate: number; // DRIP 총 수익률 (예: 0.452 = 45.2%)
  dripCagr: number; // DRIP 연평균 복리 수익률
  dripTotalDividendsReceived: number; // DRIP 누적 재투자 배당금 ($)
  dripEndingShares: number; // DRIP 최종 주식 수
  dripYieldOnCost: number; // DRIP 원금 대비 배당수익률 (YoC)

  // 현금 수령 시 결과
  cashEndingStockValue: number; // 현금 수령 주식 평가액 ($)
  cashTotalDividendsReceived: number; // 순수 현금으로 수령한 배당금 총액 ($)
  cashEndingTotalValue: number; // 주식 평가액 + 누적 배당금
  cashTotalReturnRate: number; // 현금 수령 총 수익률
  cashEndingShares: number; // 현금 수령 최종 주식 수
  cashYieldOnCost: number; // 현금 수령 YoC

  // 격차 (DRIP의 스노우볼 보너스)
  dripAdvantageAmount: number; // DRIP 최종평가액 - 현금수령총자산 ($)
  dripAdvantagePercent: number; // 격차 비율

  // 차트용 시계열 데이터
  chartData: MonthlyDataPoint[];
}

/**
 * ETF별 과거 벤치마크 파라미터 (연평균 주가 변동성, 배당수익률, 연간 배당성장률)
 */
interface EtfHistoricalProfile {
  name: string;
  currentPrice: number;
  annualDividendYield: number; // 연 배당수익률
  annualCapitalAppreciation: number; // 연평균 주가 상승률 (장기 추세)
  monthlyVolatility: number; // 월간 주가 변동 계수
}

const HISTORICAL_PROFILES: Record<string, EtfHistoricalProfile> = {
  SCHD: {
    name: 'Schwab U.S. Dividend Equity ETF',
    currentPrice: 82.5,
    annualDividendYield: 0.035, // 3.5%
    annualCapitalAppreciation: 0.085, // 8.5%
    monthlyVolatility: 0.032,
  },
  JEPI: {
    name: 'JPMorgan Equity Premium Income ETF',
    currentPrice: 57.8,
    annualDividendYield: 0.075, // 7.5%
    annualCapitalAppreciation: 0.045, // 4.5%
    monthlyVolatility: 0.025,
  },
  JEPQ: {
    name: 'JPMorgan Nasdaq Equity Premium Income ETF',
    currentPrice: 55.2,
    annualDividendYield: 0.092, // 9.2%
    annualCapitalAppreciation: 0.07, // 7.0%
    monthlyVolatility: 0.042,
  },
  VOO: {
    name: 'Vanguard S&P 500 ETF',
    currentPrice: 535.0,
    annualDividendYield: 0.0135, // 1.35%
    annualCapitalAppreciation: 0.125, // 12.5%
    monthlyVolatility: 0.038,
  },
  QQQ: {
    name: 'Invesco QQQ Trust',
    currentPrice: 490.0,
    annualDividendYield: 0.0055, // 0.55%
    annualCapitalAppreciation: 0.165, // 16.5%
    monthlyVolatility: 0.048,
  },
};

/**
 * 과거 타임머신 시뮬레이션 계산 함수
 */
export function simulateHistoricalInvestment(input: SimulatorInput): SimulatorResult {
  const { ticker, periodMonths, initialInvestment, monthlyContribution } = input;
  const profile = HISTORICAL_PROFILES[ticker] || HISTORICAL_PROFILES['SCHD'];

  const TAX_RATE = 0.15; // 미국 배당 원천징수세 15%
  const monthlyYield = (profile.annualDividendYield * (1 - TAX_RATE)) / 12; // 월 세후 배당률
  const monthlyGrowth = Math.pow(1 + profile.annualCapitalAppreciation, 1 / 12) - 1;

  // 기준 시작일 역산 (현재 기준 N개월 전)
  const currentDate = new Date();
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - periodMonths,
    1
  );

  // 과거 시작 시점의 추정 주가 (현재가에서 거꾸로 역산)
  const initialEstimatedPrice =
    profile.currentPrice / Math.pow(1 + profile.annualCapitalAppreciation, periodMonths / 12);

  let currentPrice = initialEstimatedPrice;
  let dripShares = initialInvestment > 0 ? initialInvestment / currentPrice : 0;
  let cashShares = initialInvestment > 0 ? initialInvestment / currentPrice : 0;
  let accumulatedCashDividends = 0;
  let accumulatedDripDividends = 0;
  let totalPrincipal = initialInvestment;

  const chartData: MonthlyDataPoint[] = [];

  // t = 0 초기 시점
  chartData.push({
    monthIndex: 0,
    dateLabel: `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}`,
    principal: Math.round(totalPrincipal),
    cashPayoutStockValue: Math.round(cashShares * currentPrice),
    accumulatedCashDividends: 0,
    cashPayoutTotalValue: Math.round(cashShares * currentPrice),
    dripValue: Math.round(dripShares * currentPrice),
    dripShares: Number(dripShares.toFixed(2)),
    cashShares: Number(cashShares.toFixed(2)),
    monthlyDividendPaid: 0,
  });

  // t = 1 ~ periodMonths 월별 시뮬레이션
  for (let m = 1; m <= periodMonths; m++) {
    // 날짜 라벨 계산
    const mDate = new Date(startDate.getFullYear(), startDate.getMonth() + m, 1);
    const dateLabel = `${mDate.getFullYear()}.${String(mDate.getMonth() + 1).padStart(2, '0')}`;

    // 시장 변동성을 가미한 주가 갱신 (현실적인 사인 곡선 + 장기 성장 추세)
    const cycleFactor = Math.sin((m / 12) * Math.PI * 2) * profile.monthlyVolatility * 0.4;
    const effectiveMonthlyGrowth = monthlyGrowth + cycleFactor;
    currentPrice = currentPrice * (1 + effectiveMonthlyGrowth);

    // 매월 정기 적립 매수
    if (monthlyContribution > 0) {
      totalPrincipal += monthlyContribution;
      const newSharesFromContribution = monthlyContribution / currentPrice;
      dripShares += newSharesFromContribution;
      cashShares += newSharesFromContribution;
    }

    // 해당 월 발생 세후 배당금
    const cashDivThisMonth = cashShares * currentPrice * monthlyYield;
    accumulatedCashDividends += cashDivThisMonth;

    const dripDivThisMonth = dripShares * currentPrice * monthlyYield;
    accumulatedDripDividends += dripDivThisMonth;
    // 배당 재투자: 배당금으로 주식을 즉시 추가 매수
    dripShares += dripDivThisMonth / currentPrice;

    // 평가액 산출
    const cashStockVal = cashShares * currentPrice;
    const cashTotalVal = cashStockVal + accumulatedCashDividends;
    const dripVal = dripShares * currentPrice;

    chartData.push({
      monthIndex: m,
      dateLabel,
      principal: Math.round(totalPrincipal),
      cashPayoutStockValue: Math.round(cashStockVal),
      accumulatedCashDividends: Math.round(accumulatedCashDividends),
      cashPayoutTotalValue: Math.round(cashTotalVal),
      dripValue: Math.round(dripVal),
      dripShares: Number(dripShares.toFixed(2)),
      cashShares: Number(cashShares.toFixed(2)),
      monthlyDividendPaid: Math.round(dripDivThisMonth),
    });
  }

  // 최종 결과 도출
  const dripEndingValue = chartData[chartData.length - 1].dripValue;
  const cashEndingStockValue = chartData[chartData.length - 1].cashPayoutStockValue;
  const cashEndingTotalValue = chartData[chartData.length - 1].cashPayoutTotalValue;

  const dripTotalReturnRate =
    totalPrincipal > 0 ? (dripEndingValue - totalPrincipal) / totalPrincipal : 0;
  const cashTotalReturnRate =
    totalPrincipal > 0 ? (cashEndingTotalValue - totalPrincipal) / totalPrincipal : 0;

  const years = periodMonths / 12;
  const dripCagr =
    totalPrincipal > 0 && years > 0
      ? Math.pow(dripEndingValue / totalPrincipal, 1 / years) - 1
      : 0;

  // YoC (Yield on Cost) = 현재 1년 예상 배당금 / 총 투자 원금
  const annualDividendPerShare = profile.currentPrice * profile.annualDividendYield * (1 - TAX_RATE);
  const dripYieldOnCost =
    totalPrincipal > 0 ? (dripShares * annualDividendPerShare) / totalPrincipal : 0;
  const cashYieldOnCost =
    totalPrincipal > 0 ? (cashShares * annualDividendPerShare) / totalPrincipal : 0;

  const dripAdvantageAmount = dripEndingValue - cashEndingTotalValue;
  const dripAdvantagePercent =
    cashEndingTotalValue > 0 ? (dripAdvantageAmount / cashEndingTotalValue) * 100 : 0;

  return {
    ticker,
    periodMonths,
    totalPrincipal: Math.round(totalPrincipal),
    dripEndingValue: Math.round(dripEndingValue),
    dripTotalReturnRate,
    dripCagr,
    dripTotalDividendsReceived: Math.round(accumulatedDripDividends),
    dripEndingShares: Number(dripShares.toFixed(2)),
    dripYieldOnCost,
    cashEndingStockValue: Math.round(cashEndingStockValue),
    cashTotalDividendsReceived: Math.round(accumulatedCashDividends),
    cashEndingTotalValue: Math.round(cashEndingTotalValue),
    cashTotalReturnRate,
    cashEndingShares: Number(cashShares.toFixed(2)),
    cashYieldOnCost,
    dripAdvantageAmount: Math.round(dripAdvantageAmount),
    dripAdvantagePercent,
    chartData,
  };
}
