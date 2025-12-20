/**
 * Teste específico para Marina Castro
 * URL: https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&source=page-transparency-widget&view_all_page_id=584030304802606
 */

import { scrapeMetaAdLibrary } from '../services/metaAdLibraryScraper.js';

const TEST_URL = 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&source=page-transparency-widget&view_all_page_id=584030304802606';

console.log('🚀 Testando scraper com Marina Castro...\n');
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
  const expectedName = 'Marina Castro';
  const expectedAds = 2;
  
  console.log('\n🔍 VALIDAÇÕES:');
  
  if (result.pageName && result.pageName.toLowerCase().includes('marina')) {
    console.log('✅ Nome da página CORRETO!');
  } else {
    console.log(`❌ Nome da página INCORRETO! Esperado: ${expectedName}, Recebido: ${result.pageName}`);
    process.exit(1);
  }
  
  if (result.totalActiveAds >= expectedAds) {
    console.log('✅ Total de anúncios CORRETO!');
  } else {
    console.log(`❌ Total de anúncios INCORRETO! Esperado: ${expectedAds}+, Recebido: ${result.totalActiveAds}`);
    process.exit(1);
  }
  
  if (result.landingPageUrl === null || !result.landingPageUrl.includes('facebook.com')) {
    console.log('✅ Landing page CORRETO (null ou URL válida)!');
  } else if (result.landingPageUrl === 'https://www.facebook.com') {
    console.log('❌ Landing page INCORRETO! Está retornando facebook.com como fallback');
    process.exit(1);
  }
  
  console.log('\n🎉 TODOS OS TESTES PASSARAM!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ ERRO:', error.message);
  console.error(error.stack);
  process.exit(1);
}

