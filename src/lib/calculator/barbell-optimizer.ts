import { ETF_MAP, ETFItem } from '@/data/etfList';

/**
 * 배당 바벨 포트폴리오 최적화기 연산 엔진
 * [성장/지수/배당성장] vs [고배당 커버드콜/인컴]의 슬라이더 배분 및 합성 현금흐름 연산
 */

export interface BarbellInput {
  growthTicker?: string; // 기본: 'VOO' 또는 'SCHD'
  incomeTicker?: string; // 기본: 'JEPI'
  growthWeight: number; // 0 ~ 100 (%)
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
  growthTicker: string;
  incomeTicker: string;
  growthWeight: number;
  incomeWeight: number;
  description: string;
  badge: string;
}

export interface BarbellYearData {
  year: number; // 1 ~ 10
  barbellAssetKRW: number; // 바벨 포트폴리오 원금 평가액
  barbellAnnualNetDivKRW: number; // 바벨 연간 세후 배당금
  barbellMonthlyNetDivKRW: number; // 바벨 월 세후 배당금
  barbellTotalWealthKRW: number; // 자산 평가액 + 누적 배당금

  growthOnlyAssetKRW: number;
  growthOnlyMonthlyDivKRW: number;
  growthOnlyTotalWealthKRW: number;

  incomeOnlyAssetKRW: number;
  incomeOnlyMonthlyDivKRW: number;
  incomeOnlyTotalWealthKRW: number;
}

export interface BarbellResult {
  growthTicker: string;
  incomeTicker: string;
  growthWeight: number;
  incomeWeight: number;
  exchangeRate: number;

  // 종합 포트폴리오 핵심 지표
  combinedDividendYield: number; // 가중평균 시가배당률 (예: 0.0525 = 5.25%)
  combinedDividendGrowth5y: number; // 가중평균 5년 배당성장률
  
  // 자본금 & 배당금
  totalCapitalUSD: number;
  totalCapitalKRW: number;
  
  annualGrossDividendUSD: number; // 연간 세전 배당금
  annualGrossDividendKRW: number; // 연간 세전 배당금 (원화)
  annualTaxUSD: number; // 미국 세금 15%
  annualNetDividendUSD: number; // 연간 세후 실수령액 ($)
  annualNetDividendKRW: number; // 연간 세후 실수령액 (₩)
  monthlyNetDividendUSD: number; // 월평균 세후 배당금 ($)
  monthlyNetDividendKRW: number; // 월평균 세후 배당금 (₩)
  
  // 금융소득종합과세 경고 (연간 세전 배당 2,000만 원 초과 여부)
  isTaxWarning: boolean;

  // 바벨 성향 판정 코멘트
  personality: {
    type: 'growth' | 'balance' | 'income';
    badge: string;
    headline: string;
    comment: string;
  };

  // 종목별 세부 배분 현황
  holdings: {
    growth: HoldingAllocation;
    income: HoldingAllocation;
  };

  // 10개년 복리 시뮬레이션 데이터 (차트용)
  projections10y: BarbellYearData[];

  // 10년 후 인사이트 요약
  insights10y: {
    year10BarbellWealthKRW: number;
    year10BarbellMonthlyDivKRW: number;
    year10GrowthOnlyWealthKRW: number;
    year10IncomeOnlyWealthKRW: number;
    year10GrowthOnlyMonthlyDivKRW: number;
    year10IncomeOnlyMonthlyDivKRW: number;
  };

  // 목표 월 배당금 달성을 위한 역산 결과
  reverseCalculation?: {
    targetMonthlyNetUSD: number;
    targetMonthlyNetKRW: number;
    requiredTotalCapitalUSD: number;
    requiredTotalCapitalKRW: number;
    requiredGrowthShares: number;
    requiredIncomeShares: number;
  };
}

/**
 * 4대 핵심 바벨 프리셋
 */
export const BARBELL_PRESETS: BarbellPreset[] = [
  {
    id: 'voo_jepi',
    title: 'S&P 500 시장 성장 + 방어형 월배당',
    subtitle: 'VOO 50% : JEPI 50%',
    growthTicker: 'VOO',
    incomeTicker: 'JEPI',
    growthWeight: 50,
    incomeWeight: 50,
    description: '워런 버핏의 S&P 500 지수 상승 탄력과 JEPI의 연 7~8% 방어형 월배당이 결합된 가장 균형 잡힌 정석 바벨',
    badge: '👑 대표 황금 밸런스',
  },
  {
    id: 'qqq_jepq',
    title: '나스닥 기술 성장 + 초고배당 월현금',
    subtitle: 'QQQ 40% : JEPQ 60%',
    growthTicker: 'QQQ',
    incomeTicker: 'JEPQ',
    growthWeight: 40,
    incomeWeight: 60,
    description: '빅테크 AI 산업의 폭발적 주가 성장(QQQ)을 누리면서 매월 연 9~10%대 초고인컴(JEPQ)으로 현금흐름 극대화',
    badge: '⚡ 나스닥 테크 바벨',
  },
  {
    id: 'schd_spyi',
    title: '배당성장 복리 + 고인컴 부스터',
    subtitle: 'SCHD 70% : SPYI 30%',
    growthTicker: 'SCHD',
    incomeTicker: 'SPYI',
    growthWeight: 70,
    incomeWeight: 30,
    description: 'SCHD의 10년 연속 배당성장 엔진을 주력으로 삼고, SPYI의 연 11% 월배당을 재투자 부스터로 활용하는 복리 머신',
    badge: '🚀 배당성장 극대화',
  },
  {
    id: 'schd_o',
    title: '배당 다우존스 + 부동산 월세 리츠',
    subtitle: 'SCHD 60% : O 40%',
    growthTicker: 'SCHD',
    incomeTicker: 'O',
    growthWeight: 60,
    incomeWeight: 40,
    description: '미국 우량 배당성장 기업과 30년 연속 증액 상업용 리얼티인컴(O)의 월세를 결합한 배당 귀족형 바벨',
    badge: '🏢 부동산 월세 결합',
  },
];

/**
 * 미국 배당소득세율 (15% 원천징수)
 */
const TAX_RATE = 0.15;

/**
 * 종목별 예상 연평균 주가 상승률 (10년 복리 시뮬레이션용)
 */
const PRICE_GROWTH_RATES: Record<string, number> = {
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

/**
 * 안전한 ETF 메타데이터 취득 헬퍼
 */
function getEtfItem(ticker: string, fallbackTicker: string): ETFItem {
  if (ETF_MAP[ticker]) return ETF_MAP[ticker];
  if (ETF_MAP[fallbackTicker]) return ETF_MAP[fallbackTicker];
  return {
    ticker,
    name: ticker,
    nameEn: ticker,
    category: '시장지수',
    currentPriceUSD: 100,
    currentPrice: 100,
    dividendYield: 0.03,
    payoutCycle: '분기배당',
    frequencyLabel: '분기배당',
    fiveYearGrowth: 0.05,
    summary: '안정적인 배당 ETF',
  };
}

/**
 * 바벨 포트폴리오 연산 함수
 */
export function calculateBarbellPortfolio(input: BarbellInput): BarbellResult {
  const {
    growthTicker = 'VOO',
    incomeTicker = 'JEPI',
    totalCapital,
    currency,
    exchangeRate = 1350,
    targetMonthlyDividend,
  } = input;

  const growthWeight = Math.max(0, Math.min(100, input.growthWeight));
  const incomeWeight = 100 - growthWeight;

  const wGrowth = growthWeight / 100;
  const wIncome = incomeWeight / 100;

  const growthSpec = getEtfItem(growthTicker, 'VOO');
  const incomeSpec = getEtfItem(incomeTicker, 'JEPI');

  // 총 자본금 달러/원화 통일
  const totalCapitalUSD =
    currency === 'USD' ? totalCapital : totalCapital / exchangeRate;
  const totalCapitalKRW =
    currency === 'KRW' ? totalCapital : totalCapital * exchangeRate;

  // 1. 포트폴리오 종합 지표 계산 (가중평균)
  const combinedDividendYield =
    wGrowth * growthSpec.dividendYield + wIncome * incomeSpec.dividendYield;

  const combinedDividendGrowth5y =
    wGrowth * growthSpec.fiveYearGrowth + wIncome * incomeSpec.fiveYearGrowth;

  // 2. 종목별 배분 금액
  const growthCapitalUSD = totalCapitalUSD * wGrowth;
  const growthCapitalKRW = growthCapitalUSD * exchangeRate;
  const growthPrice = growthSpec.currentPriceUSD || 100;
  const growthShares = Math.floor(growthCapitalUSD / growthPrice);
  const growthAnnualGrossUSD = growthCapitalUSD * growthSpec.dividendYield;
  const growthAnnualNetUSD = growthAnnualGrossUSD * (1 - TAX_RATE);
  const growthMonthlyNetUSD = growthAnnualNetUSD / 12;

  const incomeCapitalUSD = totalCapitalUSD * wIncome;
  const incomeCapitalKRW = incomeCapitalUSD * exchangeRate;
  const incomePrice = incomeSpec.currentPriceUSD || 50;
  const incomeShares = Math.floor(incomeCapitalUSD / incomePrice);
  const incomeAnnualGrossUSD = incomeCapitalUSD * incomeSpec.dividendYield;
  const incomeAnnualNetUSD = incomeAnnualGrossUSD * (1 - TAX_RATE);
  const incomeMonthlyNetUSD = incomeAnnualNetUSD / 12;

  // 3. 종합 배당금 합산
  const annualGrossDividendUSD = growthAnnualGrossUSD + incomeAnnualGrossUSD;
  const annualGrossDividendKRW = annualGrossDividendUSD * exchangeRate;
  const annualTaxUSD = annualGrossDividendUSD * TAX_RATE;
  const annualNetDividendUSD = annualGrossDividendUSD - annualTaxUSD;
  const annualNetDividendKRW = annualNetDividendUSD * exchangeRate;
  const monthlyNetDividendUSD = annualNetDividendUSD / 12;
  const monthlyNetDividendKRW = annualNetDividendKRW / 12;

  // 금융소득종합과세 경고 (연 세전 배당금 2,000만 원 초과 시)
  const isTaxWarning = annualGrossDividendKRW >= 20000000;

  // 바벨 성향 판정
  let personality: BarbellResult['personality'];
  if (growthWeight >= 70) {
    personality = {
      type: 'growth',
      badge: '🚀 자본 증식형 바벨',
      headline: '시세 차익과 미래 복리 성장에 무게를 둔 적극형 세팅',
      comment:
        '초기 배당은 적지만 5~10년 뒤 자산 증가 속도가 가장 빠릅니다. 아직 은퇴까지 기간이 많이 남은 3040 적립식 투자자에게 적합합니다.',
    };
  } else if (growthWeight <= 30) {
    personality = {
      type: 'income',
      badge: '💰 조기 은퇴/현금흐름 집중형',
      headline: '즉각적인 월급 창출과 마르지 않는 생활비 세팅',
      comment:
        '즉각적인 월 생활비 창출에 최적화된 구성입니다. 매월 통장에 풍부한 배당금이 꽂히며, 은퇴자 또는 파이어족에게 이상적입니다.',
    };
  } else {
    personality = {
      type: 'balance',
      badge: '⚖️ 황금 밸런스 바벨',
      headline: '성장 엔진과 월배당 캐시카우의 완벽한 5:5 조화',
      comment:
        '시장 상승 참여율을 지키면서 안정적인 월세 현금흐름을 확보합니다. 하락장 방어와 장기 복리 성장을 모두 잡는 가장 정석적인 구성입니다.',
    };
  }

  // 4. 10개년 복리 시뮬레이션 계산
  const priceGrowthG = PRICE_GROWTH_RATES[growthSpec.ticker] ?? 0.055;
  const priceGrowthI = PRICE_GROWTH_RATES[incomeSpec.ticker] ?? 0.020;
  const divGrowthG = growthSpec.fiveYearGrowth ?? 0.05;
  const divGrowthI = incomeSpec.fiveYearGrowth ?? 0.05;

  const projections10y: BarbellYearData[] = [];
  let cumDivBarbell = 0;
  let cumDivGrowthOnly = 0;
  let cumDivIncomeOnly = 0;

  for (let year = 1; year <= 10; year++) {
    // 1) 바벨 포트폴리오
    const assetG = growthCapitalKRW * Math.pow(1 + priceGrowthG, year);
    const assetI = incomeCapitalKRW * Math.pow(1 + priceGrowthI, year);
    const barbellAssetKRW = assetG + assetI;

    const divG = growthCapitalKRW * growthSpec.dividendYield * (1 - TAX_RATE) * Math.pow(1 + divGrowthG, year - 1);
    const divI = incomeCapitalKRW * incomeSpec.dividendYield * (1 - TAX_RATE) * Math.pow(1 + divGrowthI, year - 1);
    const barbellAnnualNetDivKRW = divG + divI;
    const barbellMonthlyNetDivKRW = barbellAnnualNetDivKRW / 12;

    cumDivBarbell += barbellAnnualNetDivKRW;
    const barbellTotalWealthKRW = barbellAssetKRW + cumDivBarbell;

    // 2) 100% 성장 단독
    const gOnlyAsset = totalCapitalKRW * Math.pow(1 + priceGrowthG, year);
    const gOnlyDiv = totalCapitalKRW * growthSpec.dividendYield * (1 - TAX_RATE) * Math.pow(1 + divGrowthG, year - 1);
    cumDivGrowthOnly += gOnlyDiv;
    const gOnlyWealth = gOnlyAsset + cumDivGrowthOnly;

    // 3) 100% 인컴 단독
    const iOnlyAsset = totalCapitalKRW * Math.pow(1 + priceGrowthI, year);
    const iOnlyDiv = totalCapitalKRW * incomeSpec.dividendYield * (1 - TAX_RATE) * Math.pow(1 + divGrowthI, year - 1);
    cumDivIncomeOnly += iOnlyDiv;
    const iOnlyWealth = iOnlyAsset + cumDivIncomeOnly;

    projections10y.push({
      year,
      barbellAssetKRW,
      barbellAnnualNetDivKRW,
      barbellMonthlyNetDivKRW,
      barbellTotalWealthKRW,
      growthOnlyAssetKRW: gOnlyAsset,
      growthOnlyMonthlyDivKRW: gOnlyDiv / 12,
      growthOnlyTotalWealthKRW: gOnlyWealth,
      incomeOnlyAssetKRW: iOnlyAsset,
      incomeOnlyMonthlyDivKRW: iOnlyDiv / 12,
      incomeOnlyTotalWealthKRW: iOnlyWealth,
    });
  }

  const y10 = projections10y[9];
  const insights10y = {
    year10BarbellWealthKRW: y10.barbellTotalWealthKRW,
    year10BarbellMonthlyDivKRW: y10.barbellMonthlyNetDivKRW,
    year10GrowthOnlyWealthKRW: y10.growthOnlyTotalWealthKRW,
    year10IncomeOnlyWealthKRW: y10.incomeOnlyTotalWealthKRW,
    year10GrowthOnlyMonthlyDivKRW: y10.growthOnlyMonthlyDivKRW,
    year10IncomeOnlyMonthlyDivKRW: y10.incomeOnlyMonthlyDivKRW,
  };

  // 5. (역산 모드 옵션) 목표 월 배당금 입력 시 필요 총 자본금 역산
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
    const requiredGrowthShares = Math.ceil(reqGrowthCap / growthPrice);
    const requiredIncomeShares = Math.ceil(reqIncomeCap / incomePrice);

    reverseCalculation = {
      targetMonthlyNetUSD,
      targetMonthlyNetKRW,
      requiredTotalCapitalUSD,
      requiredTotalCapitalKRW,
      requiredGrowthShares,
      requiredIncomeShares,
    };
  }

  const growthAllocation: HoldingAllocation = {
    ticker: growthSpec.ticker,
    name: growthSpec.name,
    role: `자본성장 & 배당증액 엔진 (${growthSpec.category})`,
    weightPercent: growthWeight,
    allocatedCapitalUSD: growthCapitalUSD,
    allocatedCapitalKRW: growthCapitalKRW,
    currentPrice: growthPrice,
    sharesToBuy: growthShares,
    dividendYield: growthSpec.dividendYield,
    dividendGrowth5y: growthSpec.fiveYearGrowth,
    annualGrossDividendUSD: growthAnnualGrossUSD,
    annualNetDividendUSD: growthAnnualNetUSD,
    monthlyNetDividendUSD: growthMonthlyNetUSD,
    monthlyNetDividendKRW: growthMonthlyNetUSD * exchangeRate,
  };

  const incomeAllocation: HoldingAllocation = {
    ticker: incomeSpec.ticker,
    name: incomeSpec.name,
    role: `고인컴 월급 캐시카우 (${incomeSpec.category})`,
    weightPercent: incomeWeight,
    allocatedCapitalUSD: incomeCapitalUSD,
    allocatedCapitalKRW: incomeCapitalKRW,
    currentPrice: incomePrice,
    sharesToBuy: incomeShares,
    dividendYield: incomeSpec.dividendYield,
    dividendGrowth5y: incomeSpec.fiveYearGrowth,
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
    exchangeRate,
    combinedDividendYield,
    combinedDividendGrowth5y,
    totalCapitalUSD,
    totalCapitalKRW,
    annualGrossDividendUSD,
    annualGrossDividendKRW,
    annualTaxUSD,
    annualNetDividendUSD,
    annualNetDividendKRW,
    monthlyNetDividendUSD,
    monthlyNetDividendKRW,
    isTaxWarning,
    personality,
    holdings: {
      growth: growthAllocation,
      income: incomeAllocation,
    },
    projections10y,
    insights10y,
    reverseCalculation,
  };
}
