# 🔧 Resolver Erro de Token da Meta

## ❌ Erro que você está vendo:

```
OAuthException
code: 1
401 Unauthorized
```

**Isso significa:** O token da Meta expirou ou está inválido.

---

## ✅ SOLUÇÃO RÁPIDA (Copiar e Colar)

### PASSO 1: Verificar token atual

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\ver-token.ps1
```

### PASSO 2: Gerar novo token

```powershell
.\scripts\gerar-token-estendido.ps1
```

**Siga as instruções na tela:**
1. Vai abrir o navegador
2. Faça login no Facebook
3. Autorize o app
4. Copie o token gerado

### PASSO 3: Atualizar token no .env.local

```powershell
.\scripts\atualizar-token.ps1
```

**Cole o token quando pedir.**

### PASSO 4: Verificar se foi salvo

```powershell
.\scripts\ver-token.ps1
```

### PASSO 5: Testar coleta novamente

```powershell
.\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 5 -Country "AR" -Keywords "infoproduto"
```

---

## 🔄 ALTERNATIVA: Atualizar Token Diretamente

Se você já tem um token válido, atualize diretamente:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\atualizar-token-direto.ps1
```

**Edite o arquivo e cole seu token na variável `$novoToken`**

---

## 📝 Verificar .env.local Manualmente

Se preferir editar manualmente:

1. Abra o arquivo: `.env.local`
2. Procure por: `META_ADS_LIBRARY_ACCESS_TOKEN=`
3. Cole o novo token após o `=`
4. Salve o arquivo
5. **Reinicie o servidor** (`npm run dev`)

---

## ⚠️ IMPORTANTE

- Tokens expiram após algumas horas/dias
- Você precisa gerar um novo token periodicamente
- O servidor precisa ser reiniciado após atualizar o token

---

## 🎯 Comandos Completos (Copiar Tudo)

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\gerar-token-estendido.ps1
# Siga as instruções na tela
.\scripts\atualizar-token.ps1
# Cole o token quando pedir
.\scripts\ver-token.ps1
# Verifique se foi salvo
```

---

**Depois de atualizar o token, teste novamente a coleta!**



