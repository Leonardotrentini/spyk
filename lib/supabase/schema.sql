-- ============================================
-- LATAM DR INTEL - Schema Simplificado
-- Ferramenta de SPY de Anúncios Escalados
-- ============================================

-- Tabela principal: Anúncios coletados da Meta Ads Library
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- IDs e identificação
  ad_id TEXT UNIQUE NOT NULL,
  page_id TEXT,
  page_name TEXT,
  
  -- Conteúdo do anúncio
  ad_creative_body TEXT,
  ad_creative_link_title TEXT,
  ad_creative_link_description TEXT,
  ad_snapshot_url TEXT,
  landing_page_url TEXT,
  
  -- Metadados
  platform TEXT NOT NULL DEFAULT 'facebook', -- 'facebook' ou 'instagram'
  country TEXT NOT NULL, -- Código do país (AR, MX, CO, BR, CL, etc.)
  language TEXT DEFAULT 'es',
  funding_entity TEXT,
  
  -- Métricas
  impressions_lower BIGINT,
  impressions_upper BIGINT,
  spend_lower DECIMAL(10, 2),
  spend_upper DECIMAL(10, 2),
  
  -- Classificação
  niche TEXT, -- Nicho identificado (financas, saude, relacionamento, etc.)
  
  -- Datas
  ad_delivery_start_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance nas buscas e filtros
CREATE INDEX IF NOT EXISTS idx_ads_country ON ads(country);
CREATE INDEX IF NOT EXISTS idx_ads_platform ON ads(platform);
CREATE INDEX IF NOT EXISTS idx_ads_page_name ON ads(page_name);
CREATE INDEX IF NOT EXISTS idx_ads_delivery_start ON ads(ad_delivery_start_time);
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON ads(created_at);
CREATE INDEX IF NOT EXISTS idx_ads_impressions_lower ON ads(impressions_lower);
CREATE INDEX IF NOT EXISTS idx_ads_spend_lower ON ads(spend_lower);
CREATE INDEX IF NOT EXISTS idx_ads_niche ON ads(niche);

-- Índice para busca de texto (copy do anúncio)
CREATE INDEX IF NOT EXISTS idx_ads_creative_body ON ads USING gin(to_tsvector('spanish', ad_creative_body));

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_ads_updated_at 
  BEFORE UPDATE ON ads
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Permitir tudo (uso interno)
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo em ads" ON ads
  FOR ALL USING (true);

-- Função para buscar páginas com mínimo de anúncios
CREATE OR REPLACE FUNCTION get_pages_with_min_ads(min_ads INTEGER)
RETURNS TABLE(page_id TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT a.page_id
  FROM ads a
  WHERE a.page_id IS NOT NULL
  GROUP BY a.page_id
  HAVING COUNT(*) >= min_ads;
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE ads IS 'Anúncios coletados da Meta Ads Library';
COMMENT ON COLUMN ads.ad_id IS 'ID único do anúncio na Meta';
COMMENT ON COLUMN ads.impressions_lower IS 'Limite inferior de impressões';
COMMENT ON COLUMN ads.impressions_upper IS 'Limite superior de impressões';
COMMENT ON COLUMN ads.spend_lower IS 'Gasto mínimo estimado (USD)';
COMMENT ON COLUMN ads.spend_upper IS 'Gasto máximo estimado (USD)';

