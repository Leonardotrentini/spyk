# 🔧 Corrigir Token Malformado

## ❌ Erro que você está vendo:

```
Malformed access token
OAuthException code: 190
```

**Isso significa:** O token está corrompido ou foi copiado incorretamente.

---

## ✅ SOLUÇÃO: Gerar Novo Token

O token atual está malformado. Você precisa gerar um **novo token válido**.

### PASSO 1: Gerar Novo Token

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\gerar-token-estendido.ps1
```

**Siga as instruções:**
1. Vai abrir o navegador
2. Faça login no Facebook
3. Autorize o app
4. **Copie o token COMPLETO** (sem espaços, sem quebras de linha)

### PASSO 2: Atualizar Token (Método Seguro)

**Opção A: Script Interativo**

```powershell
.\scripts\atualizar-token.ps1
```

Quando pedir, cole o token (sem espaços extras).

**Opção B: Editar Manualmente**

1. Abra `.env.local`
2. Procure: `META_ADS_LIBRARY_ACCESS_TOKEN=`
3. **Apague tudo após o `=`**
4. Cole o novo token (sem espaços)
5. Salve

### PASSO 3: Verificar Token

```powershell
$content = Get-Content .env.local
$tokenLine = $content | Where-Object { $_ -match "META_ADS_LIBRARY_ACCESS_TOKEN=" }
Write-Host $tokenLine
```

**O token deve:**
- ✅ Começar com `EAA`
- ✅ Ter mais de 200 caracteres
- ✅ NÃO ter espaços
- ✅ NÃO ter quebras de linha
- ✅ NÃO ter caracteres `@` no meio

### PASSO 4: Reiniciar Servidor

1. Pressione `Ctrl+C` no terminal do servidor
2. Execute: `npm run dev`

### PASSO 5: Testar

```powershell
.\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 5 -Country "AR" -Keywords "infoproduto"
```

---

## ⚠️ DICAS IMPORTANTES

1. **Ao copiar o token:**
   - Copie TUDO de uma vez
   - Não adicione espaços
   - Não quebre em linhas
   - Cole direto no arquivo

2. **Token válido deve:**
   - Começar com `EAA`
   - Ter ~250-300 caracteres
   - Ser uma string contínua

3. **Se o token expirar:**
   - Gere um novo
   - Atualize no `.env.local`
   - Reinicie o servidor

---

## 🎯 Comando Rápido (Depois de Gerar Token)

Se você já tem um token válido, atualize assim:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
$novoToken = "COLE_SEU_TOKEN_AQUI_SEM_ESPACOS"
(Get-Content .env.local) -replace 'META_ADS_LIBRARY_ACCESS_TOKEN=.*', "META_ADS_LIBRARY_ACCESS_TOKEN=$novoToken" | Set-Content .env.local
Write-Host "Token atualizado!" -ForegroundColor Green
```

**Substitua `COLE_SEU_TOKEN_AQUI_SEM_ESPACOS` pelo token real.**

---

**O problema é que o token atual está corrompido. Gere um novo token válido!**



