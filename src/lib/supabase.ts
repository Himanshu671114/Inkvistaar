import { createClient } from '@supabase/supabase-js';

// Read from Vite environment variables with graceful fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zqrjnqplojdfzesjklfe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__UkWRElSXGt6W5J8K_FK_w_awhbK7ZY';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('PASTE') &&
  !supabaseAnonKey.includes('PASTE')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
