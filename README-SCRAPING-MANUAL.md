# 🕷️ Sistema de Scraping Manual - Facebook Ads Library

Sistema completo de scraping da Facebook Ads Library usando Playwright, sem depender da API da Meta.

## 📋 Estrutura do Projeto

```
src/
├── config/           # Configurações (Supabase, headless, etc.)
├── scrapers/         # Scrapers Playwright
│   ├── adLibrarySearch.ts    # Busca por keyword
│   └── adLibraryPage.ts      # Scraping completo de uma página
├── services/         # Lógica de negócio
│   ├── aggregation.ts        # Agregação de hits por página
│   └── offerRule.ts          # Regra de oferta válida
├── db/               # Banco de dados
│   ├── schema.sql            # Schema do Supabase
│   ├── supabaseClient.ts     # Cliente Supabase
│   └── repositories/         # Repositórios de dados
│       ├── pages.ts
│       ├── ads.ts
│       └── searchHits.ts
└── cli/              # CLI principal
    └── runKeywords.ts
```

## 🚀 Instalação

### 1. Instalar dependências

```bash
npm install
# ou
pnpm install
```

### 2. Instalar Playwright Chromium

```bash
npm run scrape:install
# ou
npx playwright install chromium
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
ADLIB_SCRAPER_HEADLESS=true  # false para ver o navegador
DEFAULT_COUNTRY=BR
```

### 4. Criar tabelas no Supabase

Execute o arquivo `src/db/schema.sql` no SQL Editor do Supabase.

## 📝 Como Usar

### Opção 1: Via arquivo JSON

Crie um arquivo `keywords.json`:

```json
{
  "keywords": [
    "infoproduto",
    "marketing digital",
    "curso online"
  ],
  "country": "BR"
}
```

Execute:

```bash
npm run scrape:keywords -- --file keywords.json
```

### Opção 2: Via argumentos da linha de comando

```bash
npm run scrape:keywords -- --keywords "infoproduto,marketing digital,curso online" --country BR
```

## 🔄 Fluxo de Execução

1. **FASE 1: Busca por Keywords**
   - Para cada keyword, faz scraping da Ads Library
   - Coleta `pageId`, `pageName`, `adId` de cada anúncio encontrado
   - Salva resultados em `page_search_hits`

2. **FASE 2: Agregação**
   - Agrupa hits por `pageId` + `country`
   - Calcula `hitsFromSearch` (total de anúncios encontrados)
   - Salva/atualiza em `pages`

3. **FASE 3: Filtro de Candidatos**
   - Filtra páginas com `hitsFromSearch >= 10`

4. **FASE 4: Scraping Completo**
   - Para cada página candidata:
     - Abre `view_all_page_id` na Ads Library
     - Faz scroll infinito para carregar todos os anúncios
     - Extrai: `adId`, `text`, `headline`, `cta`, `mediaType`, `mediaUrls`, `destinationUrls`, `startedRunningOn`
     - Calcula `startedRunningDaysAgo`
     - Salva anúncios em `ads`
     - Avalia regra de oferta válida

5. **FASE 5: Regra de Oferta Válida**
   - `totalActiveAds >= 10`
   - E existe pelo menos 1 anúncio com `startedRunningDaysAgo >= 7`
   - Atualiza `has_offer_by_rule` em `pages`

6. **FASE 6: Resumo**
   - Exibe tabela no console com páginas que passaram na regra
   - Salva JSON em `output/latest_pages_with_offers.json`

## 📊 Schema do Banco

### Tabela `pages`
- `page_id` (unique)
- `page_name`
- `country`
- `estimated_active_ads_from_search`
- `total_active_ads`
- `has_ad_older_than_7_days`
- `has_offer_by_rule`
- `first_seen_at`, `last_seen_at`, `last_audit_at`

### Tabela `page_search_hits`
- `keyword`
- `country`
- `page_id`
- `page_name`
- `ads_count_for_keyword`
- `scraped_at`

### Tabela `ads`
- `page_id`
- `ad_id`
- `text`, `headline`, `cta`
- `media_type` (image | video | carousel | unknown)
- `media_urls` (JSONB)
- `destination_urls` (JSONB)
- `started_running_on`
- `started_running_days_ago`
- `scraped_at`

## ⚙️ Configurações

### Modo Headless

Por padrão, o scraper roda em modo headless (sem interface gráfica). Para ver o navegador:

```env
ADLIB_SCRAPER_HEADLESS=false
```

### Delays

O scraper inclui delays automáticos:
- 2 segundos entre scrolls
- 2 segundos entre keywords
- 3 segundos entre páginas

Isso evita sobrecarregar a Ads Library.

## 🐛 Troubleshooting

### Erro: "Playwright não encontrado"

Execute:
```bash
npm run scrape:install
```

### Erro: "SUPABASE_URL não configurado"

Verifique se o arquivo `.env.local` existe e tem as variáveis corretas.

### Erro: "Tabela não existe"

Execute `src/db/schema.sql` no SQL Editor do Supabase.

### Nenhum anúncio encontrado

- Verifique se as keywords estão corretas
- Tente com `headless=false` para ver o que está acontecendo
- A Ads Library pode ter mudado o layout (ajuste os seletores em `adLibrarySearch.ts` e `adLibraryPage.ts`)

## 📝 Notas Importantes

- **Máximo de 20 keywords** por execução
- O scraping pode demorar bastante (vários minutos) dependendo do número de keywords e páginas
- Os seletores CSS podem precisar de ajustes se o Facebook mudar o layout
- Use com moderação para não sobrecarregar a Ads Library

## 🔧 Ajustando Seletores

Se o Facebook mudar o layout, você precisará ajustar os seletores em:

- `src/scrapers/adLibrarySearch.ts` (linha ~56)
- `src/scrapers/adLibraryPage.ts` (linha ~77)

Use o modo `headless=false` para inspecionar o DOM e ajustar os seletores.

