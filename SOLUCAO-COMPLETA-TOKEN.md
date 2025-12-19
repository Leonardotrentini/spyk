# ✅ SOLUÇÃO COMPLETA - Token Funcionando

## 🎯 PASSO A PASSO EXATO (Copiar e Colar)

### PASSO 1: Gerar Token NOVO no Graph API Explorer

1. **Abra no navegador:**
   ```
   https://developers.facebook.com/tools/explorer
   ```

2. **Selecione seu app:**
   - No dropdown "Meta App", selecione: **"spy"** (ou o nome do seu app)
   - App ID: `1180718484149527`

3. **Gerar token:**
   - Clique em **"Generate Access Token"** (ou "Gerar token de acesso")
   - **IMPORTANTE:** Na lista de permissões, marque: `ads_read`
   - Clique em **"Generate Access Token"**

4. **Copiar token:**
   - O token aparecerá no campo "Access Token"
   - **Copie TUDO** (é longo, começa com `EAA...`)
   - **NÃO copie espaços extras**

---

### PASSO 2: Testar Token no Navegador (OPCIONAL mas Recomendado)

Cole este link no navegador (substitua `SEU_TOKEN` pelo token que você copiou):

```
https://graph.facebook.com/v21.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&search_terms=infoproduto&limit=5
```

**Se funcionar:** Você verá JSON com anúncios ✅  
**Se não funcionar:** Token inválido, gere outro ❌

---

### PASSO 3: Atualizar Token no Projeto

**Copie e cole TUDO de uma vez** (substitua `SEU_TOKEN_AQUI` pelo token real):

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
$token = "SEU_TOKEN_AQUI"
$token = $token.Trim() -replace '\s+', ''
(Get-Content .env.local) -replace 'META_ADS_LIBRARY_ACCESS_TOKEN=.*', "META_ADS_LIBRARY_ACCESS_TOKEN=$token" | Set-Content .env.local
Write-Host "Token atualizado!" -ForegroundColor Green
```

**OU use o script:**

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\atualizar-token-simples.ps1 -Token "SEU_TOKEN_AQUI"
```

---

### PASSO 4: Reiniciar Servidor (OBRIGATÓRIO)

No terminal onde está rodando `npm run dev`:

1. Pressione `Ctrl+C` para parar
2. Execute:
   ```powershell
   npm run dev
   ```

**IMPORTANTE:** Sempre reinicie o servidor após atualizar o token!

---

### PASSO 5: Testar Coleta

No outro terminal:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 5 -Country "AR" -Keywords "infoproduto"
```

---

## 🔍 Verificar se Token Foi Atualizado

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\testar-token-meta.ps1
```

**Se aparecer "SUCESSO! Token esta funcionando!"** = ✅ Tudo OK!

---

## ⚠️ PROBLEMAS COMUNS

### Erro: "Token inválido"
- **Solução:** Gere um novo token (PASSO 1)
- **Causa:** Token expirou (tokens curtos duram 1-2 horas)

### Erro: "OAuthException code: 1"
- **Solução:** Gere um novo token com permissão `ads_read`
- **Causa:** Token sem permissão correta

### Erro: "401 Unauthorized"
- **Solução:** Verifique se reiniciou o servidor após atualizar token
- **Causa:** Servidor ainda usando token antigo

---

## 🎯 RESUMO RÁPIDO

1. ✅ Gere token novo: https://developers.facebook.com/tools/explorer
2. ✅ Atualize no projeto (comando acima)
3. ✅ Reinicie servidor (`Ctrl+C` → `npm run dev`)
4. ✅ Teste coleta

**Siga os passos na ordem e me diga o resultado!**



