# 🔍 Debug - Erro 500 na Edge Function

## ✅ Melhorias Aplicadas:

- ✅ Logs melhorados na function
- ✅ Tratamento de erros mais detalhado
- ✅ Mensagens de erro mais claras

## 🔧 Possíveis Causas do Erro 500:

### 1. GEMINI_API_KEY não configurado
**Verifique:**
- Acesse: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/settings/functions
- Veja se o secret `GEMINI_API_KEY` existe
- Se não existir, adicione-o com o valor: `AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8`

### 2. Chave do Gemini inválida ou expirada
- Verifique se a chave está correta
- Teste a chave diretamente na API do Gemini

### 3. Erro na chamada da API do Gemini
- Pode ser rate limit
- Pode ser formato de requisição incorreto

## 🚀 Próximos Passos:

### 1. Re-deploy da Function (com melhorias):
```powershell
supabase functions deploy analyze-url --project-ref acnbcideqohtjidtlrvi
```

### 2. Verificar Logs:
Acesse: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/logs/edge-functions

### 3. Testar Novamente:
Após re-deploy, teste o botão "Analyze Traffic" novamente

## 📋 Verificação Rápida:

1. ✅ GEMINI_API_KEY configurado? → Settings > Edge Functions > Secrets
2. ✅ Function deployada? → Functions > analyze-url
3. ✅ Logs mostram erro específico? → Logs > Edge Functions




