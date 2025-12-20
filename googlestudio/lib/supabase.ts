/**
 * Cliente Supabase configurado
 * Usa variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper para obter o usuário atual (ou criar sessão anônima se não houver)
export async function getOrCreateUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      return session.user;
    }
    
    // Se não houver sessão, criar uma anônima
    // Nota: Requer que Auth Anonymous esteja habilitado no Supabase
    // Para habilitar: Supabase Dashboard > Authentication > Providers > Enable Anonymous Sign-ins
    const { data, error } = await supabase.auth.signInAnonymously();
    
    if (error) {
      console.error('Error creating anonymous session:', error);
      console.warn('⚠️ Anonymous auth may not be enabled. Please enable it in Supabase Dashboard > Authentication > Providers');
      // Retornar null - o dataService vai tratar o erro
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    return null;
  }
}

