import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type DbProduct = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};
