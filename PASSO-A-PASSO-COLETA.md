# 📋 PASSO A PASSO - Copiar e Colar

## ✅ PASSO 1: Verificar se o servidor está rodando

Abra um **NOVO** terminal PowerShell e execute:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
npm run dev
```

**Deixe este terminal aberto!** O servidor precisa estar rodando.

---

## ✅ PASSO 2: Abrir OUTRO terminal PowerShell

Abra um **SEGUNDO** terminal PowerShell (deixe o primeiro rodando o servidor).

---

## ✅ PASSO 3: Navegar para a pasta do projeto

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
```

---

## ✅ PASSO 4: Verificar o token da Meta

```powershell
.\scripts\ver-token.ps1
```

Se não aparecer um token válido, gere um novo:

```powershell
.\scripts\gerar-token-estendido.ps1
```

---

## ✅ PASSO 5: Teste rápido (5 páginas)

**COPIE E COLE TUDO DE UMA VEZ:**

```powershell
.\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 5 -Country "AR" -Keywords "infoproduto"
```

**Aguarde o resultado!** Deve mostrar quantos anúncios foram coletados.

---

## ✅ PASSO 6: Coleta completa (quando o teste funcionar)

**COPIE E COLE:**

```powershell
.\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 100 -Country "AR" -Keywords "infoproduto"
```

Isso vai coletar até 100 páginas (10.000 anúncios aproximadamente).

---

## ✅ PASSO 7: Coleta contínua (opcional)

Se quiser que rode automaticamente a cada hora:

```powershell
.\scripts\coletar-continuo.ps1 -IntervalMinutes 60 -Country "AR" -Keywords "infoproduto"
```

**Para parar:** Pressione `Ctrl+C`

---

## 🎯 COMANDOS RÁPIDOS (Copiar e Colar)

### Teste rápido (5 páginas):
```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"; .\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 5 -Country "AR" -Keywords "infoproduto"
```

### Coleta completa (100 páginas):
```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"; .\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 100 -Country "AR" -Keywords "infoproduto"
```

### Coleta do Brasil:
```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"; .\scripts\coletar-continuo.ps1 -RunOnce -MaxPages 100 -Country "BR" -Keywords "infoproduto"
```

### Coleta contínua (a cada 60 minutos):
```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"; .\scripts\coletar-continuo.ps1 -IntervalMinutes 60 -Country "AR" -Keywords "infoproduto"
```

### Coleta de todos os países:
```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"; .\scripts\coletar-todos-paises.ps1
```

---

## ⚠️ IMPORTANTE

1. **Servidor precisa estar rodando** no primeiro terminal
2. **Execute os comandos no segundo terminal**
3. **Aguarde** - a coleta pode levar vários minutos
4. **Não feche** os terminais enquanto estiver coletando

---

## 🔍 O que você vai ver:

```
========================================
  COLETA CONTÍNUA DE ANÚNCIOS
========================================

País: AR
Palavras-chave: infoproduto
Intervalo: 60 minutos
Máx. páginas por execução: 100

Modo: Execução única

[14:30:15] Iniciando coleta...
📄 Página 1...
📦 100 anúncios encontrados nesta página
✅ Salvos: 75 novos, 25 atualizados
➡️ Próxima página disponível...

[14:30:45] ✅ Coleta concluída!
   📊 Total coletado: 1250
   ✨ Novos: 800
   🔄 Atualizados: 450
   📄 Páginas processadas: 13
```

---

## ❌ Se der erro:

### Erro: "Token da Meta expirado"
```powershell
.\scripts\gerar-token-estendido.ps1
.\scripts\atualizar-token.ps1
```

### Erro: "Servidor não está rodando"
Volte ao PASSO 1 e inicie o servidor.

### Erro: "Cannot find path"
Certifique-se de estar na pasta correta:
```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
```

---

**Pronto! Copie e cole os comandos acima!** 🚀



