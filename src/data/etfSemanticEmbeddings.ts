/**
 * 20개 대표 미국 배당 ETF 시맨틱 프로필 및 사전 임베딩 벡터 데이터
 * 경로: src/data/etfSemanticEmbeddings.ts
 * 
 * 임베딩 젬마 2(Embedding Gemma 2) 모델의 의미론적 특성 추출 원리를 차용한
 * 8차원 잠재 공간(Latent Space) 특성 벡터:
 * [0] dividendYield: 배당수익률 (0: 낮음 ~ 1: 극대화 10%+)
 * [1] dividendGrowth: 배당성장률 (0: 정체 ~ 1: 10%+ 고속성장)
 * [2] capitalGrowth: 주가상승성 (0: 방어/채권 ~ 1: 빅테크 주도 시세차익)
 * [3] principalDefense: 하방/원금 방어력 (0: 고변동 ~ 1: 손실위험 극소)
 * [4] volatility: 시장 변동성 (0: 저변동 파킹 ~ 1: 공격적 변동성)
 * [5] monthlyPayout: 월배당 선호/현금흐름 (0: 분기배당 ~ 1: 매달 확정 월배당)
 * [6] techExposure: 테크/나스닥 비중 (0: 전통가치/부동산 ~ 1: IT/AI 집중)
 * [7] rateSensitivity: 금리 민감도/듀레이션 (0: 무관 ~ 1: 금리인하 시세 수혜)
 */

export interface SemanticETFProfile {
  ticker: string;
  name: string;
  category: '배당성장' | '월배당·커버드콜' | '시장지수' | '고배당/배당귀족' | '리츠·채권';
  intentKeywords: string[];
  semanticVector: [number, number, number, number, number, number, number, number];
  recommendationReason: string;
  highlightBadge: string;
}

export const ETF_SEMANTIC_PROFILES: SemanticETFProfile[] = [
  // 1. 배당성장군 (SCHD, DGRO, VIG)
  {
    ticker: 'SCHD',
    name: '슈왑 미국 배당 다우존스 (SCHD)',
    category: '배당성장',
    intentKeywords: [
      '은퇴', '10년', '복리', '연금', '배당성장', '장기투자', '스노우볼', '우량주', 
      '배당재투자', '노후준비', '배당금증액', '인플레이션헤지', '다우존스', '배당킹'
    ],
    // [배당수익, 배당성장, 주가성장, 원금방어, 변동성, 월배당, 테크비중, 금리민감]
    semanticVector: [0.65, 0.95, 0.75, 0.75, 0.45, 0.15, 0.30, 0.40],
    recommendationReason: '10년 연속 배당을 늘려온 대표 배당성장 ETF로, 장기 은퇴 준비와 복리 스노우볼에 가장 적합합니다.',
    highlightBadge: '👑 은퇴 복리 1위',
  },
  {
    ticker: 'DGRO',
    name: '아이셰어즈 코어 배당성장 (DGRO)',
    category: '배당성장',
    intentKeywords: [
      '배당성장', '빅테크성장', '애플', '마이크로소프트', '복리', '균형성장', '장기보유', '성장배당'
    ],
    semanticVector: [0.50, 0.90, 0.80, 0.70, 0.50, 0.15, 0.60, 0.35],
    recommendationReason: '애플·마이크로소프트 등 빅테크 성장성을 공유하면서도 높은 배당성장률을 누릴 수 있습니다.',
    highlightBadge: '🚀 테크+배당 하이브리드',
  },
  {
    ticker: 'VIG',
    name: '뱅가드 배당 증액 (VIG)',
    category: '배당성장',
    intentKeywords: [
      '하락장방어', '우량주', '10년연속', '안전투자', '초저보수', '뱅가드', '안정성장', '원금보호'
    ],
    semanticVector: [0.40, 0.85, 0.75, 0.85, 0.40, 0.15, 0.40, 0.30],
    recommendationReason: '경제 위기에도 배당을 삭감하지 않은 초우량 기업에 투자하여 하락장 방어력이 가장 탁월합니다.',
    highlightBadge: '🛡️ 하락장 최강 방어',
  },

  // 2. 월배당·커버드콜군 (JEPI, JEPQ, SPYI, QQQI, DIVO)
  {
    ticker: 'JEPI',
    name: 'JP모건 에쿼티 프리미엄 인컴 (JEPI)',
    category: '월배당·커버드콜',
    intentKeywords: [
      '월급', '생활비', '매달배당', '월배당', '용돈', '하락장방어', '고배당', '현금흐름', '원금안깨지는'
    ],
    semanticVector: [0.85, 0.25, 0.40, 0.80, 0.35, 1.00, 0.20, 0.30],
    recommendationReason: 'S&P 500 가치주 기반의 옵션 프리미엄으로 매달 안정적인 7~8%대 제2의 월급을 지급합니다.',
    highlightBadge: '💵 월급 파이프라인',
  },
  {
    ticker: 'JEPQ',
    name: 'JP모건 나스닥 에쿼티 프리미엄 (JEPQ)',
    category: '월배당·커버드콜',
    intentKeywords: [
      '나스닥월배당', '빅테크고배당', '월급', '기술주인컴', '연9%', '고배당월급', '나스닥성장'
    ],
    semanticVector: [0.90, 0.35, 0.60, 0.55, 0.65, 1.00, 0.85, 0.40],
    recommendationReason: '나스닥 기술주의 성장성과 연 9~10%대 강력한 월배당을 동시에 추구하는 스마트 인컴 ETF입니다.',
    highlightBadge: '⚡ 나스닥 초고배당',
  },
  {
    ticker: 'SPYI',
    name: '네오스 S&P 500 하이 인컴 (SPYI)',
    category: '월배당·커버드콜',
    intentKeywords: [
      '연11%', '초고배당', '월배당', '절세인컴', '생활비', '현금회수', '옵션스프레드'
    ],
    semanticVector: [0.95, 0.30, 0.45, 0.65, 0.50, 1.00, 0.30, 0.35],
    recommendationReason: '옵션 스프레드 매도로 상승장 참여율을 높이면서 연 11%대 극대화된 월배당을 제공합니다.',
    highlightBadge: '🔥 연 11% 월배당',
  },
  {
    ticker: 'QQQI',
    name: '네오스 나스닥 100 하이 인컴 (QQQI)',
    category: '월배당·커버드콜',
    intentKeywords: [
      '연13%', '최고배당', '나스닥100', '초고속현금회수', '월현금', '커버드콜부스터', '극대화'
    ],
    semanticVector: [1.00, 0.35, 0.55, 0.50, 0.80, 1.00, 0.90, 0.45],
    recommendationReason: '나스닥 100 기반 연 13~14%의 최상위 월인컴으로 투자 원금의 빠른 현금 회수를 돕습니다.',
    highlightBadge: '💣 연 13%+ 부스터',
  },
  {
    ticker: 'DIVO',
    name: '앰플리파이 C-PACE 인컴 (DIVO)',
    category: '월배당·커버드콜',
    intentKeywords: [
      '액티브커버드콜', '우량배당', '주가상승보존', '월배당', '안정적현금', '밸런스'
    ],
    semanticVector: [0.65, 0.60, 0.65, 0.75, 0.45, 1.00, 0.40, 0.30],
    recommendationReason: '선별적 옵션 매도로 주가 상승 잠재력을 지키면서 안정적인 월배당을 함께 누릴 수 있습니다.',
    highlightBadge: '⚖️ 배당+성장 밸런스',
  },

  // 3. 시장지수 및 성장 (VOO, QQQ, DIA, SCHG)
  {
    ticker: 'VOO',
    name: '뱅가드 S&P 500 ETF (VOO)',
    category: '시장지수',
    intentKeywords: [
      'S&P500', '워런버핏', '시장평균', '장기우상향', '자본성장', '미국경제', '초저보수', '기본'
    ],
    semanticVector: [0.35, 0.65, 0.85, 0.70, 0.55, 0.15, 0.45, 0.35],
    recommendationReason: '미국 500대 대표 우량기업 전체를 0.03% 최저 보수로 소유하며 장기 우상향에 베팅합니다.',
    highlightBadge: '🇺🇸 미국 표준 1위',
  },
  {
    ticker: 'QQQ',
    name: '인베스코 나스닥 100 (QQQ)',
    category: '시장지수',
    intentKeywords: [
      '나스닥', '빅테크', '시세차익', '엔비디아', '애플', '혁신기업', '자본이득', '공격투자', '성장주'
    ],
    semanticVector: [0.15, 0.80, 1.00, 0.45, 0.85, 0.15, 1.00, 0.50],
    recommendationReason: '애플·엔비디아·마이크로소프트 등 글로벌 최고 혁신 기술주 100개의 폭발적 자본 성장에 집중합니다.',
    highlightBadge: '🤖 혁신 성장 엔진',
  },
  {
    ticker: 'DIA',
    name: 'SPDR 다우 존스 산업평균 (DIA)',
    category: '시장지수',
    intentKeywords: [
      '다우존스', '30대우량기업', '월배당지수', '전통블루칩', '안정성장', '시장지수월배당'
    ],
    semanticVector: [0.40, 0.65, 0.70, 0.80, 0.45, 1.00, 0.25, 0.35],
    recommendationReason: '미국을 움직이는 30대 핵심 우량 전통 기업을 담아 매달 지수 연동 월배당을 지급합니다.',
    highlightBadge: '🏛️ 다우 30 블루칩',
  },
  {
    ticker: 'SCHG',
    name: '슈왑 미국 대형 성장주 (SCHG)',
    category: '시장지수',
    intentKeywords: [
      '대형성장주', '초저보수성장', '저렴한QQQ', '자본차익', '미래성장', '젊은투자자'
    ],
    semanticVector: [0.15, 0.75, 0.95, 0.45, 0.80, 0.15, 0.90, 0.45],
    recommendationReason: '0.04% 초저보수로 미국 최고 실적의 대형 성장주에 분산 투자하여 장기 자산을 불려줍니다.',
    highlightBadge: '💎 초저보수 성장',
  },

  // 4. 고배당 / 배당귀족 (NOBL, VYM, HDV)
  {
    ticker: 'NOBL',
    name: '프로셰어즈 S&P 500 배당귀족 (NOBL)',
    category: '고배당/배당귀족',
    intentKeywords: [
      '배당귀족', '25년연속증액', '위기방어', '원금보존', '안전제일', '검증된기업', '경기방어'
    ],
    semanticVector: [0.50, 0.70, 0.60, 0.90, 0.35, 0.15, 0.15, 0.35],
    recommendationReason: '25년 이상 금융위기에도 배당을 늘려온 검증된 배당귀족 기업들만 모아 안전성이 최고 수준입니다.',
    highlightBadge: '👑 25년 배당귀족',
  },
  {
    ticker: 'VYM',
    name: '뱅가드 고배당 수익률 (VYM)',
    category: '고배당/배당귀족',
    intentKeywords: [
      '고배당분산', '400개기업', '초분산', '저위험고배당', '경기방어', '안정형인컴'
    ],
    semanticVector: [0.55, 0.65, 0.60, 0.80, 0.40, 0.15, 0.20, 0.35],
    recommendationReason: '400개 이상의 다양한 미국 고배당 우량 기업에 초분산 투자되어 개별 종목 위험이 없습니다.',
    highlightBadge: '🌐 400종목 초분산',
  },
  {
    ticker: 'HDV',
    name: '아이셰어즈 코어 고배당 (HDV)',
    category: '고배당/배당귀족',
    intentKeywords: [
      '재무건전성', '모닝스타경제적해자', '헬스케어', '에너지', '경기불황방어', '건전한고배당'
    ],
    semanticVector: [0.60, 0.55, 0.55, 0.80, 0.45, 0.15, 0.15, 0.30],
    recommendationReason: '재무 건전성이 엄격히 검증된 고배당 가치주 위주로 경기 불황과 인플레이션에 강합니다.',
    highlightBadge: '🧱 탄탄한 재무해자',
  },

  // 5. 월배당 리츠 / 채권 (O, VNQ, TLT, SGOV, MAIN)
  {
    ticker: 'O',
    name: '리얼티 인컴 (O)',
    category: '리츠·채권',
    intentKeywords: [
      '월배당부동산', '건물주', '월세받기', '리얼티인컴', '30년월배당', '생활비', '임대수익', '고정월급'
    ],
    semanticVector: [0.75, 0.45, 0.45, 0.70, 0.50, 1.00, 0.05, 0.85],
    recommendationReason: '월마트·세븐일레븐 등 세계적 브랜드의 건물주가 되어 매달 따박따박 월세를 수령할 수 있습니다.',
    highlightBadge: '🏢 국민 월세 리츠',
  },
  {
    ticker: 'VNQ',
    name: '뱅가드 부동산 리츠 ETF (VNQ)',
    category: '리츠·채권',
    intentKeywords: [
      '미국부동산', '상업용부동산', '데이터센터리츠', '부동산분산', '인플레이션방어'
    ],
    semanticVector: [0.65, 0.45, 0.50, 0.60, 0.60, 0.15, 0.15, 0.85],
    recommendationReason: '미국 전역의 데이터센터, 주거, 상업용 부동산 전반에 분산 투자하여 부동산 인컴을 창출합니다.',
    highlightBadge: '🏘️ 미국 부동산 분산',
  },
  {
    ticker: 'TLT',
    name: '아이셰어즈 20년 이상 미국 국채 (TLT)',
    category: '리츠·채권',
    intentKeywords: [
      '미국국채', '금리인하수혜', '장기채권', '안전자산', '주식폭락헤지', '월이자', '채권시세차익'
    ],
    semanticVector: [0.65, 0.30, 0.65, 0.65, 0.70, 1.00, 0.00, 1.00],
    recommendationReason: '매달 안전한 국채 이자를 받으며, 향후 기준금리 인하기에 강력한 채권 시세차익을 기대할 수 있습니다.',
    highlightBadge: '📉 금리인하 시세 수혜',
  },
  {
    ticker: 'SGOV',
    name: '아이셰어즈 0-3개월 초단기 국채 (SGOV)',
    category: '리츠·채권',
    intentKeywords: [
      '파킹통장', '단기국채', '원금보존', '무위험', '예수금파킹', '달러이자', '절대안전', '원금안깨지는'
    ],
    semanticVector: [0.70, 0.20, 0.05, 1.00, 0.05, 1.00, 0.00, 0.70],
    recommendationReason: '주가 변동 없이 원금을 100% 보존하면서 달러 파킹통장처럼 연 5%대 확정 월이자를 지급합니다.',
    highlightBadge: '🛡️ 원금 100% 무위험 파킹',
  },
  {
    ticker: 'MAIN',
    name: '메인 스트리트 캐피탈 (MAIN)',
    category: '리츠·채권',
    intentKeywords: [
      '고배당월급', '특별배당', 'BDC', '중소기업대출', '연7%', '월현금흐름'
    ],
    semanticVector: [0.80, 0.55, 0.50, 0.60, 0.60, 1.00, 0.10, 0.60],
    recommendationReason: '매달 지급하는 고배당 외에도 연 2회 추가 특별배당을 지급하여 뛰어난 현금흐름을 자랑합니다.',
    highlightBadge: '🎁 월배당+보너스 특별배당',
  },
];
