# 🔄 Mudar App de "Ao vivo" para "Desenvolvimento"

## ❌ Problema Identificado

O app está em modo **"Ao vivo"** (Live), o que pode causar problemas com tokens de usuário.

---

## ✅ SOLUÇÃO: Mudar para Modo Desenvolvimento

### PASSO 1: Mudar o Toggle

Na tela que você está vendo:

1. **Localize o toggle** ao lado de "Modo do aplicativo: desenvolvimento"
2. **O toggle está ligado** (azul do lado direito) = "Ao vivo" ❌
3. **Clique no toggle** para desligar
4. **O toggle deve ficar desligado** (azul do lado esquerdo) = "Desenvolvimento" ✅

**Visual:**
```
❌ ANTES: [desenvolvimento] ●━━━━━━━━ [Ao vivo]  (toggle ligado)
✅ DEPOIS: [desenvolvimento] ━━━━━━━━○ [Ao vivo]  (toggle desligado)
```

---

### PASSO 2: Confirmar Mudança

1. Após clicar no toggle, o modo deve mudar para **"Desenvolvimento"**
2. Pode aparecer uma mensagem de confirmação
3. Aguarde a mudança ser salva

---

### PASSO 3: Gerar Novo Token

**IMPORTANTE:** Gere um NOVO token após mudar o modo!

1. Acesse: https://developers.facebook.com/tools/explorer
2. Selecione seu app: **spy** (1180718484149527)
3. Clique em **"Generate Access Token"**
4. Marque permissão: ✅ `ads_read`
5. Copie o token completo

---

### PASSO 4: Atualizar Token no Projeto

Depois de copiar o novo token, me envie e eu atualizo automaticamente.

**OU** use este comando:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
$token = "COLE_O_NOVO_TOKEN_AQUI"
$token = $token.Trim() -replace '\s+', ''
(Get-Content .env.local) -replace 'META_ADS_LIBRARY_ACCESS_TOKEN=.*', "META_ADS_LIBRARY_ACCESS_TOKEN=$token" | Set-Content .env.local
Write-Host "Token atualizado! Reinicie o servidor." -ForegroundColor Green
```

---

## ⚠️ Por Que Isso Importa?

- **Modo "Ao vivo":** App publicado, pode restringir tokens de usuário
- **Modo "Desenvolvimento":** Permite usar tokens de usuário normalmente

**Para desenvolvimento/testes, SEMPRE use modo Desenvolvimento!**

---

## 🎯 Resumo

1. ✅ Clique no toggle para mudar de "Ao vivo" → "Desenvolvimento"
2. ✅ Gere um NOVO token no Graph API Explorer
3. ✅ Me envie o token ou atualize manualmente
4. ✅ Reinicie o servidor
5. ✅ Teste a coleta

**Mude o toggle AGORA e gere um novo token!**



