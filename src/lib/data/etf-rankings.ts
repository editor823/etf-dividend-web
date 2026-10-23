/**
 * 서학개미(미국 직투) vs 동학개미(국내 상장 미국 ETF) 인기 순위 및 절세 매칭 데이터
 */

export interface SeohakETF {
  rank: number;
  ticker: string;
  nameKo: string;
  nameEn: string;
  category: '배당성장' | '월배당 커버드콜' | '시장지수' | '월배당 리츠/채권';
  yieldPercent: number; // e.g. 3.48 for 3.48%
  frequency: '월배당' | '분기배당';
  dividendGrowth5y?: number; // e.g. 8.92
  expenseRatio: number; // e.g. 0.06
  highlight: string;
  bestFor: string;
  matchedDonghak: {
    name: string;
    code: string;
    issuer: string;
    reason: string;
  }[];
}

export interface DonghakETF {
  rank: number;
  code: string; // 6자리 종목코드
  nameKo: string;
  issuer: string; // 미래에셋, 한국투자, 신한, 삼성 등
  category: '배당성장' | '커버드콜 프리미엄' | '시장지수' | '미국 채권';
  yieldPercent: number; // 연간 환산 배당률
  frequency: '월배당' | '분기배당';
  realTotalExpense: number; // 실질 총보수 (기타비용 포함 약 %)
  aum: string; // 순자산규모
  taxAccountEligible: {
    isa: boolean;
    pensionSavings: boolean;
    irp: boolean;
  };
  highlight: string;
  bestFor: string;
  matchedSeohak: {
    ticker: string;
    name: string;
    reason: string;
  };
}

export const SEOHAK_RANKING: SeohakETF[] = [
  {
    rank: 1,
    ticker: 'SCHD',
    nameKo: '슈왑 미국 배당 다우존스',
    nameEn: 'Schwab U.S. Dividend Equity ETF',
    category: '배당성장',
    yieldPercent: 3.48,
    frequency: '분기배당',
    dividendGrowth5y: 8.92,
    expenseRatio: 0.06,
    highlight: '국내 배당러들의 영원한 원픽, 10년 연속 배당 증액',
    bestFor: '10년 이상 장기 적립식으로 미래의 배당 눈덩이를 굴리고 싶은 분',
    matchedDonghak: [
      {
        name: 'TIGER 미국배당다우존스',
        code: '458730',
        issuer: '미래에셋',
        reason: '국내 상장 한국판 SCHD 중 최대 순자산(1조 원 돌파)과 풍부한 유동성',
      },
      {
        name: 'ACE 미국배당다우존스',
        code: '402970',
        issuer: '한국투자',
        reason: '업계 최저 수준 실질 보수 경쟁을 선도하는 정통 한국판 SCHD',
      },
      {
        name: 'SOL 미국배당다우존스',
        code: '446720',
        issuer: '신한자산',
        reason: '국내 최초로 월배당 시스템을 도입하여 매월 초 배당금을 지급하는 원조',
      },
    ],
  },
  {
    rank: 2,
    ticker: 'JEPI',
    nameKo: 'JP모건 에쿼티 프리미엄 인컴',
    nameEn: 'JPMorgan Equity Premium Income ETF',
    category: '월배당 커버드콜',
    yieldPercent: 7.42,
    frequency: '월배당',
    expenseRatio: 0.35,
    highlight: '매달 통장에 꽂히는 7%대 강력한 월급 배당의 대명사',
    bestFor: '지금 당장 매월 안정적인 생활비 인출이 필요한 은퇴자 및 파이어족',
    matchedDonghak: [
      {
        name: 'TIGER 미국배당+7%프리미엄다우존스',
        code: '458750',
        issuer: '미래에셋',
        reason: 'SCHD 주식에 커버드콜을 결합해 연 9~10% 수준의 월배당 인컴을 창출',
      },
    ],
  },
  {
    rank: 3,
    ticker: 'JEPQ',
    nameKo: 'JP모건 나스닥 에쿼티 프리미엄',
    nameEn: 'JPMorgan Nasdaq Equity Premium Income ETF',
    category: '월배당 커버드콜',
    yieldPercent: 9.15,
    frequency: '월배당',
    expenseRatio: 0.35,
    highlight: '나스닥 대형 기술주 성장과 연 9%대 초고배당의 하이브리드',
    bestFor: '기술주의 성장 매력과 높은 월배당을 동시에 누리고 싶은 분',
    matchedDonghak: [
      {
        name: 'TIGER 미국나스닥100+15%프리미엄초단기',
        code: '486290',
        issuer: '미래에셋',
        reason: '나스닥 기술주 포트폴리오 기반의 초단기 옵션 활용 고배당 월지급식',
      },
    ],
  },
  {
    rank: 4,
    ticker: 'VOO',
    nameKo: '뱅가드 S&P 500 ETF',
    nameEn: 'Vanguard S&P 500 ETF',
    category: '시장지수',
    yieldPercent: 1.45,
    frequency: '분기배당',
    dividendGrowth5y: 5.75,
    expenseRatio: 0.03,
    highlight: '워런 버핏이 유언장에 남긴 미국 500대 대표 우량기업 투자',
    bestFor: '종목 고민 없이 미국 전체 경제의 성장을 가장 안전하게 믿는 분',
    matchedDonghak: [
      {
        name: 'TIGER 미국S&P500',
        code: '360750',
        issuer: '미래에셋',
        reason: '국내 상장 해외 ETF 중 최대 거래량과 자산 규모를 자랑하는 대장주',
      },
      {
        name: 'ACE 미국S&P500',
        code: '360200',
        issuer: '한국투자',
        reason: '저렴한 총보수와 정밀한 지수 추종으로 연금 계좌 적립 1순위',
      },
    ],
  },
  {
    rank: 5,
    ticker: 'QQQ',
    nameKo: '인베스코 나스닥 100 ETF',
    nameEn: 'Invesco QQQ Trust',
    category: '시장지수',
    yieldPercent: 0.58,
    frequency: '분기배당',
    dividendGrowth5y: 10.2,
    expenseRatio: 0.20,
    highlight: '애플, 마이크로소프트, 엔비디아 등 혁신 기술주 100개 올인',
    bestFor: '배당보다는 주가 시세차익과 자본 성장을 극대화하고 싶은 젊은 투자자',
    matchedDonghak: [
      {
        name: 'TIGER 미국나스닥100',
        code: '133690',
        issuer: '미래에셋',
        reason: '국내 연금저축/IRP 계좌에서 나스닥 혁신기업을 모아갈 때 필수 종목',
      },
    ],
  },
  {
    rank: 6,
    ticker: 'O',
    nameKo: '리얼티 인컴 (부동산 리츠)',
    nameEn: 'Realty Income Corporation',
    category: '월배당 리츠/채권',
    yieldPercent: 5.25,
    frequency: '월배당',
    dividendGrowth5y: 3.45,
    expenseRatio: 0.0,
    highlight: '30년 연속 배당금을 늘려온 미국 대표 상업용 부동산 월배당',
    bestFor: '미국 전역 월마트·세븐일레븐 건물주가 되어 매달 월세를 받고 싶은 분',
    matchedDonghak: [
      {
        name: 'TIGER 미국다우존스30',
        code: '245340',
        issuer: '미래에셋',
        reason: '미국 핵심 우량주와 리츠 관련 섹터를 아우르는 안정형 인컴 수단',
      },
    ],
  },
  {
    rank: 7,
    ticker: 'TLT',
    nameKo: '아이셰어즈 20년 이상 미국 국채',
    nameEn: 'iShares 20+ Year Treasury Bond ETF',
    category: '월배당 리츠/채권',
    yieldPercent: 4.15,
    frequency: '월배당',
    expenseRatio: 0.15,
    highlight: '미국 장기 국채 월이자 수령 + 향후 금리 인하시 매매차익 기대',
    bestFor: '주식 시장 하락을 방어하고 금리 인하 사이클을 노리는 자산배분 투자자',
    matchedDonghak: [
      {
        name: 'ACE 미국30년국채액티브(H)',
        code: '453850',
        issuer: '한국투자',
        reason: '환율 변동을 헷지(H)하며 연 4%대 미국 장기국채 월배당을 원화로 수령',
      },
    ],
  },
];

export const DONGHAK_RANKING: DonghakETF[] = [
  {
    rank: 1,
    code: '458730',
    nameKo: 'TIGER 미국배당다우존스',
    issuer: '미래에셋자산운용',
    category: '배당성장',
    yieldPercent: 3.65,
    frequency: '월배당',
    realTotalExpense: 0.14,
    aum: '1조 2,400억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '국내 상장 한국판 SCHD의 절대강자, 압도적인 거래대금과 유동성',
    bestFor: 'ISA 및 연금저축 계좌에서 가장 안전하고 편하게 SCHD를 모아가실 분',
    matchedSeohak: {
      ticker: 'SCHD',
      name: 'Schwab U.S. Dividend Equity ETF',
      reason: '미국 다우존스 US Dividend 100 기초지수를 동일하게 추종하는 정통 한국판',
    },
  },
  {
    rank: 2,
    code: '402970',
    nameKo: 'ACE 미국배당다우존스',
    issuer: '한국투자신탁운용',
    category: '배당성장',
    yieldPercent: 3.62,
    frequency: '월배당',
    realTotalExpense: 0.12,
    aum: '6,800억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '국내 최저 수준 실질 보수 경쟁력과 정밀한 배당금 재투자 설계',
    bestFor: '수수료를 0.01%라도 아끼며 10년 이상 장기 적립식으로 모아가실 분',
    matchedSeohak: {
      ticker: 'SCHD',
      name: 'Schwab U.S. Dividend Equity ETF',
      reason: '기초지수와 배당성장 포트폴리오가 SCHD와 100% 동일하게 구성됨',
    },
  },
  {
    rank: 3,
    code: '446720',
    nameKo: 'SOL 미국배당다우존스',
    issuer: '신한자산운용',
    category: '배당성장',
    yieldPercent: 3.58,
    frequency: '월배당',
    realTotalExpense: 0.15,
    aum: '5,200억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '국내 최초로 월배당 시대를 연 원조 ETF, 매월 첫 영업일 배당 입금',
    bestFor: '매달 초에 정확히 월급처럼 배당금이 들어오는 현금흐름을 선호하시는 분',
    matchedSeohak: {
      ticker: 'SCHD',
      name: 'Schwab U.S. Dividend Equity ETF',
      reason: '분기배당인 SCHD를 국내 투자자 입맛에 맞게 월배당으로 전환한 원조',
    },
  },
  {
    rank: 4,
    code: '458750',
    nameKo: 'TIGER 미국배당+7%프리미엄다우존스',
    issuer: '미래에셋자산운용',
    category: '커버드콜 프리미엄',
    yieldPercent: 9.20,
    frequency: '월배당',
    realTotalExpense: 0.39,
    aum: '4,100억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: 'SCHD 배당성장 우량주 + 커버드콜 옵션 결합으로 연 9%대 초고배당',
    bestFor: 'SCHD의 안정성과 JEPI의 고배당을 국내 절세계좌에서 절충하고 싶은 분',
    matchedSeohak: {
      ticker: 'JEPI',
      name: 'JPMorgan Equity Premium Income ETF',
      reason: '고배당 월인컴을 창출하는 커버드콜 원리를 국내 배당다우존스에 접목',
    },
  },
  {
    rank: 5,
    code: '360750',
    nameKo: 'TIGER 미국S&P500',
    issuer: '미래에셋자산운용',
    category: '시장지수',
    yieldPercent: 1.35,
    frequency: '분기배당',
    realTotalExpense: 0.11,
    aum: '4조 8,000억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '국내 상장 해외주식형 ETF 중 순자산 1위, 한국인 국민 연금 펀드',
    bestFor: '모든 절세계좌(ISA/연금저축/IRP)의 든든한 1순위 베이스캠프',
    matchedSeohak: {
      ticker: 'VOO',
      name: 'Vanguard S&P 500 ETF',
      reason: 'S&P 500 500대 기업을 똑같이 추종하는 한국판 대표 상품',
    },
  },
  {
    rank: 6,
    code: '453850',
    nameKo: 'ACE 미국30년국채액티브(H)',
    issuer: '한국투자신탁운용',
    category: '미국 채권',
    yieldPercent: 4.25,
    frequency: '월배당',
    realTotalExpense: 0.22,
    aum: '1조 1,000억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '환헤지(H)로 환율 하락 위험 없이 미국 장기채 월이자만 따박따박 수령',
    bestFor: '주식 폭락에 대비하고 IRP 계좌 안전자산 30%를 채우고 싶은 분',
    matchedSeohak: {
      ticker: 'TLT',
      name: 'iShares 20+ Year Treasury Bond ETF',
      reason: '미국 20~30년 장기국채 현물에 투자하여 월배당을 주는 한국판 구조',
    },
  },
  {
    rank: 7,
    code: '133690',
    nameKo: 'TIGER 미국나스닥100',
    issuer: '미래에셋자산운용',
    category: '시장지수',
    yieldPercent: 0.45,
    frequency: '분기배당',
    realTotalExpense: 0.16,
    aum: '3조 5,000억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '빅테크 중심 나스닥 성장주를 연금계좌에서 모아가며 세금 0원 효과',
    bestFor: '복리 시세차익을 목표로 은퇴 자산을 폭발적으로 불리고 싶은 분',
    matchedSeohak: {
      ticker: 'QQQ',
      name: 'Invesco QQQ Trust',
      reason: '나스닥 100 지수를 동일하게 추종하는 국내 상장 대장주',
    },
  },
];
