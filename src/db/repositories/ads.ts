import { getSupabaseClient } from '../supabaseClient';
import { ScrapedAd } from '../../scrapers/adLibraryPage';
import { hasDirectResponseTerms, countDirectResponseTerms, extractDirectResponseTerms } from '../../services/directResponseTerms';

export async function saveAdsForPage(
  pageId: string,
  country: string,
  ads: (ScrapedAd & { startedRunningDaysAgo?: number })[]
): Promise<void> {
  if (ads.length === 0) {
    return;
  }

  const supabase = getSupabaseClient();

  const records = ads.map((ad) => {
    // Combinar texto completo para análise de DR
    const fullText = [ad.text, ad.headline, ad.cta].filter(Boolean).join(' ');
    
    // Detectar termos de venda direta
    const hasDr = hasDirectResponseTerms(fullText);
    const drCount = countDirectResponseTerms(fullText);
    const drTerms = extractDirectResponseTerms(fullText);
    
    return {
      page_id: pageId,
      ad_id: ad.adId,
      text: ad.text,
      headline: ad.headline,
      cta: ad.cta,
      media_type: ad.mediaType,
      media_urls: ad.mediaUrls,
      destination_urls: ad.destinationUrls,
      started_running_on: ad.startedRunningOn,
      started_running_days_ago: ad.startedRunningDaysAgo,
      has_dr_terms: hasDr,
      dr_terms_count: drCount,
      dr_terms_found: drTerms,
      scraped_at: new Date().toISOString(),
    };
  });

  // Inserir anúncios (pode haver duplicatas, mas vamos inserir todos)
  const { error } = await supabase.from('ads').insert(records as any);

  if (error) {
    console.error(`Erro ao salvar anúncios da página ${pageId}:`, error);
    throw error;
  }

  console.log(`✅ Salvos ${records.length} anúncios da página ${pageId}`);
}

