import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Wrapper para a Edge Function research-market
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topic, country, type = 'market-trends' } = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const urlMatch = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)
    if (!urlMatch) {
      return NextResponse.json({ error: 'Invalid Supabase URL' }, { status: 500 })
    }
    
    const projectRef = urlMatch[1]
    const functionUrl = `https://${projectRef}.supabase.co/functions/v1/research-market`

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'No session' }, { status: 401 })
    }

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ topic, country, type }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Market research failed' }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in research-market:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

