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
  __InternaldbClient: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          actor_user_id: string
          created_at: string
          details: Json
          entity_id: string | null
          entity_slug: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_user_id: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_slug?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_user_id?: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_slug?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      ai_logs: {
        Row: {
          action: string
          created_at: string
          error_message: string | null
          id: string
          input: Json
          latency_ms: number | null
          output: Json | null
          status: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          error_message?: string | null
          id?: string
          input?: Json
          latency_ms?: number | null
          output?: Json | null
          status?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          error_message?: string | null
          id?: string
          input?: Json
          latency_ms?: number | null
          output?: Json | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          category: string | null
          created_at: string
          id: string
          sort_order: number
          title: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          title: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          title?: string
          url?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string
          subject: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string
          subject?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          title: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          title: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          title?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      pricing_rules: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          margin_percent: number
          priority: number
          scope: string
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          margin_percent?: number
          priority?: number
          scope: string
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          margin_percent?: number
          priority?: number
          scope?: string
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_mappings: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          override_sku: string | null
          supplier_id: string
          supplier_sku: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          override_sku?: string | null
          supplier_id: string
          supplier_sku: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          override_sku?: string | null
          supplier_id?: string
          supplier_sku?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          category: string
          content: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          stock: number | null
          sku: string | null
          original_price: number | null
          is_active: boolean
          is_featured: boolean
          meta_description: string | null
          meta_title: string | null
          price: number | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          brand: string
          category: string
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          stock?: number | null
          sku?: string | null
          original_price?: number | null
          is_active?: boolean
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          price?: number | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          brand?: string
          category?: string
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          stock?: number | null
          sku?: string | null
          original_price?: number | null
          is_active?: boolean
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          price?: number | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          body: string | null
          created_at: string
          hero_image: string | null
          id: string
          page_key: string
          sections: Json
          seo_description: string | null
          seo_title: string | null
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          hero_image?: string | null
          id?: string
          page_key: string
          sections?: Json
          seo_description?: string | null
          seo_title?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          hero_image?: string | null
          id?: string
          page_key?: string
          sections?: Json
          seo_description?: string | null
          seo_title?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      supplier_products: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string
          description: string | null
          final_price: number | null
          id: string
          image_url: string | null
          is_published: boolean
          last_full_sync_at: string | null
          last_price_check_at: string | null
          last_synced_at: string
          name: string
          published_product_id: string | null
          raw_price: number | null
          stock: number | null
          supplier_id: string
          supplier_sku: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          final_price?: number | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          last_full_sync_at?: string | null
          last_price_check_at?: string | null
          last_synced_at?: string
          name: string
          published_product_id?: string | null
          raw_price?: number | null
          stock?: number | null
          supplier_id: string
          supplier_sku: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          final_price?: number | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          last_full_sync_at?: string | null
          last_price_check_at?: string | null
          last_synced_at?: string
          name?: string
          published_product_id?: string | null
          raw_price?: number | null
          stock?: number | null
          supplier_id?: string
          supplier_sku?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_products_published_product_id_fkey"
            columns: ["published_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          auto_sync_enabled: boolean
          created_at: string
          customer_code: string | null
          feed_url: string | null
          field_mapping: Json
          id: string
          is_active: boolean
          is_initialized: boolean
          last_full_import_at: string | null
          last_sync_at: string | null
          margin_percent: number
          name: string
          notes: string | null
          password_encrypted: string | null
          portal_url: string | null
          source_type: string
          sync_interval_minutes: number
          updated_at: string
          user_code: string | null
        }
        Insert: {
          auto_sync_enabled?: boolean
          created_at?: string
          customer_code?: string | null
          feed_url?: string | null
          field_mapping?: Json
          id?: string
          is_active?: boolean
          is_initialized?: boolean
          last_full_import_at?: string | null
          last_sync_at?: string | null
          margin_percent?: number
          name: string
          notes?: string | null
          password_encrypted?: string | null
          portal_url?: string | null
          source_type?: string
          sync_interval_minutes?: number
          updated_at?: string
          user_code?: string | null
        }
        Update: {
          auto_sync_enabled?: boolean
          created_at?: string
          customer_code?: string | null
          feed_url?: string | null
          field_mapping?: Json
          id?: string
          is_active?: boolean
          is_initialized?: boolean
          last_full_import_at?: string | null
          last_sync_at?: string | null
          margin_percent?: number
          name?: string
          notes?: string | null
          password_encrypted?: string | null
          portal_url?: string | null
          source_type?: string
          sync_interval_minutes?: number
          updated_at?: string
          user_code?: string | null
        }
        Relationships: []
      }
      sync_jobs: {
        Row: {
          details: Json | null
          duration_ms: number | null
          error_message: string | null
          finished_at: string | null
          id: string
          items_created: number | null
          items_failed: number | null
          items_skipped: number | null
          items_total: number | null
          items_updated: number | null
          job_type: string
          started_at: string
          status: string
          supplier_id: string
          triggered_by: string | null
        }
        Insert: {
          details?: Json | null
          duration_ms?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          items_created?: number | null
          items_failed?: number | null
          items_skipped?: number | null
          items_total?: number | null
          items_updated?: number | null
          job_type: string
          started_at?: string
          status?: string
          supplier_id: string
          triggered_by?: string | null
        }
        Update: {
          details?: Json | null
          duration_ms?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          items_created?: number | null
          items_failed?: number | null
          items_skipped?: number | null
          items_total?: number | null
          items_updated?: number | null
          job_type?: string
          started_at?: string
          status?: string
          supplier_id?: string
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_jobs_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      suppliers_due_for_sync: {
        Args: never
        Returns: {
          id: string
          name: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternaldbClient">

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
    },
  },
} as const
