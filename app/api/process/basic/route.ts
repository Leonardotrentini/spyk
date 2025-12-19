import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Processamento básico SEM IA - extrai dados simples dos anúncios
 * MVP mínimo que funciona apenas com Supabase + Meta Ads Library
 */
export async function POST(request: NextRequest) {
  try {
    const { adId } = await request.json()

    if (!adId) {
      return NextResponse.json(
        { error: 'adId é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Buscar dados do anúncio
    const { data: adData, error: adError } = await supabase
      .from('raw_ads')
      .select('*')
      .eq('id', adId)
      .single()

    if (adError || !adData) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
    }

    // Extrair domínio da URL
    const landingPageUrl = adData.landing_page_url
    let domain: string | null = null
    let mainDomain: string | null = null

    if (landingPageUrl) {
      try {
        const url = new URL(landingPageUrl)
        domain = url.hostname.replace('www.', '')
        mainDomain = domain.split('.').slice(-2).join('.')
      } catch (e) {
        // URL inválida, ignorar
      }
    }

    // Buscar ou criar player
    let playerId: string | null = null
    if (mainDomain) {
      const { data: existingPlayer } = await supabase
        .from('players')
        .select('id')
        .eq('main_domain', mainDomain)
        .eq('country', adData.country)
        .single()

      if (existingPlayer) {
        playerId = existingPlayer.id
      } else {
        const { data: newPlayer } = await supabase
          .from('players')
          .insert({
            domain: domain!,
            main_domain: mainDomain,
            country: adData.country
          })
          .select()
          .single()
        playerId = newPlayer?.id || null
      }
    }

    // Processamento básico SEM IA - extrair dados simples do copy
    const adCopy = `${adData.ad_creative_body || ''} ${adData.ad_creative_link_title || ''} ${adData.ad_creative_link_description || ''}`.toLowerCase()

    // Detectar nicho básico por palavras-chave
    let nichePrincipal = 'Outros'
    if (adCopy.includes('dinero') || adCopy.includes('ganar') || adCopy.includes('negocio') || adCopy.includes('emprendimiento')) {
      nichePrincipal = 'Dinero Online'
    } else if (adCopy.includes('salud') || adCopy.includes('perder peso') || adCopy.includes('fitness') || adCopy.includes('ejercicio')) {
      nichePrincipal = 'Salud'
    } else if (adCopy.includes('relacion') || adCopy.includes('amor') || adCopy.includes('pareja')) {
      nichePrincipal = 'Relaciones'
    }

    // Tentar extrair preço básico (buscar padrões como $99, 99 USD, etc)
    let priceUsd: number | null = null
    const priceMatch = adCopy.match(/\$(\d+)|(\d+)\s*(?:usd|dolares|dólares)/i)
    if (priceMatch) {
      priceUsd = parseFloat(priceMatch[1] || priceMatch[2])
    }

    // Score DR básico baseado em palavras-chave de DR
    let drScore = 30 // Base
    const drKeywords = ['ahora', 'urgente', 'limitado', 'oferta', 'descuento', 'bonus', 'garantia', 'gratis', 'sin riesgo']
    const drMatches = drKeywords.filter(keyword => adCopy.includes(keyword)).length
    drScore = Math.min(100, 30 + (drMatches * 10))

    // Criar oferta básica
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .insert({
        player_id: playerId,
        ad_id: adId,
        landing_page_id: null,
        niche_principal: nichePrincipal,
        sub_nicho: null,
        sub_sub_nicho: null,
        dr_score: drScore,
        price_usd: priceUsd,
        bonuses: [],
        guarantee_days: null,
        mental_triggers: [],
        social_proof_type: null,
        social_proof_count: null,
        country: adData.country,
        platform: adData.platform,
        landing_page_url: landingPageUrl || '',
        is_active: true
      })
      .select()
      .single()

    if (offerError) {
      // Se já existe, atualizar
      const { data: existingOffer } = await supabase
        .from('offers')
        .select('id')
        .eq('ad_id', adId)
        .single()

      if (existingOffer) {
        return NextResponse.json({
          success: true,
          offer_id: existingOffer.id,
          player_id: playerId,
          message: 'Oferta já existe, dados atualizados',
          processed_data: {
            niche_principal: nichePrincipal,
            dr_score: drScore,
            price_usd: priceUsd
          }
        })
      }

      throw new Error(`Erro ao criar oferta: ${offerError.message}`)
    }

    // Atualizar estatísticas do player
    if (playerId) {
      const { data: playerStats } = await supabase
        .from('offers')
        .select('id')
        .eq('player_id', playerId)

      const { data: adsStats } = await supabase
        .from('raw_ads')
        .select('id, impressions_lower_bound, impressions_upper_bound, ad_delivery_start_time')
        .eq('page_id', adData.page_id)

      const totalOffers = playerStats?.length || 0
      const totalAds = adsStats?.length || 0
      const estimatedImpressions = adsStats?.reduce((sum, ad) => {
        return sum + (ad.impressions_lower_bound || 0) + ((ad.impressions_upper_bound || 0) / 2)
      }, 0) || 0

      const oldestAd = adsStats?.sort((a, b) => {
        const dateA = a.ad_delivery_start_time ? new Date(a.ad_delivery_start_time).getTime() : 0
        const dateB = b.ad_delivery_start_time ? new Date(b.ad_delivery_start_time).getTime() : 0
        return dateA - dateB
      })[0]

      const daysRunning = oldestAd?.ad_delivery_start_time
        ? Math.floor((Date.now() - new Date(oldestAd.ad_delivery_start_time).getTime()) / (1000 * 60 * 60 * 24))
        : 0

      // Calcular dominance score simples
      const dominanceScore = Math.min(100, (totalAds * 10) + (totalOffers * 5) + (daysRunning * 0.1) + (estimatedImpressions / 10000))

      await supabase
        .from('players')
        .update({
          total_ads: totalAds,
          total_offers: totalOffers,
          days_running: daysRunning,
          estimated_impressions: estimatedImpressions,
          dominance_score: dominanceScore
        })
        .eq('id', playerId)
    }

    return NextResponse.json({
      success: true,
      offer_id: offer.id,
      player_id: playerId,
      processed_data: {
        niche_principal: nichePrincipal,
        dr_score: drScore,
        price_usd: priceUsd
      },
      note: 'Processamento básico sem IA - dados limitados'
    })

  } catch (error: any) {
    console.error('Erro no processamento básico:', error)
    return NextResponse.json(
      { error: 'Erro ao processar anúncio', details: error.message },
      { status: 500 }
    )
  }
}



