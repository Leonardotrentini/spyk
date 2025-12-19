/**
 * Vercel Serverless Function - SimilarWeb Traffic
 * POST /api/traffic
 * 
 * NOTA: SimilarWeb scraper pode não funcionar na Vercel devido a limitações do Puppeteer
 * em ambientes serverless. Considere usar uma API externa ou serviço dedicado.
 */

import { scrapeSimilarWeb } from '../services/similarwebScraper.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { landingPageUrl } = req.body;

    if (!landingPageUrl) {
      return res.status(400).json({ 
        error: 'Landing page URL is required',
        message: 'Please provide a landingPageUrl in the request body'
      });
    }

    console.log(`🚀 Starting SimilarWeb scrape for: ${landingPageUrl}`);

    // NOTA: Puppeteer pode não funcionar bem na Vercel
    // Considere usar uma alternativa ou serviço externo
    try {
      const result = await scrapeSimilarWeb(landingPageUrl);
      console.log(`✅ SimilarWeb scrape completed:`, result);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (puppeteerError) {
      // Se Puppeteer falhar (comum na Vercel), retorna dados vazios
      console.warn('⚠️ Puppeteer error (expected in serverless):', puppeteerError.message);
      
      res.status(200).json({
        success: true,
        data: {
          totalVisits: "N/A",
          bounceRate: "-",
          avgDuration: "-",
          pagesPerVisit: "-",
          history: [],
          note: "SimilarWeb scraping not available in serverless environment"
        }
      });
    }

  } catch (error) {
    console.error('❌ SimilarWeb scrape error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

