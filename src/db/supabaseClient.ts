import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  // Log para debug (apenas primeiros e últimos caracteres)
  const keyPreview = supabaseServiceRoleKey 
    ? `${supabaseServiceRoleKey.substring(0, 20)}...${supabaseServiceRoleKey.substring(supabaseServiceRoleKey.length - 10)}`
    : 'NÃO CONFIGURADO';
  console.log(`🔑 Usando Supabase URL: ${supabaseUrl}`);
  console.log(`🔑 Service Role Key: ${keyPreview}`);
  
  supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseClient;
}

