'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Lightbulb,
  DollarSign,
  Scale,
  History,
  PieChart,
  Repeat,
  Calendar,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: 'reverse' | 'compare' | 'timemachine' | 'barbell' | 'drip' | 'calendar') => void;
  defaultTab?: 'reverse' | 'compare' | 'timemachine' | 'barbell' | 'drip' | 'calendar';
}

export default function QuickGuideModal({
  isOpen,
  onClose,
  onSelectTab,
  defaultTab = 'reverse',
}: QuickGuideModalProps) {
  const [selectedTool, setSelectedTool] = useState<
    'reverse' | 'compare' | 'timemachine' | 'barbell' | 'drip' | 'calendar'
  >(defaultTab);

  // 모달이 열려있을 때 뒷배경(바탕화면) 마우스 휠 스크롤 방지
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toolsData = {
    reverse: {
      id: 'reverse',
      step: '01',
      title: '월 목표 배당 역산 계산기',
      subtitle: '목표 월급을 받으려면 어떤 종목을 몇 주 사야 할까?',
      icon: DollarSign,
      color: 'bg-emerald-500',
      badge: '현금흐름 목표 설계',
      whenToUse:
        '"내가 매달 세후 100만 원(또는 200만 원)을 배당금으로 받으려면 종목을 몇 주 사야 하고, 원금이 총 얼마가 필요할까?" 궁금할 때 사용합니다.',
      steps: [
        {
          num: 'Step 1',
          title: '목표 월 배당금 입력',
          desc: '내가 매달 통장에 꽂히길 원하는 금액(예: 세후 100만 원)을 원화(₩) 또는 달러($)로 입력합니다.',
        },
        {
          num: 'Step 2',
          title: '원하는 ETF 종목 선택',
          desc: '배당성장의 제왕 SCHD, 월배당 커버드콜 JEPI/JEPQ, 부동산 리츠 O 등 17개 대표 종목 중 하나를 고릅니다.',
        },
        {
          num: 'Step 3',
          title: '월 적립 가능 주수 입력',
          desc: '매달 월급에서 몇 주씩 살 수 있는지 입력하면, 목표 달성까지 걸리는 개월 수(D-day)를 자동으로 역산해 줍니다.',
        },
      ],
      example: {
        title: '실제 계산 예시 (SCHD 기준)',
        result: '매월 세후 100만 원 수령 시 ➜ 필요 주식 수 약 4,200주 (필요 원금 약 3억 5,000만 원 소요)',
      },
      proTip:
        '💡 배당수익률이 높은 JEPI는 필요 원금이 적게 들지만, 은퇴까지 5~10년 이상 남았다면 배당금이 매년 10%씩 자라나는 SCHD를 선택해야 10년 뒤 받는 월급이 2배 이상 불어납니다!',
    },
    compare: {
      id: 'compare',
      step: '02',
      title: 'ETF 1:1 맞짱 비교기',
      subtitle: '인기 라이벌 종목 중 누가 더 우수할까?',
      icon: Scale,
      color: 'bg-blue-500',
      badge: '라이벌 종목 배틀',
      whenToUse:
        '"SCHD vs JEPI 중 뭘 사야 할까?", "시장지수 VOO와 배당성장 SCHD 중 10년 뒤 누가 이길까?" 두 종목 사이에서 결정 장애가 올 때 사용합니다.',
      steps: [
        {
          num: 'Step 1',
          title: '두 선수(종목) 고르기',
          desc: '선수 1과 선수 2에 비교하고 싶은 ETF를 선택합니다. 상단의 [자주 비교하는 인기 매치] 버튼을 누르면 1초 만에 자동 세팅됩니다.',
        },
        {
          num: 'Step 2',
          title: '투자 예정 금액 입력',
          desc: '동일한 자본금(예: 5,000만 원)을 넣었을 때 매달 통장에 입금되는 1년 차 실수령액 차이를 확인합니다.',
        },
        {
          num: 'Step 3',
          title: '역전 시점(골든크로스) 확인',
          desc: '배당성장률 때문에 언제 배당금이 역전되는지 보여주는 인터랙티브 차트와 왕관(👑) 승패를 확인합니다.',
        },
      ],
      example: {
        title: '인기 매치 (SCHD vs JEPI)',
        result: '초기 1~4년 차는 월배당 JEPI 압승 ➜ 7~8년 차부터 배당성장 SCHD가 역전하는 골든크로스 발생!',
      },
      proTip:
        '💡 당장 퇴직하여 생활비가 급하다면 JEPI가 유리하고, 아직 일할 수 있는 3040 세대라면 복리로 성장하는 SCHD가 장기 승자가 됩니다.',
    },
    compareGuide: null,
    timemachine: {
      id: 'timemachine',
      step: '03',
      title: '과거 ETF 타임머신 백테스터',
      subtitle: '과거에 실제로 샀다면 지금 내 계좌는 얼마일까?',
      icon: History,
      color: 'bg-amber-500',
      badge: '실제 과거 수익 검증',
      whenToUse:
        '"내가 3년 전, 5년 전에 SCHD에 1,000만 원을 넣고 매달 50만 원씩 모았다면 지금 배당금과 계좌 잔고는 얼마일까?" 과거 팩트 데이터로 검증할 때 씁니다.',
      steps: [
        {
          num: 'Step 1',
          title: '종목 및 과거 시점 선택',
          desc: '확인하고 싶은 ETF와 과거 시작일(1년 전, 3년 전, 5년 전, 10년 전 등)을 고릅니다.',
        },
        {
          num: 'Step 2',
          title: '초기 투자금 & 월 적립금 입력',
          desc: '그때 거치식으로 넣은 돈과 매달 추가로 적립했을 가상 금액을 설정합니다.',
        },
        {
          num: 'Step 3',
          title: 'DRIP(배당 재투자) 스위치 켜기',
          desc: '받은 배당금을 다시 주식으로 샀을 때와 그냥 썼을 때의 놀라운 잔고 차이를 비교합니다.',
        },
      ],
      example: {
        title: '타임머신 탑승 효과',
        result: '원금 대비 배당수익률(YoC) 확인 가능 ➜ 10년 전 매수한 주식은 현재 원금 대비 연 10%가 넘는 배당을 지급!',
      },
      proTip:
        '💡 배당금을 소비하지 않고 다시 주식을 사는 "배당 재투자"를 켰을 때, 보유 주식 수가 눈덩이처럼 불어나는 복리의 위력을 체감해 보세요.',
    },
    barbell: {
      id: 'barbell',
      step: '04',
      title: '바벨 포트폴리오 최적화기',
      subtitle: '배당성장과 고배당의 장점만 섞는 황금 비율',
      icon: PieChart,
      color: 'bg-purple-500',
      badge: '리스크 분산 최적화',
      whenToUse:
        '"SCHD만 사자니 당장 배당이 너무 적고, JEPI만 사자니 원금이 안 오를까 봐 걱정될 때", 양극단의 장점을 결합하여 나만의 황금 비율을 찾을 때 사용합니다.',
      steps: [
        {
          num: 'Step 1',
          title: '총 투자 예산 설정',
          desc: '운용할 총 투자금(예: 1억 원 또는 3,000만 원)을 입력합니다.',
        },
        {
          num: 'Step 2',
          title: '비중 슬라이더 조절',
          desc: '슬라이더를 좌우로 움직이며 [성장형 SCHD]와 [인컴형 JEPI/JEPQ]의 비율을 조절합니다.',
        },
        {
          num: 'Step 3',
          title: '종합 배당률 및 매수 수량 확인',
          desc: '포트폴리오의 실시간 종합 배당수익률과 각 종목을 몇 주씩 매수해야 하는지 매수 가이드를 확인합니다.',
        },
      ],
      example: {
        title: '대표적인 바벨 비율',
        result: 'SCHD 50% + JEPI 50% ➜ 즉시 연 5.5%의 월 현금흐름을 받으면서도 원금 가치가 지속적으로 우상향!',
      },
      proTip:
        '💡 30~40대는 [SCHD 70% : JEPI 30%], 은퇴를 앞둔 50대는 [50% : 50%], 은퇴자는 [SCHD 30% : JEPI 70%]가 추천되는 정석 바벨 공식입니다.',
    },
    drip: {
      id: 'drip',
      step: '05',
      title: 'DRIP 복리 스노우볼 시뮬레이터',
      subtitle: '시간이 지날수록 폭발하는 복리 스노우볼',
      icon: Repeat,
      color: 'bg-cyan-500',
      badge: '복리 곡선 시각화',
      whenToUse:
        '"내가 지금부터 10년, 20년 동안 배당금을 한 푼도 안 쓰고 계속 재투자하면 노후에 얼마의 자산과 월급이 만들어질까?" 장기 복리 곡선을 보고 싶을 때 씁니다.',
      steps: [
        {
          num: 'Step 1',
          title: '초기 원금과 매달 저축액 입력',
          desc: '현재 가진 시드머니와 매달 월급에서 추가로 저축해 투자할 금액을 설정합니다.',
        },
        {
          num: 'Step 2',
          title: '투자 기간 슬라이더 조절',
          desc: '5년부터 30년까지 기간을 늘려가며 자산 증식 궤적을 확인합니다.',
        },
        {
          num: 'Step 3',
          title: '스노우볼 차트 감상',
          desc: '미국 배당소득세 15%가 자동으로 공제된 후 남은 순수 알짜 배당금으로 주식이 불어나는 모습을 차트로 봅니다.',
        },
      ],
      example: {
        title: '스노우볼 효과의 마법',
        result: '초기 3년은 완만하지만, 7~10년 차를 넘어서면 내 원금보다 배당금이 배당금을 낳는 복리 가속도가 붙습니다!',
      },
      proTip:
        '💡 국내 주요 증권사 앱에서 "미국 배당금 자동 재투자(DRIP)" 서비스를 신청해 두면, 잠든 사이 배당금으로 주식이 자동 매수되어 편리합니다.',
    },
    calendar: {
      id: 'calendar',
      step: '06',
      title: '12개월 배당 캘린더 대시보드',
      subtitle: '1월부터 12월까지 매달 마르지 않는 월급 달력',
      icon: Calendar,
      color: 'bg-rose-500',
      badge: '월별 현금흐름 달력',
      whenToUse:
        '"내 배당금은 일 년 중 몇 월에 집중되어 있을까? 배당이 안 나오는 달(배당 가뭄)이 없도록 균등한 월급 달력을 만들고 싶을 때" 사용합니다.',
      steps: [
        {
          num: 'Step 1',
          title: '관심/보유 종목 다중 선택',
          desc: 'SCHD, JEPI, O(리얼티인컴), VOO 등 내가 관심 있는 종목들을 체크합니다.',
        },
        {
          num: 'Step 2',
          title: '종목별 보유 주수 입력',
          desc: '각 종목을 몇 주씩 들고 있는지(또는 살 계획인지) 입력합니다.',
        },
        {
          num: 'Step 3',
          title: '월별 배당 타임라인 확인',
          desc: '1월부터 12월까지 매달 며칠에 얼마가 입금되는지 막대 차트와 달력으로 한눈에 파악합니다.',
        },
      ],
      example: {
        title: '완벽한 캘린더 꿀조합',
        result: '분기 배당주(SCHD: 3, 6, 9, 12월) + 월배당주(JEPI, O: 매월 1~12월) ➜ 1년 12달 내내 풍부한 현금 입금!',
      },
      proTip:
        '💡 특정 달에만 배당이 몰리지 않도록, 분기 배당주와 월배당주를 적절히 믹스하여 매달 카드값이나 공과금을 내는 날에 맞춰 현금흐름을 세팅하세요.',
    },
  };

  const currentTool = toolsData[selectedTool];

  const handleLaunchCalculator = () => {
    if (onSelectTab) {
      onSelectTab(selectedTool);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain">
      {/* 백드롭 오버레이 */}
      <div
        className="fixed inset-0 bg-brand-primary/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* 모달 본체 */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-subtle-border overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]">
        {/* 모달 상단 헤더 */}
        <div className="px-6 py-5 border-b border-subtle-border flex items-center justify-between bg-brand-bg/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-income-light text-income shadow-2xs">
              <Lightbulb className="w-5 h-5 text-income" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-income bg-income-light px-2 py-0.5 rounded-md">
                  초보자 실전 가이드
                </span>
                <span className="text-xs text-brand-muted">누구나 1분 만에 마스터하기</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-brand-primary tracking-tight">
                💡 6대 배당 계산기 초간단 사용법 &amp; 200% 활용 꿀팁
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-brand-muted hover:text-brand-primary hover:bg-brand-secondary transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6대 도구 탭 선택 바 */}
        <div className="p-3 bg-brand-secondary/40 border-b border-subtle-border overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {(
              [
                { id: 'reverse', label: '1. 월 목표 역산기', icon: DollarSign },
                { id: 'compare', label: '2. 1:1 맞짱 비교', icon: Scale },
                { id: 'timemachine', label: '3. 타임머신 역추적', icon: History },
                { id: 'barbell', label: '4. 바벨 포트폴리오', icon: PieChart },
                { id: 'drip', label: '5. DRIP 복리 스노우볼', icon: Repeat },
                { id: 'calendar', label: '6. 12개월 배당 캘린더', icon: Calendar },
              ] as const
            ).map((t) => {
              const Icon = t.icon;
              const isActive = selectedTool === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTool(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-sm scale-102'
                      : 'text-brand-primary/80 hover:text-brand-primary hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-income' : 'text-brand-muted'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 탭 본문 내용 (스크롤 영역) */}
        <div className="p-6 sm:p-8 overflow-y-auto overscroll-contain space-y-6">
          {/* 타이틀 및 핵심 질문 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle-border pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-income">
                  {currentTool.step} / 06
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-income-light text-income">
                  {currentTool.badge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-brand-primary tracking-tight">
                {currentTool.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted font-medium">
                {currentTool.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLaunchCalculator}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 hover:scale-102 active:scale-98"
            >
              <span>이 계산기 바로 사용하기</span>
              <ArrowRight className="w-4 h-4 text-income" />
            </button>
          </div>

          {/* 1. 이럴 때 쓰세요 (핵심 상황) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-income-light/40 border border-income/20 space-y-2">
            <div className="flex items-center gap-2 font-bold text-brand-primary text-xs sm:text-sm">
              <HelpCircle className="w-4 h-4 text-income" />
              <span>이럴 때 쓰세요 (핵심 활용 상황)</span>
            </div>
            <p className="text-xs sm:text-sm text-brand-primary/90 leading-relaxed font-medium">
              {currentTool.whenToUse}
            </p>
          </div>

          {/* 2. 초간단 3단계 사용법 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-brand-primary flex items-center gap-2">
              <Zap className="w-4 h-4 text-income" />
              <span>어떻게 사용하나요? (초간단 3단계)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {currentTool.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-brand-bg border border-subtle-border space-y-2 hover:border-income/40 transition-colors"
                >
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-subtle-border text-brand-muted">
                    {st.num}
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-brand-primary">
                    {st.title}
                  </h5>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 실제 계산 예시 박스 */}
          <div className="p-4 rounded-2xl bg-brand-secondary/40 border border-brand-primary/10 space-y-1.5">
            <div className="text-[11px] font-bold text-brand-primary/70 uppercase tracking-wider font-mono">
              {currentTool.example.title}
            </div>
            <div className="text-xs sm:text-sm font-bold text-income">
              {currentTool.example.result}
            </div>
          </div>

          {/* 4. 전문가 실전 꿀팁 콜아웃 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>수석 엔지니어의 실전 200% 투자 꿀팁</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950/85 leading-relaxed">
              {currentTool.proTip}
            </p>
          </div>
        </div>

        {/* 모달 하단 액션 바 */}
        <div className="px-6 py-4 border-t border-subtle-border bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-brand-muted">
            모든 시뮬레이션은 미국 배당소득세(15% 원천징수)가 자동 반영된 실제 통장 입금액 기준입니다.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-brand-secondary hover:bg-brand-secondaryHover text-brand-primary text-xs font-bold transition-all border border-subtle-border"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleLaunchCalculator}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-income hover:bg-income-dark text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>{currentTool.title} 열기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
