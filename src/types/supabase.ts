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
          name: string
          email: string | null
          phone: string | null
          profile_image: string | null
          matricula: string | null
          siape: string | null
          user_type: 'aluno' | 'nutricionista'
          dietary_restrictions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          profile_image?: string | null
          matricula?: string | null
          siape?: string | null
          user_type: 'aluno' | 'nutricionista'
          dietary_restrictions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          profile_image?: string | null
          matricula?: string | null
          siape?: string | null
          user_type?: 'aluno' | 'nutricionista'
          dietary_restrictions?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          type: 'attendance' | 'class' | 'menu' | 'register' | 'complete' | 'meal_attendance'
          read: boolean
          created_at: string
          created_by: string | null
          target_audience: string[]
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          type: 'attendance' | 'class' | 'menu' | 'register' | 'complete' | 'meal_attendance'
          read?: boolean
          created_at?: string
          created_by?: string | null
          target_audience?: string[]
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          type?: 'attendance' | 'class' | 'menu' | 'register' | 'complete' | 'meal_attendance'
          read?: boolean
          created_at?: string
          created_by?: string | null
          target_audience?: string[]
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      meal_attendance: {
        Row: {
          id: string
          student_id: string
          date: string
          meal_type: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          date: string
          meal_type: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          date?: string
          meal_type?: string
          created_at?: string
        }
        Relationships: []
      }
      daily_menu: {
        Row: {
          id: string
          date: string
          breakfast: string
          lunch: string
          snack: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          breakfast?: string
          lunch?: string
          snack?: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          breakfast?: string
          lunch?: string
          snack?: string
          created_by?: string
          created_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          id: string
          student_id: string
          content: string
          feedback_type: string
          meal_type: string
          date?: string
          profile_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          content: string
          feedback_type: string
          meal_type: string
          date?: string
          profile_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          content?: string
          feedback_type?: string
          meal_type?: string
          date?: string
          profile_id?: string
          created_at?: string
        }
        Relationships: []
      }
      weekly_menu: {
        Row: {
          id: string
          date: string
          breakfast: string
          lunch: string
          snack: string
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          date: string
          breakfast: string
          lunch: string
          snack: string
          created_at?: string
          created_by?: string
        }
        Update: {
          id?: string
          date?: string
          breakfast?: string
          lunch?: string
          snack?: string
          created_at?: string
          created_by?: string
        }
        Relationships: []
      }
      meal_confirmations: {
        Row: {
          id: string
          date: string
          meal_type: 'breakfast' | 'lunch' | 'snack'
          student_id: string
          student_name: string
          student_matricula: string
          student_image?: string
          status: boolean
          created_at: string
        }
        Insert: {
          id?: string
          date?: string
          meal_type?: 'breakfast' | 'lunch' | 'snack'
          student_id?: string
          student_name?: string
          student_matricula?: string
          student_image?: string
          status?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          meal_type?: 'breakfast' | 'lunch' | 'snack'
          student_id?: string
          student_name?: string
          student_matricula?: string
          student_image?: string
          status?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      meal_confirmation_counts: {
        Row: {
          date: string
          meal_type: 'breakfast' | 'lunch' | 'snack'
          confirmed_count: number
          declined_count: number
        }
      }
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
