# Análise do Projeto - AdLib Monitor

## Arquivos-Chave Identificados

### 1. Serviço de IA (`services/geminiService.ts`)
**Localização:** `services/geminiService.ts`

**Funções principais:**
- `analyzeLibraryUrl(url: string)` → `UrlAnalysisResult`
  - Usado em: `AddLibraryModal.tsx` (linha 51)
  - Retorna: brandName, niche, estimatedAdsCount, landingPageUrl, summary, trafficEstimate
  - Usa Google Search via Gemini API

- `getTrafficAnalytics(brandName: string, url: string)` → `TrafficStats`
  - Usado em: `TrafficAnalyticsModal.tsx` (linha 25)
  - Retorna: totalVisits, bounceRate, avgDuration, pagesPerVisit, history[]
  - Usa Google Search para dados de Similarweb/Semrush

- `analyzeMarketTrends(topic: string, country: string)` → `MarketTrendReport`
  - Usado em: `MarketResearch.tsx` (linhas 38, 65)
  - Retorna: topic, nicheScore, nicheVerdict, keywordAnalysis[], trendingKeywords[], commonQuestions[], risingRelatedTopics[], productOpportunities[]
  - Usa Gemini 3 Pro com thinking config

- `getCountryTrends(country: string)` → `{topic: string, category: string}[]`
  - Usado em: `MarketResearch.tsx` (linha 46)
  - Retorna array de trending topics por país

- `suggestNiches(entries: {brandName, notes}[])` → `string[]`
  - Usado em: `App.tsx` (linha 141)
  - Retorna sugestões de nichos baseadas em entradas existentes

### 2. Tipos (`types.ts`)
**Localização:** `types.ts`

**Interfaces principais:**
- `LibraryEntry`: id, url, brandName, activeAdsCount, landingPageUrl, niche, status, notes, createdAt, lastChecked, isFavorite, boardIds, trafficEstimate
- `NicheOption`: id, label, color
- `Board`: id, name, type ('system' | 'custom')
- `KanbanTask`: id, content, status ('todo' | 'doing' | 'done'), createdAt
- `TrafficStats`: totalVisits, bounceRate, avgDuration, pagesPerVisit, history[]

### 3. Componentes que consomem IA
- **AddLibraryModal.tsx**: `analyzeLibraryUrl` (linha 3, 51)
- **TrafficAnalyticsModal.tsx**: `getTrafficAnalytics` (linhas 4, 25)
- **MarketResearch.tsx**: `analyzeMarketTrends`, `getCountryTrends` (linha 3, 38, 46, 65)
- **App.tsx**: `suggestNiches` (linha 17, 141)

### 4. Armazenamento Atual
- **localStorage** para:
  - `adlib_entries` → LibraryEntry[]
  - `adlib_niches` → NicheOption[]
  - `adlib_boards` → Board[]
  - `adlib_tasks` → KanbanTask[]

## Arquitetura Proposta

### Backend (Supabase)
1. **Migrations SQL**: Tabelas com RLS habilitado
2. **Edge Functions**: 3 functions principais + 1 cron
3. **Auth**: Supabase Auth para autenticação
4. **RLS Policies**: Owner-based (auth.uid() = user_id)

### Frontend
1. Substituir `geminiService.ts` por client API que chama Edge Functions
2. Manter assinaturas de retorno idênticas
3. Usar Supabase Auth para obter access_token
4. Migrar localStorage → Supabase DB (com fallback opcional)

### Edge Functions Mapping
- `analyze-url` ← `analyzeLibraryUrl`
- `analyze-traffic` ← `getTrafficAnalytics`
- `research-market` ← `analyzeMarketTrends`
- `research-market` (cache) ← `getCountryTrends` (pode ser implementado no mesmo endpoint)




