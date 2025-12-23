
import { createClient } from '@supabase/supabase-js';

// Access variables using import.meta.env (for Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key env variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);