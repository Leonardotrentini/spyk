// Script Node.js para coleta completa de anúncios
// Uso: npm run collect

const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:3000/api/ads/collect-full';

async function collectAds(country = 'AR', keywords = 'infoproduto', maxPages = 100) {
  console.log('📥 Iniciando coleta completa...');
  console.log(`📋 Parâmetros: { country: '${country}', keywords: '${keywords}', maxPages: ${maxPages} }`);
  console.log('');

  const body = {
    country,
    keywords,
    maxPages
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.success) {
      const stats = data.stats;
      console.log('✅ Coleta concluída!');
      console.log(`   📊 Total coletado: ${stats.total_collected}`);
      console.log(`   ✨ Novos: ${stats.new_ads}`);
      console.log(`   🔄 Atualizados: ${stats.updated_ads}`);
      console.log(`   📄 Páginas processadas: ${stats.pages_processed}`);
      
      if (stats.has_more) {
        console.log('   ⚠️  Ainda há mais páginas disponíveis');
      }
    } else {
      console.error('❌ Erro:', data.error);
      if (data.details) {
        console.error('   Detalhes:', data.details);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    process.exit(1);
  }
}

// Ler argumentos da linha de comando
const args = process.argv.slice(2);
const country = args.find(arg => arg.startsWith('--country='))?.split('=')[1] || 'AR';
const keywords = args.find(arg => arg.startsWith('--keywords='))?.split('=')[1] || 'infoproduto';
const maxPages = parseInt(args.find(arg => arg.startsWith('--max-pages='))?.split('=')[1] || '100');

collectAds(country, keywords, maxPages);



