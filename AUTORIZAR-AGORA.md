# 🚨 AUTORIZAR ADS LIBRARY API - URGENTE

## ⚠️ O Erro Continua

O erro **2D** ainda mostra:

```
"Application does not have permission for this action"
"Para acessar a API, você precisa seguir as etapas em facebook.com/ads/library/api"
```

**Isso significa que você AINDA NÃO autorizou o acesso!**

---

## 🎯 SOLUÇÃO SIMPLES - 3 PASSOS

### Passo 1: Abrir a Página

1. **Abra uma nova aba no navegador**
2. **Cole este link:** https://www.facebook.com/ads/library/api
3. **Pressione Enter**

### Passo 2: Fazer Login

1. **Se não estiver logado**, faça login com sua conta do Facebook
2. **Use a mesma conta** que você usa no Graph API Explorer

### Passo 3: Autorizar

1. **Leia a página** que aparecer
2. **Procure por:**
   - Botão "Aceitar" ou "Accept"
   - Botão "Autorizar" ou "Authorize"
   - Botão "Get Started" ou "Começar"
   - Link "Continue" ou "Continuar"
3. **Clique no botão/link**
4. **Aguarde confirmação** de que foi autorizado

---

## ✅ Como Saber se Funcionou

Após autorizar, você deve ver uma página dizendo:
- ✅ "Você tem acesso à Ads Library API"
- ✅ Ou uma mensagem similar de sucesso
- ✅ Ou a página muda mostrando informações sobre a API

---

## 🔄 Depois de Autorizar

### 1. Gere NOVO Token

**IMPORTANTE:** Após autorizar, você DEVE gerar um novo token:

1. Volte para: https://developers.facebook.com/tools/explorer/
2. Selecione App: `spy`
3. Selecione Permissão: `ads_read`
4. Clique em **"Generate Access Token"**
5. **Copie o novo token**

### 2. Atualize no Projeto

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\atualizar-token.ps1
```

Cole o novo token.

### 3. Teste Novamente

```powershell
.\scripts\testar-token-direto.ps1
```

**Agora o Teste 2D deve passar!**

---

## 🆘 Se Não Encontrar Botão de Autorizar

### Opção 1: Tentar em Modo Anônimo

1. Abra uma **aba anônima/privada**
2. Acesse: https://www.facebook.com/ads/library/api
3. Faça login
4. Veja se aparece o botão

### Opção 2: Limpar Cache

1. Pressione `Ctrl + Shift + Delete`
2. Limpe cache e cookies
3. Acesse novamente: https://www.facebook.com/ads/library/api

### Opção 3: Tentar Outro Navegador

- Se usa Chrome, tente Edge ou Firefox
- Se usa Edge, tente Chrome

---

## 📸 Me Envie um Print

Se ainda não conseguir:

1. **Tire um print** da página https://www.facebook.com/ads/library/api
2. **Me envie o print**
3. Vou te ajudar a identificar o que fazer

---

## 🎯 Resumo Rápido

1. ✅ Acesse: https://www.facebook.com/ads/library/api
2. ✅ Faça login
3. ✅ Autorize/aceite
4. ✅ Gere NOVO token
5. ✅ Atualize no projeto
6. ✅ Teste novamente

---

**FAÇA ISSO AGORA e me diga o resultado!** 🚀



