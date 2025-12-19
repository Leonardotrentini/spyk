# 🔑 Como Gerar Token da Meta Ads Library

## Problema
Erro: `OAuthException` - Token expirado ou inválido

## Solução: Gerar Novo Token

### Passo 1: Acessar Graph API Explorer

1. Acesse: https://developers.facebook.com/tools/explorer
2. Faça login com sua conta do Facebook

### Passo 2: Selecionar seu App

1. No topo da página, no dropdown "Meta App", selecione o app que você criou
2. Se não aparecer, você precisa criar um app primeiro (veja META-APP-SETUP.md)

### Passo 3: Gerar Token

1. Clique no botão **"Generate Access Token"** (ou "Gerar token de acesso")
2. Uma janela popup vai abrir
3. **IMPORTANTE:** Selecione a permissão: `ads_read`
4. Clique em **"Generate Access Token"**

### Passo 4: Copiar o Token

1. O token será exibido no campo "Access Token"
2. **Copie o token completo** (é longo, começa com `EAA...`)

### Passo 5: Atualizar no Projeto

1. Abra o arquivo `.env.local` na raiz do projeto
2. Atualize a linha:
   ```
   META_ADS_LIBRARY_ACCESS_TOKEN=seu_novo_token_aqui
   ```
3. **Salve o arquivo**

### Passo 6: Reiniciar Servidor

```powershell
# Pare o servidor (Ctrl+C)
npm run dev
```

### Passo 7: Testar Novamente

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect" -Method POST -ContentType "application/json" -Body '{"country": "AR", "keywords": "infoproduto"}'
```

---

## ⚠️ Importante

- **Tokens de usuário expiram em 1-2 horas**
- Para uso contínuo, você precisará gerar tokens periodicamente
- Para produção, considere usar um token de sistema (mais complexo de configurar)

## 🔄 Alternativa: Token de Longa Duração

1. No Graph API Explorer, após gerar o token
2. Clique em "i" (informações) ao lado do token
3. Role até "Extend Access Token" ou "Estender Token"
4. Isso pode gerar um token que dura até 60 dias

---

## Teste Rápido do Token

Você pode testar o token diretamente no navegador:

```
https://graph.facebook.com/v21.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&search_terms=infoproduto&limit=5
```

Substitua `SEU_TOKEN` pelo token gerado. Se funcionar, você verá JSON com anúncios.



