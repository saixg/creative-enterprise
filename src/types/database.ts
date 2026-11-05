// Generated from the Supabase project schema (ref cgwphkmezoaigxgvywpe) via
// the MCP generate_typescript_types tool, then condensed: each Update type is
// written as Partial<Insert>, which is what the generator emits field by field.
// Regenerate after every migration rather than editing by hand.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Locale = Database["public"]["Enums"]["locale"];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      brands: {
        Row: { created_at: string; id: string; name: string; slug: string };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          id: string;
          name_en: string;
          name_gu: string | null;
          slug: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name_en: string;
          name_gu?: string | null;
          slug: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name_en?: string;
          name_gu?: string | null;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          admin_notes: string | null;
          contact_name: string;
          created_at: string;
          email: string | null;
          id: string;
          message: string;
          phone: string;
          preferred_locale: Locale;
          product_id: string | null;
          source: Database["public"]["Enums"]["inquiry_source"];
          status: Database["public"]["Enums"]["inquiry_status"];
          updated_at: string;
        };
        Insert: {
          admin_notes?: string | null;
          contact_name: string;
          created_at?: string;
          email?: string | null;
          id?: string;
          message: string;
          phone: string;
          preferred_locale?: Locale;
          product_id?: string | null;
          source?: Database["public"]["Enums"]["inquiry_source"];
          status?: Database["public"]["Enums"]["inquiry_status"];
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "inquiries_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_media: {
        Row: {
          alt_en: string | null;
          alt_gu: string | null;
          created_at: string;
          credit: Json | null;
          height: number | null;
          id: string;
          is_primary: boolean;
          is_representative: boolean;
          kind: string;
          product_id: string;
          sort_order: number;
          storage_path: string;
          width: number | null;
        };
        Insert: {
          alt_en?: string | null;
          alt_gu?: string | null;
          created_at?: string;
          credit?: Json | null;
          height?: number | null;
          id?: string;
          is_primary?: boolean;
          is_representative?: boolean;
          kind?: string;
          product_id: string;
          sort_order?: number;
          storage_path: string;
          width?: number | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_media"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          availability: Database["public"]["Enums"]["availability"];
          brand_id: string | null;
          category_id: string;
          created_at: string;
          description_en: string | null;
          description_gu: string | null;
          id: string;
          is_featured: boolean;
          is_new: boolean;
          is_placeholder: boolean;
          name: string;
          price_is_verified: boolean;
          price_paise: number | null;
          published_at: string | null;
          slug: string;
          specs: Json;
          status: Database["public"]["Enums"]["publish_status"];
          summary_en: string | null;
          summary_gu: string | null;
          summary_specs: string[];
          updated_at: string;
        };
        Insert: {
          availability?: Database["public"]["Enums"]["availability"];
          brand_id?: string | null;
          category_id: string;
          created_at?: string;
          description_en?: string | null;
          description_gu?: string | null;
          id?: string;
          is_featured?: boolean;
          is_new?: boolean;
          is_placeholder?: boolean;
          name: string;
          price_is_verified?: boolean;
          price_paise?: number | null;
          published_at?: string | null;
          slug: string;
          specs?: Json;
          status?: Database["public"]["Enums"]["publish_status"];
          summary_en?: string | null;
          summary_gu?: string | null;
          summary_specs?: string[];
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["admin_role"];
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["admin_role"];
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      service_requests: {
        Row: {
          admin_notes: string | null;
          contact_name: string;
          created_at: string;
          description: string;
          email: string | null;
          id: string;
          phone: string;
          preferred_locale: Locale;
          service_id: string | null;
          status: Database["public"]["Enums"]["service_request_status"];
          updated_at: string;
        };
        Insert: {
          admin_notes?: string | null;
          contact_name: string;
          created_at?: string;
          description: string;
          email?: string | null;
          id?: string;
          phone: string;
          preferred_locale?: Locale;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["service_request_status"];
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["service_requests"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "service_requests_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          covers_en: string[];
          covers_gu: string[];
          created_at: string;
          icon: string;
          id: string;
          image_is_photo: boolean;
          image_path: string | null;
          is_candidate: boolean;
          key: string;
          name_en: string;
          name_gu: string | null;
          problem_en: string | null;
          problem_gu: string | null;
          published_at: string | null;
          signs_en: string[];
          signs_gu: string[];
          slug: string;
          sort_order: number;
          status: Database["public"]["Enums"]["publish_status"];
          summary_en: string | null;
          summary_gu: string | null;
          updated_at: string;
        };
        Insert: {
          covers_en?: string[];
          covers_gu?: string[];
          created_at?: string;
          icon?: string;
          id?: string;
          image_is_photo?: boolean;
          image_path?: string | null;
          is_candidate?: boolean;
          key: string;
          name_en: string;
          name_gu?: string | null;
          problem_en?: string | null;
          problem_gu?: string | null;
          published_at?: string | null;
          signs_en?: string[];
          signs_gu?: string[];
          slug: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["publish_status"];
          summary_en?: string | null;
          summary_gu?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
        Relationships: [];
      };
      site_content: {
        Row: {
          id: string;
          key: string;
          locale: Locale;
          updated_at: string;
          updated_by: string | null;
          value: Json;
        };
        Insert: {
          id?: string;
          key: string;
          locale: Locale;
          updated_at?: string;
          updated_by?: string | null;
          value: Json;
        };
        Update: Partial<Database["public"]["Tables"]["site_content"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      admin_role: "admin";
      availability: "in_stock" | "on_order" | "unavailable" | "unknown";
      inquiry_source: "web_form" | "whatsapp" | "phone";
      inquiry_status: "new" | "in_progress" | "answered" | "closed";
      locale: "en" | "gu";
      publish_status: "draft" | "published";
      service_request_status:
        "new" | "acknowledged" | "in_progress" | "completed" | "cancelled";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];
