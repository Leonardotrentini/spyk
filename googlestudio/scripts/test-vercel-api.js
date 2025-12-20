/**
 * Testa a API diretamente na Vercel
 */

const VERCEL_URL = 'https://spyk-orcin.vercel.app';
const TEST_URL = process.argv[2] || 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&source=page-transparency-widget&view_all_page_id=584030304802606';

console.log('🔬 DIAGNÓSTICO API VERCEL\n');
console.log(`URL Vercel: ${VERCEL_URL}`);
console.log(`URL Teste: ${TEST_URL}\n`);

async function testVercelAPI() {
  try {
    console.log('⏳ Testando API /api/scrape...\n');
    
    const startTime = Date.now();
    const response = await fetch(`${VERCEL_URL}/api/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: TEST_URL }),
    });

    const duration = Date.now() - startTime;
    console.log(`⏱️  Tempo de resposta: ${(duration / 1000).toFixed(2)}s\n`);
    console.log(`📊 Status HTTP: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ERRO NA API:');
      console.error(`Status: ${response.status}`);
      console.error(`Resposta: ${errorText}`);
      return;
    }

    const result = await response.json();
    
    console.log('✅ RESPOSTA DA API:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success && result.data) {
      const data = result.data;
      console.log('\n📋 DADOS EXTRAÍDOS:');
      console.log(`Nome: ${data.pageName}`);
      console.log(`Anúncios: ${data.totalActiveAds}`);
      console.log(`Landing Page: ${data.landingPageUrl || 'null'}`);
      
      // Validações
      console.log('\n🔍 VALIDAÇÕES:');
      
      if (data.pageName && !data.pageName.includes('Page ID') && !data.pageName.includes('Page ')) {
        console.log('✅ Nome da página CORRETO!');
      } else {
        console.log(`❌ Nome da página INCORRETO! Recebido: ${data.pageName}`);
        console.log('   ⚠️  Está retornando Page ID em vez do nome real');
      }
      
      if (data.totalActiveAds > 0) {
        console.log('✅ Total de anúncios CORRETO!');
      } else {
        console.log(`❌ Total de anúncios INCORRETO! Recebido: ${data.totalActiveAds}`);
        console.log('   ⚠️  Está retornando 0 em vez do número real');
      }
      
      if (!data.landingPageUrl || !data.landingPageUrl.includes('facebook.com')) {
        console.log('✅ Landing page CORRETO!');
      } else {
        console.log(`❌ Landing page INCORRETO! Recebido: ${data.landingPageUrl}`);
        console.log('   ⚠️  Está retornando facebook.com como fallback');
      }
    } else {
      console.error('❌ Resposta não tem success:true ou data');
      console.error('Resposta completa:', result);
    }
    
  } catch (error) {
    console.error('\n❌ ERRO AO TESTAR API:');
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  Não foi possível conectar à API da Vercel');
      console.error('Verifique se:');
      console.error('1. A URL está correta');
      console.error('2. O deploy foi concluído');
      console.error('3. A API está funcionando');
    }
  }
}

// Testa também o health check
async function testHealthCheck() {
  try {
    console.log('\n🏥 Testando Health Check...\n');
    const response = await fetch(`${VERCEL_URL}/api/scrape`, {
      method: 'OPTIONS',
    });
    console.log(`Status: ${response.status}`);
    if (response.status === 200) {
      console.log('✅ Health Check OK - API está respondendo');
    }
  } catch (error) {
    console.error('❌ Health Check falhou:', error.message);
  }
}

// Executa testes
console.log('='.repeat(60));
await testHealthCheck();
console.log('='.repeat(60));
await testVercelAPI();
console.log('='.repeat(60));

