# 🔍 Debug - Página em Branco

## ✅ O que foi corrigido:

1. **Adicionado script no index.html** - O Vite precisa do script module para carregar o React

## 🔧 Se ainda estiver em branco, verifique:

### 1. Console do Navegador (F12)
Abra o DevTools (F12) e veja se há erros no Console. Possíveis erros:

- **Erro de módulo não encontrado** → Problema de importação
- **Erro de Supabase** → Variáveis de ambiente não configuradas
- **Erro de React** → Dependências não instaladas

### 2. Terminal do Servidor
Verifique se há erros no terminal onde está rodando `npm run dev`

### 3. Recarregue a Página
- Pressione `Ctrl + Shift + R` para hard refresh
- Ou `F5` para recarregar

### 4. Verifique se .env.local existe
```powershell
Test-Path ".env.local"
```

Se não existir, crie com:
```
VITE_SUPABASE_URL=https://acnbcideqohtjidtlrvi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjbmJjaWRlcW9odGppZHRscnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTYwMjksImV4cCI6MjA4MTUzMjAyOX0.Qc0EXTZiQ2AwxnAwqAje6oVEPbWVReaocJAYK3fKw2c
```

### 5. Reinstale Dependências (se necessário)
```powershell
npm install
```

## 🚀 Teste Novamente:

1. Salve o arquivo `index.html` (já corrigido)
2. Recarregue a página no navegador (Ctrl + Shift + R)
3. Verifique o console (F12) para ver se há erros

## 💡 Dica:

Se ainda estiver em branco, me mostre:
1. O que aparece no **Console do navegador** (F12 → Console)
2. O que aparece no **terminal do servidor**




