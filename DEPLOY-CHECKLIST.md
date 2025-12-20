# Checklist de Deploy na Vercel

## ✅ Configuração na Interface Vercel

1. **Root Directory**: `googlestudio`
2. **Framework Preset**: `Vite` ou `Other`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

## 🔑 Variáveis de Ambiente OBRIGATÓRIAS

Adicione estas variáveis na seção "Environment Variables":

- `VITE_SUPABASE_URL` = sua URL do Supabase (ex: https://xxxxx.supabase.co)
- `VITE_SUPABASE_ANON_KEY` = sua chave anon do Supabase

⚠️ **IMPORTANTE**: Sem essas variáveis, a aplicação ficará em branco!

## 🐛 Debug de Tela Branca

Se a aplicação aparecer em branco após o deploy:

1. Abra o Console do Navegador (F12 > Console)
2. Procure por erros relacionados a:
   - `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY`
   - Erros de autenticação do Supabase
   - Erros de importação de módulos

3. Verifique se as variáveis de ambiente foram configuradas corretamente na Vercel:
   - Vá em Settings > Environment Variables
   - Certifique-se de que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas
   - Faça um novo deploy após adicionar/atualizar as variáveis

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:

- [ ] A aplicação carrega sem erros no console
- [ ] O ErrorBoundary aparece se houver erro (em vez de tela branca)
- [ ] As variáveis de ambiente estão configuradas
- [ ] O build foi bem-sucedido na Vercel

