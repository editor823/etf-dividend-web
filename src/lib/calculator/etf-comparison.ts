import { ETF_DATABASE } from '@/lib/data/etf-database';

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
  frequency: 'monthly' | 'quarterly';
  frequencyLabel: '월배당' | '분기배당';
  distributionDay: string; // "매월 초", "3/6/9/12월 말" 등
  targetAudience: string; // "3040 장기 배당성장형" 등
  pros: string[]; // 장점
  cons: string[]; // 주의점
  summaryGuide: string; // 상세 가이드 요약
}

/**
 * 기본 17종 ETF 데이터셋 빌드 (마스터 DB 기반 확장)
 */
export const COMPARISON_ETFS: Record<string, ETFComparisonData> = Object.fromEntries(
  Object.values(ETF_DATABASE).map((etf) => {
    // 세부 불릿 포인트 커스텀 (대표 종목 및 신규 종목)
    const customPros: Record<string, string[]> = {
      SCHD: [
        '연평균 약 9%에 달하는 강력한 5년 배당성장률',
        '0.06%의 매우 저렴한 운용보수로 장기 복리 극대화',
        '우량 대형 가치주 중심으로 시장 하락 방어력 우수',
      ],
      JEPI: [
        '연 7~8%대의 풍부한 월배당으로 확실한 제2의 월급 창출',
        '매월 1일 지급으로 월 생활비 및 고정 지출 결제에 이상적',
        'S&P 500 저변동성 주식 기반으로 완만한 하락 방어',
      ],
      JEPQ: [
        '연 9~10% 수준의 압도적인 초고인컴 월배당 제공',
        '나스닥 100 대형 기술주를 기초자산으로 보유하여 성장 일부 향유',
        '높은 배당 재투자를 통해 자산 회수 기간 단축 가능',
      ],
      VOO: [
        '5년 주가 수익률 약 98%로 강력한 자본 차익(Capital Gain)',
        '0.03%의 사실상 무료에 가까운 업계 최저 운용보수',
        '미국 상위 500대 기업 전체에 분산 투자되는 절대적 안정성',
      ],
      QQQ: [
        '5년 수익률 145%로 압도적인 자본 성장률',
        '빅테크 및 AI 혁신 산업 성장의 직접적 수혜',
        '장기 우상향 추세가 가장 강력한 지수',
      ],
      SPYI: [
        '연 11~12% 수준의 최고 수준 월배당 인컴 창출',
        '옵션 스프레드 매매를 활용하여 S&P 500 상승분 일부 참여',
        '미국 세법(Section 1256) 절세 최적화 전략 적용',
      ],
      O: [
        '30년 연속 월배당을 증액해 온 미국 1위 상업용 리츠',
        '매월 15일 꼬박꼬박 입금되는 안정적인 5.8%대 월세 수익',
        '월마트, 세븐일레븐 등 우량 장기 임차인 포트폴리오',
      ],
      TLT: [
        '미국 재무부가 보증하는 20년 이상 초장기 국채의 절대 안전성',
        '금리 인하 사이클 도래 시 강력한 채권 가격 자본 차익 기대',
        '주식 시장 폭락 시 훌륭한 포트폴리오 음의 상관관계 헷지',
      ],
      DGRO: [
        '배당성향 75% 이하 기업 선별로 높은 배당 안전성과 연 9.4% 성장률',
        '마이크로소프트, 애플 등 빅테크 우량주도 다수 편입',
        '0.08%의 저렴한 운용보수로 장기 적립식 투자에 적합',
      ],
      VIG: [
        '10년 연속 배당을 인상한 미국 대형 우량주 중심의 철벽 안전성',
        '0.06%의 매우 낮은 운용보수와 극도로 낮은 주가 변동성',
        '뱅가드의 철학이 담긴 정석 배당증액 포트폴리오',
      ],
    };

    const customCons: Record<string, string[]> = {
      SCHD: [
        '분기별(3개월) 지급으로 당장 매월 생활비 수령에는 현금흐름 굴곡',
        '고배당 커버드콜 대비 초기 진입 시점의 배당률(3.5%)은 평이함',
      ],
      JEPI: [
        '커버드콜 옵션 구조상 강세장에서 주가 상승 상단이 제한됨',
        'SCHD 대비 다소 높은 운용보수(0.35%)',
      ],
      JEPQ: [
        '기술주 중심이라 나스닥 하락장 시 JEPI보다 원금 변동성이 큼',
        '주가 상방 캡(Cap)으로 인해 QQQ 대비 상승 폭은 제한적',
      ],
      VOO: [
        '1.3% 수준의 낮은 시가배당률로 당장의 현금흐름 창출에는 한계',
        '배당금만으로 생활비를 조달하려면 막대한 자본금 필요',
      ],
      QQQ: [
        '배당률 0.5%대로 현금흐름 수령 목적에는 부적합',
        '경기 침체나 금리 인상 시 하락폭이 큼',
      ],
      SPYI: [
        '운용보수(0.68%)가 다소 높은 편',
        'JEPI/JEPQ 대비 신생 ETF로 장기 트랙레코드 확인 필요',
      ],
      O: [
        '금리 급등 시 부동산 차입 비용 증가로 주가 조정 압력',
        '개별 리츠 주식으로서의 공실률 리스크 존재',
      ],
      TLT: [
        '듀레이션이 17년에 달해 금리 인상기 원금 손실 위험 매우 큼',
        '인플레이션 지속 시 실질 구매력 보전 취약',
      ],
      DGRO: [
        '시가배당률 2.2%대로 초기 현금 인컴 수령액은 낮은 편',
        '배당보다는 배당성장 및 자본차익 중심',
      ],
      VIG: [
        '시가배당률 1.7% 수준으로 인컴 목적 투자자에게는 매력 부족',
        '주가 상승 탄력은 S&P 500 대비 다소 완만',
      ],
    };

    return [
      etf.ticker,
      {
        ticker: etf.ticker,
        name: etf.name,
        nameKo: etf.nameKo,
        category: etf.category,
        currentPrice: etf.currentPrice,
        dividendYield: etf.dividendYield,
        dividendGrowth5y: etf.dividendGrowth5y,
        expenseRatio: etf.expenseRatio,
        fiveYearReturn: etf.fiveYearReturn,
        frequency: etf.frequency,
        frequencyLabel: etf.frequencyLabel,
        distributionDay: etf.payMonthsLabel,
        targetAudience: etf.targetAudience,
        pros: customPros[etf.ticker] || [etf.prosConsSummary.pros],
        cons: customCons[etf.ticker] || [etf.prosConsSummary.cons],
        summaryGuide: etf.description,
      },
    ];
  })
);

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
  year: number; // 1 ~ 15년차
  dividendAnnualUSD_A: number; // 세후 연간 배당금 ($)
  dividendAnnualUSD_B: number;
  dividendAnnualKRW_A: number; // 세후 연간 배당금 (₩)
  dividendAnnualKRW_B: number;
  dividendMonthlyKRW_A: number; // 세후 월평균 배당금 (₩)
  dividendMonthlyKRW_B: number;
  yocA: number; // 원금대비 배당수익률 (Yield on Cost)
  yocB: number;
  isCrossoverYear: boolean; // 역전이 발생한 바로 그 해인가?
  winnerThisYear: 'A' | 'B' | 'TIE';
}

/**
 * 1:1 초기 투자금 및 골든크로스 연산 결과 인터페이스
 */
export interface CrossoverBattleResult {
  etfA: ETFComparisonData;
  etfB: ETFComparisonData;
  initialCapitalUSD: number;
  initialCapitalKRW: number;
  exchangeRate: number;

  // 1년차 초기 배당 비교
  initialAnnualNetUSD_A: number;
  initialAnnualNetUSD_B: number;
  initialMonthlyNetKRW_A: number;
  initialMonthlyNetKRW_B: number;

  // 골든크로스 분석 결과
  crossoverYear: number | null; // 역전되는 연차 (1~15, 없으면 null)
  crossoverOvertaker: 'A' | 'B' | null; // 추월하는 주체
  crossoverSummaryText: string;

  // 15개년 시계열 프로젝션
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

  // 3. 운용보수 (낮을수록 우위)
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
        formattedA: etfA.dividendGrowth5y ? `${(etfA.dividendGrowth5y * 100).toFixed(2)}%` : '데이터 미제공',
        formattedB: etfB.dividendGrowth5y ? `${(etfB.dividendGrowth5y * 100).toFixed(2)}%` : '데이터 미제공',
        winner: growthWinner,
      },
      expense: {
        label: '운용보수 (Expense Ratio)',
        description: '자산운용사에 매년 지불하는 수수료 (낮을수록 장기 복리에 절대 유리)',
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

/**
 * 초기 투자금 기반 배당성장 골든크로스(역전 시점) 정밀 연산 함수
 */
export function calculateCrossoverBattle(
  tickerA: string,
  tickerB: string,
  initialCapitalAmount: number,
  currency: 'KRW' | 'USD' = 'KRW',
  exchangeRate = 1350
): CrossoverBattleResult {
  const etfA = COMPARISON_ETFS[tickerA] || COMPARISON_ETFS['SCHD'];
  const etfB = COMPARISON_ETFS[tickerB] || COMPARISON_ETFS['JEPI'];

  const initialCapitalUSD =
    currency === 'USD' ? initialCapitalAmount : initialCapitalAmount / exchangeRate;
  const initialCapitalKRW =
    currency === 'KRW' ? initialCapitalAmount : initialCapitalAmount * exchangeRate;

  const US_TAX_RATE = 0.15; // 15% 미국 원천징수 배당세

  // 1년차 초기 세후 배당금
  const initialAnnualNetUSD_A = initialCapitalUSD * etfA.dividendYield * (1 - US_TAX_RATE);
  const initialAnnualNetUSD_B = initialCapitalUSD * etfB.dividendYield * (1 - US_TAX_RATE);

  const initialMonthlyNetKRW_A = (initialAnnualNetUSD_A * exchangeRate) / 12;
  const initialMonthlyNetKRW_B = (initialAnnualNetUSD_B * exchangeRate) / 12;

  const growthA = etfA.dividendGrowth5y ?? 0.05;
  const growthB = etfB.dividendGrowth5y ?? 0.05;

  // 15개년 프로젝션 계산 및 골든크로스 탐색
  const yearlyProjections: CrossoverYearData[] = [];
  let crossoverYear: number | null = null;
  let crossoverOvertaker: 'A' | 'B' | null = null;

  // 1년차 초기 우위 판정
  const initialWinner = initialAnnualNetUSD_A >= initialAnnualNetUSD_B ? 'A' : 'B';

  for (let year = 1; year <= 15; year++) {
    // 복리 배당성장 적용: Dividend(t) = Dividend(1) * (1 + growth)^(year - 1)
    const annualNetA = initialAnnualNetUSD_A * Math.pow(1 + growthA, year - 1);
    const annualNetB = initialAnnualNetUSD_B * Math.pow(1 + growthB, year - 1);

    const annualNetKrwA = annualNetA * exchangeRate;
    const annualNetKrwB = annualNetB * exchangeRate;

    const monthlyNetKrwA = annualNetKrwA / 12;
    const monthlyNetKrwB = annualNetKrwB / 12;

    const yocA = (annualNetA / initialCapitalUSD) * 100;
    const yocB = (annualNetB / initialCapitalUSD) * 100;

    const currentWinner = annualNetA > annualNetB ? 'A' : annualNetB > annualNetA ? 'B' : 'TIE';

    // 골든크로스 감지 (1년차 승자와 달라진 첫 번째 해)
    let isCrossoverYear = false;
    if (crossoverYear === null && year > 1 && currentWinner !== initialWinner && currentWinner !== 'TIE') {
      crossoverYear = year;
      crossoverOvertaker = currentWinner;
      isCrossoverYear = true;
    }

    yearlyProjections.push({
      year,
      dividendAnnualUSD_A: annualNetA,
      dividendAnnualUSD_B: annualNetB,
      dividendAnnualKRW_A: annualNetKrwA,
      dividendAnnualKRW_B: annualNetKrwB,
      dividendMonthlyKRW_A: monthlyNetKrwA,
      dividendMonthlyKRW_B: monthlyNetKrwB,
      yocA,
      yocB,
      isCrossoverYear,
      winnerThisYear: currentWinner,
    });
  }

  // 결과 해설 요약 텍스트 생성
  let crossoverSummaryText = '';
  if (crossoverYear !== null && crossoverOvertaker !== null) {
    const overtakerName = crossoverOvertaker === 'A' ? etfA.ticker : etfB.ticker;
    const underdogName = crossoverOvertaker === 'A' ? etfB.ticker : etfA.ticker;
    const overtakerGrowth =
      crossoverOvertaker === 'A' ? (growthA * 100).toFixed(1) : (growthB * 100).toFixed(1);

    crossoverSummaryText = `🚀 초기에는 ${underdogName}의 배당금이 더 많지만, ${overtakerName}의 강력한 배당성장률(+${overtakerGrowth}%)로 인해 투자 후 약 ${crossoverYear}년차에 연간 배당금이 역전(골든크로스)됩니다!`;
  } else if (initialWinner === 'A' && growthA >= growthB) {
    crossoverSummaryText = `👑 ${etfA.ticker}가 초기 배당률과 배당성장률 모두 ${etfB.ticker}보다 우세하여 15년 내내 배당금 우위를 유지합니다.`;
  } else if (initialWinner === 'B' && growthB >= growthA) {
    crossoverSummaryText = `👑 ${etfB.ticker}가 초기 배당률과 배당성장률 모두 ${etfA.ticker}보다 우세하여 15년 내내 배당금 우위를 유지합니다.`;
  } else {
    crossoverSummaryText = `⏳ 두 종목의 배당률 격차가 커서 15년 이내에는 역전이 발생하지 않으며, 각각 인컴 중심과 성장 중심으로 차별화됩니다.`;
  }

  return {
    etfA,
    etfB,
    initialCapitalUSD,
    initialCapitalKRW,
    exchangeRate,
    initialAnnualNetUSD_A,
    initialAnnualNetUSD_B,
    initialMonthlyNetKRW_A,
    initialMonthlyNetKRW_B,
    crossoverYear,
    crossoverOvertaker,
    crossoverSummaryText,
    yearlyProjections,
  };
}
