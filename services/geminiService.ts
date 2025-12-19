<<<<<<< HEAD
// This file replaces the original geminiService.ts
// It now calls Supabase Edge Functions instead of Google Gemini API directly
// The API signatures remain the same to maintain compatibility with the UI

import { supabase } from '../lib/supabase/client';
import { TrafficStats } from '../types';
=======
import { GoogleGenAI, Type } from "@google/genai";
import { TrafficStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
>>>>>>> 67aac4f327c2bf1a6214bcda81527dfb41c16f57

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
<<<<<<< HEAD
  score: number;
=======
  score: number; // 1-10 indicating potential
>>>>>>> 67aac4f327c2bf1a6214bcda81527dfb41c16f57
}

export interface MarketTrendReport {
  topic: string;
<<<<<<< HEAD
  nicheScore: number;
=======
  nicheScore: number; // 0-100
>>>>>>> 67aac4f327c2bf1a6214bcda81527dfb41c16f57
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

<<<<<<< HEAD
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
=======
// Improved JSON Parser to handle markdown and extra text
const parseJsonFromText = (text: string): any => {
  try {
    let cleanText = text.trim();
    
    // Find the first open brace and last close brace to extract valid JSON
    const start = cleanText.indexOf('{');
    const end = cleanText.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        cleanText = cleanText.substring(start, end + 1);
    } else {
        // Fallback cleanup if braces not found correctly (e.g. array)
        cleanText = cleanText.replace(/^```(json)?/, '').replace(/```$/, '');
    }

    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    // Try one more aggressive cleanup for common markdown issues
    try {
        const aggressiveClean = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const start = aggressiveClean.indexOf('{');
        const end = aggressiveClean.lastIndexOf('}');
        if(start !== -1 && end !== -1) {
            return JSON.parse(aggressiveClean.substring(start, end + 1));
        }
    } catch(e2) {}
    return null;
  }
};

export const analyzeLibraryUrl = async (url: string): Promise<UrlAnalysisResult | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this Ad Library or Website URL: ${url}. 
      
      I need you to extract or infer the following information:
      1. Brand Name: The likely name of the company or page.
      2. Niche: The specific industry or category (e.g., "Skincare", "Crypto", "E-commerce", "SaaS").
      3. Active Ads Count: PRIORITIZE finding the *actual* number of active ads running for this brand by using Google Search (e.g. searching for "[Brand Name] ad library active ads" or checking the library page metadata in search results). If a specific count is found, use that. Only if no data is found, estimate based on brand size (Small=5, Medium=20, Large=100+).
      4. Landing Page URL: The main website or landing page associated with this ad library.
      5. Summary: A very brief 1-sentence description of what they sell.
      6. Traffic Estimate: Estimate the monthly website traffic for this brand's main domain (e.g., "High (500k+)", "Medium (50k-100k)", "Low (<10k)", "Unknown"). Use Google Search to find data points (e.g. from Similarweb snippets or press kits).

      Use Google Search to verify the brand if the URL is cryptic.

      Return the result as a valid JSON object (no markdown, no code fence) with the following keys:
      {
        "brandName": "string",
        "niche": "string",
        "estimatedAdsCount": number,
        "landingPageUrl": "string",
        "summary": "string",
        "trafficEstimate": "string"
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        // NOTE: responseMimeType is NOT allowed with googleSearch
      },
    });

    if (response.text) {
      return parseJsonFromText(response.text) as UrlAnalysisResult;
    }
    return null;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};

export const getTrafficAnalytics = async (brandName: string, url: string): Promise<TrafficStats | null> => {
  try {
    // Switched to gemini-2.5-flash for faster response time
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the web traffic for the brand "${brandName}" (URL: ${url}).
      Use Google Search to find recent traffic data (Similarweb, Semrush, etc.).

      I need:
      1. Total Monthly Visits (e.g. "1.2M", "50k")
      2. Bounce Rate (e.g. "45%")
      3. Avg Visit Duration (e.g. "02:30")
      4. Pages per Visit (e.g. "3.5")
      5. Historical Trend: Estimate the traffic visits (number) for the LAST 6 MONTHS. 
         If exact data isn't available, infer a realistic trend based on the brand's popularity and seasonality.
         Return exactly 6 data points. Dates should be "Jan", "Feb", etc.

      Return valid JSON only. Do not use markdown code blocks.
      Format:
      {
        "totalVisits": "string",
        "bounceRate": "string",
        "avgDuration": "string",
        "pagesPerVisit": "string",
        "history": [
           { "date": "string", "visits": number }
        ]
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        // Removed thinkingConfig to avoid long loading times
      },
    });

    if (response.text) {
      return parseJsonFromText(response.text) as TrafficStats;
    }
    return null;
  } catch (error) {
    console.error("Traffic analysis failed:", error);
    // Return empty fallback to prevent UI hanging
    return {
       totalVisits: "N/A",
       bounceRate: "-",
       avgDuration: "-",
       pagesPerVisit: "-",
       history: []
>>>>>>> 67aac4f327c2bf1a6214bcda81527dfb41c16f57
    };
  }
};

<<<<<<< HEAD
export const suggestNiches = async (
  entries: { brandName: string; notes?: string }[]
): Promise<string[]> => {
  try {
    // This is a simpler function - we can call research-market with a special type
    // Or we could create a separate endpoint. For now, we'll return empty array
    // and suggest creating niches from existing library entries
    return [];
  } catch (e) {
=======
export const suggestNiches = async (entries: { brandName: string, notes?: string }[]): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Here is a list of brands: ${JSON.stringify(entries)}. Suggest 5 new, distinct trending niches that these might fit into or that are related, for a direct response marketing dashboard. Return just a JSON array of strings.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        if(response.text) {
            return JSON.parse(response.text);
        }
        return [];
    } catch (e) {
        return [];
    }
};

export const getCountryTrends = async (country: string): Promise<{ topic: string, category: string }[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `What are the top 10 trending market niches, product categories, or consumer search topics in ${country} right now? 
      Focus on topics with high commercial intent (things people want to buy or learn about).
      
      Return ONLY a valid raw JSON array of objects with "topic" and "category". 
      Do NOT wrap in markdown.
      Example: [{"topic": "Matcha Tea Sets", "category": "Food & Bev"}]`,
      config: {
        tools: [{ googleSearch: {} }],
        // NOTE: responseMimeType is NOT allowed with googleSearch. We must parse text manually.
      },
    });

    if (response.text) {
      const result = parseJsonFromText(response.text);
      return Array.isArray(result) ? result : [];
    }
    return [];
  } catch (error) {
    console.error("Country trends failed:", error);
>>>>>>> 67aac4f327c2bf1a6214bcda81527dfb41c16f57
    return [];
  }
};

<<<<<<< HEAD
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
=======
export const analyzeMarketTrends = async (topic: string, country: string): Promise<MarketTrendReport | null> => {
  try {
    // UPGRADED to gemini-3-pro-preview with Thinking Mode for complex analysis
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a comprehensive market research analysis for the topic: "${topic}" specifically for the market in: ${country}.
      
      CRITICAL INSTRUCTION:
      1. Translate the topic "${topic}" into the NATIVE language of ${country} (e.g., if Country is 'United States', use English; if 'Brazil', use Portuguese; if 'Japan', use Japanese).
      2. Use this TRANSLATED term to perform all Google Searches and analysis to ensure local relevance.
      3. Return the results in English, but based on the local language data.

      I need you to find:
      1. Niche Viability Score: A score from 0-100 indicating how profitable and accessible this niche is in ${country}, and a 1-sentence Verdict.
      2. Keyword Intelligence: Find 6-8 distinct, related search terms or sub-niches (in the native language of ${country}). For each, estimate the Search Volume (e.g. "High", "10k-50k", "Very High") and Competition Level (Low/Medium/High). Assign a score (1-10) to each term based on opportunity.
      3. Top 5 currently trending search keywords/queries related to this topic in ${country}.
      4. 5 Common questions or "pain points" people in ${country} are searching for.
      5. 3 Rising related topics in ${country}.
      6. 3 Product Opportunities: Specific ideas relevant to this market.

      Return the result as a valid JSON object with this structure:
      {
        "topic": "${topic} (Translated: [Native Term])",
        "nicheScore": number,
        "nicheVerdict": "string",
        "keywordAnalysis": [
           { "term": "string", "volume": "string", "competition": "Low" | "Medium" | "High", "score": number }
        ],
        "trendingKeywords": ["string"],
        "commonQuestions": ["string"],
        "risingRelatedTopics": ["string"],
        "productOpportunities": [
           { "title": "string", "description": "string", "difficulty": "Low" | "Medium" | "High", "potentialRevenue": "string" }
        ]
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for deep analysis
        // NOTE: responseMimeType is NOT allowed with googleSearch
      },
    });

    if (response.text) {
      return parseJsonFromText(response.text) as MarketTrendReport;
    }
    return null;
  } catch (error) {
    console.error("Market research failed:", error);
    return null;
  }
};
>>>>>>> 67aac4f327c2bf1a6214bcda81527dfb41c16f57
