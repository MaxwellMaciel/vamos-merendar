export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      },
      daily_menu: {
        Row: {
          breakfast: string | null
          created_at: string | null
          created_by: string
          date: string
          id: string
          lunch: string | null
          snack: string | null
        }
        Insert: {
          breakfast?: string | null
          created_at?: string | null
          created_by: string
          date: string
          id?: string
          lunch?: string | null
          snack?: string | null
        }
        Update: {
          breakfast?: string | null
          created_at?: string | null
          created_by?: string
          date?: string
          id?: string
          lunch?: string | null
          snack?: string | null
        }
        Relationships: []
      },
      feedback: {
        Row: {
          content: string
          created_at: string | null
          date: string | null
          feedback_type: string
          id: string
          meal_type: string
          profile_id: string | null
          student_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          date?: string | null
          feedback_type: string
          id?: string
          meal_type: string
          profile_id?: string | null
          student_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          date?: string | null
          feedback_type?: string
          id?: string
          meal_type?: string
          profile_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      },
      meal_attendance: {
        Row: {
          breakfast: boolean | null
          created_at: string | null
          date: string
          id: string
          lunch: boolean | null
          snack: boolean | null
          student_id: string
        }
        Insert: {
          breakfast?: boolean | null
          created_at?: string | null
          date: string
          id?: string
          lunch?: boolean | null
          snack?: boolean | null
          student_id: string
        }
        Update: {
          breakfast?: boolean | null
          created_at?: string | null
          date?: string
          id?: string
          lunch?: boolean | null
          snack?: boolean | null
          student_id?: string
        }
        Relationships: []
      },
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
        }
        Relationships: []
      },
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          profile_image: string | null
          user_type: string
          created_at: string | null
          dietary_restrictions: string | null
          matricula: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          profile_image?: string | null
          user_type?: string
          created_at?: string | null
          dietary_restrictions?: string | null
          matricula: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          profile_image?: string | null
          user_type?: string
          created_at?: string | null
          dietary_restrictions?: string | null
          matricula?: string
        }
        Relationships: []
      }
    },
    Views: {
      meal_confirmation_counts: {
        Row: {
          date: string
          meal_type: 'breakfast' | 'lunch' | 'snack'
          confirmed_count: number
          declined_count: number
        }
      }
    },
    Functions: {
      [_ in never]: never
    },
    Enums: {
      [_ in never]: never
    },
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
