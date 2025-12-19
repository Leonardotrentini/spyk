# Setup Rápido - AdLib Monitor

## ⚡ Passos Essenciais para Começar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

**Onde encontrar:**
- Acesse: https://supabase.com/dashboard
- Selecione seu projeto
- Vá em: Settings > API
- Copie "Project URL" e "anon public" key

### 3. Setup no Supabase

#### A. Criar Tabelas (SQL Editor)
1. Abra o SQL Editor no dashboard do Supabase
2. Execute o arquivo: `supabase/migrations/001_initial_schema.sql`

#### B. Configurar Secrets (Edge Functions)
1. Vá em: Project Settings > Edge Functions > Secrets
2. Adicione: `GEMINI_API_KEY` = sua chave do Gemini

#### C. Deploy das Functions
```bash
# Instalar CLI (se necessário)
npm install -g supabase

# Login
supabase login

# Link do projeto
supabase link --project-ref seu-project-ref

# Deploy
supabase functions deploy analyze-url
supabase functions deploy analyze-traffic
supabase functions deploy research-market
supabase functions deploy cron-refresh-libraries
```

### 4. Rodar o App

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## ✅ Checklist Rápido

- [ ] `npm install` executado
- [ ] `.env.local` criado com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- [ ] Tabelas criadas no Supabase (migration SQL executada)
- [ ] `GEMINI_API_KEY` configurado como secret
- [ ] Edge Functions deployadas
- [ ] App rodando em `http://localhost:3000`

---

## 🐛 Problemas Comuns

**Erro: "Supabase URL or Anon Key not configured"**
→ Verifique se o `.env.local` existe e tem as variáveis corretas

**Erro: "Unauthorized" nas functions**
→ Verifique se o usuário está autenticado (implementar tela de login)

**Erro: "GEMINI_API_KEY not configured"**
→ Verifique se o secret foi setado nas Edge Functions

**Build falha**
→ Execute `npm install` novamente e verifique se todas as dependências foram instaladas

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `DEPLOY-CHECKLIST.md` - Guia completo de deploy
- `README.md` - Documentação geral do projeto
- `MIGRATION-SUMMARY.md` - Detalhes da migração




