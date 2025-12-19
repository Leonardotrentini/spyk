# 🔧 Resolver Erro 401 Definitivamente

## ❌ Problema: Erro 401 Persistente

Mesmo após atualizar o token, o erro 401 continua aparecendo.

**Possíveis causas:**
1. Token expirou (tokens curtos duram 1-2 horas)
2. Servidor não foi reiniciado
3. Token sem permissão `ads_read`
4. Token inválido

---

## ✅ SOLUÇÃO DEFINITIVA

### PASSO 1: Gerar Token NOVO (FRESCO)

1. **Acesse:** https://developers.facebook.com/tools/explorer
2. **Selecione app:** spy (1180718484149527)
3. **Clique:** "Generate Access Token"
4. **IMPORTANTE:** Marque permissão `ads_read`
5. **Copie o token** (é longo, começa com `EAA...`)

**⚠️ Use um token RECÉM-GERADO (não use token antigo)!**

---

### PASSO 2: Testar Token no Navegador (OPCIONAL)

Cole este link no navegador (substitua `SEU_TOKEN`):

```
https://graph.facebook.com/v21.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&search_terms=test&limit=1
```

**Se funcionar:** Você verá JSON ✅  
**Se não funcionar:** Token inválido, gere outro ❌

---

### PASSO 3: Atualizar Token no Projeto

**Copie e cole TUDO** (substitua `SEU_TOKEN_NOVO`):

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
$token = "SEU_TOKEN_NOVO"
$token = $token.Trim() -replace '\s+', ''
(Get-Content .env.local) -replace 'META_ADS_LIBRARY_ACCESS_TOKEN=.*', "META_ADS_LIBRARY_ACCESS_TOKEN=$token" | Set-Content .env.local
Write-Host "Token atualizado!" -ForegroundColor Green
```

---

### PASSO 4: PARAR Servidor Completamente

**No Terminal 1 (servidor):**

1. Pressione `Ctrl+C` (pode precisar pressionar 2x)
2. Aguarde o servidor parar completamente
3. Verifique que não há mais processos rodando

---

### PASSO 5: INICIAR Servidor Novamente

**No Terminal 1:**

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
npm run dev
```

**Aguarde aparecer:**
```
Ready in XXXXms
```

**Verifique nos logs se aparece:**
```
✅ Token da Meta encontrado
🔍 Token (primeiros 20 chars): EAA...
```

Se aparecer um token diferente do que você atualizou, o arquivo não foi salvo corretamente.

---

### PASSO 6: Testar Coleta

**No Terminal 2:**

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 5 -Country "AR" -Keywords "infoproduto"
```

---

## 🔍 Verificar se Token Foi Carregado

**No Terminal 1 (servidor), quando iniciar, procure por:**

```
✅ Token da Meta encontrado
🔍 Token (primeiros 20 chars): EAA...
```

**Compare os primeiros caracteres:**
- Se for igual ao token que você atualizou = ✅ OK
- Se for diferente = ❌ Servidor não carregou o novo token

---

## ⚠️ DICAS IMPORTANTES

1. **Tokens curtos expiram rápido** (1-2 horas)
   - Se der erro 401, gere um novo token
   - Não reutilize tokens antigos

2. **Sempre reinicie o servidor** após atualizar token
   - `Ctrl+C` para parar
   - `npm run dev` para iniciar

3. **Verifique permissões do token**
   - Deve ter `ads_read`
   - Gere no Graph API Explorer com essa permissão

4. **Teste o token no navegador primeiro**
   - Se funcionar no navegador, funcionará no código
   - Se não funcionar no navegador, o token está inválido

---

## 🎯 Resumo

1. ✅ Gere token NOVO (fresco) no Graph API Explorer
2. ✅ Teste no navegador (opcional)
3. ✅ Atualize no `.env.local`
4. ✅ **PARE o servidor completamente** (`Ctrl+C`)
5. ✅ **INICIE o servidor novamente** (`npm run dev`)
6. ✅ Verifique nos logs se token foi carregado
7. ✅ Teste a coleta

**O problema geralmente é: token expirado OU servidor não reiniciado!**



