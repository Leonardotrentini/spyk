import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/libraries/[id] - Buscar biblioteca específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('library_entries')
      .select(`
        *,
        library_board_relations (
          board_id
        )
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const transformed = {
      id: data.id,
      url: data.url,
      brandName: data.brand_name,
      landingPageUrl: data.landing_page_url,
      activeAdsCount: data.active_ads_count,
      niche: data.niche,
      status: data.status,
      trafficEstimate: data.traffic_estimate,
      isFavorite: data.is_favorite,
      notes: data.notes,
      createdAt: new Date(data.created_at).getTime(),
      lastChecked: new Date(data.last_checked).getTime(),
      boardIds: data.library_board_relations?.map((r: any) => r.board_id) || [],
    }

    return NextResponse.json({ data: transformed })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/libraries/[id] - Atualizar biblioteca
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      brandName,
      landingPageUrl,
      activeAdsCount,
      niche,
      status,
      trafficEstimate,
      isFavorite,
      notes,
      boardIds,
    } = body

    // Construir objeto de atualização
    const updateData: any = {}
    if (brandName !== undefined) updateData.brand_name = brandName
    if (landingPageUrl !== undefined) updateData.landing_page_url = landingPageUrl
    if (activeAdsCount !== undefined) updateData.active_ads_count = activeAdsCount
    if (niche !== undefined) updateData.niche = niche
    if (status !== undefined) updateData.status = status
    if (trafficEstimate !== undefined) updateData.traffic_estimate = trafficEstimate
    if (isFavorite !== undefined) updateData.is_favorite = isFavorite
    if (notes !== undefined) updateData.notes = notes

    // Atualizar biblioteca
    const { data: entry, error: updateError } = await supabase
      .from('library_entries')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError || !entry) {
      return NextResponse.json({ error: 'Not found or update failed' }, { status: 404 })
    }

    // Atualizar relações com boards se fornecidas
    if (boardIds !== undefined) {
      // Remover relações existentes
      await supabase
        .from('library_board_relations')
        .delete()
        .eq('library_id', params.id)

      // Adicionar novas relações
      if (boardIds.length > 0) {
        const relations = boardIds.map((boardId: string) => ({
          library_id: params.id,
          board_id: boardId,
        }))
        await supabase.from('library_board_relations').insert(relations)
      }
    }

    // Buscar relações atualizadas
    const { data: relations } = await supabase
      .from('library_board_relations')
      .select('board_id')
      .eq('library_id', params.id)

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
      boardIds: relations?.map((r: any) => r.board_id) || [],
    }

    return NextResponse.json({ data: transformed })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/libraries/[id] - Deletar biblioteca
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('library_entries')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

