# 🔍 Debug do Login - Passo a Passo

## O que fazer AGORA:

### 1. Reiniciar o Servidor

No PowerShell:
```powershell
# Pare o servidor (Ctrl+C)
npm run dev
```

### 2. Limpar TUDO do Navegador

1. Pressione **F12** (abre DevTools)
2. Vá em **Application** (ou **Aplicativo**)
3. No menu lateral esquerdo:
   - Clique em **Cookies** > **http://localhost:3000**
   - Delete TODOS os cookies (botão direito > Clear)
   - Clique em **Local Storage** > **http://localhost:3000**
   - Delete TUDO (botão direito > Clear)
   - Clique em **Session Storage** > **http://localhost:3000**
   - Delete TUDO
4. Feche o navegador completamente
5. Abra novamente

### 3. Abrir o Console ANTES de fazer login

1. Acesse: http://localhost:3000/login
2. Pressione **F12**
3. Vá na aba **Console**
4. **MANTENHA O CONSOLE ABERTO**

### 4. Fazer Login e OBSERVAR

1. Digite email e senha
2. Clique em "Entrar"
3. **OBSERVE O CONSOLE** - você deve ver:
   - ✅ "Login bem-sucedido: seu-email@exemplo.com"
   - ✅ "Session token: ..."
   - ✅ "Sessão verificada: OK"
   - ✅ "User ID: ..."
   - 🔄 "Redirecionando para /explorar..."

### 5. Me Envie o que Apareceu

**Copie e cole TUDO que apareceu no Console** (especialmente erros em vermelho)

## Se Aparecer Erro no Console:

### Erro: "Invalid login credentials"
- Verifique se o email e senha estão corretos
- Tente criar um novo usuário no Supabase

### Erro: "Email not confirmed"
- O usuário precisa ser confirmado
- Crie um novo usuário no Supabase marcando "Auto Confirm User"

### Erro: "Sessão não encontrada após login"
- Problema com cookies
- Tente em modo anônimo/privado do navegador

### Nenhum erro, mas não redireciona
- Veja se aparece "Redirecionando para /explorar..."
- Se não aparecer, o problema está no código de redirecionamento

## Teste Rápido no Console

Após tentar fazer login, digite no Console:

```javascript
// Verificar se há sessão
const supabase = window.supabase || null
if (supabase) {
  supabase.auth.getSession().then(({data}) => {
    console.log('Sessão atual:', data.session ? 'EXISTE' : 'NÃO EXISTE')
    if (data.session) {
      console.log('User:', data.session.user.email)
    }
  })
}
```

Ou mais simples:

```javascript
// Verificar cookies
document.cookie
```

Me envie o resultado!



