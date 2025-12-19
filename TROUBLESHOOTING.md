# 🔧 Troubleshooting - Problemas Comuns

## Problema: Login fica em "Carregando..." e não redireciona

### Solução 1: Verificar Console do Navegador

1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Tente fazer login novamente
4. Veja se há erros em vermelho
5. Copie e me envie os erros

### Solução 2: Desabilitar Confirmação de Email no Supabase

O Supabase pode estar configurado para exigir confirmação de email. Para desabilitar:

1. Acesse: https://supabase.com/dashboard/project/xwsqbgjflzoimpmcqtso
2. Vá em **Authentication** > **Settings**
3. Role até **"Email Auth"**
4. Desmarque **"Enable email confirmations"** (ou configure como preferir)
5. Salve

### Solução 3: Verificar se as Migrations Foram Executadas

Se as migrations não foram executadas, a autenticação não funciona:

1. Acesse: https://supabase.com/dashboard/project/xwsqbgjflzoimpmcqtso
2. Vá em **SQL Editor**
3. Execute o conteúdo de `lib/supabase/migrations.sql`
4. Tente fazer login novamente

### Solução 4: Verificar Variáveis de Ambiente

Certifique-se de que o arquivo `.env.local` está correto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xwsqbgjflzoimpmcqtso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Importante:** Após alterar `.env.local`, reinicie o servidor:
- Pare o servidor (Ctrl+C)
- Execute `npm run dev` novamente

### Solução 5: Limpar Cookies e Cache

1. Abra o DevTools (F12)
2. Vá em **Application** > **Cookies**
3. Delete todos os cookies do localhost
4. Recarregue a página (Ctrl+Shift+R)

## Problema: Erro "Invalid login credentials"

- Verifique se o email e senha estão corretos
- Se criou a conta recentemente, pode precisar confirmar o email primeiro
- Tente criar uma nova conta

## Problema: Erro de CORS ou conexão

- Verifique se o servidor está rodando (`npm run dev`)
- Verifique se as URLs do Supabase estão corretas no `.env.local`
- Reinicie o servidor

## Verificar se está funcionando

Abra o Console do navegador (F12) e veja se há mensagens como:
- "Login bem-sucedido: seu-email@exemplo.com" ✅
- Ou algum erro em vermelho ❌

Me envie o que aparecer no console!



