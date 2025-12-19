# 🔍 Verificar Configuração do App Meta

## ⚠️ Erro 400 = App Não Configurado Corretamente

Se você está recebendo erro 400 (Bad Request), o problema geralmente é que o **app não tem o produto "Ads Library API" adicionado**.

---

## ✅ Verificar e Corrigir

### Passo 1: Acessar o App

1. Acesse: https://developers.facebook.com/apps
2. Selecione seu app "spy" (ou o nome que você deu)

### Passo 2: Verificar Produtos

1. No menu lateral, procure por **"Products"** ou **"Produtos"**
2. Verifique se **"Ads Library API"** está na lista

### Passo 3: Adicionar Ads Library API (Se Não Estiver)

1. Clique em **"Add Product"** ou **"Adicionar Produto"** (botão no topo ou menu lateral)
2. Procure por **"Ads Library API"**
3. Clique em **"Set Up"** ou **"Configurar"**
4. Siga as instruções (geralmente só precisa confirmar)

### Passo 4: Verificar Modo do App

1. Vá em **Settings** > **Basic**
2. Verifique se o **"App Mode"** está em **"Development"**
3. Se estiver em "Live", mude para "Development" (para testes)

### Passo 5: Gerar Novo Token

**IMPORTANTE:** Após adicionar o produto, gere um novo token:

1. Acesse: https://developers.facebook.com/tools/explorer
2. Selecione seu app no dropdown
3. Clique em **"Generate Access Token"**
4. Selecione permissão: `ads_read`
5. Gere e copie o token

### Passo 6: Testar

Teste o token no navegador:

```
https://graph.facebook.com/v21.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&limit=5
```

**Se funcionar:** Você verá JSON com anúncios  
**Se não funcionar:** O app ainda não está configurado corretamente

---

## 📸 Onde Encontrar "Add Product"

- **Opção 1:** Menu lateral esquerdo > "Add Product" (botão verde/azul)
- **Opção 2:** Dashboard do app > Card "Add a Product"
- **Opção 3:** Settings > Products > "Add Product"

---

## ✅ Checklist

Antes de testar novamente:

- [ ] App tem "Ads Library API" na lista de produtos
- [ ] App está em modo Development
- [ ] Novo token foi gerado após adicionar o produto
- [ ] Token foi testado no navegador (funcionou)
- [ ] Token foi atualizado no `.env.local`
- [ ] Servidor foi reiniciado

---

## 🆘 Se Ainda Não Funcionar

Pode ser que o app precise de revisão da Meta. Nesse caso:

1. Vá em **App Review** > **Permissions and Features**
2. Verifique se `ads_read` está listado
3. Se necessário, solicite revisão (mas geralmente não é necessário para Ads Library API)

---

**Execute os passos acima e me diga o resultado!**



