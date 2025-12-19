# 🔧 Solução: Erro 500 na Ads Library API

## ⚠️ Problema Identificado

Você está recebendo **erro 500** no `ads_archive`, mas o token funciona para `/me`.

**Isso geralmente significa:**
- ❌ A aplicação não está autorizada para usar a Ads Library API
- ❌ O app não tem o produto "Ads Library API" configurado
- ❌ Falta autorização específica na página da Meta

---

## 📋 Solução Baseada na Documentação Oficial

Segundo a [documentação oficial da Meta](https://www.facebook.com/ads/library/api), há **3 passos obrigatórios**:

### Passo 1: Confirmar Identidade e Localização

**IMPORTANTE:** Para acessar a Ads Library API, você precisa:

1. **Acesse:** https://www.facebook.com/ID
2. **Siga o processo de confirmação** de identidade
3. **Pode levar alguns dias** para confirmar

**Isso é obrigatório para:**
- Anúncios sobre temas sociais, eleições ou política
- Acesso completo à API

---

### Passo 2: Criar Conta Meta for Developers

1. **Acesse:** https://developers.facebook.com/
2. **Clique em "Get Started"** (Começar)
3. **Concorde com a Platform Policy**
4. **Complete o cadastro**

---

### Passo 3: Criar um App e Configurar

1. **Acesse:** https://developers.facebook.com/apps
2. **Clique em "Create App"** (Criar App)
3. **Selecione o tipo:** "Business" ou "Other"
4. **Preencha os dados:**
   - Nome: `spy` (ou qualquer nome)
   - Email de contato: seu email

---

### Passo 4: Adicionar Produto "Ads Library API"

**CRÍTICO:** O app precisa ter o produto "Ads Library API" adicionado:

1. **No painel do app**, vá em **"Add Products"** ou **"Adicionar Produtos"**
2. **Procure por:** "Ads Library API"
3. **Clique em:** "Set Up" ou "Configurar"
4. **Siga as instruções** na tela

**Se não aparecer "Ads Library API":**
- O app pode estar em modo incorreto
- Verifique se o app está em **"Development Mode"**

---

### Passo 5: Autorizar na Página da API

**IMPORTANTE:** Mesmo tendo o produto adicionado, você precisa autorizar:

1. **Acesse:** https://www.facebook.com/ads/library/api
2. **Faça login** com a conta do Facebook
3. **Procure por um botão ou link** que diz:
   - "Authorize" (Autorizar)
   - "Get Started" (Começar)
   - "Access the API" (Acessar a API)
4. **Clique e autorize**

**Se não aparecer botão de autorizar:**
- Você pode já estar autorizado
- Ou o app não está configurado corretamente

---

### Passo 6: Gerar Token NOVO

**Após autorizar, gere um NOVO token:**

1. **Acesse:** https://developers.facebook.com/tools/explorer/
2. **No topo:**
   - **Meta App:** Selecione seu app `spy`
   - **User or Page:** Selecione "User Token"
   - **Permissions:** Adicione `ads_read`
3. **Clique em:** "Generate Access Token"
4. **Autorize** se aparecer popup
5. **Copie o token completo**

---

### Passo 7: Testar o Token

Execute o script de teste:

```powershell
.\scripts\testar-token-completo.ps1
```

**Cole o novo token quando solicitado.**

---

## 🔍 Verificar Status do App

### Verificar se App tem "Ads Library API"

1. **Acesse:** https://developers.facebook.com/apps
2. **Selecione seu app:** `spy`
3. **No menu lateral**, procure por **"Products"** ou **"Produtos"**
4. **Verifique se "Ads Library API" está listado**

**Se NÃO estiver:**
- Clique em **"Add Product"**
- Procure **"Ads Library API"**
- Clique em **"Set Up"**

---

### Verificar Modo do App

1. **No painel do app**, vá em **Settings** > **Basic**
2. **Verifique "App Mode":**
   - Deve estar em **"Development Mode"** para testes
   - Ou **"Live Mode"** para produção (requer revisão)

---

## 🧪 Teste Alternativo: Verificar Erro Real

O erro 500 pode estar mascarando um erro 400. Vamos capturar o erro real:

```powershell
$token = "SEU_TOKEN_AQUI"
$url = "https://graph.facebook.com/v24.0/ads_archive?access_token=$token&ad_reached_countries=AR&limit=5&fields=id,page"

try {
    $response = Invoke-WebRequest -Uri $url -Method Get -ErrorAction Stop
    Write-Host "SUCESSO!" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
} catch {
    Write-Host "ERRO!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    # Tentar ler o corpo da resposta
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        Write-Host "Resposta completa:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor White
        
        # Verificar se é erro de permissão
        if ($responseBody -match "Application does not have permission") {
            Write-Host ""
            Write-Host "=== PROBLEMA IDENTIFICADO ===" -ForegroundColor Red
            Write-Host "App nao tem permissao para Ads Library API" -ForegroundColor Yellow
            Write-Host "Siga os passos acima para autorizar!" -ForegroundColor Yellow
        }
    }
}
```

---

## 📋 Checklist Completo

- [ ] Confirmei identidade em https://www.facebook.com/ID
- [ ] Criei conta Meta for Developers
- [ ] Criei um app
- [ ] Adicionei produto "Ads Library API" ao app
- [ ] Autorizei na página https://www.facebook.com/ads/library/api
- [ ] Gerei um NOVO token após autorizar
- [ ] Testei o token com `testar-token-completo.ps1`
- [ ] Teste 2 (Ads Archive) passou ✅

---

## ⚠️ Se Ainda Der Erro 500

Se após seguir todos os passos ainda der erro 500:

1. **Aguarde algumas horas** (pode ser problema temporário da Meta)
2. **Tente com outro país:** `ad_reached_countries=US` (mais estável)
3. **Tente com API version diferente:** `v21.0` ou `v20.0`
4. **Verifique se o app está em "Development Mode"**

---

## 🎯 Próximos Passos

Quando o token funcionar:

1. **Atualize no projeto:**
   ```powershell
   .\scripts\atualizar-token.ps1
   ```

2. **Teste a coleta:**
   ```powershell
   $body = @{ country = "AR"; keywords = "infoproduto"; maxPages = 5 } | ConvertTo-Json
   Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect-full" -Method POST -ContentType "application/json" -Body $body
   ```

---

**Siga esses passos na ordem e me diga onde está travando!** 🚀


