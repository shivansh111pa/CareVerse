export type UserRole = "patient" | "doctor";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name?: string;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          phone?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_my_role: {
        Args: Record<PropertyKey, never>;
        Returns: UserRole;
      };
    };
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type AuthTab = "login" | "signup";

export interface AuthFormState {
  error?: string;
  success?: string;
  redirectUrl?: string;
}

export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  patient: "/dashboard/patient",
  doctor: "/dashboard/doctor",
};
