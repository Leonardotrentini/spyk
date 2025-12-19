# 🚀 Guia Rápido de Início

## 1. Criar arquivo .env.local

Na raiz do projeto, crie `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xwsqbgjflzoimpmcqtso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MDM5NTIsImV4cCI6MjA4MDk3OTk1Mn0.hQnrCNZPAhpJmCR4QmklqbZ_WQy3faEVKvVwvg13h6Q
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQwMzk1MiwiZXhwIjoyMDgwOTc5OTUyfQ.48bq280hlAJLg5UWWeJwDuDVcXwVQCpUAqZWKbte7Vk
META_ADS_LIBRARY_ACCESS_TOKEN=
```

## 2. Executar Migrations no Supabase

1. Acesse: https://xwsqbgjflzoimpmcqtso.supabase.co
2. Faça login no painel
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Copie e cole TODO o conteúdo do arquivo `lib/supabase/migrations.sql`
6. Clique em **Run** (ou F5)
7. Aguarde a confirmação de sucesso

## 3. Instalar Dependências

```bash
npm install
```

## 4. Testar a Conexão

Execute o projeto:

```bash
npm run dev
```

Acesse: http://localhost:3000

Se aparecer a tela de login, está funcionando! ✅

## 5. Criar uma Conta

1. Na tela de login, clique em "Criar conta"
2. Digite email e senha
3. Verifique seu email (se necessário)
4. Faça login

## 6. Coletar Primeiros Anúncios

Você precisa do token da Meta Ads Library. Depois, faça:

```bash
curl -X POST http://localhost:3000/api/meta-ads \
  -H "Content-Type: application/json" \
  -d '{"country": "AR", "keywords": "infoproduto"}'
```

Ou use o Postman/Insomnia.

## 7. Processar Anúncios

Depois de coletar, processe:

```bash
curl -X POST http://localhost:3000/api/process/batch
```

## ✅ Pronto!

Agora você pode:
- Ver anúncios em `/explorar`
- Favoritar ofertas
- Ver Top 5 Players

## 🔑 Obter Token da Meta Ads Library

1. Acesse: https://developers.facebook.com
2. Crie um app (tipo "Business")
3. Vá em **Tools** > **Graph API Explorer**
4. Selecione seu app
5. Gere um Access Token com permissão `ads_read`
6. Cole no `.env.local` como `META_ADS_LIBRARY_ACCESS_TOKEN`

---

**Problemas?** Verifique:
- ✅ `.env.local` existe e tem as credenciais corretas
- ✅ Migrations foram executadas no Supabase
- ✅ `npm install` foi executado
- ✅ Porta 3000 está livre



