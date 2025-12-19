# 🚀 FAZER DEPLOY AGORA - Comandos Exatos

## ✅ Opção 1: Script Interativo (Recomendado)

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-manual.ps1
```

Este script irá:
1. Abrir navegador para login
2. Linkar projeto automaticamente
3. Configurar GEMINI_API_KEY
4. Fazer deploy de todas as functions

---

## ✅ Opção 2: Comandos Manuais (Copie e Cole)

Abra o PowerShell e execute **UM POR VEZ**:

### 1. Login (abrirá navegador)
```powershell
supabase login
```
**Ação:** Faça login no navegador que abrir, depois volte ao PowerShell

### 2. Linkar Projeto
```powershell
supabase link --project-ref acnbcideqohtjidtlrvi
```

### 3. Configurar Secret
```powershell
supabase secrets set GEMINI_API_KEY=AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8
```

### 4. Deploy das Functions (uma por vez)
```powershell
supabase functions deploy analyze-url
supabase functions deploy analyze-traffic
supabase functions deploy research-market
supabase functions deploy cron-refresh-libraries
```

---

## ✅ Opção 3: Deploy Via Dashboard (Alternativa)

Se os comandos CLI não funcionarem:

1. **Acesse:** https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/functions
2. **Faça upload manual** dos arquivos de cada function
3. **Configure o secret** em Settings → Edge Functions → Secrets

---

## 🎯 Recomendação

**Use a Opção 1 (script interativo)** - É a mais fácil!

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-manual.ps1
```

---

## ✅ Verificar se Funcionou

Após o deploy, verifique:

1. **Dashboard:** https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/functions
   - Deve mostrar as 4 functions listadas

2. **Teste no app:**
   - Recarregue a página
   - Clique em "Add Library"
   - Cole uma URL e clique em "Analyze Traffic"
   - Deve funcionar e preencher os campos!

---

## 📝 Notas

- O login pode pedir autenticação no navegador
- O deploy pode levar alguns minutos
- Se alguma function falhar, tente novamente apenas essa function




