# 🚀 RESUMO - Deploy das Edge Functions

## ✅ Status Atual

- ✅ Supabase CLI instalado (v2.67.1)
- ✅ Edge Functions criadas (4 functions)
- ✅ Scripts preparados
- ⏳ **Falta:** Fazer login e deploy manual

## 🎯 COMANDO ÚNICO PARA EXECUTAR:

Abra o PowerShell e execute:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-manual.ps1
```

Ou copie os comandos de `COMANDOS-DEPLOY.txt`

---

## 📋 Passos Manuais (se preferir):

### 1. Login
```powershell
supabase login
```
👉 Isso abrirá seu navegador para autenticação

### 2. Linkar Projeto
```powershell
supabase link --project-ref acnbcideqohtjidtlrvi
```

### 3. Configurar Secret
```powershell
supabase secrets set GEMINI_API_KEY=AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8
```

### 4. Deploy das Functions
```powershell
supabase functions deploy analyze-url
supabase functions deploy analyze-traffic
supabase functions deploy research-market
supabase functions deploy cron-refresh-libraries
```

---

## ✅ Após o Deploy:

1. **Verifique no dashboard:**
   https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/functions

2. **Teste no app:**
   - Recarregue a página (Ctrl + Shift + R)
   - Clique em "Add Library"
   - Cole uma URL de Ad Library
   - Clique em "Analyze Traffic"
   - Deve preencher os campos automaticamente! 🎉

---

## 📁 Arquivos Criados:

- ✅ `scripts/deploy-manual.ps1` - Script interativo
- ✅ `COMANDOS-DEPLOY.txt` - Comandos para copiar/colar
- ✅ `DEPLOY-AGORA.md` - Guia completo

---

**Pronto para deploy! Execute os comandos acima.** 🚀




