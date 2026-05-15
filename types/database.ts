export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          gmail_token: string | null
          gmail_refresh_token: string | null
          gmail_connected_at: string | null
          onboarded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          gmail_token?: string | null
          gmail_refresh_token?: string | null
          gmail_connected_at?: string | null
          onboarded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          gmail_token?: string | null
          gmail_refresh_token?: string | null
          gmail_connected_at?: string | null
          onboarded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      mood_logs: {
        Row: {
          id: string
          user_id: string
          mood_type: 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'frustrated' | 'tired' | 'angry'
          mood_score: number
          mood_label: string
          note: string | null
          edit_count: number
          logged_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood_type: 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'frustrated' | 'tired' | 'angry'
          mood_score: number
          mood_label: string
          note?: string | null
          edit_count?: number
          logged_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood_type?: 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'frustrated' | 'tired' | 'angry'
          mood_score?: number
          mood_label?: string
          note?: string | null
          edit_count?: number
          logged_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      expense_logs: {
        Row: {
          id: string
          user_id: string
          merchant: string | null
          amount: number
          category: 'Makanan' | 'Transport' | 'Belanja' | 'Hiburan' | 'Kesehatan' | 'Langganan' | 'Transfer' | 'Lainnya'
          source_email_id: string | null
          expense_date: string
          raw_email_snippet: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          merchant?: string | null
          amount: number
          category: 'Makanan' | 'Transport' | 'Belanja' | 'Hiburan' | 'Kesehatan' | 'Langganan' | 'Transfer' | 'Lainnya'
          source_email_id?: string | null
          expense_date: string
          raw_email_snippet?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          merchant?: string | null
          amount?: number
          category?: 'Makanan' | 'Transport' | 'Belanja' | 'Hiburan' | 'Kesehatan' | 'Langganan' | 'Transfer' | 'Lainnya'
          source_email_id?: string | null
          expense_date?: string
          raw_email_snippet?: string | null
          created_at?: string
        }
      }
      weekly_reports: {
        Row: {
          id: string
          user_id: string
          week_start: string
          week_end: string
          total_expense: number | null
          dominant_mood: string | null
          mood_expense_correlation: Json | null
          top_category: string | null
          insight_text: string | null
          emotional_spending_amount: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start: string
          week_end: string
          total_expense?: number | null
          dominant_mood?: string | null
          mood_expense_correlation?: Json | null
          top_category?: string | null
          insight_text?: string | null
          emotional_spending_amount?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start?: string
          week_end?: string
          total_expense?: number | null
          dominant_mood?: string | null
          mood_expense_correlation?: Json | null
          top_category?: string | null
          insight_text?: string | null
          emotional_spending_amount?: number | null
          created_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      }
      agent_logs: {
        Row: {
          id: string
          agent_name: string
          user_id: string | null
          status: 'started' | 'completed' | 'failed'
          input_summary: Json | null
          output_summary: Json | null
          duration_ms: number | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_name: string
          user_id?: string | null
          status: 'started' | 'completed' | 'failed'
          input_summary?: Json | null
          output_summary?: Json | null
          duration_ms?: number | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_name?: string
          user_id?: string | null
          status?: 'started' | 'completed' | 'failed'
          input_summary?: Json | null
          output_summary?: Json | null
          duration_ms?: number | null
          error_message?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
