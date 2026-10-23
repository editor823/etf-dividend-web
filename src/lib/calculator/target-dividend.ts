import { ETF_DATABASE, ETFMasterData } from '@/lib/data/etf-database';

/**
 * ETF 기본 정보 인터페이스 (확장 마스터 데이터 모델 연동)
 */
export type ETFInfo = ETFMasterData;

/**
 * 기본 제공되는 17종 핵심 미국 배당 및 지수 ETF/주식 데이터셋
 */
export const POPULAR_ETFS: Record<string, ETFInfo> = ETF_DATABASE;

/**
 * 계산기 입력 파라미터
 */
export interface TargetDividendInput {
  targetMonthlyAmount: number; // 목표 월 배당금
  currency: 'KRW' | 'USD'; // 입력 통화
  ticker: string; // 대상 ETF 티커
  customPrice?: number; // 직접 수정한 현재가 (선택)
  customYield?: number; // 직접 수정한 배당률 (선택)
  monthlySharesToAdd: number; // 매월 추가 적립 매수할 주식 수
  exchangeRate: number; // 원/달러 환율 (기본: 1,350)
}

/**
 * 4단계 마일스톤 항목
 */
export interface MilestoneStep {
  percent: number; // 25, 50, 75, 100
  label: string; // "1단계", "2단계" 등
  shares: number; // 해당 단계 도달 시 누적 주식 수
  totalCapitalUSD: number; // 필요 자본금 ($)
  totalCapitalKRW: number; // 필요 자본금 (₩)
  monthlyNetDividendUSD: number; // 해당 단계 도달 시 월 세후 배당금 ($)
  monthlyNetDividendKRW: number; // 해당 단계 도달 시 월 세후 배당금 (₩)
  monthsToReach: number; // 소요 개월 수
  targetDate: string; // 도달 예상 날짜 (YYYY년 M월)
}

/**
 * 계산기 결과 인터페이스
 */
export interface TargetDividendResult {
  etf: ETFInfo;
  exchangeRate: number;
  inputMonthlyTargetUSD: number;
  inputMonthlyTargetKRW: number;
  
  // 핵심 산출값
  requiredShares: number; // 필요 총 주식 수 (올림)
  totalCapitalUSD: number; // 필요 원금 ($)
  totalCapitalKRW: number; // 필요 원금 (₩)
  
  // 연간 배당 상세 (15% 원천징수 적용)
  annualGrossDividendUSD: number; // 연간 세전 배당 총액 ($)
  annualTaxUSD: number; // 미국 배당세 15% ($)
  annualNetDividendUSD: number; // 연간 세후 실수령액 ($)
  
  monthlyNetDividendUSD: number; // 월 세후 실수령액 ($)
  monthlyNetDividendKRW: number; // 월 세후 실수령액 (₩)

  // 1주당 지표
  dividendPerShareAnnualUSD: number; // 1주당 연간 배당금 (DPS)
  netDividendPerShareAnnualUSD: number; // 1주당 연간 세후 배당금
  
  // 적립 계획 & D-Day
  monthlySharesToAdd: number;
  monthsToTarget: number; // 목표 달성까지 소요 개월
  yearsAndMonths: string; // "N년 M개월"
  targetDDayDate: string; // "YYYY년 M월"
  
  // 마일스톤 (25%, 50%, 75%, 100%)
  milestones: MilestoneStep[];
}

/**
 * 미국 배당소득세율 (15% 원천징수)
 */
export const US_DIVIDEND_TAX_RATE = 0.15;

/**
 * 개월 수를 'N년 M개월' 포맷 문자열로 변환하는 도우미
 */
function formatDuration(months: number): string {
  if (months <= 0) return '달성 완료';
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) return `${remainingMonths}개월`;
  if (remainingMonths === 0) return `${years}년`;
  return `${years}년 ${remainingMonths}개월`;
}

/**
 * 현재 시점으로부터 N개월 후의 날짜를 'YYYY년 M월'로 변환
 */
function calculateTargetDate(monthsToAdd: number): string {
  const now = new Date();
  const future = new Date(now.getFullYear(), now.getMonth() + monthsToAdd, 1);
  return `${future.getFullYear()}년 ${future.getMonth() + 1}월`;
}

/**
 * 월 목표 배당 역산 계산 함수
 * - 미국 배당소득세(15% 원천징수)를 고려하여 순수 세후 실수령액 기준으로 정밀 역산합니다.
 */
export function calculateTargetDividend(input: TargetDividendInput): TargetDividendResult {
  const {
    targetMonthlyAmount,
    currency,
    ticker,
    customPrice,
    customYield,
    monthlySharesToAdd,
    exchangeRate,
  } = input;

  const baseEtf = POPULAR_ETFS[ticker] || POPULAR_ETFS['SCHD'];
  const price = customPrice !== undefined && customPrice > 0 ? customPrice : baseEtf.currentPrice;
  const yieldRate = customYield !== undefined && customYield > 0 ? customYield : baseEtf.dividendYield;

  const currentEtf: ETFInfo = {
    ...baseEtf,
    currentPrice: price,
    dividendYield: yieldRate,
  };

  // 목표 월 배당금 달러/원화 통일
  const inputMonthlyTargetUSD =
    currency === 'USD' ? targetMonthlyAmount : targetMonthlyAmount / exchangeRate;
  const inputMonthlyTargetKRW =
    currency === 'KRW' ? targetMonthlyAmount : targetMonthlyAmount * exchangeRate;

  // 1주당 연간 배당금 (DPS)
  const dividendPerShareAnnualUSD = price * yieldRate;
  // 1주당 연간 세후 배당금 (15% 원천징수 후)
  const netDividendPerShareAnnualUSD = dividendPerShareAnnualUSD * (1 - US_DIVIDEND_TAX_RATE);

  // 목표 연간 세후 실수령 배당금 ($)
  const annualTargetNetUSD = inputMonthlyTargetUSD * 12;

  // 필요 주식 수 = 올림(목표 연간 세후 배당금 / 1주당 연간 세후 배당금)
  const requiredShares =
    netDividendPerShareAnnualUSD > 0
      ? Math.ceil(annualTargetNetUSD / netDividendPerShareAnnualUSD)
      : 0;

  // 필요 자본금
  const totalCapitalUSD = requiredShares * price;
  const totalCapitalKRW = totalCapitalUSD * exchangeRate;

  // 연간 배당금 총액
  const annualGrossDividendUSD = requiredShares * dividendPerShareAnnualUSD;
  const annualTaxUSD = annualGrossDividendUSD * US_DIVIDEND_TAX_RATE;
  const annualNetDividendUSD = annualGrossDividendUSD - annualTaxUSD;

  // 월 세후 실수령액
  const monthlyNetDividendUSD = annualNetDividendUSD / 12;
  const monthlyNetDividendKRW = monthlyNetDividendUSD * exchangeRate;

  // 적립 기간 계산
  const safeMonthlyAdd = Math.max(0, monthlySharesToAdd);
  const monthsToTarget =
    safeMonthlyAdd > 0 ? Math.ceil(requiredShares / safeMonthlyAdd) : 0;
  const yearsAndMonths = formatDuration(monthsToTarget);
  const targetDDayDate = calculateTargetDate(monthsToTarget);

  // 4단계 마일스톤 생성
  const milestonePercentages = [25, 50, 75, 100];
  const milestoneLabels = ['1단계: 첫걸음', '2단계: 도약기', '3단계: 가속기', '4단계: 목표 달성'];

  const milestones: MilestoneStep[] = milestonePercentages.map((percent, idx) => {
    const stepShares = Math.ceil(requiredShares * (percent / 100));
    const stepCapitalUSD = stepShares * price;
    const stepCapitalKRW = stepCapitalUSD * exchangeRate;
    const stepAnnualNetUSD = stepShares * netDividendPerShareAnnualUSD;
    const stepMonthlyNetUSD = stepAnnualNetUSD / 12;
    const stepMonthlyNetKRW = stepMonthlyNetUSD * exchangeRate;
    const stepMonths = safeMonthlyAdd > 0 ? Math.ceil(stepShares / safeMonthlyAdd) : 0;

    return {
      percent,
      label: milestoneLabels[idx],
      shares: stepShares,
      totalCapitalUSD: stepCapitalUSD,
      totalCapitalKRW: stepCapitalKRW,
      monthlyNetDividendUSD: stepMonthlyNetUSD,
      monthlyNetDividendKRW: stepMonthlyNetKRW,
      monthsToReach: stepMonths,
      targetDate: calculateTargetDate(stepMonths),
    };
  });

  return {
    etf: currentEtf,
    exchangeRate,
    inputMonthlyTargetUSD,
    inputMonthlyTargetKRW,
    requiredShares,
    totalCapitalUSD,
    totalCapitalKRW,
    annualGrossDividendUSD,
    annualTaxUSD,
    annualNetDividendUSD,
    monthlyNetDividendUSD,
    monthlyNetDividendKRW,
    dividendPerShareAnnualUSD,
    netDividendPerShareAnnualUSD,
    monthlySharesToAdd: safeMonthlyAdd,
    monthsToTarget,
    yearsAndMonths,
    targetDDayDate,
    milestones,
  };
}
