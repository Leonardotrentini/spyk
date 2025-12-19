# 🚀 Como Executar o Script de Token

## Passo a Passo

### 1. Abrir PowerShell

- Pressione `Win + X`
- Selecione **"Windows PowerShell"** ou **"Terminal"**
- Ou procure por "PowerShell" no menu Iniciar

### 2. Navegar para a Pasta do Projeto

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
```

### 3. Executar o Script

```powershell
.\scripts\gerar-token-estendido.ps1
```

**OU** se estiver dentro da pasta `scripts`:

```powershell
cd scripts
.\gerar-token-estendido.ps1
```

---

## Se Der Erro de Permissão

Se aparecer erro sobre "execução de scripts está desabilitada", execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Depois tente executar o script novamente.

---

## O que o Script Vai Pedir

1. **App ID** - Número do seu app (encontre em Settings > Basic)
2. **App Secret** - Chave secreta (encontre em Settings > Basic, clique em "Show")
3. **Token Curto** - Gere no Graph API Explorer (veja COMO-GERAR-TOKEN-META.md)

O script vai gerar automaticamente um token de 60 dias e mostrar na tela!

---

## Comando Completo (Copiar e Colar)

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\gerar-token-estendido.ps1
```



