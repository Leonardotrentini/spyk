/**
 * Script utilitário para coletar dados iniciais
 * Execute com: npx tsx scripts/collect-data.ts
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function collectMetaAds(country: string = 'AR', keywords: string = 'infoproduto') {
  console.log(`Coletando anúncios da Meta para ${country} com palavras-chave: ${keywords}`)
  
  const response = await fetch(`${API_BASE}/api/meta-ads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ country, keywords }),
  })

  const data = await response.json()
  console.log('Resultado:', data)
  return data
}

async function scrapeLandingPage(url: string, adId?: string) {
  console.log(`Fazendo scraping de: ${url}`)
  
  const response = await fetch(`${API_BASE}/api/landing-pages/scrape`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, adId }),
  })

  const data = await response.json()
  console.log('Resultado:', data)
  return data
}

async function processWithAI(adId?: string, landingPageId?: string) {
  console.log(`Processando com IA: adId=${adId}, landingPageId=${landingPageId}`)
  
  const response = await fetch(`${API_BASE}/api/process/ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ adId, landingPageId }),
  })

  const data = await response.json()
  console.log('Resultado:', data)
  return data
}

// Exemplo de uso
async function main() {
  try {
    // 1. Coletar anúncios
    const adsResult = await collectMetaAds('AR', 'infoproduto')
    
    // 2. Para cada anúncio, fazer scraping (exemplo com um anúncio)
    // const scrapeResult = await scrapeLandingPage('https://exemplo.com', 'ad-id')
    
    // 3. Processar com IA
    // const aiResult = await processWithAI('ad-id', 'landing-page-id')
    
    console.log('Processo concluído!')
  } catch (error) {
    console.error('Erro:', error)
  }
}

// Descomente para executar
// main()



