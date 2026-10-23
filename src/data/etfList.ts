/**
 * 20개 대표 미국 배당 & 지수 ETF/주식 데이터베이스
 * 경로: src/data/etfList.ts
 */

export type ETFCategory =
  | '전체'
  | '배당성장'
  | '월배당·커버드콜'
  | '시장지수'
  | '고배당/배당귀족'
  | '리츠·채권';

export interface ETFItem {
  ticker: string;
  name: string; // 한글/영문 병기 친화명
  nameEn: string;
  category: '배당성장' | '월배당·커버드콜' | '시장지수' | '고배당/배당귀족' | '리츠·채권';
  currentPriceUSD: number; // USD ($)
  currentPrice: number; // 호환용 alias
  dividendYield: number; // 시가배당률 (예: 0.0348 = 3.48%)
  payoutCycle: '월배당' | '분기배당';
  frequencyLabel: '월배당' | '분기배당'; // 호환용 alias
  fiveYearGrowth: number; // 5년 연평균 배당성장률 (0.0892 = 8.92%)
  summary: string; // 핵심 요약
  description?: string;
  expenseRatio?: number; // 연간 운용보수
  prosConsSummary?: {
    pros: string;
    cons: string;
  };
}

const rawList: Omit<ETFItem, 'currentPrice' | 'frequencyLabel'>[] = [
  // 1. 배당성장 (3종)
  {
    ticker: 'SCHD',
    name: '슈왑 미국 배당 다우존스 (Schwab U.S. Dividend Equity)',
    nameEn: 'Schwab U.S. Dividend Equity ETF',
    category: '배당성장',
    currentPriceUSD: 82.50,
    dividendYield: 0.0348, // 3.48%
    payoutCycle: '분기배당',
    fiveYearGrowth: 0.0892, // 8.92%
    summary: '10년 연속 배당 증액 기업 선별, 연평균 9%대의 강력한 배당성장을 자랑하는 배당성장의 제왕',
    expenseRatio: 0.0006,
    prosConsSummary: {
      pros: '연평균 약 9%의 강력한 배당성장과 초저보수(0.06%)로 10년 이상 장기 복리 극대화',
      cons: '분기배당이라 매달 고정 생활비 인출에는 현금흐름 굴곡이 있음',
    },
  },
  {
    ticker: 'DGRO',
    name: '아이셰어즈 코어 배당성장 (iShares Core Dividend Growth)',
    nameEn: 'iShares Core Dividend Growth ETF',
    category: '배당성장',
    currentPriceUSD: 62.10,
    dividendYield: 0.0225, // 2.25%
    payoutCycle: '분기배당',
    fiveYearGrowth: 0.0945, // 9.45%
    summary: '배당성향 75% 이하 기업 중 5년 증액 기업을 선별하며 애플·MS 등 빅테크 성장성도 공유',
    expenseRatio: 0.0008,
    prosConsSummary: {
      pros: '배당 지속가능성이 높은 기업에 투자하며, 성장주와 배당주의 장점을 절충',
      cons: '시가배당률이 2.2%대로 초기 현금 수령액이 낮음',
    },
  },
  {
    ticker: 'VIG',
    name: '뱅가드 배당 증액 (Vanguard Dividend Appreciation)',
    nameEn: 'Vanguard Dividend Appreciation ETF',
    category: '배당성장',
    currentPriceUSD: 198.50,
    dividendYield: 0.0175, // 1.75%
    payoutCycle: '분기배당',
    fiveYearGrowth: 0.0880, // 8.80%
    summary: '10년 연속 배당 인상 대형 우량주 위주로 하락장 방어력이 탁월한 뱅가드 대표 ETF',
    expenseRatio: 0.0006,
    prosConsSummary: {
      pros: '하락장 방어력이 탁월하고 0.06% 최저 수수료',
      cons: '현재 배당률이 1.7% 수준으로 인컴 목적에는 부족함',
    },
  },

  // 2. 월배당 커버드콜 (4종 + DIVO = 5종)
  {
    ticker: 'JEPI',
    name: 'JP모건 에쿼티 프리미엄 인컴 (JPMorgan Equity Premium Income)',
    nameEn: 'JPMorgan Equity Premium Income ETF',
    category: '월배당·커버드콜',
    currentPriceUSD: 57.80,
    dividendYield: 0.0742, // 7.42%
    payoutCycle: '월배당',
    fiveYearGrowth: 0.0210, // 2.10%
    summary: 'S&P 500 가치주 기반 ELN 옵션 매도로 매월 연 7~8%대 풍부한 월급형 현금흐름 지급',
    expenseRatio: 0.0035,
    prosConsSummary: {
      pros: '매월 초 안정적인 고배당 인컴으로 즉각적인 생활비 해결',
      cons: '상승장에서 주가 상승폭이 제한되는 커버드콜의 한계',
    },
  },
  {
    ticker: 'JEPQ',
    name: 'JP모건 나스닥 에쿼티 프리미엄 (JPMorgan Nasdaq Equity Premium)',
    nameEn: 'JPMorgan Nasdaq Equity Premium Income ETF',
    category: '월배당·커버드콜',
    currentPriceUSD: 55.60,
    dividendYield: 0.0915, // 9.15%
    payoutCycle: '월배당',
    fiveYearGrowth: 0.0350, // 3.50%
    summary: '나스닥 대형 기술주 성장과 연 9%대 초고배당 월인컴을 동시에 추구하는 하이브리드',
    expenseRatio: 0.0035,
    prosConsSummary: {
      pros: '나스닥 빅테크의 성장성과 연 9%대 초고배당의 완벽한 조화',
      cons: '기술주 조정장에서 JEPI 대비 변동성이 큼',
    },
  },
  {
    ticker: 'SPYI',
    name: '네오스 S&P 500 하이 인컴 (NEOS S&P 500 High Income)',
    nameEn: 'NEOS S&P 500 High Income ETF',
    category: '월배당·커버드콜',
    currentPriceUSD: 50.40,
    dividendYield: 0.1180, // 11.80%
    payoutCycle: '월배당',
    fiveYearGrowth: 0.0420, // 4.20%
    summary: '콜옵션 스프레드 매도와 세금 효율화(Section 1256)를 적용한 연 11%대 월배당 ETF',
    expenseRatio: 0.0068,
    prosConsSummary: {
      pros: '상승장 참여율을 높인 액티브 옵션 스프레드 설계',
      cons: '연 0.68%로 다소 높은 수수료',
    },
  },
  {
    ticker: 'QQQI',
    name: '네오스 나스닥 100 하이 인컴 (NEOS Nasdaq 100 High Income)',
    nameEn: 'NEOS Nasdaq 100 High Income ETF',
    category: '월배당·커버드콜',
    currentPriceUSD: 52.80,
    dividendYield: 0.1350, // 13.50%
    payoutCycle: '월배당',
    fiveYearGrowth: 0.0480, // 4.80%
    summary: '나스닥 100 지수에 옵션 스프레드를 결합하여 연 13~14%대 최고 수준 월인컴 창출',
    expenseRatio: 0.0068,
    prosConsSummary: {
      pros: '극대화된 월배당 현금흐름으로 현금 회수 속도가 가장 빠름',
      cons: '나스닥 하락장에서 원금 방어 주의 필요',
    },
  },
  {
    ticker: 'DIVO',
    name: '앰플리파이 C-PACE 인컴 (Amplify C-PACE ETF)',
    nameEn: 'Amplify C-PACE ETF',
    category: '월배당·커버드콜',
    currentPriceUSD: 41.20,
    dividendYield: 0.0465, // 4.65%
    payoutCycle: '월배당',
    fiveYearGrowth: 0.0520, // 5.20%
    summary: '우량 배당성장주 포트폴리오에 개별 종목 콜옵션을 선별 매도하여 주가 상승과 배당 절충',
    expenseRatio: 0.0055,
    prosConsSummary: {
      pros: '기계적 매도가 아닌 전술적 옵션 매도로 주가 상승력 보존',
      cons: '시가배당률이 4.6% 수준으로 다른 커버드콜보다는 낮음',
    },
  },

  // 3. 시장지수 / 성장 (4종)
  {
    ticker: 'VOO',
    name: '뱅가드 S&P 500 ETF (Vanguard S&P 500)',
    nameEn: 'Vanguard S&P 500 ETF',
    category: '시장지수',
    currentPriceUSD: 535.40,
    dividendYield: 0.0145, // 1.45%
    payoutCycle: '분기배당',
    fiveYearGrowth: 0.0575, // 5.75%
    summary: '미국 500대 대표 우량기업 전체를 최저 보수(0.03%)로 보유하는 워런 버핏 추천 1순위 지수',
    expenseRatio: 0.0003,
    prosConsSummary: {
      pros: '미국 경제 전체의 역사적 우상향과 0.03%의 최저 수수료',
      cons: '배당률이 1.4%대로 현금흐름보다는 자본성장 중심',
    },
  },
  {
    ticker: 'QQQ',
    name: '인베스코 나스닥 100 (Invesco QQQ Trust)',
    nameEn: 'Invesco QQQ Trust',
    category: '시장지수',
    currentPriceUSD: 495.20,
    dividendYield: 0.0058, // 0.58%
    payoutCycle: '분기배당',
    fiveYearGrowth: 0.1020, // 10.20%
    summary: '애플, 마이크로소프트, 엔비디아 등 글로벌 혁신 기술주 100개 집중 투자로 자본차익 극대화',
    expenseRatio: 0.0020,
    prosConsSummary: {
      pros: '빅테크 주도 시세차익으로 장기 자산 증식 속도 1위',
      cons: '배당수익률이 0.5%대로 배당 목적 투자로는 부적합',
    },
  },
  {
    ticker: 'DIA',
    name: 'SPDR 다우 존스 산업평균 (SPDR Dow Jones Industrial Average)',
    nameEn: 'SPDR Dow Jones Industrial Average ETF',
    category: '시장지수',
    currentPriceUSD: 432.10,
    dividendYield: 0.0175, // 1.75%
    payoutCycle: '월배당',
    fiveYearGrowth: 0.0610, // 6.10%
    summary: '미국을 대표하는 30대 핵심 초우량 전통 블루칩 기업에 분산 투자하며 월배당 지급',
    expenseRatio: 0.0016,
    prosConsSummary: {
      pros: '미국 대표 30대 우량주를 기반으로 한 안정적인 월배당',
      cons: '가격 가중 방식의 지수 산출로 종목 왜곡 가능성',
    },
  },
  {
    ticker: 'SCHG',
    name: '슈왑 미국 대형 성장주 (Schwab U.S. Large-Cap Growth)',
    nameEn: 'Schwab U.S. Large-Cap Growth ETF',
    category: '시장지수',
    currentPriceUSD: 104.50,
    dividendYield: 0.0042, // 0.42%
    payoutCycle: '분기배당',
    fiveYearGrowth: 0.0980, // 9.80%
    summary: '0.04% 초저보수로 미국 최고 실적의 대형 성장 기업 200여 개에 분산 투자',
    expenseRatio: 0.0004,
    prosConsSummary: {
      pros: 'QQQ보다 저렴한 0.04% 초저보수로 미국 빅테크 성장 공유',
      cons: '배당률이 미미하여 인컴 목적에는 부적합',
    },
  },

  // 4. 고배당 / 배당귀족 (3종)
  {
    ticker: 'NOBL',
    name: '프로셰어즈 S&P 500 배당귀족 (ProShares Dividend Aristocrats)',
    nameEn: 'ProShares S&P 500 Dividend Aristocrats ETF',
    category: '고배당/배당귀족',
    currentPriceUSD: 101.80,
    dividendYield: 0.0210, // 2.10%
    payoutCycle: '분기배당',
    fiveYearGrowth: 0.0680, // 6.80%
    summary: '25년 이상 연속 배당금을 늘려온 미국 최강의 배당귀족 기업만을 동일 가중으로 투자',
    expenseRatio: 0.0035,
    prosConsSummary: {
      pros: '25년 이상 연속 배당 증액 기업만 편입하여 경제위기 방어력 최고',
      cons: '성장주 비중이 낮아 강세장에서 시장 지수를 언더퍼폼할 수 있음',
    },
  },
  {
    ticker: 'VYM',
    name: '뱅가드 고배당 수익률 (Vanguard High Dividend Yield)',
    nameEn: 'Vanguard High Dividend Yield ETF',
    category: '고배당/배당귀족',
    currentPriceUSD: 128.40,
    dividendYield: 0.0285, // 2.85%
    payoutCycle: '분기배당',
    fiveYearGrowth: 0.0620, // 6.20%
    summary: '미국 고배당주 400여 개에 0.06% 최저 보수로 투자하여 안정적인 인컴과 경기 방어력 제공',
    expenseRatio: 0.0006,
    prosConsSummary: {
      pros: '400개 이상 종목에 초분산 투자되어 특정 기업 리스크가 없음',
      cons: '배당성장 속도가 SCHD 대비 다소 완만함',
    },
  },
  {
    ticker: 'HDV',
    name: '아이셰어즈 코어 고배당 (iShares Core High Dividend)',
    nameEn: 'iShares Core High Dividend ETF',
    category: '고배당/배당귀족',
    currentPriceUSD: 114.20,
    dividendYield: 0.0345, // 3.45%
    payoutCycle: '분기배당',
    fiveYearGrowth: 0.0480, // 4.80%
    summary: '재무 건전성이 우수한 미국 75개 고배당 기업 선별, 에너지와 헬스케어 비중 높은 방어주',
    expenseRatio: 0.0008,
    prosConsSummary: {
      pros: '모닝스타 경제적 해자(Moat)와 재무건전성 스크리닝 적용',
      cons: '에너지 및 통신 섹터 편중도가 높아 유가 변동에 민감',
    },
  },

  // 5. 월배당 리츠 / 채권 (5종)
  {
    ticker: 'O',
    name: '리얼티 인컴 (Realty Income Corporation)',
    nameEn: 'Realty Income Corporation',
    category: '리츠·채권',
    currentPriceUSD: 54.30,
    dividendYield: 0.0525, // 5.25%
    payoutCycle: '월배당',
    fiveYearGrowth: 0.0345, // 3.45%
    summary: '30년 연속 배당금을 늘려온 월배당 리츠의 대명사, 전 세계 월마트·세븐일레븐 건물주',
    expenseRatio: 0.0,
    prosConsSummary: {
      pros: '30년 연속 월배당 증액 역사, 98% 이상의 임대율로 입증된 안정성',
      cons: '고금리 장기화 시 부동산 조달금리 상승 부담',
    },
  },
  {
    ticker: 'VNQ',
    name: '뱅가드 부동산 리츠 ETF (Vanguard Real Estate)',
    nameEn: 'Vanguard Real Estate ETF',
    category: '리츠·채권',
    currentPriceUSD: 88.60,
    dividendYield: 0.0410, // 4.10%
    payoutCycle: '분기배당',
    fiveYearGrowth: 0.0380, // 3.80%
    summary: '미국 상장 상업용·주거용·데이터센터 리츠 전반에 분산 투자하는 대표 부동산 ETF',
    expenseRatio: 0.0013,
    prosConsSummary: {
      pros: '미국 부동산 시장 전체를 아우르는 대표 분산 리츠 ETF',
      cons: '경기 둔화 및 상업용 부동산 공실률 리스크에 노출',
    },
  },
  {
    ticker: 'TLT',
    name: '아이셰어즈 20년 이상 미국 국채 (iShares 20+ Year Treasury Bond)',
    nameEn: 'iShares 20+ Year Treasury Bond ETF',
    category: '리츠·채권',
    currentPriceUSD: 94.80,
    dividendYield: 0.0415, // 4.15%
    payoutCycle: '월배당',
    fiveYearGrowth: 0.0280, // 2.80%
    summary: '미국 장기 국채 월이자 수령 + 향후 금리 인하시 강력한 시세차익을 기대할 수 있는 안전자산',
    expenseRatio: 0.0015,
    prosConsSummary: {
      pros: '주식 폭락장에서 가장 확실한 헤지 수단이자 연 4%대 안전한 월이자',
      cons: '인플레이션 재반등 시 듀레이션(약 17년)으로 주가 변동성 큼',
    },
  },
  {
    ticker: 'SGOV',
    name: '아이셰어즈 0-3개월 초단기 국채 (iShares 0-3 Month Treasury Bond)',
    nameEn: 'iShares 0-3 Month Treasury Bond ETF',
    category: '리츠·채권',
    currentPriceUSD: 100.50,
    dividendYield: 0.0510, // 5.10%
    payoutCycle: '월배당',
    fiveYearGrowth: 0.0450, // 4.50%
    summary: '원금 손실 위험 없이 파킹통장처럼 연 5%대 안전한 달러 월이자를 챙기는 초단기 국채',
    expenseRatio: 0.0007,
    prosConsSummary: {
      pros: '주가 변동 거의 없이 연 5%대 확정 월이자를 지급하는 최고 안전자산',
      cons: '기준금리 인하시 배당수익률도 함께 하락',
    },
  },
  {
    ticker: 'MAIN',
    name: '메인 스트리트 캐피탈 (Main Street Capital BDC)',
    nameEn: 'Main Street Capital Corporation',
    category: '리츠·채권',
    currentPriceUSD: 51.40,
    dividendYield: 0.0680, // 6.80%
    payoutCycle: '월배당',
    fiveYearGrowth: 0.0580, // 5.80%
    summary: '미국 중소기업 지분 및 대출에 투자하여 연 6.8% 정기 월배당과 반기 특별배당을 지급하는 BDC',
    expenseRatio: 0.0,
    prosConsSummary: {
      pros: '정기 월배당 외에도 연 2회 추가 특별배당을 지급하는 뛰어난 현금흐름',
      cons: '중소기업 대출 중심이라 경기 침체 시 대손 위험 존재',
    },
  },
];

export const ETF_LIST: ETFItem[] = rawList.map((item) => ({
  ...item,
  currentPrice: item.currentPriceUSD,
  frequencyLabel: item.payoutCycle,
  description: item.summary,
}));

export const ETF_MAP: Record<string, ETFItem> = Object.fromEntries(
  ETF_LIST.map((item) => [item.ticker, item])
);
