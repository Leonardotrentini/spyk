/**
 * Script de diagnóstico detalhado para descobrir problemas no scraper
 * Executa múltiplas verificações e gera relatório completo
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_URL = process.argv[2] || 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&source=page-transparency-widget&view_all_page_id=584030304802606';

console.log('🔬 DIAGNÓSTICO DETALHADO DO SCRAPER\n');
console.log(`URL: ${TEST_URL}\n`);

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
  
  console.log('⏳ Navegando para a página...');
  await page.goto(TEST_URL, { 
    waitUntil: 'networkidle2',
    timeout: 60000 
  });
  
  console.log('⏳ Aguardando 5 segundos...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 1. Verificar se a página carregou
  console.log('\n📊 DIAGNÓSTICO 1: Estado da Página');
  const pageInfo = await page.evaluate(() => {
    return {
      title: document.title,
      url: window.location.href,
      bodyTextLength: document.body.innerText.length,
      hasImages: document.querySelectorAll('img').length,
      hasButtons: document.querySelectorAll('button').length,
      hasDivs: document.querySelectorAll('div').length
    };
  });
  console.log(JSON.stringify(pageInfo, null, 2));
  
  // 2. Procurar pelo nome da página
  console.log('\n📊 DIAGNÓSTICO 2: Busca do Nome da Página');
  const nameSearch = await page.evaluate(() => {
    const allText = document.body.innerText;
    const lines = allText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Busca por padrões que parecem nomes
    const possibleNames = lines.filter(line => {
      return line.length >= 3 && 
             line.length <= 50 &&
             !line.includes('Biblioteca') &&
             !line.includes('Anúncio') &&
             !line.includes('Meta') &&
             !line.includes('Facebook') &&
             !line.match(/^\d+$/) &&
             /[a-zA-Z]/.test(line) &&
             (line.includes('Marina') || line.includes('Castro') || line.includes('Marina Castro'));
    });
    
    // Busca por elementos com imagem + texto
    const divsWithImages = Array.from(document.querySelectorAll('div'));
    const namesFromDivs = [];
    for (const div of divsWithImages) {
      const img = div.querySelector('img');
      if (img && img.width > 30 && img.width < 200) {
        const text = div.textContent?.trim();
        if (text && (text.includes('Marina') || text.includes('Castro'))) {
          namesFromDivs.push(text);
        }
      }
    }
    
    return {
      possibleNames: possibleNames.slice(0, 10),
      namesFromDivs: namesFromDivs.slice(0, 5),
      allLinesSample: lines.slice(0, 30)
    };
  });
  console.log(JSON.stringify(nameSearch, null, 2));
  
  // 3. Procurar pelo total de anúncios
  console.log('\n📊 DIAGNÓSTICO 3: Busca do Total de Anúncios');
  const adsSearch = await page.evaluate(() => {
    const allText = document.body.innerText;
    
    // Padrões para buscar
    const patterns = [
      /(?:~)?(\d+)\s*resultado/i,
      /(?:~)?(\d+)\s*resultados/i,
      /(?:~)?(\d+)\s*ads?/i,
      /(?:~)?(\d+)\s*anúncio/i,
      /(?:~)?(\d+)\s*anúncios/i
    ];
    
    const matches = [];
    for (const pattern of patterns) {
      const match = allText.match(pattern);
      if (match) {
        matches.push({ pattern: pattern.source, match: match[0], number: match[1] });
      }
    }
    
    // Conta cards visíveis
    const elementsWithActive = Array.from(document.querySelectorAll('*')).filter(el => {
      const text = el.textContent || '';
      return text.includes('Ativo') || text.includes('Active');
    });
    
    return {
      textMatches: matches,
      elementsWithActive: elementsWithActive.length,
      sampleText: allText.substring(0, 2000)
    };
  });
  console.log(JSON.stringify(adsSearch, null, 2));
  
  // 4. Screenshot para análise visual
  const screenshotPath = join(__dirname, '../test-diagnostico-screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`\n📸 Screenshot salvo em: ${screenshotPath}`);
  
  // 5. HTML parcial para análise
  const htmlSample = await page.evaluate(() => {
    const body = document.body;
    return body.innerHTML.substring(0, 5000);
  });
  console.log('\n📊 DIAGNÓSTICO 4: HTML Sample (primeiros 5000 chars)');
  console.log(htmlSample.substring(0, 1000) + '...');
  
  await browser.close();
  
  console.log('\n✅ Diagnóstico completo!');
  
} catch (error) {
  console.error('\n❌ ERRO NO DIAGNÓSTICO:', error.message);
  console.error(error.stack);
  await browser.close();
  process.exit(1);
}

