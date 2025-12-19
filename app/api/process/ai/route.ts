import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

interface ProcessRequest {
  adId?: string
  landingPageId?: string
}

export async function POST(request: NextRequest) {
  try {
    const { adId, landingPageId }: ProcessRequest = await request.json()

    if (!adId && !landingPageId) {
      return NextResponse.json(
        { error: 'adId ou landingPageId é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Buscar dados do anúncio e landing page
    let adData = null
    let landingPageData = null

    if (adId) {
      const { data: ad } = await supabase
        .from('raw_ads')
        .select('*')
        .eq('id', adId)
        .single()
      adData = ad
    }

    if (landingPageId) {
      const { data: lp } = await supabase
        .from('raw_landing_pages')
        .select('*')
        .eq('id', landingPageId)
        .single()
      landingPageData = lp
    } else if (adData?.landing_page_url) {
      const { data: lp } = await supabase
        .from('raw_landing_pages')
        .select('*')
        .eq('url', adData.landing_page_url)
        .single()
      landingPageData = lp
    }

    // Preparar contexto para IA
    const context = {
      adCopy: adData ? {
        body: adData.ad_creative_body,
        title: adData.ad_creative_link_title,
        description: adData.ad_creative_link_description
      } : null,
      landingPageText: landingPageData?.extracted_text || null,
      landingPageUrl: landingPageData?.url || adData?.landing_page_url || null,
      country: adData?.country || 'AR'
    }

    // Chamar IA para processar
    const prompt = `Analise os seguintes dados de uma oferta de infoproduto em espanhol e retorne um JSON estruturado:

DADOS DO ANÚNCIO:
${context.adCopy ? JSON.stringify(context.adCopy, null, 2) : 'Não disponível'}

TEXTO DA LANDING PAGE:
${context.landingPageText?.substring(0, 5000) || 'Não disponível'}

URL: ${context.landingPageUrl || 'Não disponível'}

Retorne um JSON com a seguinte estrutura:
{
  "niche_principal": "categoria principal (ex: Dinero Online, Salud, Relaciones, etc.)",
  "sub_nicho": "subcategoria (ex: Marketing Digital, Fitness, etc.)",
  "sub_sub_nicho": "sub-subcategoria (ex: Tráfico Pago, Perdida de Peso, etc.) ou null",
  "dr_score": número de 0 a 100 indicando quão "Direct Response" é a oferta,
  "price_usd": preço em dólares (número ou null se não encontrado),
  "bonuses": array de strings com bônus mencionados,
  "guarantee_days": número de dias de garantia ou null,
  "mental_triggers": array de strings com gatilhos mentais identificados (ex: "Urgência", "Escassez", "Prova Social", etc.),
  "social_proof_type": tipo de prova social (ex: "Testimonios", "Casos de Éxito", "Número de Alumnos", etc.) ou null,
  "social_proof_count": número mencionado na prova social ou null
}

Analise cuidadosamente e retorne APENAS o JSON, sem markdown ou texto adicional.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Resposta da IA não contém JSON válido')
    }

    const aiResult = JSON.parse(jsonMatch[0])

    // Extrair domínio da URL
    const domain = context.landingPageUrl ? new URL(context.landingPageUrl).hostname.replace('www.', '') : null
    const mainDomain = domain ? domain.split('.').slice(-2).join('.') : null

    // Buscar ou criar player
    let playerId: string | null = null
    if (mainDomain) {
      const { data: existingPlayer } = await supabase
        .from('players')
        .select('id')
        .eq('main_domain', mainDomain)
        .eq('country', context.country)
        .single()

      if (existingPlayer) {
        playerId = existingPlayer.id
      } else {
        const { data: newPlayer } = await supabase
          .from('players')
          .insert({
            domain: domain!,
            main_domain: mainDomain,
            country: context.country
          })
          .select()
          .single()
        playerId = newPlayer?.id || null
      }
    }

    // Criar oferta
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .insert({
        player_id: playerId,
        ad_id: adId || null,
        landing_page_id: landingPageId || landingPageData?.id || null,
        niche_principal: aiResult.niche_principal,
        sub_nicho: aiResult.sub_nicho || null,
        sub_sub_nicho: aiResult.sub_sub_nicho || null,
        dr_score: aiResult.dr_score,
        price_usd: aiResult.price_usd,
        bonuses: aiResult.bonuses || [],
        guarantee_days: aiResult.guarantee_days,
        mental_triggers: aiResult.mental_triggers || [],
        social_proof_type: aiResult.social_proof_type,
        social_proof_count: aiResult.social_proof_count,
        country: context.country,
        platform: adData?.platform || 'facebook',
        landing_page_url: context.landingPageUrl || '',
        is_active: true
      })
      .select()
      .single()

    if (offerError) {
      throw new Error(`Erro ao criar oferta: ${offerError.message}`)
    }

    // Atualizar estatísticas do player
    if (playerId) {
      const { data: playerStats } = await supabase
        .from('offers')
        .select('id, created_at')
        .eq('player_id', playerId)

      const { data: adsStats } = await supabase
        .from('raw_ads')
        .select('id, impressions_lower_bound, impressions_upper_bound, ad_delivery_start_time')
        .eq('landing_page_url', context.landingPageUrl)

      const totalOffers = playerStats?.length || 0
      const totalAds = adsStats?.length || 0
      const estimatedImpressions = adsStats?.reduce((sum, ad) => {
        return sum + (ad.impressions_lower_bound || 0) + (ad.impressions_upper_bound || 0) / 2
      }, 0) || 0

      const oldestAd = adsStats?.sort((a, b) => {
        const dateA = a.ad_delivery_start_time ? new Date(a.ad_delivery_start_time).getTime() : 0
        const dateB = b.ad_delivery_start_time ? new Date(b.ad_delivery_start_time).getTime() : 0
        return dateA - dateB
      })[0]

      const daysRunning = oldestAd?.ad_delivery_start_time
        ? Math.floor((Date.now() - new Date(oldestAd.ad_delivery_start_time).getTime()) / (1000 * 60 * 60 * 24))
        : 0

      // Calcular dominance score (fórmula simples - pode ser refinada)
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
      ai_result: aiResult
    })

  } catch (error: any) {
    console.error('Erro no processamento com IA:', error)
    return NextResponse.json(
      { error: 'Erro ao processar com IA', details: error.message },
      { status: 500 }
    )
  }
}



