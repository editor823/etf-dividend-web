/**
 * 실시간 ETF 시세 & 배당률 클라이언트 캐싱 서비스
 * 경로: src/lib/services/realtime-quotes.ts
 */

import { ETFItem } from '@/data/etfList';

export interface LiveQuote {
  ticker: string;
  price: number;
  changePercent: number;
  dividendYield: number; // 0.0348 형태
  exDividendDate: string | null;
}

interface CachePayload {
  timestamp: number;
  data: Record<string, LiveQuote>;
}

const CACHE_KEY = 'dividend_intel_live_quotes_v1';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1시간 (3600초)

/**
 * 로컬 캐시 조회
 */
export function getCachedQuotes(): { data: Record<string, LiveQuote>; updatedAt: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: CachePayload = JSON.parse(raw);
    const now = Date.now();
    if (now - parsed.timestamp < CACHE_DURATION_MS) {
      return {
        data: parsed.data,
        updatedAt: new Date(parsed.timestamp).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    }
  } catch {
    // 캐시 파싱 에러 무시
  }
  return null;
}

/**
 * 실시간 시세 조회 및 캐싱
 */
export async function fetchLiveQuotes(
  tickers?: string[],
  force: boolean = false
): Promise<{ data: Record<string, LiveQuote>; updatedAt: string; isFromCache: boolean }> {
  // 1. 강제 갱신이 아니면 로컬 캐시 먼저 확인
  if (!force) {
    const cached = getCachedQuotes();
    if (cached && Object.keys(cached.data).length > 0) {
      return {
        data: cached.data,
        updatedAt: cached.updatedAt,
        isFromCache: true,
      };
    }
  }

  // 2. API 호출 (/api/etf/quotes 시도 후 404면 /api/etf/quotes.json 시도)
  let response = await fetch(`/api/etf/quotes`, {
    cache: 'no-store',
  }).catch(() => null);

  if (!response || !response.ok) {
    response = await fetch(`/api/etf/quotes.json`, {
      cache: 'no-store',
    }).catch(() => null);
  }

  if (!response || !response.ok) {
    throw new Error('시세 서버 응답 실패');
  }

  const json = await response.json();
  if (!json.success || !json.data) {
    throw new Error(json.error || '시세 데이터를 가져오지 못했습니다.');
  }

  const data: Record<string, LiveQuote> = json.data;
  const now = Date.now();

  // 3. 로컬 캐시 저장
  if (typeof window !== 'undefined') {
    try {
      const payload: CachePayload = {
        timestamp: now,
        data,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch {
      // 용량 초과 등 로컬스토리지 예외 방어
    }
  }

  const formattedTime = new Date(now).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    data,
    updatedAt: formattedTime,
    isFromCache: false,
  };
}

/**
 * 정적 ETF 목록과 실시간 조회 데이터를 안전하게 병합
 */
export function mergeQuotesWithEtfList(
  originalList: ETFItem[],
  liveQuotes: Record<string, LiveQuote>
): ETFItem[] {
  if (!liveQuotes || Object.keys(liveQuotes).length === 0) {
    return originalList;
  }

  return originalList.map((item) => {
    const live = liveQuotes[item.ticker];
    if (!live) return item;

    // 주가 반영 (0보다 큰 유효 가격일 때만)
    const currentPriceUSD = live.price > 0 ? live.price : item.currentPriceUSD;
    
    // 배당수익률 반영 (너무 비정상적인 0이나 오류값 방어)
    const dividendYield =
      live.dividendYield > 0.001 ? live.dividendYield : item.dividendYield;

    return {
      ...item,
      currentPriceUSD,
      currentPrice: currentPriceUSD,
      dividendYield,
    };
  });
}
