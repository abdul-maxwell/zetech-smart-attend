export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      absence_requests: {
        Row: {
          admin_comments: string | null
          class_id: string
          created_at: string
          id: string
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["absence_status"]
          student_id: string
          supporting_documents: string[] | null
          updated_at: string
          urgency: Database["public"]["Enums"]["absence_urgency"]
        }
        Insert: {
          admin_comments?: string | null
          class_id: string
          created_at?: string
          id?: string
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["absence_status"]
          student_id: string
          supporting_documents?: string[] | null
          updated_at?: string
          urgency?: Database["public"]["Enums"]["absence_urgency"]
        }
        Update: {
          admin_comments?: string | null
          class_id?: string
          created_at?: string
          id?: string
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["absence_status"]
          student_id?: string
          supporting_documents?: string[] | null
          updated_at?: string
          urgency?: Database["public"]["Enums"]["absence_urgency"]
        }
        Relationships: [
          {
            foreignKeyName: "absence_requests_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absence_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absence_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_logs: {
        Row: {
          beacon_uuid: string | null
          class_id: string
          created_at: string
          id: string
          marked_by: string | null
          method: Database["public"]["Enums"]["attendance_method"]
          notes: string | null
          signal_strength: number | null
          student_id: string
          timestamp: string
        }
        Insert: {
          beacon_uuid?: string | null
          class_id: string
          created_at?: string
          id?: string
          marked_by?: string | null
          method?: Database["public"]["Enums"]["attendance_method"]
          notes?: string | null
          signal_strength?: number | null
          student_id: string
          timestamp?: string
        }
        Update: {
          beacon_uuid?: string | null
          class_id?: string
          created_at?: string
          id?: string
          marked_by?: string | null
          method?: Database["public"]["Enums"]["attendance_method"]
          notes?: string | null
          signal_strength?: number | null
          student_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_logs_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_logs_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ble_beacons: {
        Row: {
          class_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          location: string
          signal_threshold: number
          updated_at: string
          uuid: string
        }
        Insert: {
          class_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          location: string
          signal_threshold?: number
          updated_at?: string
          uuid: string
        }
        Update: {
          class_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          location?: string
          signal_threshold?: number
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "ble_beacons_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year: string
          code: string
          created_at: string
          department: string
          id: string
          lecturer_id: string | null
          name: string
          schedule: Json | null
          semester: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          code: string
          created_at?: string
          department: string
          id?: string
          lecturer_id?: string | null
          name: string
          schedule?: Json | null
          semester: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          code?: string
          created_at?: string
          department?: string
          id?: string
          lecturer_id?: string | null
          name?: string
          schedule?: Json | null
          semester?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_lecturer_id_fkey"
            columns: ["lecturer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admission_number: string | null
          birth_certificate_number: string | null
          created_at: string
          department: string | null
          email: string
          first_name: string
          force_password_change: boolean
          id: string
          id_number: string | null
          last_name: string
          parent_email: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string | null
          year_of_study: number | null
        }
        Insert: {
          admission_number?: string | null
          birth_certificate_number?: string | null
          created_at?: string
          department?: string | null
          email: string
          first_name: string
          force_password_change?: boolean
          id?: string
          id_number?: string | null
          last_name: string
          parent_email?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string | null
          year_of_study?: number | null
        }
        Update: {
          admission_number?: string | null
          birth_certificate_number?: string | null
          created_at?: string
          department?: string | null
          email?: string
          first_name?: string
          force_password_change?: boolean
          id?: string
          id_number?: string | null
          last_name?: string
          parent_email?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string | null
          year_of_study?: number | null
        }
        Relationships: []
      }
      student_classes: {
        Row: {
          class_id: string
          enrolled_at: string
          id: string
          student_id: string
        }
        Insert: {
          class_id: string
          enrolled_at?: string
          id?: string
          student_id: string
        }
        Update: {
          class_id?: string
          enrolled_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_classes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reports: {
        Row: {
          ai_insights: string | null
          attendance_percentage: number
          attended_classes: number
          content: Json | null
          created_at: string
          email_sent_at: string | null
          id: string
          student_id: string
          total_classes: number
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          ai_insights?: string | null
          attendance_percentage?: number
          attended_classes?: number
          content?: Json | null
          created_at?: string
          email_sent_at?: string | null
          id?: string
          student_id: string
          total_classes?: number
          week_end_date: string
          week_start_date: string
        }
        Update: {
          ai_insights?: string | null
          attendance_percentage?: number
          attended_classes?: number
          content?: Json | null
          created_at?: string
          email_sent_at?: string | null
          id?: string
          student_id?: string
          total_classes?: number
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reports_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      absence_status: "pending" | "approved" | "rejected"
      absence_urgency: "low" | "medium" | "high"
      attendance_method: "ble" | "qr" | "manual"
      user_role: "student" | "lecturer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      absence_status: ["pending", "approved", "rejected"],
      absence_urgency: ["low", "medium", "high"],
      attendance_method: ["ble", "qr", "manual"],
      user_role: ["student", "lecturer", "admin"],
    },
  },
} as const
