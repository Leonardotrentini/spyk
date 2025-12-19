# 🔧 Resolver Erro "Error validating client secret"

## ❌ Erro que você está vendo:

```
Error validating client secret.
400 Bad Request
```

**Isso significa:** O App Secret está incorreto ou não foi colado corretamente.

---

## ✅ SOLUÇÃO: Verificar App Secret

### PASSO 1: Pegar o App Secret Corretamente

1. Acesse: https://developers.facebook.com/apps/
2. Faça login
3. Selecione seu app (App ID: 1180718484149527)
4. Vá em **Settings** → **Basic**
5. Procure **"App Secret"**
6. Clique em **"Show"** (pode pedir sua senha do Facebook)
7. **Copie o App Secret COMPLETO**

### PASSO 2: Verificar o App Secret

O App Secret deve:
- ✅ Ter **32 caracteres** (geralmente)
- ✅ Ser uma string hexadecimal (só letras e números)
- ✅ **NÃO ter espaços**
- ✅ **NÃO ter quebras de linha**

Exemplo de formato: `f8058156acf9b61f1475f8ba4512b959`

### PASSO 3: Tentar Novamente

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\gerar-token-estendido.ps1
```

**Desta vez:**
1. Cole o App ID: `1180718484149527`
2. **Cole o App Secret COMPLETO** (sem espaços)
3. Cole o token curto

---

## 🎯 ALTERNATIVA MAIS SIMPLES (Recomendado)

Se continuar dando erro, use o **token curto diretamente** (sem estender):

### Opção 1: Usar Token Curto Diretamente

1. Pegue o token curto do Graph API Explorer
2. Atualize diretamente no `.env.local`:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
$token = "COLE_SEU_TOKEN_CURTO_AQUI"
(Get-Content .env.local) -replace 'META_ADS_LIBRARY_ACCESS_TOKEN=.*', "META_ADS_LIBRARY_ACCESS_TOKEN=$token" | Set-Content .env.local
Write-Host "Token atualizado! Reinicie o servidor." -ForegroundColor Green
```

**⚠️ Limitação:** Token curto expira em 1-2 horas, mas funciona para testar!

### Opção 2: Gerar Token no Graph API Explorer

1. Acesse: https://developers.facebook.com/tools/explorer
2. Selecione seu app
3. Clique em **"Generate Access Token"**
4. Selecione permissão: `ads_read`
5. Copie o token
6. Use o comando acima para atualizar

---

## 🔍 Verificar App Secret

Para ter certeza que o App Secret está correto:

1. Vá em: https://developers.facebook.com/apps/1180718484149527/settings/basic/
2. Clique em **"Show"** ao lado do App Secret
3. **Copie TUDO** (geralmente 32 caracteres)
4. **NÃO adicione espaços**
5. Cole no script

---

## 💡 Dica

Se o App Secret tiver espaços ou quebras de linha:
- Remova todos os espaços
- Certifique-se que é uma linha contínua
- Copie novamente

---

## 🎯 Resumo

**Problema:** App Secret incorreto ou mal colado

**Solução:**
1. Pegue o App Secret novamente (Settings → Basic → Show)
2. Copie COMPLETO (sem espaços)
3. Tente novamente

**OU** use o token curto diretamente (mais simples para testar)!



