export interface RawAd {
  id: string
  ad_id: string
  page_id: string
  page_name: string
  ad_creative_body: string | null
  ad_creative_link_title: string | null
  ad_creative_link_description: string | null
  ad_delivery_start_time: string | null
  ad_snapshot_url: string | null
  funding_entity: string | null
  impressions_lower_bound: number | null
  impressions_upper_bound: number | null
  spend_lower_bound: number | null
  spend_upper_bound: number | null
  platform: string
  country: string
  language: string
  landing_page_url: string | null
  created_at: string
  updated_at: string
}

export interface RawLandingPage {
  id: string
  url: string
  html_content: string | null
  extracted_text: string | null
  screenshot_url: string | null
  video_urls: string[]
  links: string[]
  ctas: string[]
  ad_id: string | null
  created_at: string
  updated_at: string
}

export interface Player {
  id: string
  domain: string
  main_domain: string
  country: string
  dominance_score: number
  total_ads: number
  total_offers: number
  days_running: number
  estimated_impressions: number
  created_at: string
  updated_at: string
}

export interface Offer {
  id: string
  player_id: string
  ad_id: string | null
  landing_page_id: string | null
  niche_principal: string
  sub_nicho: string | null
  sub_sub_nicho: string | null
  dr_score: number
  price_usd: number | null
  bonuses: string[]
  guarantee_days: number | null
  mental_triggers: string[]
  social_proof_type: string | null
  social_proof_count: number | null
  country: string
  platform: string
  landing_page_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  offer_id: string
  created_at: string
}



