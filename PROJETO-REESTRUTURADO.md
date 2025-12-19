# 🎯 LATAM DR INTEL - Reestruturação Completa

## OBJETIVO CLARO

**Ferramenta de SPY para encontrar anúncios escalados de tráfego direto na LATAM**

Foco: Coletar, filtrar e visualizar anúncios da Meta Ads Library de forma simples e eficiente.

---

## FUNCIONALIDADES CORE

### 1. Coleta de Anúncios
- Buscar anúncios da Meta Ads Library
- Filtros básicos: país, palavras-chave, data
- Salvar tudo no banco

### 2. Visualização (Tipo Adminer)
- Tabela completa com todos os anúncios
- Filtros avançados:
  - País
  - Plataforma (Facebook/Instagram)
  - Período (data de início)
  - Palavras-chave no copy
  - Impressões (range)
  - Gasto (range)
  - Nome da página
- Ordenação por qualquer coluna
- Paginação
- Exportar dados

### 3. Detalhes do Anúncio
- Ver copy completo
- Ver snapshot
- Ver landing page (se disponível)
- Ver estatísticas (impressões, gasto, etc.)

### 4. Processamento Básico (Opcional)
- Agrupar por domínio/página
- Calcular métricas simples
- Identificar padrões

---

## ESTRUTURA DO BANCO DE DADOS (SIMPLIFICADA)

### Tabela: `ads`
Armazena TODOS os dados dos anúncios coletados

```sql
- id (UUID, PK)
- ad_id (TEXT, UNIQUE) - ID do anúncio na Meta
- page_id (TEXT)
- page_name (TEXT)
- ad_creative_body (TEXT) - Copy do anúncio
- ad_creative_link_title (TEXT)
- ad_creative_link_description (TEXT)
- ad_snapshot_url (TEXT)
- landing_page_url (TEXT)
- platform (TEXT) - 'facebook' ou 'instagram'
- country (TEXT) - Código do país (AR, MX, CO, etc.)
- impressions_lower (BIGINT)
- impressions_upper (BIGINT)
- spend_lower (DECIMAL)
- spend_upper (DECIMAL)
- ad_delivery_start_time (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Índices:**
- `ad_id` (único)
- `country`
- `platform`
- `page_name`
- `ad_delivery_start_time`
- `created_at`

---

## ESTRUTURA DO PROJETO

```
/app
  /api
    /ads
      /collect/route.ts      # Coletar anúncios da Meta
      /list/route.ts          # Listar anúncios (com filtros)
  /explorar
    page.tsx                  # Página principal (tabela de anúncios)
  layout.tsx
  page.tsx                    # Redireciona para /explorar

/components
  /ads
    AdsTable.tsx              # Tabela principal de anúncios
    AdFilters.tsx             # Componente de filtros
    AdDetails.tsx             # Modal com detalhes do anúncio
  /layout
    Sidebar.tsx
    Header.tsx

/lib
  /supabase
    client.ts
    admin.ts
    migrations.sql            # Schema limpo e simples
  /meta
    ads-api.ts                # Funções para API da Meta

/types
  ad.ts                       # Tipos TypeScript
```

---

## FLUXO DE USO

1. **Coletar Anúncios**
   - Admin acessa interface ou API
   - Define: país, palavras-chave
   - Sistema busca na Meta e salva no banco

2. **Visualizar Anúncios**
   - Abre página /explorar
   - Vê tabela com todos os anúncios
   - Aplica filtros
   - Ordena por coluna
   - Clica em anúncio para ver detalhes

3. **Analisar**
   - Filtra por impressões altas
   - Identifica anúncios escalados
   - Exporta dados para análise

---

## PRÓXIMOS PASSOS

1. ✅ Limpar banco de dados (nova estrutura simples)
2. ✅ Criar API de coleta (simples e funcional)
3. ✅ Criar interface de visualização (tabela tipo Adminer)
4. ✅ Sistema de filtros completo
5. ✅ Detalhes do anúncio



