PROJECT.md: 미국 배당 ETF 인텔리전스 & 현금흐름 시뮬레이터 플랫폼
1. 프로젝트 개요 (Overview)
목적: 미국 배당성장 ETF(SCHD) 및 고인컴 커버드콜 ETF(JEPI/JEPQ), 핵심 지수 ETF(VOO/QQQ)를 중심으로 미국 주식 배당 투자자에게 실질적인 현금흐름 예측, 배당 재투자(DRIP) 시뮬레이션, 과거 투자 타임머신 역추적, 월 목표 배당 역산, 그리고 ETF 1:1 맞짱 비교 분석을 제공하는 고성능 금융 웹 플랫폼 구축.
핵심 타깃: 미국 직투 배당 투자자, 배당성장 추구자, 조기 은퇴 및 파이어(FIRE)족, 인컴 중심 자산배분 투자자.
운영 원칙:
백엔드 24시간 상주 비용 $0 지향 (Serverless + Edge CDN + BaaS 구조).
클라이언트 사이드 고속 렌더링 및 모바일/데스크톱 반응형 완벽 대응.
비로그인 상태에서도 모든 계산기 및 시뮬레이터 전면 개방 (SEO 극대화 및 커뮤니티 바이럴 유도), 포트폴리오 저장 및 배당 알림 신청 시에만 간편 로그인 유도.
---
2. 기술 스택 및 인프라 (Tech Stack & Architecture)
Frontend / Framework: Next.js 14+ (App Router, Static Export `output: 'export'`)
Styling: Tailwind CSS, Lucide React (Icons)
Chart / Visualization: Recharts, Canvas 2D
Edge Hosting / CDN: Cloudflare Pages (무제한 대역폭, 글로벌 엣지 캐싱, 초저지연 배포)
Backend as a Service (BaaS): Supabase
Database: PostgreSQL (RLS 행 단위 보안 필수 적용)
Auth: Supabase Auth (Google 원클릭 간편 로그인)
Data Pipeline: GitHub Actions + Node.js (TypeScript) + `yahoo-finance2` (미 증시 마감 후 일일 1회 정기 수집 및 Supabase UPSERT)
---
3. UI/UX 디자인 시스템 가이드라인 (Design Tokens)
고급스럽고 신뢰감 있는 금융 데이터 대시보드 룩앤필을 적용합니다.
색상 팔레트 (Color Palette):
Background (Main): `#fbfbfb` / Clean Neutral
Container / Card: `#ffffff` (Subtle Border: `#e5e7eb`, Shadow: `shadow-sm`)
Primary Accent (Deep Brown / Charcoal): `#2a201c` (헤더, 주요 강조 텍스트, Primary 버튼)
Secondary Base (Warm Beige / Tan): `#f5ebe0` (서브 카드 배경, 뱃지, 활성 탭)
Positive / Income (Muted Forest Green): `#2d6a4f` / `#1b4332` (배당금, 수익률, 우위 지표)
Contrast / Alert (Muted Coral): `#c94a29` (배당 삭감 경고, 손실 지표)
타이포그래피 및 레이아웃:
간결하고 밀도 높은 수치 표기 (고정폭 폰트 `font-mono`로 금액 및 수치 표기)
3초 룰 적용: 진입 즉시 시뮬레이션 슬라이더와 결괏값 차트가 직관적으로 인지되는 뷰포트 구성.
---
4. 핵심 6대 기능 명세 (Core Features)
기능 1: 월 목표 배당 역산 계산기 (Target Cash-flow Reverse Calculator)
설명: "매달 세후 100만~300만 원(또는 $1,000~$2,500)을 받으려면 어떤 ETF를 몇 주 사야 할까?"를 정밀 역산.
입력 변수:
목표 월 배당금 (USD 또는 KRW, 세후 실수령액 기준)
대상 ETF 선택 (SCHD, JEPI, JEPQ 등)
매월 추가 매수 가능한 주식 수 (선택 입력)
적용 환율 (기본 1,350원)
출력 결과:
필요 총 매수 주식 수 (올림 계산)
현재가 기준 필요 총 원금 ($ 및 ₩)
연간 세전 배당금, 미국 배당소득세(15% 원천징수), 연간 세후 실수령액
매월 n주 적립 시 목표 달성 예상 소요 기간 (D-day 개월 수) 및 마일스톤(25%, 50%, 75%, 100%) 카드.
기능 2: ETF 1:1 맞짱 비교기 (Head-to-Head Comparator)
설명: 두 개의 핵심 ETF(예: SCHD vs JEPI, VOO vs SCHD, JEPI vs JEPQ)를 나란히 비교하여 지표별 우위를 가려주는 배틀 대시보드.
비교 지표:
시가배당률 (Yield)
5년 배당성장률 (CAGR)
운용보수 (Expense Ratio)
배당 주기 및 지급 패턴 (월배당 vs 분기배당)
5년 주가 상승률 및 배당 재투자 포함 Total Return
출력 결과:
지표별 `승리(WIN)` 배지 및 왕관(👑) 표기
성향별 맞춤 가이드 카드 (예: "3040 장기 성장형" vs "은퇴 세대 즉각 현금흐름형").
기능 3: 과거 ETF 타임머신 계산기 (What-If Historical Simulator)
설명: 과거 특정 시점에 거치식 또는 적립식으로 투자했을 때 현재 총 자산과 배당금을 실제 히스토리 데이터로 역추적.
입력 변수: 대상 ETF, 시작 시점(1/3/5/10년 전 또는 상장일 이후 직접 지정), 초기 투자금, 월 적립액, 배당 재투자(DRIP) 여부 토글.
출력 결과:
총 투자 원금 대비 현재 총 평가액 및 총 수익률 (CAGR)
누적 수령 배당금 총액 (15% 원천징수 차감 후)
원금 대비 현재 배당수익률 (Yield on Cost, YoC)
원금 누적선, 현금 수령선, DRIP 재투자선 3중 비교 차트.
기능 4: SCHD + JEPI/JEPQ 배당 바벨 포트폴리오 최적화기
설명: 자본 성장형(SCHD)과 고인컴형(JEPI/JEPQ)의 비중을 0~100% 슬라이더로 조절.
연산 로직:
포트폴리오 종합 배당률: $\sum (w_i \times Yield_i)$
5년 가중평균 배당성장률: $\sum (w_i \times Growth_i)$
목표 월 배당금 입력 시 필요 총 투자 원금 역산 기능 제공.
프리셋 제공:
은퇴 준비형 (SCHD 70% : JEPI/JEPQ 30%)
밸런스형 (SCHD 50% : JEPI/JEPQ 50%)
은퇴 생활형 (SCHD 30% : JEPI/JEPQ 70%)
기능 5: 배당 재투자(DRIP) 스노우볼 복리 시뮬레이터 (미래 예측)
설명: 향후 투자 기간에 따른 배당금 재투자 시 주식 수 증가와 복리 가속화(Snowball Effect) 곡선 시각화.
연산 엔진 (월 단위 Iteration):
세후 배당금: $\text{세전 배당금} \times 0.85$ (미국 배당소득세 15% 원천징수 필수 반영)
신규 매수 주식 수: $\Delta S_t = \frac{\text{세후 배당금} + \text{월 추가 적립액}}{\text{해당 월 주가}}$
배당 재투자 시 vs 단순 현금 인출 시 10년/20년 후 자산 격차 곡선 렌더링.
기능 6: 월별 배당 캘린더 & 현금흐름 대시보드
설명: 티커별 배당락일(Ex-Date) 및 지급일(Payment Date) 기준 월별 현금흐름 타임라인 렌더링.
주요 표시 항목:
월별 세전 총 배당금 및 실수령액(15% 원천징수 후)
월초 고정 인컴(JEPI/JEPQ 매월 1~7일 지급) vs 분기 보너스 인컴(SCHD 3, 6, 9, 12월 말 지급) 구분 표기
확정 공시(Confirmed) vs 예상치(Estimated) 뱃지 구분.
---
5. 데이터베이스 스키마 명세 (Supabase SQL)
```sql
-- 1. ETF 종목 마스터 테이블
CREATE TABLE IF NOT EXISTS tickers (
    ticker VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    current_price NUMERIC(10, 2) NOT NULL,
    dividend_yield NUMERIC(5, 4) NOT NULL,      -- 시가배당률 (예: 0.0348)
    dividend_growth_5y NUMERIC(5, 4),          -- 5년 배당성장률 (예: 0.0892)
    capital_growth_est NUMERIC(5, 4),          -- 기대 주가 상승률 (예: 0.0500)
    expense_ratio NUMERIC(5, 4) DEFAULT 0.0006, -- 운용보수 (예: 0.0006 = 0.06%)
    frequency VARCHAR(20) NOT NULL,            -- 'monthly', 'quarterly'
    pay_months INT[] NOT NULL,                 -- [1,2..12] 또는 [3,6,9,12]
    five_year_return NUMERIC(6, 4),            -- 5년 주가 수익률
    category VARCHAR(50),                      -- '배당성장', '커버드콜', '지수'
    inception_date DATE,                       -- 상장일
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 배당 일정 및 주당 배당금 (DPS)
CREATE TABLE IF NOT EXISTS dividend_events (
    id BIGSERIAL PRIMARY KEY,
    ticker VARCHAR(10) REFERENCES tickers(ticker) ON DELETE CASCADE,
    ex_date DATE NOT NULL,
    payment_date DATE NOT NULL,
    amount_per_share NUMERIC(10, 4) NOT NULL,
    is_estimated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ticker, ex_date)
);

-- 3. 과거 월별 가격 히스토리 (타임머신 계산기용)
CREATE TABLE IF NOT EXISTS monthly_price_history (
    id BIGSERIAL PRIMARY KEY,
    ticker VARCHAR(10) REFERENCES tickers(ticker) ON DELETE CASCADE,
    date DATE NOT NULL,
    close_price NUMERIC(10, 2) NOT NULL,
    adj_close NUMERIC(10, 2) NOT NULL,
    UNIQUE(ticker, date)
);
CREATE INDEX IF NOT EXISTS idx_price_history_date ON monthly_price_history(ticker, date);

-- 4. 사용자 포트폴리오
CREATE TABLE IF NOT EXISTS user_portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    portfolio_name VARCHAR(50) DEFAULT 'My Dividend Strategy',
    drip_enabled BOOLEAN DEFAULT TRUE,
    monthly_contribution NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 포트폴리오 보유 종목
CREATE TABLE IF NOT EXISTS portfolio_holdings (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id UUID REFERENCES user_portfolios(id) ON DELETE CASCADE,
    ticker VARCHAR(10) REFERENCES tickers(ticker),
    shares NUMERIC(12, 4) NOT NULL,
    avg_price NUMERIC(10, 2),
    target_weight NUMERIC(5, 2),
    UNIQUE(portfolio_id, ticker)
);

-- 6. RLS(행 단위 보안) 정책 활성화
ALTER TABLE tickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividend_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_holdings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for tickers" ON tickers FOR SELECT USING (true);
CREATE POLICY "Allow public read for dividend_events" ON dividend_events FOR SELECT USING (true);
CREATE POLICY "Allow public read for monthly_price_history" ON monthly_price_history FOR SELECT USING (true);
CREATE POLICY "Users can manage own portfolios" ON user_portfolios 
    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own holdings" ON portfolio_holdings 
    FOR ALL USING (
        portfolio_id IN (SELECT id FROM user_portfolios WHERE user_id = auth.uid())
    );
```
---
6. 개발 단계별 체크리스트 (Milestones)
[x] Phase 1: 기반 설정 & 정적 빌드 구성
- [x] Next.js 14 App Router 세팅 (`next.config.mjs`의 `output: 'export'`).
- [x] Tailwind CSS 기반 Dark Brown (`#2a201c`) & Warm Beige (`#f5ebe0`) 테마 구성.
- [x] Supabase 클라이언트 SDK 설정 (`src/lib/supabase.ts`).
[x] Phase 2: 핵심 인터랙티브 UI 컴포넌트 개발
- [x] 월 목표 배당 역산 계산기: 목표 월 실수령액 입력 시 필요 주식수/필요자본/D-day 산출 카드.
- [x] ETF 1:1 맞짱 비교기: 2개 종목 선택 시 지표 대조 테이블 및 우위 승패 판정 뱃지.
- [x] 과거 타임머신 백테스터: 기간 설정기, 거치/적립금 입력 및 Recharts 3중 곡선 차트.
- [x] 바벨 포트폴리오 최적화기: SCHD vs JEPI/JEPQ 비중 슬라이더 및 가중 배당률 산출.
- [x] DRIP 복리 시뮬레이터: 투자 기간별 재투자 vs 인출 스노우볼 차트.
- [x] 월별 배당 캘린더 그리드: 월별 배당금 합산 및 일정 타임라인.
- [x] Phase 3: Supabase 데이터 연동 & 인증
  - [x] 티커 마스터 테이블 및 월별 가격/배당 히스토리 시드 데이터 적재 (`supabase/seed.sql`).
  - [x] 하이브리드 데이터 서비스 레이어 (`src/lib/services/etf-service.ts`) - DB 미연결 시 로컬 목업 즉시 폴백.
  - [x] 포트폴리오 저장 모달 및 Supabase Auth (구글 로그인 + 로컬 데모 체험) 연동 (`src/components/auth/SavePortfolioModal.tsx`, `src/lib/auth/auth-context.tsx`).
- [x] Phase 4: 자동화 파이프라인 & 배포
  - [x] 야후 파이낸스 실시간 시세 및 배당 데이터 자동 동기화 스크립트 (`scripts/sync-dividends.ts`, `npm run sync:etf`).
  - [x] GitHub Actions 기반 일일 정기 크론(KST 07:00) 갱신 워크플로우 등록 (`.github/workflows/sync-dividends.yml`).
  - [x] Cloudflare Pages 정적 배포 번들(`out/`) 최적화 및 404 안내 페이지(`src/app/not-found.tsx`) 구축.