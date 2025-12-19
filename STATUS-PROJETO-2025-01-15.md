# 📊 STATUS DO PROJETO - 15/01/2025

## ✅ Funcionalidades Implementadas

### 1. Sistema de Scraping Manual (Playwright)
- ✅ Scraping de keywords na Ads Library
- ✅ Extração de `pageId`, `pageName`, `adId` dos resultados de busca
- ✅ Scraping completo de páginas (`view_all_page_id`)
- ✅ Extração de dados completos dos anúncios:
  - `adId`, `text`, `headline`, `cta`
  - `mediaType`, `mediaUrls`, `destinationUrls`
  - `startedRunningOn`, `startedRunningDaysAgo`

### 2. Banco de Dados (Supabase/PostgreSQL)
- ✅ Schema completo com 3 tabelas:
  - `pages`: Informações das páginas
  - `page_search_hits`: Histórico de hits nas buscas
  - `ads`: Anúncios coletados
- ✅ Campos para análise de ofertas:
  - `has_ad_older_than_7_days`
  - `has_offer_by_rule`
  - `has_dr_terms`, `dr_terms_count`, `dr_terms_found`
- ✅ Links salvos: `library_url` nas páginas

### 3. Regras de Identificação de Ofertas
- ✅ **Regra Principal**: 
  - `totalActiveAds >= 10` 
  - `hasAdOlderThan7Days >= 7 dias`
  - `hasDrTerms = true` (termos de venda direta detectados)

### 4. Detecção de Termos DR (Direct Response)
- ✅ Lista de 50+ termos em Português e Espanhol
- ✅ Detecção em `text`, `headline`, `cta`
- ✅ Contagem e lista de termos encontrados
- ✅ Armazenamento no banco (`has_dr_terms`, `dr_terms_count`, `dr_terms_found`)

### 5. CLI (Command Line Interface)
- ✅ Script `runKeywords.ts` para executar scraping
- ✅ Comando: `npm run scrape:keywords -- --keywords "termo1,termo2" --country BR`
- ✅ Output formatado com tabela de páginas com oferta válida
- ✅ Exibe: `page_id`, `page_name`, `country`, `hits`, `ads`, `7+ dias`, `oferta`, `dr_terms`, `library_url`

### 6. Configuração
- ✅ Arquivo `.env` com variáveis:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ADLIB_SCRAPER_HEADLESS` (true/false)
  - `DEFAULT_COUNTRY` (padrão: BR)
- ✅ Carregamento automático via `dotenv`

## 🔧 Arquivos Principais

### Scrapers
- `src/scrapers/adLibrarySearch.ts` - Busca por keywords
- `src/scrapers/adLibraryPage.ts` - Scraping de página específica

### Services
- `src/services/aggregation.ts` - Agregação de hits por página
- `src/services/offerRule.ts` - Regras de validação de ofertas
- `src/services/directResponseTerms.ts` - Detecção de termos DR

### Database
- `src/db/schema.sql` - Schema do banco
- `src/db/supabaseClient.ts` - Cliente Supabase
- `src/db/repositories/pages.ts` - Operações de páginas
- `src/db/repositories/ads.ts` - Operações de anúncios

### CLI
- `src/cli/runKeywords.ts` - Script principal de execução

### Config
- `src/config/index.ts` - Carregamento de configurações

## 🐛 Problemas Conhecidos

### 1. API Key do Supabase
- **Status**: ⚠️ Verificar se `.env` tem a service role key correta
- **Última ação**: Service key foi atualizada no `.env`
- **Próximo passo**: Testar conexão novamente

### 2. Scraping de `pageId`
- **Status**: ✅ Melhorado com múltiplos seletores CSS
- **Última ação**: Adicionados padrões de URL alternativos
- **Nota**: Pode precisar ajustes se Facebook mudar DOM

## 📝 Próximos Passos

1. ✅ Testar scraping completo com keywords reais
2. ✅ Verificar se dados estão sendo salvos corretamente no Supabase
3. ✅ Validar detecção de termos DR
4. ⏳ Ajustar seletores CSS se necessário
5. ⏳ Adicionar mais termos DR conforme necessário
6. ⏳ Implementar retry logic para falhas de rede
7. ⏳ Adicionar rate limiting para evitar bloqueios

## 🎯 Comandos Úteis

```bash
# Executar scraping
npm run scrape:keywords -- --keywords "infoproduto,curso online" --country BR

# Verificar TypeScript
npx tsc --project tsconfig.cli.json --noEmit

# Instalar Playwright
npm run scrape:install
```

## 📦 Dependências Principais

- `playwright`: ^1.40.0 - Scraping
- `@supabase/supabase-js`: ^2.39.0 - Banco de dados
- `dotenv`: ^16.3.1 - Variáveis de ambiente
- `typescript`: ^5.4.0
- `ts-node`: ^10.9.2 - Executar TypeScript

## 🔐 Segurança

- ⚠️ `.env` está no `.gitignore` (não commitar chaves)
- ✅ Service role key apenas no servidor/local
- ✅ Não expor chaves em logs públicos

---

**Última atualização**: 15/01/2025
**Status geral**: 🟢 Funcional, aguardando testes finais

