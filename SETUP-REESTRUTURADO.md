# 🚀 Setup da Versão Reestruturada

## O que mudou

✅ **Estrutura simplificada:**
- Apenas 1 tabela: `ads` (tudo em um lugar)
- APIs limpas: `/api/ads/collect` e `/api/ads/list`
- Interface tipo Adminer: tabela completa com filtros avançados

✅ **Removido:**
- Autenticação (uso interno)
- Tabelas complexas (players, offers, etc.)
- Processamento com IA (por enquanto)
- Scraping de landing pages (por enquanto)

## Passo 1: Atualizar Banco de Dados

### Opção A: Limpar e Recriar (Recomendado)

1. Acesse: https://supabase.com/dashboard/project/xwsqbgjflzoimpmcqtso
2. Vá em **SQL Editor**
3. Execute para limpar (CUIDADO - apaga tudo):

```sql
-- Apagar tabelas antigas (se existirem)
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS raw_landing_pages CASCADE;
DROP TABLE IF EXISTS raw_ads CASCADE;
```

4. Execute o novo schema:

```sql
-- Copie e cole TODO o conteúdo de lib/supabase/schema.sql
```

### Opção B: Manter e Adicionar Nova Tabela

Se quiser manter os dados antigos, apenas execute o `schema.sql` - ele cria a tabela `ads` sem conflitos.

## Passo 2: Testar Coleta

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect" -Method POST -ContentType "application/json" -Body '{"country": "AR", "keywords": "infoproduto"}'
```

## Passo 3: Ver Resultados

Acesse: http://localhost:3000/explorar

Você verá:
- Tabela completa com todos os anúncios
- Filtros avançados (país, plataforma, impressões, gasto, etc.)
- Ordenação por qualquer coluna
- Paginação
- Detalhes do anúncio ao clicar

## Estrutura Final

```
/app
  /api/ads
    /collect/route.ts    # Coletar anúncios
    /list/route.ts        # Listar com filtros
  /explorar
    page.tsx              # Interface principal

/components/ads
  AdsTable.tsx            # Tabela principal
  AdFilters.tsx           # Componente de filtros
  AdDetails.tsx           # Modal de detalhes

/lib/supabase
  schema.sql              # Schema limpo (1 tabela)
```

## Próximos Passos (Opcional)

Depois que estiver funcionando, podemos adicionar:
- Agrupamento por página/domínio
- Métricas consolidadas
- Exportação de dados
- Processamento com IA (opcional)



