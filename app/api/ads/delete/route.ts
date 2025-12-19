import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { ids, deleteAll } = body

    const supabase = createAdminClient()

    if (deleteAll) {
      // Deletar todos os anúncios - buscar todos os IDs primeiro
      const { data: allAds, error: fetchError } = await supabase
        .from('ads')
        .select('id')

      if (fetchError) {
        return NextResponse.json(
          { error: 'Erro ao buscar anúncios', details: fetchError.message },
          { status: 500 }
        )
      }

      if (!allAds || allAds.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'Nenhum anúncio para deletar',
          deleted: 0
        })
      }

      const allIds = allAds.map(ad => ad.id)
      
      // Deletar em lotes se necessário (Supabase tem limite)
      const batchSize = 1000
      let deleted = 0
      
      for (let i = 0; i < allIds.length; i += batchSize) {
        const batch = allIds.slice(i, i + batchSize)
        const { error } = await supabase
          .from('ads')
          .delete()
          .in('id', batch)

        if (error) {
          return NextResponse.json(
            { error: 'Erro ao deletar anúncios', details: error.message },
            { status: 500 }
          )
        }
        
        deleted += batch.length
      }

      return NextResponse.json({
        success: true,
        message: `Todos os ${deleted} anúncios foram deletados`,
        deleted
      })
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'IDs não fornecidos' },
        { status: 400 }
      )
    }

    // Deletar anúncios específicos
    const { error } = await supabase
      .from('ads')
      .delete()
      .in('id', ids)

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao deletar anúncios', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${ids.length} anúncio(s) deletado(s)`,
      deleted: ids.length
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro interno', details: error.message },
      { status: 500 }
    )
  }
}

