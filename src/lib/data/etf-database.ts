/**
 * 미국 대표 배당 & 지수 ETF/주식 17종 마스터 데이터베이스
 * 
 * 카테고리 구성:
 * 1) 배당성장: SCHD, DGRO, VIG
 * 2) 월배당/커버드콜: JEPI, JEPQ, SPYI, DIVO
 * 3) 시장지수/성장: VOO, QQQ, DIA
 * 4) 고배당/배당귀족: NOBL, VYM, HDV
 * 5) 월배당 리츠/채권/인컴: O (리얼티인컴), TLT, MAIN, BST
 */

export type ETFCategory =
  | '배당성장'
  | '월배당 커버드콜'
  | '시장지수'
  | '고배당/배당귀족'
  | '월배당 리츠/채권';

export interface ETFMasterData {
  ticker: string;
  name: string; // 영문 공식명
  nameKo: string; // 한글 친화명
  category: ETFCategory;
  currentPrice: number; // USD ($)
  dividendYield: number; // 시가배당률 (예: 0.0348 = 3.48%)
  frequency: 'monthly' | 'quarterly';
  frequencyLabel: '월배당' | '분기배당';
  payMonths: number[]; // 배당 지급 월 목록
  payMonthsLabel: string; // 지급 시기 라벨 (예: "매월 초", "3, 6, 9, 12월 말")
  dividendGrowth5y: number; // 5년 연평균 배당성장률 (CAGR)
  expenseRatio: number; // 연간 운용보수 (0.0006 = 0.06%)
  fiveYearReturn: number; // 5년 주가 수익률 (0.564 = 56.4%)
  prosConsSummary: {
    pros: string; // 핵심 강점 1줄
    cons: string; // 핵심 주의점 1줄
  };
  description: string; // 종목 설명 요약
  targetAudience: string; // 추천 투자자 성향
}

export const ETF_DATABASE: Record<string, ETFMasterData> = {
  // 1. 배당성장
  SCHD: {
    ticker: 'SCHD',
    name: 'Schwab U.S. Dividend Equity ETF',
    nameKo: '슈왑 미국 배당 다우존스',
    category: '배당성장',
    currentPrice: 82.50,
    dividendYield: 0.0348, // 3.48%
    frequency: 'quarterly',
    frequencyLabel: '분기배당',
    payMonths: [3, 6, 9, 12],
    payMonthsLabel: '3, 6, 9, 12월 말',
    dividendGrowth5y: 0.0892, // 8.92%
    expenseRatio: 0.0006, // 0.06%
    fiveYearReturn: 0.564, // 56.4%
    prosConsSummary: {
      pros: '연평균 약 9%의 강력한 배당성장과 0.06%의 초저보수로 10년 이상 장기 복리 극대화',
      cons: '분기배당이라 매달 고정 생활비 인출에는 현금흐름 굴곡이 있고 초기 배당률(3.5%)은 평이함',
    },
    description: '10년 연속 배당 증액 기업 중 현금흐름과 ROE가 우수한 우량주만 엄선한 배당성장의 대명사',
    targetAudience: '10년 이상 장기 적립식으로 미래의 배당 눈덩이를 굴리고 싶은 3040 투자자',
  },
  DGRO: {
    ticker: 'DGRO',
    name: 'iShares Core Dividend Growth ETF',
    nameKo: '아이셰어즈 코어 배당성장 ETF',
    category: '배당성장',
    currentPrice: 62.10,
    dividendYield: 0.0225, // 2.25%
    frequency: 'quarterly',
    frequencyLabel: '분기배당',
    payMonths: [3, 6, 9, 12],
    payMonthsLabel: '3, 6, 9, 12월 말',
    dividendGrowth5y: 0.0945, // 9.45%
    expenseRatio: 0.0008, // 0.08%
    fiveYearReturn: 0.628, // 62.8%
    prosConsSummary: {
      pros: '배당성향 75% 이하 기업 중 5년 증액 기업을 선별하며 애플·MS 등 빅테크 성장성도 공유',
      cons: '시가배당률이 2.2%대로 초기 현금 수령액이 낮아 인컴보다 자본성장 중심',
    },
    description: '배당 지속가능성이 높은 기업에 투자하며, 성장주와 배당주의 장점을 절충한 ETF',
    targetAudience: '주가 상승 차익과 배당 증액 두 마리 토끼를 잡고 싶은 적극적 성장형 투자자',
  },
  VIG: {
    ticker: 'VIG',
    name: 'Vanguard Dividend Appreciation ETF',
    nameKo: '뱅가드 배당 증액 ETF',
    category: '배당성장',
    currentPrice: 198.50,
    dividendYield: 0.0175, // 1.75%
    frequency: 'quarterly',
    frequencyLabel: '분기배당',
    payMonths: [3, 6, 9, 12],
    payMonthsLabel: '3, 6, 9, 12월 말',
    dividendGrowth5y: 0.0880, // 8.80%
    expenseRatio: 0.0006, // 0.06%
    fiveYearReturn: 0.682, // 68.2%
    prosConsSummary: {
      pros: '10년 연속 배당 인상 대형 우량주 위주로 하락장 방어력이 탁월하고 0.06% 최저 수수료',
      cons: '1.7%대 낮은 배당수익률로 인해 당장의 현금 인출용으로는 부적합',
    },
    description: '뱅가드의 대표 배당 ETF로, 탄탄한 펀더멘털을 갖춘 미국 초대형 우량주로만 구성',
    targetAudience: '시장 평균보다 안전하게 하락장을 방어하며 우상향 성장을 누리고 싶은 보수적 투자자',
  },

  // 2. 월배당 / 커버드콜
  JEPI: {
    ticker: 'JEPI',
    name: 'JPMorgan Equity Premium Income ETF',
    nameKo: 'JP모건 에쿼티 프리미엄 인컴 ETF',
    category: '월배당 커버드콜',
    currentPrice: 57.80,
    dividendYield: 0.0742, // 7.42%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    payMonthsLabel: '매월 1~5일 전후',
    dividendGrowth5y: 0.0450, // 4.50%
    expenseRatio: 0.0035, // 0.35%
    fiveYearReturn: 0.382, // 38.2%
    prosConsSummary: {
      pros: '연 7~8% 수준의 풍부한 월배당으로 매달 확실한 제2의 월급을 즉각 창출',
      cons: '커버드콜 옵션 구조상 나스닥/S&P500 급등장에서 주가 상승 상단이 닫혀 있음',
    },
    description: 'S&P 500 저변동 가치주와 주가연계사채(ELN) 콜옵션 매도 프리미엄으로 높은 월 인컴을 지급',
    targetAudience: '당장 이번 달부터 생활비나 고정 지출을 충당해야 하는 조기 은퇴 및 파이어족',
  },
  JEPQ: {
    ticker: 'JEPQ',
    name: 'JPMorgan Nasdaq Equity Premium Income ETF',
    nameKo: 'JP모건 나스닥 에쿼티 프리미엄 인컴 ETF',
    category: '월배당 커버드콜',
    currentPrice: 55.20,
    dividendYield: 0.0920, // 9.20%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    payMonthsLabel: '매월 1~5일 전후',
    dividendGrowth5y: 0.0620, // 6.20%
    expenseRatio: 0.0035, // 0.35%
    fiveYearReturn: 0.445, // 44.5%
    prosConsSummary: {
      pros: '연 9~10% 수준의 압도적 초고배당과 나스닥 100 혁신 기업 주가 상승의 일부 향유',
      cons: '기술주 비중이 높아 나스닥 하락기에는 JEPI보다 원금 평가손실 폭이 커질 수 있음',
    },
    description: '나스닥 100 지수를 기초로 커버드콜 전략을 구사하여 고수익 월배당을 추구하는 ETF',
    targetAudience: '기술주에 투자하면서 9%가 넘는 극대화된 월 현금흐름을 동시에 원하는 인컴 투자자',
  },
  SPYI: {
    ticker: 'SPYI',
    name: 'NEOS S&P 500 High Income ETF',
    nameKo: '네오스 S&P 500 하이 인컴 ETF',
    category: '월배당 커버드콜',
    currentPrice: 50.40,
    dividendYield: 0.1180, // 11.80%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    payMonthsLabel: '매월 말일경',
    dividendGrowth5y: 0.0520, // 5.20%
    expenseRatio: 0.0068, // 0.68%
    fiveYearReturn: 0.410, // 41.0%
    prosConsSummary: {
      pros: '11~12%에 달하는 초고배당과 콜옵션 스프레드 매매를 통해 일반 커버드콜보다 주가 상승 참여폭 확대',
      cons: '운용보수(0.68%)가 다소 높고 운용 이력이 타 ETF 대비 비교적 짧음',
    },
    description: 'S&P 500 지수 옵션과 세제 최적화 전략(Section 1256 계약)을 활용한 차세대 고배당 ETF',
    targetAudience: '연 10% 이상의 극대화된 현금흐름과 주가 상승 여력을 함께 노리는 고인컴 선호자',
  },
  DIVO: {
    ticker: 'DIVO',
    name: 'Amplify C-PACE ETF',
    nameKo: '앰플리파이 C-PACE ETF',
    category: '월배당 커버드콜',
    currentPrice: 40.50,
    dividendYield: 0.0465, // 4.65%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    payMonthsLabel: '매월 말일경',
    dividendGrowth5y: 0.0480, // 4.80%
    expenseRatio: 0.0055, // 0.55%
    fiveYearReturn: 0.483, // 48.3%
    prosConsSummary: {
      pros: '기계적 전량 옵션 매도가 아닌 선별적 옵션 매도로 우량 대형 배당주의 주가 상승을 상당 부분 보존',
      cons: '운용보수가 0.55%로 높은 편이며, JEPI보다는 배당률이 낮고 SCHD보다는 주가 성장이 낮음',
    },
    description: '배당성장주 포트폴리오에 전술적 커버드콜을 더해 연 4.5~5% 안정 월배당을 제공하는 하이브리드 ETF',
    targetAudience: 'SCHD의 분기배당과 JEPI의 주가 억압 사이에서 균형점을 찾고 싶은 밸런스형 투자자',
  },

  // 3. 시장지수 / 성장
  VOO: {
    ticker: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    nameKo: '뱅가드 S&P 500 ETF',
    category: '시장지수',
    currentPrice: 535.00,
    dividendYield: 0.0132, // 1.32%
    frequency: 'quarterly',
    frequencyLabel: '분기배당',
    payMonths: [3, 6, 9, 12],
    payMonthsLabel: '3, 6, 9, 12월 말',
    dividendGrowth5y: 0.0580, // 5.80%
    expenseRatio: 0.0003, // 0.03%
    fiveYearReturn: 0.986, // 98.6%
    prosConsSummary: {
      pros: '5년 주가 수익률 약 98%로 미국 자본주의 성장을 가장 확실하게 누리는 0.03% 최저보수 국민 ETF',
      cons: '배당률이 1.3%대로 낮아 배당금만으로 생활비를 충당하려면 수십억 원의 자본금이 필요',
    },
    description: '미국을 대표하는 500대 우량 기업에 분산 투자하는 워런 버핏의 평생 추천 ETF',
    targetAudience: '현금 인출보다 장기 자산의 원금 덩어리를 가장 안전하고 빠르게 불리고 싶은 투자자',
  },
  QQQ: {
    ticker: 'QQQ',
    name: 'Invesco QQQ Trust',
    nameKo: '인베스코 QQQ 트러스트',
    category: '시장지수',
    currentPrice: 490.00,
    dividendYield: 0.0055, // 0.55%
    frequency: 'quarterly',
    frequencyLabel: '분기배당',
    payMonths: [4, 7, 10, 12],
    payMonthsLabel: '4, 7, 10, 12월 말',
    dividendGrowth5y: 0.0740, // 7.40%
    expenseRatio: 0.0020, // 0.20%
    fiveYearReturn: 1.452, // 145.2%
    prosConsSummary: {
      pros: '5년 수익률 145%로 압도적인 자본 성장과 글로벌 AI 및 빅테크 산업 주도권 수혜',
      cons: '시가배당률이 0.5% 수준으로 배당 현금흐름 수령 목적에는 전혀 맞지 않음',
    },
    description: '나스닥 100 지수를 추종하며 애플, 마이크로소프트, 엔비디아 등 혁신 기술주에 집중 투자',
    targetAudience: '배당금보다는 원금의 폭발적인 시세 차익을 최우선 목표로 삼는 성장주 투자자',
  },
  DIA: {
    ticker: 'DIA',
    name: 'SPDR Dow Jones Industrial Average ETF',
    nameKo: 'SPDR 다우 존스 산업평균 ETF',
    category: '시장지수',
    currentPrice: 432.00,
    dividendYield: 0.0168, // 1.68%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    payMonthsLabel: '매월 중순 (15~20일)',
    dividendGrowth5y: 0.0610, // 6.10%
    expenseRatio: 0.0016, // 0.16%
    fiveYearReturn: 0.624, // 62.4%
    prosConsSummary: {
      pros: '미국 30대 전통 우량 기업(다우 지수)의 신뢰성과 시장 지수 ETF 중 드물게 매월 배당 지급',
      cons: '30개 종목에 불과하고 주가 가중 방식이라 특정 고가 주식의 영향력이 지나치게 큼',
    },
    description: '100년 역사의 다우존스 산업평균 지수를 추종하며, 매달 월급처럼 배당을 주는 지수 ETF',
    targetAudience: '미국 1등 대표 기업들에 투자하면서 월배당 현금흐름의 규칙성을 선호하는 투자자',
  },

  // 4. 고배당 / 배당귀족
  NOBL: {
    ticker: 'NOBL',
    name: 'ProShares S&P 500 Dividend Aristocrats ETF',
    nameKo: '프로셰어즈 S&P 500 배당귀족 ETF',
    category: '고배당/배당귀족',
    currentPrice: 98.40,
    dividendYield: 0.0210, // 2.10%
    frequency: 'quarterly',
    frequencyLabel: '분기배당',
    payMonths: [3, 6, 9, 12],
    payMonthsLabel: '3, 6, 9, 12월 말',
    dividendGrowth5y: 0.0720, // 7.20%
    expenseRatio: 0.0035, // 0.35%
    fiveYearReturn: 0.465, // 46.5%
    prosConsSummary: {
      pros: '25년 이상 매년 배당금을 늘려온 진짜 검증된 배당귀족 67개 기업에 동일가중 분산 투자',
      cons: '동일가중 구조라 시가총액 상위 빅테크 랠리 국면에서는 S&P 500 대비 상승률이 뒤처짐',
    },
    description: '오일쇼크, 닷컴버블, 리먼사태를 모두 버텨내고 배당을 늘린 기업들만 모은 배당귀족 ETF',
    targetAudience: '기업의 절대적 영속성과 불황 속에서도 배당이 깎이지 않을 안전성을 바라는 보수형 투자자',
  },
  VYM: {
    ticker: 'VYM',
    name: 'Vanguard High Dividend Yield ETF',
    nameKo: '뱅가드 고배당 수익률 ETF',
    category: '고배당/배당귀족',
    currentPrice: 131.20,
    dividendYield: 0.0285, // 2.85%
    frequency: 'quarterly',
    frequencyLabel: '분기배당',
    payMonths: [3, 6, 9, 12],
    payMonthsLabel: '3, 6, 9, 12월 말',
    dividendGrowth5y: 0.0630, // 6.30%
    expenseRatio: 0.0006, // 0.06%
    fiveYearReturn: 0.542, // 54.2%
    prosConsSummary: {
      pros: '400개 이상 대형 고배당주에 초분산 투자되어 개별 종목 악재가 없고 0.06% 초저보수',
      cons: '시가배당률이 2.8%대로 고배당이라는 명칭 대비 초기 인컴 체감은 크지 않음',
    },
    description: '미국 시장 평균치 이상의 배당을 지급하는 대형 가치주 전반을 편안하게 담아내는 뱅가드 ETF',
    targetAudience: '개별 종목 리스크를 극도로 싫어하고 안정적인 대형 가치주 위주로 모아가려는 투자자',
  },
  HDV: {
    ticker: 'HDV',
    name: 'iShares Core High Dividend ETF',
    nameKo: '아이셰어즈 코어 고배당 ETF',
    category: '고배당/배당귀족',
    currentPrice: 114.50,
    dividendYield: 0.0345, // 3.45%
    frequency: 'quarterly',
    frequencyLabel: '분기배당',
    payMonths: [3, 6, 9, 12],
    payMonthsLabel: '3, 6, 9, 12월 말',
    dividendGrowth5y: 0.0540, // 5.40%
    expenseRatio: 0.0008, // 0.08%
    fiveYearReturn: 0.458, // 45.8%
    prosConsSummary: {
      pros: '모닝스타 경제적 해자(Moat)와 재무건전성 스크리닝을 거친 75개 우량 고배당주 집중 보유',
      cons: '에너지, 헬스케어, 통신 등 특정 전통 산업 섹터 편중도가 높아 섹터 업황 영향을 받음',
    },
    description: '재무구조가 탄탄하고 현금창출력이 우수한 75개 핵심 고배당 기업을 선별하여 편입',
    targetAudience: '3% 중반대의 견조한 배당률과 기업 재무 안전성을 동시에 챙기고 싶은 가치주 투자자',
  },

  // 5. 월배당 리츠 / 채권 / 인컴
  O: {
    ticker: 'O',
    name: 'Realty Income Corporation',
    nameKo: '리얼티 인컴 (월배당 리츠)',
    category: '월배당 리츠/채권',
    currentPrice: 53.80,
    dividendYield: 0.0585, // 5.85%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    payMonthsLabel: '매월 15일경',
    dividendGrowth5y: 0.0360, // 3.60%
    expenseRatio: 0.0000, // 개별주식 수수료 0
    fiveYearReturn: 0.185, // 18.5%
    prosConsSummary: {
      pros: '30년 연속 매달 배당을 지급 및 인상해 온 글로벌 1위 상업용 부동산 리츠의 확실한 5.8% 월배당',
      cons: '고금리 국면에서 차입 조달 비용이 증가하고 부동산 공실률 위험이 주가 발목을 잡을 수 있음',
    },
    description: '세븐일레븐, 월마트, 페덱스 등 초우량 임차인에게 임대료를 받아 매달 주주에게 배당하는 부동산 월배당주',
    targetAudience: '부동산 임대수익처럼 매월 15일 꼬박꼬박 통장에 꽂히는 안정적 월세를 원하는 투자자',
  },
  TLT: {
    ticker: 'TLT',
    name: 'iShares 20+ Year Treasury Bond ETF',
    nameKo: '아이셰어즈 20년 이상 미국채 ETF',
    category: '월배당 리츠/채권',
    currentPrice: 91.50,
    dividendYield: 0.0410, // 4.10%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    payMonthsLabel: '매월 초 (1~7일)',
    dividendGrowth5y: 0.0210, // 2.10%
    expenseRatio: 0.0015, // 0.15%
    fiveYearReturn: -0.285, // -28.5%
    prosConsSummary: {
      pros: '미국 재무부가 보증하는 국가 부도 제로 안전성과 향후 기준금리 인하 시 강력한 채권 가격 차익 기대',
      cons: '듀레이션이 약 17년으로 길어 인플레이션 재발이나 금리 급등 시 주가 변동성이 매우 큼',
    },
    description: '만기 20년 이상의 미국 초장기 국채에 투자하여 안정적인 월이자 인컴을 제공하는 대표 채권 ETF',
    targetAudience: '주식 폭락에 대비한 든든한 안전자산 헷지와 금리 인하 사이클 시세 차익을 노리는 자산배분가',
  },
  MAIN: {
    ticker: 'MAIN',
    name: 'Main Street Capital',
    nameKo: '메인 스트리트 캐피탈 (월배당 BDC)',
    category: '월배당 리츠/채권',
    currentPrice: 51.20,
    dividendYield: 0.0675, // 6.75%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    payMonthsLabel: '매월 15일경',
    dividendGrowth5y: 0.0510, // 5.10%
    expenseRatio: 0.0000,
    fiveYearReturn: 0.723, // 72.3%
    prosConsSummary: {
      pros: '연 6.7% 정기 월배당 외에도 분기별 비정기 특별배당을 꾸준히 얹어주는 BDC 업계 독보적 1위',
      cons: '미국 중소기업 대상 사모 대출 및 지분 투자 구조상 심각한 경기 침체 시 대출 부실 우려 존재',
    },
    description: '탄탄한 내부 운용 구조를 갖춘 비즈니스 개발 회사(BDC)로 높은 배당 수익률과 자본 성장을 증명',
    targetAudience: '월배당과 보너스 특별배당의 짜릿함을 동시에 누리고 싶은 스마트 인컴 투자자',
  },
  BST: {
    ticker: 'BST',
    name: 'BlackRock Science and Technology Trust',
    nameKo: '블랙록 사이언스 & 테크놀로지 트러스트',
    category: '월배당 커버드콜',
    currentPrice: 35.80,
    dividendYield: 0.0830, // 8.30%
    frequency: 'monthly',
    frequencyLabel: '월배당',
    payMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    payMonthsLabel: '매월 말일경',
    dividendGrowth5y: 0.0420, // 4.20%
    expenseRatio: 0.0100, // 1.00%
    fiveYearReturn: 0.368, // 36.8%
    prosConsSummary: {
      pros: '글로벌 과학기술 혁신주의 주가 상승 수혜와 커버드콜 옵션 매도를 통한 연 8.3% 월인컴',
      cons: '폐쇄형 펀드(CEF) 특성상 순자산가치(NAV) 대비 괴리율이 존재하고 1% 수준의 운용보수',
    },
    description: '블랙록이 운용하는 테크 특화 폐쇄형 펀드로, 나스닥 우량주 투자와 고배당 월지급을 결합',
    targetAudience: '빅테크 기업의 장기 성장 잠재력을 믿으면서도 8%대 높은 월배당을 즉시 회수하고 싶은 투자자',
  },
};

/**
 * 카테고리 필터 목록
 */
export const ETF_CATEGORIES: { id: string; label: string }[] = [
  { id: 'ALL', label: '전체 (17종)' },
  { id: '배당성장', label: '🌱 배당성장' },
  { id: '월배당 커버드콜', label: '💰 월배당 커버드콜' },
  { id: '시장지수', label: '📈 시장지수/성장' },
  { id: '고배당/배당귀족', label: '👑 고배당/배당귀족' },
  { id: '월배당 리츠/채권', label: '🏢 리츠/채권/인컴' },
];
