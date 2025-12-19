# 🔧 Resolver Erro "ads_archive does not exist"

## ⚠️ Erro Recebido

```json
{
  "error": {
    "message": "Unsupported get request. Object with ID 'ads_archive' does not exist, cannot be loaded due to missing permissions, or does not support this operation.",
    "type": "GraphMethodException",
    "code": 100,
    "error_subcode": 33
  }
}
```

---

## 🔍 O Que Isso Significa

Este erro pode significar:
1. ❌ **Ainda falta autorização** na página da Ads Library API
2. ❌ **Endpoint não está acessível** no Graph API Explorer desta forma
3. ❌ **Token não tem permissão** para acessar este endpoint

---

## 🎯 Solução Passo a Passo

### Passo 1: Verificar se Autorizou na Página

**IMPORTANTE:** Mesmo com este erro, você ainda precisa autorizar:

1. **Abra uma nova aba** no navegador
2. **Acesse:** https://www.facebook.com/ads/library/api
3. **Faça login** (se necessário)
4. **Procure por:**
   - Botão "Aceitar" ou "Accept"
   - Botão "Autorizar" ou "Authorize"
   - Link "Get Started" ou "Começar"
5. **Clique e autorize**
6. **Aguarde confirmação**

---

### Passo 2: Gerar NOVO Token (Após Autorizar)

**CRÍTICO:** Após autorizar, você DEVE gerar um novo token:

1. **Volte para o Graph API Explorer**
2. **Clique em "Generate Access Token"** (botão azul)
3. **Se aparecer popup:**
   - Faça login
   - Aceite as permissões
   - Autorize o acesso
4. **Copie o novo token gerado**

---

### Passo 3: Tentar Formato Diferente no Graph API Explorer

O Graph API Explorer pode não suportar `ads_archive` diretamente. Vamos tentar:

#### Tentativa 1: Endpoint Completo com Token na URL

No campo de endpoint, tente:
```
ads_archive?access_token=SEU_TOKEN_AQUI&ad_reached_countries=AR&limit=5&fields=id,page
```

**Mas isso não vai funcionar no Graph API Explorer** porque ele já adiciona o token automaticamente.

#### Tentativa 2: Testar Diretamente no Navegador

1. **Copie seu token** do Graph API Explorer
2. **Abra uma nova aba**
3. **Cole esta URL** (substitua SEU_TOKEN pelo token real):
   ```
   https://graph.facebook.com/v24.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&limit=5&fields=id,page
   ```
4. **Pressione Enter**
5. **Observe o resultado:**
   - ✅ Se mostrar dados: Token funciona!
   - ❌ Se der erro: Ainda precisa autorizar

---

### Passo 4: Testar no Navegador (Recomendado)

**Esta é a melhor forma de testar:**

1. **Copie o token** do Graph API Explorer
2. **Abra uma nova aba**
3. **Cole esta URL** (substitua `SEU_TOKEN` pelo token que você copiou):
   ```
   https://graph.facebook.com/v24.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&limit=5&fields=id,page
   ```
4. **Pressione Enter**
5. **Me diga o resultado:**
   - ✅ Mostrou dados de anúncios? → Token funciona!
   - ❌ Deu erro? → Qual erro apareceu?

---

## 🧪 Teste Rápido no Navegador

**Execute este teste:**

1. **Copie o token** que está no Graph API Explorer: `EAAQX23HT1RcBQELNZBKZAZCd9jokpCxjqZCMeErJSujSQuvzKuiolak6QcEn`
2. **Abra nova aba** e cole:
   ```
   https://graph.facebook.com/v24.0/ads_archive?access_token=EAAQX23HT1RcBQELNZBKZAZCd9jokpCxjqZCMeErJSujSQuvzKuiolak6QcEn&ad_reached_countries=AR&limit=5&fields=id,page
   ```
3. **Pressione Enter**
4. **Me diga o que apareceu!**

---

## 📋 Checklist

- [ ] Autorizei em https://www.facebook.com/ads/library/api
- [ ] Gerei NOVO token após autorizar
- [ ] Testei no navegador (Passo 4)
- [ ] Token funcionou no navegador ✅
- [ ] Me enviei o token que funciona

---

## 🎯 Próximos Passos

**Execute o Passo 4 (teste no navegador) e me diga:**
- ✅ Funcionou? (mostrou anúncios) → Me envie o token!
- ❌ Deu erro? → Qual erro apareceu?

---

**O Graph API Explorer pode não suportar este endpoint diretamente. Teste no navegador!** 🚀



