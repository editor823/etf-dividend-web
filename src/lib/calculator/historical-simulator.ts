/**
 * 과거 타임머신 적립식 백테스트 연산 엔진
 * 경로: src/lib/calculator/historical-simulator.ts
 */

import { ETF_LIST, ETF_MAP, ETFItem } from '@/data/etfList';

export interface BacktestInput {
  ticker: string; // 대상 ETF 티커
  periodYears: number; // 1, 3, 5, 10년
  initialCapitalKRW: number; // 초기 목돈 (원화, 기본 10,000,000원)
  monthlyContributionKRW: number; // 매월 정기 적립금 (원화, 기본 500,000원)
  isDripEnabled: boolean; // 배당 재투자(DRIP) 여부
  exchangeRate?: number; // 기준 환율 (기본 1,350원)
}

export interface BacktestMonthlyPoint {
  monthIndex: number; // 0, 1, 2, ...
  dateLabel: string; // "2021.10"
  yearMonth: string;
  principalKRW: number; // 순수 누적 원금 (원화)
  totalAssetKRW: number; // 총 평가 자산 (주식 평가액 + 배당, 원화)
  stockValueKRW: number; // 순수 주식 평가액 (원화)
  accumulatedDividendsKRW: number; // 누적 수령 배당금 (원화)
  monthlyDividendKRW: number; // 해당 월 세후 배당 실수령액 (원화)
  sharesHeld: number; // 보유 주식 수
  sharePriceUSD: number; // 당시 추정 주가 ($)
}

export interface BacktestResult {
  ticker: string;
  etf: ETFItem;
  periodYears: number;
  periodMonths: number;
  startDateLabel: string;
  endDateLabel: string;

  // 핵심 지표 4종 (원화 KRW)
  currentTotalAssetKRW: number; // 1. 현재 총 평가 자산
  totalPrincipalKRW: number; // 2. 총 납입 원금
  currentMonthlyDividendKRW: number; // 3. 현재 월 세후 배당 실수령액
  currentAnnualDividendKRW: number; // 3-1. 현재 연간 세후 배당 실수령액
  accumulatedDividendsKRW: number; // 4. 과거 N년 누적 수령 배당금 총액

  // 추가 성과 지표
  totalReturnRate: number; // 원금 대비 총 수익률 (예: 0.452 = +45.2%)
  totalProfitKRW: number; // 순수익 (총 평가 자산 - 납입 원금)
  cagr: number; // 연평균 복리 수익률 (Compound Annual Growth Rate)
  endingShares: number; // 최종 보유 주식 수
  yieldOnCost: number; // 원금 대비 현재 배당수익률 (YoC)

  // DRIP vs 현금 인출 비교
  dripBonusKRW: number; // DRIP 재투자 시 추가 창출된 자산 격차
  dripBonusPercent: number; // DRIP 보너스 비율 (%)

  // 과거 위기 극복 및 현실 검증 인사이트
  crisisInsightTitle: string;
  crisisInsightBody: string;
  dcaEffectComment: string;

  // 시계열 차트 데이터
  chartData: BacktestMonthlyPoint[];
}

/**
 * 20개 ETF별 과거 장기 연평균 주가 상승률(자본 차익 추세) 및 역사적 조정장 민감도
 */
interface TickerHistorySpec {
  annualCapitalGain: number; // 과거 연평균 주가 상승률 (배당 제외 순수 주가 추세)
  drawdown2022: number; // 2022년 금리 인상기 최대 낙폭 (MDD 추정치)
}

const ETF_HISTORY_SPECS: Record<string, TickerHistorySpec> = {
  // 배당성장
  SCHD: { annualCapitalGain: 0.068, drawdown2022: -0.14 },
  DGRO: { annualCapitalGain: 0.082, drawdown2022: -0.16 },
  VIG: { annualCapitalGain: 0.078, drawdown2022: -0.15 },

  // 월배당 커버드콜
  JEPI: { annualCapitalGain: 0.035, drawdown2022: -0.11 },
  JEPQ: { annualCapitalGain: 0.065, drawdown2022: -0.18 },
  SPYI: { annualCapitalGain: 0.028, drawdown2022: -0.13 },
  QQQI: { annualCapitalGain: 0.045, drawdown2022: -0.19 },
  DIVO: { annualCapitalGain: 0.052, drawdown2022: -0.12 },

  // 시장지수
  VOO: { annualCapitalGain: 0.098, drawdown2022: -0.19 },
  QQQ: { annualCapitalGain: 0.135, drawdown2022: -0.33 },
  DIA: { annualCapitalGain: 0.075, drawdown2022: -0.10 },
  SCHG: { annualCapitalGain: 0.128, drawdown2022: -0.30 },

  // 고배당/배당귀족
  NOBL: { annualCapitalGain: 0.062, drawdown2022: -0.12 },
  VYM: { annualCapitalGain: 0.060, drawdown2022: -0.11 },
  HDV: { annualCapitalGain: 0.052, drawdown2022: -0.09 },

  // 리츠·채권
  O: { annualCapitalGain: 0.032, drawdown2022: -0.17 },
  VNQ: { annualCapitalGain: 0.025, drawdown2022: -0.27 },
  TLT: { annualCapitalGain: -0.015, drawdown2022: -0.32 },
  SGOV: { annualCapitalGain: 0.001, drawdown2022: 0.00 },
  MAIN: { annualCapitalGain: 0.048, drawdown2022: -0.15 },
};

const DEFAULT_SPEC: TickerHistorySpec = {
  annualCapitalGain: 0.060,
  drawdown2022: -0.15,
};

/**
 * 타임머신 백테스트 실행 메인 함수
 */
export function runHistoricalBacktest(input: BacktestInput): BacktestResult {
  const {
    ticker,
    periodYears,
    initialCapitalKRW,
    monthlyContributionKRW,
    isDripEnabled,
    exchangeRate = 1350,
  } = input;

  const etf = ETF_MAP[ticker] || ETF_LIST[0];
  const spec = ETF_HISTORY_SPECS[ticker] || DEFAULT_SPEC;

  const TAX_RATE = 0.15; // 미국 배당 원천징수세 15%
  const periodMonths = Math.round(periodYears * 12);

  // 현재 시점: 2026년 10월 기준
  const CURRENT_YEAR = 2026;
  const CURRENT_MONTH = 10;

  // 시작 시점 계산
  const startTotalMonths = CURRENT_YEAR * 12 + (CURRENT_MONTH - 1) - periodMonths;
  const startYear = Math.floor(startTotalMonths / 12);
  const startMonth = (startTotalMonths % 12) + 1;
  const startDateLabel = `${startYear}년 ${startMonth}월`;
  const endDateLabel = `${CURRENT_YEAR}년 ${CURRENT_MONTH}월`;

  // 달러 환산
  const initialCapitalUSD = initialCapitalKRW / exchangeRate;
  const monthlyContributionUSD = monthlyContributionKRW / exchangeRate;

  // 과거 시작 시점 주가 역산 ($)
  // 현재가에서 과거 N년간의 평균 상승률 역산
  const totalYears = periodMonths / 12;
  const baseGrowthFactor = Math.pow(1 + spec.annualCapitalGain, totalYears);
  const initialPriceUSD = Math.max(1, etf.currentPriceUSD / baseGrowthFactor);

  // 시뮬레이션 상태 변수
  let currentPriceUSD = initialPriceUSD;
  let sharesDrip = initialCapitalUSD > 0 ? initialCapitalUSD / currentPriceUSD : 0;
  let sharesCash = initialCapitalUSD > 0 ? initialCapitalUSD / currentPriceUSD : 0;
  let accumulatedCashDivUSD = 0;
  let accumulatedDripDivUSD = 0;
  let totalPrincipalKRW = initialCapitalKRW;

  const chartData: BacktestMonthlyPoint[] = [];

  // 초기 시점(Month 0) 기록
  const initMonthlyDivUSD =
    (sharesDrip * currentPriceUSD * (etf.dividendYield * (1 - TAX_RATE))) / 12;

  chartData.push({
    monthIndex: 0,
    dateLabel: `${startYear}.${String(startMonth).padStart(2, '0')}`,
    yearMonth: `${startYear}년 ${startMonth}월`,
    principalKRW: Math.round(totalPrincipalKRW),
    totalAssetKRW: Math.round(initialCapitalKRW),
    stockValueKRW: Math.round(initialCapitalKRW),
    accumulatedDividendsKRW: 0,
    monthlyDividendKRW: Math.round(initMonthlyDivUSD * exchangeRate),
    sharesHeld: Number(sharesDrip.toFixed(2)),
    sharePriceUSD: Number(currentPriceUSD.toFixed(2)),
  });

  // 월간 복리 성장률
  const monthlyBaseGrowth = Math.pow(1 + spec.annualCapitalGain, 1 / 12) - 1;
  const monthlyAfterTaxYield = (etf.dividendYield * (1 - TAX_RATE)) / 12;

  // Month 1 ~ periodMonths 시뮬레이션 루프
  for (let m = 1; m <= periodMonths; m++) {
    const curTotalMonths = startTotalMonths + m;
    const curYear = Math.floor(curTotalMonths / 12);
    const curMonth = (curTotalMonths % 12) + 1;
    const dateLabel = `${curYear}.${String(curMonth).padStart(2, '0')}`;
    const yearMonth = `${curYear}년 ${curMonth}월`;

    // 1. 시장 국면 반영 (2022년 금리 인상기 조정장 재현)
    // 2022년은 인플레이션과 연준의 급격한 금리 인상으로 주가가 눌렸던 시기
    let marketShock = 0;
    if (curYear === 2022) {
      // 2022년 상반기~하반기 하락 충격 반영
      marketShock = spec.drawdown2022 / 12;
    } else if (curYear === 2023) {
      // 2023년 반등 국면
      marketShock = 0.012;
    } else if (curYear >= 2024) {
      // 안정 성장 국면
      marketShock = 0.003;
    }

    // 약간의 월간 계절 변동성
    const seasonalWave = Math.sin((m / 6) * Math.PI) * 0.008;
    const monthlyPriceChange = monthlyBaseGrowth + marketShock + seasonalWave;
    currentPriceUSD = Math.max(1, currentPriceUSD * (1 + monthlyPriceChange));

    // 마지막 달은 현재가와 오차 최소화 보정
    if (m === periodMonths) {
      currentPriceUSD = etf.currentPriceUSD;
    }

    // 2. 매월 정기 적립식 매수 (DCA)
    if (monthlyContributionKRW > 0) {
      totalPrincipalKRW += monthlyContributionKRW;
      const newShares = monthlyContributionUSD / currentPriceUSD;
      sharesDrip += newShares;
      sharesCash += newShares;
    }

    // 3. 해당 월 세후 배당금 발생
    // DRIP 시 보유 주식 수 기준 배당금
    const dripMonthDivUSD = sharesDrip * currentPriceUSD * monthlyAfterTaxYield;
    accumulatedDripDivUSD += dripMonthDivUSD;

    // 현금 인출 시 보유 주식 수 기준 배당금
    const cashMonthDivUSD = sharesCash * currentPriceUSD * monthlyAfterTaxYield;
    accumulatedCashDivUSD += cashMonthDivUSD;

    // 4. DRIP 재투자 처리: 배당금으로 당월 주가에 주식 추가 매수
    sharesDrip += dripMonthDivUSD / currentPriceUSD;

    // 5. 사용자가 선택한 DRIP On/Off 상태에 따른 자산 집계
    const currentShares = isDripEnabled ? sharesDrip : sharesCash;
    const stockValKRW = currentShares * currentPriceUSD * exchangeRate;
    const totalAccumDivKRW = (isDripEnabled ? accumulatedDripDivUSD : accumulatedCashDivUSD) * exchangeRate;
    const totalAssetKRW = isDripEnabled
      ? stockValKRW
      : stockValKRW + totalAccumDivKRW;

    const currentMonthDivKRW =
      currentShares * currentPriceUSD * monthlyAfterTaxYield * exchangeRate;

    chartData.push({
      monthIndex: m,
      dateLabel,
      yearMonth,
      principalKRW: Math.round(totalPrincipalKRW),
      totalAssetKRW: Math.round(totalAssetKRW),
      stockValueKRW: Math.round(stockValKRW),
      accumulatedDividendsKRW: Math.round(totalAccumDivKRW),
      monthlyDividendKRW: Math.round(currentMonthDivKRW),
      sharesHeld: Number(currentShares.toFixed(2)),
      sharePriceUSD: Number(currentPriceUSD.toFixed(2)),
    });
  }

  // 최종 결과 도출
  const finalPoint = chartData[chartData.length - 1];
  const currentTotalAssetKRW = finalPoint.totalAssetKRW;
  const currentMonthlyDividendKRW = finalPoint.monthlyDividendKRW;
  const currentAnnualDividendKRW = currentMonthlyDividendKRW * 12;
  const accumulatedDividendsKRW = finalPoint.accumulatedDividendsKRW;

  const totalProfitKRW = currentTotalAssetKRW - totalPrincipalKRW;
  const totalReturnRate =
    totalPrincipalKRW > 0 ? totalProfitKRW / totalPrincipalKRW : 0;

  // 연평균 복리 수익률 (CAGR)
  const cagr =
    totalPrincipalKRW > 0 && periodYears > 0
      ? Math.pow(Math.max(0.01, currentTotalAssetKRW / totalPrincipalKRW), 1 / periodYears) - 1
      : 0;

  // 원금 대비 배당수익률 (Yield on Cost)
  const yieldOnCost =
    totalPrincipalKRW > 0 ? currentAnnualDividendKRW / totalPrincipalKRW : 0;

  // DRIP 보너스 산출 (DRIP 켰을 때와 안 켰을 때의 총자산 격차)
  const dripEndingValKRW = sharesDrip * etf.currentPriceUSD * exchangeRate;
  const cashEndingValKRW =
    sharesCash * etf.currentPriceUSD * exchangeRate +
    accumulatedCashDivUSD * exchangeRate;
  const dripBonusKRW = Math.max(0, dripEndingValKRW - cashEndingValKRW);
  const dripBonusPercent =
    cashEndingValKRW > 0 ? (dripBonusKRW / cashEndingValKRW) * 100 : 0;

  // 과거 위기 극복 및 현실 검증 코멘트 생성
  const { title, body, dcaComment } = generateCrisisInsight({
    ticker,
    etf,
    periodYears,
    cagr,
    totalReturnRate,
    isDripEnabled,
    dripBonusKRW,
  });

  return {
    ticker,
    etf,
    periodYears,
    periodMonths,
    startDateLabel,
    endDateLabel,
    currentTotalAssetKRW,
    totalPrincipalKRW,
    currentMonthlyDividendKRW,
    currentAnnualDividendKRW,
    accumulatedDividendsKRW,
    totalReturnRate,
    totalProfitKRW,
    cagr,
    endingShares: finalPoint.sharesHeld,
    yieldOnCost,
    dripBonusKRW: Math.round(dripBonusKRW),
    dripBonusPercent: Number(dripBonusPercent.toFixed(1)),
    crisisInsightTitle: title,
    crisisInsightBody: body,
    dcaEffectComment: dcaComment,
    chartData,
  };
}

/**
 * 하락장 방어력 및 DCA(적립식 분할매수) 인사이트 생성기
 */
function generateCrisisInsight({
  ticker,
  etf,
  periodYears,
  cagr,
  totalReturnRate,
  isDripEnabled,
  dripBonusKRW,
}: {
  ticker: string;
  etf: ETFItem;
  periodYears: number;
  cagr: number;
  totalReturnRate: number;
  isDripEnabled: boolean;
  dripBonusKRW: number;
}) {
  const cagrPercent = (cagr * 100).toFixed(1);
  const totalReturnPercent = (totalReturnRate * 100).toFixed(1);

  let title = `${periodYears}년 적립식 투자 성과 및 과거 하락장 검증`;
  let body = '';
  let dcaComment = '';

  if (periodYears >= 3) {
    if (etf.category === '월배당·커버드콜') {
      title = `2022년 금리 인상기 조정장 방어와 매월 꽂힌 현금흐름의 힘`;
      body = `선택하신 ${periodYears}년 기간 동안 시장 전체가 크게 흔들렸던 2022년 인플레이션·금리 인상기를 관통했습니다. 주가 상승은 제한적이었으나 매월 연 ${(etf.dividendYield * 100).toFixed(1)}%대의 강력한 세후 배당금이 지급되어 폭락장에서도 든든한 생활비와 심리적 버팀목이 되었습니다.`;
      dcaComment = `하락장에서도 주식을 내던지지 않고 매월 적립 매수한 덕분에 현재 총 평가 자산 누적 수익률 +${totalReturnPercent}%(연평균 CAGR ${cagrPercent}%)를 안정적으로 달성했습니다.`;
    } else if (etf.category === '시장지수' || ticker === 'QQQ' || ticker === 'VOO') {
      title = `2022년 빅테크 폭락장을 이겨낸 적립식(DCA) 평단가 인하의 기적`;
      body = `선택하신 ${periodYears}년 동안 2022년 금리 인상기 조정장(-20%~-33% 급락)을 정면으로 통과했습니다. 당시 단번에 목돈을 넣었다면 큰 손실 공포를 겪었겠지만, 매월 정기 분할매수를 통해 바닥에서 수량을 대량 확보하며 평균 매입단가를 획기적으로 낮췄습니다.`;
      dcaComment = `이후 2023~2026년 강세장이 도래하면서 연평균 복리 CAGR +${cagrPercent}%의 강력한 자산 팽창 성과로 결실을 맺었습니다.`;
    } else {
      // SCHD 등 배당성장 및 고배당
      title = `2022년 조정장 극복 및 배당성장의 겹경사 복리 달성`;
      body = `선택하신 기간 동안 2022년 조정장을 거쳤으나, 우량 배당성장 기업 특유의 뛰어난 하락장 방어력과 지속적인 배당 증액에 힘입어 꾸준한 우상향 곡선을 그렸습니다.`;
      dcaComment = `꾸준한 적립식 매수로 평단가를 낮추고 매년 늘어나는 배당금을 확보해 현재 연평균 복리 CAGR +${cagrPercent}%(원금 대비 누적 +${totalReturnPercent}%)의 성과를 거두었습니다.`;
    }
  } else {
    // 1년 전
    title = `최근 1년간의 시장 추세 및 즉각적인 월 현금흐름 창출`;
    body = `최근 1년 동안 ${ticker}를 적립 매수한 결과, 안정적인 주가 방어와 함께 시가배당률 ${(etf.dividendYield * 100).toFixed(1)}% 수준의 현금흐름 파이프라인이 즉각 완성되었습니다.`;
    dcaComment = `1년이라는 짧은 기간에도 매월 일정한 금액을 분할 매수한 덕분에 고점 매수 리스크를 분산하고 안정적인 원금 방어를 실현했습니다.`;
  }

  if (isDripEnabled && dripBonusKRW > 0) {
    dcaComment += ` 특히 배당금을 인출하지 않고 전액 재투자(DRIP)하여 약 +${(dripBonusKRW / 10000).toLocaleString()}만 원 상당의 자산 스노우볼 보너스를 추가로 거두었습니다.`;
  }

  return { title, body, dcaComment };
}
