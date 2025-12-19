import { getSupabaseClient } from '../supabaseClient';
import { SearchAdHit } from '../../scrapers/adLibrarySearch';

export async function saveSearchHits(hits: SearchAdHit[]): Promise<void> {
  if (hits.length === 0) {
    return;
  }

  const supabase = getSupabaseClient();

  // Agrupar hits por keyword + pageId para contar ads_count_for_keyword
  const hitMap = new Map<string, { count: number; hit: SearchAdHit }>();
  for (const hit of hits) {
    const key = `${hit.keyword}|||${hit.pageId}`; // Usar separador único
    const existing = hitMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      hitMap.set(key, { count: 1, hit });
    }
  }

  // Preparar dados para inserção
  const records = Array.from(hitMap.values()).map(({ count, hit }) => ({
    keyword: hit.keyword,
    country: hit.country,
    page_id: hit.pageId,
    page_name: hit.pageName,
    ads_count_for_keyword: count,
    scraped_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('page_search_hits').insert(records as any);

  if (error) {
    console.error('Erro ao salvar search hits:', error);
    throw error;
  }

  console.log(`✅ Salvos ${records.length} search hits no banco`);
}

