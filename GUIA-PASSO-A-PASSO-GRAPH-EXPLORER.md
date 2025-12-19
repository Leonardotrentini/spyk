# 🎯 Guia Passo a Passo - Graph API Explorer

## 📋 O Que Você Vê Agora

Você está no **Graph API Explorer** e deve ver:
- ✅ App selecionado: `spy`
- ✅ Token do usuário selecionado
- ✅ Permissão `ads_read` presente
- ✅ Campo de endpoint: `/me?fields=id,name`

---

## 🚀 Passo a Passo Completo

### Passo 1: Testar o Token Atual (Verificar se Funciona)

**O que fazer:**
1. **Veja o campo de endpoint** (onde está `/me?fields=id,name`)
2. **Clique no botão "Enviar" (Send)** (botão azul no canto direito)
3. **Observe o resultado:**
   - ✅ **Se aparecer dados:** Token funciona para `/me`
   - ❌ **Se der erro:** Token pode estar inválido

**Resultado esperado:**
```json
{
  "id": "4575062719405927",
  "name": "Jhonatan Guilherme da Silva"
}
```

---

### Passo 2: Testar Ads Archive (O Teste Importante!)

**O que fazer:**
1. **No campo de endpoint**, **apague** `/me?fields=id,name`
2. **Digite exatamente:**
   ```
   ads_archive?ad_reached_countries=AR&limit=5&fields=id,page
   ```
3. **Clique em "Enviar" (Send)**
4. **Observe o resultado:**
   - ✅ **Se aparecer dados de anúncios:** Token funciona! 🎉
   - ❌ **Se der erro:** Ainda precisa autorizar

**Resultado esperado (se funcionar):**
```json
{
  "data": [
    {
      "id": "...",
      "page": {
        "id": "...",
        "name": "..."
      }
    }
  ]
}
```

**Resultado esperado (se der erro):**
```json
{
  "error": {
    "message": "Application does not have permission for this action",
    "error_user_msg": "Para acessar a API, você precisa seguir as etapas em facebook.com/ads/library/api."
  }
}
```

---

### Passo 3: Interpretar o Resultado

#### ✅ Se o Passo 2 Funcionou:
**Parabéns!** O token está funcionando! 

**Próximos passos:**
1. **Copie o token** que está no campo "Token de acesso"
2. **Me envie o token**
3. **Atualizaremos no projeto**

#### ❌ Se o Passo 2 Deu Erro:
**Ainda precisa autorizar!**

**O que fazer:**
1. **Abra uma nova aba** no navegador
2. **Acesse:** https://www.facebook.com/ads/library/api
3. **Faça login** (se necessário)
4. **Autorize/aceite** o acesso
5. **Volte para o Graph API Explorer**
6. **Gere um NOVO token:**
   - Clique em **"Generate Access Token"**
   - Aceite as permissões
   - Copie o novo token
7. **Teste novamente** o Passo 2
8. **Se funcionar, me envie o token**

---

## 📝 Resumo Rápido

1. ✅ **Clique em "Enviar"** para testar `/me` (deve funcionar)
2. ✅ **Mude o endpoint** para `ads_archive?ad_reached_countries=AR&limit=5&fields=id,page`
3. ✅ **Clique em "Enviar"** novamente
4. ✅ **Me diga o resultado:**
   - Funcionou? → Me envie o token
   - Deu erro? → Autorize em https://www.facebook.com/ads/library/api e gere novo token

---

## 🎯 O Que Fazer Agora

**Execute o Passo 2 acima e me diga:**
- ✅ Funcionou? (mostrou anúncios)
- ❌ Deu erro? (qual erro apareceu?)

**Depois me envie o token que está funcionando!**

---

**Vamos lá! Execute o Passo 2 e me diga o resultado!** 🚀



