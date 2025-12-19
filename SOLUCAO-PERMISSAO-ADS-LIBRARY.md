# ✅ SOLUÇÃO: Permissão Ads Library API

## 🎯 Problema Identificado!

O erro **2D** mostrou o problema real:

```json
{
  "error": {
    "message": "Application does not have permission for this action",
    "type": "OAuthException",
    "code": 10,
    "error_subcode": 2332002,
    "error_user_title": "Autorização e login necessários",
    "error_user_msg": "Para acessar a API, você precisa seguir as etapas em facebook.com/ads/library/api."
  }
}
```

---

## ✅ O Que Está Funcionando

- ✅ **Token está VÁLIDO** (Teste 1 passou)
- ✅ **Token tem escopo `ads_read`** (mostrado na ferramenta de debug)
- ❌ **MAS a aplicação não tem permissão para usar a Ads Library API**

---

## 🔧 Solução: Autorizar Acesso à Ads Library API

A Meta exige que você **autorize explicitamente** o acesso à Ads Library API, mesmo tendo o token com `ads_read`.

### Passo 1: Acessar a Página de Autorização

1. **Acesse:** https://www.facebook.com/ads/library/api
2. **Faça login** com a conta do Facebook que gerou o token
3. **Leia e aceite os termos** (se aparecer)

### Passo 2: Verificar Autorização

Após autorizar, você deve ver uma página confirmando que tem acesso à API.

### Passo 3: Gerar Novo Token (Opcional)

Após autorizar, pode ser necessário gerar um novo token:

1. Acesse: https://developers.facebook.com/tools/explorer/
2. Selecione seu app: **spy** (ID: 1180718484149527)
3. Selecione permissão: `ads_read`
4. Clique em **"Generate Access Token"**
5. Copie o token

### Passo 4: Atualizar Token no Projeto

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\atualizar-token.ps1
```

Cole o novo token quando solicitado.

---

## 🧪 Testar Após Autorização

Após autorizar e atualizar o token, teste novamente:

```powershell
.\scripts\testar-token-direto.ps1
```

**Agora o Teste 2D deve passar!**

---

## 📋 Checklist

- [ ] Acessei https://www.facebook.com/ads/library/api
- [ ] Fiz login com a conta que gerou o token
- [ ] Autorizei o acesso à API
- [ ] Gerei novo token (opcional, mas recomendado)
- [ ] Atualizei o token no projeto
- [ ] Testei novamente com `testar-token-direto.ps1`
- [ ] Teste 2D passou ✅

---

## ⚠️ Importante

- **Mesmo com `ads_read` no token, você precisa autorizar na página da Ads Library API**
- **Isso é uma etapa separada e obrigatória**
- **Depois de autorizar, o token deve funcionar normalmente**

---

## 🎯 Próximos Passos

1. **Acesse:** https://www.facebook.com/ads/library/api
2. **Autorize o acesso**
3. **Teste novamente:** `.\scripts\testar-token-direto.ps1`
4. **Se funcionar, teste a coleta:** `.\scripts\coletar-continuo.ps1`

---

**Esse é o problema! Resolva isso e tudo deve funcionar!** 🚀



