import { chromium, Browser, Page } from 'playwright';
import { loadConfig } from '../config';

export type ScrapedAd = {
  adId: string | null;
  text: string | null;
  headline: string | null;
  cta: string | null;
  mediaType: 'image' | 'video' | 'carousel' | 'unknown';
  mediaUrls: string[];
  destinationUrls: string[];
  startedRunningOn: string | null;
};

export type ScrapedPageAds = {
  pageId: string;
  pageName: string | null;
  country: string;
  ads: ScrapedAd[];
};

const SCROLL_DELAY = 2000;
const MAX_SCROLL_ITERATIONS = 100;
const PAGE_LOAD_TIMEOUT = 30000;

export async function scrapeAdLibraryForPage(
  pageId: string,
  country: string
): Promise<ScrapedPageAds> {
  const config = loadConfig();
  const browser = await chromium.launch({ headless: config.headless });
  const page = await browser.newPage();

  try {
    const url = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&view_all_page_id=${pageId}&country=${country}`;
    
    console.log(`📄 Carregando página: ${pageId} (${country})`);
    console.log(`🔗 URL: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle', timeout: PAGE_LOAD_TIMEOUT });
    
    // Aguardar carregamento inicial
    await page.waitForTimeout(3000);

    // Extrair nome da página do cabeçalho
    const pageName = await page.evaluate(() => {
      const header = document.querySelector('h1, [role="heading"], .x1heor9g, [data-testid*="page"]');
      return header?.textContent?.trim() || null;
    });

    console.log(`📛 Nome da página: ${pageName || 'Não encontrado'}`);

    // Scroll infinito para carregar todos os anúncios
    let previousHeight = 0;
    let currentHeight = await page.evaluate(() => document.body.scrollHeight);
    let scrollIterations = 0;

    while (currentHeight > previousHeight && scrollIterations < MAX_SCROLL_ITERATIONS) {
      previousHeight = currentHeight;
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(SCROLL_DELAY);
      currentHeight = await page.evaluate(() => document.body.scrollHeight);
      scrollIterations++;
      
      if (scrollIterations % 10 === 0) {
        console.log(`  📜 Scroll: ${scrollIterations} iterações...`);
      }
    }

    console.log(`✅ Scroll completo após ${scrollIterations} iterações`);

    // Extrair todos os anúncios
    const ads = await page.evaluate(() => {
      const results: ScrapedAd[] = [];
      
      // Seletores para cards de anúncio
      const adCards = document.querySelectorAll('[data-testid*="ad"], .x1y1aw1k, [role="article"]');
      
      adCards.forEach((card) => {
        try {
          // Texto principal (geralmente em divs com dir="auto")
          const textElements = card.querySelectorAll('[dir="auto"]');
          let text = '';
          textElements.forEach((el) => {
            const textContent = el.textContent?.trim() || '';
            if (textContent.length > text.length) {
              text = textContent;
            }
          });

          // Headline (geralmente <strong> ou elemento destacado)
          const headlineElement = card.querySelector('strong, b, [data-testid*="headline"]');
          const headline = headlineElement?.textContent?.trim() || null;

          // CTA (botão "Saiba mais", "Comprar agora", etc.)
          let cta: string | null = null;
          const buttons = card.querySelectorAll('button, [role="button"], a[href*="facebook.com/ads"]');
          buttons.forEach((btn) => {
            const btnText = btn.textContent?.trim() || '';
            if (btnText && (btnText.includes('Saiba mais') || btnText.includes('Comprar') || 
                btnText.includes('Ver mais') || btnText.includes('Learn More') || 
                btnText.includes('Shop Now'))) {
              cta = btnText;
            }
          });

          // Media URLs (imagens e vídeos)
          const mediaUrls: string[] = [];
          const images = card.querySelectorAll('img');
          images.forEach((img) => {
            const src = img.getAttribute('src') || img.getAttribute('data-src');
            if (src && !src.includes('data:image') && !mediaUrls.includes(src)) {
              mediaUrls.push(src);
            }
          });

          const videos = card.querySelectorAll('video');
          videos.forEach((video) => {
            const src = video.getAttribute('src') || video.getAttribute('data-src');
            if (src && !mediaUrls.includes(src)) {
              mediaUrls.push(src);
            }
          });

          // Determinar mediaType
          let mediaType: 'image' | 'video' | 'carousel' | 'unknown' = 'unknown';
          if (videos.length > 0) {
            mediaType = 'video';
          } else if (images.length > 1) {
            mediaType = 'carousel';
          } else if (images.length === 1) {
            mediaType = 'image';
          }

          // Destination URLs (links externos - landing pages)
          const destinationUrls: string[] = [];
          const links = card.querySelectorAll('a[href]');
          links.forEach((link) => {
            const href = link.getAttribute('href') || '';
            // Filtrar apenas links externos (não Facebook)
            // Priorizar links que parecem landing pages (não são redes sociais)
            if (href && !href.includes('facebook.com') && 
                !href.includes('ads/library') && 
                !href.includes('instagram.com') &&
                !href.includes('twitter.com') &&
                !href.includes('linkedin.com') &&
                !href.includes('youtube.com') &&
                !href.startsWith('javascript:') &&
                !href.startsWith('#') &&
                (href.startsWith('http://') || href.startsWith('https://'))) {
              // Se for um link completo, adicionar
              if (!destinationUrls.includes(href)) {
                destinationUrls.push(href);
              }
            }
          });
          
          // Ordenar: links que parecem landing pages primeiro (não são domínios conhecidos de redes sociais)
          destinationUrls.sort((a, b) => {
            const aIsSocial = /(facebook|instagram|twitter|linkedin|youtube|tiktok)\.com/.test(a);
            const bIsSocial = /(facebook|instagram|twitter|linkedin|youtube|tiktok)\.com/.test(b);
            if (aIsSocial && !bIsSocial) return 1;
            if (!aIsSocial && bIsSocial) return -1;
            return 0;
          });

          // Started running on (data de início)
          let startedRunningOn: string | null = null;
          const cardText = card.textContent || '';
          const dateMatch = cardText.match(/Começou a ser exibido em (.+?)(?:\.|$)/i) ||
                           cardText.match(/Started running on (.+?)(?:\.|$)/i) ||
                           cardText.match(/Começou em (.+?)(?:\.|$)/i);
          if (dateMatch) {
            startedRunningOn = dateMatch[1].trim();
          }

          // Ad ID (se disponível)
          let adId: string | null = null;
          const adIdMatch = cardText.match(/ID do anúncio[:\s]+([A-Za-z0-9_-]+)/i) ||
                           cardText.match(/Ad ID[:\s]+([A-Za-z0-9_-]+)/i);
          if (adIdMatch) {
            adId = adIdMatch[1];
          }

          results.push({
            adId,
            text: text || null,
            headline,
            cta,
            mediaType,
            mediaUrls,
            destinationUrls,
            startedRunningOn,
          });
        } catch (error) {
          // Ignorar erros em cards individuais
          console.error('Erro ao processar anúncio:', error);
        }
      });

      return results;
    });

    // Remover duplicatas (mesmo adId ou mesmo texto)
    const typedAds: ScrapedAd[] = ads as ScrapedAd[];
    const uniqueAds = Array.from(
      new Map(
        typedAds.map((ad) => [
          ad.adId || ad.text?.substring(0, 50) || Math.random().toString(),
          ad,
        ])
      ).values()
    );

    console.log(`📊 Extraídos ${uniqueAds.length} anúncios únicos da página ${pageId}`);

    return {
      pageId,
      pageName,
      country,
      ads: uniqueAds,
    };
  } catch (error) {
    console.error(`❌ Erro ao fazer scraping da página ${pageId}:`, error);
    throw error;
  } finally {
    await browser.close();
  }
}

