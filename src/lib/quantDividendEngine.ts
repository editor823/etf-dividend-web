/**
 * 퀀트급 정밀 배당 투자 금융 수학 연산 엔진 (오픈소스 퀀트 모델 이식)
 * 경로: src/lib/quantDividendEngine.ts
 * 
 * 주요 기능:
 * 1. 소수점 주식 정밀 재투자 (Fractional DRIP) 스노우볼 공식
 * 2. 원금회수율 (YoC, Yield on Cost) 연차별 시계열 추적기
 * 3. 물가상승률(인플레이션) 반영 실질 구매력(Real Purchasing Power) 감가상각 공식
 */

export const US_DIVIDEND_TAX_RATE = 0.15; // 미국 배당소득세 원천징수율 15%
export const DEFAULT_INFLATION_RATE = 0.025; // 연평균 기준 물가상승률 2.5%

export interface FractionalDripStepInput {
  currentShares: number; // 현재 보유 주식 수
  sharePrice: number; // 현재 1주당 주가 ($)
  dividendPerShare: number; // 1주당 배당금 ($)
  taxRate?: number; // 배당소득세율 (기본 15%)
  reinvestFeeRate?: number; // 재투자 거래수수료율 (기본 0%)
}

export interface FractionalDripStepResult {
  grossDividend: number; // 세전 배당금
  taxAmount: number; // 원천징수 배당세
  netDividend: number; // 세후 실수령 배당금
  newSharesBought: number; // 소수점 4자리 정밀 재매수 주식 수
  totalEndingShares: number; // 재투자 후 총 보유 주식 수
}

/**
 * 1. 소수점 주식 재투자 (Fractional DRIP) 정밀 스노우볼 공식
 * 정수 단위 절삭 없이 소수점 4자리까지 잔여 현금 없이 100% 재매수되는 복리 잔고 계산
 */
export function calculateFractionalDripStep(
  input: FractionalDripStepInput
): FractionalDripStepResult {
  const {
    currentShares,
    sharePrice,
    dividendPerShare,
    taxRate = US_DIVIDEND_TAX_RATE,
    reinvestFeeRate = 0,
  } = input;

  if (currentShares <= 0 || sharePrice <= 0 || dividendPerShare <= 0) {
    return {
      grossDividend: 0,
      taxAmount: 0,
      netDividend: 0,
      newSharesBought: 0,
      totalEndingShares: currentShares,
    };
  }

  // 1) 세전 총 배당금
  const grossDividend = currentShares * dividendPerShare;
  
  // 2) 세금 원천징수 (15%)
  const taxAmount = grossDividend * taxRate;
  
  // 3) 세후 재투자 가용 현금
  const netDividend = Math.max(0, grossDividend - taxAmount);
  
  // 4) 재투자 실매수액 (수수료 차감)
  const reinvestableCash = netDividend * (1 - reinvestFeeRate);
  
  // 5) 소수점 4자리 정밀 주식 수 계산
  const newSharesBought = Number((reinvestableCash / sharePrice).toFixed(4));
  const totalEndingShares = Number((currentShares + newSharesBought).toFixed(4));

  return {
    grossDividend: Number(grossDividend.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    netDividend: Number(netDividend.toFixed(2)),
    newSharesBought,
    totalEndingShares,
  };
}

/**
 * 2. 원금회수율 (YoC, Yield on Cost) 계산기
 * 투자 연차별로 "내 최초 투자 원금 대비 몇 %의 배당이 들어오는지" 매년 추적하는 공식
 * YoC = (연간 세후 배당금 / 누적 총 투자 원금) * 100
 */
export function calculateYieldOnCost(
  annualNetDividend: number,
  totalInvestedPrincipal: number
): number {
  if (totalInvestedPrincipal <= 0 || annualNetDividend <= 0) {
    return 0;
  }
  const yoc = (annualNetDividend / totalInvestedPrincipal) * 100;
  return Number(yoc.toFixed(2));
}

export interface InflationAdjustedResult {
  nominalValue: number; // 명목 가치 (표면 금액)
  realValue: number; // 실질 가치 (물가상승률 감안 구매력)
  purchasingPowerLossPercent: number; // 화폐 구매력 감소율 (%)
  inflationDiscountFactor: number; // 할인 계수 (1 / (1 + r)^t)
}

/**
 * 3. 물가상승률(인플레이션) 반영 실질 가치(Real Purchasing Power) 공식
 * RealValue = NominalValue / ((1 + inflationRate) ^ years)
 * 
 * @param nominalValue 미래 시점의 명목 화폐 금액
 * @param years 경과 연수 (t)
 * @param annualInflationRate 연평균 물가상승률 (기본 0.025 = 2.5%)
 */
export function calculateInflationAdjustedValue(
  nominalValue: number,
  years: number,
  annualInflationRate: number = DEFAULT_INFLATION_RATE
): InflationAdjustedResult {
  if (nominalValue <= 0 || years <= 0) {
    return {
      nominalValue,
      realValue: nominalValue,
      purchasingPowerLossPercent: 0,
      inflationDiscountFactor: 1.0,
    };
  }

  // 할인 계수: 1 / (1 + r)^t
  const inflationDiscountFactor = 1 / Math.pow(1 + annualInflationRate, years);
  const realValue = nominalValue * inflationDiscountFactor;
  const purchasingPowerLossPercent = ((nominalValue - realValue) / nominalValue) * 100;

  return {
    nominalValue: Math.round(nominalValue),
    realValue: Math.round(realValue),
    purchasingPowerLossPercent: Number(purchasingPowerLossPercent.toFixed(1)),
    inflationDiscountFactor: Number(inflationDiscountFactor.toFixed(4)),
  };
}

/**
 * 4. 연차별 YoC 및 인플레이션 실질 구매력 시계열 궤적 생성 헬퍼
 */
export interface QuantTrajectoryPoint {
  year: number;
  nominalMonthlyDividend: number; // 명목 월배당금
  realMonthlyDividend: number; // 인플레 반영 실질 월배당금
  nominalAsset: number; // 명목 자산
  realAsset: number; // 인플레 반영 실질 자산
  yieldOnCost: number; // 해당 연도 YoC (%)
  purchasingPowerRate: number; // 실질 구매력 보존 비율 (%)
}

export function generateQuantTrajectory(
  dataPoints: Array<{
    year: number;
    nominalMonthlyDividend: number;
    nominalAsset: number;
    totalPrincipal: number;
  }>,
  annualInflationRate: number = DEFAULT_INFLATION_RATE
): QuantTrajectoryPoint[] {
  return dataPoints.map((pt) => {
    const divAdj = calculateInflationAdjustedValue(
      pt.nominalMonthlyDividend,
      pt.year,
      annualInflationRate
    );
    const assetAdj = calculateInflationAdjustedValue(
      pt.nominalAsset,
      pt.year,
      annualInflationRate
    );
    const yoc = calculateYieldOnCost(
      pt.nominalMonthlyDividend * 12,
      pt.totalPrincipal
    );

    return {
      year: pt.year,
      nominalMonthlyDividend: pt.nominalMonthlyDividend,
      realMonthlyDividend: divAdj.realValue,
      nominalAsset: pt.nominalAsset,
      realAsset: assetAdj.realValue,
      yieldOnCost: yoc,
      purchasingPowerRate: Number((divAdj.inflationDiscountFactor * 100).toFixed(1)),
    };
  });
}
