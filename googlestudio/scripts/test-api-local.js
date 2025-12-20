/**
 * Testa a API local simulando o ambiente Vercel
 */

const TEST_URL = process.argv[2] || 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&source=page-transparency-widget&view_all_page_id=584030304802606';

console.log('🚀 Testando API Local (simulando Vercel)...\n');
console.log(`URL: ${TEST_URL}\n`);

try {
  const response = await fetch('http://localhost:3001/api/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: TEST_URL }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'API retornou success: false');
  }

  const data = result.data;
  
  console.log('✅ RESULTADO DA API:');
  console.log('Nome da Página:', data.pageName);
  console.log('Total de Anúncios:', data.totalActiveAds);
  console.log('Landing Page:', data.landingPageUrl || 'null');
  
  console.log('\n📦 JSON Completo:');
  console.log(JSON.stringify(data, null, 2));
  
  // Validações
  const expectedName = 'Marina Castro';
  
  if (data.pageName && data.pageName.toLowerCase().includes('marina')) {
    console.log('\n✅ Nome da página CORRETO!');
  } else {
    console.log(`\n❌ Nome da página INCORRETO! Esperado: ${expectedName}, Recebido: ${data.pageName}`);
    process.exit(1);
  }
  
  if (data.totalActiveAds >= 2) {
    console.log('✅ Total de anúncios CORRETO!');
  } else {
    console.log(`❌ Total de anúncios INCORRETO! Esperado: 2+, Recebido: ${data.totalActiveAds}`);
    process.exit(1);
  }
  
  if (!data.landingPageUrl || !data.landingPageUrl.includes('facebook.com')) {
    console.log('✅ Landing page CORRETO!');
  } else {
    console.log(`❌ Landing page INCORRETO! Recebido: ${data.landingPageUrl}`);
    process.exit(1);
  }
  
  console.log('\n🎉 TESTE DA API PASSOU!');
  process.exit(0);
  
} catch (error) {
  if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
    console.error('❌ ERRO: Servidor API não está rodando!');
    console.error('Execute: npm run dev:api');
  } else {
    console.error('\n❌ ERRO:', error.message);
  }
  process.exit(1);
}

