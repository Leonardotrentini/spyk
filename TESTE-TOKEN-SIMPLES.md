# 🧪 Teste Simples do Token

## ⚠️ Ads Library API não precisa ser adicionada como produto

A Ads Library API é uma API **pública** e não precisa aparecer na lista de produtos. O problema pode ser:

1. Token sem permissão `ads_read`
2. Token expirado
3. Parâmetros incorretos na requisição

---

## ✅ Teste Passo a Passo

### 1. Gerar Token NOVO

1. Acesse: https://developers.facebook.com/tools/explorer
2. **Selecione seu app "spy"** no dropdown
3. Clique em **"Generate Access Token"**
4. **IMPORTANTE:** Certifique-se de que `ads_read` está selecionado
5. Clique em **"Generate Access Token"**
6. **Copie o token completo**

### 2. Testar Token no Navegador

Cole este link no navegador (substitua `SEU_TOKEN`):

```
https://graph.facebook.com/v21.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&limit=5
```

**Se funcionar:** Você verá JSON com anúncios  
**Se não funcionar:** O token está inválido ou sem permissão

### 3. Se o Token Funcionar no Navegador

Atualize no projeto:

```powershell
$token = "SEU_TOKEN_QUE_FUNCIONOU_NO_NAVEGADOR"
(Get-Content .env.local) -replace 'META_ADS_LIBRARY_ACCESS_TOKEN=.*', "META_ADS_LIBRARY_ACCESS_TOKEN=$token" | Set-Content .env.local
Write-Host "Token atualizado!"
```

### 4. Reiniciar Servidor

```powershell
# Ctrl+C para parar
npm run dev
```

### 5. Testar

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect" -Method POST -ContentType "application/json" -Body '{"country": "AR", "keywords": "infoproduto"}'
```

---

## 🔍 Verificar Permissões do Token

No Graph API Explorer, após gerar o token:

1. Clique no ícone "i" (informações) ao lado do token
2. Ou acesse: https://developers.facebook.com/tools/debug/accesstoken/
3. Cole o token e clique em "Debug"
4. Verifique se `ads_read` está na lista de permissões

---

## 🆘 Se Ainda Não Funcionar

Pode ser que o app precise estar em modo específico ou ter alguma configuração adicional. Nesse caso, tente:

1. No painel do app, vá em **Settings** > **Basic**
2. Verifique se o app está em **"Development Mode"**
3. Se necessário, mude para Development Mode

---

**Teste o token no navegador primeiro e me diga o resultado!**



