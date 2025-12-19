import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('niche_options')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const transformed = data?.map((niche: any) => ({
      id: niche.id,
      label: niche.label,
      color: niche.color,
    })) || []

    return NextResponse.json({ data: transformed })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { label, color } = await request.json()

    const { data, error } = await supabase
      .from('niche_options')
      .insert({ user_id: user.id, label, color })
      .select()
      .single()

    if (error) {
      // Se já existe, retornar o existente
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('niche_options')
          .select('*')
          .eq('user_id', user.id)
          .eq('label', label)
          .single()
        
        if (existing) {
          return NextResponse.json({ data: { id: existing.id, label: existing.label, color: existing.color } })
        }
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: { id: data.id, label: data.label, color: data.color } }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

