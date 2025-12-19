-- Tabela para armazenar dados brutos da Meta Ads Library
CREATE TABLE IF NOT EXISTS raw_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id TEXT UNIQUE NOT NULL,
  page_id TEXT,
  page_name TEXT,
  ad_creative_body TEXT,
  ad_creative_link_title TEXT,
  ad_creative_link_description TEXT,
  ad_delivery_start_time TIMESTAMP WITH TIME ZONE,
  ad_snapshot_url TEXT,
  funding_entity TEXT,
  impressions_lower_bound BIGINT,
  impressions_upper_bound BIGINT,
  spend_lower_bound DECIMAL(10, 2),
  spend_upper_bound DECIMAL(10, 2),
  platform TEXT NOT NULL DEFAULT 'facebook',
  country TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'es',
  landing_page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar dados de landing pages
CREATE TABLE IF NOT EXISTS raw_landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  html_content TEXT,
  extracted_text TEXT,
  screenshot_url TEXT,
  video_urls TEXT[] DEFAULT '{}',
  links TEXT[] DEFAULT '{}',
  ctas TEXT[] DEFAULT '{}',
  ad_id UUID REFERENCES raw_ads(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para players (anunciantes/domínios)
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT UNIQUE NOT NULL,
  main_domain TEXT NOT NULL,
  country TEXT NOT NULL,
  dominance_score DECIMAL(5, 2) DEFAULT 0,
  total_ads INTEGER DEFAULT 0,
  total_offers INTEGER DEFAULT 0,
  days_running INTEGER DEFAULT 0,
  estimated_impressions BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para ofertas processadas
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  ad_id UUID REFERENCES raw_ads(id) ON DELETE SET NULL,
  landing_page_id UUID REFERENCES raw_landing_pages(id) ON DELETE SET NULL,
  niche_principal TEXT NOT NULL,
  sub_nicho TEXT,
  sub_sub_nicho TEXT,
  dr_score INTEGER CHECK (dr_score >= 0 AND dr_score <= 100),
  price_usd DECIMAL(10, 2),
  bonuses TEXT[] DEFAULT '{}',
  guarantee_days INTEGER,
  mental_triggers TEXT[] DEFAULT '{}',
  social_proof_type TEXT,
  social_proof_count INTEGER,
  country TEXT NOT NULL,
  platform TEXT NOT NULL,
  landing_page_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para favoritos dos usuários
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, offer_id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_raw_ads_country ON raw_ads(country);
CREATE INDEX IF NOT EXISTS idx_raw_ads_platform ON raw_ads(platform);
CREATE INDEX IF NOT EXISTS idx_raw_ads_created_at ON raw_ads(created_at);
CREATE INDEX IF NOT EXISTS idx_offers_player_id ON offers(player_id);
CREATE INDEX IF NOT EXISTS idx_offers_niche_principal ON offers(niche_principal);
CREATE INDEX IF NOT EXISTS idx_offers_country ON offers(country);
CREATE INDEX IF NOT EXISTS idx_offers_dr_score ON offers(dr_score);
CREATE INDEX IF NOT EXISTS idx_offers_price_usd ON offers(price_usd);
CREATE INDEX IF NOT EXISTS idx_offers_is_active ON offers(is_active);
CREATE INDEX IF NOT EXISTS idx_players_dominance_score ON players(dominance_score);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_raw_ads_updated_at BEFORE UPDATE ON raw_ads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_raw_landing_pages_updated_at BEFORE UPDATE ON raw_landing_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Permitir leitura pública, escrita apenas autenticada
ALTER TABLE raw_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para raw_ads
CREATE POLICY "Permitir leitura pública de raw_ads" ON raw_ads
  FOR SELECT USING (true);

CREATE POLICY "Permitir escrita autenticada em raw_ads" ON raw_ads
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas RLS para raw_landing_pages
CREATE POLICY "Permitir leitura pública de raw_landing_pages" ON raw_landing_pages
  FOR SELECT USING (true);

CREATE POLICY "Permitir escrita autenticada em raw_landing_pages" ON raw_landing_pages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas RLS para players
CREATE POLICY "Permitir leitura pública de players" ON players
  FOR SELECT USING (true);

CREATE POLICY "Permitir escrita autenticada em players" ON players
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas RLS para offers
CREATE POLICY "Permitir leitura pública de offers" ON offers
  FOR SELECT USING (true);

CREATE POLICY "Permitir escrita autenticada em offers" ON offers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas RLS para user_favorites
CREATE POLICY "Usuários podem ver seus próprios favoritos" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios favoritos" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios favoritos" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);



