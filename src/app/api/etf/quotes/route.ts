import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

// Next.js 14 정적 내보내기(output: export) 호환: 빌드 및 엣지 정적 캐싱 (1시간)
export const dynamic = 'force-static';
export const revalidate = 3600;

// Yahoo Finance 인스턴스 (노티스 억제)
const yf = new YahooFinance({
  suppressNotices: ['yahooSurvey', 'ripHistorical'],
});

export async function GET() {
  try {
    // 20개 대표 ETF 티커 목록
    const defaultTickers = [
      'SCHD', 'DGRO', 'VIG',
      'JEPI', 'JEPQ', 'SPYI', 'QQQI', 'DIVO',
      'VOO', 'QQQ', 'DIA', 'SCHG',
      'NOBL', 'VYM', 'HDV',
      'O', 'VNQ', 'TLT', 'SGOV', 'MAIN'
    ];

    const tickers = defaultTickers;

    const quotesData: Record<
      string,
      {
        ticker: string;
        price: number;
        changePercent: number;
        dividendYield: number; // 0.0348 형태 (소수점)
        exDividendDate: string | null;
      }
    > = {};

    // 병렬로 각 티커의 실시간 시세 및 배당 정보 조회
    await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const quote = await yf.quote(ticker);
          const currentPrice = Number((quote.regularMarketPrice ?? 0).toFixed(2));
          const changePercent = Number((quote.regularMarketChangePercent ?? 0).toFixed(2));

          let divYield = 0;
          try {
            const summary = await yf.quoteSummary(ticker, { modules: ['summaryDetail'] });
            const rawYield = summary.summaryDetail?.yield;
            if (typeof rawYield === 'number') {
              divYield = rawYield;
            }
          } catch {
            if (typeof quote.trailingAnnualDividendYield === 'number') {
              divYield = quote.trailingAnnualDividendYield;
            }
          }

          let exDividendDate: string | null = null;
          if (quote.exDividendDate) {
            try {
              exDividendDate = new Date(quote.exDividendDate).toISOString().split('T')[0];
            } catch {
              exDividendDate = null;
            }
          }

          if (currentPrice > 0) {
            quotesData[ticker] = {
              ticker,
              price: currentPrice,
              changePercent,
              dividendYield: Number(divYield.toFixed(4)),
              exDividendDate,
            };
          }
        } catch (err) {
          console.warn(`[API /api/etf/quotes] ${ticker} 조회 건너뜀:`, err instanceof Error ? err.message : err);
        }
      })
    );

    return NextResponse.json(
      {
        success: true,
        updatedAt: new Date().toISOString(),
        total: Object.keys(quotesData).length,
        data: quotesData,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (err) {
    console.error('[API /api/etf/quotes] 치명적 오류:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : '실시간 시세 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
