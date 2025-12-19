-- Criar bucket para screenshots de landing pages
INSERT INTO storage.buckets (id, name, public)
VALUES ('landing-pages', 'landing-pages', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload público (ou ajustar conforme necessário)
CREATE POLICY "Permitir upload público de screenshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'landing-pages');

CREATE POLICY "Permitir leitura pública de screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'landing-pages');



