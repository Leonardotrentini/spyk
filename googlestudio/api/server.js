/**
 * Servidor Express para API de Scraping
 * Roda na porta 3001
 */

import express from 'express';
import cors from 'cors';
import { scrapeMetaAdLibrary } from '../services/metaAdLibraryScraper.js';
import { scrapeSimilarWeb } from '../services/similarwebScraper.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Scraper API is running' });
});

// Endpoint para scraping de tráfego do SimilarWeb
app.post('/api/traffic', async (req, res) => {
  try {
    const { landingPageUrl } = req.body;

    if (!landingPageUrl) {
      return res.status(400).json({ 
        error: 'Landing page URL is required',
        message: 'Please provide a landingPageUrl in the request body'
      });
    }

    console.log(`🚀 Starting SimilarWeb scrape for: ${landingPageUrl}`);

    // Executa o scraper do SimilarWeb
    const result = await scrapeSimilarWeb(landingPageUrl);

    console.log(`✅ SimilarWeb scrape completed:`, result);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ SimilarWeb scrape error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint principal de scraping
app.post('/api/scrape', async (req, res) => {
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

    console.log(`🚀 Starting scrape for: ${url}`);

    // Executa o scraper
    const result = await scrapeMetaAdLibrary(url);

    console.log(`✅ Scrape completed:`, result);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Scrape error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint para atualizar uma biblioteca específica (usado para atualização em tempo real)
app.post('/api/update-library', async (req, res) => {
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

    res.json({
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
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Scraper API Server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoint: POST http://localhost:${PORT}/api/scrape\n`);
});

