# 🔧 Configurar Git e Conectar ao Repositório

## ✅ Comandos para Executar

Execute estes comandos no PowerShell na pasta do projeto:

```powershell
# 1. Navegar para a pasta do projeto
cd "C:\Users\Leonardo trentini\Desktop\spy"

# 2. Inicializar Git (se ainda não foi feito)
git init

# 3. Adicionar remote origin
git remote add origin https://github.com/Leonardotrentini/spyk.git

# OU se já existir, atualizar:
git remote set-url origin https://github.com/Leonardotrentini/spyk.git

# 4. Verificar se foi configurado
git remote -v

# 5. Ver status
git status
```

## 📤 Primeiro Push (se necessário)

Se você ainda não fez push do código para o repositório:

```powershell
# Adicionar todos os arquivos (exceto os ignorados pelo .gitignore)
git add .

# Fazer commit
git commit -m "feat: Integrate Google Studio frontend with Next.js backend"

# Fazer push para o repositório remoto
git push -u origin main
```

**Nota:** Se der erro porque o branch local não é "main", tente:
```powershell
git branch -M main
git push -u origin main
```

## 📥 Se quiser clonar em outra pasta

Se você quiser clonar o repositório em uma pasta separada para comparar:

```powershell
cd "C:\Users\Leonardo trentini\Desktop"
gh repo clone Leonardotrentini/spyk spyk-clone
```

Ou usando Git tradicional:
```powershell
cd "C:\Users\Leonardo trentini\Desktop"
git clone https://github.com/Leonardotrentini/spyk.git spyk-clone
```

## 🔄 Sincronizar com o Remoto

Para baixar as mudanças do GitHub:

```powershell
git fetch origin
git pull origin main
```

Para enviar suas mudanças:

```powershell
git add .
git commit -m "sua mensagem de commit"
git push origin main
```

## ⚠️ Verificações Importantes

Antes de fazer push, certifique-se de que:

1. ✅ `.env.local` está no `.gitignore` (já está!)
2. ✅ Não há tokens/chaves hardcoded no código
3. ✅ `node_modules` está ignorado (já está!)

## 🔐 Se precisar de autenticação

Se pedir usuário/senha, use:
- **Token de acesso pessoal** do GitHub (não sua senha)
- Criar token: https://github.com/settings/tokens
- Permissões: `repo` (full control)

