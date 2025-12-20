/**
 * Teste completo com múltiplas URLs
 */

import { scrapeMetaAdLibrary } from '../services/metaAdLibraryScraper.js';

const TEST_URLS = [
  {
    name: 'Marina Castro',
    url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&source=page-transparency-widget&view_all_page_id=584030304802606',
    expectedName: 'Marina Castro',
    expectedAds: 2
  },
  {
    name: 'anasensitiva',
    url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&source=page-transparency-widget&view_all_page_id=101353648502189',
    expectedName: 'anasensitiva',
    expectedAds: 1
  },
  {
    name: 'Educa Kids',
    url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&source=page-transparency-widget&view_all_page_id=835029829697720',
    expectedName: 'Educa Kids',
    expectedAds: 8
  }
];

console.log('🚀 TESTE COMPLETO COM MÚLTIPLAS URLs\n');

let allPassed = true;

for (const testCase of TEST_URLS) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 Testando: ${testCase.name}`);
  console.log(`URL: ${testCase.url}`);
  console.log(`${'='.repeat(60)}\n`);
  
  try {
    const result = await scrapeMetaAdLibrary(testCase.url);
    
    console.log(`Nome: ${result.pageName}`);
    console.log(`Anúncios: ${result.totalActiveAds}`);
    console.log(`Landing Page: ${result.landingPageUrl || 'null'}`);
    
    // Validações
    const nameMatch = result.pageName && (
      result.pageName.toLowerCase().includes(testCase.expectedName.toLowerCase()) ||
      testCase.expectedName.toLowerCase().includes(result.pageName.toLowerCase())
    );
    
    // Aceita se estiver próximo (pode variar com lazy loading)
    const adsMatch = result.totalActiveAds > 0 && 
                     (result.totalActiveAds >= testCase.expectedAds || 
                      Math.abs(result.totalActiveAds - testCase.expectedAds) <= 5);
    const landingPageOk = !result.landingPageUrl || 
                         (!result.landingPageUrl.includes('facebook.com') && 
                          !result.landingPageUrl.includes('meta.com'));
    
    if (nameMatch && adsMatch && landingPageOk) {
      console.log('✅ PASSOU!');
    } else {
      console.log('❌ FALHOU!');
      if (!nameMatch) console.log(`   Nome esperado: ${testCase.expectedName}, recebido: ${result.pageName}`);
      if (!adsMatch) console.log(`   Anúncios esperados: ${testCase.expectedAds}+, recebidos: ${result.totalActiveAds}`);
      if (!landingPageOk) console.log(`   Landing page inválida: ${result.landingPageUrl}`);
      allPassed = false;
    }
    
    // Aguarda entre testes
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error(`❌ ERRO: ${error.message}`);
    allPassed = false;
  }
}

console.log(`\n${'='.repeat(60)}`);
if (allPassed) {
  console.log('🎉 TODOS OS TESTES PASSARAM!');
  process.exit(0);
} else {
  console.log('❌ ALGUNS TESTES FALHARAM!');
  process.exit(1);
}

