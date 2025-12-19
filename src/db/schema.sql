-- ============================================
-- Facebook Ads Library Scraper - Schema
-- ============================================

-- Tabela: pages
-- Armazena informações sobre páginas encontradas
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT UNIQUE NOT NULL,
  page_name TEXT,
  country TEXT NOT NULL CHECK (char_length(country) = 2),
  estimated_active_ads_from_search INTEGER DEFAULT 0,
  total_active_ads INTEGER,
  has_ad_older_than_7_days BOOLEAN DEFAULT false,
  has_offer_by_rule BOOLEAN DEFAULT false,
  library_url TEXT,
  has_dr_terms BOOLEAN DEFAULT false,
  dr_terms_count INTEGER DEFAULT 0,
  first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_audit_at TIMESTAMP WITH TIME ZONE
);

-- Tabela: page_search_hits
-- Registra resultados brutos das buscas por keyword
CREATE TABLE IF NOT EXISTS page_search_hits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  country TEXT NOT NULL CHECK (char_length(country) = 2),
  page_id TEXT NOT NULL,
  page_name TEXT,
  ads_count_for_keyword INTEGER DEFAULT 0,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: ads
-- Armazena anúncios coletados
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  ad_id TEXT,
  text TEXT,
  headline TEXT,
  cta TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'carousel', 'unknown')),
  media_urls JSONB DEFAULT '[]'::jsonb,
  destination_urls JSONB DEFAULT '[]'::jsonb,
  started_running_on TEXT,
  started_running_days_ago INTEGER,
  has_dr_terms BOOLEAN DEFAULT false,
  dr_terms_count INTEGER DEFAULT 0,
  dr_terms_found JSONB DEFAULT '[]'::jsonb,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_pages_page_id ON pages(page_id);
CREATE INDEX IF NOT EXISTS idx_pages_country ON pages(country);
CREATE INDEX IF NOT EXISTS idx_pages_has_offer ON pages(has_offer_by_rule);

CREATE INDEX IF NOT EXISTS idx_search_hits_keyword ON page_search_hits(keyword);
CREATE INDEX IF NOT EXISTS idx_search_hits_page_id ON page_search_hits(page_id);
CREATE INDEX IF NOT EXISTS idx_search_hits_country ON page_search_hits(country);

CREATE INDEX IF NOT EXISTS idx_ads_page_id ON ads(page_id);
CREATE INDEX IF NOT EXISTS idx_ads_ad_id ON ads(ad_id);
CREATE INDEX IF NOT EXISTS idx_ads_media_type ON ads(media_type);
CREATE INDEX IF NOT EXISTS idx_ads_started_running_days_ago ON ads(started_running_days_ago);
CREATE INDEX IF NOT EXISTS idx_ads_has_dr_terms ON ads(has_dr_terms);
CREATE INDEX IF NOT EXISTS idx_ads_dr_terms_count ON ads(dr_terms_count);

CREATE INDEX IF NOT EXISTS idx_pages_has_dr_terms ON pages(has_dr_terms);
CREATE INDEX IF NOT EXISTS idx_pages_dr_terms_count ON pages(dr_terms_count);

-- RLS (Row Level Security)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_search_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo em pages" ON pages FOR ALL USING (true);
CREATE POLICY "Permitir tudo em page_search_hits" ON page_search_hits FOR ALL USING (true);
CREATE POLICY "Permitir tudo em ads" ON ads FOR ALL USING (true);

-- Comentários
COMMENT ON TABLE pages IS 'Páginas encontradas na Ads Library';
COMMENT ON TABLE page_search_hits IS 'Resultados brutos das buscas por palavra-chave';
COMMENT ON TABLE ads IS 'Anúncios coletados das páginas';

