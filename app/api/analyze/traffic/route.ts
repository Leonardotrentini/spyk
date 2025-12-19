import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Wrapper para a Edge Function analyze-traffic
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { brandName, url, libraryEntryId } = await request.json()

    if (!brandName || !url) {
      return NextResponse.json({ error: 'brandName and url are required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const urlMatch = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)
    if (!urlMatch) {
      return NextResponse.json({ error: 'Invalid Supabase URL' }, { status: 500 })
    }
    
    const projectRef = urlMatch[1]
    const functionUrl = `https://${projectRef}.supabase.co/functions/v1/analyze-traffic`

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
      body: JSON.stringify({ brandName, url, libraryEntryId }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Traffic analysis failed' }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in analyze-traffic:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

