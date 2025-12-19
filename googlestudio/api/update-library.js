/**
 * Vercel Serverless Function - Update Library
 * POST /api/update-library
 */

import { scrapeMetaAdLibrary } from '../services/metaAdLibraryScraper.js';

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
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required',
        message: 'Please provide a URL in the request body'
      });
    }

    // Valida se é URL da Meta Ad Library
    if (!url.includes('facebook.com/ads/library') && !url.includes('meta.com/ads/library')) {
      return res.status(400).json({ 
        error: 'Invalid URL',
        message: 'URL must be from Meta Ad Library (facebook.com/ads/library)'
      });
    }

    console.log(`🔄 Updating library: ${url}`);

    // Executa o scraper para obter dados atualizados
    const result = await scrapeMetaAdLibrary(url);

    console.log(`✅ Library updated:`, result);

    res.status(200).json({
      success: true,
      data: {
        ...result,
        lastChecked: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Update library error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

