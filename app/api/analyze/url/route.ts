import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Wrapper para a Edge Function analyze-url
 * Protege a API Key e adiciona autenticação
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url, brandName } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Obter URL e chave do Supabase para chamar Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    // Extrair project ref
    const urlMatch = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)
    if (!urlMatch) {
      return NextResponse.json({ error: 'Invalid Supabase URL' }, { status: 500 })
    }
    
    const projectRef = urlMatch[1]
    const functionUrl = `https://${projectRef}.supabase.co/functions/v1/analyze-url`

    // Obter token de sessão
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'No session' }, { status: 401 })
    }

    // Chamar Edge Function
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ url, brandName }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Analysis failed' }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in analyze-url:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

