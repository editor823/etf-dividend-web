/**
 * 미국 배당 ETF 20선 완전정복 백과사전 데이터셋
 * 경로: src/data/etfEncyclopediaData.ts
 */

export type EncyclopediaCategory =
  | '배당성장'
  | '월배당 커버드콜'
  | '시장지수'
  | '배당귀족·가치'
  | '리츠·채권·BDC';

export interface ETFEncyclopediaItem {
  ticker: string;
  nameKo: string;
  nameEn: string;
  category: EncyclopediaCategory;
  payoutCycle: '월배당' | '분기배당';
  dividendYield: number; // e.g. 0.0348 (3.48%)
  fiveYearGrowth: number; // e.g. 0.0892 (8.92%)
  expenseRatio: number; // e.g. 0.0006 (0.06%)
  currentPriceUSD: number;
  tags: string[];

  // 1. 💡 개요 및 쉬운 비유
  analogy: {
    headline: string;
    metaphor: string; // 실생활 비유
    simpleDescription: string;
  };

  // 2. ⚙️ 포트폴리오 선별 기준 및 운용 메커니즘
  mechanism: {
    benchmarkIndex: string; // 기초지수명
    screeningRules: string; // 종목 스크리닝 요건
    rebalancingFrequency: string; // 리밸런싱 주기
    weightingCap: string; // 가중 방식 및 비중 캡
    coreDetail: string; // 메커니즘 해설
  };

  // 3. 🛡️ 핵심 장점과 하방 방어력
  strengths: {
    keyTheme: string;
    points: string[];
  };

  // 4. ⚠️ 반드시 알아야 할 한계점 및 리스크
  risks: {
    warningTitle: string;
    points: string[];
  };

  // 5. 🎯 실전 투자 팁 및 이상적인 투자자
  strategy: {
    idealInvestor: string; // 어떤 투자자에게 딱 맞는지
    portfolioRole: string; // 포트폴리오 내 역할
    recommendedWeight: string; // 추천 포트폴리오 비중
    actionableTip: string; // 실전 매수/운용 꿀팁
  };
}

export const ETF_ENCYCLOPEDIA_LIST: ETFEncyclopediaItem[] = [
  // ==========================================
  // [1. 배당성장 그룹 (3종)]
  // ==========================================
  {
    ticker: 'SCHD',
    nameKo: '슈왑 미국 배당 다우존스',
    nameEn: 'Schwab U.S. Dividend Equity ETF',
    category: '배당성장',
    payoutCycle: '분기배당',
    dividendYield: 0.0348,
    fiveYearGrowth: 0.0892,
    expenseRatio: 0.0006,
    currentPriceUSD: 82.50,
    tags: ['배당성장 제왕', '초저보수 0.06%', '10년 증액', '워런버핏 스타일'],
    analogy: {
      headline: '매년 월세를 10%씩 올려주는 튼튼한 1등 상가 100채의 공동 건물주',
      metaphor:
        '서울 강남 대로변에서 공실 한 번 안 나고 장사 잘되는 알짜 우량 상가 100채를 공동 소유하며, 매년 상가 임대료를 10%씩 올려받는 리츠 건물주가 되는 것과 같습니다.',
      simpleDescription:
        '단순히 배당금을 많이 주는 회사가 아니라, 돈을 잘 벌어서 매년 배당금을 지속적으로 늘려줄 수 있는 미국 최고 체력의 100개 기업만 골라 담는 배당성장의 표준 ETF입니다.',
    },
    mechanism: {
      benchmarkIndex: 'Dow Jones U.S. Dividend 100 Index',
      screeningRules:
        '최소 10년 연속 배당금을 지급한 기업 중, 부채 대비 현금흐름(CF/Total Debt), 자기자본이익률(ROE), 배당수익률, 5년 배당성장률의 4대 펀더멘털 지표를 종합 랭킹화',
      rebalancingFrequency: '매년 3월 정기 리밸런싱 (분기별 가중치 점검)',
      weightingCap: '단일 종목 최대 4%, 단일 산업 섹터 최대 25% 엄격한 상한선',
      coreDetail:
        '부실 기업이 배당률만 높아 착시를 일으키는 이른바 배당 함정(Dividend Trap)을 시스템적으로 걸러내며, 금융·산업재·헬스케어·필수소비재가 조화롭게 균형을 이룹니다.',
    },
    strengths: {
      keyTheme: '0.06% 초저비용 + 폭발적인 배당 성장률 + 2022년 금리 인상기 조정장 철벽 방어',
      points: [
        '최근 10년간 연평균 약 9~11%에 달하는 배당성장률로 복리 스노우볼 효과 극대화',
        '2022년 나스닥이 -33% 폭락할 때 SCHD는 -3.2% 수준으로 버텨내며 하락장 최강의 방어력 입증',
        '운용보수 0.06%로 10년, 20년 이상 묻어두어도 수수료 누수가 거의 없음',
      ],
    },
    risks: {
      warningTitle: '빅테크 부재로 인한 강세장 소외 & 초기 현금 인출용으로는 낮은 배당률',
      points: [
        '엔비디아, 애플, 마이크로소프트 등 빅테크 비중이 극히 미미해 기술주 대세 상승장에서 시장 지수(QQQ, VOO) 대비 소외감 발생',
        '시가배당률이 3.4% 내외이므로, 당장 매월 수백만 원의 은퇴 생활비를 인출해야 하는 투자자에게는 초기 원금 부담이 큼',
      ],
    },
    strategy: {
      idealInvestor: '은퇴까지 5~15년 이상 시간이 남아있는 30~50대 직장인 적립식 투자자',
      portfolioRole: '전체 포트폴리오의 든든한 뼈대(Core Asset, 40~60%)',
      recommendedWeight: '포트폴리오의 40% ~ 60%',
      actionableTip:
        '배당금을 쓰지 않고 100% 재투자(DRIP)하세요. 7~10년이 지나면 나의 매수 원금 대비 배당률(YoC)이 10%를 돌파하는 기적을 체감할 수 있습니다.',
    },
  },

  {
    ticker: 'DGRO',
    nameKo: '아이셰어즈 코어 배당성장',
    nameEn: 'iShares Core Dividend Growth ETF',
    category: '배당성장',
    payoutCycle: '분기배당',
    dividendYield: 0.0225,
    fiveYearGrowth: 0.0945,
    expenseRatio: 0.0008,
    currentPriceUSD: 62.10,
    tags: ['빅테크 성장 공유', '배당성향 75% 룰', '400개 분산', '성장+배당 하이브리드'],
    analogy: {
      headline: '번 돈을 다 쓰지 않고 미래 기술에 재투자하면서도 배당을 늘려가는 모범생 기업군',
      metaphor:
        '월급을 많이 탄다고 흥청망청 쓰지 않고, 70%는 자기계발과 연구개발에 쓰고 나머지 30%만 알뜰하게 주주 배당으로 나눠주는 똑똑한 모범생 기업들을 모아놓은 것입니다.',
      simpleDescription:
        'SCHD보다 마이크로소프트, 애플 등 혁신 빅테크 비중을 더 많이 담으면서도 배당을 늘려가는 400여 개 우량 기업에 초분산 투자하는 하이브리드 성장형 배당 ETF입니다.',
    },
    mechanism: {
      benchmarkIndex: 'Morningstar US Dividend Growth Index',
      screeningRules:
        '최소 5년 연속 배당 증액 기업 중 배당성향(Payout Ratio) 75% 미만인 우량주만 선별. 상위 10% 초고배당 위험주는 탈락',
      rebalancingFrequency: '매년 12월 리밸런싱',
      weightingCap: '배당금 지급 총액 가중 방식 (단일 종목 최대 3% 제한)',
      coreDetail:
        '배당성향 75% 룰 덕분에 기업이 버는 돈보다 배당을 무리하게 많이 주는 좀비 기업을 원천 배제하며, 주가 상승 탄력이 SCHD보다 높습니다.',
    },
    strengths: {
      keyTheme: '기술주 상승 탄력 + 400개 종목 초분산 + 연 9%대 탄탄한 배당성장',
      points: [
        '마이크로소프트, 애플, JP모건 등 빅테크와 금융 1등주를 고루 편입해 강세장에서 주가 상승 참여율이 뛰어남',
        '0.08% 초저보수와 400개 종목 분산으로 개별 종목 리스크 제로화',
      ],
    },
    risks: {
      warningTitle: '2.2%대의 낮은 배당수익률로 인한 현금흐름 체감 부족',
      points: [
        '시가배당률이 2.2% 수준으로 배당금만 받아 생활하기에는 부족하여 자본 차익을 함께 봐야 함',
      ],
    },
    strategy: {
      idealInvestor: '주가 상승 차익 60%와 배당 증액 40%를 동시에 추구하는 성장 지향형 투자자',
      portfolioRole: '성장 자산과 배당 자산 사이의 밸런스 브릿지',
      recommendedWeight: '포트폴리오의 20% ~ 30%',
      actionableTip:
        'SCHD와 섞어서 투자하면 SCHD에 부족한 빅테크 성장성을 완벽히 보완할 수 있습니다.',
    },
  },

  {
    ticker: 'VIG',
    nameKo: '뱅가드 배당 증액 ETF',
    nameEn: 'Vanguard Dividend Appreciation ETF',
    category: '배당성장',
    payoutCycle: '분기배당',
    dividendYield: 0.0175,
    fiveYearGrowth: 0.0880,
    expenseRatio: 0.0006,
    currentPriceUSD: 198.50,
    tags: ['뱅가드 대표', '10년 연속 증액', 'S&P 500 대체', '철벽 안전성'],
    analogy: {
      headline: '미국을 대표하는 1등 초일류 대기업들의 불침번 안전 금고',
      metaphor:
        '이름만 대면 전 세계 누구나 아는 마이크로소프트, 애플, 비자 등 세계 1등 기업들이 불황에도 배당을 올리며 지켜주는 든든한 금고입니다.',
      simpleDescription:
        '10년 연속 배당을 늘린 미국 초대형 우량주에 0.06% 수수료로 투자하여 S&P 500 지수보다 낮은 변동성으로 시장을 따라가는 뱅가드 대표 배당 ETF입니다.',
    },
    mechanism: {
      benchmarkIndex: 'S&P U.S. Dividend Growers Index',
      screeningRules:
        '10년 연속 배당 인상 기업 중 배당률 상위 25%의 위험 종목을 기계적으로 탈락시킨 후 시가총액 가중 편입',
      rebalancingFrequency: '매년 3월 리밸런싱',
      weightingCap: '단일 종목 최대 4% 캡',
      coreDetail:
        '배당률이 지나치게 높은 기업을 오히려 배제함으로써 재무 위험이 있는 부실 기업 편입을 사전에 막아내는 보수적 알고리즘을 사용합니다.',
    },
    strengths: {
      keyTheme: 'S&P 500 지수 대비 낮은 변동성 + 0.06% 최저 수수료 + 우수한 주가 수익률',
      points: [
        '5년 주가 수익률이 시장 지수에 근접할 정도로 주가 성장력이 강력함',
        '하락장에서 낙폭이 시장보다 작아 편안한 장기 보유 가능',
      ],
    },
    risks: {
      warningTitle: '1.7% 수준의 낮은 배당률로 인컴 목적으로는 아쉬움',
      points: [
        '배당금 중심의 현금 수령 투자자에게는 배당률이 너무 낮게 느껴질 수 있음',
      ],
    },
    strategy: {
      idealInvestor: 'VOO(S&P 500) 대신 더 안전하고 배당 성향이 있는 코어 펀드를 찾는 보수적 투자자',
      portfolioRole: '포트폴리오의 심장 (초대형 우량주 베이스)',
      recommendedWeight: '포트폴리오의 30% ~ 50%',
      actionableTip:
        '사회초년생의 첫 적립식 코어 ETF로 추천하며 장기 보유 시 복리 시세차익이 뛰어납니다.',
    },
  },

  // ==========================================
  // [2. 월배당 커버드콜 / 옵션 인컴 그룹 (5종)]
  // ==========================================
  {
    ticker: 'JEPI',
    nameKo: 'JP모건 에쿼티 프리미엄 인컴',
    nameEn: 'JPMorgan Equity Premium Income ETF',
    category: '월배당 커버드콜',
    payoutCycle: '월배당',
    dividendYield: 0.0742,
    fiveYearGrowth: 0.0210,
    expenseRatio: 0.0035,
    currentPriceUSD: 57.80,
    tags: ['월급 배당 대명사', 'ELN 옵션 매도', '하방 완충', '연 7~8% 월분배'],
    analogy: {
      headline: '튼튼한 아파트에 살면서 옥상에 기지국을 설치해 매달 고액 월세를 받는 하이브리드 주택',
      metaphor:
        '자가 아파트(S&P500 가치주 80%)에 거주하며 안정성을 누리고, 옥상 통신사 기지국(ELN 옵션 매도 20%)에서 매달 꼬박꼬박 쏠쏠한 추가 임대 수입을 챙기는 집주인입니다.',
      simpleDescription:
        'JP모건 펀드매니저가 엄선한 저변동 가치주를 보유하면서 콜옵션을 매도해 매월 연 7~8% 수준의 풍부한 월급형 현금흐름을 지급하는 국민 월배당 ETF입니다.',
    },
    mechanism: {
      benchmarkIndex: 'Active Management (S&P 500 저변동 가치주 + ELN 커버드콜)',
      screeningRules:
        'S&P 500 종목 중 변동성이 낮고 펀더멘털이 우수한 가치주 약 80% 매수 + S&P 500 외가격(OTM) 콜옵션을 매도하는 주가연계사채(ELN) 약 20% 편입',
      rebalancingFrequency: '수시 액티브 운용',
      weightingCap: '단일 종목 1.5~2% 균등 분산',
      coreDetail:
        '옵션 프리미엄을 주주에게 매월 배당으로 환원하여 시장이 횡보하거나 완만하게 하락할 때 강력한 수익 방어력을 제공합니다.',
    },
    strengths: {
      keyTheme: '매월 1~5일 입금되는 확실한 월급 + 하락장 옵션 프리미엄 방어력',
      points: [
        '매월 초 일정하게 입금되는 세후 연 7%대 현금흐름으로 생활비 및 고정 지출 해결',
        '2022년 대세 하락장에서 S&P 500(-19%) 대비 훨씬 적은 -11% 하락으로 원금 방어 입증',
      ],
    },
    risks: {
      warningTitle: '상승장에서 주가 상승 상단이 막히는 커버드콜의 태생적 한계',
      points: [
        '옵션을 매도했기 때문에 시장이 20~30% 폭등할 때 주가 상승을 온전히 따라가지 못함',
        '배당성장률이 낮아 장기 보유 시 인플레이션을 이기는 배당 증액 속도는 완만함',
      ],
    },
    strategy: {
      idealInvestor: '지금 당장 매월 안정적인 생활비 인출이 필요한 은퇴자, 파이어족, 대출이자 상환자',
      portfolioRole: '현금흐름 인컴 제너레이터 (Cash Cow)',
      recommendedWeight: '포트폴리오의 20% ~ 40%',
      actionableTip:
        '성장주(VOO, QQQ)나 배당성장주(SCHD)와 바벨 전략으로 묶으면 주가 상승과 월배당 두 마리 토끼를 모두 잡을 수 있습니다.',
    },
  },

  {
    ticker: 'JEPQ',
    nameKo: 'JP모건 나스닥 에쿼티 프리미엄',
    nameEn: 'JPMorgan Nasdaq Equity Premium Income ETF',
    category: '월배당 커버드콜',
    payoutCycle: '월배당',
    dividendYield: 0.0915,
    fiveYearGrowth: 0.0350,
    expenseRatio: 0.0035,
    currentPriceUSD: 55.60,
    tags: ['나스닥 100 기반', '연 9~10% 초고배당', '월배당', '테크 인컴'],
    analogy: {
      headline: '성장성 높은 테크 벤처 빌딩에서 나오는 9~10%대 고수익 월세 파이프라인',
      metaphor:
        '성장 잠재력이 넘치는 판교 테크노밸리 빌딩을 보유하면서 매달 연 9% 이상의 막대한 임대료를 통장에 꽂아 넣는 최첨단 수익형 부동산입니다.',
      simpleDescription:
        '애플, 마이크로소프트, 엔비디아 등 나스닥 100 대형 혁신 기술주를 기초자산으로 하여 커버드콜 옵션 프리미엄을 통해 연 9%대의 초고배당 월급을 지급합니다.',
    },
    mechanism: {
      benchmarkIndex: 'Active Management (나스닥 100 기반 ELN 커버드콜)',
      screeningRules:
        '나스닥 100 지수 구성 기업의 주식을 매수하고 나스닥 콜옵션 매도 ELN을 결합',
      rebalancingFrequency: '월간/수시 액티브 운용',
      weightingCap: '상위 빅테크 5~7% 내외 비중 유지',
      coreDetail:
        '나스닥 지수의 높은 변동성 덕분에 JEPI보다 훨씬 높은 옵션 프리미엄(연 9~10%대)을 확보할 수 있습니다.',
    },
    strengths: {
      keyTheme: '나스닥 기술주의 장기 성장 참여 + 9% 이상의 압도적인 월인컴',
      points: [
        '나스닥 기술주 상승장의 달콤함을 일부 맛보면서 매달 9% 이상의 현금을 인출할 수 있음',
        '원금 회수 속도가 매우 빨라 재투자 시 스노우볼이 기하급수적으로 굴러감',
      ],
    },
    risks: {
      warningTitle: '기술주 폭락장 도래 시 JEPI보다 큰 원금 손실 변동성',
      points: [
        '기술주 중심이라 금리 급등기나 밸류에이션 조정장에서 JEPI 대비 원금 낙폭이 클 수 있음',
      ],
    },
    strategy: {
      idealInvestor: '기술주에 투자하면서도 9%가 넘는 막강한 월 현금흐름을 당장 회수하고 싶은 투자자',
      portfolioRole: '고인컴 부스터',
      recommendedWeight: '포트폴리오의 15% ~ 30%',
      actionableTip:
        'JEPQ에서 나오는 고배당금을 그대로 QQQ나 SCHD를 매수하는 재투자 자금으로 순환시키면 최고의 복리 엔진이 됩니다.',
    },
  },

  {
    ticker: 'SPYI',
    nameKo: '네오스 S&P 500 하이 인컴',
    nameEn: 'NEOS S&P 500 High Income ETF',
    category: '월배당 커버드콜',
    payoutCycle: '월배당',
    dividendYield: 0.1180,
    fiveYearGrowth: 0.0420,
    expenseRatio: 0.0068,
    currentPriceUSD: 50.40,
    tags: ['연 11%대 초고배당', '옵션 스프레드', '상방 개방', '월배당'],
    analogy: {
      headline: '집값 상승분도 챙기면서 최고 수준의 임대료를 놓치지 않는 스마트 빌딩',
      metaphor:
        '기존 커버드콜이 집값 상승을 완전히 포기했다면, SPYI는 옥상 임대료를 최고가로 받으면서도 집값 상승의 일정 부분을 지켜내도록 특수 설계된 스마트 빌딩입니다.',
      simpleDescription:
        '단순 콜옵션 매도가 아닌 옵션 스프레드(Call Spread) 기법을 사용하여 주가 상승 참여율을 높이면서 연 11~12%에 달하는 초고배당을 지급하는 차세대 커버드콜 ETF입니다.',
    },
    mechanism: {
      benchmarkIndex: 'S&P 500 기반 외가격(OTM) 콜옵션 스프레드 액티브 전략',
      screeningRules:
        'S&P 500 주식을 보유하며 외가격(OTM) 콜옵션을 매도하고, 더 높은 행사가격의 콜옵션을 매수하여 상방을 열어두는 스프레드 구조',
      rebalancingFrequency: '월간 롤오버 운용',
      weightingCap: 'S&P 500 시가총액 가중 복제',
      coreDetail:
        '미국 세법 Section 1256 계약을 활용하여 세금 효율성을 극대화하고 자본환급(ROC) 회계를 통해 원금 손실을 방어합니다.',
    },
    strengths: {
      keyTheme: '연 11%대 초고배당 + 기존 커버드콜(JEPI) 대비 월등한 주가 상승 참여력',
      points: [
        '옵션 스프레드 구조 덕분에 대세 상승장에서 JEPI보다 주가가 훨씬 덜 억압당함',
        '매월 말일 11%가 넘는 거액의 월배당이 통장에 꽂혀 원금 회수 기간이 매우 짧음',
      ],
    },
    risks: {
      warningTitle: '0.68%의 다소 높은 운용보수 & 신생 ETF로서의 역사적 검증 필요',
      points: [
        '운용보수가 0.68%로 높은 편이며, 2008년 같은 초대형 금융위기 시기의 장기 트랙레코드가 상대적으로 짧음',
      ],
    },
    strategy: {
      idealInvestor: '연 10% 이상의 극대화된 현금흐름과 주가 상승 여력을 함께 노리는 고인컴 선호자',
      portfolioRole: '현금흐름 극대화 엔진',
      recommendedWeight: '포트폴리오의 10% ~ 20%',
      actionableTip:
        'JEPI의 7% 배당률에 아쉬움을 느끼는 분들에게 훌륭한 대안이며, 배당금으로 SCHD를 모아가는 용도로 적합합니다.',
    },
  },

  {
    ticker: 'QQQI',
    nameKo: '네오스 나스닥 100 하이 인컴',
    nameEn: 'NEOS Nasdaq 100 High Income ETF',
    category: '월배당 커버드콜',
    payoutCycle: '월배당',
    dividendYield: 0.1350,
    fiveYearGrowth: 0.0480,
    expenseRatio: 0.0068,
    currentPriceUSD: 52.80,
    tags: ['연 13~14%대 극대화 배당', '나스닥 옵션 스프레드', '최고속 원금회수', '월배당'],
    analogy: {
      headline: '나스닥 빅테크 엔진 위에 초고출력 현금 분출 파이프를 장착한 특수 차량',
      metaphor:
        '나스닥 100이라는 슈퍼카 엔진을 달고 질주하면서, 트렁크에 장착된 초강력 현금 발전기에서 매달 연 13~14%의 돈다발을 뿜어내는 머신입니다.',
      simpleDescription:
        '나스닥 100 지수를 기초로 NEOS의 특허받은 옵션 스프레드 전략을 적용해, 월배당 ETF 중 최상위권인 연 13~14%대 월분배금을 지급하는 고인컴 끝판왕입니다.',
    },
    mechanism: {
      benchmarkIndex: 'Nasdaq 100 기반 OTM 콜옵션 스프레드 전략',
      screeningRules:
        '나스닥 100 지수 주식 포트폴리오 + NDX 지수 콜옵션 스프레드 매매 결합',
      rebalancingFrequency: '월간 롤오버 운용',
      weightingCap: '나스닥 100 시총 비중 기반',
      coreDetail:
        '나스닥의 높은 내재변동성을 활용해 극대화된 프리미엄을 수취하며 상방 상승 여력을 확보합니다.',
    },
    strengths: {
      keyTheme: '13%를 웃도는 최강의 월배당 + 빠른 현금 회수로 재투자 복리 극대화',
      points: [
        '배당금만으로 약 6~7년이면 투자 원금 100%를 회수할 수 있는 압도적인 현금흐름 속도',
      ],
    },
    risks: {
      warningTitle: '나스닥 급락장에서의 원금 하방 압력 주의',
      points: [
        '나스닥 빅테크 조정장 발생 시 원금 평가액이 감소할 수 있으므로 몰빵 투자는 절대 금물',
      ],
    },
    strategy: {
      idealInvestor: '극대화된 월 현금흐름으로 다른 성장주를 집중 분할 매수하려는 스마트 복리 투자자',
      portfolioRole: '현금 발전기 (Cash Generator)',
      recommendedWeight: '포트폴리오의 10% ~ 15%',
      actionableTip:
        '매월 들어오는 13%대 분배금을 절대 소비하지 말고 VOO나 QQQ로 교차 매수하면 환상적인 포트폴리오가 완성됩니다.',
    },
  },

  {
    ticker: 'DIVO',
    nameKo: '앰플리파이 C-PACE ETF',
    nameEn: 'Amplify C-PACE ETF',
    category: '월배당 커버드콜',
    payoutCycle: '월배당',
    dividendYield: 0.0465,
    fiveYearGrowth: 0.0520,
    expenseRatio: 0.0055,
    currentPriceUSD: 41.20,
    tags: ['선별적 옵션 매도', '주가 상승 보존', '월배당 4.6%', '하이브리드 장인'],
    analogy: {
      headline: '숙련된 자산관리 장인이 시장을 보고 위험할 땐 쉬어가는 수제 맞춤형 펀드',
      metaphor:
        '비가 오나 눈이 오나 기계적으로 옵션을 파는 공장식 펀드가 아니라, 베테랑 매니저가 주가가 고평가된 종목만 골라 옵션을 파는 수제 맞춤형 하이브리드입니다.',
      simpleDescription:
        '미국 20~25개 최고급 우량 배당성장주를 엄선하고, 개별 종목의 주가가 과열되었을 때만 선별적으로 옵션을 매도하여 주가 상승과 연 4.6%대 월배당을 모두 챙깁니다.',
    },
    mechanism: {
      benchmarkIndex: 'Active Management (우량 배당주 + 전술적 개별 콜옵션 매도)',
      screeningRules:
        '배당 증액 역사와 강력한 현금흐름을 갖춘 미국 대형 우량주 20~25개 압축 매수 후 전술적 옵션 매도',
      rebalancingFrequency: '상시 액티브 조절',
      weightingCap: '종목당 3~5% 균등 분산',
      coreDetail:
        '포트폴리오 전체에 옵션을 씌우지 않고 개별 종목 단위로만 옵션을 매도하므로 강세장에서 주가 상승력을 상당 부분 보존합니다.',
    },
    strengths: {
      keyTheme: 'SCHD의 주가 성장력 + JEPI의 월배당 장점을 절충한 가장 이상적인 밸런스',
      points: [
        '커버드콜임에도 불구하고 장기 주가 상승 곡선이 매우 우수함',
        '연 4.5~5% 수준의 탄탄한 월배당으로 굴곡 없는 현금흐름 제공',
      ],
    },
    risks: {
      warningTitle: 'JEPI보다 낮은 배당률 & SCHD보다 살짝 높은 수수료',
      points: [
        '배당률이 4%대 중반이라 초고배당을 기대한 투자자에게는 다소 밋밋할 수 있음',
      ],
    },
    strategy: {
      idealInvestor: '원금 손실을 극도로 두려워하면서도 예금 금리 이상의 안정적인 월배당을 원하는 투자자',
      portfolioRole: '중위험 중수익 밸런서',
      recommendedWeight: '포트폴리오의 20% ~ 30%',
      actionableTip:
        'SCHD의 분기배당 공백이 아쉬우면서도 JEPI의 주가 억압이 싫은 분들에게 최적의 단일 대안입니다.',
    },
  },

  // ==========================================
  // [3. 시장지수 및 대형 성장 그룹 (4종)]
  // ==========================================
  {
    ticker: 'VOO',
    nameKo: '뱅가드 S&P 500 ETF',
    nameEn: 'Vanguard S&P 500 ETF',
    category: '시장지수',
    payoutCycle: '분기배당',
    dividendYield: 0.0145,
    fiveYearGrowth: 0.0575,
    expenseRatio: 0.0003,
    currentPriceUSD: 535.40,
    tags: ['워런 버핏 추천 1위', '미국 500대 기업', '수수료 0.03%', '자본성장의 정석'],
    analogy: {
      headline: '미국이라는 국가의 주식회사 지분을 가장 싼값에 통째로 사서 묻어두는 국가 보증서',
      metaphor:
        '미국 500대 대기업의 주식을 거대한 바구니 하나에 몽땅 쓸어 담아, 미국 경제가 우상향하는 한 무조건 함께 부자가 되는 마법의 열차표입니다.',
      simpleDescription:
        '워런 버핏이 아내에게 남긴 유언장에 전 재산의 90%를 투자하라고 지정한 ETF로, 0.03% 최저 수수료로 미국 경제 전체의 자본 성장을 누립니다.',
    },
    mechanism: {
      benchmarkIndex: 'S&P 500 Index',
      screeningRules:
        '미국 시가총액 상위 500대 기업 중 4개 분기 연속 흑자를 달성한 기업만 편입',
      rebalancingFrequency: '분기별 지수 리밸런싱',
      weightingCap: '시가총액 가중 방식 (애플, MS, 엔비디아 등 상위)',
      coreDetail:
        '부실 기업은 자동으로 퇴출되고 떠오르는 신흥 혁신 기업이 자동으로 편입되는 영구 생존 리밸런싱 메커니즘을 갖추고 있습니다.',
    },
    strengths: {
      keyTheme: '지난 100년간 연평균 복리 10%의 검증된 우상향 + 0.03% 최저보수',
      points: [
        '전 세계 어떤 펀드매니저도 10년 이상 장기로 이기기 힘든 미국 자본주의의 정수',
        '0.03% 수수료로 1억 원을 투자해도 1년 운용보수가 3만 원에 불과함',
      ],
    },
    risks: {
      warningTitle: '1.4%대의 낮은 배당률로 현금 생활을 위해서는 수십억의 목돈 필요',
      points: [
        '현금 인출보다는 전체 자산의 원금 덩어리를 불려 나가는 자본 증식용 자산임',
      ],
    },
    strategy: {
      idealInvestor: '종목 분석 없이 미국 경제의 성장을 가장 안전하게 믿고 평생 모아갈 모든 투자자',
      portfolioRole: '전체 포트폴리오의 영원한 베이스캠프 (30~50%)',
      recommendedWeight: '포트폴리오의 30% ~ 50%',
      actionableTip:
        '젊을 때는 VOO 위주로 자산의 덩어리를 키우고, 은퇴 시점에 JEPI나 SCHD로 교체하는 것이 정석입니다.',
    },
  },

  {
    ticker: 'QQQ',
    nameKo: '인베스코 나스닥 100',
    nameEn: 'Invesco QQQ Trust',
    category: '시장지수',
    payoutCycle: '분기배당',
    dividendYield: 0.0058,
    fiveYearGrowth: 0.1020,
    expenseRatio: 0.0020,
    currentPriceUSD: 495.20,
    tags: ['글로벌 AI 혁신', '빅테크 100개 올인', '10년 수익률 최강', '자본차익 극대화'],
    analogy: {
      headline: '전 세계 혁신과 인공지능(AI)을 선도하는 천재 테크 기업들의 엘리트 연합군',
      metaphor:
        '마이크로소프트, 애플, 엔비디아, 구글, 아마존 등 인류의 미래를 바꾸는 천재들이 모인 실리콘밸리 어벤져스에 직접 투자하는 것입니다.',
      simpleDescription:
        '나스닥 시가총액 상위 100개 비금융 기술주에 집중 투자하여, 지난 10년간 S&P 500을 압도하는 폭발적인 시세 차익을 거둔 성장주의 대명사입니다.',
    },
    mechanism: {
      benchmarkIndex: 'NASDAQ-100 Index',
      screeningRules:
        '나스닥 상장 비금융 대형주 100개 엄선 (금융주 제외)',
      rebalancingFrequency: '매년 12월 리밸런싱, 분기별 비중 점검',
      weightingCap: '수정 시가총액 가중 방식',
      coreDetail:
        '금융주를 배제하고 IT, 통신, 소비재 혁신 기업에 집중되어 혁신 사이클의 수혜를 100% 흡수합니다.',
    },
    strengths: {
      keyTheme: '10년 주가 수익률 압도적 1위 + 글로벌 테크 독점력의 직접적 수혜',
      points: [
        '자본주의 역사상 가장 빠르게 돈을 버는 글로벌 빅테크 혁신에 가장 효율적으로 올라타는 수단',
      ],
    },
    risks: {
      warningTitle: '배당률 0.5%대로 배당 목적 부적합 & 기술주 하락장 시 큰 변동성',
      points: [
        '2022년 금리 인상기처럼 기술주 밸류에이션이 압박받을 때 30% 이상의 큰 하락을 겪을 수 있음',
      ],
    },
    strategy: {
      idealInvestor: '배당금보다는 원금의 폭발적인 시세차익을 최우선 목표로 삼는 2040 투자자',
      portfolioRole: '자산 증식 슈퍼차저 (Growth Engine)',
      recommendedWeight: '포트폴리오의 20% ~ 40%',
      actionableTip:
        'JEPI나 JEPQ 같은 고배당 ETF와 바벨 전략(QQQ 50% + JEPI 50%)으로 묶으면 변동성을 줄이면서 환상적인 성과를 냅니다.',
    },
  },

  {
    ticker: 'DIA',
    nameKo: 'SPDR 다우 존스 산업평균',
    nameEn: 'SPDR Dow Jones Industrial Average ETF',
    category: '시장지수',
    payoutCycle: '월배당',
    dividendYield: 0.0175,
    fiveYearGrowth: 0.0610,
    expenseRatio: 0.0016,
    currentPriceUSD: 432.10,
    tags: ['100년 전통 블루칩', '다우 30개 종목', '지수형 월배당', '탄탄한 방어력'],
    analogy: {
      headline: '100년 넘는 역사를 자랑하는 미국 명품 장수 기업 30곳의 주주가 되어 받는 매월 용돈',
      metaphor:
        '코카콜라, 맥도날드, 보잉, 골드만삭스 등 온갖 경제위기를 이겨낸 미국 전통 명문 기업 30개에서 매달 꼬박꼬박 월배당을 타는 대주주입니다.',
      simpleDescription:
        '100년 역사의 다우존스 30대 전통 우량 블루칩에 투자하며, 시장 지수 ETF 중 드물게 매월 따박따박 월배당을 지급합니다.',
    },
    mechanism: {
      benchmarkIndex: 'Dow Jones Industrial Average Index',
      screeningRules:
        '월스트리트저널 위원회가 선정한 미국 대표 초우량 30대 기업',
      rebalancingFrequency: '수시 점검',
      weightingCap: '주가 가격 가중 방식 (Price-Weighted)',
      coreDetail:
        '시가총액이 아닌 주가에 따라 비중이 결정되어 유나이티드헬스, 골드만삭스 등 고가 주식의 영향력이 큽니다.',
    },
    strengths: {
      keyTheme: '전통 우량주의 신뢰성 + 지수 ETF이면서 매월 들어오는 월배당 편의성',
      points: [
        '기술주 거품 붕괴 시 경기 방어주 비중이 높아 상대적으로 안정적임',
        '매월 배당금이 입금되어 분기배당의 지루함을 해소해 줌',
      ],
    },
    risks: {
      warningTitle: '30개 한정 종목 수 & 주가 가중 방식에 따른 구조적 왜곡 가능성',
      points: [
        '500개 종목의 S&P 500에 비해 분산도가 낮고 특정 비싼 주식에 지수가 휘둘릴 수 있음',
      ],
    },
    strategy: {
      idealInvestor: '지수 투자에 참여하면서도 매월 월급처럼 배당이 들어오는 규칙성을 원하는 투자자',
      portfolioRole: '월배당 시장지수 앵커',
      recommendedWeight: '포트폴리오의 15% ~ 25%',
      actionableTip:
        '월배당 포트폴리오를 구성할 때 기술주(QQQ)와 함께 담으면 훌륭한 밸런스가 유지됩니다.',
    },
  },

  {
    ticker: 'SCHG',
    nameKo: '슈왑 미국 대형 성장주',
    nameEn: 'Schwab U.S. Large-Cap Growth ETF',
    category: '시장지수',
    payoutCycle: '분기배당',
    dividendYield: 0.0042,
    fiveYearGrowth: 0.0980,
    expenseRatio: 0.0004,
    currentPriceUSD: 104.50,
    tags: ['QQQ 대항마', '0.04% 초저보수', '200개 대형 성장주', '극대화 시세차익'],
    analogy: {
      headline: 'QQQ의 장점을 흡수하고 수수료를 1/5로 낮춘 가성비 성장주 머신',
      metaphor:
        '성능은 최고급인데 연비는 경차 수준으로 기름(수수료)을 거의 먹지 않는 최첨단 하이브리드 스포츠카입니다.',
      simpleDescription:
        'QQQ보다 저렴한 0.04% 초저보수로 미국 최고 실적의 대형 성장 기업 200여 개에 분산 투자해 자본 차익을 극대화합니다.',
    },
    mechanism: {
      benchmarkIndex: 'Dow Jones U.S. Large-Cap Growth Total Stock Market Index',
      screeningRules:
        '매출 성장률, EPS 성장률 등 6가지 성장 팩터를 기준으로 대형주 중 상위 성장 기업 200개 선별',
      rebalancingFrequency: '매년 9월 리밸런싱',
      weightingCap: '시가총액 가중 방식',
      coreDetail:
        '나스닥뿐만 아니라 뉴욕증권거래소(NYSE)의 우량 성장 기업까지 폭넓게 포괄합니다.',
    },
    strengths: {
      keyTheme: '0.04% 최저 수준 수수료 + QQQ에 필적하는 폭발적 성장성',
      points: [
        '장기 보유 시 QQQ(0.20%) 대비 수수료 절감 효과가 누적되어 자산이 더 빠르게 불어남',
      ],
    },
    risks: {
      warningTitle: '배당률 0.4%대로 배당 목적 부적합',
      points: [
        '배당금보다는 장기 시세 차익을 노리는 공격적 자산임',
      ],
    },
    strategy: {
      idealInvestor: '수수료에 민감하며 장기 시세차익을 노리는 스마트 청년 투자자',
      portfolioRole: '장기 자본 증식 로켓',
      recommendedWeight: '포트폴리오의 20% ~ 40%',
      actionableTip:
        'SCHD 50% + SCHG 50%로 묶는 슈왑 듀오 조합은 미국 현지에서도 가장 인기 있는 환상의 포트폴리오입니다.',
    },
  },

  // ==========================================
  // [4. 고배당 & 배당귀족 가치주 그룹 (3종)]
  // ==========================================
  {
    ticker: 'NOBL',
    nameKo: '프로셰어즈 S&P 500 배당귀족',
    nameEn: 'ProShares S&P 500 Dividend Aristocrats ETF',
    category: '배당귀족·가치',
    payoutCycle: '분기배당',
    dividendYield: 0.0210,
    fiveYearGrowth: 0.0680,
    expenseRatio: 0.0035,
    currentPriceUSD: 101.80,
    tags: ['25년 연속 증액', '배당귀족 클럽', '동일 가중 분산', '불황 불사조'],
    analogy: {
      headline: '25년 이상 온갖 경제 위기와 전쟁 속에서도 배당을 한 번도 안 깎은 불사조 기업 클럽',
      metaphor:
        'IMF 외환위기, 닷컴버블, 서브프라임 금융위기, 코로나 팬데믹을 모두 겪고도 단 1년도 빠짐없이 주주 배당을 늘려준 미국 최강의 생존 기업들입니다.',
      simpleDescription:
        'S&P 500 기업 중 25년 이상 연속으로 배당금을 늘려온 검증된 배당귀족 67개 기업에 똑같은 금액(동일 가중)으로 분산 투자합니다.',
    },
    mechanism: {
      benchmarkIndex: 'S&P 500 Dividend Aristocrats Index',
      screeningRules:
        '25년 연속 배당 증액 기업 67개 엄선. 최소 40개 이상 종목 유지',
      rebalancingFrequency: '분기별 리밸런싱 (1, 4, 7, 10월)',
      weightingCap: '완전 동일 가중 (Equal-Weighting, 종목당 약 1.5% 동일 배분)',
      coreDetail:
        '동일 가중 방식 덕분에 특정 빅테크 쏠림 없이 모든 산업군에 골고루 분산되는 진정한 분산 투자 효과를 가집니다.',
    },
    strengths: {
      keyTheme: '25년 검증된 절대적 영속성 + 대공황급 위기에서도 배당 삭감 제로',
      points: [
        '불황 속에서도 기업 펀더멘털이 망가지지 않고 배당을 증액해 온 기업들만 남아 심리적 안정감이 최고조',
      ],
    },
    risks: {
      warningTitle: '0.35%로 다소 높은 수수료 & 빅테크 강세장에서 지수 대비 소외',
      points: [
        '빅테크 비중이 낮아 기술주 주도 강세장에서는 S&P 500 대비 수익률이 낮을 수 있음',
      ],
    },
    strategy: {
      idealInvestor: '계좌의 절대적 생존과 장기 배당의 신뢰성을 최우선시하는 보수형 가치 투자자',
      portfolioRole: '불황 대비 안전 방패',
      recommendedWeight: '포트폴리오의 15% ~ 25%',
      actionableTip:
        '금리 인상이나 인플레이션 국면에서 포트폴리오의 흔들림을 잡아주는 훌륭한 닻 역할을 합니다.',
    },
  },

  {
    ticker: 'VYM',
    nameKo: '뱅가드 고배당 수익률 ETF',
    nameEn: 'Vanguard High Dividend Yield ETF',
    category: '배당귀족·가치',
    payoutCycle: '분기배당',
    dividendYield: 0.0285,
    fiveYearGrowth: 0.0620,
    expenseRatio: 0.0006,
    currentPriceUSD: 128.40,
    tags: ['400개 대형 가치주', '0.06% 초저보수', '종합 선물세트', '마음 편한 분산'],
    analogy: {
      headline: '미국 시장에서 배당 잘 주기로 소문난 알짜배기 대형 가치주 400개를 담은 종합 선물세트',
      metaphor:
        '특정 종목에 쏠리지 않고 배당 잘 주는 미국 우량 대기업 400개를 백화점처럼 쓸어 담아 편안하게 배당을 받는 종합 선물세트입니다.',
      simpleDescription:
        '리츠를 제외한 미국 고배당 대형 가치주 400여 개에 0.06% 최저 보수로 분산 투자하여 안정적인 인컴과 경기 방어력을 제공합니다.',
    },
    mechanism: {
      benchmarkIndex: 'FTSE High Dividend Yield Index',
      screeningRules:
        '미국 상장 주식 중 시장 평균 배당률 이상의 상위 종목을 선별하여 시가총액 순 가중',
      rebalancingFrequency: '반기별 리밸런싱 (3월, 9월)',
      weightingCap: '시가총액 가중 방식',
      coreDetail:
        '개별 종목 악재가 전체 포트폴리오에 미치는 영향이 사실상 제로에 가까울 정도로 분산도가 우수합니다.',
    },
    strengths: {
      keyTheme: '0.06% 최저 수수료 + 400개 분산으로 스트레스 제로 투자',
      points: [
        '개별 기업이 배당을 깎아도 다른 수백 개 기업이 받쳐주므로 안정성이 뛰어남',
      ],
    },
    risks: {
      warningTitle: 'SCHD 대비 다소 완만한 배당성장 속도',
      points: [
        '배당성장률이 연 6%대로 SCHD(연 9~10%)에 비해서는 배당 성장 탄력이 다소 완만함',
      ],
    },
    strategy: {
      idealInvestor: '개별 종목 리스크를 극도로 싫어하며 미국 전통 배당주 전반에 잔잔히 묻어둘 투자자',
      portfolioRole: '가치주 저변동 인컴 베이스',
      recommendedWeight: '포트폴리오의 20% ~ 35%',
      actionableTip:
        '주가 변동에 일희일비하기 싫은 은퇴 준비자에게 최고의 편안함을 줍니다.',
    },
  },

  {
    ticker: 'HDV',
    nameKo: '아이셰어즈 코어 고배당 ETF',
    nameEn: 'iShares Core High Dividend ETF',
    category: '배당귀족·가치',
    payoutCycle: '분기배당',
    dividendYield: 0.0345,
    fiveYearGrowth: 0.0480,
    expenseRatio: 0.0008,
    currentPriceUSD: 114.20,
    tags: ['경제적 해자', '재무건전성 스크리닝', '에너지/헬스케어', '하락장 방어 요새'],
    analogy: {
      headline: '아무도 넘볼 수 없는 높은 성벽(경제적 해자)을 치고 돈을 버는 75개 요새 기업',
      metaphor:
        '엑손모빌, 쉐브론, 존슨앤존슨, 버라이즌처럼 사람들이 기름을 넣고, 약을 사고, 통신비를 낼 때마다 독점적으로 돈을 긁어모으는 철옹성 요새 기업들입니다.',
      simpleDescription:
        '모닝스타 기준 재무 건전성이 높고 강력한 경제적 해자를 갖춘 미국 75개 우량 고배당 기업에 집중 투자합니다.',
    },
    mechanism: {
      benchmarkIndex: 'Morningstar Dividend Yield Focus Index',
      screeningRules:
        '모닝스타 경제적 해자(Moat) 등급과 재무 건전성(부도 위험 스크리닝) 통과 기업 중 배당률 상위 75개',
      rebalancingFrequency: '분기별 리밸런싱',
      weightingCap: '배당금 총액 가중 방식',
      coreDetail:
        '에너지, 헬스케어, 통신, 필수소비재 등 경기 침체에도 수요가 줄지 않는 필수 섹터 비중이 높습니다.',
    },
    strengths: {
      keyTheme: '고유가·인플레이션 국면 최강의 방어력 + 3.5%대 견조한 배당',
      points: [
        '인플레이션이 발생해 기름값과 생활물가가 오를 때 주가가 오히려 오르는 독특한 방어력',
      ],
    },
    risks: {
      warningTitle: '전통 섹터 편중으로 기술주 주도 랠리 시 소외감 발생',
      points: [
        '에너지와 통신 섹터 편중도가 높아 유가 급락이나 기술주 강세장에서 지수를 언더퍼폼할 수 있음',
      ],
    },
    strategy: {
      idealInvestor: '포트폴리오의 인플레이션 방어력을 높이고 경기 침체에 대비하려는 헷지형 투자자',
      portfolioRole: '인플레이션 헷지 및 방어주',
      recommendedWeight: '포트폴리오의 10% ~ 20%',
      actionableTip:
        '성장주(QQQ)와 함께 담으면 상호 보완 효과가 극대화되는 상극의 매력이 있습니다.',
    },
  },

  // ==========================================
  // [5. 리츠, 채권, BDC 그룹 (5종)]
  // ==========================================
  {
    ticker: 'O',
    nameKo: '리얼티 인컴 (부동산 리츠)',
    nameEn: 'Realty Income Corporation',
    category: '리츠·채권·BDC',
    payoutCycle: '월배당',
    dividendYield: 0.0525,
    fiveYearGrowth: 0.0345,
    expenseRatio: 0.0,
    currentPriceUSD: 54.30,
    tags: ['30년 연속 월배당 증액', '세븐일레븐 건물주', '트리플 넷 리스', '연 5%대 월세'],
    analogy: {
      headline: '전 세계 수만 개 편의점·마트 건물을 소유하고 매달 월세를 받아 나눠주는 글로벌 건물주',
      metaphor:
        '세븐일레븐, 월마트, 페덱스, 달러제너럴 등 절대 망하지 않을 글로벌 대기업에 건물을 빌려주고, 매달 15일마다 꼬박꼬박 통장에 월세를 입금해 주는 부동산 임대사업자입니다.',
      simpleDescription:
        '30년 이상 매월 배당을 지급하고 매년 배당금을 인상해 온 글로벌 1위 상업용 부동산 리츠로, 제2의 월급을 원하는 배당 투자자들의 영원한 국민주입니다.',
    },
    mechanism: {
      benchmarkIndex: 'NYSE 상장 개별 부동산 투자회사 (REITs)',
      screeningRules:
        '15,000개 이상의 단독 상업용 부동산을 보유하며 임대율 98% 이상 유지',
      rebalancingFrequency: '상시 부동산 포트폴리오 매입/매각',
      weightingCap: '개별 종목 (운용보수 0%)',
      coreDetail:
        '트리플 넷 리스(Triple Net Lease) 계약 구조로 재산세, 건물 보험료, 유지보수 비용을 임차인이 전액 부담하여 경기 변동에도 순이익이 안정적입니다.',
    },
    strengths: {
      keyTheme: '30년 연속 월배당 증액 역사 + 5%대 안정적인 월 현금흐름 파이프라인',
      points: [
        '1년에 12번, 매월 15일경 정확하게 입금되는 배당 규칙성',
        '법률상 이익의 90% 이상을 배당해야 하는 리츠 특성상 확실한 주주 환원',
      ],
    },
    risks: {
      warningTitle: '고금리 장기화 시 차입 조달 비용 증가 및 주가 하방 압력',
      points: [
        '부동산 매입 시 대출을 활용하므로 기준금리가 고공행진할 때 이자 부담이 커지며 주가가 눌릴 수 있음',
      ],
    },
    strategy: {
      idealInvestor: '은퇴 후 매달 국민연금처럼 생활비를 인출해 쓰고 싶은 현금흐름 최우선 투자자',
      portfolioRole: '월세 파이프라인 (Monthly Income)',
      recommendedWeight: '포트폴리오의 15% ~ 25%',
      actionableTip:
        '금리 인하기에는 주가 상승과 배당 증액의 겹경사를 누릴 수 있으므로 저점에서 분할 매수해 모아두면 좋습니다.',
    },
  },

  {
    ticker: 'MAIN',
    nameKo: '메인 스트리트 캐피탈 (BDC)',
    nameEn: 'Main Street Capital Corporation',
    category: '리츠·채권·BDC',
    payoutCycle: '월배당',
    dividendYield: 0.0680,
    fiveYearGrowth: 0.0580,
    expenseRatio: 0.0,
    currentPriceUSD: 51.40,
    tags: ['연 6.8% 정기 월배당', '반기 특별배당 보너스', 'BDC 1위 대장주', '중소기업 대출'],
    analogy: {
      headline: '알짜 중소기업에 돈을 빌려주고 높은 이자와 지분 수익을 챙기는 전문 투자은행',
      metaphor:
        '은행 대출을 받기 힘든 알짜배기 알토란 중소기업에 10%대 고금리로 자금을 빌려주고 지분도 일부 챙겨서, 번 돈을 매달 주주들에게 고배당으로 쏴주는 기업개발금융회사입니다.',
      simpleDescription:
        '미국 BDC(Business Development Company) 업계 1위 기업으로, 연 6.8%의 정기 월배당 외에도 실적이 좋을 때마다 수시로 특별 보너스 배당을 얹어줍니다.',
    },
    mechanism: {
      benchmarkIndex: 'NYSE 상장 BDC (기업개발금융회사)',
      screeningRules:
        '매출 1,000만~1억 5,000만 달러 규모의 미국 건실한 중소기업에 선순위 담보 대출 및 지분 투자 집행',
      rebalancingFrequency: '상시 포트폴리오 관리',
      weightingCap: '200개 이상 기업 분산 대출',
      coreDetail:
        '법률상 법인세를 면제받는 대신 과세 대상 이익의 90% 이상을 배당금으로 주주에게 지급해야 합니다.',
    },
    strengths: {
      keyTheme: '연 6.8% 정기 월배당 + 연 2~4회 터지는 쏠쏠한 특별배당 보너스',
      points: [
        'BDC 업계에서 가장 낮은 내부 운용 비용과 탁월한 대손 관리 능력으로 주가도 장기 우상향',
        '특별배당을 합산할 경우 실질 배당수익률이 연 8~9%에 달함',
      ],
    },
    risks: {
      warningTitle: '경기 침체 심화 시 중소기업 대출 부실화 위험',
      points: [
        '미국 경기가 극도로 악화될 경우 중소기업들의 디폴트 위험이 커져 주가 변동성이 확대될 수 있음',
      ],
    },
    strategy: {
      idealInvestor: '리츠(O)보다 더 공격적인 월배당과 특별배당의 짜릿함을 원하는 고인컴 투자자',
      portfolioRole: '고수익 월배당 인컴 부스터',
      recommendedWeight: '포트폴리오의 10% ~ 15%',
      actionableTip:
        '특별배당이 입금되는 달에 배당금을 재투자하면 보유 주식 수가 눈덩이처럼 빠르게 불어납니다.',
    },
  },

  {
    ticker: 'VNQ',
    nameKo: '뱅가드 부동산 리츠 ETF',
    nameEn: 'Vanguard Real Estate ETF',
    category: '리츠·채권·BDC',
    payoutCycle: '분기배당',
    dividendYield: 0.0410,
    fiveYearGrowth: 0.0380,
    expenseRatio: 0.0013,
    currentPriceUSD: 88.60,
    tags: ['미국 부동산 지도', '데이터센터/물류센터', '160개 리츠 분산', '0.13% 저보수'],
    analogy: {
      headline: '물류창고, 5G 통신탑, 데이터센터, 쇼핑몰 등 미국 전역의 부동산을 통째로 소유하는 패키지',
      metaphor:
        '특정 건물 하나에 올인하지 않고 미국 50개 주 전역의 통신탑(아메리칸타워), 물류창고(프로로지스), 데이터센터(이퀴닉스)를 모조리 담은 종합 부동산 선물세트입니다.',
      simpleDescription:
        '미국에 상장된 160여 개 대표 리츠 기업 전체에 분산 투자하여 연 4% 수준의 배당과 함께 미국 실물 자산 가치 상승을 향유합니다.',
    },
    mechanism: {
      benchmarkIndex: 'MSCI US Investable Market Real Estate 25/50 Index',
      screeningRules:
        '상업용, 주거용, 데이터센터, 통신탑, 헬스케어 등 미국 전역 160여 개 리츠 총망라',
      rebalancingFrequency: '분기별 리밸런싱',
      weightingCap: '시가총액 가중 방식',
      coreDetail:
        '단순 상가뿐 아니라 4차 산업혁명의 필수 인프라인 AI 데이터센터와 통신 타워 비중이 높습니다.',
    },
    strengths: {
      keyTheme: '160개 리츠 분산으로 개별 건물 공실 리스크 제로화 + 연 4%대 인컴',
      points: [
        '0.13% 저렴한 수수료로 미국 부동산 시장 전체의 성장에 손쉽게 분산 투자 가능',
      ],
    },
    risks: {
      warningTitle: '월배당이 아닌 분기배당 & 금리 인상 사이클에 취약',
      points: [
        '개별 리츠(O)와 달리 1년에 4번(3, 6, 9, 12월) 배당을 지급하며, 금리 변동성에 취약함',
      ],
    },
    strategy: {
      idealInvestor: '개별 건물 리스크 없이 미국 부동산 섹터 전반에 안전하게 자산배분하고 싶은 투자자',
      portfolioRole: '대체투자 실물자산 배분',
      recommendedWeight: '포트폴리오의 10% ~ 20%',
      actionableTip:
        '주식과 채권 외에 실물 부동산 자산을 포트폴리오에 10~15% 섞어두면 인플레이션 방어력이 높아집니다.',
    },
  },

  {
    ticker: 'TLT',
    nameKo: '아이셰어즈 20년 이상 미국 국채',
    nameEn: 'iShares 20+ Year Treasury Bond ETF',
    category: '리츠·채권·BDC',
    payoutCycle: '월배당',
    dividendYield: 0.0415,
    fiveYearGrowth: 0.0280,
    expenseRatio: 0.0015,
    currentPriceUSD: 94.80,
    tags: ['미국채 20년물', '금리 인하 시세차익', '주식 폭락 헷지', '안전자산 월배당'],
    analogy: {
      headline: '세상이 무너져도 망하지 않는 미국 연방정부의 20년짜리 차용증을 쥐고 받는 매달 이자',
      metaphor:
        '전 세계에서 가장 신용도가 높은 미국 재무부가 보증하는 20년 만기 차용증을 보관하며, 매달 국가로부터 안전한 달러 월이자를 받는 안전판입니다.',
      simpleDescription:
        '만기 20년 이상의 미국 초장기 국채에 투자하여 연 4% 수준의 월이자를 받으며, 향후 경기 침체나 기준금리 인하 시 폭발적인 채권 매매차익을 노릴 수 있는 대표 안전자산입니다.',
    },
    mechanism: {
      benchmarkIndex: 'ICE U.S. Treasury 20+ Year Bond Index',
      screeningRules:
        '잔존 만기 20년 이상의 미국 재무부 발행 초장기 고정금리 국채만 엄선 편입',
      rebalancingFrequency: '매월 리밸런싱',
      weightingCap: '발행 잔액 가중',
      coreDetail:
        '듀레이션이 약 17년에 달해 시장 금리가 1%포인트 하락할 때 채권 가격이 약 17% 상승하는 강력한 금리 민감도를 가집니다.',
    },
    strengths: {
      keyTheme: '주식 폭락장에서 계좌를 살려주는 궁극의 헷지 수단 + 연 4%대 안전한 달러 월이자',
      points: [
        '경제 위기나 주식 급락 시 안전자산 선호로 주가와 반대로 폭등하는 완벽한 음의 상관관계',
        '국가 부도 위험이 없는 최고 등급의 안전자산이면서 매달 월이자 입금',
      ],
    },
    risks: {
      warningTitle: '긴 듀레이션으로 인해 금리 인상기 주식 이상의 극심한 변동성 발생',
      points: [
        '인플레이션 재발이나 고금리 장기화 시 주식만큼 가격이 크게 떨어질 수 있으므로 장기채 특성을 명확히 이해해야 함',
      ],
    },
    strategy: {
      idealInvestor: '주식 100% 포트폴리오의 폭락 위험을 막아줄 방패와 향후 금리 인하 차익을 노리는 자산배분가',
      portfolioRole: '포트폴리오의 안전판 및 헷지 자산',
      recommendedWeight: '포트폴리오의 15% ~ 30%',
      actionableTip:
        '주식과 TLT를 6:4 또는 7:3으로 섞어두고 정기적으로 리밸런싱하면 시장 위기 때마다 수익률을 크게 방어할 수 있습니다.',
    },
  },

  {
    ticker: 'SGOV',
    nameKo: '아이셰어즈 0-3개월 초단기 국채',
    nameEn: 'iShares 0-3 Month Treasury Bond ETF',
    category: '리츠·채권·BDC',
    payoutCycle: '월배당',
    dividendYield: 0.0510,
    fiveYearGrowth: 0.0450,
    expenseRatio: 0.0007,
    currentPriceUSD: 100.50,
    tags: ['달러 파킹통장', '원금 손실 제로', '연 5%대 확정 월이자', '0.07% 초저보수'],
    analogy: {
      headline: '하루만 돈을 넣어둬도 미국 기준금리 이자를 일할 계산해 꽂아주는 달러 파킹통장',
      metaphor:
        '원금 손실 걱정이 전혀 없는 초안전 달러 파킹통장으로, 놀고 있는 달러 예수금을 넣어두면 매달 연 5%대의 이자를 꼬박꼬박 얹어줍니다.',
      simpleDescription:
        '만기 3개월 이내의 미국 초단기 재무부 국채(T-Bills)에만 투자하여, 주가 변동 위험 없이 미국 기준금리 수준의 안전한 월이자를 챙기는 무위험 현금성 ETF입니다.',
    },
    mechanism: {
      benchmarkIndex: 'ICE 0-3 Month US Treasury Securities Index',
      screeningRules:
        '만기 0~3개월 남은 미국 재무부 발행 초단기 국채만 매수',
      rebalancingFrequency: '매월 롤오버 운용',
      weightingCap: '시가총액 가중',
      coreDetail:
        '듀레이션이 0.1년 미만으로 사실상 0에 수렴하여 금리가 아무리 요동쳐도 주가가 $100에서 거의 변하지 않습니다.',
    },
    strengths: {
      keyTheme: '원금 손실 위험 제로(0)에 수렴 + 연 5%대 확정형 달러 월이자 수령',
      points: [
        '주가가 $100.5 안팎에서 안정적으로 횡보하며 매월 1일경 확실한 이자가 입금됨',
        '0.07% 초저보수로 현금성 자산을 굴리기에 가장 효율적',
      ],
    },
    risks: {
      warningTitle: '시세차익 기대 불가 & 기준금리 인하시 배당수익률 동반 하락',
      points: [
        '주가 상승을 통한 매매차익은 전혀 없으며, 연준이 금리를 내리면 월이자도 비례하여 줄어듦',
      ],
    },
    strategy: {
      idealInvestor: '투자 기회를 엿보며 대기 중인 달러 예수금을 굴리거나 안전한 비상금을 파킹해 둘 투자자',
      portfolioRole: '현금 예수금 파킹 (Cash Alternative)',
      recommendedWeight: '포트폴리오의 10% ~ 20% (비상금 용도)',
      actionableTip:
        '주식 매수 타이밍을 기다리는 동안 증권사 계좌에 그냥 두지 말고 SGOV에 넣어두면 매달 쏠쏠한 달러 이자를 챙길 수 있습니다.',
    },
  },
];

export const ETF_ENCYCLOPEDIA_MAP: Record<string, ETFEncyclopediaItem> = Object.fromEntries(
  ETF_ENCYCLOPEDIA_LIST.map((item) => [item.ticker, item])
);
