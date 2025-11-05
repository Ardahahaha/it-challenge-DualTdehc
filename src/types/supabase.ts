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
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          avatar_url: string | null
          bio: string | null
          domains: string[]
          level: number
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          domains?: string[]
          level?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          domains?: string[]
          level?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          slug: string
          topic: string
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          topic: string
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          topic?: string
          is_public?: boolean
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          room_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          author_id?: string
          content?: string
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          created_by: string
          invited_id: string
          mode: 'online' | 'irl'
          status: 'pending' | 'active' | 'finished'
          winner_id: string | null
          started_at: string | null
          finished_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          created_by: string
          invited_id: string
          mode?: 'online' | 'irl'
          status?: 'pending' | 'active' | 'finished'
          winner_id?: string | null
          started_at?: string | null
          finished_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          invited_id?: string
          mode?: 'online' | 'irl'
          status?: 'pending' | 'active' | 'finished'
          winner_id?: string | null
          started_at?: string | null
          finished_at?: string | null
          created_at?: string
        }
      }
      match_events: {
        Row: {
          id: string
          match_id: string
          type: string
          payload: Json
          at: string
        }
        Insert: {
          id?: string
          match_id: string
          type: string
          payload?: Json
          at?: string
        }
        Update: {
          id?: string
          match_id?: string
          type?: string
          payload?: Json
          at?: string
        }
      }
      xp_logs: {
        Row: {
          id: string
          user_id: string
          domain: string
          delta: number
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          domain: string
          delta: number
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          domain?: string
          delta?: number
          reason?: string | null
          created_at?: string
        }
      }
      skills: {
        Row: {
          id: number
          code: string
          label: string
          domain: string
        }
        Insert: {
          id?: number
          code: string
          label: string
          domain: string
        }
        Update: {
          id?: number
          code?: string
          label?: string
          domain?: string
        }
      }
      user_skills: {
        Row: {
          user_id: string
          skill_id: number
          level: number
          last_updated: string
        }
        Insert: {
          user_id: string
          skill_id: number
          level?: number
          last_updated?: string
        }
        Update: {
          user_id?: string
          skill_id?: number
          level?: number
          last_updated?: string
        }
      }
      history: {
        Row: {
          id: string
          user_id: string
          kind: 'match' | 'chat' | 'xp'
          ref_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kind: 'match' | 'chat' | 'xp'
          ref_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          kind?: 'match' | 'chat' | 'xp'
          ref_id?: string | null
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
  }
}
