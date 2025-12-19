import { chromium, Browser, Page } from 'playwright';
import { loadConfig } from '../config';

export type SearchAdHit = {
  keyword: string;
  country: string;
  pageId: string;
  pageName: string;
  adId: string | null;
};

const SCROLL_DELAY = 2000; // 2 segundos entre scrolls
const MAX_SCROLL_ITERATIONS = 50; // Limite de segurança
const PAGE_LOAD_TIMEOUT = 30000; // 30 segundos

export async function scrapeAdLibrarySearch(
  keyword: string,
  country: string
): Promise<SearchAdHit[]> {
  const config = loadConfig();
  const browser = await chromium.launch({ headless: config.headless });
  const page = await browser.newPage();

  try {
    const url = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&q=${encodeURIComponent(keyword)}&search_type=keyword_unordered`;
    
    console.log(`🔍 Buscando: "${keyword}" em ${country}`);
    console.log(`📄 URL: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle', timeout: PAGE_LOAD_TIMEOUT });
    
    // Aguardar carregamento inicial dos cards
    await page.waitForTimeout(3000);

    // Scroll infinito
    let previousHeight = 0;
    let currentHeight = await page.evaluate(() => document.body.scrollHeight);
    let scrollIterations = 0;

    while (currentHeight > previousHeight && scrollIterations < MAX_SCROLL_ITERATIONS) {
      previousHeight = currentHeight;
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(SCROLL_DELAY);
      currentHeight = await page.evaluate(() => document.body.scrollHeight);
      scrollIterations++;
    }

    console.log(`✅ Scroll completo após ${scrollIterations} iterações`);

    // DEBUG: Tirar screenshot para ver o que está na página
    if (!config.headless) {
      await page.screenshot({ path: 'debug-search.png', fullPage: true });
      console.log('📸 Screenshot salvo: debug-search.png');
    }

    // Extrair dados dos cards com informações de debug
    const result = await page.evaluate(({ keyword, country }: { keyword: string; country: string }) => {
      const results: Array<{
        keyword: string;
        country: string;
        pageId: string;
        pageName: string;
        adId: string | null;
      }> = [];
      
      // DEBUG: Tentar múltiplos seletores
      const selectors = [
        '[data-testid*="ad"]',
        '[role="article"]',
        'div[class*="x1y1aw1k"]',
        'div[class*="x1n2onr6"]',
        'div[class*="x1i10hfl"]',
        'div[class*="x78zum5"]',
        'div[class*="x1y1aw1k"]',
        'div[class*="x1n2onr6"]',
        'a[href*="/ads/library"]',
        'a[href*="view_all_page_id"]',
      ];
      
      const allCards = new Set<Element>();
      const debugInfo: { [key: string]: number } = {};
      
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          debugInfo[selector] = elements.length;
          elements.forEach(el => {
            // Se for um link, pegar o container pai
            if (el.tagName === 'A') {
              let parent = el.parentElement;
              for (let i = 0; i < 5 && parent; i++) {
                if (parent.tagName === 'DIV' || parent.tagName === 'ARTICLE') {
                  allCards.add(parent);
                  break;
                }
                parent = parent.parentElement;
              }
            } else {
              allCards.add(el);
            }
          });
        } catch (e) {
          debugInfo[selector] = -1;
        }
      });
      
      const adCards = Array.from(allCards);
      
      adCards.forEach((card) => {
        try {
          // Tentar extrair pageId de links ou atributos
          let pageId = '';
          let pageName = '';
          let adId: string | null = null;

          // Buscar links que contenham page_id ou view_all_page_id
          const links = card.querySelectorAll('a[href]');
          for (const link of links) {
            let href = link.getAttribute('href') || '';
            // Se for relativo, converter para absoluto
            if (href.startsWith('/')) {
              href = 'https://www.facebook.com' + href;
            }
            
            // Tentar diferentes padrões de URL
            const patterns = [
              /view_all_page_id=([^&]+)/,
              /page_id=([^&]+)/,
              /\/ads\/library\/\?.*view_all_page_id=([^&]+)/,
              /\/ads\/library\/\?.*page_id=([^&]+)/,
              /view_all_page_id%3D([^&%]+)/, // URL encoded
              /page_id%3D([^&%]+)/, // URL encoded
            ];
            
            for (const pattern of patterns) {
              const match = href.match(pattern);
              if (match) {
                pageId = decodeURIComponent(match[1]);
                break;
              }
            }
            
            if (pageId) break;
          }

          // Se não encontrou no link, tentar buscar o nome da página e depois clicar para ver o pageId
          if (!pageId) {
            // Tentar encontrar link do nome da página (geralmente é um link que leva para a página)
            const pageLinks = card.querySelectorAll('a[href*="/pages/"], a[href*="/profile.php"], a[href*="facebook.com"]');
            for (const pageLink of pageLinks) {
              const href = pageLink.getAttribute('href') || '';
              // Extrair ID da página de URLs como /pages/123456 ou profile.php?id=123456
              const pageIdFromUrl = href.match(/\/pages\/(\d+)/) || 
                                   href.match(/profile\.php\?id=(\d+)/) ||
                                   href.match(/facebook\.com\/(\d+)/);
              if (pageIdFromUrl) {
                pageId = pageIdFromUrl[1];
                break;
              }
            }
          }
          
          // Se ainda não encontrou, tentar buscar em todos os atributos do card e seus filhos
          if (!pageId) {
            const allElements = card.querySelectorAll('*');
            for (const el of allElements) {
              const allAttrs = el.getAttributeNames();
              for (const attr of allAttrs) {
                const value = el.getAttribute(attr) || '';
                const match = value.match(/view_all_page_id[=:]([^&\s"']+)/) || 
                             value.match(/page_id[=:]([^&\s"']+)/) ||
                             value.match(/(\d{15,})/); // IDs de página do Facebook geralmente têm 15+ dígitos
                if (match) {
                  pageId = match[1];
                  break;
                }
              }
              if (pageId) break;
            }
          }

          // Extrair nome da página E tentar obter pageId do link da página
          const pageNameElement = card.querySelector('[dir="auto"] a, .x1i10hfl a, [data-testid*="page"], a[href*="/pages/"], a[href*="profile.php"], a[href*="facebook.com"]');
          if (pageNameElement) {
            pageName = pageNameElement.textContent?.trim() || '';
            
            // Se ainda não tem pageId, tentar extrair do link do nome da página
            if (!pageId && pageNameElement.tagName === 'A') {
              const pageHref = pageNameElement.getAttribute('href') || '';
              // Padrões de URL do Facebook para páginas:
              // /pages/NOME/ID ou /NOME ou profile.php?id=ID
              const pageIdFromNameLink = pageHref.match(/\/pages\/[^\/]+\/(\d+)/) ||
                                        pageHref.match(/profile\.php\?id=(\d+)/) ||
                                        pageHref.match(/facebook\.com\/(\d+)/) ||
                                        pageHref.match(/\/pages\/(\d+)/);
              if (pageIdFromNameLink) {
                pageId = pageIdFromNameLink[1];
              }
            }
          }
          
          // Se ainda não tem pageId, procurar em qualquer link que pareça ser de página
          if (!pageId) {
            const allPageLinks = card.querySelectorAll('a[href*="/pages/"], a[href*="profile.php"], a[href*="facebook.com"]');
            for (const link of allPageLinks) {
              const href = link.getAttribute('href') || '';
              const pageIdMatch = href.match(/\/pages\/[^\/]+\/(\d+)/) ||
                                 href.match(/\/pages\/(\d+)/) ||
                                 href.match(/profile\.php\?id=(\d+)/) ||
                                 href.match(/facebook\.com\/(\d+)/);
              if (pageIdMatch) {
                pageId = pageIdMatch[1];
                if (!pageName) {
                  pageName = link.textContent?.trim() || '';
                }
                break;
              }
            }
          }

          // Tentar extrair adId (geralmente aparece como "ID do anúncio: ...")
          const adIdText = card.textContent || '';
          const adIdMatch = adIdText.match(/ID do anúncio[:\s]+([A-Za-z0-9_-]+)/i) || 
                           adIdText.match(/Ad ID[:\s]+([A-Za-z0-9_-]+)/i);
          if (adIdMatch) {
            adId = adIdMatch[1];
          }

          // Só adicionar se tiver pageId
          if (pageId) {
            results.push({
              keyword,
              country,
              pageId,
              pageName: pageName || 'Unknown',
              adId,
            });
          }
        } catch (error) {
          // Ignorar erros em cards individuais
          console.error('Erro ao processar card:', error);
        }
      });

      return {
        results,
        debug: {
          totalCards: adCards.length,
          selectors: debugInfo,
          pageTitle: document.title,
          url: window.location.href,
          bodyText: document.body.innerText.substring(0, 500),
        }
      };
    }, { keyword, country });
    
    // Log informações de debug
    if (result.debug) {
      console.log('🔍 DEBUG - Informações da página:');
      console.log(`  Título: ${result.debug.pageTitle}`);
      console.log(`  URL: ${result.debug.url}`);
      console.log(`  Total de cards encontrados: ${result.debug.totalCards}`);
      console.log(`  Seletores testados:`, result.debug.selectors);
      if (result.debug.totalCards === 0) {
        console.log(`  Primeiros 500 chars do body:`, result.debug.bodyText.substring(0, 200));
      }
    }
    
    const hits = result.results || [];

    // Remover duplicatas (mesmo pageId na mesma busca)
    const typedHits: SearchAdHit[] = hits as SearchAdHit[];
    const uniqueHits = Array.from(
      new Map(typedHits.map((hit) => [`${hit.pageId}-${hit.keyword}`, hit])).values()
    );

    console.log(`📊 Encontrados ${uniqueHits.length} hits únicos para "${keyword}"`);

    return uniqueHits;
  } catch (error) {
    console.error(`❌ Erro ao fazer scraping de "${keyword}":`, error);
    throw error;
  } finally {
    await browser.close();
  }
}

