/**
 * Script para testar login no SimilarWeb
 * Abre navegador para você fazer login manualmente
 */

import { scrapeSimilarWeb } from '../services/similarwebScraper.js';

const TEST_URL = 'https://google.com';

console.log('🚀 Abrindo navegador para login no SimilarWeb...\n');
console.log('📋 INSTRUÇÕES:');
console.log('1. O navegador vai abrir');
console.log('2. Faça login no SimilarWeb com sua conta Google (leozikao50@gmail.com)');
console.log('3. Aguarde 60 segundos para completar o login');
console.log('4. O scraper vai tentar extrair dados automaticamente\n');

try {
  const result = await scrapeSimilarWeb(TEST_URL);
  
  console.log('\n🎉 SCRAPER COMPLETO!\n');
  console.log('📦 Resultado:');
  console.log(JSON.stringify(result, null, 2));
  
  process.exit(0);
} catch (error) {
  console.error('\n❌ Erro:', error.message);
  process.exit(1);
}

