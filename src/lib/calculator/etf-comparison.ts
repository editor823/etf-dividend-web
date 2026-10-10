/**
 * ETF 상세 비교 데이터 인터페이스
 */
export interface ETFComparisonData {
  ticker: string;
  name: string;
  category: string;
  currentPrice: number; // USD
  dividendYield: number; // 예: 0.0348 (3.48%)
  dividendGrowth5y: number | null; // 예: 0.0892 (8.92%)
  expenseRatio: number; // 예: 0.0006 (0.06%)
  fiveYearReturn: number; // 예: 0.564 (56.4%)
  frequency: 'monthly' | 'quarterly';
  frequencyLabel: '월배당' | '분기배당';
  distributionDay: string; // "매월 초", "3/6/9/12월 말" 등
  targetAudience: string; // "3040 장기 배당성장형" 등
  pros: string[]; // 장점 3가지
  cons: string[]; // 주의점 2가지
  summaryGuide: string; // 상세 가이드 요약
}

/**
 * 비교 분석에 사용되는 프리셋 ETF 마스터 데이터셋
 */
export const COMPARISON_ETFS: Record<string, ETFComparisonData> = {
  SCHD: {
    ticker: 'SCHD',
    name: 'Schwab U.S. Dividend Equity ETF',
    category: '배당성장',
    currentPrice: 82.5,
    dividendYield: 0.0348,
    dividendGrowth5y: 0.0892, // 8.92% (연평균 배당성장률 압도적)
    expenseRatio: 0.0006, // 0.06% (매우 저렴)
    fiveYearReturn: 0.564, // 56.4%
    frequency: 'quarterly',
    frequencyLabel: '분기배당',
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '3040 적립식 배당성장 & 10년 이상 장기 투자자',
    pros: [
      '연평균 약 9%에 달하는 강력한 5년 배당성장률',
      '0.06%의 매우 저렴한 운용보수로 장기 보유에 유리',
      '우량 대형 가치주 중심으로 시장 하락 방어력 우수',
    ],
    cons: [
      '분기별(3개월) 지급으로 당장 매월 생활비 수령에는 불편',
      '고배당 커버드콜 대비 초기 진입 시점의 배당률(3.5%)은 낮은 편',
    ],
    summaryGuide:
      '당장의 현금 인출보다는 5~10년 후 눈덩이처럼 불어날 배당금 증가를 노리는 적립식 청년·중장년 투자자에게 최적입니다.',
  },
  JEPI: {
    ticker: 'JEPI',
    name: 'JPMorgan Equity Premium Income ETF',
    category: '고배당 커버드콜',
    currentPrice: 57.8,
    dividendYield: 0.0742, // 7.42%
    dividendGrowth5y: 0.051, // 5.10%
    expenseRatio: 0.0035, // 0.35%
    fiveYearReturn: 0.382, // 38.2%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    distributionDay: '매월 1~5일 전후',
    targetAudience: '은퇴 생활자 & 즉각적인 월급 대체 현금흐름 선호자',
    pros: [
      '연 7~8%대의 풍부한 월배당으로 확실한 제2의 월급 창출',
      '매월 1일 지급으로 월 생활비 및 고정 지출 결제에 이상적',
      'S&P 500 저변동성 주식 기반으로 완만한 하락 방어',
    ],
    cons: [
      '커버드콜 옵션 구조상 강세장에서 주가 상승 상단이 제한됨',
      'SCHD 대비 다소 높은 운용보수(0.35%)',
    ],
    summaryGuide:
      '주가 급등보다는 매월 통장에 꽂히는 안정적인 7%대 월배당으로 생활비를 충당하고 싶은 은퇴 및 파이어(FIRE)족에게 추천합니다.',
  },
  JEPQ: {
    ticker: 'JEPQ',
    name: 'JPMorgan Nasdaq Equity Premium Income ETF',
    category: '기술주 고배당 커버드콜',
    currentPrice: 55.2,
    dividendYield: 0.092, // 9.20%
    dividendGrowth5y: 0.062, // 6.20%
    expenseRatio: 0.0035, // 0.35%
    fiveYearReturn: 0.445, // 44.5%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    distributionDay: '매월 1~5일 전후',
    targetAudience: '초고배당 인컴 & 나스닥 기술주 동시 노출 선호자',
    pros: [
      '연 9~10% 수준의 압도적인 초고인컴 월배당 제공',
      '나스닥 100 대형 기술주(애플, MS 등)를 기초자산으로 보유',
      '높은 배당 재투자를 통해 자산 회수 기간 단축 가능',
    ],
    cons: [
      '기술주 중심이라 나스닥 하락장 시 JEPI보다 원금 변동성이 큼',
      '주가 상방 캡(Cap)으로 인해 QQQ 대비 상승 폭은 제한적',
    ],
    summaryGuide:
      'JEPI의 안정성보다 더 강력한 9%대 초고배당을 원하며, 나스닥 성장주 흐름에 함께 올라타고 싶은 적극적인 인컴 투자자에게 맞춤입니다.',
  },
  VOO: {
    ticker: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    category: '시장지수',
    currentPrice: 535.0,
    dividendYield: 0.0132, // 1.32%
    dividendGrowth5y: 0.058, // 5.80%
    expenseRatio: 0.0003, // 0.03% (최저 수준)
    fiveYearReturn: 0.986, // 98.6%
    frequency: 'quarterly',
    frequencyLabel: '분기배당',
    distributionDay: '3, 6, 9, 12월 말',
    targetAudience: '미국 경제 전체에 투자하는 자본 성장 중심 장기 투자자',
    pros: [
      '5년 주가 수익률 약 98%로 강력한 자본 차익(Capital Gain)',
      '0.03%의 사실상 무료에 가까운 업계 최저 운용보수',
      '미국 상위 500대 기업 전체에 분산 투자되는 절대적 안정성',
    ],
    cons: [
      '1.3% 수준의 낮은 시가배당률로 당장의 현금흐름 창출에는 한계',
      '배당금만으로 생활비를 조달하려면 막대한 자본금 필요',
    ],
    summaryGuide:
      '현재 현금 인출보다는 전체 자산 덩어리(원금)를 가장 안전하고 빠르게 키우고 싶은 정석 자산 배분 투자자에게 정답입니다.',
  },
  QQQ: {
    ticker: 'QQQ',
    name: 'Invesco QQQ Trust',
    category: '기술주 성장지수',
    currentPrice: 490.0,
    dividendYield: 0.0055, // 0.55%
    dividendGrowth5y: 0.074, // 7.40%
    expenseRatio: 0.002, // 0.20%
    fiveYearReturn: 1.452, // 145.2%
    frequency: 'quarterly',
    frequencyLabel: '분기배당',
    distributionDay: '4, 7, 10, 12월 말',
    targetAudience: '인컴보다 오직 폭발적인 주가 상승을 추구하는 성장주 투자자',
    pros: [
      '5년 수익률 145%로 압도적인 자본 성장률',
      '빅테크 및 AI 혁신 산업 성장의 직접적 수혜',
      '장기 우상향 추세가 가장 강력한 지수',
    ],
    cons: [
      '배당률 0.5%대로 현금흐름 수령 목적에는 부적합',
      '경기 침체나 금리 인상 시 하락폭이 큼',
    ],
    summaryGuide:
      '현금흐름보다는 시세 차익이 주 목표인 경우 적합하며, 배당 포트폴리오의 서브 성장 엔진으로 활용할 수 있습니다.',
  },
  DIVO: {
    ticker: 'DIVO',
    name: 'Amplify C-PACE ETF',
    category: '배당성장 커버드콜',
    currentPrice: 40.5,
    dividendYield: 0.0465, // 4.65%
    dividendGrowth5y: 0.048, // 4.80%
    expenseRatio: 0.0055, // 0.55%
    fiveYearReturn: 0.483, // 48.3%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    distributionDay: '매월 말일',
    targetAudience: 'SCHD의 배당성장 + JEPI의 월배당 장점을 절충하고 싶은 투자자',
    pros: [
      '4.5~5% 수준의 탄탄한 월배당 지급',
      '전술적 선별 옵션 매도로 주가 상승 참여율이 일반 커버드콜보다 높음',
      '우량 대형 배당성장주 중심 편입',
    ],
    cons: [
      '운용보수 0.55%로 비교 ETF 중 다소 높은 편',
      'JEPI 대비 배당률은 낮고 SCHD 대비 배당성장은 낮음',
    ],
    summaryGuide:
      'SCHD의 분기배당이 아쉽고 JEPI의 주가 상승 제한이 아쉬울 때, 월배당과 주가 성장을 동시에 노리는 징검다리 ETF로 제격입니다.',
  },
};

/**
 * 지표별 비교 결과 인터페이스
 */
export type MetricWinner = 'A' | 'B' | 'TIE';

export interface ComparisonMetricResult {
  label: string;
  description: string;
  valueA: number | string | null;
  valueB: number | string | null;
  formattedA: string;
  formattedB: string;
  winner: MetricWinner;
  isExpense?: boolean; // 운용보수는 낮을수록 승리
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
  scoreA: number; // A의 승리 항목 개수
  scoreB: number; // B의 승리 항목 개수
  finalWinner: MetricWinner;
}

/**
 * 두 ETF의 1:1 맞짱 비교 및 우위 판정 연산 함수
 */
export function compareEtfs(tickerA: string, tickerB: string): ComparisonSummary {
  const etfA = COMPARISON_ETFS[tickerA] || COMPARISON_ETFS['SCHD'];
  const etfB = COMPARISON_ETFS[tickerB] || COMPARISON_ETFS['JEPI'];

  let scoreA = 0;
  let scoreB = 0;

  // 1. 시가배당률 (높을수록 우위)
  let yieldWinner: MetricWinner = 'TIE';
  if (etfA.dividendYield > etfB.dividendYield) {
    yieldWinner = 'A';
    scoreA++;
  } else if (etfB.dividendYield > etfA.dividendYield) {
    yieldWinner = 'B';
    scoreB++;
  }

  // 2. 5년 배당성장률 (높을수록 우위)
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

  // 3. 운용보수 (낮을수록 우위!)
  let expenseWinner: MetricWinner = 'TIE';
  if (etfA.expenseRatio < etfB.expenseRatio) {
    expenseWinner = 'A';
    scoreA++;
  } else if (etfB.expenseRatio < etfA.expenseRatio) {
    expenseWinner = 'B';
    scoreB++;
  }

  // 4. 5년 주가 수익률 (높을수록 우위)
  let returnWinner: MetricWinner = 'TIE';
  if (etfA.fiveYearReturn > etfB.fiveYearReturn) {
    returnWinner = 'A';
    scoreA++;
  } else if (etfB.fiveYearReturn > etfA.fiveYearReturn) {
    returnWinner = 'B';
    scoreB++;
  }

  // 5. 배당 주기 (월배당이 현금흐름 편의성에서 우위 평가)
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
        description: '현재 주가 대비 1년 동안 지급받는 예상 배당금 비율',
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
        formattedA: etfA.dividendGrowth5y ? `${(etfA.dividendGrowth5y * 100).toFixed(2)}%` : '데이터 미제공',
        formattedB: etfB.dividendGrowth5y ? `${(etfB.dividendGrowth5y * 100).toFixed(2)}%` : '데이터 미제공',
        winner: growthWinner,
      },
      expense: {
        label: '운용보수 (Expense Ratio)',
        description: '자산운용사에 매년 지불하는 수수료 (낮을수록 장기 수익률 유리)',
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
        formattedA: `+${(etfA.fiveYearReturn * 100).toFixed(1)}%`,
        formattedB: `+${(etfB.fiveYearReturn * 100).toFixed(1)}%`,
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
