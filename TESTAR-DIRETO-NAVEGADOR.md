# 🌐 Testar Token Diretamente no Navegador

## 🎯 Objetivo

Testar o token **diretamente no navegador** para ver o erro REAL que a Meta está retornando.

---

## 📋 Passo a Passo

### Passo 1: Copiar Token

1. **Acesse:** https://developers.facebook.com/tools/explorer/
2. **Copie o token completo** (do campo "Token de acesso")

---

### Passo 2: Testar no Navegador

**Cole esta URL no navegador** (substitua `SEU_TOKEN` pelo token que você copiou):

```
https://graph.facebook.com/v24.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&limit=5&fields=id,page
```

**Exemplo:**
```
https://graph.facebook.com/v24.0/ads_archive?access_token=EAAQX23HT1RcBQ...&ad_reached_countries=AR&limit=5&fields=id,page
```

---

### Passo 3: Ver o Resultado

**Se funcionar:**
- Você verá um JSON com dados de anúncios
- Copie o token e atualize no projeto

**Se der erro:**
- Você verá um JSON com o erro completo
- **Me envie o erro completo** (tire print ou copie o JSON)

---

## 🔍 Erros Comuns

### Erro 1: "Application does not have permission"

```json
{
  "error": {
    "message": "Application does not have permission for this action",
    "error_user_msg": "Para acessar a API, você precisa seguir as etapas em facebook.com/ads/library/api."
  }
}
```

**Solução:**
1. Acesse: https://www.facebook.com/ads/library/api
2. Autorize o acesso
3. Gere um NOVO token

---

### Erro 2: "Malformed access token"

```json
{
  "error": {
    "message": "Malformed access token",
    "code": 190
  }
}
```

**Solução:**
- Token está cortado ou inválido
- Gere um novo token no Graph API Explorer

---

### Erro 3: "OAuthException"

```json
{
  "error": {
    "message": "Error validating access token",
    "type": "OAuthException",
    "code": 190
  }
}
```

**Solução:**
- Token expirou
- Gere um novo token

---

## 🎯 O Que Fazer

1. **Teste no navegador** com a URL acima
2. **Me envie o resultado:**
   - ✅ Funcionou? → Me envie o token!
   - ❌ Deu erro? → Me envie o erro completo (JSON)

---

**Teste no navegador e me diga o que apareceu!** 🚀


