# Próximos Passos - Configuração Supabase

## ✅ 1. Variáveis de Ambiente Configuradas

O arquivo `.env.local` já foi criado com suas credenciais do Supabase!

## 🔧 2. Aplicar Migration SQL

Agora você precisa criar as tabelas no banco de dados:

1. Acesse: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi
2. Vá em: **SQL Editor** (no menu lateral)
3. Clique em: **New Query**
4. Copie todo o conteúdo do arquivo: `supabase/migrations/001_initial_schema.sql`
5. Cole no editor SQL
6. Clique em: **Run** (ou pressione Ctrl+Enter)

Isso criará todas as tabelas necessárias com RLS habilitado.

## 🔐 3. Configurar GEMINI_API_KEY (Secret)

1. No dashboard do Supabase, vá em: **Project Settings** (ícone de engrenagem)
2. No menu lateral, clique em: **Edge Functions**
3. Role até: **Secrets**
4. Clique em: **Add a new secret**
5. Adicione:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: sua chave da API do Gemini
6. Clique em: **Save**

## 🚀 4. Deploy das Edge Functions

Abra o terminal e execute:

```bash
# Se ainda não tiver o Supabase CLI instalado:
npm install -g supabase

# Login no Supabase
supabase login

# Link do projeto (use o project-ref: acnbcideqohtjidtlrvi)
supabase link --project-ref acnbcideqohtjidtlrvi

# Deploy de todas as functions
supabase functions deploy analyze-url
supabase functions deploy analyze-traffic
supabase functions deploy research-market
supabase functions deploy cron-refresh-libraries
```

**Nota:** Se o deploy pedir confirmação, use `--no-verify-jwt` (as functions já verificam JWT internamente).

## ✅ 5. Verificar se Funcionou

Após o deploy, você pode testar:

1. **Verificar Functions**: No dashboard, vá em **Edge Functions** e veja se as 4 functions aparecem
2. **Testar Frontend**: Execute `npm run dev` e verifique se o app carrega sem erros

## 🎯 6. (Opcional) Configurar Cron Job

Se quiser que o app atualize automaticamente as libraries semanalmente:

1. No SQL Editor, execute:

```sql
-- Habilitar extensão pg_cron (se disponível)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Criar job semanal (toda segunda-feira às 9:00 UTC)
SELECT cron.schedule(
  'refresh-libraries-weekly',
  '0 9 * * 1',
  $$
  SELECT
    net.http_post(
      url:='https://acnbcideqohtjidtlrvi.supabase.co/functions/v1/cron-refresh-libraries',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
    ) AS request_id;
  $$
);
```

**Nota:** Se pg_cron não estiver disponível no seu plano, você pode usar um serviço externo (como cron-job.org) para chamar a function periodicamente.

## 🧪 7. Testar Localmente

```bash
# Rodar o app
npm run dev
```

O app estará disponível em: http://localhost:3000

## ⚠️ Importante

- **Autenticação**: O app precisa de um usuário autenticado para funcionar. Você precisará implementar uma tela de login/signup ou usar o Supabase Auth UI.
- **localStorage**: Por enquanto, o app ainda usa localStorage. A migração completa para Supabase DB será o próximo passo após a autenticação estar funcionando.

---

## 📚 Referência

- **DEPLOY-CHECKLIST.md** - Guia completo de deploy
- **SETUP-RAPIDO.md** - Setup rápido
- **Supabase Dashboard**: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi




