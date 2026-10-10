'use client';

import Script from 'next/script';

export default function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // 애드센스 클라이언트 ID가 환경변수에 설정되어 있지 않으면 스크립트를 로드하지 않음
  if (!clientId || clientId.trim() === '' || clientId.includes('placeholder')) {
    return null;
  }

  return (
    <Script
      id="google-adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
