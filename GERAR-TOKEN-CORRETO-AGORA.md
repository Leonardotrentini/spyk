# 🔑 Gerar Token Correto - Passo a Passo

## ⚠️ Problema Atual

O token que você mostrou está retornando **erro 400**, o que significa:
- Token pode estar inválido/expirado
- Token pode não ter as permissões corretas
- Precisa gerar um **NOVO token**

---

## 🎯 Passo a Passo para Gerar Token Correto

### Passo 1: Autorizar na Página da Ads Library API ⚠️ OBRIGATÓRIO

**ANTES de gerar o token, você DEVE autorizar:**

1. **Acesse:** https://www.facebook.com/ads/library/api
2. **Faça login** com sua conta do Facebook
3. **Leia e aceite** os termos
4. **Autorize o acesso** à API
5. **Aguarde confirmação** de que foi autorizado

**⚠️ SEM ISSO, O TOKEN NÃO VAI FUNCIONAR!**

---

### Passo 2: Gerar Novo Token no Graph API Explorer

1. **Acesse:** https://developers.facebook.com/tools/explorer/

2. **No topo da página:**
   - **Selecione seu App:** `spy` (ou o ID: 1180718484149527)
   - **Selecione "User Token"** (não App Token!)
   - **Selecione a permissão:** `ads_read`
   - **Clique em "Generate Access Token"**

3. **Se aparecer popup de login:**
   - Faça login com sua conta do Facebook
   - Aceite as permissões solicitadas
   - Autorize o acesso

4. **Copie o token gerado**
   - O token deve começar com `EAA...`
   - Deve ter aproximadamente 200-300 caracteres

---

### Passo 3: Verificar Token no Graph API Explorer

Antes de usar no projeto, teste diretamente no Graph API Explorer:

1. **No campo de endpoint**, digite:
   ```
   ads_archive?ad_reached_countries=AR&limit=5&fields=id,page
   ```

2. **Clique em "Enviar" (Send)**

3. **Observe o resultado:**
   - ✅ **Se funcionar:** Você verá dados de anúncios
   - ❌ **Se der erro:** O token ainda não está autorizado

---

### Passo 4: Atualizar Token no Projeto

Se o token funcionou no Graph API Explorer:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\atualizar-token.ps1
```

Cole o novo token quando solicitado.

---

### Passo 5: Testar no Projeto

```powershell
.\scripts\testar-token-direto.ps1
```

**Agora o Teste 2D deve passar!**

---

## ⚠️ Erros Comuns

### Erro: "Application does not have permission"
**Causa:** Você não autorizou em https://www.facebook.com/ads/library/api
**Solução:** Volte ao Passo 1 e autorize

### Erro: "Invalid OAuth access token"
**Causa:** Token expirado ou inválido
**Solução:** Gere um novo token (Passo 2)

### Erro: "Token expira rápido"
**Causa:** Token de curta duração
**Solução:** 
- Gere token estendido (60 dias)
- Ou solicite "Advanced Access" no app

---

## 🔍 Diferença: User Token vs App Token

### ✅ User Token (USE ESTE!)
- **Formato:** `EAA...` (longo, ~200-300 caracteres)
- **Uso:** Para acessar dados do usuário
- **Ads Library API:** **Requer este tipo!**

### ❌ App Token (NÃO USE!)
- **Formato:** `{app_id}|{app_secret}`
- **Uso:** Apenas para operações do app
- **Ads Library API:** **NÃO funciona com este tipo!**

---

## 📋 Checklist

- [ ] Autorizei em https://www.facebook.com/ads/library/api
- [ ] Gerei novo token no Graph API Explorer
- [ ] Selecionei "User Token" (não App Token)
- [ ] Selecionei permissão `ads_read`
- [ ] Testei o token no Graph API Explorer
- [ ] Token funcionou no Graph API Explorer ✅
- [ ] Atualizei token no projeto
- [ ] Testei no projeto com `testar-token-direto.ps1`
- [ ] Teste 2D passou ✅

---

## 🚀 Próximos Passos Após Funcionar

Quando o token funcionar:

1. **Teste a coleta:**
   ```powershell
   $body = @{
       country = "AR"
       keywords = "infoproduto"
       maxPages = 5
   } | ConvertTo-Json
   
   Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect-full" -Method POST -ContentType "application/json" -Body $body
   ```

2. **Inicie coleta contínua:**
   ```powershell
   .\scripts\coletar-continuo.ps1 -Country "AR" -Keywords "infoproduto" -MaxPages 10
   ```

---

**Siga TODOS os passos, especialmente o Passo 1 (autorização)!** 🎯



