/**
 * SCRAPER BRUTAL - Meta Ad Library
 * Extração robusta de dados da biblioteca de anúncios do Facebook/Meta
 */

import puppeteer from 'puppeteer';

export interface AdLibraryData {
  pageName: string;
  totalActiveAds: number;
  firstAdStartDate: string;
  firstAdActiveTime: string;
  url: string;
}

/**
 * Extrai nome da página com múltiplos fallbacks
 */
async function extractPageName(page: puppeteer.Page): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const pageName = await page.evaluate(() => {
      // Busca por divs que contêm imagem de perfil + nome
      const allDivs = Array.from(document.querySelectorAll('div'));
      
      for (const div of allDivs) {
        const img = div.querySelector('img');
        if (img && img.width > 30 && img.width < 200) {
          const text = div.textContent?.trim();
          if (text) {
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            for (const line of lines) {
              if (line.length >= 2 && line.length <= 50 &&
                  !line.includes('Biblioteca') && !line.includes('Anúncio') &&
                  !line.includes('resultado') && !line.includes('Ativo') &&
                  !line.includes('Meta') && !line.includes('Facebook') &&
                  !line.includes('Conteúdo') && !line.includes('marca') &&
                  !line.match(/^\d+$/) && 
                  !line.match(/^\d{1,2}\s+de\s+\w+\s+de\s+\d{4}/i) &&
                  !line.match(/^[A-Z]{2,}$/) &&
                  /[a-zA-Z]/.test(line)) {
                return line;
              }
            }
          }
        }
      }

      // Busca por padrão específico - nome antes de "Anúncios" ou "Sobre"
      const buttons = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
      for (const btn of buttons) {
        const text = btn.textContent?.trim();
        if (text === 'Anúncios' || text === 'Sobre' || text === 'Ads' || text === 'About') {
          let element = btn.parentElement;
          for (let i = 0; i < 3 && element; i++) {
            const parentText = element.textContent?.trim();
            if (parentText) {
              const lines = parentText.split('\n').map(l => l.trim());
              for (const line of lines) {
                if (line.length >= 2 && line.length <= 50 &&
                    line !== 'Anúncios' && line !== 'Sobre' &&
                    !line.includes('Biblioteca') && !line.includes('Anúncio') &&
                    !line.includes('resultado') && !line.includes('Ativo') &&
                    !line.match(/^\d+$/) && /[a-zA-Z]/.test(line)) {
                  return line;
                }
              }
            }
            element = element.parentElement;
          }
        }
      }

      // Busca em todo o texto visível
      const bodyText = document.body.innerText;
      const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      const ignoreWords = [
        'Biblioteca', 'Anúncio', 'Anúncios', 'Meta', 'Facebook', 
        'resultado', 'resultados', 'Ativo', 'Active', 'Conteúdo',
        'marca', 'de', 'em', 'para', 'com', 'sobre', 'Sobre'
      ];
      
      for (const line of lines) {
        if (line.length >= 3 && line.length <= 50 &&
            !ignoreWords.some(word => line.includes(word)) &&
            !line.match(/^\d+$/) && 
            !line.match(/^\d{1,2}\s+de\s+\w+\s+de\s+\d{4}/i) &&
            !line.match(/^[A-Z]{2,}$/) &&
            /^[A-Z]/.test(line) &&
            line.split(/\s+/).length <= 5) {
          if (/[a-z]/.test(line)) {
            return line;
          }
        }
      }

      return null;
    });

    if (pageName && pageName !== 'Unknown Page') {
      return pageName;
    }
  } catch (e) {
    console.error('Erro ao extrair nome da página:', e);
  }

  // Fallback: Tenta extrair da URL
  try {
    const url = page.url();
    const match = url.match(/view_all_page_id=(\d+)/);
    if (match) {
      return `Page ID: ${match[1]}`;
    }
  } catch (e) {
    // Ignora
  }

  return 'Unknown Page';
}

/**
 * Extrai total de anúncios ativos com múltiplos fallbacks
 */
async function extractTotalActiveAds(page: puppeteer.Page): Promise<number> {
  try {
    const pageText = await page.evaluate(() => document.body.innerText);
    
    const patterns = [
      /(?:~)?(\d+)\s*resultado/i,
      /(?:~)?(\d+)\s*ads?/i,
      /(?:~)?(\d+)\s*anúncio/i,
      /total[:\s]+(\d+)/i,
      /(\d+)\s*active/i
    ];

    for (const pattern of patterns) {
      const match = pageText.match(pattern);
      if (match) {
        const count = parseInt(match[1]);
        if (count > 0) {
          return count;
        }
      }
    }
  } catch (e) {
    console.error('Erro no método 1 de contagem:', e);
  }

  // Método 2: Conta cards visíveis
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const cards = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*'));
      const adCards = allElements.filter(el => {
        const text = el.textContent || '';
        return text.includes('Ativo') || text.includes('Active') || 
               text.includes('Identificação da biblioteca') ||
               text.includes('Library ID');
      });
      
      const uniqueCards = new Set();
      adCards.forEach(el => {
        let parent = el;
        for (let i = 0; i < 5 && parent; i++) {
          if (parent.classList && parent.classList.length > 0) {
            uniqueCards.add(parent);
            break;
          }
          parent = parent.parentElement;
        }
      });
      
      return uniqueCards.size;
    });
    
    if (cards > 0) {
      return cards;
    }
  } catch (e) {
    console.error('Erro no método 2 de contagem:', e);
  }

  return 0;
}

/**
 * Extrai data de início do primeiro anúncio
 */
async function extractFirstAdStartDate(page: puppeteer.Page): Promise<string> {
  const datePatterns = [
    /veiculação iniciada em (\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i,
    /started on (\w+)\s+(\d{1,2}),\s+(\d{4})/i,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{4})-(\d{2})-(\d{2})/
  ];

  try {
    const pageText = await page.evaluate(() => document.body.innerText);
    
    const dates = [];
    for (const pattern of datePatterns) {
      const matches = [...pageText.matchAll(new RegExp(pattern.source, 'gi'))];
      for (const match of matches) {
        dates.push(match[0]);
      }
    }

    if (dates.length > 0) {
      return dates[0];
    }
  } catch (e) {
    console.error('Erro ao extrair data:', e);
  }

  return 'Unknown';
}

/**
 * Extrai tempo total ativo do primeiro anúncio
 */
async function extractFirstAdActiveTime(page: puppeteer.Page): Promise<string> {
  try {
    const pageText = await page.evaluate(() => document.body.innerText);
    
    const timePatterns = [
      /tempo total ativo:\s*(\d+[hdms]|[\d\s]+(?:hora|dia|semana|mês))/i,
      /total active time:\s*(\d+[hdms]|[\d\s]+(?:hour|day|week|month))/i,
      /active for\s*(\d+[hdms]|[\d\s]+(?:hour|day|week|month))/i
    ];

    for (const pattern of timePatterns) {
      const match = pageText.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
  } catch (e) {
    console.error('Erro ao extrair tempo ativo:', e);
  }

  return 'Unknown';
}

/**
 * Função principal de scraping da Meta Ad Library
 */
export async function scrapeMetaAdLibrary(url: string): Promise<AdLibraryData> {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-web-security',
      '--disable-dev-shm-usage'
    ]
  });

  try {
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const pageName = await extractPageName(page);
    const totalAds = await extractTotalActiveAds(page);
    const firstAdDate = await extractFirstAdStartDate(page);
    const activeTime = await extractFirstAdActiveTime(page);

    return {
      pageName,
      totalActiveAds: totalAds,
      firstAdStartDate: firstAdDate,
      firstAdActiveTime: activeTime,
      url
    };

  } catch (error) {
    console.error('Erro durante scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

