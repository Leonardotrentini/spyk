import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Processa todos os anúncios não processados em lote
 * MVP - processamento básico sem IA
 * 
 * Chama a lógica de processamento diretamente (reutiliza código)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Buscar todos os anúncios e verificar quais já foram processados
    const { data: allAds } = await supabase
      .from('raw_ads')
      .select('id')
      .limit(100)

    const { data: processedAds } = await supabase
      .from('offers')
      .select('ad_id')

    const processedIds = new Set(processedAds?.map(o => o.ad_id).filter(Boolean) || [])
    const unprocessed = allAds?.filter(ad => !processedIds.has(ad.id)) || []
    const adIds = unprocessed.map(ad => ad.id)
    
    if (adIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum anúncio para processar',
        processed: 0
      })
    }

    // Processar cada anúncio
    let processed = 0
    let errors = 0

    for (const adId of adIds) {
      try {
        // Criar request simulado para reutilizar a lógica
        const mockRequest = {
          json: async () => ({ adId })
        } as NextRequest

        // Importar e chamar a função POST do basic
        const { POST } = await import('../basic/route')
        const response = await POST(mockRequest)
        const result = await response.json()

        if (result.success) {
          processed++
        } else {
          errors++
          console.error(`Erro ao processar anúncio ${adId}:`, result.error)
        }

        // Pequeno delay para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error: any) {
        errors++
        console.error(`Erro ao processar anúncio ${adId}:`, error.message)
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      errors,
      total: adIds.length
    })

  } catch (error: any) {
    console.error('Erro no processamento em lote:', error)
    return NextResponse.json(
      { error: 'Erro ao processar em lote', details: error.message },
      { status: 500 }
    )
  }
}

