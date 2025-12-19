/**
 * SCRAPER BRUTAL - Meta Ad Library
 * Teste standalone para validar extração de dados
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_URL = 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&source=page-transparency-widget&view_all_page_id=101627175603407';

/**
 * Extrai nome da página com múltiplos fallbacks
 */
async function extractPageName(page) {
  // Aguarda um pouco mais para garantir que o conteúdo carregou
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Método 1: Busca por estrutura específica da Meta Ad Library
  try {
    const pageName = await page.evaluate(() => {
      // Busca por divs que contêm imagem de perfil + nome
      const allDivs = Array.from(document.querySelectorAll('div'));
      
      for (const div of allDivs) {
        // Verifica se tem imagem dentro
        const img = div.querySelector('img');
        if (img && img.width > 30 && img.width < 200) {
          // Busca texto no mesmo div ou próximo
          const text = div.textContent?.trim();
          if (text) {
            // Separa linhas e busca a primeira que parece nome
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            for (const line of lines) {
              // Filtra linhas que parecem nomes de página
              if (line.length >= 2 && line.length <= 50 &&
                  !line.includes('Biblioteca') && !line.includes('Anúncio') &&
                  !line.includes('resultado') && !line.includes('Ativo') &&
                  !line.includes('Meta') && !line.includes('Facebook') &&
                  !line.includes('Conteúdo') && !line.includes('marca') &&
                  !line.match(/^\d+$/) && 
                  !line.match(/^\d{1,2}\s+de\s+\w+\s+de\s+\d{4}/i) &&
                  !line.match(/^[A-Z]{2,}$/) && // Não é só siglas
                  /[a-zA-Z]/.test(line)) {
                return line;
              }
            }
          }
        }
      }

      // Método 2: Busca por padrão específico - nome antes de "Anúncios" ou "Sobre"
      const buttons = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
      for (const btn of buttons) {
        const text = btn.textContent?.trim();
        if (text === 'Anúncios' || text === 'Sobre' || text === 'Ads' || text === 'About') {
          // Busca elemento irmão ou pai que contenha o nome
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

      // Método 3: Busca em todo o texto visível por padrões de nome
      const bodyText = document.body.innerText;
      const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      // Lista de palavras a ignorar
      const ignoreWords = [
        'Biblioteca', 'Anúncio', 'Anúncios', 'Meta', 'Facebook', 
        'resultado', 'resultados', 'Ativo', 'Active', 'Conteúdo',
        'marca', 'de', 'em', 'para', 'com', 'sobre', 'Sobre'
      ];
      
      for (const line of lines) {
        // Verifica se parece um nome próprio (2 palavras, começa com maiúscula)
        if (line.length >= 3 && line.length <= 50 &&
            !ignoreWords.some(word => line.includes(word)) &&
            !line.match(/^\d+$/) && 
            !line.match(/^\d{1,2}\s+de\s+\w+\s+de\s+\d{4}/i) &&
            !line.match(/^[A-Z]{2,}$/) && // Não é só siglas
            /^[A-Z]/.test(line) && // Começa com maiúscula
            line.split(/\s+/).length <= 5) { // Máximo 5 palavras
          // Verifica se tem pelo menos uma letra minúscula (não é só siglas)
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
    console.log('⚠️  Erro no método 1 de extração de nome:', e.message);
  }

  // Fallback: Tenta extrair da URL
  try {
    const url = page.url();
    const match = url.match(/view_all_page_id=(\d+)/);
    if (match) {
      // Poderia fazer uma busca adicional, mas por enquanto retorna o ID
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
async function extractTotalActiveAds(page) {
  // Método 1: Busca em todo o texto da página (mais confiável)
  try {
    const pageText = await page.evaluate(() => document.body.innerText);
    
    // Padrões para "~8 resultados", "8 resultados", "8 ads", etc.
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
    console.log('⚠️  Erro no método 1 de contagem:', e.message);
  }

  // Método 2: Busca em elementos específicos
  const selectors = [
    'span',
    'div',
    'p',
    'h1', 'h2', 'h3'
  ];

  for (const selector of selectors) {
    try {
      const elements = await page.$$(selector);
      for (const el of elements) {
        const text = await page.evaluate(el => el.textContent?.trim(), el);
        if (text) {
          const match = text.match(/(?:~)?(\d+)\s*resultado/i);
          if (match) {
            return parseInt(match[1]);
          }
        }
      }
    } catch (e) {
      continue;
    }
  }

  // Método 3: Conta cards visíveis (fallback)
  try {
    // Aguarda cards carregarem
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Busca por elementos que parecem cards de anúncios
    const cards = await page.evaluate(() => {
      // Busca por elementos com "Ativo" ou "Active"
      const allElements = Array.from(document.querySelectorAll('*'));
      const adCards = allElements.filter(el => {
        const text = el.textContent || '';
        return text.includes('Ativo') || text.includes('Active') || 
               text.includes('Identificação da biblioteca') ||
               text.includes('Library ID');
      });
      
      // Agrupa por elemento pai (cada card)
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
    console.log('⚠️  Erro no método 3 de contagem:', e.message);
  }

  return 0;
}

/**
 * Extrai data de início do primeiro anúncio com múltiplos fallbacks
 */
async function extractFirstAdStartDate(page) {
  const datePatterns = [
    /veiculação iniciada em (\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i,
    /started on (\w+)\s+(\d{1,2}),\s+(\d{4})/i,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{4})-(\d{2})-(\d{2})/
  ];

  // Busca em todos os textos da página
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
      // Retorna a data mais antiga (primeira encontrada)
      return dates[0];
    }
  } catch (e) {
    // Ignora
  }

  // Fallback: Busca em elementos específicos
  const dateSelectors = [
    '[class*="date"]',
    '[class*="started"]',
    '[class*="veiculação"]',
    'time',
    '[datetime]'
  ];

  for (const selector of dateSelectors) {
    try {
      const elements = await page.$$(selector);
      for (const el of elements) {
        const text = await page.evaluate(el => el.textContent || el.getAttribute('datetime'), el);
        if (text) {
          for (const pattern of datePatterns) {
            if (pattern.test(text)) {
              return text.match(pattern)[0];
            }
          }
        }
      }
    } catch (e) {
      continue;
    }
  }

  return 'Unknown';
}

/**
 * Extrai tempo total ativo do primeiro anúncio
 */
async function extractFirstAdActiveTime(page) {
  try {
    const pageText = await page.evaluate(() => document.body.innerText);
    
    // Busca padrões como "3h", "2 dias", "1 semana", etc.
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
    // Ignora
  }

  return 'Unknown';
}

/**
 * Função principal de scraping
 */
async function scrapeAdLibrary(url) {
  console.log('🚀 Iniciando scraper brutal...\n');
  console.log(`📋 URL: ${url}\n`);

  const browser = await puppeteer.launch({
    headless: 'new', // Modo headless mais recente
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
    
    // Configura user agent para parecer um navegador real
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Aguarda a página carregar
    console.log('⏳ Carregando página...');
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Aguarda conteúdo dinâmico carregar
    console.log('⏳ Aguardando conteúdo dinâmico...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extrai dados
    console.log('\n📊 Extraindo dados...\n');

    const pageName = await extractPageName(page);
    console.log(`✅ Nome da Página: ${pageName}`);

    const totalAds = await extractTotalActiveAds(page);
    console.log(`✅ Total de Anúncios Ativos: ${totalAds}`);

    const firstAdDate = await extractFirstAdStartDate(page);
    console.log(`✅ Data de Início (Primeiro Anúncio): ${firstAdDate}`);

    const activeTime = await extractFirstAdActiveTime(page);
    console.log(`✅ Tempo Total Ativo: ${activeTime}`);

    // Screenshot para debug
    const screenshotPath = join(__dirname, '../test-screenshot.png');
    try {
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`\n📸 Screenshot salvo em ${screenshotPath}`);
    } catch (e) {
      console.log('⚠️  Não foi possível salvar screenshot:', e.message);
    }

    // Retorna dados estruturados
    return {
      pageName,
      totalActiveAds: totalAds,
      firstAdStartDate: firstAdDate,
      firstAdActiveTime: activeTime,
      url
    };

  } catch (error) {
    console.error('❌ Erro durante scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Executa o teste
scrapeAdLibrary(TEST_URL)
  .then(result => {
    console.log('\n🎉 SCRAPER FUNCIONOU!\n');
    console.log('📦 Resultado final:');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 ERRO NO SCRAPER:', error);
    process.exit(1);
  });

