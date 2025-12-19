import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Endpoint para criar dados padrão (nichos e boards) para novo usuário
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar se já existe nichos
    const { data: existingNiches } = await supabase
      .from('niche_options')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    // Se não existir, criar nichos padrão
    if (!existingNiches || existingNiches.length === 0) {
      const defaultNiches = [
        { label: 'E-commerce', color: 'bg-blue-100 text-blue-800' },
        { label: 'SaaS', color: 'bg-indigo-100 text-indigo-800' },
        { label: 'Health & Wellness', color: 'bg-emerald-100 text-emerald-800' },
        { label: 'Crypto', color: 'bg-amber-100 text-amber-800' },
        { label: 'Real Estate', color: 'bg-purple-100 text-purple-800' },
      ]

      await supabase
        .from('niche_options')
        .insert(defaultNiches.map(n => ({ ...n, user_id: user.id })))
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

