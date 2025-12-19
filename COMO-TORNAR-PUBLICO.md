# 🔓 Como Tornar o Repositório Público no GitHub

## Método 1: Via Interface Web do GitHub (Mais Fácil)

1. **Acesse seu repositório:**
   - Vá para: https://github.com/Leonardotrentini/spyk

2. **Acesse as configurações:**
   - Clique na aba **"Settings"** (no topo do repositório)

3. **Role até a seção "Danger Zone":**
   - Desça até a parte inferior da página
   - Procure a seção chamada **"Danger Zone"** (área vermelha/laranja)

4. **Altere a visibilidade:**
   - Clique no botão **"Change visibility"**
   - Selecione **"Make public"**
   - Digite o nome do repositório (`Leonardotrentini/spyk`) para confirmar
   - Clique em **"I understand, change repository visibility"**

5. **Pronto!** 🎉
   - O repositório agora é público e pode ser acessado por qualquer pessoa

---

## Método 2: Via GitHub CLI (Terminal)

Se você tem o GitHub CLI instalado:

```powershell
# Instalar GitHub CLI (se não tiver)
winget install --id GitHub.cli

# Autenticar
gh auth login

# Mudar visibilidade para público
cd "C:\Users\Leonardo trentini\Desktop\spy"
gh repo edit Leonardotrentini/spyk --visibility public
```

---

## Método 3: Via API do GitHub

```powershell
# Você precisará de um Personal Access Token do GitHub
# Criar token: https://github.com/settings/tokens
# Permissões necessárias: repo

$token = "seu_token_aqui"
$repo = "Leonardotrentini/spyk"

Invoke-RestMethod -Uri "https://api.github.com/repos/$repo" `
  -Method PATCH `
  -Headers @{Authorization = "token $token"} `
  -Body (@{private = $false} | ConvertTo-Json)
```

---

## ⚠️ IMPORTANTE ANTES DE TORNAR PÚBLICO

Antes de tornar público, verifique se não há informações sensíveis:

1. **Checklist de Segurança:**
   - [ ] Remover tokens/API keys do código
   - [ ] Verificar se `.env.local` está no `.gitignore`
   - [ ] Remover credenciais do histórico Git (se necessário)
   - [ ] Verificar se não há dados pessoais sensíveis

2. **Arquivos que NÃO devem estar no repositório:**
   - `.env.local`
   - `.env`
   - Chaves de API
   - Tokens de acesso
   - Senhas
   - Credenciais do Supabase

3. **Como verificar:**
   ```powershell
   cd "C:\Users\Leonardo trentini\Desktop\spy"
   # Verificar se .env.local está no .gitignore
   Get-Content .gitignore | Select-String "\.env"
   ```

---

## 📝 Após Tornar Público

Depois que o repositório for público, você pode:

1. Compartilhar o link: `https://github.com/Leonardotrentini/spyk`
2. Adicionar ao README informações sobre como contribuir
3. Adicionar badges e documentação completa

---

## 🆘 Problemas Comuns

**Erro: "You don't have permission"**
- Verifique se você é o dono do repositório
- Ou se tem permissões de admin

**Erro: "Repository not found"**
- Verifique se o nome do repositório está correto
- Verifique se você está logado na conta correta

---

**Dica:** Se você já fez commit de arquivos sensíveis antes de tornar público, considere usar `git-filter-branch` ou ferramentas como `git-secrets` para limpar o histórico.

