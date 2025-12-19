# ✅ Token Atualizado - Próximos Passos

## ✅ Token Atualizado com Sucesso!

O token foi atualizado no arquivo `.env.local`.

---

## 🔄 PASSO 1: Reiniciar Servidor (OBRIGATÓRIO)

**No terminal onde está rodando `npm run dev`:**

1. Pressione `Ctrl+C` para parar o servidor
2. Execute novamente:
   ```powershell
   npm run dev
   ```

**⚠️ IMPORTANTE:** O servidor precisa ser reiniciado para carregar o novo token!

---

## 🧪 PASSO 2: Testar Coleta

**No outro terminal PowerShell:**

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 5 -Country "AR" -Keywords "infoproduto"
```

---

## ✅ O Que Você Deve Ver (Se Funcionar)

```
[HH:mm:ss] Iniciando coleta...
📄 Página 1...
📦 100 anúncios encontrados nesta página
✅ Salvos: 75 novos, 25 atualizados
➡️ Próxima página disponível...

[HH:mm:ss] Coleta concluida!
   Total coletado: 500
   Novos: 400
   Atualizados: 100
   Paginas processadas: 5
```

---

## ❌ Se Ainda Der Erro

### Erro: "401 Unauthorized" ou "OAuthException"
- **Causa:** Token expirou ou inválido
- **Solução:** Gere um novo token no Graph API Explorer

### Erro: "500 Internal Server Error"
- **Causa:** Problema temporário da API da Meta
- **Solução:** Aguarde alguns minutos e tente novamente

### Erro: "Rate limit"
- **Causa:** Muitas requisições
- **Solução:** Aguarde alguns minutos

---

## 🎯 Resumo

1. ✅ Token atualizado no `.env.local`
2. ⏳ **Reinicie o servidor** (Ctrl+C → npm run dev)
3. 🧪 **Teste a coleta** (comando acima)

**Depois de reiniciar o servidor, teste a coleta e me diga o resultado!**



