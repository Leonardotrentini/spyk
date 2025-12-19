// Tipos para anúncios da Meta Ads Library

export interface Ad {
  id: string
  ad_id: string
  page_id: string | null
  page_name: string | null
  ad_creative_body: string | null
  ad_creative_link_title: string | null
  ad_creative_link_description: string | null
  ad_snapshot_url: string | null
  landing_page_url: string | null
  platform: 'facebook' | 'instagram'
  country: string
  language: string | null
  funding_entity: string | null
  impressions_lower: number | null
  impressions_upper: number | null
  spend_lower: number | null
  spend_upper: number | null
  ad_delivery_start_time: string | null
  niche: string | null // Nicho identificado (financas, saude, relacionamento, etc.)
  created_at: string
  updated_at: string
}

export interface AdFilters {
  country?: string[]
  platform?: ('facebook' | 'instagram')[]
  page_name?: string
  search_text?: string // Busca no copy
  niche?: string[] // Filtro por nicho
  min_ads_per_page?: number // Mínimo de anúncios ativos por página
  likes_min?: number // Curtidas mínimas
  likes_max?: number // Curtidas máximas
  spend_min?: number
  spend_max?: number
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
  order_by?: string
  order_dir?: 'asc' | 'desc'
}

export interface AdListResponse {
  data: Ad[]
  total: number
  limit: number
  offset: number
}

