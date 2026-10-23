import { ETF_LIST } from '@/data/etfList';

/**
 * ETF 상세 비교 데이터 인터페이스
 */
export interface ETFComparisonData {
  ticker: string;
  name: string;
  nameKo?: string;
  category: string;
  currentPrice: number; // USD
  dividendYield: number; // 예: 0.0348 (3.48%)
  dividendGrowth5y: number | null; // 예: 0.0892 (8.92%)
  expenseRatio: number; // 예: 0.0006 (0.06%)
  fiveYearReturn: number; // 예: 0.564 (56.4%)
  priceGrowthRate: number; // 연평균 예상 주가 상승률 (원금 평가액 계산용)
  frequency: 'monthly' | 'quarterly';
  frequencyLabel: '월배당' | '분기배당';
  distributionDay: string; // "매월 초", "3/6/9/12월 말" 등
  targetAudience: string; // 추천 투자자 성향
  pros: string[]; // 장점
  cons: string[]; // 주의점
  summaryGuide: string; // 상세 가이드 요약
}

/**
 * 20개 ETF별 보수적인 연평균 주가 상승률(원금 평가용) 및 배당 지급 시기
 */
const ETF_PROFILES: Record<
  string,
  {
    priceGrowthRate: number;
    distributionDay: string;
    targetAudience: string;
    fiveYearReturn: number;
    pros: string[];
    cons: string[];
  }
> = {
  SCHD: {
    priceGrowthRate: 0.055,
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '10년 이상 장기 복리 배당성장형',
    fiveYearReturn: 0.564,
    pros: [
      '연평균 약 9%에 달하는 강력한 5년 배당성장률',
      '0.06%의 매우 저렴한 운용보수로 장기 복리 극대화',
      '우량 대형 가치주 중심으로 시장 하락 방어력 우수',
    ],
    cons: [
      '분기별(3개월) 지급으로 매월 생활비 수령에는 현금흐름 굴곡',
      '고배당 커버드콜 대비 초기 진입 시점의 배당률(3.5%)은 평이함',
    ],
  },
  DGRO: {
    priceGrowthRate: 0.058,
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '배당안전성 중심의 성장 배당형',
    fiveYearReturn: 0.612,
    pros: [
      '배당성향 75% 이하 기업 선별로 높은 배당 지속성과 연 9.4% 성장률',
      '마이크로소프트, 애플 등 빅테크 우량주도 다수 편입',
    ],
    cons: [
      '시가배당률 2.2%대로 초기 현금 인컴 수령액은 낮은 편',
      '배당보다는 배당성장 및 자본차익 중심',
    ],
  },
  VIG: {
    priceGrowthRate: 0.052,
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '10년 이상 연속 배당인상 우량 가치주형',
    fiveYearReturn: 0.528,
    pros: [
      '10년 연속 배당을 인상한 미국 대형 우량주의 철벽 안전성',
      '0.06% 초저보수와 극도로 낮은 주가 변동성',
    ],
    cons: [
      '시가배당률 1.7% 수준으로 당장의 인컴 수령액은 적음',
      '주가 상승 탄력은 S&P 500 대비 다소 완만',
    ],
  },
  JEPI: {
    priceGrowthRate: 0.020,
    distributionDay: '매월 1일 전후',
    targetAudience: '은퇴 및 조기 파이어족 당장 생활비 수령형',
    fiveYearReturn: 0.285,
    pros: [
      '연 7~8%대의 풍부한 월배당으로 확실한 제2의 월급 창출',
      '매월 1일 지급으로 월 생활비 및 고정 지출 결제에 이상적',
      'S&P 500 저변동성 주식 기반으로 완만한 하락 방어',
    ],
    cons: [
      '커버드콜 옵션 구조상 강세장에서 주가 상승 상단이 제한됨',
      'SCHD 대비 다소 높은 운용보수(0.35%)',
    ],
  },
  JEPQ: {
    priceGrowthRate: 0.025,
    distributionDay: '매월 1일 전후',
    targetAudience: '나스닥 기술주 기반 초고배당 월급 수령형',
    fiveYearReturn: 0.380,
    pros: [
      '연 9~10% 수준의 압도적인 초고인컴 월배당 제공',
      '나스닥 100 대형 기술주를 기초자산으로 보유하여 성장 일부 향유',
      '높은 배당 재투자를 통해 자산 회수 기간 단축 가능',
    ],
    cons: [
      '기술주 중심이라 나스닥 하락장 시 JEPI보다 원금 변동성이 큼',
      '주가 상방 캡(Cap)으로 인해 QQQ 대비 상승 폭은 제한적',
    ],
  },
  SPYI: {
    priceGrowthRate: 0.020,
    distributionDay: '매월 말',
    targetAudience: '연 11%대 S&P 500 절세형 월배당형',
    fiveYearReturn: 0.310,
    pros: [
      '연 11~12% 수준의 최고 수준 월배당 인컴 창출',
      '옵션 스프레드 매매를 활용하여 S&P 500 상승분 일부 참여',
      '미국 세법(Section 1256) 절세 최적화 전략 적용',
    ],
    cons: [
      '운용보수(0.68%)가 다소 높은 편',
      '신생 ETF로 장기 트랙레코드 지속 관찰 필요',
    ],
  },
  QQQI: {
    priceGrowthRate: 0.020,
    distributionDay: '매월 말',
    targetAudience: '연 13%대 최고 인컴 월배당 현금흐름형',
    fiveYearReturn: 0.330,
    pros: [
      '연 13~14%대 극대화된 월배당으로 초기 현금 회수 속도 압도적 1위',
      '나스닥 100 옵션 스프레드로 급격한 상방 캡 완화',
    ],
    cons: [
      '고배당 커버드콜 특성상 장기 주가 상승폭은 제한적',
      '나스닥 급락장에서 원금 방어 주의',
    ],
  },
  DIVO: {
    priceGrowthRate: 0.035,
    distributionDay: '매월 말',
    targetAudience: '배당성장과 월배당 인컴의 황금비율형',
    fiveYearReturn: 0.440,
    pros: [
      '기계적 매도가 아닌 전술적 옵션 매도로 주가 상승력 보존',
      '우량 배당주 중심 포트폴리오로 시장 하락 방어 우수',
    ],
    cons: [
      '시가배당률이 4.6% 수준으로 다른 고배당 커버드콜보다 낮음',
    ],
  },
  VOO: {
    priceGrowthRate: 0.080,
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '워런 버핏 추천 미국 대표 지수 자본성장형',
    fiveYearReturn: 0.985,
    pros: [
      '5년 주가 수익률 약 98%로 강력한 자본 차익(Capital Gain)',
      '0.03%의 사실상 무료에 가까운 업계 최저 운용보수',
      '미국 상위 500대 기업 전체에 분산 투자되는 절대적 안정성',
    ],
    cons: [
      '1.4% 수준의 낮은 시가배당률로 당장의 현금흐름 창출에는 한계',
      '배당금만으로 생활비를 조달하려면 막대한 자본금 필요',
    ],
  },
  QQQ: {
    priceGrowthRate: 0.105,
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '빅테크 AI 혁신 산업 자본성장 극대화형',
    fiveYearReturn: 1.450,
    pros: [
      '5년 수익률 145%로 압도적인 자본 성장률',
      '빅테크 및 AI 혁신 산업 성장의 직접적 수혜',
      '장기 우상향 추세가 가장 강력한 지수',
    ],
    cons: [
      '배당률 0.5%대로 현금흐름 수령 목적에는 부적합',
      '경기 침체나 금리 인상 시 하락폭이 큼',
    ],
  },
  DIA: {
    priceGrowthRate: 0.065,
    distributionDay: '매월 중순',
    targetAudience: '미국 30대 전통 우량 기업 월배당 수령형',
    fiveYearReturn: 0.680,
    pros: [
      '미국 대표 30대 전통 블루칩 기업 기반의 안정적인 월배당',
      '100년 역사의 다우 지수 브랜드 안정성',
    ],
    cons: [
      '가격 가중 방식의 지수 산출로 종목 왜곡 가능성',
    ],
  },
  SCHG: {
    priceGrowthRate: 0.100,
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '초저보수 빅테크 대형 성장주형',
    fiveYearReturn: 1.350,
    pros: [
      '0.04% 초저보수로 미국 최고 실적의 대형 성장주 200여 개 분산 투자',
      'QQQ 수준의 높은 자본 성장 탄력',
    ],
    cons: [
      '배당수익률 0.4% 수준으로 현금흐름 목적에는 부적합',
    ],
  },
  NOBL: {
    priceGrowthRate: 0.045,
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '25년 이상 연속 배당증액 배당귀족형',
    fiveYearReturn: 0.480,
    pros: [
      '25년 이상 연속 배당금을 늘려온 미국 최강의 배당귀족 기업만 선별',
      '경제 위기 및 하락장에서 탁월한 원금 방어력',
    ],
    cons: [
      '성장주 비중이 낮아 강세장에서 지수 대비 상승 탄력 둔화',
    ],
  },
  VYM: {
    priceGrowthRate: 0.042,
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '뱅가드 대표 고배당 가치주 분산형',
    fiveYearReturn: 0.460,
    pros: [
      '0.06% 초저보수로 400여 개 고배당 미국 기업에 광범위 분산',
      '금융, 헬스케어, 필수소비재 등 안정적 섹터 구성',
    ],
    cons: [
      '빅테크 비중이 거의 없어 강세장에서 지수 상승률 하회',
    ],
  },
  HDV: {
    priceGrowthRate: 0.038,
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '재무건전성 우수 고배당 방어형',
    fiveYearReturn: 0.410,
    pros: [
      '모닝스타 재무건전성 및 경제적 해자 통과 기업 75종 집중 투자',
      '에너지, 통신, 필수소비재 등 높은 배당 방어력',
    ],
    cons: [
      '종목 집중도가 높아 특정 섹터 부진 시 영향',
    ],
  },
  O: {
    priceGrowthRate: 0.022,
    distributionDay: '매월 15일',
    targetAudience: '매월 꼬박꼬박 월세 받는 부동산 임대소득형',
    fiveYearReturn: 0.220,
    pros: [
      '30년 연속 월배당을 증액해 온 미국 1위 상업용 리츠',
      '매월 15일 꼬박꼬박 입금되는 안정적인 5.6%대 월세 수익',
      '월마트, 세븐일레븐 등 우량 장기 임차인 포트폴리오',
    ],
    cons: [
      '금리 급등 시 차입 비용 증가로 주가 조정 압력',
      '개별 리츠 주식으로서의 공실률 리스크 존재',
    ],
  },
  VNQ: {
    priceGrowthRate: 0.025,
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '미국 상업/주거 리츠 전체 분산투자형',
    fiveYearReturn: 0.260,
    pros: [
      '미국 전체 160여 개 리츠에 분산 투자하는 대표 부동산 ETF',
      '0.13% 저렴한 수수료로 부동산 인컴 분산',
    ],
    cons: [
      '분기 배당으로 매월 월세 수령 목적에는 다소 불편',
    ],
  },
  TLT: {
    priceGrowthRate: 0.015,
    distributionDay: '매월 초',
    targetAudience: '금리 인하 자본차익 & 미국채 안전자산형',
    fiveYearReturn: -0.150,
    pros: [
      '미국 재무부 보증 20년 이상 초장기 국채의 절대적 안전성',
      '금리 인하 사이클 도래 시 강력한 채권 가격 자본 차익',
      '주식 시장 폭락 시 훌륭한 음의 상관관계 헷지',
    ],
    cons: [
      '듀레이션이 길어 금리 인상기 원금 변동성이 매우 큼',
    ],
  },
  SGOV: {
    priceGrowthRate: 0.000,
    distributionDay: '매월 초',
    targetAudience: '초단기 안전 현금 파킹 및 확정 월이자 수령형',
    fiveYearReturn: 0.120,
    pros: [
      '0~3개월 만기 초단기 미국채 투자로 원금 손실 위험 사실상 0%',
      '매월 안정적인 연 5%대 확정 월이자 지급',
    ],
    cons: [
      '기준금리 인하 시 배당수익률도 즉각 하락',
      '주가 상승을 통한 자본 차익은 기대할 수 없음',
    ],
  },
  MAIN: {
    priceGrowthRate: 0.025,
    distributionDay: '매월 15일',
    targetAudience: '미국 중소기업 고인컴 BDC 월배당형',
    fiveYearReturn: 0.510,
    pros: [
      '연 6.8% 정기 월배당 외에도 연 2회 추가 특별배당 지급',
      '상장 이후 단 한 번도 정기 배당을 삭감한 적 없는 뛰어난 주주환원',
    ],
    cons: [
      '중소기업 대출 중심이라 경기 침체 시 대손 위험 존재',
    ],
  },
};

/**
 * 20개 ETF 전체 마스터 비교 데이터셋
 */
export const COMPARISON_ETFS: Record<string, ETFComparisonData> = Object.fromEntries(
  ETF_LIST.map((item) => {
    const profile = ETF_PROFILES[item.ticker] || {
      priceGrowthRate: 0.03,
      distributionDay: item.payoutCycle === '월배당' ? '매월 초' : '3, 6, 9, 12월 말',
      targetAudience: '안정적인 배당 투자자',
      fiveYearReturn: 0.35,
      pros: item.prosConsSummary?.pros ? [item.prosConsSummary.pros] : ['안정적인 배당 현금흐름'],
      cons: item.prosConsSummary?.cons ? [item.prosConsSummary.cons] : ['시장 변동성 주의'],
    };

    return [
      item.ticker,
      {
        ticker: item.ticker,
        name: item.nameEn,
        nameKo: item.name,
        category: item.category,
        currentPrice: item.currentPriceUSD,
        dividendYield: item.dividendYield,
        dividendGrowth5y: item.fiveYearGrowth,
        expenseRatio: item.expenseRatio ?? 0.001,
        fiveYearReturn: profile.fiveYearReturn,
        priceGrowthRate: profile.priceGrowthRate,
        frequency: item.payoutCycle === '월배당' ? 'monthly' : 'quarterly',
        frequencyLabel: item.payoutCycle,
        distributionDay: profile.distributionDay,
        targetAudience: profile.targetAudience,
        pros: profile.pros,
        cons: profile.cons,
        summaryGuide: item.summary,
      },
    ];
  })
);

export type MetricWinner = 'A' | 'B' | 'TIE';

export interface ComparisonMetricResult {
  label: string;
  description: string;
  valueA: number | string | null;
  valueB: number | string | null;
  formattedA: string;
  formattedB: string;
  winner: MetricWinner;
  isExpense?: boolean;
}

export interface ComparisonSummary {
  etfA: ETFComparisonData;
  etfB: ETFComparisonData;
  metrics: {
    yield: ComparisonMetricResult;
    growth: ComparisonMetricResult;
    expense: ComparisonMetricResult;
    return5y: ComparisonMetricResult;
    frequency: ComparisonMetricResult;
  };
  scoreA: number;
  scoreB: number;
  finalWinner: MetricWinner;
}

/**
 * 1:1 골든크로스(배당 역전) 연도별 데이터 포인트
 */
export interface CrossoverYearData {
  year: number; // 1 ~ 20년차
  dividendAnnualUSD_A: number;
  dividendAnnualUSD_B: number;
  dividendAnnualKRW_A: number;
  dividendAnnualKRW_B: number;
  dividendMonthlyKRW_A: number;
  dividendMonthlyKRW_B: number;
  assetValueKRW_A: number;
  assetValueKRW_B: number;
  totalWealthKRW_A: number;
  totalWealthKRW_B: number;
  yocA: number;
  yocB: number;
  isCrossoverYear: boolean;
  winnerThisYear: 'A' | 'B' | 'TIE';
}

/**
 * 마일스톤 비교 카드 (1년차, 3년차, 5년차, 10년차, 15년차)
 */
export interface MilestoneComparison {
  year: number;
  netDividendAnnualKRW_A: number;
  netDividendAnnualKRW_B: number;
  netDividendMonthlyKRW_A: number;
  netDividendMonthlyKRW_B: number;
  assetValueKRW_A: number;
  assetValueKRW_B: number;
  cumDividendKRW_A: number;
  cumDividendKRW_B: number;
  totalWealthKRW_A: number;
  totalWealthKRW_B: number;
  divWinner: 'A' | 'B' | 'TIE';
  assetWinner: 'A' | 'B' | 'TIE';
}

/**
 * 1:1 초기 투자금 및 골든크로스 연산 결과 인터페이스
 */
export interface CrossoverBattleResult {
  etfA: ETFComparisonData;
  etfB: ETFComparisonData;
  initialCapitalUSD: number;
  initialCapitalKRW: number;
  investmentYears: number;
  exchangeRate: number;

  initialAnnualNetUSD_A: number;
  initialAnnualNetUSD_B: number;
  initialAnnualNetKRW_A: number;
  initialAnnualNetKRW_B: number;
  initialMonthlyNetKRW_A: number;
  initialMonthlyNetKRW_B: number;

  crossoverYear: number | null;
  crossoverOvertaker: 'A' | 'B' | null;
  crossoverSummaryText: string;

  // 승리 판정 배지 결과
  winner5yCashflow: {
    winner: 'A' | 'B' | 'TIE';
    winnerTicker: string;
    total5yKRW_A: number;
    total5yKRW_B: number;
    differenceKRW: number;
    summary: string;
  };
  winner10yTotalReturn: {
    winner: 'A' | 'B' | 'TIE';
    winnerTicker: string;
    totalWealth10yKRW_A: number;
    totalWealth10yKRW_B: number;
    differenceKRW: number;
    summary: string;
  };

  milestones: MilestoneComparison[];
  yearlyProjections: CrossoverYearData[];
}

/**
 * 두 ETF의 1:1 맞짱 비교 및 우위 판정 연산 함수
 */
export function compareEtfs(tickerA: string, tickerB: string): ComparisonSummary {
  const etfA = COMPARISON_ETFS[tickerA] || COMPARISON_ETFS['SCHD'];
  const etfB = COMPARISON_ETFS[tickerB] || COMPARISON_ETFS['JEPI'];

  let scoreA = 0;
  let scoreB = 0;

  // 1. 시가배당률
  let yieldWinner: MetricWinner = 'TIE';
  if (etfA.dividendYield > etfB.dividendYield) {
    yieldWinner = 'A';
    scoreA++;
  } else if (etfB.dividendYield > etfA.dividendYield) {
    yieldWinner = 'B';
    scoreB++;
  }

  // 2. 5년 배당성장률
  let growthWinner: MetricWinner = 'TIE';
  const gA = etfA.dividendGrowth5y ?? 0;
  const gB = etfB.dividendGrowth5y ?? 0;
  if (gA > gB) {
    growthWinner = 'A';
    scoreA++;
  } else if (gB > gA) {
    growthWinner = 'B';
    scoreB++;
  }

  // 3. 운용보수
  let expenseWinner: MetricWinner = 'TIE';
  if (etfA.expenseRatio < etfB.expenseRatio) {
    expenseWinner = 'A';
    scoreA++;
  } else if (etfB.expenseRatio < etfA.expenseRatio) {
    expenseWinner = 'B';
    scoreB++;
  }

  // 4. 5년 주가 수익률
  let returnWinner: MetricWinner = 'TIE';
  if (etfA.fiveYearReturn > etfB.fiveYearReturn) {
    returnWinner = 'A';
    scoreA++;
  } else if (etfB.fiveYearReturn > etfA.fiveYearReturn) {
    returnWinner = 'B';
    scoreB++;
  }

  // 5. 배당 주기
  let freqWinner: MetricWinner = 'TIE';
  if (etfA.frequency === 'monthly' && etfB.frequency !== 'monthly') {
    freqWinner = 'A';
  } else if (etfB.frequency === 'monthly' && etfA.frequency !== 'monthly') {
    freqWinner = 'B';
  }

  // 최종 판정
  let finalWinner: MetricWinner = 'TIE';
  if (scoreA > scoreB) finalWinner = 'A';
  else if (scoreB > scoreA) finalWinner = 'B';

  return {
    etfA,
    etfB,
    scoreA,
    scoreB,
    finalWinner,
    metrics: {
      yield: {
        label: '시가배당률 (Dividend Yield)',
        description: '현재 주가 대비 1년 동안 지급받는 예상 세전 배당금 비율',
        valueA: etfA.dividendYield,
        valueB: etfB.dividendYield,
        formattedA: `${(etfA.dividendYield * 100).toFixed(2)}%`,
        formattedB: `${(etfB.dividendYield * 100).toFixed(2)}%`,
        winner: yieldWinner,
      },
      growth: {
        label: '5년 배당성장률 (5Y CAGR)',
        description: '최근 5년간 매년 배당금이 늘어난 연평균 복리 성장률',
        valueA: etfA.dividendGrowth5y,
        valueB: etfB.dividendGrowth5y,
        formattedA: etfA.dividendGrowth5y ? `${(etfA.dividendGrowth5y * 100).toFixed(2)}%` : '0.00%',
        formattedB: etfB.dividendGrowth5y ? `${(etfB.dividendGrowth5y * 100).toFixed(2)}%` : '0.00%',
        winner: growthWinner,
      },
      expense: {
        label: '운용보수 (Expense Ratio)',
        description: '자산운용사에 매년 지불하는 수수료 (낮을수록 장기 복리에 유리)',
        valueA: etfA.expenseRatio,
        valueB: etfB.expenseRatio,
        formattedA: `${(etfA.expenseRatio * 100).toFixed(2)}%`,
        formattedB: `${(etfB.expenseRatio * 100).toFixed(2)}%`,
        winner: expenseWinner,
        isExpense: true,
      },
      return5y: {
        label: '5년 주가 수익률 (5Y Return)',
        description: '최근 5년 동안 주가 자체가 상승한 순수 시세 차익률',
        valueA: etfA.fiveYearReturn,
        valueB: etfB.fiveYearReturn,
        formattedA: `${etfA.fiveYearReturn >= 0 ? '+' : ''}${(etfA.fiveYearReturn * 100).toFixed(1)}%`,
        formattedB: `${etfB.fiveYearReturn >= 0 ? '+' : ''}${(etfB.fiveYearReturn * 100).toFixed(1)}%`,
        winner: returnWinner,
      },
      frequency: {
        label: '배당 지급 주기 (Frequency)',
        description: '배당금이 통장에 입금되는 주기 및 지급 패턴',
        valueA: etfA.frequencyLabel,
        valueB: etfB.frequencyLabel,
        formattedA: `${etfA.frequencyLabel} (${etfA.distributionDay})`,
        formattedB: `${etfB.frequencyLabel} (${etfB.distributionDay})`,
        winner: freqWinner,
      },
    },
  };
}

/**
 * 초기 투자금 & 기간 기반 배당성장 골든크로스(역전 시점) 및 자산평가 연산 함수
 */
export function calculateCrossoverBattle(
  tickerA: string,
  tickerB: string,
  initialCapitalAmount: number,
  investmentYears: number = 15,
  currency: 'KRW' | 'USD' = 'KRW',
  exchangeRate = 1350
): CrossoverBattleResult {
  const etfA = COMPARISON_ETFS[tickerA] || COMPARISON_ETFS['SCHD'];
  const etfB = COMPARISON_ETFS[tickerB] || COMPARISON_ETFS['JEPI'];

  const initialCapitalUSD =
    currency === 'USD' ? initialCapitalAmount : initialCapitalAmount / exchangeRate;
  const initialCapitalKRW =
    currency === 'KRW' ? initialCapitalAmount : initialCapitalAmount * exchangeRate;

  const US_TAX_RATE = 0.15; // 15% 미국 배당소득세 원천징수

  // 1년차 초기 세후 배당금
  const initialAnnualNetUSD_A = initialCapitalUSD * etfA.dividendYield * (1 - US_TAX_RATE);
  const initialAnnualNetUSD_B = initialCapitalUSD * etfB.dividendYield * (1 - US_TAX_RATE);

  const initialAnnualNetKRW_A = initialAnnualNetUSD_A * exchangeRate;
  const initialAnnualNetKRW_B = initialAnnualNetUSD_B * exchangeRate;

  const initialMonthlyNetKRW_A = initialAnnualNetKRW_A / 12;
  const initialMonthlyNetKRW_B = initialAnnualNetKRW_B / 12;

  const growthA = etfA.dividendGrowth5y ?? 0.05;
  const growthB = etfB.dividendGrowth5y ?? 0.05;

  const priceGrowthA = etfA.priceGrowthRate ?? 0.03;
  const priceGrowthB = etfB.priceGrowthRate ?? 0.03;

  const safeYears = Math.min(20, Math.max(1, investmentYears));

  // 연도별 프로젝션 계산 및 골든크로스 탐색
  const yearlyProjections: CrossoverYearData[] = [];
  let crossoverYear: number | null = null;
  let crossoverOvertaker: 'A' | 'B' | null = null;

  // 1년차 초기 배당 우위 판정
  const initialWinner = initialAnnualNetUSD_A >= initialAnnualNetUSD_B ? 'A' : 'B';

  let runningCumUSD_A = 0;
  let runningCumUSD_B = 0;

  for (let year = 1; year <= safeYears; year++) {
    // 복리 배당성장: NetDiv(t) = NetDiv(1) * (1 + growth)^(year - 1)
    const annualNetUSD_A = initialAnnualNetUSD_A * Math.pow(1 + growthA, year - 1);
    const annualNetUSD_B = initialAnnualNetUSD_B * Math.pow(1 + growthB, year - 1);

    const annualNetKRW_A = annualNetUSD_A * exchangeRate;
    const annualNetKRW_B = annualNetUSD_B * exchangeRate;

    const monthlyNetKRW_A = annualNetKRW_A / 12;
    const monthlyNetKRW_B = annualNetKRW_B / 12;

    // 원금 자산 평가액 (배당금 재투자 제외한 순수 원금 평가액)
    const assetValUSD_A = initialCapitalUSD * Math.pow(1 + priceGrowthA, year);
    const assetValUSD_B = initialCapitalUSD * Math.pow(1 + priceGrowthB, year);
    const assetValKRW_A = assetValUSD_A * exchangeRate;
    const assetValKRW_B = assetValUSD_B * exchangeRate;

    runningCumUSD_A += annualNetUSD_A;
    runningCumUSD_B += annualNetUSD_B;

    const totalWealthKRW_A = assetValKRW_A + runningCumUSD_A * exchangeRate;
    const totalWealthKRW_B = assetValKRW_B + runningCumUSD_B * exchangeRate;

    const yocA = (annualNetUSD_A / initialCapitalUSD) * 100;
    const yocB = (annualNetUSD_B / initialCapitalUSD) * 100;

    const currentWinner =
      annualNetUSD_A > annualNetUSD_B ? 'A' : annualNetUSD_B > annualNetUSD_A ? 'B' : 'TIE';

    // 골든크로스 감지 (1년차 승자와 달라진 첫 번째 해)
    let isCrossoverYear = false;
    if (
      crossoverYear === null &&
      year > 1 &&
      currentWinner !== initialWinner &&
      currentWinner !== 'TIE'
    ) {
      crossoverYear = year;
      crossoverOvertaker = currentWinner;
      isCrossoverYear = true;
    }

    yearlyProjections.push({
      year,
      dividendAnnualUSD_A: annualNetUSD_A,
      dividendAnnualUSD_B: annualNetUSD_B,
      dividendAnnualKRW_A: annualNetKRW_A,
      dividendAnnualKRW_B: annualNetKRW_B,
      dividendMonthlyKRW_A: monthlyNetKRW_A,
      dividendMonthlyKRW_B: monthlyNetKRW_B,
      assetValueKRW_A: assetValKRW_A,
      assetValueKRW_B: assetValKRW_B,
      totalWealthKRW_A: totalWealthKRW_A,
      totalWealthKRW_B: totalWealthKRW_B,
      yocA,
      yocB,
      isCrossoverYear,
      winnerThisYear: currentWinner,
    });
  }

  // 골든크로스 요약 텍스트 생성
  let crossoverSummaryText = '';
  if (crossoverYear !== null && crossoverOvertaker !== null) {
    const overtakerName = crossoverOvertaker === 'A' ? etfA.ticker : etfB.ticker;
    const underdogName = crossoverOvertaker === 'A' ? etfB.ticker : etfA.ticker;
    const overtakerGrowth =
      crossoverOvertaker === 'A' ? (growthA * 100).toFixed(1) : (growthB * 100).toFixed(1);

    crossoverSummaryText = `${overtakerName}의 연간 배당금이 ${crossoverYear}년차에 ${underdogName}를 역전합니다! (연평균 배당성장률 +${overtakerGrowth}%)`;
  } else if (initialWinner === 'A' && growthA >= growthB) {
    crossoverSummaryText = `${etfA.ticker}가 초기 배당률과 배당성장률 모두 앞서며 ${safeYears}년 시뮬레이션 기간 내내 배당금 우위를 유지합니다.`;
  } else if (initialWinner === 'B' && growthB >= growthA) {
    crossoverSummaryText = `${etfB.ticker}가 초기 배당률과 배당성장률 모두 앞서며 ${safeYears}년 시뮬레이션 기간 내내 배당금 우위를 유지합니다.`;
  } else {
    crossoverSummaryText = `두 종목의 배당률 격차로 인해 선택하신 ${safeYears}년 이내에는 배당 역전이 발생하지 않으며, 각자의 인컴 및 성장 성향이 유지됩니다.`;
  }

  // 1) 초기 5년 현금흐름 승자 판정
  const year5Idx = Math.min(4, yearlyProjections.length - 1);
  let cumDiv5yA = 0;
  let cumDiv5yB = 0;
  for (let i = 0; i <= year5Idx; i++) {
    cumDiv5yA += yearlyProjections[i].dividendAnnualKRW_A;
    cumDiv5yB += yearlyProjections[i].dividendAnnualKRW_B;
  }
  const cashflowWinner =
    cumDiv5yA > cumDiv5yB ? 'A' : cumDiv5yB > cumDiv5yA ? 'B' : 'TIE';
  const cashflowWinnerTicker =
    cashflowWinner === 'A' ? etfA.ticker : cashflowWinner === 'B' ? etfB.ticker : '무승부';
  const cashflowDiff = Math.abs(cumDiv5yA - cumDiv5yB);

  // 2) 10년 후 장기 총수익 승자 판정
  const year10Idx = Math.min(9, yearlyProjections.length - 1);
  const totalWealth10yA = yearlyProjections[year10Idx].totalWealthKRW_A;
  const totalWealth10yB = yearlyProjections[year10Idx].totalWealthKRW_B;
  const totalReturnWinner =
    totalWealth10yA > totalWealth10yB ? 'A' : totalWealth10yB > totalWealth10yA ? 'B' : 'TIE';
  const totalReturnWinnerTicker =
    totalReturnWinner === 'A' ? etfA.ticker : totalReturnWinner === 'B' ? etfB.ticker : '무승부';
  const totalReturnDiff = Math.abs(totalWealth10yA - totalWealth10yB);

  // 주요 마일스톤 생성: [1, 3, 5, 10, 15, 20] 중 safeYears 이하인 연도
  const milestoneTargetYears = [1, 3, 5, 10, 15, 20].filter((y) => y <= safeYears);
  if (!milestoneTargetYears.includes(safeYears)) {
    milestoneTargetYears.push(safeYears);
  }
  milestoneTargetYears.sort((a, b) => a - b);

  const milestones: MilestoneComparison[] = milestoneTargetYears.map((targetYear) => {
    const item = yearlyProjections[targetYear - 1];
    let cumDivA = 0;
    let cumDivB = 0;
    for (let i = 0; i < targetYear; i++) {
      cumDivA += yearlyProjections[i].dividendAnnualKRW_A;
      cumDivB += yearlyProjections[i].dividendAnnualKRW_B;
    }

    return {
      year: targetYear,
      netDividendAnnualKRW_A: item.dividendAnnualKRW_A,
      netDividendAnnualKRW_B: item.dividendAnnualKRW_B,
      netDividendMonthlyKRW_A: item.dividendMonthlyKRW_A,
      netDividendMonthlyKRW_B: item.dividendMonthlyKRW_B,
      assetValueKRW_A: item.assetValueKRW_A,
      assetValueKRW_B: item.assetValueKRW_B,
      cumDividendKRW_A: cumDivA,
      cumDividendKRW_B: cumDivB,
      totalWealthKRW_A: item.totalWealthKRW_A,
      totalWealthKRW_B: item.totalWealthKRW_B,
      divWinner:
        item.dividendAnnualKRW_A > item.dividendAnnualKRW_B
          ? 'A'
          : item.dividendAnnualKRW_B > item.dividendAnnualKRW_A
          ? 'B'
          : 'TIE',
      assetWinner:
        item.assetValueKRW_A > item.assetValueKRW_B
          ? 'A'
          : item.assetValueKRW_B > item.assetValueKRW_A
          ? 'B'
          : 'TIE',
    };
  });

  return {
    etfA,
    etfB,
    initialCapitalUSD,
    initialCapitalKRW,
    investmentYears: safeYears,
    exchangeRate,
    initialAnnualNetUSD_A,
    initialAnnualNetUSD_B,
    initialAnnualNetKRW_A,
    initialAnnualNetKRW_B,
    initialMonthlyNetKRW_A,
    initialMonthlyNetKRW_B,
    crossoverYear,
    crossoverOvertaker,
    crossoverSummaryText,
    winner5yCashflow: {
      winner: cashflowWinner,
      winnerTicker: cashflowWinnerTicker,
      total5yKRW_A: cumDiv5yA,
      total5yKRW_B: cumDiv5yB,
      differenceKRW: cashflowDiff,
      summary:
        cashflowWinner === 'TIE'
          ? '5년간 누적 배당 수령액이 동일합니다.'
          : `${cashflowWinnerTicker}가 5년간 약 ${Math.round(cashflowDiff / 10000).toLocaleString()}만 원의 배당금을 더 많이 지급합니다.`,
    },
    winner10yTotalReturn: {
      winner: totalReturnWinner,
      winnerTicker: totalReturnWinnerTicker,
      totalWealth10yKRW_A: totalWealth10yA,
      totalWealth10yKRW_B: totalWealth10yB,
      differenceKRW: totalReturnDiff,
      summary:
        totalReturnWinner === 'TIE'
          ? '10년 후 총 평가액과 누적 배당의 합산 가치가 유사합니다.'
          : `${totalReturnWinnerTicker}가 10년 후 총 자산에서 약 ${Math.round(totalReturnDiff / 10000).toLocaleString()}만 원 더 앞섭니다.`,
    },
    milestones,
    yearlyProjections,
  };
}
