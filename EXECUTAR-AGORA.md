# 🚀 EXECUTAR AGORA - Tudo Pronto!

## ✅ Status: CLI Instalado com Sucesso!

O Supabase CLI foi instalado via Scoop. Agora você pode fazer o deploy!

## 📋 Execute na Ordem:

### 1. ✅ Executar Migration SQL (JÁ DEVERIA TER FEITO)
Se ainda não fez, execute:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\aplicar-migration.ps1
```
Ou manualmente:
- Abra: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/sql/new
- Copie conteúdo de `supabase/migrations/001_initial_schema.sql`
- Cole e execute

### 2. ✅ Configurar GEMINI_API_KEY (JÁ DEVERIA TER FEITO)
Se ainda não fez, execute:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\configurar-secrets.ps1
```
Ou manualmente no dashboard.

### 3. 🚀 FAZER DEPLOY DAS FUNCTIONS (AGORA!)

Execute o script automatizado:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-functions.ps1
```

**OU execute manualmente:**
```powershell
# Login (abrirá navegador)
supabase login

# Link do projeto
supabase link --project-ref acnbcideqohtjidtlrvi

# Configurar secret
supabase secrets set GEMINI_API_KEY=AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8

# Deploy das functions
supabase functions deploy analyze-url
supabase functions deploy analyze-traffic
supabase functions deploy research-market
supabase functions deploy cron-refresh-libraries
```

### 4. ✅ TESTAR

```powershell
npm run dev
```

Acesse: http://localhost:3000

## 🎯 Comando Rápido (TUDO EM UM):

```powershell
# Execute este comando para fazer deploy:
powershell -ExecutionPolicy Bypass -File scripts\deploy-functions.ps1
```

---

## ✅ Checklist Final:

- [ ] Migration SQL executada
- [ ] GEMINI_API_KEY configurado
- [ ] Login feito no Supabase CLI
- [ ] Projeto linkado
- [ ] 4 Edge Functions deployadas
- [ ] App testado localmente

---

**Tudo pronto para executar!** 🎉




