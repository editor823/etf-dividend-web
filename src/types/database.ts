export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tickers: {
        Row: {
          ticker: string;
          name: string;
          current_price: number;
          dividend_yield: number;
          dividend_growth_5y: number | null;
          capital_growth_est: number | null;
          expense_ratio: number | null;
          frequency: 'monthly' | 'quarterly';
          pay_months: number[];
          five_year_return: number | null;
          category: string | null;
          inception_date: string | null;
          updated_at: string;
        };
        Insert: {
          ticker: string;
          name: string;
          current_price: number;
          dividend_yield: number;
          dividend_growth_5y?: number | null;
          capital_growth_est?: number | null;
          expense_ratio?: number | null;
          frequency: 'monthly' | 'quarterly';
          pay_months: number[];
          five_year_return?: number | null;
          category?: string | null;
          inception_date?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tickers']['Insert']>;
      };
      dividend_events: {
        Row: {
          id: number;
          ticker: string;
          ex_date: string;
          payment_date: string;
          amount_per_share: number;
          is_estimated: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          ticker: string;
          ex_date: string;
          payment_date: string;
          amount_per_share: number;
          is_estimated?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['dividend_events']['Insert']>;
      };
      monthly_price_history: {
        Row: {
          id: number;
          ticker: string;
          date: string;
          close_price: number;
          adj_close: number;
        };
        Insert: {
          id?: number;
          ticker: string;
          date: string;
          close_price: number;
          adj_close: number;
        };
        Update: Partial<Database['public']['Tables']['monthly_price_history']['Insert']>;
      };
      user_portfolios: {
        Row: {
          id: string;
          user_id: string;
          portfolio_name: string;
          drip_enabled: boolean;
          monthly_contribution: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          portfolio_name?: string;
          drip_enabled?: boolean;
          monthly_contribution?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_portfolios']['Insert']>;
      };
      portfolio_holdings: {
        Row: {
          id: number;
          portfolio_id: string;
          ticker: string;
          shares: number;
          avg_price: number | null;
          target_weight: number | null;
        };
        Insert: {
          id?: number;
          portfolio_id: string;
          ticker: string;
          shares: number;
          avg_price?: number | null;
          target_weight?: number | null;
        };
        Update: Partial<Database['public']['Tables']['portfolio_holdings']['Insert']>;
      };
    };
  };
}

export type Ticker = Database['public']['Tables']['tickers']['Row'];
export type DividendEvent = Database['public']['Tables']['dividend_events']['Row'];
export type MonthlyPriceHistory = Database['public']['Tables']['monthly_price_history']['Row'];
export type UserPortfolio = Database['public']['Tables']['user_portfolios']['Row'];
export type PortfolioHolding = Database['public']['Tables']['portfolio_holdings']['Row'];
