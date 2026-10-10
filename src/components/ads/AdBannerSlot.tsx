'use client';

import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdBannerSlotProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  className?: string;
  label?: string;
}

export default function AdBannerSlot({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
  label = '스폰서 링크',
}: AdBannerSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (clientId && slotId) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // 애드블록 또는 이미 로드된 광고 슬롯 예외 무시
      }
    }
  }, [clientId, slotId]);

  // 클라이언트 ID나 슬롯 ID가 없으면 레이아웃을 해치지 않도록 아무것도 렌더링하지 않음
  if (!clientId || !slotId) {
    return null;
  }

  return (
    <div className={`my-6 text-center ${className}`}>
      <span className="text-[10px] text-brand-muted/70 uppercase tracking-widest block mb-1">
        {label}
      </span>
      <div className="overflow-hidden min-h-[90px] flex items-center justify-center bg-brand-bg/50 rounded-xl border border-subtle-border/50">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
}
