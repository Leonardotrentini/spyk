import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/libraries - Listar bibliotecas com filtros
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Query params para filtros
    const searchParams = request.nextUrl.searchParams
    const niche = searchParams.get('niche')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const boardId = searchParams.get('boardId')
    const isFavorite = searchParams.get('isFavorite')

    let query = supabase
      .from('library_entries')
      .select(`
        *,
        library_board_relations (
          board_id,
          boards (*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (niche && niche !== 'ALL') {
      query = query.eq('niche', niche)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (search) {
      query = query.or(`brand_name.ilike.%${search}%,url.ilike.%${search}%`)
    }
    if (isFavorite === 'true') {
      query = query.eq('is_favorite', true)
    }
    if (boardId) {
      // Filtrar por board via join
      query = query.contains('library_board_relations.board_id', [boardId])
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching libraries:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transformar para formato esperado pelo frontend
    const transformed = data?.map((entry: any) => ({
      id: entry.id,
      url: entry.url,
      brandName: entry.brand_name,
      landingPageUrl: entry.landing_page_url,
      activeAdsCount: entry.active_ads_count,
      niche: entry.niche,
      status: entry.status,
      trafficEstimate: entry.traffic_estimate,
      isFavorite: entry.is_favorite,
      notes: entry.notes,
      createdAt: new Date(entry.created_at).getTime(),
      lastChecked: new Date(entry.last_checked).getTime(),
      boardIds: entry.library_board_relations?.map((r: any) => r.board_id) || [],
    })) || []

    return NextResponse.json({ data: transformed })
  } catch (error: any) {
    console.error('Error in GET /api/libraries:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/libraries - Criar nova biblioteca
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      url,
      brandName,
      landingPageUrl,
      activeAdsCount,
      niche,
      status = 'monitoring',
      trafficEstimate,
      notes,
      boardIds = [],
    } = body

    // Inserir biblioteca
    const { data: entry, error: insertError } = await supabase
      .from('library_entries')
      .insert({
        user_id: user.id,
        url,
        brand_name: brandName,
        landing_page_url: landingPageUrl,
        active_ads_count: activeAdsCount || 0,
        niche,
        status,
        traffic_estimate: trafficEstimate,
        notes,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating library:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Adicionar relações com boards
    if (boardIds.length > 0) {
      const relations = boardIds.map((boardId: string) => ({
        library_id: entry.id,
        board_id: boardId,
      }))
      
      await supabase.from('library_board_relations').insert(relations)
    }

    // Retornar no formato esperado
    const transformed = {
      id: entry.id,
      url: entry.url,
      brandName: entry.brand_name,
      landingPageUrl: entry.landing_page_url,
      activeAdsCount: entry.active_ads_count,
      niche: entry.niche,
      status: entry.status,
      trafficEstimate: entry.traffic_estimate,
      isFavorite: entry.is_favorite,
      notes: entry.notes,
      createdAt: new Date(entry.created_at).getTime(),
      lastChecked: new Date(entry.last_checked).getTime(),
      boardIds,
    }

    return NextResponse.json({ data: transformed }, { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /api/libraries:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

