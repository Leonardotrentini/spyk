# ✅ Solução Real: Ads Library API

## 🎯 Descoberta Importante

**"Ads Library API" NÃO é um produto que você adiciona ao app!**

A Ads Library API é uma **API pública** que você acessa diretamente com um token que tenha as permissões corretas.

**Você NÃO precisa adicionar nenhum produto daquela lista!**

---

## ✅ O Que Você REALMENTE Precisa

### 1. Token com Permissão `ads_read`

O token precisa ter a permissão `ads_read` (que você já tem).

### 2. Autorização na Página da Meta

Você precisa autorizar o acesso na página oficial da Meta.

---

## 📋 Solução Passo a Passo

### Passo 1: Verificar Permissões do Token

1. **Acesse:** https://developers.facebook.com/tools/explorer/
2. **No topo:**
   - **Meta App:** Selecione seu app `spy`
   - **User or Page:** Selecione "User Token"
   - **Permissions:** Verifique se `ads_read` está listado

**Se `ads_read` NÃO estiver:**
- Clique em **"Add a permission"**
- Digite: `ads_read`
- Pressione Enter
- Clique em **"Generate Access Token"**

---

### Passo 2: Autorizar na Página da Meta

**IMPORTANTE:** Mesmo tendo o token com `ads_read`, você precisa autorizar:

1. **Acesse:** https://www.facebook.com/ads/library/api
2. **Faça login** com a conta do Facebook
3. **Leia a página** (pode ter informações sobre a API)
4. **Procure por:**
   - Um botão "Authorize" ou "Autorizar"
   - Um link "Get Started" ou "Começar"
   - Qualquer botão que permita autorizar o acesso

**Se não aparecer botão de autorizar:**
- Você pode já estar autorizado
- Ou a autorização é automática ao gerar o token

---

### Passo 3: Confirmar Identidade (Opcional, mas Recomendado)

Para acesso completo à API, você pode precisar confirmar identidade:

1. **Acesse:** https://www.facebook.com/ID
2. **Siga o processo** de confirmação de identidade
3. **Pode levar alguns dias** para confirmar

**Isso é especialmente importante para:**
- Anúncios sobre temas sociais, eleições ou política
- Acesso a dados de gastos e impressões

---

### Passo 4: Gerar Token NOVO

**Após verificar tudo acima, gere um NOVO token:**

1. **Acesse:** https://developers.facebook.com/tools/explorer/
2. **No topo:**
   - **Meta App:** Selecione seu app `spy`
   - **User or Page:** Selecione "User Token"
   - **Permissions:** Certifique-se que `ads_read` está listado
3. **Clique em:** "Generate Access Token"
4. **Autorize** se aparecer popup
5. **Copie o token completo**

---

### Passo 5: Testar o Token

Execute o script de teste:

```powershell
.\scripts\testar-token-completo.ps1
```

**Cole o novo token quando solicitado.**

**O que esperar:**
- ✅ **Teste 1 (`/me`):** Deve passar (já está passando)
- ✅ **Teste 2 (`ads_archive`):** Deve passar agora

---

## 🔍 Se Ainda Der Erro 500

Se após seguir todos os passos ainda der erro 500:

### Opção 1: Tentar com Outro País

Alguns países são mais estáveis. Tente:

```powershell
$token = "SEU_TOKEN_AQUI"
$url = "https://graph.facebook.com/v24.0/ads_archive?access_token=$token&ad_reached_countries=US&limit=5&fields=id,page"
Invoke-RestMethod -Uri $url -Method Get
```

### Opção 2: Tentar com Versão Diferente da API

Tente com `v21.0` ou `v20.0`:

```powershell
$token = "SEU_TOKEN_AQUI"
$url = "https://graph.facebook.com/v21.0/ads_archive?access_token=$token&ad_reached_countries=AR&limit=5&fields=id,page"
Invoke-RestMethod -Uri $url -Method Get
```

### Opção 3: Aguardar e Tentar Novamente

Erros 500 podem ser problemas temporários da Meta. Aguarde algumas horas e tente novamente.

---

## 🎯 Resumo

**Você NÃO precisa:**
- ❌ Adicionar "Ads Library API" como produto (não existe na lista)
- ❌ Configurar nenhum produto da lista mostrada

**Você PRECISA:**
- ✅ Token com permissão `ads_read` (já tem)
- ✅ Autorizar na página https://www.facebook.com/ads/library/api (verificar)
- ✅ Confirmar identidade em https://www.facebook.com/ID (recomendado)
- ✅ Gerar um NOVO token após autorizar

---

## 📋 Checklist

- [ ] Verifiquei que token tem permissão `ads_read`
- [ ] Acessei https://www.facebook.com/ads/library/api
- [ ] Autorizei o acesso (se apareceu botão)
- [ ] Confirmei identidade em https://www.facebook.com/ID (opcional)
- [ ] Gerei um NOVO token no Graph API Explorer
- [ ] Testei com `testar-token-completo.ps1`
- [ ] Teste 2 (Ads Archive) passou ✅

---

## 🚀 Próximos Passos

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

**Agora você sabe: não precisa adicionar nenhum produto! Foque em autorizar e gerar um novo token.** 🎯


