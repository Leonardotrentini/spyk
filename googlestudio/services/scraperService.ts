import { TrafficStats } from "../types";
// Puppeteer não funciona no browser - será usado apenas no backend
// import { scrapeMetaAdLibrary } from "./metaAdLibraryScraper";

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
  score: number; // 1-10 indicating potential
}

export interface MarketTrendReport {
  topic: string;
  nicheScore: number; // 0-100
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

/**
 * Analisa uma URL de biblioteca de anúncios
 * Faz chamada para API backend que usa Puppeteer para scraping real
 */
export const analyzeLibraryUrl = async (url: string): Promise<UrlAnalysisResult | null> => {
  try {
    // Verifica se é uma URL da Meta Ad Library
    if (!url.includes('facebook.com/ads/library') && !url.includes('meta.com/ads/library')) {
      const urlObj = new URL(url);
      return {
        brandName: 'Unknown Brand',
        niche: 'E-commerce',
        estimatedAdsCount: 0,
        landingPageUrl: urlObj.origin,
        summary: 'URL não é da Meta Ad Library',
        trafficEstimate: 'Unknown'
      };
    }

    // Faz chamada para API backend
    // Em produção (Vercel), usa URL relativa. Em desenvolvimento, usa localhost
    const API_URL = import.meta.env.VITE_API_URL || 
      (import.meta.env.PROD ? '' : 'http://localhost:3001');
    
    const response = await fetch(`${API_URL}/api/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error('Invalid response from API');
    }

    const data = result.data;
    const urlObj = new URL(url);
    
    // Usa a landing page extraída do scraper, ou fallback para origin da URL
    const landingPage = data.landingPageUrl || urlObj.origin;
    
    // Converte dados do scraper para o formato esperado
    return {
      brandName: data.pageName || 'Unknown Brand',
      niche: 'E-commerce', // TODO: Implementar detecção de nicho
      estimatedAdsCount: data.totalActiveAds || 0,
      landingPageUrl: landingPage,
      summary: `${data.pageName} - ${data.totalActiveAds} anúncios ativos desde ${data.firstAdStartDate}`,
      trafficEstimate: data.firstAdActiveTime || 'Unknown'
    };
  } catch (error) {
    console.error("Scraper analysis failed:", error);
    
    // Fallback: retorna dados básicos em caso de erro
    try {
      const urlObj = new URL(url);
      const pageIdMatch = url.match(/view_all_page_id=(\d+)/);
      const pageId = pageIdMatch ? pageIdMatch[1] : 'unknown';
      
      return {
        brandName: `Page ${pageId}`,
        niche: 'E-commerce',
        estimatedAdsCount: 0,
        landingPageUrl: urlObj.origin,
        summary: `Erro ao fazer scraping: ${error instanceof Error ? error.message : 'Unknown error'}`,
        trafficEstimate: 'Unknown'
      };
    } catch (e) {
      return null;
    }
  }
};

/**
 * Atualiza dados de uma biblioteca específica (para atualização em tempo real)
 */
export const updateLibraryData = async (url: string): Promise<UrlAnalysisResult | null> => {
  try {
    if (!url.includes('facebook.com/ads/library') && !url.includes('meta.com/ads/library')) {
      const urlObj = new URL(url);
      return {
        brandName: 'Unknown Brand',
        niche: 'E-commerce',
        estimatedAdsCount: 0,
        landingPageUrl: urlObj.origin,
        summary: 'URL não é da Meta Ad Library',
        trafficEstimate: 'Unknown'
      };
    }

    const API_URL = import.meta.env.VITE_API_URL || 
      (import.meta.env.PROD ? '' : 'http://localhost:3001');
    
    const apiPath = `${API_URL}/api/update-library`;
    const response = await fetch(apiPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error('Invalid response from API');
    }

    const data = result.data;
    const urlObj = new URL(url);
    
    return {
      brandName: data.pageName || 'Unknown Brand',
      niche: 'E-commerce',
      estimatedAdsCount: data.totalActiveAds || 0,
      landingPageUrl: data.landingPageUrl || urlObj.origin,
      summary: `${data.pageName} - ${data.totalActiveAds} anúncios ativos desde ${data.firstAdStartDate}`,
      trafficEstimate: data.firstAdActiveTime || 'Unknown'
    };
  } catch (error) {
    console.error("Library update failed:", error);
    return null;
  }
};

/**
 * Obtém estatísticas de tráfego usando scraper do SimilarWeb
 * Extrai dados reais do SimilarWeb.com
 */
export const getTrafficAnalytics = async (brandName: string, url: string): Promise<TrafficStats | null> => {
  try {
    // Verifica se temos uma landing page válida
    if (!url || url.includes('facebook.com') || url.includes('meta.com')) {
      // Se não tiver landing page válida, retorna dados vazios
      return {
        totalVisits: "N/A",
        bounceRate: "-",
        avgDuration: "-",
        pagesPerVisit: "-",
        history: []
      };
    }

    // Faz chamada para API backend que usa scraper do SimilarWeb
    const API_URL = import.meta.env.VITE_API_URL || 
      (import.meta.env.PROD ? '' : 'http://localhost:3001');
    
    const apiPath = `${API_URL}/api/traffic`;
    const response = await fetch(apiPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ landingPageUrl: url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error('Invalid response from API');
    }

    return result.data;
  } catch (error) {
    console.error("Traffic analysis failed:", error);
    
    // Fallback: retorna dados vazios em caso de erro
    return {
      totalVisits: "N/A",
      bounceRate: "-",
      avgDuration: "-",
      pagesPerVisit: "-",
      history: []
    };
  }
};

/**
 * Sugere nichos baseado nas entradas existentes
 * TODO: Implementar análise de padrões usando scraper
 */
export const suggestNiches = async (entries: { brandName: string, notes?: string }[]): Promise<string[]> => {
  try {
    // TODO: Implementar análise de padrões usando scraper
    // Por enquanto, retorna sugestões padrão
    const defaultNiches = ['E-commerce', 'SaaS', 'Health & Wellness', 'Crypto', 'Real Estate'];
    return defaultNiches;
  } catch (e) {
    return [];
  }
};

/**
 * Obtém tendências de mercado por país usando scraper
 * TODO: Implementar scraper para Google Trends, etc.
 */
export const getCountryTrends = async (country: string): Promise<{ topic: string, category: string }[]> => {
  try {
    // TODO: Implementar scraper real para Google Trends ou outras fontes
    // Por enquanto, retorna tendências mockadas
    const mockTrends = [
      { topic: "Sustainable Products", category: "E-commerce" },
      { topic: "AI Tools", category: "SaaS" },
      { topic: "Fitness Apps", category: "Health & Wellness" },
      { topic: "Cryptocurrency", category: "Finance" },
      { topic: "Remote Work", category: "SaaS" },
      { topic: "Organic Food", category: "E-commerce" },
      { topic: "Mental Health", category: "Health & Wellness" },
      { topic: "Electric Vehicles", category: "Automotive" },
      { topic: "Home Automation", category: "Tech" },
      { topic: "Online Education", category: "EdTech" }
    ];
    return mockTrends;
  } catch (error) {
    console.error("Country trends failed:", error);
    return [];
  }
};

/**
 * Analisa tendências de mercado usando scraper
 * TODO: Implementar scraper real para análise de mercado
 */
export const analyzeMarketTrends = async (topic: string, country: string): Promise<MarketTrendReport | null> => {
  try {
    // TODO: Implementar scraper real para análise de mercado
    // Por enquanto, retorna dados mockados
    
    const mockReport: MarketTrendReport = {
      topic: `${topic} (${country})`,
      nicheScore: Math.floor(Math.random() * 40) + 50, // 50-90
      nicheVerdict: `The ${topic} niche shows moderate potential in ${country} with growing interest.`,
      trendingKeywords: [
        `${topic} trends`,
        `best ${topic}`,
        `${topic} reviews`,
        `${topic} guide`,
        `${topic} tips`
      ],
      commonQuestions: [
        `What are the best ${topic} options?`,
        `How to get started with ${topic}?`,
        `Is ${topic} worth it?`,
        `What to consider when choosing ${topic}?`,
        `Where to find ${topic} resources?`
      ],
      risingRelatedTopics: [
        `${topic} alternatives`,
        `${topic} comparison`,
        `${topic} benefits`
      ],
      keywordAnalysis: [
        { term: topic, volume: "10k-50k", competition: 'Medium', score: 7 },
        { term: `${topic} guide`, volume: "5k-10k", competition: 'Low', score: 8 },
        { term: `best ${topic}`, volume: "20k-50k", competition: 'High', score: 6 },
        { term: `${topic} reviews`, volume: "10k-20k", competition: 'Medium', score: 7 },
        { term: `${topic} tips`, volume: "5k-10k", competition: 'Low', score: 8 }
      ],
      productOpportunities: [
        {
          title: `${topic} Starter Kit`,
          description: `A comprehensive package for beginners interested in ${topic}.`,
          difficulty: 'Low',
          potentialRevenue: "$10k-50k/mo"
        },
        {
          title: `${topic} Premium Service`,
          description: `Advanced features and support for ${topic} enthusiasts.`,
          difficulty: 'Medium',
          potentialRevenue: "$50k-100k/mo"
        },
        {
          title: `${topic} Enterprise Solution`,
          description: `Scalable solution for businesses in the ${topic} space.`,
          difficulty: 'High',
          potentialRevenue: "$100k+/mo"
        }
      ]
    };
    
    return mockReport;
  } catch (error) {
    console.error("Market research failed:", error);
    return null;
  }
};

