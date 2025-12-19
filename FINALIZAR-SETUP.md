# ✅ Finalizar Setup - Terminais 1 e 2

## 🖥️ Configuração dos Terminais

### TERMINAL 1: Servidor (npm run dev)

**Este terminal deve estar rodando o servidor:**

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
npm run dev
```

**Você deve ver:**
```
▲ Next.js 14.2.33
Local: http://localhost:3000
Ready in XXXXms
```

**⚠️ IMPORTANTE:** Este terminal deve ficar aberto e rodando!

---

### TERMINAL 2: Scripts de Coleta

**Este terminal é onde você executa os comandos:**

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 5 -Country "AR" -Keywords "infoproduto"
```

---

## ✅ Checklist Final

### [ ] Terminal 1 está rodando?
- Abra um terminal PowerShell
- Execute: `cd "C:\Users\Leonardo trentini\Desktop\spy"`
- Execute: `npm run dev`
- Deve aparecer: "Ready in XXXXms"
- **Deixe este terminal aberto!**

### [ ] Token está atualizado?
- Arquivo: `.env.local`
- Linha: `META_ADS_LIBRARY_ACCESS_TOKEN=EAA...`
- Token deve ter ~300 caracteres

### [ ] Servidor foi reiniciado após atualizar token?
- Se atualizou o token, precisa reiniciar o servidor
- No Terminal 1: `Ctrl+C` → `npm run dev`

### [ ] Testar coleta no Terminal 2?
- Abra outro terminal PowerShell
- Execute o comando de coleta

---

## 🔧 Se Ainda Der Erro 401

### 1. Verificar se servidor está rodando

No Terminal 1, você deve ver:
```
Ready in XXXXms
```

Se não estiver rodando, inicie:
```powershell
npm run dev
```

### 2. Verificar token no servidor

No Terminal 1 (servidor), quando iniciar, deve aparecer nos logs:
```
✅ Token da Meta encontrado
🔍 Token (primeiros 20 chars): EAA...
```

Se aparecer um token diferente, o servidor não carregou o novo token.

### 3. Reiniciar servidor

Se o token foi atualizado mas o servidor não foi reiniciado:

1. No Terminal 1: Pressione `Ctrl+C`
2. Execute: `npm run dev`
3. Aguarde aparecer "Ready"
4. Teste a coleta no Terminal 2

---

## 🎯 Comandos Rápidos

### Terminal 1 (Servidor):
```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
npm run dev
```

### Terminal 2 (Coleta):
```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 5 -Country "AR" -Keywords "infoproduto"
```

---

## ✅ Resumo

1. **Terminal 1:** Servidor rodando (`npm run dev`)
2. **Terminal 2:** Executar scripts de coleta
3. **Token:** Atualizado no `.env.local`
4. **Servidor:** Reiniciado após atualizar token

**Se tudo estiver OK, a coleta deve funcionar!**



