# 🧪 Como Testar se o Token da Meta Está Funcionando

## Teste Rápido no Navegador

Abra este link no navegador (substitua `SEU_TOKEN` pelo token do seu `.env.local`):

```
https://graph.facebook.com/v21.0/ads_archive?access_token=SEU_TOKEN&ad_reached_countries=AR&search_terms=infoproduto&limit=5
```

**Se funcionar:** Você verá JSON com anúncios  
**Se não funcionar:** Você verá uma mensagem de erro

---

## Verificar se o Token Foi Atualizado

### Opção 1: Ver no arquivo

```powershell
Get-Content .env.local | Select-String "META_ADS_LIBRARY_ACCESS_TOKEN"
```

### Opção 2: Abrir arquivo

```powershell
notepad .env.local
```

Verifique se a linha `META_ADS_LIBRARY_ACCESS_TOKEN=` tem o token completo.

---

## Se o Token Está Inválido

### Gerar Novo Token (Rápido)

1. Acesse: https://developers.facebook.com/tools/explorer
2. Selecione seu app
3. Clique em **"Generate Access Token"**
4. Selecione permissão: `ads_read`
5. Copie o token

### Atualizar no Projeto

```powershell
.\scripts\atualizar-token.ps1
```

Cole o novo token quando pedir.

### Reiniciar Servidor

**IMPORTANTE:** Sempre reinicie o servidor após atualizar o token!

```powershell
# Pare o servidor (Ctrl+C)
npm run dev
```

---

## Verificar Logs do Servidor

No terminal onde está rodando `npm run dev`, você deve ver:
- `✅ Token da Meta encontrado`
- `🔍 Token (primeiros 20 chars): EAA...`

Se aparecer um token diferente do que você espera, o arquivo não foi atualizado corretamente.



