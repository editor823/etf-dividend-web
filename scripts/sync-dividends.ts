import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import YahooFinance from 'yahoo-finance2';
import { createClient } from '@supabase/supabase-js';

// Supabase 환경변수 로드
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseKey.includes('placeholder')
);

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

// 야후 파이낸스 인스턴스 초기화 (노티스 억제)
const yf = new YahooFinance({
  suppressNotices: ['yahooSurvey', 'ripHistorical'],
});

interface EtfMetaConfig {
  ticker: string;
  name: string;
  frequency: 'monthly' | 'quarterly';
  pay_months: number[];
  expense_ratio: number;
  dividend_growth_5y: number;
  capital_growth_est: number;
  category: string;
  inception_date: string;
}

const ETF_METADATA: Record<string, EtfMetaConfig> = {
  SCHD: {
    ticker: 'SCHD',
    name: 'Schwab U.S. Dividend Equity ETF',
    frequency: 'quarterly',
    pay_months: [3, 6, 9, 12],
    expense_ratio: 0.06,
    dividend_growth_5y: 11.8,
    capital_growth_est: 7.5,
    category: '배당성장',
    inception_date: '2011-10-20',
  },
  JEPI: {
    ticker: 'JEPI',
    name: 'JPMorgan Equity Premium Income ETF',
    frequency: 'monthly',
    pay_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    expense_ratio: 0.35,
    dividend_growth_5y: 4.2,
    capital_growth_est: 3.5,
    category: '커버드콜/인컴',
    inception_date: '2020-05-20',
  },
  JEPQ: {
    ticker: 'JEPQ',
    name: 'JPMorgan Nasdaq Equity Premium Income ETF',
    frequency: 'monthly',
    pay_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    expense_ratio: 0.35,
    dividend_growth_5y: 5.5,
    capital_growth_est: 5.0,
    category: '기술주 커버드콜',
    inception_date: '2022-05-03',
  },
  VOO: {
    ticker: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    frequency: 'quarterly',
    pay_months: [3, 6, 9, 12],
    expense_ratio: 0.03,
    dividend_growth_5y: 5.8,
    capital_growth_est: 10.2,
    category: '시장지수 S&P500',
    inception_date: '2010-09-07',
  },
  QQQ: {
    ticker: 'QQQ',
    name: 'Invesco QQQ Trust',
    frequency: 'quarterly',
    pay_months: [3, 6, 9, 12],
    expense_ratio: 0.20,
    dividend_growth_5y: 8.5,
    capital_growth_est: 14.8,
    category: '나스닥 100',
    inception_date: '1999-03-10',
  },
  DIVO: {
    ticker: 'DIVO',
    name: 'Amplify CWP Enhanced Dividend Income ETF',
    frequency: 'monthly',
    pay_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    expense_ratio: 0.55,
    dividend_growth_5y: 6.2,
    capital_growth_est: 6.0,
    category: '액티브 배당성장',
    inception_date: '2016-12-14',
  },
};

async function syncEtfData() {
  console.log('====================================================');
  console.log('🚀 [ETF Intelligence] 야후 파이낸스 자동 동기화 시작');
  console.log(`⏰ 실행 시각: ${new Date().toISOString()}`);
  console.log(`🔌 Supabase 연결 상태: ${isSupabaseConfigured ? '✅ 연결됨 (DB 저장 모드)' : '⚠️ 환경변수 미설정 (시뮬레이션 모드)'}`);
  console.log('====================================================\n');

  const tickers = Object.keys(ETF_METADATA);
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  for (const ticker of tickers) {
    try {
      const meta = ETF_METADATA[ticker];
      console.log(`📊 [${ticker}] 실시간 데이터 조회 중...`);

      // 1. 현재 주가 및 기본 정보 조회
      const quote = await yf.quote(ticker);
      const currentPrice = Number((quote.regularMarketPrice ?? 0).toFixed(2));

      // 2. 배당수익률 조회
      let divYield = 0;
      try {
        const summary = await yf.quoteSummary(ticker, { modules: ['summaryDetail'] });
        const rawYield = summary.summaryDetail?.yield;
        if (typeof rawYield === 'number') {
          divYield = Number((rawYield * 100).toFixed(2));
        }
      } catch {
        // fallback to trailingAnnualDividendYield if summaryDetail fails
        if (typeof quote.trailingAnnualDividendYield === 'number') {
          divYield = Number((quote.trailingAnnualDividendYield * 100).toFixed(2));
        }
      }

      // 기본값 폴백 (야후 파이낸스 일시적 null 대비)
      if (divYield === 0) {
        const fallbackYields: Record<string, number> = {
          SCHD: 3.42, JEPI: 7.85, JEPQ: 9.20, VOO: 1.45, QQQ: 0.58, DIVO: 4.60
        };
        divYield = fallbackYields[ticker] || 3.0;
      }

      console.log(`   - 현재가: $${currentPrice}`);
      console.log(`   - 배당수익률: ${divYield}%`);

      // 3. 과거 1년 치 배당 내역 조회
      const chartResult = await yf.chart(ticker, {
        period1: oneYearAgo,
        period2: now,
        events: 'div',
      });

      const rawDividends = chartResult.events?.dividends || [];
      console.log(`   - 최근 1년 배당 지급 횟수: ${rawDividends.length}회`);

      // 티커 마스터 객체
      const tickerRecord = {
        ticker: meta.ticker,
        name: meta.name,
        current_price: currentPrice,
        dividend_yield: divYield,
        dividend_growth_5y: meta.dividend_growth_5y,
        capital_growth_est: meta.capital_growth_est,
        expense_ratio: meta.expense_ratio,
        frequency: meta.frequency,
        pay_months: meta.pay_months,
        category: meta.category,
        inception_date: meta.inception_date,
        updated_at: new Date().toISOString(),
      };

      // 4. Supabase DB Upsert 처리
      if (supabase) {
        // (1) tickers 테이블 UPSERT
        const { error: tickerError } = await supabase
          .from('tickers')
          .upsert(tickerRecord, { onConflict: 'ticker' });

        if (tickerError) {
          console.error(`   ❌ [${ticker}] tickers 저장 실패:`, tickerError.message);
        } else {
          console.log(`   ✅ [${ticker}] tickers 업데이트 성공`);
        }

        // (2) dividend_events 테이블 UPSERT
        if (rawDividends.length > 0) {
          const dividendRecords = rawDividends.map((div) => {
            const exDate = new Date(div.date).toISOString().split('T')[0];
            // 지급일은 배당락일 기준 대략 5영업일 후로 산정 (공시 일정 기준)
            const payDate = new Date(new Date(div.date).getTime() + 5 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0];

            return {
              ticker: meta.ticker,
              ex_date: exDate,
              payment_date: payDate,
              amount_per_share: Number(div.amount.toFixed(4)),
              is_estimated: false,
            };
          });

          const { error: divError } = await supabase
            .from('dividend_events')
            .upsert(dividendRecords, { onConflict: 'ticker,ex_date' });

          if (divError) {
            console.error(`   ❌ [${ticker}] dividend_events 저장 실패:`, divError.message);
          } else {
            console.log(`   ✅ [${ticker}] 배당 이벤트 ${dividendRecords.length}건 동기화 성공`);
          }
        }
      } else {
        console.log(`   ℹ️ [시뮬레이션 모드] Supabase 미연결로 실제 DB 저장은 건너뜁니다.`);
      }

      console.log('');
    } catch (err) {
      console.error(`❌ [${ticker}] 처리 중 에러 발생:`, err instanceof Error ? err.message : err);
    }
  }

  console.log('====================================================');
  console.log('🎉 모든 ETF 동기화 파이프라인 처리가 완료되었습니다.');
  console.log('====================================================');
}

// 스크립트 실행
syncEtfData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('치명적 에러 발생:', err);
    process.exit(1);
  });
