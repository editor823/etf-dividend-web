'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface SimpleUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: SimpleUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithDemo: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signInWithDemo: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Supabase Auth 세션 구독
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u = session.user;
          setUser({
            id: u.id,
            email: u.email || 'user@example.com',
            name: u.user_metadata?.full_name || u.email?.split('@')[0] || '배당 투자자',
            avatarUrl: u.user_metadata?.avatar_url,
            isDemo: false,
          });
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u = session.user;
          setUser({
            id: u.id,
            email: u.email || 'user@example.com',
            name: u.user_metadata?.full_name || u.email?.split('@')[0] || '배당 투자자',
            avatarUrl: u.user_metadata?.avatar_url,
            isDemo: false,
          });
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 로컬 스토리지에 저장된 데모 유저 확인
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem('etf_demo_user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    }
  }, []);

  // 구글 로그인
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      signInWithDemo();
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
  };

  // 데모 1초 간편 로그인 (Supabase 키 미설정 시에도 즉시 기능 체험 가능)
  const signInWithDemo = () => {
    const demoUser: SimpleUser = {
      id: 'demo-user-12345',
      email: 'investor@dividend.com',
      name: '성공한 배당가',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      isDemo: true,
    };
    setUser(demoUser);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('etf_demo_user', JSON.stringify(demoUser));
    }
  };

  // 로그아웃
  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('etf_demo_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        signInWithDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
