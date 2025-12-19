import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import puppeteer from 'puppeteer'

export async function POST(request: NextRequest) {
  try {
    const { url, adId } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL é obrigatória' },
        { status: 400 }
      )
    }

    // Verificar se já existe
    const supabase = createAdminClient()
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

    // Iniciar Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    try {
      const page = await browser.newPage()
      await page.setViewport({ width: 1920, height: 1080 })
      
      // Navegar para a página
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })

      // Extrair HTML
      const htmlContent = await page.content()

      // Extrair texto visível
      const extractedText = await page.evaluate(() => {
        const body = document.body
        return body.innerText || body.textContent || ''
      })

      // Extrair links
      const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href]'))
        return anchors.map(a => (a as HTMLAnchorElement).href)
      })

      // Extrair CTAs (botões e links com palavras-chave)
      const ctas = await page.evaluate(() => {
        const ctaKeywords = ['comprar', 'comprar ahora', 'quiero', 'quiero ahora', 'obtener', 'descargar', 'empezar', 'registrarse', 'suscribirse']
        const elements = Array.from(document.querySelectorAll('button, a, [role="button"]'))
        return elements
          .map(el => el.textContent?.toLowerCase().trim())
          .filter(text => text && ctaKeywords.some(keyword => text.includes(keyword)))
          .filter((v, i, a) => a.indexOf(v) === i) // remover duplicatas
      })

      // Extrair URLs de vídeo
      const videoUrls = await page.evaluate(() => {
        const videos = Array.from(document.querySelectorAll('video source, iframe[src*="youtube"], iframe[src*="vimeo"], [data-video-url]'))
        return videos.map(v => {
          if (v.tagName === 'SOURCE') {
            return (v as HTMLSourceElement).src
          }
          if (v.tagName === 'IFRAME') {
            return (v as HTMLIFrameElement).src
          }
          return (v as HTMLElement).getAttribute('data-video-url') || ''
        }).filter(Boolean)
      })

      // Capturar screenshot
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: true
      })

      // Upload do screenshot para Supabase Storage
      const screenshotFileName = `screenshots/${Date.now()}-${url.replace(/[^a-z0-9]/gi, '_')}.png`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('landing-pages')
        .upload(screenshotFileName, screenshot, {
          contentType: 'image/png',
          upsert: true
        })

      let screenshotUrl: string | null = null
      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('landing-pages')
          .getPublicUrl(screenshotFileName)
        screenshotUrl = publicUrlData.publicUrl
      }

      // Salvar no banco
      const { data: landingPage, error: dbError } = await supabase
        .from('raw_landing_pages')
        .insert({
          url,
          html_content: htmlContent.substring(0, 1000000), // Limitar tamanho
          extracted_text: extractedText.substring(0, 500000),
          screenshot_url: screenshotUrl,
          video_urls: videoUrls,
          links: links.slice(0, 1000), // Limitar quantidade
          ctas: ctas,
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
        screenshot_url: screenshotUrl,
        extracted_text_length: extractedText.length,
        links_count: links.length,
        ctas_count: ctas.length,
        video_urls_count: videoUrls.length
      })

    } finally {
      await browser.close()
    }

  } catch (error: any) {
    console.error('Erro no scraping:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer scraping da landing page', details: error.message },
      { status: 500 }
    )
  }
}



