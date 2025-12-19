# 🔍 Verificar GEMINI_API_KEY

## ⚠️ IMPORTANTE: Verificar se o Secret está Configurado

O erro 500 pode ser porque o `GEMINI_API_KEY` não está configurado corretamente.

## 🔧 Como Verificar e Corrigir:

### 1. Verificar se o Secret Existe

1. Acesse: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/settings/functions
2. Role até a seção **"Secrets"**
3. Verifique se existe um secret chamado: `GEMINI_API_KEY`

### 2. Se NÃO existir, adicione:

1. Clique em **"Add a new secret"**
2. **Name:** `GEMINI_API_KEY`
3. **Value:** `AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8`
4. Clique em **"Save"**

### 3. Se já existir, verifique:

- O nome está exatamente: `GEMINI_API_KEY` (sem espaços, case-sensitive)
- O valor está correto: `AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8`

## 🔄 Após Configurar/Verificar:

1. **Aguarde 1-2 minutos** para o secret ser propagado
2. **Teste novamente** o botão "Analyze Traffic"
3. **Se ainda der erro**, verifique os logs:
   - https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/logs/edge-functions

## 📋 Checklist:

- [ ] Secret `GEMINI_API_KEY` existe no dashboard
- [ ] Valor do secret está correto
- [ ] Aguardou 1-2 minutos após configurar
- [ ] Function foi re-deployada (já feito)
- [ ] Testou novamente no app




