# Configurar GEMINI_API_KEY no Supabase

## ✅ Sua Chave de API Gemini Capturada

**Chave:** `AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8`

## 📋 Como Configurar no Supabase

Você tem duas opções:

### Opção 1: Via Dashboard (Recomendado - Mais Fácil)

1. Acesse: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi
2. Vá em: **Project Settings** (ícone de engrenagem no canto inferior esquerdo)
3. No menu lateral, clique em: **Edge Functions**
4. Role até a seção: **Secrets**
5. Clique em: **Add a new secret**
6. Preencha:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8`
7. Clique em: **Save**

### Opção 2: Via CLI

```bash
# Se ainda não tiver o Supabase CLI instalado:
npm install -g supabase

# Login no Supabase
supabase login

# Link do projeto (se ainda não linkou)
supabase link --project-ref acnbcideqohtjidtlrvi

# Configurar o secret
supabase secrets set GEMINI_API_KEY=AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8
```

## ✅ Verificar se Funcionou

Após configurar, você pode verificar:

1. No Dashboard: As secrets aparecem listadas em **Project Settings > Edge Functions > Secrets**
2. Via CLI: Execute `supabase secrets list`

## 🚀 Próximo Passo

Após configurar o secret, você pode fazer o deploy das Edge Functions:

```bash
supabase functions deploy analyze-url
supabase functions deploy analyze-traffic
supabase functions deploy research-market
supabase functions deploy cron-refresh-libraries
```

---

**Nota de Segurança:** ⚠️ Esta chave está salva localmente apenas para referência. Ela será armazenada de forma segura no Supabase como secret e nunca será exposta ao frontend.




