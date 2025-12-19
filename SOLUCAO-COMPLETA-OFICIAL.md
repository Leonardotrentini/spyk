# ✅ Solução Completa - Baseada na Documentação Oficial

## 📚 Fonte Oficial

- **Repositório GitHub:** https://github.com/facebookresearch/Ad-Library-API-Script-Repository
- **API Documentation:** https://www.facebook.com/ads/library/api
- **Website:** https://www.facebook.com/ads/library

---

## 🎯 Passos Completos (Baseados na Documentação Oficial)

### Passo 1: Confirmação de Identidade (Pode Ser Necessário)

Para acessar dados sensíveis (como anúncios políticos), pode ser necessário:

1. **Acesse:** https://www.facebook.com/ID
2. **Siga as instruções** para confirmar sua identidade
3. **Pode incluir:**
   - Envio de documento de identificação oficial
   - Selfie para verificação
4. **Aguarde aprovação** (pode levar alguns dias)

**Nota:** Isso pode ser necessário apenas para anúncios políticos. Para anúncios gerais, pode não ser necessário.

---

### Passo 2: Criar/Verificar App no Meta for Developers

1. **Acesse:** https://developers.facebook.com/
2. **Verifique seu app:**
   - Tipo: **Business** (recomendado)
   - Nome: `spy` (ou o que você criou)
3. **Configure a API de Marketing** (se necessário)

---

### Passo 3: Gerar Token de Acesso

1. **Acesse:** https://developers.facebook.com/tools/explorer/
2. **No painel:**
   - Selecione seu App: `spy`
   - Selecione permissões: `ads_read`
   - Clique em **"Generate Access Token"**
3. **Copie o token**

---

### Passo 4: Solicitar Acesso Avançado (Opcional mas Recomendado)

**Tokens com acesso padrão são limitados!**

1. **No painel do app:**
   - Vá para **"App Review"** ou **"Permissions and Features"**
   - Solicite **"Advanced Access"** para `ads_read`
   - Preencha o formulário explicando o uso
   - Aguarde aprovação (pode levar dias)

**Nota:** Sem acesso avançado, o token pode ter limitações de uso.

---

### Passo 5: Autorizar na Página da Biblioteca de Anúncios ⚠️ OBRIGATÓRIO

**Este é o passo que está faltando!**

1. **Acesse:** https://www.facebook.com/ads/library/api
2. **Faça login** com a conta do Facebook
3. **Leia e aceite** os termos
4. **Autorize o acesso** à API
5. **Aguarde confirmação**

---

### Passo 6: Gerar NOVO Token (Após Autorizar)

**IMPORTANTE:** Após autorizar na página, você DEVE gerar um novo token:

1. **Acesse:** https://developers.facebook.com/tools/explorer/
2. **Gere novo token** com permissão `ads_read`
3. **Copie o novo token**

---

### Passo 7: Atualizar Token no Projeto

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\atualizar-token.ps1
```

Cole o novo token.

---

### Passo 8: Testar

```powershell
.\scripts\testar-token-direto.ps1
```

**Agora deve funcionar!**

---

## 🔍 Verificações Adicionais

### Verificar no Graph API Explorer

1. **Acesse:** https://developers.facebook.com/tools/explorer/
2. **Teste endpoint:** `ads_archive?ad_reached_countries=AR&limit=5&fields=id,page`
3. **Se funcionar:** Token está OK!
4. **Se der erro:** Verifique os passos acima

---

## ⚠️ Problemas Comuns

### Problema 1: "Application does not have permission"
**Solução:** Você ainda não autorizou em https://www.facebook.com/ads/library/api

### Problema 2: Token expira rápido
**Solução:** Solicite "Advanced Access" para `ads_read`

### Problema 3: Rate limit atingido
**Solução:** 
- Aguarde alguns minutos
- Use acesso avançado para limites maiores

### Problema 4: Erro 500
**Solução:** 
- Verifique se autorizou na página
- Gere novo token após autorizar
- Tente versão diferente da API (v20.0, v19.0)

---

## 📋 Checklist Completo

- [ ] Confirmei identidade (se necessário)
- [ ] App criado/verificado no Meta for Developers
- [ ] Token gerado com `ads_read`
- [ ] Solicitei acesso avançado (opcional mas recomendado)
- [ ] **Autorizei em https://www.facebook.com/ads/library/api** ⚠️
- [ ] Gerei NOVO token após autorizar
- [ ] Atualizei token no projeto
- [ ] Testei com `testar-token-direto.ps1`
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

## 📖 Recursos

- **Repositório Oficial:** https://github.com/facebookresearch/Ad-Library-API-Script-Repository
- **API Documentation:** https://www.facebook.com/ads/library/api
- **Graph API Explorer:** https://developers.facebook.com/tools/explorer/
- **Meta for Developers:** https://developers.facebook.com/

---

**Siga TODOS os passos, especialmente o Passo 5 (autorização na página)!** 🎯



