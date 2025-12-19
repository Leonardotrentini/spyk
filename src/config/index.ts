export interface Config {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  headless: boolean;
  defaultCountry: string;
}

export function loadConfig(): Config {
  // Carregar variáveis de ambiente (suporta .env, .env.local, etc.)
  if (typeof require !== 'undefined') {
    try {
      require('dotenv').config();
      require('dotenv').config({ path: '.env.local' });
    } catch (e) {
      // dotenv não disponível, continuar
    }
  }

  // Aceita tanto SUPABASE_URL quanto NEXT_PUBLIC_SUPABASE_URL
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const headless = process.env.ADLIB_SCRAPER_HEADLESS !== 'false';
  const defaultCountry = process.env.DEFAULT_COUNTRY || 'BR';

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL não configurado no .env');
  }

  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurado no .env');
  }

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
    headless,
    defaultCountry,
  };
}

export function buildKeywordJob(keywords: string[]): string[] {
  if (keywords.length > 20) {
    throw new Error('Máximo de 20 palavras-chave permitidas');
  }
  return keywords;
}

