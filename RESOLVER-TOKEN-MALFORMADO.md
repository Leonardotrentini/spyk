# 🔧 Resolver Erro "Malformed access token"

## ⚠️ Erro Recebido

```json
{
  "error": {
    "message": "Malformed access token",
    "type": "OAuthException",
    "code": 190
  }
}
```

---

## 🔍 Problema Identificado

A URL foi **cortada/truncada** no navegador:
- URL mostrada: `...access_toke` (cortado!)
- Token não foi passado completamente

Isso acontece porque:
- Tokens são muito longos
- Navegadores podem cortar URLs muito longas
- Copiar/colar pode ter problemas

---

## ✅ Solução: Usar Script PowerShell

Vamos testar usando PowerShell para garantir que o token completo seja enviado:

### Passo 1: Copiar o Token Completo

1. **No Graph API Explorer**, copie o token completo
2. **Certifique-se de copiar TUDO** (deve ter ~200-300 caracteres)

---

### Passo 2: Testar com PowerShell

Execute este comando no PowerShell (substitua `SEU_TOKEN` pelo token completo):

```powershell
$token = "SEU_TOKEN_AQUI"
$url = "https://graph.facebook.com/v24.0/ads_archive?access_token=$token&ad_reached_countries=AR&limit=5&fields=id,page"
Invoke-RestMethod -Uri $url -Method Get
```

---

### Passo 3: Teste Rápido

Execute este comando (com seu token real):

```powershell
$token = "EAAQX23HT1RcBQELNZBKZAZCd9jokpCxjqZCMeErJSujSQuvzKuiolak6QcEn"
$url = "https://graph.facebook.com/v24.0/ads_archive?access_token=$token&ad_reached_countries=AR&limit=5&fields=id,page"
Invoke-RestMethod -Uri $url -Method Get
```

**Me diga o resultado!**

---

## 🧪 Script Completo de Teste

Criei um script para testar facilmente:

```powershell
# Teste do Token - Ads Archive
$token = Read-Host "Cole o token completo aqui"
$url = "https://graph.facebook.com/v24.0/ads_archive?access_token=$token&ad_reached_countries=AR&limit=5&fields=id,page"

Write-Host "Testando token..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    Write-Host "SUCESSO!" -ForegroundColor Green
    Write-Host "Anuncios encontrados: $($response.data.Count)" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "ERRO!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        Write-Host "Resposta: $responseBody" -ForegroundColor Red
    }
}
```

---

## 📋 Passos para Resolver

1. **Copie o token completo** do Graph API Explorer
2. **Execute o teste no PowerShell** (comando acima)
3. **Me diga o resultado:**
   - ✅ Funcionou? → Me envie o token!
   - ❌ Deu erro? → Qual erro apareceu?

---

## ⚠️ Se Ainda Der Erro

Se ainda der erro mesmo com o token completo:

### 1. Verificar se Token Está Completo

O token deve:
- Começar com `EAA...`
- Ter aproximadamente 200-300 caracteres
- Não ter espaços no início ou fim

### 2. Autorizar na Página da Ads Library API

1. **Acesse:** https://www.facebook.com/ads/library/api
2. **Faça login**
3. **Autorize/aceite** o acesso
4. **Gere NOVO token** no Graph API Explorer
5. **Teste novamente**

---

## 🎯 O Que Fazer Agora

1. **Copie o token completo** do Graph API Explorer
2. **Execute o teste no PowerShell:**
   ```powershell
   $token = "COLE_SEU_TOKEN_AQUI"
   $url = "https://graph.facebook.com/v24.0/ads_archive?access_token=$token&ad_reached_countries=AR&limit=5&fields=id,page"
   Invoke-RestMethod -Uri $url -Method Get
   ```
3. **Me diga o resultado!**

---

**O problema é que a URL foi cortada no navegador. Use PowerShell para testar!** 🚀



