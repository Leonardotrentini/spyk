# 🔄 Migração: Filtro de Mínimo de Anúncios por Página

## ⚠️ IMPORTANTE: Atualizar Banco de Dados

Foi adicionada uma função SQL para otimizar o filtro. Execute no SQL Editor do Supabase:

---

## 📝 SQL para Executar

```sql
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
```

---

## ✅ Como Funciona

1. **A função SQL** agrupa anúncios por `page_id`
2. **Conta quantos anúncios** cada página tem
3. **Retorna apenas** `page_ids` que têm >= `min_ads` anúncios
4. **A API filtra** os anúncios para mostrar só dessas páginas

---

## 🎯 Uso na Interface

1. Acesse: http://localhost:3000/explorar
2. Nos filtros, encontre **"Mín. Anúncios por Página"**
3. Digite um número (ex: 5, 10, 20)
4. Clique em **"Aplicar Filtros"**
5. A tabela mostrará **só anúncios de páginas com X+ anúncios**

---

## 📊 Exemplos

- **Mín. 5 anúncios** = Páginas que estão testando/escalando
- **Mín. 10 anúncios** = Páginas fortemente escaladas
- **Mín. 20 anúncios** = Páginas muito escaladas

---

## ⚡ Nota

Se a função SQL não existir, o sistema usa uma abordagem alternativa (mais lenta, mas funciona).

**Execute o SQL acima para melhor performance!**



