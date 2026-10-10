import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 여러 Tailwind CSS 클래스를 충돌 없이 안전하게 합쳐주는 도우미 함수입니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 달러($) 또는 원화(₩) 화폐 단위로 예쁘게 변환해 주는 함수입니다.
 * 예: 1250 -> "$1,250" 또는 "₩1,687,500"
 */
export function formatCurrency(
  amount: number,
  currency: 'USD' | 'KRW' = 'USD',
  minimumFractionDigits = 0
): string {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * 퍼센트(%) 비율로 예쁘게 변환해 주는 함수입니다.
 * 예: 0.0348 -> "3.48%"
 */
export function formatPercent(rate: number, decimals = 2): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}

/**
 * 천 단위 콤마 표기 숫자 포맷터
 * 예: 1500.5 -> "1,500.5"
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: decimals,
  }).format(value);
}
