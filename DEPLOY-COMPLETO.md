# 🚀 Guia Completo de Deploy - Passo a Passo

## ✅ Status Atual

- ✅ Credenciais do Supabase configuradas no `.env.local`
- ✅ Chave do Gemini capturada: `AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8`
- ✅ Código pronto para deploy

## 📋 Checklist de Deploy

### 1. ✅ Variáveis de Ambiente do Frontend
**Status:** CONCLUÍDO
- Arquivo `.env.local` criado com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### 2. ⏳ Aplicar Migration SQL
**Ação Necessária:**

1. Acesse: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/sql/new
2. Abra o arquivo: `supabase/migrations/001_initial_schema.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor
5. Clique em **Run** (ou Ctrl+Enter)

**O que isso cria:**
- 7 tabelas (niches, boards, library_entries, etc.)
- RLS habilitado
- Índices para performance
- Policies de segurança

### 3. ⏳ Configurar GEMINI_API_KEY
**Ação Necessária:**

**Via Dashboard:**
1. Acesse: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/settings/functions
2. Role até **Secrets**
3. Clique em **Add a new secret**
4. Name: `GEMINI_API_KEY`
5. Value: `AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8`
6. Salve

**Ou via CLI:**
```bash
supabase login
supabase link --project-ref acnbcideqohtjidtlrvi
supabase secrets set GEMINI_API_KEY=AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8
```

### 4. ⏳ Deploy das Edge Functions
**Ação Necessária:**

```bash
# Instalar CLI (se necessário)
npm install -g supabase

# Login
supabase login

# Link do projeto
supabase link --project-ref acnbcideqohtjidtlrvi

# Deploy individual (recomendado para ver erros)
supabase functions deploy analyze-url
supabase functions deploy analyze-traffic
supabase functions deploy research-market
supabase functions deploy cron-refresh-libraries
```

**Verificar no Dashboard:**
- Vá em: **Edge Functions** no menu lateral
- Deve aparecer as 4 functions listadas

### 5. ✅ Testar Frontend
**Status:** Pronto para testar

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🔍 Troubleshooting

### Erro: "Function not found"
→ Verifique se o deploy foi feito corretamente

### Erro: "GEMINI_API_KEY not configured"
→ Verifique se o secret foi setado em **Project Settings > Edge Functions > Secrets**

### Erro: "Unauthorized"
→ O usuário precisa estar autenticado. Você precisará implementar autenticação primeiro.

### Erro: "RLS policy violation"
→ Verifique se a migration SQL foi executada corretamente

## 📊 Verificação Final

Após completar todos os passos, verifique:

- [ ] Migration SQL executada (tabelas criadas)
- [ ] GEMINI_API_KEY configurado como secret
- [ ] 4 Edge Functions deployadas e visíveis no dashboard
- [ ] Frontend roda sem erros (`npm run dev`)
- [ ] Console do navegador não mostra erros de conexão

## 🎯 Próximos Passos Após Deploy

1. **Implementar Autenticação**: Adicionar telas de login/signup
2. **Migrar localStorage para Supabase**: Substituir armazenamento local por queries ao DB
3. **Testar Funcionalidades**: Add Library, Traffic Analytics, Market Research

---

## 📚 Referência Rápida

- **Dashboard**: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi
- **SQL Editor**: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/sql/new
- **Edge Functions**: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/functions
- **Settings/Secrets**: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/settings/functions




