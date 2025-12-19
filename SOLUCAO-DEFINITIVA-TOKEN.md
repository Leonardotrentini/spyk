# 🔧 Solução Definitiva para Token da Meta

## ⚠️ Problema: OAuthException constante

Se você está recebendo `OAuthException` mesmo com tokens novos, o problema geralmente é:

1. **App não tem o produto "Ads Library API" adicionado**
2. **App está em modo incorreto (Development vs Production)**
3. **Permissão `ads_read` não está sendo aplicada corretamente**

---

## ✅ Solução Passo a Passo

### 1. Verificar se o App tem "Ads Library API"

1. Acesse: https://developers.facebook.com/apps
2. Selecione seu app "spy"
3. No menu lateral, procure por **"Products"** ou **"Produtos"**
4. Verifique se **"Ads Library API"** está listado
5. **Se NÃO estiver:**
   - Clique em **"Add Product"** ou **"Adicionar Produto"**
   - Procure por **"Ads Library API"**
   - Clique em **"Set Up"** ou **"Configurar"**

### 2. Verificar Modo do App

1. No painel do app, vá em **Settings** > **Basic**
2. Verifique o **"App Mode"** (Modo do App)
3. Para desenvolvimento, deve estar em **"Development"** ou **"Development Mode"**

### 3. Gerar Token Corretamente

1. Acesse: https://developers.facebook.com/tools/explorer
2. **IMPORTANTE:** No dropdown "Meta App", selecione seu app "spy"
3. Clique em **"Generate Access Token"**
4. **Certifique-se** de que a permissão `ads_read` está selecionada
5. Clique em **"Generate Access Token"**
6. Se aparecer popup, autorize
7. **Copie o token completo**

### 4. Testar Token Diretamente

Antes de usar no projeto, teste no navegador:

```
https://graph.facebook.com/v21.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&search_terms=infoproduto&limit=5
```

**Se funcionar:** Você verá JSON com anúncios  
**Se não funcionar:** O problema é no app/token, não no código

### 5. Atualizar no Projeto

```powershell
$token = "SEU_TOKEN_AQUI"
(Get-Content .env.local) -replace 'META_ADS_LIBRARY_ACCESS_TOKEN=.*', "META_ADS_LIBRARY_ACCESS_TOKEN=$token" | Set-Content .env.local
```

### 6. Reiniciar Servidor

```powershell
# Ctrl+C para parar
npm run dev
```

---

## 🔍 Verificar Configuração do App

Execute este comando para verificar se o app está configurado:

1. Acesse: https://developers.facebook.com/apps
2. Selecione seu app
3. Vá em **Settings** > **Basic**
4. Verifique:
   - ✅ App ID existe
   - ✅ App está em modo Development
   - ✅ App Secret está disponível

---

## 🆘 Se Ainda Não Funcionar

### Alternativa: Usar Token de Sistema

Se tokens de usuário continuarem falhando, use token de sistema:

1. No painel do app, vá em **Settings** > **Basic**
2. Copie **App ID** e **App Secret**
3. Use este comando:

```powershell
$appId = "SEU_APP_ID"
$appSecret = "SEU_APP_SECRET"
$url = "https://graph.facebook.com/oauth/access_token?client_id=$appId&client_secret=$appSecret&grant_type=client_credentials"
$response = Invoke-RestMethod -Uri $url
$response.access_token
```

Este token de sistema é mais estável.

---

## 📝 Checklist Final

Antes de testar novamente, verifique:

- [ ] App tem produto "Ads Library API" adicionado
- [ ] App está em modo Development
- [ ] Token foi gerado com permissão `ads_read`
- [ ] Token foi testado diretamente no navegador (funcionou)
- [ ] Token foi atualizado no `.env.local`
- [ ] Servidor foi reiniciado após atualizar token

---

## 🎯 Próximo Passo

Execute o teste do token acima e me diga o resultado. Se o token funcionar no navegador mas não no código, o problema é outra coisa.



