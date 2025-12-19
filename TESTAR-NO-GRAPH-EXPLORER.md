# 🧪 Testar Ads Archive no Graph API Explorer

## ✅ Status Atual

Você está no **Graph API Explorer** e:
- ✅ Token está funcionando (`/me` retornou dados)
- ✅ Permissão `ads_read` está presente
- ❌ Mas ainda dá erro ao acessar Ads Archive

---

## 🧪 Teste Direto no Graph API Explorer

Vamos testar o endpoint `ads_archive` **diretamente na interface da Meta** para ver se funciona:

### Passo 1: Testar Endpoint Simples

1. **No campo de endpoint** (onde está `/me?fields=id,name`), **substitua por:**
   ```
   ads_archive?ad_reached_countries=AR&limit=5&fields=id,page
   ```

2. **Clique em "Enviar"** (Send)

3. **Observe o resultado:**
   - ✅ **Se funcionar:** Você verá dados de anúncios
   - ❌ **Se der erro:** Você verá o erro completo na resposta

### Passo 2: Interpretar o Resultado

#### ✅ Se Funcionar:
- O token está OK!
- O problema pode estar no nosso código
- Me envie o resultado

#### ❌ Se Der Erro:

**Se aparecer erro 400 com:**
```json
{
  "error": {
    "message": "Application does not have permission for this action",
    "error_user_msg": "Para acessar a API, você precisa seguir as etapas em facebook.com/ads/library/api."
  }
}
```

**Isso confirma:** Você precisa autorizar na página https://www.facebook.com/ads/library/api

---

## 🔍 Teste Alternativo: Versão da API

Se o teste acima falhar, tente com versão diferente:

1. **Mude a versão** de `v24.0` para `v21.0` (no dropdown de versão)
2. **Teste novamente** com o mesmo endpoint:
   ```
   ads_archive?ad_reached_countries=AR&limit=5&fields=id,page
   ```

---

## 📋 Endpoints para Testar

### Teste 1: Simples (sem keywords)
```
ads_archive?ad_reached_countries=AR&limit=5&fields=id,page
```

### Teste 2: Com keywords
```
ads_archive?ad_reached_countries=AR&search_terms=infoproduto&limit=5&fields=id,page,ad_creative_bodies
```

### Teste 3: Mínimo (apenas país)
```
ads_archive?ad_reached_countries=AR&limit=5
```

---

## 🎯 O Que Fazer Agora

1. **Teste o endpoint `ads_archive` no Graph API Explorer**
2. **Me diga o resultado:**
   - Funcionou? ✅
   - Deu erro? ❌ (qual erro?)

---

## 💡 Dica

Se der erro no Graph API Explorer também, isso confirma que:
- **Não é problema do nosso código**
- **É problema de autorização na página da Meta**
- **Você precisa acessar:** https://www.facebook.com/ads/library/api

---

**Teste agora e me diga o resultado!** 🚀



