/**
 * Teste específico para Educa Kids
 */

import { scrapeMetaAdLibrary } from '../services/metaAdLibraryScraper.js';

const TEST_URL = 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&source=page-transparency-widget&view_all_page_id=835029829697720';

console.log('🚀 Testando scraper com Educa Kids...\n');
console.log(`URL: ${TEST_URL}\n`);

try {
  const result = await scrapeMetaAdLibrary(TEST_URL);
  
  console.log('\n✅ RESULTADO:');
  console.log('Nome da Página:', result.pageName);
  console.log('Total de Anúncios:', result.totalActiveAds);
  console.log('Data de Início:', result.firstAdStartDate);
  console.log('Tempo Ativo:', result.firstAdActiveTime);
  console.log('Landing Page:', result.landingPageUrl || 'N/A');
  
  console.log('\n📦 JSON Completo:');
  console.log(JSON.stringify(result, null, 2));
  
  process.exit(0);
} catch (error) {
  console.error('\n❌ ERRO:', error.message);
  console.error(error.stack);
  process.exit(1);
}


