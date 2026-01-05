export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ibc_membership_applications: {
        Row: {
          application_status: Database["public"]["Enums"]["application_status_enum"]
          business_description: string
          business_stage: Database["public"]["Enums"]["business_stage_enum"]
          company_name: string
          contribution_to_community: string
          created_at: string
          declaration_confirmed: boolean
          email: string
          expected_gain: string
          full_name: string
          ibc_stories_interest:
            | Database["public"]["Enums"]["ibc_stories_enum"]
            | null
          id: string
          industry: string
          membership_type: Database["public"]["Enums"]["membership_type_enum"]
          mobile_number: string
          participate_in_events: boolean
          reason_to_join: string
          role_designation: string
          understands_curation: boolean
          updated_at: string
          user_id: string
          website_or_linkedin: string | null
          years_in_business: number
        }
        Insert: {
          application_status?: Database["public"]["Enums"]["application_status_enum"]
          business_description: string
          business_stage: Database["public"]["Enums"]["business_stage_enum"]
          company_name: string
          contribution_to_community: string
          created_at?: string
          declaration_confirmed: boolean
          email: string
          expected_gain: string
          full_name: string
          ibc_stories_interest?:
            | Database["public"]["Enums"]["ibc_stories_enum"]
            | null
          id?: string
          industry: string
          membership_type: Database["public"]["Enums"]["membership_type_enum"]
          mobile_number: string
          participate_in_events: boolean
          reason_to_join: string
          role_designation: string
          understands_curation: boolean
          updated_at?: string
          user_id: string
          website_or_linkedin?: string | null
          years_in_business: number
        }
        Update: {
          application_status?: Database["public"]["Enums"]["application_status_enum"]
          business_description?: string
          business_stage?: Database["public"]["Enums"]["business_stage_enum"]
          company_name?: string
          contribution_to_community?: string
          created_at?: string
          declaration_confirmed?: boolean
          email?: string
          expected_gain?: string
          full_name?: string
          ibc_stories_interest?:
            | Database["public"]["Enums"]["ibc_stories_enum"]
            | null
          id?: string
          industry?: string
          membership_type?: Database["public"]["Enums"]["membership_type_enum"]
          mobile_number?: string
          participate_in_events?: boolean
          reason_to_join?: string
          role_designation?: string
          understands_curation?: boolean
          updated_at?: string
          user_id?: string
          website_or_linkedin?: string | null
          years_in_business?: number
        }
        Relationships: []
      }
      membership_inquiries: {
        Row: {
          business_description: string
          business_stage: string
          company_name: string
          contribution_to_community: string
          created_at: string
          declaration_confirmed: boolean
          email: string
          expected_gain: string
          full_name: string
          ibc_stories_interest: string | null
          id: string
          industry: string
          membership_type: string
          mobile_number: string
          participate_in_events: boolean
          reason_to_join: string
          role_designation: string
          understands_curation: boolean
          website_or_linkedin: string | null
          years_in_business: number
        }
        Insert: {
          business_description: string
          business_stage: string
          company_name: string
          contribution_to_community: string
          created_at?: string
          declaration_confirmed?: boolean
          email: string
          expected_gain: string
          full_name: string
          ibc_stories_interest?: string | null
          id?: string
          industry: string
          membership_type: string
          mobile_number: string
          participate_in_events?: boolean
          reason_to_join: string
          role_designation: string
          understands_curation?: boolean
          website_or_linkedin?: string | null
          years_in_business: number
        }
        Update: {
          business_description?: string
          business_stage?: string
          company_name?: string
          contribution_to_community?: string
          created_at?: string
          declaration_confirmed?: boolean
          email?: string
          expected_gain?: string
          full_name?: string
          ibc_stories_interest?: string | null
          id?: string
          industry?: string
          membership_type?: string
          mobile_number?: string
          participate_in_events?: boolean
          reason_to_join?: string
          role_designation?: string
          understands_curation?: boolean
          website_or_linkedin?: string | null
          years_in_business?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      application_status_enum: "pending" | "approved" | "rejected"
      business_stage_enum: "early" | "growing" | "established"
      ibc_stories_enum: "yes" | "maybe"
      membership_type_enum: "founding" | "annual"
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
      app_role: ["admin", "moderator", "user"],
      application_status_enum: ["pending", "approved", "rejected"],
      business_stage_enum: ["early", "growing", "established"],
      ibc_stories_enum: ["yes", "maybe"],
      membership_type_enum: ["founding", "annual"],
    },
  },
} as const
