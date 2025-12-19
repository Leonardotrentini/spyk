# 🔑 Como Pegar o Token Correto - Guia Definitivo

## 🎯 ONDE PEGAR O TOKEN (Passo a Passo)

### PASSO 1: Acessar Graph API Explorer

**Abra no navegador:**
```
https://developers.facebook.com/tools/explorer
```

---

### PASSO 2: Selecionar o App

1. **No topo da página**, você verá um dropdown: **"Meta App"** ou **"Aplicativo"**
2. **Clique no dropdown**
3. **Selecione seu app:** "spy" (ou o nome do seu app)
   - App ID: `1180718484149527`

**⚠️ IMPORTANTE:** Se não aparecer seu app, você precisa criar um primeiro (veja abaixo)

---

### PASSO 3: Gerar Token

1. **Procure o botão:** **"Generate Access Token"** ou **"Gerar token de acesso"**
   - Geralmente está no topo direito
   - Ou ao lado do campo "Access Token"

2. **Clique no botão**

3. **Uma janela popup vai abrir** pedindo permissões

4. **IMPORTANTE:** Na lista de permissões, **MARQUE:**
   - ✅ `ads_read`
   - ✅ Pode ter outras, mas `ads_read` é OBRIGATÓRIO

5. **Clique em:** **"Generate Access Token"** ou **"Gerar token de acesso"**

---

### PASSO 4: Copiar o Token

1. **O token aparecerá no campo "Access Token"** (campo grande no topo)

2. **O token é LONGO** (geralmente ~300 caracteres)
   - Começa com: `EAA...`
   - É uma string contínua (sem espaços, sem quebras)

3. **Copie TUDO:**
   - Clique no campo do token
   - Selecione tudo (`Ctrl+A`)
   - Copie (`Ctrl+C`)

**⚠️ CUIDADO:**
- Copie TUDO de uma vez
- Não deixe espaços no início ou fim
- Não quebre em linhas
- É uma string contínua muito longa

---

## 📋 Exemplo de Token Válido

Um token válido se parece com isso:

```
EAAQx23HT1RcBQAdRvgJTBnk7ZCafBxjo6qV8drcoD1XjZCWZA4BYAFjxSBBIqj3tqgBxutzs7oGa6zFryRNnmSZClsTRyUJDUHVFAjIJUfEQPNrNWDiyvkLvmUwjASoXqbaC5rykBie7byr9ZCf9eWfsSs8AUQU7Qi7104TEnRsRbPI6w5QvRQiToauERkmITxza4SPk97wlIusZAIubS9d0L2
```

**Características:**
- ✅ Começa com `EAA`
- ✅ Tem ~250-300 caracteres
- ✅ É uma string contínua (sem espaços)
- ✅ Só tem letras e números

---

## 🆘 Se Não Aparecer o App no Dropdown

### Criar App Novo:

1. Acesse: https://developers.facebook.com/apps/
2. Clique em **"Criar App"** ou **"Create App"**
3. Escolha tipo: **"Business"** ou **"Other"**
4. Preencha:
   - Nome: "Spy Tool" (ou qualquer nome)
   - Email: Seu email
5. Clique em **"Criar App"**
6. **NÃO precisa adicionar produtos** (Ads Library API é pública)
7. Volte ao Graph API Explorer e selecione o app criado

---

## ✅ Verificar se Token Está Correto

### Teste no Navegador:

Cole este link (substitua `SEU_TOKEN`):

```
https://graph.facebook.com/v21.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&search_terms=test&limit=1
```

**Se funcionar:**
- Você verá JSON com dados de anúncios ✅
- Token está OK!

**Se não funcionar:**
- Você verá uma mensagem de erro ❌
- Token está inválido ou sem permissão

---

## 🔧 Atualizar Token no Projeto

Depois de copiar o token:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
$token = "COLE_O_TOKEN_COMPLETO_AQUI"
$token = $token.Trim() -replace '\s+', ''
(Get-Content .env.local) -replace 'META_ADS_LIBRARY_ACCESS_TOKEN=.*', "META_ADS_LIBRARY_ACCESS_TOKEN=$token" | Set-Content .env.local
Write-Host "Token atualizado! Reinicie o servidor." -ForegroundColor Green
```

---

## ⚠️ IMPORTANTE

1. **Tokens expiram rápido** (1-2 horas para tokens de usuário)
2. **Sempre gere token FRESCO** (não reutilize tokens antigos)
3. **Sempre reinicie servidor** após atualizar token
4. **Teste no navegador primeiro** antes de usar no código

---

## 🎯 Resumo Rápido

1. ✅ Acesse: https://developers.facebook.com/tools/explorer
2. ✅ Selecione seu app no dropdown
3. ✅ Clique em "Generate Access Token"
4. ✅ Marque permissão: `ads_read`
5. ✅ Copie o token COMPLETO (é longo!)
6. ✅ Teste no navegador (link acima)
7. ✅ Se funcionar, atualize no projeto
8. ✅ Reinicie servidor

**É isso! Siga esses passos e você terá o token correto!**



