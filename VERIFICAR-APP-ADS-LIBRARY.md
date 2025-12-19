# 🔍 Verificar se App tem "Ads Library API" Configurado

## ⚠️ Problema

O botão "Acessar a API" em https://www.facebook.com/ads/library/api **só redireciona** para o Graph API Explorer.

**Isso significa que:**
- Você pode já estar autorizado na página
- **MAS** o app pode não ter o produto "Ads Library API" adicionado
- **OU** o app não está configurado corretamente

---

## 📋 Passo a Passo: Verificar e Configurar

### Passo 1: Acessar o Painel do App

1. **Acesse:** https://developers.facebook.com/apps
2. **Faça login** com sua conta
3. **Selecione seu app:** `spy` (ou o nome do seu app)

---

### Passo 2: Verificar se "Ads Library API" está nos Produtos

1. **No menu lateral esquerdo**, procure por:
   - **"Products"** (Produtos)
   - **"Produtos"** (se estiver em português)
   - Ou **"Add Products"** (Adicionar Produtos)

2. **Clique em "Products"** ou **"Produtos"**

3. **Procure na lista por:**
   - ✅ **"Ads Library API"** → Se aparecer, está configurado!
   - ❌ **Se NÃO aparecer**, precisa adicionar

---

### Passo 3: Adicionar "Ads Library API" (Se Não Estiver)

**Se "Ads Library API" NÃO aparecer na lista:**

1. **Clique em:** **"Add Products"** ou **"Adicionar Produtos"** (geralmente no topo ou no menu lateral)

2. **Na lista de produtos disponíveis**, procure por:
   - **"Ads Library API"**
   - Ou **"Ad Library API"**

3. **Clique em:** **"Set Up"** ou **"Configurar"** ao lado de "Ads Library API"

4. **Siga as instruções** na tela (pode pedir para aceitar termos)

5. **Após configurar**, "Ads Library API" deve aparecer na lista de produtos do app

---

### Passo 4: Verificar Configurações do App

1. **No menu lateral**, clique em **"Settings"** > **"Basic"**

2. **Verifique:**
   - **App ID:** Deve estar visível
   - **App Secret:** Deve estar visível (clique em "Show" se necessário)
   - **App Mode:** Deve estar em **"Development Mode"** para testes

3. **Role até o final** e verifique se há alguma mensagem sobre:
   - Permissões pendentes
   - Revisão necessária
   - Erros de configuração

---

### Passo 5: Verificar Permissões do Token

1. **Acesse:** https://developers.facebook.com/tools/explorer/

2. **No topo da página:**
   - **Meta App:** Selecione seu app `spy`
   - **User or Page:** Selecione "User Token"
   - **Permissions:** Verifique se `ads_read` está listado

3. **Se `ads_read` NÃO estiver:**
   - Clique em **"Add a permission"**
   - Digite: `ads_read`
   - Pressione Enter
   - Clique em **"Generate Access Token"**

---

### Passo 6: Testar com Token Novo

Após verificar tudo acima:

1. **Gere um NOVO token** no Graph API Explorer
2. **Teste com o script:**
   ```powershell
   .\scripts\testar-token-completo.ps1
   ```
3. **Cole o novo token** quando solicitado

---

## 🔍 Como Saber se Está Configurado Corretamente

### ✅ TUDO OK:
- ✅ "Ads Library API" aparece na lista de produtos do app
- ✅ App está em "Development Mode"
- ✅ Token tem permissão `ads_read`
- ✅ Teste do `ads_archive` retorna **200 OK** ou dados de anúncios

### ❌ AINDA FALTANDO:
- ❌ "Ads Library API" NÃO aparece na lista de produtos
- ❌ App está em modo incorreto
- ❌ Token não tem `ads_read`
- ❌ Teste do `ads_archive` retorna erro 400 ou 500

---

## ⚠️ Problemas Comuns

### Problema 1: "Não vejo 'Ads Library API' na lista de produtos"

**Solução:**
- Clique em **"Add Products"** ou **"Adicionar Produtos"**
- Procure por "Ads Library API" na lista de produtos disponíveis
- Se não aparecer, o app pode estar em modo incorreto
- Tente criar um novo app e adicionar o produto

---

### Problema 2: "App está em modo incorreto"

**Solução:**
1. Vá em **Settings** > **Basic**
2. Verifique o **"App Mode"**
3. Para testes, deve estar em **"Development Mode"**
4. Se estiver em "Live Mode", pode precisar de revisão da Meta

---

### Problema 3: "Adicionei o produto mas ainda dá erro"

**Solução:**
1. **Aguarde alguns minutos** (pode levar tempo para propagar)
2. **Gere um NOVO token** após adicionar o produto
3. **Teste novamente** com o novo token
4. **Verifique se autorizou** em https://www.facebook.com/ads/library/api

---

## 🎯 Checklist Rápido

- [ ] Acessei https://developers.facebook.com/apps
- [ ] Selecionei meu app
- [ ] Verifiquei se "Ads Library API" está em "Products"
- [ ] Se não estava, adicionei o produto "Ads Library API"
- [ ] Verifiquei que app está em "Development Mode"
- [ ] Gerei um NOVO token no Graph API Explorer
- [ ] Token tem permissão `ads_read`
- [ ] Testei com `testar-token-completo.ps1`
- [ ] Teste passou ✅

---

## 📞 Se Ainda Não Funcionar

Se após seguir todos os passos ainda der erro:

1. **Tire print** da tela de "Products" do app
2. **Tire print** do Graph API Explorer mostrando o token
3. **Tire print** do erro do teste
4. **Me envie os prints** para eu ver o que está acontecendo

---

**Siga esses passos e me diga o que encontrou!** 🚀


