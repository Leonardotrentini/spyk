import { getSupabaseClient } from '../supabaseClient';
import { PageAggregate } from '../../services/aggregation';

export async function upsertPageFromAggregate(agg: PageAggregate): Promise<void> {
  const supabase = getSupabaseClient();

  // Construir URL da biblioteca
  const libraryUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&view_all_page_id=${agg.pageId}&country=${agg.country}`;

  const { error } = await supabase
    .from('pages')
    .upsert(
      {
        page_id: agg.pageId,
        page_name: agg.pageName,
        country: agg.country,
        estimated_active_ads_from_search: agg.hitsFromSearch,
        library_url: libraryUrl,
        last_seen_at: new Date().toISOString(),
      } as any,
      {
        onConflict: 'page_id',
      }
    );

  if (error) {
    console.error(`Erro ao fazer upsert de página ${agg.pageId}:`, error);
    throw error;
  }
}

export async function savePageAudit(
  pageId: string,
  country: string,
  totalActiveAds: number,
  hasAdOlderThan7Days: boolean,
  hasOfferByRule: boolean,
  pageName?: string | null,
  hasDrTerms?: boolean,
  drTermsCount?: number
): Promise<void> {
  const supabase = getSupabaseClient();

  // Construir URL da biblioteca
  const libraryUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&view_all_page_id=${pageId}&country=${country}`;

  const updateData: any = {
    total_active_ads: totalActiveAds,
    has_ad_older_than_7_days: hasAdOlderThan7Days,
    has_offer_by_rule: hasOfferByRule,
    library_url: libraryUrl,
    last_audit_at: new Date().toISOString(),
  };

  if (pageName) {
    updateData.page_name = pageName;
  }
  
  if (hasDrTerms !== undefined) {
    updateData.has_dr_terms = hasDrTerms;
  }
  
  if (drTermsCount !== undefined) {
    updateData.dr_terms_count = drTermsCount;
  }

  const { error } = await (supabase
    .from('pages') as any)
    .update(updateData)
    .eq('page_id', pageId)
    .eq('country', country);

  if (error) {
    console.error(`Erro ao salvar auditoria da página ${pageId}:`, error);
    throw error;
  }
}

