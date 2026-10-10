-- ====================================================================
-- 미국 배당 ETF 인텔리전스 플랫폼: 초기 시드 데이터 (seed.sql)
-- ====================================================================

-- 1. ETF 종목 마스터 테이블 (tickers) 시드 데이터
INSERT INTO tickers (
    ticker, name, current_price, dividend_yield, dividend_growth_5y,
    capital_growth_est, expense_ratio, frequency, pay_months,
    five_year_return, category, inception_date
) VALUES
(
    'SCHD',
    'Schwab U.S. Dividend Equity ETF',
    82.50,
    0.0348, -- 3.48%
    0.0892, -- 8.92%
    0.0550, -- 5.50%
    0.0006, -- 0.06%
    'quarterly',
    ARRAY[3, 6, 9, 12],
    0.5640, -- 56.40%
    '배당성장',
    '2011-10-20'
),
(
    'JEPI',
    'JPMorgan Equity Premium Income ETF',
    57.80,
    0.0742, -- 7.42%
    0.0510, -- 5.10%
    0.0250, -- 2.50%
    0.0035, -- 0.35%
    'monthly',
    ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    0.3820, -- 38.20%
    '고배당 커버드콜',
    '2020-05-20'
),
(
    'JEPQ',
    'JPMorgan Nasdaq Equity Premium Income ETF',
    55.20,
    0.0920, -- 9.20%
    0.0620, -- 6.20%
    0.0350, -- 3.50%
    '0.0035', -- 0.35%
    'monthly',
    ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    0.4450, -- 44.50%
    '기술주 커버드콜',
    '2022-05-03'
),
(
    'VOO',
    'Vanguard S&P 500 ETF',
    535.00,
    0.0132, -- 1.32%
    0.0580, -- 5.80%
    0.0850, -- 8.50%
    0.0003, -- 0.03%
    'quarterly',
    ARRAY[3, 6, 9, 12],
    0.9860, -- 98.60%
    '시장지수',
    '2010-09-07'
),
(
    'QQQ',
    'Invesco QQQ Trust',
    490.00,
    0.0055, -- 0.55%
    0.0740, -- 7.40%
    0.1150, -- 11.50%
    0.0020, -- 0.20%
    'quarterly',
    ARRAY[4, 7, 10, 12],
    1.4520, -- 145.20%
    '기술주 성장지수',
    '1999-03-10'
),
(
    'DIVO',
    'Amplify C-PACE ETF',
    40.50,
    0.0465, -- 4.65%
    0.0480, -- 4.80%
    0.0400, -- 4.00%
    0.0055, -- 0.55%
    'monthly',
    ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    0.4830, -- 48.30%
    '배당성장 커버드콜',
    '2016-12-14'
)
ON CONFLICT (ticker) DO UPDATE SET
    current_price = EXCLUDED.current_price,
    dividend_yield = EXCLUDED.dividend_yield,
    updated_at = NOW();

-- 2. 최근 배당 일정 및 주당 배당금 (dividend_events)
INSERT INTO dividend_events (ticker, ex_date, payment_date, amount_per_share, is_estimated) VALUES
-- SCHD 분기 배당 내역
('SCHD', '2025-03-20', '2025-03-25', 0.6540, false),
('SCHD', '2025-06-20', '2025-06-25', 0.7020, false),
('SCHD', '2025-09-20', '2025-09-25', 0.7250, false),
('SCHD', '2025-12-20', '2025-12-26', 0.7410, false),
('SCHD', '2026-03-20', '2026-03-25', 0.7550, true),
('SCHD', '2026-06-20', '2026-06-25', 0.7720, true),
-- JEPI 월 배당 내역
('JEPI', '2025-10-01', '2025-10-06', 0.3520, false),
('JEPI', '2025-11-01', '2025-11-06', 0.3480, false),
('JEPI', '2025-12-01', '2025-12-05', 0.3610, false),
('JEPI', '2026-01-02', '2026-01-07', 0.3550, false),
('JEPI', '2026-02-02', '2026-02-06', 0.3490, false),
('JEPI', '2026-03-02', '2026-03-06', 0.3580, false),
('JEPI', '2026-04-01', '2026-04-06', 0.3620, true),
-- JEPQ 월 배당 내역
('JEPQ', '2026-01-02', '2026-01-07', 0.4180, false),
('JEPQ', '2026-02-02', '2026-02-06', 0.4250, false),
('JEPQ', '2026-03-02', '2026-03-06', 0.4310, false),
('JEPQ', '2026-04-01', '2026-04-06', 0.4350, true)
ON CONFLICT (ticker, ex_date) DO NOTHING;

-- 3. 과거 월별 가격 히스토리 (monthly_price_history 샘플)
INSERT INTO monthly_price_history (ticker, date, close_price, adj_close) VALUES
('SCHD', '2022-01-01', 77.20, 70.10),
('SCHD', '2022-06-01', 72.50, 66.80),
('SCHD', '2022-12-01', 75.80, 70.50),
('SCHD', '2023-06-01', 72.80, 68.90),
('SCHD', '2023-12-01', 76.50, 73.20),
('SCHD', '2024-06-01', 78.40, 76.10),
('SCHD', '2024-12-01', 82.10, 80.50),
('SCHD', '2025-06-01', 81.90, 81.20),
('SCHD', '2026-01-01', 82.50, 82.50),
('JEPI', '2022-01-01', 61.20, 52.10),
('JEPI', '2023-01-01', 54.50, 48.90),
('JEPI', '2024-01-01', 55.20, 51.50),
('JEPI', '2025-01-01', 56.80, 54.80),
('JEPI', '2026-01-01', 57.80, 57.80)
ON CONFLICT (ticker, date) DO NOTHING;
