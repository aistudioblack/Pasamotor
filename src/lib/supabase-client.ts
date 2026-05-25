import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ SUPABASE CONFIG MISSING! Lütfen .env dosyasını tanımlayın.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const dbClient = supabase; // for backward compatibility during transition
