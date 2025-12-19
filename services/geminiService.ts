// This file replaces the original geminiService.ts
// It now calls Supabase Edge Functions instead of Google Gemini API directly
// The API signatures remain the same to maintain compatibility with the UI

import { supabase } from '../lib/supabase/client';
import { TrafficStats } from '../types';

export interface UrlAnalysisResult {
  brandName: string;
  niche: string;
  estimatedAdsCount: number;
  landingPageUrl: string;
  summary: string;
  trafficEstimate: string;
}

export interface KeywordData {
  term: string;
  volume: string;
  competition: 'Low' | 'Medium' | 'High';
  score: number;
}

export interface MarketTrendReport {
  topic: string;
  nicheScore: number;
  nicheVerdict: string;
  trendingKeywords: string[];
  commonQuestions: string[];
  risingRelatedTopics: string[];
  keywordAnalysis: KeywordData[];
  productOpportunities: {
    title: string;
    description: string;
    difficulty: 'Low' | 'Medium' | 'High';
    potentialRevenue: string;
  }[];
}

// Helper to get access token
async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

// Helper to call Edge Function
async function callEdgeFunction(
  functionName: string,
  body: any
): Promise<Response> {
  const token = await getAccessToken();
  
  if (!token) {
    throw new Error('Not authenticated. Please log in.');
  }

  // Extract project ref from Supabase URL
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL not configured');
  }

  // Supabase URL format: https://[project-ref].supabase.co
  const urlMatch = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/);
  if (!urlMatch) {
    throw new Error('Invalid Supabase URL format');
  }

  const projectRef = urlMatch[1];
  const functionUrl = `https://${projectRef}.supabase.co/functions/v1/${functionName}`;

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response;
}

export const analyzeLibraryUrl = async (url: string): Promise<UrlAnalysisResult | null> => {
  try {
    console.log('🔍 Iniciando análise da URL:', url);
    
    // Use Next.js API route wrapper instead of direct Edge Function call
    try {
      const response = await fetch('/api/analyze/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        console.error('Error from analyze-url:', result.error);
        throw new Error(result.error);
      }
      
      console.log('✅ Análise concluída:', result);
      return result as UrlAnalysisResult;
    } catch (edgeError: any) {
      console.warn('⚠️ Edge Function failed, trying manual extraction...', edgeError);
      
      // Fallback: Try to extract from URL parameters
      try {
        const urlObj = new URL(url);
        const pageId = urlObj.searchParams.get('view_all_page_id') || urlObj.searchParams.get('page_id');
        const qParam = urlObj.searchParams.get('q');
        
        if (qParam) {
          return {
            brandName: decodeURIComponent(qParam),
            niche: 'E-commerce',
            estimatedAdsCount: 10,
            landingPageUrl: url,
            summary: 'Ad Library entry',
            trafficEstimate: 'Unknown',
          };
        }
        
        // Show instructions for manual extraction
        console.log('📋 INSTRUÇÕES PARA EXTRAÇÃO MANUAL:');
        console.log('1. Abra a URL no browser: ' + url);
        console.log('2. Abra o Console (F12)');
        console.log('3. Cole o script do arquivo extract-from-page.js');
        console.log('4. Os dados serão copiados automaticamente');
        
        throw edgeError; // Re-throw original error
      } catch (fallbackError) {
        throw edgeError;
      }
    }
  } catch (error: any) {
    console.error('❌ Gemini analysis failed:', error);
    
    // Re-throw para o componente poder tratar
    throw error;
  }
};

export const getTrafficAnalytics = async (
  brandName: string,
  url: string,
  libraryEntryId?: string
): Promise<TrafficStats | null> => {
  try {
    const response = await fetch('/api/analyze/traffic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandName, url, libraryEntryId }),
    });
    const result = await response.json();
    
    if (result.error) {
      console.error('Error from analyze-traffic:', result.error);
      // Return fallback instead of null to prevent UI hanging
      return {
        totalVisits: "N/A",
        bounceRate: "-",
        avgDuration: "-",
        pagesPerVisit: "-",
        history: []
      };
    }
    
    return result as TrafficStats;
  } catch (error) {
    console.error('Traffic analysis failed:', error);
    // Return fallback instead of null to prevent UI hanging
    return {
      totalVisits: "N/A",
      bounceRate: "-",
      avgDuration: "-",
      pagesPerVisit: "-",
      history: []
    };
  }
};

export const suggestNiches = async (
  entries: { brandName: string; notes?: string }[]
): Promise<string[]> => {
  try {
    // This is a simpler function - we can call research-market with a special type
    // Or we could create a separate endpoint. For now, we'll return empty array
    // and suggest creating niches from existing library entries
    return [];
  } catch (e) {
    return [];
  }
};

export const getCountryTrends = async (
  country: string
): Promise<{ topic: string; category: string }[]> => {
  try {
    const response = await fetch('/api/research/market', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, type: 'country-trends' }),
    });
    const result = await response.json();
    
    if (result.error) {
      console.error('Error from research-market (country-trends):', result.error);
      return [];
    }
    
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Country trends failed:', error);
    return [];
  }
};

export const analyzeMarketTrends = async (
  topic: string,
  country: string
): Promise<MarketTrendReport | null> => {
  try {
    const response = await fetch('/api/research/market', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, country, type: 'market-trends' }),
    });
    const result = await response.json();
    
    if (result.error) {
      console.error('Error from research-market (market-trends):', result.error);
      return null;
    }
    
    return result as MarketTrendReport;
  } catch (error) {
    console.error('Market research failed:', error);
    return null;
  }
};
