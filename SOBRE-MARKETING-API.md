# 📚 Sobre Marketing API vs Ads Library API

## ⚠️ São Diferentes!

- **Marketing API**: Para gerenciar campanhas, criar anúncios, etc. (requer configuração)
- **Ads Library API**: Para consultar anúncios públicos (não precisa ser adicionada como produto)

---

## ✅ Ads Library API NÃO Precisa Ser Adicionada

A **Ads Library API** é uma API **pública** e **não precisa** aparecer na lista de produtos. Ela funciona diretamente via Graph API com um token válido.

---

## 🤔 Mas Pode Tentar Adicionar Marketing API

Se quiser tentar, pode adicionar "API de Marketing":

1. Clique em **"Configurar"** no card "API de Marketing"
2. Siga as instruções
3. Depois gere um novo token

**MAS:** Isso pode não resolver o problema, pois são APIs diferentes.

---

## 🎯 Recomendação: Teste o MODO MOCK Primeiro

Antes de continuar tentando configurar produtos, **teste o sistema com dados mockados**:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect" -Method POST -ContentType "application/json" -Body '{"country": "AR", "keywords": "infoproduto", "useMock": true}'
```

Isso vai:
- ✅ Funcionar SEM token
- ✅ Testar todo o sistema
- ✅ Validar banco, interface, filtros
- ✅ Você pode desenvolver enquanto resolve o token depois

---

## 🔍 O Problema Real do Token

O problema provavelmente é:

1. **Token sem permissão `ads_read`** - Verifique no Graph API Explorer
2. **Token expirado** - Tokens de usuário expiram rápido
3. **App em modo incorreto** - Deve estar em "Development Mode"

---

## ✅ Próximos Passos

1. **Teste com MOCK primeiro** (comando acima)
2. **Verifique se tudo funciona** (interface, banco)
3. **Depois resolva o token** (sem pressa)

---

**Teste o modo MOCK agora e me diga se funcionou!**



