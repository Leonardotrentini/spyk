# 🔑 Como Gerar Token de Longa Duração da Meta (60 dias)

## ⚠️ Importante
Tokens da Meta **não são 100% permanentes**, mas você pode gerar tokens que duram **até 60 dias**.

## Método 1: Estender Token no Graph API Explorer (Mais Fácil)

### Passo 1: Gerar Token Inicial
1. Acesse: https://developers.facebook.com/tools/explorer
2. Selecione seu app no dropdown "Meta App"
3. Clique em **"Generate Access Token"**
4. Selecione permissão: `ads_read`
5. Clique em **"Generate Access Token"**
6. **Copie o token gerado** (começa com `EAA...`)

### Passo 2: Estender o Token
1. No Graph API Explorer, ao lado do campo do token, clique no **ícone "i"** (informações)
2. Ou acesse diretamente: https://developers.facebook.com/tools/debug/accesstoken/
3. Cole o token no campo
4. Clique em **"Debug"** ou **"Depurar"**
5. Role até a seção **"Extend Access Token"** ou **"Estender Token de Acesso"**
6. Clique no botão **"Extend Access Token"**
7. **Copie o novo token estendido** (este dura até 60 dias)

### Passo 3: Atualizar no Projeto
1. Abra `.env.local`
2. Cole o token estendido:
   ```
   META_ADS_LIBRARY_ACCESS_TOKEN=seu_token_estendido_aqui
   ```
3. Salve e reinicie o servidor

---

## Método 2: Token de Sistema (Mais Complexo, Mas Mais Estável)

Tokens de sistema são mais estáveis, mas requerem configuração adicional.

### Passo 1: Obter App ID e App Secret
1. Acesse: https://developers.facebook.com/apps
2. Selecione seu app
3. Vá em **Settings** > **Basic**
4. Anote:
   - **App ID**
   - **App Secret** (clique em "Show" para revelar)

### Passo 2: Gerar Token de Longa Duração via API

Use este comando PowerShell (substitua `APP_ID` e `APP_SECRET`):

```powershell
# Primeiro, gere um token de usuário (como no Método 1)
# Depois, use este comando para estender:

$appId = "SEU_APP_ID"
$appSecret = "SEU_APP_SECRET"
$shortLivedToken = "SEU_TOKEN_CURTO_AQUI"

$url = "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$appId&client_secret=$appSecret&fb_exchange_token=$shortLivedToken"

Invoke-RestMethod -Uri $url
```

O resultado terá um campo `access_token` com o token de longa duração.

---

## Método 3: Usar Token de Página (Para Apps com Página)

Se seu app está associado a uma Página do Facebook:

1. Vá em **Tools** > **Graph API Explorer**
2. Selecione seu app
3. No dropdown de tokens, selecione **"Get Page Access Token"**
4. Selecione sua página
5. Gere o token
6. Este token pode durar mais tempo

---

## ⚡ Solução Rápida: Script Automático

Crie um arquivo `gerar-token.ps1`:

```powershell
# Substitua pelos seus valores
$APP_ID = "seu_app_id"
$APP_SECRET = "seu_app_secret"
$SHORT_TOKEN = "seu_token_curto"

Write-Host "🔄 Estendendo token..." -ForegroundColor Cyan

$url = "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$APP_ID&client_secret=$APP_SECRET&fb_exchange_token=$SHORT_TOKEN"

try {
    $response = Invoke-RestMethod -Uri $url
    Write-Host "✅ Token estendido gerado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Token:" -ForegroundColor Yellow
    Write-Host $response.access_token -ForegroundColor White
    Write-Host ""
    Write-Host "Expira em:" -ForegroundColor Yellow
    Write-Host "$($response.expires_in / 86400) dias" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Cole este token no arquivo .env.local:" -ForegroundColor Cyan
    Write-Host "META_ADS_LIBRARY_ACCESS_TOKEN=$($response.access_token)" -ForegroundColor White
} catch {
    Write-Host "❌ Erro:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
```

Execute:
```powershell
.\gerar-token.ps1
```

---

## 🔄 Renovação Automática (Futuro)

Para produção, você pode implementar renovação automática:
- Usar o token de longa duração
- Antes de expirar, gerar um novo automaticamente
- Atualizar no banco de dados ou variável de ambiente

---

## 📝 Recomendação

Para uso pessoal/desenvolvimento:
- Use o **Método 1** (estender no Graph API Explorer)
- Renove a cada 60 dias
- É simples e suficiente

Para produção:
- Configure **Método 2** (token de sistema)
- Implemente renovação automática
- Mais complexo, mas mais estável



