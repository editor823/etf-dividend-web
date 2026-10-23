/**
 * 서학개미(미국 직투) vs 동학개미(국내 상장 미국 ETF) 인기 순위 & 절세 매칭 데이터
 * 경로: src/lib/data/etf-rankings.ts
 */

export type RankingCategory =
  | 'ALL'
  | '배당성장'
  | '고배당 커버드콜'
  | '시장지수/빅테크'
  | '월배당 리츠/채권';

export interface DonghakMatched {
  name: string;
  code: string; // 6자리 종목코드
  issuer: string; // 운용사
  statedExpense: number; // 표기 운용보수 (%)
  realTotalExpense: number; // 실질 총비용(TER+매매비용, %)
  yieldPercent: number; // 연 분배율 (%)
  payoutCycle: '월배당' | '분기배당';
  reason: string;
  isIsaEligible: boolean;
  isPensionEligible: boolean;
}

export interface SeohakRankItem {
  rank: number;
  ticker: string;
  nameKo: string;
  nameEn: string;
  category: '배당성장' | '고배당 커버드콜' | '시장지수/빅테크' | '월배당 리츠/채권';
  yieldPercent: number; // 연 배당수익률 (%)
  frequency: '월배당' | '분기배당';
  dividendGrowth5y?: number; // 5년 연평균 배당성장률 (%)
  expenseRatio: number; // 미국 현지 운용보수 (%)
  highlight: string;
  bestFor: string;
  matchedDonghak: DonghakMatched[];
}

export interface DonghakRankItem {
  rank: number;
  code: string; // 6자리 종목코드
  nameKo: string;
  issuer: string;
  category: '배당성장' | '고배당 커버드콜' | '시장지수/빅테크' | '월배당 리츠/채권';
  yieldPercent: number;
  frequency: '월배당' | '분기배당';
  statedExpense: number; // 표기 보수 (%)
  realTotalExpense: number; // 실질 총비용 (%)
  aum: string; // 순자산규모
  taxAccountEligible: {
    isa: boolean;
    pensionSavings: boolean;
    irp: boolean;
  };
  highlight: string;
  bestFor: string;
  matchedSeohakTicker: string;
  matchedSeohakName: string;
}

export const SEOHAK_RANKINGS_DATA: SeohakRankItem[] = [
  // 1. 배당성장 TOP
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
    highlight: '국내 배당러들의 영원한 원픽, 10년 연속 배당 증액 기업 100개 엄선',
    bestFor: '10년 이상 장기 적립식으로 미래의 배당 눈덩이를 굴리고 싶은 투자자',
    matchedDonghak: [
      {
        name: 'TIGER 미국배당다우존스',
        code: '458730',
        issuer: '미래에셋',
        statedExpense: 0.01,
        realTotalExpense: 0.14,
        yieldPercent: 3.65,
        payoutCycle: '월배당',
        reason: '국내 상장 한국판 SCHD 중 최대 순자산(1조 2천억 원)과 풍부한 거래 유동성',
        isIsaEligible: true,
        isPensionEligible: true,
      },
      {
        name: 'ACE 미국배당다우존스',
        code: '402970',
        issuer: '한국투자',
        statedExpense: 0.01,
        realTotalExpense: 0.12,
        yieldPercent: 3.62,
        payoutCycle: '월배당',
        reason: '업계 최저 수준 실질 총비용 경쟁을 선도하며 정밀한 지수 추종',
        isIsaEligible: true,
        isPensionEligible: true,
      },
      {
        name: 'SOL 미국배당다우존스',
        code: '446720',
        issuer: '신한자산',
        statedExpense: 0.03,
        realTotalExpense: 0.15,
        yieldPercent: 3.58,
        payoutCycle: '월배당',
        reason: '국내 최초로 월배당 시스템을 도입해 매월 첫 영업일에 따박따박 지급',
        isIsaEligible: true,
        isPensionEligible: true,
      },
    ],
  },
  {
    rank: 2,
    ticker: 'DGRO',
    nameKo: '아이셰어즈 코어 배당성장',
    nameEn: 'iShares Core Dividend Growth ETF',
    category: '배당성장',
    yieldPercent: 2.25,
    frequency: '분기배당',
    dividendGrowth5y: 9.45,
    expenseRatio: 0.08,
    highlight: '배당성향 75% 이하 재무건전성 기업 + 빅테크 성장성 절충',
    bestFor: '배당과 주가 상승(애플, 마이크로소프트 등) 두 마리 토끼를 잡고 싶은 투자자',
    matchedDonghak: [
      {
        name: 'KODEX 미국배당다우존스',
        code: '449450',
        issuer: '삼성자산',
        statedExpense: 0.0099,
        realTotalExpense: 0.13,
        yieldPercent: 3.60,
        payoutCycle: '월배당',
        reason: '초저보수 경쟁력으로 연금저축/IRP에서 장기 적립하기 좋은 배당성장 대안',
        isIsaEligible: true,
        isPensionEligible: true,
      },
    ],
  },

  // 2. 고배당 커버드콜 TOP
  {
    rank: 3,
    ticker: 'JEPI',
    nameKo: 'JP모건 에쿼티 프리미엄 인컴',
    nameEn: 'JPMorgan Equity Premium Income ETF',
    category: '고배당 커버드콜',
    yieldPercent: 7.42,
    frequency: '월배당',
    expenseRatio: 0.35,
    highlight: 'S&P 500 가치주 기반 ELN 옵션 매도로 매달 통장에 꽂히는 7%대 월급 배당',
    bestFor: '지금 당장 매월 안정적인 생활비 인출이 필요한 은퇴자 및 파이어족',
    matchedDonghak: [
      {
        name: 'TIGER 미국배당+7%프리미엄다우존스',
        code: '458750',
        issuer: '미래에셋',
        statedExpense: 0.39,
        realTotalExpense: 0.48,
        yieldPercent: 9.20,
        payoutCycle: '월배당',
        reason: 'SCHD 주식에 콜옵션을 묶어 연 9~10% 수준의 초고배당 월인컴을 창출하는 국내 1위 커버드콜',
        isIsaEligible: true,
        isPensionEligible: true,
      },
    ],
  },
  {
    rank: 4,
    ticker: 'JEPQ',
    nameKo: 'JP모건 나스닥 에쿼티 프리미엄',
    nameEn: 'JPMorgan Nasdaq Equity Premium Income ETF',
    category: '고배당 커버드콜',
    yieldPercent: 9.15,
    frequency: '월배당',
    expenseRatio: 0.35,
    highlight: '나스닥 대형 기술주 성장과 연 9%대 초고배당의 하이브리드',
    bestFor: '나스닥 기술주의 성장성과 높은 월현금흐름을 동시에 누리고 싶은 분',
    matchedDonghak: [
      {
        name: 'TIGER 미국나스닥100+15%프리미엄초단기',
        code: '486290',
        issuer: '미래에셋',
        statedExpense: 0.25,
        realTotalExpense: 0.38,
        yieldPercent: 14.20,
        payoutCycle: '월배당',
        reason: '초단기(Daily) 옵션 매도로 원금 하락은 줄이고 연 15% 수준 월분배금을 추구',
        isIsaEligible: true,
        isPensionEligible: true,
      },
      {
        name: 'ACE 미국500 15%프리미엄분배(합성)',
        code: '472150',
        issuer: '한국투자',
        statedExpense: 0.30,
        realTotalExpense: 0.42,
        yieldPercent: 14.80,
        payoutCycle: '월배당',
        reason: 'S&P 500 기반 최고 수준의 월분배 목표를 설정한 고인컴 상품',
        isIsaEligible: true,
        isPensionEligible: true,
      },
    ],
  },
  {
    rank: 5,
    ticker: 'SPYI',
    nameKo: '네오스 S&P 500 하이 인컴',
    nameEn: 'NEOS S&P 500 High Income ETF',
    category: '고배당 커버드콜',
    yieldPercent: 11.80,
    frequency: '월배당',
    expenseRatio: 0.68,
    highlight: '옵션 스프레드 매매로 주가 상승 참여율을 높인 연 11%대 월배당',
    bestFor: '원금 회수 속도를 극대화하면서 주가 상승도 일정 부분 챙기고 싶은 스마트 인컴러',
    matchedDonghak: [
      {
        name: 'KODEX 미국배당+10%프리미엄다우존스',
        code: '482730',
        issuer: '삼성자산',
        statedExpense: 0.39,
        realTotalExpense: 0.47,
        yieldPercent: 10.10,
        payoutCycle: '월배당',
        reason: '배당다우존스에 10% 프리미엄 옵션을 결합한 월지급식 절세 계좌 전용',
        isIsaEligible: true,
        isPensionEligible: true,
      },
    ],
  },

  // 3. 시장지수 / 빅테크 TOP
  {
    rank: 6,
    ticker: 'VOO',
    nameKo: '뱅가드 S&P 500 ETF',
    nameEn: 'Vanguard S&P 500 ETF',
    category: '시장지수/빅테크',
    yieldPercent: 1.45,
    frequency: '분기배당',
    dividendGrowth5y: 5.75,
    expenseRatio: 0.03,
    highlight: '워런 버핏의 평생 추천 종목, 미국 500대 대표 우량기업 전체 투자',
    bestFor: '종목 고민 없이 미국 전체 경제의 성장을 가장 안전하게 믿는 장기 투자자',
    matchedDonghak: [
      {
        name: 'TIGER 미국S&P500',
        code: '360750',
        issuer: '미래에셋',
        statedExpense: 0.0068,
        realTotalExpense: 0.11,
        yieldPercent: 1.35,
        payoutCycle: '분기배당',
        reason: '순자산 4조 8천억 원으로 국내 상장 해외주식형 ETF 압도적 1위 대장주',
        isIsaEligible: true,
        isPensionEligible: true,
      },
      {
        name: 'ACE 미국S&P500',
        code: '360200',
        issuer: '한국투자',
        statedExpense: 0.0068,
        realTotalExpense: 0.09,
        yieldPercent: 1.38,
        payoutCycle: '분기배당',
        reason: '0.09% 최저 수준의 실질 총비용으로 연금저축/IRP 장기 적립에 최적',
        isIsaEligible: true,
        isPensionEligible: true,
      },
    ],
  },
  {
    rank: 7,
    ticker: 'QQQ',
    nameKo: '인베스코 나스닥 100 ETF',
    nameEn: 'Invesco QQQ Trust',
    category: '시장지수/빅테크',
    yieldPercent: 0.58,
    frequency: '분기배당',
    dividendGrowth5y: 10.20,
    expenseRatio: 0.20,
    highlight: '애플, 마이크로소프트, 엔비디아 등 글로벌 혁신 기술주 100개 올인',
    bestFor: '배당보다는 주가 시세차익과 자본 성장을 극대화하고 싶은 성장형 투자자',
    matchedDonghak: [
      {
        name: 'TIGER 미국나스닥100',
        code: '133690',
        issuer: '미래에셋',
        statedExpense: 0.07,
        realTotalExpense: 0.16,
        yieldPercent: 0.45,
        payoutCycle: '분기배당',
        reason: '순자산 3조 5천억 원의 나스닥 100 국민 ETF, 절세계좌 필수 종목',
        isIsaEligible: true,
        isPensionEligible: true,
      },
      {
        name: 'ACE 미국나스닥100',
        code: '367380',
        issuer: '한국투자',
        statedExpense: 0.07,
        realTotalExpense: 0.14,
        yieldPercent: 0.48,
        payoutCycle: '분기배당',
        reason: '낮은 실질 총보수로 빅테크 성장을 공유하는 연금 전용 나스닥 펀드',
        isIsaEligible: true,
        isPensionEligible: true,
      },
    ],
  },

  // 4. 월배당 리츠 / 채권 TOP
  {
    rank: 8,
    ticker: 'O',
    nameKo: '리얼티 인컴 (부동산 리츠)',
    nameEn: 'Realty Income Corporation',
    category: '월배당 리츠/채권',
    yieldPercent: 5.25,
    frequency: '월배당',
    dividendGrowth5y: 3.45,
    expenseRatio: 0.0,
    highlight: '30년 연속 배당금을 늘려온 미국 대표 상업용 부동산 월배당주',
    bestFor: '미국 전역 월마트·세븐일레븐 건물주가 되어 매달 월세를 받고 싶은 분',
    matchedDonghak: [
      {
        name: 'TIGER 리츠부동산인프라',
        code: '329200',
        issuer: '미래에셋',
        statedExpense: 0.29,
        realTotalExpense: 0.38,
        yieldPercent: 6.80,
        payoutCycle: '월배당',
        reason: '국내 및 글로벌 핵심 우량 리츠와 맥쿼리인프라를 담은 대표 월배당 리츠',
        isIsaEligible: true,
        isPensionEligible: true,
      },
    ],
  },
  {
    rank: 9,
    ticker: 'TLT',
    nameKo: '아이셰어즈 20년 이상 미국 국채',
    nameEn: 'iShares 20+ Year Treasury Bond ETF',
    category: '월배당 리츠/채권',
    yieldPercent: 4.15,
    frequency: '월배당',
    expenseRatio: 0.15,
    highlight: '미국 장기 국채 월이자 수령 + 향후 금리 인하시 강력한 시세차익 기대',
    bestFor: '주식 하락장을 방어하고 금리 인하 사이클을 노리는 자산배분가',
    matchedDonghak: [
      {
        name: 'ACE 미국30년국채액티브(H)',
        code: '453850',
        issuer: '한국투자',
        statedExpense: 0.05,
        realTotalExpense: 0.22,
        yieldPercent: 4.25,
        payoutCycle: '월배당',
        reason: '환헤지(H)로 환율 하락 걱정 없이 미국 30년 국채 월배당을 원화로 수령',
        isIsaEligible: true,
        isPensionEligible: true,
      },
      {
        name: 'TIGER 미국채30년스트립액티브(합성H)',
        code: '458250',
        issuer: '미래에셋',
        statedExpense: 0.15,
        realTotalExpense: 0.28,
        yieldPercent: 0.0,
        payoutCycle: '분기배당',
        reason: '원금과 이자를 분리(스트립)하여 금리 인하시 자본차익을 극대화',
        isIsaEligible: true,
        isPensionEligible: true,
      },
    ],
  },
];

export const DONGHAK_RANKINGS_DATA: DonghakRankItem[] = [
  {
    rank: 1,
    code: '458730',
    nameKo: 'TIGER 미국배당다우존스',
    issuer: '미래에셋자산운용',
    category: '배당성장',
    yieldPercent: 3.65,
    frequency: '월배당',
    statedExpense: 0.01,
    realTotalExpense: 0.14,
    aum: '1조 2,400억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '국내 상장 한국판 SCHD의 절대강자, 압도적인 거래대금과 유동성',
    bestFor: 'ISA 및 연금저축 계좌에서 가장 안전하고 편하게 SCHD를 모아가실 분',
    matchedSeohakTicker: 'SCHD',
    matchedSeohakName: 'Schwab U.S. Dividend Equity ETF',
  },
  {
    rank: 2,
    code: '402970',
    nameKo: 'ACE 미국배당다우존스',
    issuer: '한국투자신탁운용',
    category: '배당성장',
    yieldPercent: 3.62,
    frequency: '월배당',
    statedExpense: 0.01,
    realTotalExpense: 0.12,
    aum: '6,800억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '국내 최저 수준 실질 보수 경쟁력과 정밀한 배당금 재투자 설계',
    bestFor: '수수료를 0.01%라도 아끼며 10년 이상 장기 적립식으로 모아가실 분',
    matchedSeohakTicker: 'SCHD',
    matchedSeohakName: 'Schwab U.S. Dividend Equity ETF',
  },
  {
    rank: 3,
    code: '446720',
    nameKo: 'SOL 미국배당다우존스',
    issuer: '신한자산운용',
    category: '배당성장',
    yieldPercent: 3.58,
    frequency: '월배당',
    statedExpense: 0.03,
    realTotalExpense: 0.15,
    aum: '5,200억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '국내 최초로 월배당 시대를 연 원조 ETF, 매월 첫 영업일 배당 입금',
    bestFor: '매달 초에 정확히 월급처럼 배당금이 들어오는 현금흐름을 선호하시는 분',
    matchedSeohakTicker: 'SCHD',
    matchedSeohakName: 'Schwab U.S. Dividend Equity ETF',
  },
  {
    rank: 4,
    code: '458750',
    nameKo: 'TIGER 미국배당+7%프리미엄다우존스',
    issuer: '미래에셋자산운용',
    category: '고배당 커버드콜',
    yieldPercent: 9.20,
    frequency: '월배당',
    statedExpense: 0.39,
    realTotalExpense: 0.48,
    aum: '4,100억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: 'SCHD 배당성장 우량주 + 커버드콜 옵션 결합으로 연 9%대 초고배당',
    bestFor: 'SCHD의 안정성과 JEPI의 고배당을 국내 절세계좌에서 절충하고 싶은 분',
    matchedSeohakTicker: 'JEPI',
    matchedSeohakName: 'JPMorgan Equity Premium Income ETF',
  },
  {
    rank: 5,
    code: '486290',
    nameKo: 'TIGER 미국나스닥100+15%프리미엄초단기',
    issuer: '미래에셋자산운용',
    category: '고배당 커버드콜',
    yieldPercent: 14.20,
    frequency: '월배당',
    statedExpense: 0.25,
    realTotalExpense: 0.38,
    aum: '3,800억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '나스닥 기술주 포트폴리오 기반 데일리 옵션 매도로 연 14%대 극대화 월배당',
    bestFor: '원금 회수 속도를 가장 빠르게 가져가고 싶은 초고인컴 추구 투자자',
    matchedSeohakTicker: 'JEPQ',
    matchedSeohakName: 'JPMorgan Nasdaq Equity Premium Income ETF',
  },
  {
    rank: 6,
    code: '360750',
    nameKo: 'TIGER 미국S&P500',
    issuer: '미래에셋자산운용',
    category: '시장지수/빅테크',
    yieldPercent: 1.35,
    frequency: '분기배당',
    statedExpense: 0.0068,
    realTotalExpense: 0.11,
    aum: '4조 8,000억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '국내 상장 해외주식형 ETF 중 순자산 1위, 한국인 국민 연금 펀드',
    bestFor: '모든 절세계좌(ISA/연금저축/IRP)의 든든한 1순위 베이스캠프',
    matchedSeohakTicker: 'VOO',
    matchedSeohakName: 'Vanguard S&P 500 ETF',
  },
  {
    rank: 7,
    code: '133690',
    nameKo: 'TIGER 미국나스닥100',
    issuer: '미래에셋자산운용',
    category: '시장지수/빅테크',
    yieldPercent: 0.45,
    frequency: '분기배당',
    statedExpense: 0.07,
    realTotalExpense: 0.16,
    aum: '3조 5,000억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '빅테크 중심 나스닥 성장주를 연금계좌에서 모아가며 세금 0원 효과',
    bestFor: '복리 시세차익을 목표로 은퇴 자산을 폭발적으로 불리고 싶은 분',
    matchedSeohakTicker: 'QQQ',
    matchedSeohakName: 'Invesco QQQ Trust',
  },
  {
    rank: 8,
    code: '453850',
    nameKo: 'ACE 미국30년국채액티브(H)',
    issuer: '한국투자신탁운용',
    category: '월배당 리츠/채권',
    yieldPercent: 4.25,
    frequency: '월배당',
    statedExpense: 0.05,
    realTotalExpense: 0.22,
    aum: '1조 1,000억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '환헤지(H)로 환율 하락 위험 없이 미국 장기채 월이자만 따박따박 수령',
    bestFor: '주식 폭락에 대비하고 IRP 계좌 안전자산 30%를 채우고 싶은 분',
    matchedSeohakTicker: 'TLT',
    matchedSeohakName: 'iShares 20+ Year Treasury Bond ETF',
  },
  {
    rank: 9,
    code: '329200',
    nameKo: 'TIGER 리츠부동산인프라',
    issuer: '미래에셋자산운용',
    category: '월배당 리츠/채권',
    yieldPercent: 6.80,
    frequency: '월배당',
    statedExpense: 0.29,
    realTotalExpense: 0.38,
    aum: '4,500억 원',
    taxAccountEligible: { isa: true, pensionSavings: true, irp: true },
    highlight: '연 6.8% 고배당 월지급식 대표 리츠 인프라 펀드',
    bestFor: '국내 절세계좌에서 안정적인 부동산 월세를 모아가실 분',
    matchedSeohakTicker: 'O',
    matchedSeohakName: 'Realty Income Corporation',
  },
];

// 하위 호환을 위한 alias
export const SEOHAK_RANKING = SEOHAK_RANKINGS_DATA;
export const DONGHAK_RANKING = DONGHAK_RANKINGS_DATA;
