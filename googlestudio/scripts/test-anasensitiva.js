/**
 * Teste específico para anasensitiva
 */

import { scrapeMetaAdLibrary } from '../services/metaAdLibraryScraper.js';

const TEST_URL = 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&source=page-transparency-widget&view_all_page_id=101353648502189';

console.log('🚀 Testando scraper com anasensitiva...\n');
console.log(`URL: ${TEST_URL}\n`);

try {
  const result = await scrapeMetaAdLibrary(TEST_URL);
  
  console.log('\n✅ RESULTADO:');
  console.log('Nome da Página:', result.pageName);
  console.log('Total de Anúncios:', result.totalActiveAds);
  console.log('Data de Início:', result.firstAdStartDate);
  console.log('Tempo Ativo:', result.firstAdActiveTime);
  console.log('Landing Page:', result.landingPageUrl || 'null');
  
  console.log('\n📦 JSON Completo:');
  console.log(JSON.stringify(result, null, 2));
  
  // Validações
  const expectedName = 'anasensitiva';
  const expectedAds = 1;
  
  if (result.pageName && result.pageName.toLowerCase().includes('anasensitiva')) {
    console.log('\n✅ Nome da página CORRETO!');
  } else {
    console.log(`\n❌ Nome da página INCORRETO! Esperado: ${expectedName}, Recebido: ${result.pageName}`);
  }
  
  if (result.totalActiveAds >= expectedAds) {
    console.log('✅ Total de anúncios CORRETO!');
  } else {
    console.log(`❌ Total de anúncios INCORRETO! Esperado: ${expectedAds}+, Recebido: ${result.totalActiveAds}`);
  }
  
  process.exit(0);
} catch (error) {
  console.error('\n❌ ERRO:', error.message);
  console.error(error.stack);
  process.exit(1);
}

