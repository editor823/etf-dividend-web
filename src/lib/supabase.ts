import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// 환경 변수에서 Supabase 접속 정보 로드
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 초기화 상태 확인 플래그
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-ref.supabase.co'
);

/**
 * 전역 Supabase 클라이언트 인스턴스
 * - 타입 안전성(Database schema)이 완벽히 적용되어 있습니다.
 * - 환경 변수가 비어있는 초기 개발/로컬 테스트 단계에서도 앱이 멈추지 않도록 안전하게 처리되어 있습니다.
 */
export const supabase = createClient<Database>(
  isSupabaseConfigured ? supabaseUrl : 'https://mock.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'mock-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
