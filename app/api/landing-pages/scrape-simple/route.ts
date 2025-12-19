import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Versão simplificada de scraping que não requer Puppeteer
 * Útil para ambientes serverless como Vercel
 * Limitações: não executa JavaScript, não captura screenshots
 */
export async function POST(request: NextRequest) {
  try {
    const { url, adId } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL é obrigatória' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('raw_landing_pages')
      .select('id')
      .eq('url', url)
      .single()

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Landing page já existe',
        landing_page_id: existing.id
      })
    }

    // Fazer fetch simples (sem JavaScript)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const htmlContent = await response.text()

    // Extrair texto básico (remover tags HTML)
    const extractedText = htmlContent
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Extrair links básicos (regex simples)
    const linkRegex = /href=["']([^"']+)["']/gi
    const links: string[] = []
    let match
    while ((match = linkRegex.exec(htmlContent)) !== null && links.length < 1000) {
      const href = match[1]
      if (href.startsWith('http')) {
        links.push(href)
      } else if (href.startsWith('/')) {
        try {
          const fullUrl = new URL(href, url).toString()
          links.push(fullUrl)
        } catch (e) {
          // URL inválida, ignorar
        }
      }
    }

    // Extrair CTAs básicos (buscar por palavras-chave no texto)
    const ctaKeywords = ['comprar', 'comprar ahora', 'quiero', 'quiero ahora', 'obtener', 'descargar', 'empezar', 'registrarse', 'suscribirse']
    const ctas: string[] = []
    const lowerText = extractedText.toLowerCase()
    ctaKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        ctas.push(keyword)
      }
    })

    // Extrair URLs de vídeo básicas
    const videoUrls: string[] = []
    const videoRegex = /(https?:\/\/[^\s"<>]+(?:youtube|vimeo|video)[^\s"<>]*)/gi
    let videoMatch
    while ((videoMatch = videoRegex.exec(htmlContent)) !== null) {
      videoUrls.push(videoMatch[1])
    }

    // Salvar no banco (sem screenshot)
    const { data: landingPage, error: dbError } = await supabase
      .from('raw_landing_pages')
      .insert({
        url,
        html_content: htmlContent.substring(0, 1000000), // Limitar tamanho
        extracted_text: extractedText.substring(0, 500000),
        screenshot_url: null, // Não disponível sem Puppeteer
        video_urls: [...new Set(videoUrls)], // Remover duplicatas
        links: [...new Set(links)].slice(0, 1000), // Limitar quantidade
        ctas: [...new Set(ctas)],
        ad_id: adId || null
      })
      .select()
      .single()

    if (dbError) {
      throw new Error(`Erro ao salvar: ${dbError.message}`)
    }

    return NextResponse.json({
      success: true,
      landing_page_id: landingPage.id,
      extracted_text_length: extractedText.length,
      links_count: links.length,
      ctas_count: ctas.length,
      video_urls_count: videoUrls.length,
      note: 'Scraping simplificado - sem JavaScript executado, sem screenshot'
    })

  } catch (error: any) {
    console.error('Erro no scraping simplificado:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer scraping da landing page', details: error.message },
      { status: 500 }
    )
  }
}



