import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente de navegador que gestiona cookies automáticamente para sincronización con el Middleware
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);