# 🌐 Finance MCP (Model Context Protocol) 연동 및 활용 가이드

본 문서는 **Antigravity IDE**의 AI 에이전트가 실시간 미국 주식 및 배당 ETF 데이터를 안전하게 직접 조회하여, 신규 종목 등록이나 데이터 검증을 수행할 수 있도록 지원하는 **Finance MCP 연동 가이드**입니다.

---

## 💡 1. Finance MCP란 무엇인가요? (초보자를 위한 쉬운 개념)

- **MCP (Model Context Protocol)**는 AI 에이전트가 외부 데이터 소스나 도구와 표준화된 방식으로 소통할 수 있게 해주는 **"AI 전용 플러그인 규격"**입니다.
- AI가 인터넷 브라우저를 일일이 켜서 주가를 검색할 필요 없이, **야후 파이낸스(Yahoo Finance) 실시간 서버와 직통 파이프라인**을 연결하여 최신 주가, 배당수익률, 운용보수, 배당락일을 1초 만에 쿼리하고 코드로 생성할 수 있습니다.

---

## ⚙️ 2. 환경 설정 파일 구성

프로젝트 루트의 [`.antigravity/mcp_config.json`](file:///e:/ETF%20web/.antigravity/mcp_config.json) 및 [`mcp.json`](file:///e:/ETF%20web/mcp.json)에 아래와 같이 구성되어 있습니다:

```json
{
  "mcpServers": {
    "yfinance": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-yfinance"
      ]
    }
  }
}
```

- 별도의 파이썬 환경이나 무거운 라이브러리를 설치할 필요 없이, Node.js의 `npx` 명령어를 통해 최신 야후 파이낸스 MCP 서버를 즉시 기동합니다.

---

## 🎯 3. AI 에이전트 실전 활용 프롬프트 예시

새로운 초고배당 ETF(예: **CONY**, **TSLY**)나 신규 상장 종목을 우리 사이트에 추가하고 싶을 때, AI에게 아래와 같이 요청하시면 됩니다.

### 💬 프롬프트 예시 1: 신규 종목 실시간 데이터 단독 조회
> "yfinance MCP 툴을 사용해서 **CONY(일드맥스 코인베이스 옵션 인컴)**와 **TSLY(일드맥스 테슬라 옵션 인컴)**의 실시간 현재가, 최신 12개월 배당수익률, 연간 운용보수(Expense Ratio), 배당 지급 주기를 조회해 줘."

### 💬 프롬프트 예시 2: 실시간 데이터 기반 코드 자동 등록
> "yfinance MCP로 **CONY**의 실시간 주가와 배당률을 조회한 뒤, 이 데이터를 바탕으로 `src/data/etfList.ts`의 `ETF_LIST`에 초고배당 커버드콜 종목으로 신규 추가해 줘. 그리고 `src/data/etfSemanticEmbeddings.ts`에도 8차원 시맨틱 벡터 프로필을 생성해 줘."

### 💬 프롬프트 예시 3: 기존 20개 ETF 데이터 일괄 무결성 검증
> "yfinance MCP를 활용해서 `src/data/etfList.ts`에 등록된 SCHD, JEPI, JEPQ의 현재 주가와 배당률이 실제 시장 수치와 오차가 없는지 대조하고, 변경이 필요한 항목을 리포트해 줘."

---

## 🔄 4. AI 에이전트 내부 실행 프로세스

사용자가 위 프롬프트를 전송하면 AI 에이전트는 아래 3단계로 작업을 자동 수행합니다:

1. **[데이터 쿼리]** `yfinance` MCP 툴을 호출하여 해당 티커의 종합 재무 객체를 수신
   - `regularMarketPrice`: 현재 주가 ($)
   - `trailingAnnualDividendYield`: 최근 1년 배당수익률
   - `expenseRatio` / `netExpenseRatio`: 총 연간 운용보수
   - `exDividendDate`: 최근 또는 차기 배당락일
2. **[데이터 정제]** 우리 서비스의 TypeScript 데이터 모델([src/data/etfList.ts](file:///e:/ETF%20web/src/data/etfList.ts)) 규격에 맞게 변환
   ```typescript
   {
     ticker: 'CONY',
     name: '일드맥스 코인베이스 옵션 인컴 (YieldMax COIN Option Income)',
     nameEn: 'YieldMax COIN Option Income Strategy ETF',
     category: '월배당·커버드콜',
     currentPriceUSD: 16.45,
     dividendYield: 0.6540, // 65.4%
     payoutCycle: '월배당',
     fiveYearGrowth: 0.05,
     expenseRatio: 0.0099, // 0.99%
   }
   ```
3. **[빌드 및 검증]** 코드 파일에 안전하게 반영하고 `npm run build`를 실행하여 린트/타입 에러가 없는지 자체 검증 후 커밋.

---

## 🛡️ 5. 유의사항 및 베스트 프랙티스

1. **옵션 합성 ETF(일드맥스 등)의 배당률 특성:**
   - CONY, TSLY 등 초고배당 커버드콜 ETF는 매달 분배금 변동 폭이 매우 큽니다.
   - MCP 조회 시 최근 분배금 연환산 기준인지, 과거 12개월 실지급 합산 기준인지 확인하고 사용자에게 주가 변동 위험(NAV 잠식) 안내 문구를 함께 작성하도록 요청하는 것이 좋습니다.
2. **오프라인/정적 빌드 환경 호환:**
   - 우리 서비스는 클라우드플레어 정적 호스팅(`output: 'export'`) 환경이므로, MCP를 통해 조회한 최신 데이터는 코드에 안전하게 커밋되거나 `/api/etf/quotes` 정적 엔드포인트와 동기화됩니다.
