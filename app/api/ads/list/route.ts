import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { AdFilters, AdListResponse } from '@/types/ad'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extrair filtros da query string
    const filters: AdFilters = {
      country: searchParams.get('country')?.split(',').filter(Boolean),
      platform: searchParams.get('platform')?.split(',') as ('facebook' | 'instagram')[],
      niche: searchParams.get('niche')?.split(',').filter(Boolean),
      page_name: searchParams.get('page_name') || undefined,
      search_text: searchParams.get('search_text') || undefined,
      min_ads_per_page: searchParams.get('min_ads_per_page') ? parseInt(searchParams.get('min_ads_per_page')!) : undefined,
      likes_min: searchParams.get('likes_min') ? parseInt(searchParams.get('likes_min')!) : undefined,
      likes_max: searchParams.get('likes_max') ? parseInt(searchParams.get('likes_max')!) : undefined,
      spend_min: searchParams.get('spend_min') ? parseFloat(searchParams.get('spend_min')!) : undefined,
      spend_max: searchParams.get('spend_max') ? parseFloat(searchParams.get('spend_max')!) : undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      order_by: searchParams.get('order_by') || 'created_at',
      order_dir: (searchParams.get('order_dir') || 'desc') as 'asc' | 'desc',
    }

    const supabase = createAdminClient()
    let query = supabase.from('ads').select('*', { count: 'exact' })

    // Aplicar filtros
    if (filters.country && filters.country.length > 0) {
      query = query.in('country', filters.country)
    }

    if (filters.platform && filters.platform.length > 0) {
      query = query.in('platform', filters.platform)
    }

    if (filters.niche && filters.niche.length > 0) {
      query = query.in('niche', filters.niche)
    }

    if (filters.page_name) {
      query = query.ilike('page_name', `%${filters.page_name}%`)
    }

    if (filters.search_text) {
      query = query.or(`ad_creative_body.ilike.%${filters.search_text}%,ad_creative_link_title.ilike.%${filters.search_text}%,ad_creative_link_description.ilike.%${filters.search_text}%`)
    }

    // Nota: Curtidas não estão disponíveis na API da Meta Ads Library por enquanto
    // Este filtro está preparado para quando adicionarmos esse campo no banco
    // if (filters.likes_min !== undefined) {
    //   query = query.gte('likes', filters.likes_min)
    // }
    // if (filters.likes_max !== undefined) {
    //   query = query.lte('likes', filters.likes_max)
    // }

    if (filters.spend_min !== undefined) {
      query = query.gte('spend_lower', filters.spend_min)
    }

    if (filters.spend_max !== undefined) {
      query = query.lte('spend_upper', filters.spend_max)
    }

    if (filters.date_from) {
      query = query.gte('ad_delivery_start_time', filters.date_from)
    }

    if (filters.date_to) {
      query = query.lte('ad_delivery_start_time', filters.date_to)
    }

    // Filtrar por mínimo de anúncios por página
    if (filters.min_ads_per_page && filters.min_ads_per_page > 0) {
      // Buscar page_ids que têm pelo menos min_ads_per_page anúncios usando SQL
      const { data: pagesWithMinAds, error: pagesError } = await supabase.rpc('get_pages_with_min_ads', {
        min_ads: filters.min_ads_per_page
      })
      
      if (pagesError) {
        // Se a função RPC não existir, usar query SQL direta
        const { data: allAds } = await supabase
          .from('ads')
          .select('page_id')
          .not('page_id', 'is', null)
        
        if (allAds) {
          // Contar anúncios por página
          const pageCounts = new Map<string, number>()
          for (const ad of allAds) {
            const pageId = ad.page_id
            if (pageId) {
              pageCounts.set(pageId, (pageCounts.get(pageId) || 0) + 1)
            }
          }
          
          // Filtrar páginas que atendem o critério
          const validPageIds = Array.from(pageCounts.entries())
            .filter(([_, count]) => count >= filters.min_ads_per_page!)
            .map(([pageId]) => pageId)
          
          if (validPageIds.length > 0) {
            query = query.in('page_id', validPageIds)
          } else {
            // Se nenhuma página atende o critério, retornar vazio
            return NextResponse.json({
              data: [],
              total: 0,
              limit: filters.limit || 50,
              offset: filters.offset || 0
            })
          }
        }
      } else if (pagesWithMinAds && pagesWithMinAds.length > 0) {
        const validPageIds = pagesWithMinAds.map((p: any) => p.page_id).filter(Boolean)
        query = query.in('page_id', validPageIds)
      } else {
        // Se nenhuma página atende o critério, retornar vazio
        return NextResponse.json({
          data: [],
          total: 0,
          limit: filters.limit || 50,
          offset: filters.offset || 0
        })
      }
    }

    // Ordenação
    const orderBy = filters.order_by || 'created_at'
    const orderDir = filters.order_dir || 'desc'
    query = query.order(orderBy, { ascending: orderDir === 'asc' })

    // Paginação
    const limit = filters.limit || 50
    const offset = filters.offset || 0
    query = query.range(offset, offset + limit - 1)

    // Executar query
    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao buscar anúncios', details: error.message },
        { status: 500 }
      )
    }

    const response: AdListResponse = {
      data: data || [],
      total: count || 0,
      limit,
      offset
    }

    return NextResponse.json(response)

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro interno', details: error.message },
      { status: 500 }
    )
  }
}

