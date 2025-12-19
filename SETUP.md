# Guia de Configuração - LATAM DR INTEL

## 1. Instalação de Dependências

```bash
npm install
```

## 2. Configuração do Supabase

### 2.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL do projeto e as chaves (anon key e service role key)

### 2.2 Executar Migrações

1. No painel do Supabase, vá em **SQL Editor**
2. Execute o conteúdo do arquivo `lib/supabase/migrations.sql`
3. Execute também o conteúdo do arquivo `lib/supabase/storage-setup.sql` para configurar o bucket de screenshots

### 2.3 Configurar Storage

1. No painel do Supabase, vá em **Storage**
2. Crie um bucket chamado `landing-pages` (se não foi criado pelo SQL)
3. Configure como público se necessário

## 3. Configuração de Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto
2. Copie o conteúdo de `.env.example` e preencha com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
META_ADS_LIBRARY_ACCESS_TOKEN=seu_token_meta
ANTHROPIC_API_KEY=sua_chave_anthropic
```

## 4. Obter Token da Meta Ads Library

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie um app do tipo "Business"
3. Gere um Access Token com permissões para `ads_read`
4. Use este token na variável `META_ADS_LIBRARY_ACCESS_TOKEN`

## 5. Obter Chave da API de IA

### Opção 1: Anthropic Claude
1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Crie uma conta e gere uma API key
3. Use na variável `ANTHROPIC_API_KEY`

### Opção 2: OpenAI GPT
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma conta e gere uma API key
3. Use na variável `OPENAI_API_KEY`

## 6. Executar o Projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 7. Primeiro Uso

1. Crie uma conta na página de login
2. Verifique seu email (se necessário)
3. Faça login
4. Acesse a página "Explorar"

## 8. Coletar Dados Iniciais

### Coletar Anúncios da Meta

Faça uma requisição POST para `/api/meta-ads`:

```bash
curl -X POST http://localhost:3000/api/meta-ads \
  -H "Content-Type: application/json" \
  -d '{
    "country": "AR",
    "keywords": "infoproduto"
  }'
```

### Fazer Scraping de Landing Pages

Para cada anúncio coletado, você pode fazer scraping da landing page:

```bash
curl -X POST http://localhost:3000/api/landing-pages/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://exemplo.com/landing-page",
    "adId": "uuid-do-anuncio"
  }'
```

### Processar com IA

Após coletar anúncios e landing pages, processe com IA:

```bash
curl -X POST http://localhost:3000/api/process/ai \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "uuid-do-anuncio",
    "landingPageId": "uuid-da-landing-page"
  }'
```

## Notas Importantes

- **Free Tiers**: O projeto foi otimizado para usar os tiers gratuitos do Vercel e Supabase
- **Rate Limits**: A Meta Ads Library API tem limites de requisições. Monitore o uso
- **Custos de IA**: Cada processamento consome tokens da API. Monitore os custos
- **Puppeteer**: O scraping de landing pages requer Puppeteer, que pode ser pesado. Considere usar um serviço externo em produção

## Próximos Passos

- Implementar processamento em lote
- Adicionar mais fontes de dados (Google Ads, TikTok)
- Melhorar a interface de filtros
- Adicionar visualizações no Dashboard
- Implementar notificações de novas ofertas



