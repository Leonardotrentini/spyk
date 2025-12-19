// Carregar variáveis de ambiente primeiro
import 'dotenv/config';
import { scrapeAdLibrarySearch } from '../scrapers/adLibrarySearch';
import { scrapeAdLibraryForPage } from '../scrapers/adLibraryPage';
import { aggregatePagesFromHits } from '../services/aggregation';
import { enrichAdsWithAge, evaluatePageOfferRule } from '../services/offerRule';
import { saveSearchHits } from '../db/repositories/searchHits';
import { upsertPageFromAggregate, savePageAudit } from '../db/repositories/pages';
import { saveAdsForPage } from '../db/repositories/ads';
import { buildKeywordJob, loadConfig } from '../config';
import * as fs from 'fs';
import * as path from 'path';

interface PageSummary {
  page_id: string;
  page_name: string;
  country: string;
  hitsFromSearch: number;
  total_active_ads: number;
  has_ad_older_than_7_days: boolean;
  has_offer_by_rule: boolean;
  library_url: string;
}

async function main() {
  try {
    const config = loadConfig();
    
    // Ler keywords (pode ser de argumentos, arquivo JSON, ou config)
    const args = process.argv.slice(2);
    let keywords: string[] = [];
    let country = config.defaultCountry;

    // Parse argumentos
    if (args.length > 0) {
      // Formato: --keywords "palavra1,palavra2" --country BR
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '--keywords' && args[i + 1]) {
          keywords = args[i + 1].split(',').map((k) => k.trim());
        } else if (args[i] === '--country' && args[i + 1]) {
          country = args[i + 1].trim();
        } else if (args[i] === '--file' && args[i + 1]) {
          // Ler de arquivo JSON
          const filePath = args[i + 1];
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(fileContent);
          keywords = data.keywords || [];
          country = data.country || country;
        }
      }
    }

    // Se não passou keywords, usar padrão ou pedir
    if (keywords.length === 0) {
      console.log('📝 Nenhuma keyword fornecida. Use:');
      console.log('  --keywords "palavra1,palavra2" --country BR');
      console.log('  --file keywords.json');
      process.exit(1);
    }

    // Validar e limitar keywords
    keywords = buildKeywordJob(keywords);
    console.log(`🚀 Iniciando scraping com ${keywords.length} keywords em ${country}`);
    console.log(`📋 Keywords: ${keywords.join(', ')}`);

    // FASE 1: Buscar por keywords
    const allHits: any[] = [];
    
    for (const keyword of keywords) {
      console.log(`\n🔍 Processando keyword: "${keyword}"`);
      
      try {
        const hits = await scrapeAdLibrarySearch(keyword, country);
        allHits.push(...hits);
        
        // Salvar hits no banco
        await saveSearchHits(hits);
        
        // Pequeno delay entre keywords
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`❌ Erro ao processar keyword "${keyword}":`, error);
        // Continuar com próxima keyword
      }
    }

    console.log(`\n✅ Total de hits coletados: ${allHits.length}`);

    // FASE 2: Agregar por página
    const aggregates = aggregatePagesFromHits(allHits);
    console.log(`\n📊 Páginas encontradas: ${aggregates.length}`);

    // Salvar/atualizar páginas agregadas
    for (const agg of aggregates) {
      await upsertPageFromAggregate(agg);
    }

    // FASE 3: Filtrar páginas candidatas (hitsFromSearch >= 10)
    const candidatePages = aggregates.filter((agg) => agg.hitsFromSearch >= 10);
    console.log(`\n🎯 Páginas candidatas (≥10 hits): ${candidatePages.length}`);

    // FASE 4: Scraping completo de cada página candidata
    const pageSummaries: PageSummary[] = [];

    if (candidatePages.length === 0) {
      console.log('\n⚠️  Nenhuma página candidata encontrada (mínimo 10 hits por página)');
      return;
    }

    for (const candidate of candidatePages) {
      console.log(`\n📄 Processando página: ${candidate.pageId} (${candidate.pageName})`);
      
      try {
        // Scraping completo da página
        const scrapedPage = await scrapeAdLibraryForPage(candidate.pageId, country);
        
        // Enriquecer com idade dos anúncios
        const adsWithAge = enrichAdsWithAge(scrapedPage.ads);
        
        // Avaliar regra de oferta
        const evaluation = evaluatePageOfferRule(adsWithAge);
        
        // Salvar anúncios
        await saveAdsForPage(candidate.pageId, country, adsWithAge);
        
        // Atualizar auditoria da página
        await savePageAudit(
          candidate.pageId,
          country,
          evaluation.totalActiveAds,
          evaluation.hasAdOlderThan7Days,
          evaluation.hasOfferByRule,
          scrapedPage.pageName,
          evaluation.hasDrTerms,
          evaluation.drTermsCount
        );

        // Construir URL da biblioteca
        const libraryUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&view_all_page_id=${candidate.pageId}&country=${country}`;

        // Adicionar ao resumo
        pageSummaries.push({
          page_id: candidate.pageId,
          page_name: candidate.pageName,
          country,
          hitsFromSearch: candidate.hitsFromSearch,
          total_active_ads: evaluation.totalActiveAds,
          has_ad_older_than_7_days: evaluation.hasAdOlderThan7Days,
          has_offer_by_rule: evaluation.hasOfferByRule,
          library_url: libraryUrl,
        });

        console.log(`  ✅ ${evaluation.totalActiveAds} anúncios | 7+ dias: ${evaluation.hasAdOlderThan7Days ? 'SIM' : 'NÃO'} | DR Terms: ${evaluation.drTermsCount} | Oferta válida: ${evaluation.hasOfferByRule ? 'SIM' : 'NÃO'}`);
        
        // Delay entre páginas
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`❌ Erro ao processar página ${candidate.pageId}:`, error);
        // Continuar com próxima página
      }
    }

    // FASE 5: Exibir resumo (apenas páginas com oferta válida)
    const pagesWithOffer = pageSummaries.filter((p) => p.has_offer_by_rule);
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📊 RESUMO FINAL`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Total de keywords processadas: ${keywords.length}`);
    console.log(`Total de hits coletados: ${allHits.length}`);
    console.log(`Total de páginas encontradas: ${aggregates.length}`);
    console.log(`Páginas candidatas (≥10 hits): ${candidatePages.length}`);
    console.log(`Páginas com oferta válida: ${pagesWithOffer.length}`);
    console.log(`${'='.repeat(80)}\n`);

    if (pagesWithOffer.length > 0) {
      console.log('✅ PÁGINAS COM OFERTA VÁLIDA:\n');
      console.log(
        'PAGE ID'.padEnd(20) +
        'PAGE NAME'.padEnd(30) +
        'COUNTRY'.padEnd(8) +
        'HITS'.padEnd(6) +
        'ADS'.padEnd(6) +
        '7+ DIAS'.padEnd(8) +
        'OFERTA'.padEnd(8) +
        'LIBRARY URL'
      );
      console.log('-'.repeat(120));

      for (const page of pagesWithOffer) {
        console.log(
          page.page_id.padEnd(20) +
          (page.page_name || 'N/A').substring(0, 28).padEnd(30) +
          page.country.padEnd(8) +
          page.hitsFromSearch.toString().padEnd(6) +
          page.total_active_ads.toString().padEnd(6) +
          (page.has_ad_older_than_7_days ? 'SIM' : 'NÃO').padEnd(8) +
          (page.has_offer_by_rule ? 'SIM' : 'NÃO').padEnd(8) +
          page.library_url
        );
      }
    } else {
      console.log('⚠️  Nenhuma página passou na regra de oferta válida.');
    }

    // Salvar resumo em JSON
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'latest_pages_with_offers.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          country,
          keywords,
          summary: {
            total_keywords: keywords.length,
            total_hits: allHits.length,
            total_pages: aggregates.length,
            candidate_pages: candidatePages.length,
            pages_with_offer: pagesWithOffer.length,
          },
          pages_with_offer: pagesWithOffer,
        },
        null,
        2
      )
    );

    console.log(`\n💾 Resumo salvo em: ${outputPath}`);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

