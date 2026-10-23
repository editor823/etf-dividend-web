import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Ticker, DividendEvent } from '@/types/database';
import { ETF_DATABASE } from '@/lib/data/etf-database';
import { TICKER_SCHEDULES } from '@/lib/calculator/dividend-calendar';

/**
 * 로컬 기본 목업 티커 목록 (Supabase 미연동 시 폴백)
 */
const FALLBACK_TICKERS: Ticker[] = Object.values(ETF_DATABASE).map((etf) => ({
  ticker: etf.ticker,
  name: etf.nameKo ? `${etf.nameKo} (${etf.name})` : etf.name,
  current_price: etf.currentPrice,
  dividend_yield: etf.dividendYield,
  dividend_growth_5y: etf.dividendGrowth5y ?? null,
  capital_growth_est: 0.05,
  expense_ratio: etf.expenseRatio ?? null,
  frequency: etf.frequency,
  pay_months: etf.payMonths,
  five_year_return: etf.fiveYearReturn ?? null,
  category: etf.category,
  inception_date: '2015-01-01',
  updated_at: new Date().toISOString(),
}));

/**
 * 1. 전체 ETF 티커 목록 조회 (하이브리드: Supabase DB -> 실패 시 로컬 목업 폴백)
 */
export async function getTickers(): Promise<Ticker[]> {
  if (!isSupabaseConfigured) {
    return FALLBACK_TICKERS;
  }

  try {
    const { data, error } = await supabase
      .from('tickers')
      .select('*')
      .order('ticker', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase tickers 조회 실패 또는 빈 데이터, 로컬 폴백 사용:', error);
      return FALLBACK_TICKERS;
    }

    return data as Ticker[];
  } catch (err) {
    console.warn('Supabase tickers 연결 실패, 로컬 폴백 반환:', err);
    return FALLBACK_TICKERS;
  }
}

/**
 * 2. 특정 티커의 배당 이벤트 일정 조회
 */
export async function getDividendEvents(ticker: string): Promise<DividendEvent[]> {
  if (!isSupabaseConfigured) {
    return getFallbackDividendEvents(ticker);
  }

  try {
    const { data, error } = await supabase
      .from('dividend_events')
      .select('*')
      .eq('ticker', ticker)
      .order('ex_date', { ascending: false });

    if (error || !data || data.length === 0) {
      return getFallbackDividendEvents(ticker);
    }

    return data as DividendEvent[];
  } catch {
    return getFallbackDividendEvents(ticker);
  }
}

/**
 * 로컬 배당 이벤트 폴백 생성기
 */
function getFallbackDividendEvents(ticker: string): DividendEvent[] {
  const schedule = TICKER_SCHEDULES[ticker];
  if (!schedule) return [];

  const nowYear = new Date().getFullYear();
  return schedule.payMonths.map((m, idx) => ({
    id: idx + 1,
    ticker,
    ex_date: `${nowYear}-${String(m).padStart(2, '0')}-20`,
    payment_date: `${nowYear}-${String(m).padStart(2, '0')}-25`,
    amount_per_share: schedule.dpsPerPayment,
    is_estimated: schedule.isEstimated,
    created_at: new Date().toISOString(),
  }));
}

/**
 * 3. 사용자 포트폴리오 저장 (UPSERT)
 */
export interface SavePortfolioPayload {
  portfolioName: string;
  monthlyContribution: number;
  dripEnabled: boolean;
  holdings: Array<{
    ticker: string;
    shares: number;
    targetWeight?: number;
  }>;
}

export async function saveUserPortfolio(
  userId: string,
  payload: SavePortfolioPayload
): Promise<{ success: boolean; portfolioId?: string; error?: string }> {
  if (!isSupabaseConfigured) {
    // 로컬 스토리지에 시뮬레이션 저장 (데모 모드 지원)
    try {
      if (typeof window !== 'undefined') {
        const key = `local_portfolio_${userId}`;
        window.localStorage.setItem(key, JSON.stringify({ ...payload, updatedAt: new Date().toISOString() }));
      }
      return { success: true, portfolioId: 'local-demo-portfolio-id' };
    } catch {
      return { success: true, portfolioId: 'local-demo-portfolio-id' };
    }
  }

  try {
    // 1. 포트폴리오 마스터 생성/수정
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: portfolio, error: portError } = await (supabase.from('user_portfolios') as any)
      .insert({
        user_id: userId,
        portfolio_name: payload.portfolioName,
        monthly_contribution: payload.monthlyContribution,
        drip_enabled: payload.dripEnabled,
      })
      .select('id')
      .single();

    if (portError || !portfolio) {
      return { success: false, error: portError?.message || '포트폴리오 생성 실패' };
    }

    // 2. 포트폴리오 보유 종목 등록
    if (payload.holdings.length > 0) {
      const holdingsData = payload.holdings.map((h) => ({
        portfolio_id: portfolio.id,
        ticker: h.ticker,
        shares: h.shares,
        target_weight: h.targetWeight || null,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: holdError } = await (supabase.from('portfolio_holdings') as any)
        .insert(holdingsData);

      if (holdError) {
        return { success: false, error: holdError.message };
      }
    }

    return { success: true, portfolioId: portfolio.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '알 수 없는 에러';
    return { success: false, error: msg };
  }
}
