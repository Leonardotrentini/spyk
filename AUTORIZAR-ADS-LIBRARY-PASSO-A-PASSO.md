# 🔐 Autorizar Ads Library API - Passo a Passo

## ⚠️ Erro Atual

Você ainda está recebendo este erro:

```json
{
  "error": {
    "message": "Application does not have permission for this action",
    "error_user_msg": "Para acessar a API, você precisa seguir as etapas em facebook.com/ads/library/api."
  }
}
```

**Isso significa que você ainda não autorizou o acesso na página da Meta.**

---

## 📋 Passo a Passo Completo

### Passo 1: Acessar a Página de Autorização

1. **Abra seu navegador** (Chrome, Edge, Firefox, etc.)
2. **Acesse:** https://www.facebook.com/ads/library/api
3. **Faça login** com a conta do Facebook que gerou o token
   - Email: (o mesmo que você usa no Facebook)
   - Senha: (sua senha do Facebook)

### Passo 2: Autorizar o Acesso

Na página, você deve ver:

- **Título:** "Ads Library API"
- **Texto explicativo** sobre a API
- **Botão ou link** para autorizar/aceitar

**Ações necessárias:**

1. **Leia os termos** (se aparecer)
2. **Clique em "Aceitar"** ou **"Autorizar"** ou **"Get Started"**
3. **Aguarde a confirmação** de que o acesso foi autorizado

### Passo 3: Verificar Autorização

Após autorizar, você deve ver uma página confirmando:

- ✅ "Você tem acesso à Ads Library API"
- ✅ Ou uma mensagem similar de sucesso

### Passo 4: Gerar Novo Token (IMPORTANTE!)

**Após autorizar, você DEVE gerar um novo token:**

1. **Acesse:** https://developers.facebook.com/tools/explorer/
2. **No topo da página:**
   - **Selecione seu App:** `spy` (ou o ID: 1180718484149527)
   - **Selecione a permissão:** `ads_read`
   - **Clique em "Generate Access Token"**
3. **Copie o token** que aparece

### Passo 5: Atualizar Token no Projeto

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\atualizar-token.ps1
```

Cole o novo token quando solicitado.

### Passo 6: Testar Novamente

```powershell
.\scripts\testar-token-direto.ps1
```

**Agora o Teste 2D deve passar!**

---

## 🔍 Como Saber se Autorizou Corretamente

### ✅ SUCESSO:
- Teste 2D retorna **SUCESSO** ou **200 OK**
- Ou retorna dados de anúncios
- Não aparece mais o erro "Application does not have permission"

### ❌ AINDA NÃO AUTORIZOU:
- Teste 2D ainda retorna erro **400**
- Mensagem: "Application does not have permission for this action"
- Mensagem: "Para acessar a API, você precisa seguir as etapas em facebook.com/ads/library/api"

---

## ⚠️ Problemas Comuns

### Problema 1: "Página não encontrada" ou "404"
- **Solução:** Verifique se está acessando: https://www.facebook.com/ads/library/api
- **Não use:** developers.facebook.com/ads/library/api (sem o "www")

### Problema 2: "Você não tem permissão"
- **Solução:** Certifique-se de estar logado com a **mesma conta** que gerou o token
- **Verifique:** O email da conta no Facebook deve ser o mesmo usado no Graph API Explorer

### Problema 3: "Não vejo botão de autorizar"
- **Solução:** 
  - Tente acessar em modo anônimo/privado
  - Limpe o cache do navegador
  - Tente outro navegador

### Problema 4: "Autorizei mas ainda dá erro"
- **Solução:** 
  - Gere um **NOVO token** após autorizar
  - Tokens antigos não têm a autorização
  - Atualize o token no projeto

---

## 🎯 Checklist Final

- [ ] Acessei https://www.facebook.com/ads/library/api
- [ ] Fiz login com a conta correta
- [ ] Autorizei/aceitei o acesso à API
- [ ] Vi confirmação de sucesso
- [ ] Gerei um NOVO token no Graph API Explorer
- [ ] Atualizei o token no projeto com `atualizar-token.ps1`
- [ ] Testei novamente com `testar-token-direto.ps1`
- [ ] Teste 2D passou ✅

---

## 📞 Se Ainda Não Funcionar

Se após seguir todos os passos o erro persistir:

1. **Tire print** da página https://www.facebook.com/ads/library/api
2. **Tire print** do Graph API Explorer mostrando o token
3. **Me envie os prints** para eu ver o que está acontecendo

---

## 🚀 Próximos Passos Após Autorizar

Quando o Teste 2D passar:

1. **Teste a coleta:**
   ```powershell
   $body = @{
       country = "AR"
       keywords = "infoproduto"
       maxPages = 5
   } | ConvertTo-Json
   
   Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect-full" -Method POST -ContentType "application/json" -Body $body
   ```

2. **Se funcionar, inicie a coleta contínua:**
   ```powershell
   .\scripts\coletar-continuo.ps1 -Country "AR" -Keywords "infoproduto" -MaxPages 10
   ```

---

**Siga esses passos e me diga o resultado!** 🎯



