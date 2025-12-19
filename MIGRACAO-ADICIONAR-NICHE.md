# 🔄 Migração: Adicionar Campo Niche

## ⚠️ IMPORTANTE: Atualizar Banco de Dados

O campo `niche` foi adicionado ao schema. Você precisa atualizar o banco de dados.

---

## 📝 Passo a Passo

### 1. Acessar Supabase

1. Acesse: https://supabase.com/dashboard/project/xwsqbgjflzoimpmcqtso
2. Vá em **SQL Editor**

### 2. Executar Migração

Cole e execute este SQL:

```sql
-- Adicionar coluna niche se não existir
ALTER TABLE ads 
ADD COLUMN IF NOT EXISTS niche TEXT;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_ads_niche ON ads(niche);

-- Comentário para documentação
COMMENT ON COLUMN ads.niche IS 'Nicho identificado (financas, saude, relacionamento, etc.)';
```

### 3. (Opcional) Atualizar Anúncios Existentes

Se você já tem anúncios salvos e quer identificar nichos neles:

```sql
-- Isso vai identificar nichos para anúncios que ainda não têm
-- Nota: Isso precisa ser feito via API, não diretamente no SQL
-- Use o endpoint /api/ads/collect novamente ou crie um script
```

---

## ✅ Verificar

Execute este SQL para verificar:

```sql
SELECT niche, COUNT(*) as total
FROM ads
GROUP BY niche
ORDER BY total DESC;
```

Você deve ver a distribuição de nichos.

---

## 🎯 Próximos Passos

1. Execute a migração SQL acima
2. Colete novos anúncios (eles terão nicho identificado automaticamente)
3. Teste os filtros de nicho na interface

---

**Execute a migração e me avise quando terminar!**



