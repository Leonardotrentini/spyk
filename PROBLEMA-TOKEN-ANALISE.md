# 🔍 Análise do Problema com Token

## ❌ Situação Atual

Você está em um loop: gera token → atualiza → testa → erro 401 → repete.

## 🔍 Possíveis Causas

### 1. Token Expira Muito Rápido
- Tokens de usuário expiram em **1-2 horas**
- Se você gerar e testar depois de algumas horas, já expirou
- **Solução:** Use token imediatamente após gerar

### 2. Token Sem Permissão Correta
- Token precisa ter permissão `ads_read`
- Se não tiver, sempre dará erro 401
- **Solução:** Verifique permissões ao gerar token

### 3. Next.js Não Recarrega .env.local
- Next.js pode não recarregar `.env.local` automaticamente
- Mesmo atualizando o arquivo, servidor pode usar token antigo
- **Solução:** Sempre reiniciar servidor após atualizar token

### 4. App da Meta Não Configurado
- App pode estar em modo de desenvolvimento
- Pode precisar de aprovação
- **Solução:** Verificar configurações do app

---

## ✅ SOLUÇÃO DEFINITIVA

### Opção 1: Usar Modo MOCK (Para Testar Sistema)

Enquanto resolve o token, use dados mockados:

```powershell
$body = @{
    country = "AR"
    keywords = "infoproduto"
    maxPages = 5
    useMock = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect-full" -Method POST -ContentType "application/json" -Body $body
```

Isso testa o sistema sem precisar de token válido.

### Opção 2: Verificar Token no Servidor

**No Terminal 1 (servidor), quando iniciar, procure por:**

```
✅ Token da Meta encontrado
🔍 Token (primeiros 20 chars): EAA...
```

**Compare com o token que você atualizou:**
- Se for igual = Token foi carregado ✅
- Se for diferente = Servidor não recarregou ❌

### Opção 3: Testar Token ANTES de Usar

**Sempre teste o token no navegador primeiro:**

```
https://graph.facebook.com/v21.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&search_terms=test&limit=1
```

**Se funcionar no navegador:**
- Token está OK ✅
- Problema pode ser no código ou servidor

**Se não funcionar no navegador:**
- Token está inválido ❌
- Gere um novo token

---

## 🎯 Checklist de Debug

1. [ ] Token foi gerado AGORA (não há mais de 1 hora)?
2. [ ] Token tem permissão `ads_read`?
3. [ ] Token funciona no navegador (teste acima)?
4. [ ] Servidor foi reiniciado após atualizar token?
5. [ ] Logs do servidor mostram o token correto?

---

## 💡 Recomendação

**Use o modo MOCK primeiro para testar o sistema:**

O sistema já tem modo MOCK implementado. Use isso para:
- Testar se a coleta funciona
- Testar se o banco está OK
- Testar se a interface funciona

**Depois resolva o token da Meta separadamente.**

---

## 🔧 Próximos Passos

1. **Teste com MOCK** para verificar se sistema funciona
2. **Se MOCK funcionar:** Problema é só com token da Meta
3. **Se MOCK não funcionar:** Problema é no código/sistema

**Vou adicionar mais logs para debugar o problema do token!**



