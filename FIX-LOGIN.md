# 🔧 Corrigir Problema de Login

## O Problema
Login recarrega a página de login em vez de redirecionar para `/explorar`.

## Solução Rápida

### 1. Desabilitar Confirmação de Email no Supabase

**IMPORTANTE:** Isso não tem relação com o Meta. É uma configuração do Supabase.

1. Acesse: https://supabase.com/dashboard/project/xwsqbgjflzoimpmcqtso
2. Vá em **Authentication** (menu lateral)
3. Clique em **Settings** (ou **Configurações**)
4. Role até a seção **"Email Auth"**
5. **Desmarque** a opção **"Enable email confirmations"**
6. Clique em **Save** (ou **Salvar**)

### 2. Reiniciar o Servidor

No PowerShell onde está rodando o projeto:

```powershell
# Pare o servidor (Ctrl+C)
# Depois execute novamente:
npm run dev
```

### 3. Limpar Cookies e Tentar Novamente

1. Abra o DevTools (F12)
2. Vá em **Application** > **Cookies**
3. Delete todos os cookies de `http://localhost:3000`
4. Feche e abra o navegador novamente
5. Tente fazer login

### 4. Verificar no Console

1. Abra o Console (F12 > Console)
2. Tente fazer login
3. Você deve ver:
   - ✅ "Login bem-sucedido: seu-email@exemplo.com"
   - ✅ "Sessão verificada: OK"

Se aparecer algum erro em vermelho, me envie!

## Se Ainda Não Funcionar

### Verificar se as Migrations Foram Executadas

1. Acesse: https://supabase.com/dashboard/project/xwsqbgjflzoimpmcqtso
2. Vá em **SQL Editor**
3. Execute o conteúdo completo de `lib/supabase/migrations.sql`
4. Verifique se apareceu "Success" ou "Success. No rows returned"

### Criar Nova Conta

Se a conta antiga tiver problemas, crie uma nova:
1. Use um email diferente
2. Crie a conta
3. Tente fazer login imediatamente

## Teste Rápido

Após fazer login, abra o Console (F12) e digite:

```javascript
localStorage.getItem('sb-xwsqbgjflzoimpmcqtso-auth-token')
```

Se retornar algo (não null), a sessão está sendo salva!



