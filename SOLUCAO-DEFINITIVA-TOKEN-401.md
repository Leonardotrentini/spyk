# 🔧 Solução Definitiva para Erro 401

## ❌ Situação Atual

Mesmo com:
- ✅ Token atualizado (305 caracteres)
- ✅ App em modo Desenvolvimento
- ✅ Token sendo carregado corretamente
- ✅ Logs mostram token correto

**Ainda dá erro 401 OAuthException**

---

## 🔍 Possíveis Causas

### 1. Token Sem Permissão `ads_read`
- Token pode não ter a permissão correta
- **Solução:** Verificar permissões do token

### 2. App Precisa de Configuração Adicional
- App pode precisar ter "Ads Library API" adicionada como produto
- **Solução:** Adicionar produto no app

### 3. Limitação da Conta
- Conta pode ter limitações
- **Solução:** Verificar status da conta

### 4. Token Expira Muito Rápido
- Tokens de usuário expiram em 1-2 horas
- **Solução:** Usar token de sistema (mais complexo)

---

## ✅ SOLUÇÃO IMEDIATA: Usar Modo MOCK

Enquanto resolve o token, use dados mockados para testar o sistema:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
$body = @{
    country = "AR"
    keywords = "infoproduto"
    maxPages = 5
    useMock = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect-full" -Method POST -ContentType "application/json" -Body $body
```

**Isso vai:**
- ✅ Coletar dados MOCK (simulados)
- ✅ Salvar no banco de dados
- ✅ Testar se o sistema funciona
- ✅ Não precisa de token da Meta

---

## 🔍 Verificar Permissões do Token

### No Graph API Explorer:

1. Após gerar o token, clique no **ícone "i"** (informações) ao lado do token
2. Ou acesse: https://developers.facebook.com/tools/debug/accesstoken/
3. Cole o token e clique em **"Debug"**
4. Verifique se `ads_read` está na lista de permissões

**Se `ads_read` NÃO estiver:**
- Token está sem permissão correta
- Gere um novo token e marque `ads_read`

---

## 🎯 Próximos Passos

### Opção 1: Testar com MOCK (Recomendado Agora)

Teste o sistema com dados mockados para verificar se tudo funciona:

```powershell
$body = @{ country = "AR"; keywords = "infoproduto"; maxPages = 5; useMock = $true } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect-full" -Method POST -ContentType "application/json" -Body $body
```

### Opção 2: Verificar Permissões do Token

1. Acesse: https://developers.facebook.com/tools/debug/accesstoken/
2. Cole o token atual
3. Clique em "Debug"
4. Veja se `ads_read` está listado

### Opção 3: Adicionar Ads Library API como Produto

1. Acesse: https://developers.facebook.com/apps/1180718484149527
2. Menu lateral → **"Add Products"** ou **"Adicionar Produtos"**
3. Procure por **"Ads Library API"**
4. Clique em **"Set Up"** ou **"Configurar"**

---

## 💡 Recomendação

**Teste com MOCK primeiro** para verificar se o sistema funciona. Se MOCK funcionar, o problema é só com o token da Meta.

**Depois resolva o token separadamente.**

---

## 📋 Checklist

- [ ] Testou com MOCK? (deve funcionar)
- [ ] Verificou permissões do token? (`ads_read` está listado?)
- [ ] Adicionou "Ads Library API" como produto no app?
- [ ] Token foi gerado DEPOIS de mudar para modo Desenvolvimento?

---

**Teste com MOCK agora e me diga o resultado!**



