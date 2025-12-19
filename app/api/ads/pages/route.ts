import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const minAds = searchParams.get('min_ads') ? parseInt(searchParams.get('min_ads')!) : 1
    
    const supabase = createAdminClient()
    
    // Agrupar por página e contar anúncios ativos + calcular gasto total
    const { data, error } = await supabase
      .from('ads')
      .select('page_id, page_name, country, platform, spend_lower, spend_upper')
      .not('page_id', 'is', null)
      .not('page_name', 'is', null)
    
    if (error) {
      return NextResponse.json(
        { error: 'Erro ao buscar páginas', details: error.message },
        { status: 500 }
      )
    }
    
    // Agrupar e contar + calcular gasto total
    const pagesMap = new Map<string, {
      page_id: string
      page_name: string
      country: string
      platform: string
      total_ads: number
      total_spend_lower: number // Soma dos gastos mínimos
      total_spend_upper: number // Soma dos gastos máximos
      countries: Set<string>
      platforms: Set<string>
    }>()
    
    for (const ad of data || []) {
      const key = ad.page_id || ''
      if (!key) continue
      
      if (!pagesMap.has(key)) {
        pagesMap.set(key, {
          page_id: ad.page_id!,
          page_name: ad.page_name || 'Sem nome',
          country: ad.country || 'AR',
          platform: ad.platform || 'facebook',
          total_ads: 0,
          total_spend_lower: 0,
          total_spend_upper: 0,
          countries: new Set(),
          platforms: new Set()
        })
      }
      
      const page = pagesMap.get(key)!
      page.total_ads++
      if (ad.country) page.countries.add(ad.country)
      if (ad.platform) page.platforms.add(ad.platform)
      
      // Somar gastos (se disponíveis)
      if (ad.spend_lower !== null && ad.spend_lower !== undefined) {
        page.total_spend_lower += ad.spend_lower
      }
      if (ad.spend_upper !== null && ad.spend_upper !== undefined) {
        page.total_spend_upper += ad.spend_upper
      }
    }
    
    // Converter para array e filtrar por mínimo
    const pages = Array.from(pagesMap.values())
      .filter(p => p.total_ads >= minAds)
      .map(p => ({
        ...p,
        countries: Array.from(p.countries),
        platforms: Array.from(p.platforms)
      }))
      .sort((a, b) => b.total_ads - a.total_ads)
    
    return NextResponse.json({
      data: pages,
      total: pages.length
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro interno', details: error.message },
      { status: 500 }
    )
  }
}

