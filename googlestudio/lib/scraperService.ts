/**
 * Serviço de scraping via Supabase Edge Function
 * Usa a função analyze-url existente no Supabase
 */

import { supabase, getOrCreateUser } from './supabase';

export interface UrlAnalysisResult {
  brandName: string;
  niche: string;
  estimatedAdsCount: number;
  landingPageUrl: string;
  summary: string;
  trafficEstimate: string;
}

/**
 * Analisa uma URL da Meta Ad Library
 * Usa a Edge Function analyze-url do Supabase
 */
export async function analyzeLibraryUrl(url: string): Promise<UrlAnalysisResult | null> {
  if (!supabase) {
    console.error('Supabase não está configurado. Configure as variáveis de ambiente na Vercel Dashboard.');
    return null;
  }
  
  try {
    const user = await getOrCreateUser();
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    // Obter token de sessão
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.access_token) {
      throw new Error('Failed to get session token');
    }

    // Chamar Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-url', {
      body: { url },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) {
      console.error('Error calling analyze-url function:', error);
      throw error;
    }

    if (!data || data.error) {
      console.error('Error from analyze-url function:', data?.error);
      return null;
    }

    return data as UrlAnalysisResult;
  } catch (error) {
    console.error('Error in analyzeLibraryUrl:', error);
    return null;
  }
}

/**
 * Atualiza dados de uma biblioteca existente
 */
export async function updateLibraryData(url: string): Promise<UrlAnalysisResult | null> {
  return analyzeLibraryUrl(url);
}

