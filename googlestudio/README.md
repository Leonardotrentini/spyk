# AdLib Monitor

Ferramenta de monitoramento de bibliotecas de anúncios do Meta/Facebook com integração Supabase.

## 🚀 Configuração Rápida

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na pasta `googlestudio/` com:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Como obter:**
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em Settings > API
4. Copie "Project URL" para `VITE_SUPABASE_URL`
5. Copie "anon public" key para `VITE_SUPABASE_ANON_KEY`

### 2. Habilitar Autenticação Anônima

A aplicação usa autenticação anônima do Supabase. Para habilitar:

1. No Supabase Dashboard, vá em **Authentication > Providers**
2. Procure por **Anonymous Sign-ins**
3. **Habilite** o toggle

Isso permite que a aplicação crie sessões anônimas automaticamente para cada usuário.

### 3. Executar Migrations

Certifique-se de que as migrations do Supabase foram executadas. O arquivo `supabase/migrations/002_adlib_monitor_schema.sql` deve ter sido aplicado ao seu banco de dados.

### 4. Deploy Edge Functions (Opcional)

Se você quiser usar a função de análise de URLs, certifique-se de que a Edge Function `analyze-url` está deployada:

```bash
cd supabase
supabase functions deploy analyze-url
```

## 📦 Instalação

```bash
cd googlestudio
npm install
```

## 🏃 Executar

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🏗️ Build

```bash
npm run build
```

## 📁 Estrutura

```
googlestudio/
├── lib/
│   ├── supabase.ts          # Cliente Supabase
│   ├── dataService.ts       # Serviços de dados (CRUD)
│   └── scraperService.ts    # Serviços de scraping
├── components/              # Componentes React
├── App.tsx                  # Componente principal
└── types.ts                 # Definições TypeScript
```

## 🔧 Funcionalidades

- ✅ Monitoramento de bibliotecas de anúncios
- ✅ Análise automática de URLs via Edge Function
- ✅ Filtros e busca
- ✅ Boards personalizados
- ✅ Sistema de nichos
- ✅ Kanban de tarefas
- ✅ Estatísticas e gráficos

## 🐛 Troubleshooting

### Erro "User not authenticated"
- Verifique se a autenticação anônima está habilitada no Supabase
- Verifique se as variáveis de ambiente estão configuradas corretamente

### Erro ao carregar dados
- Verifique se as migrations foram executadas
- Verifique as políticas RLS no Supabase
- Verifique os logs do navegador para mais detalhes

### Edge Function não funciona
- Verifique se a função está deployada
- Verifique se o usuário tem permissão para chamar a função
- Verifique os logs da Edge Function no Supabase Dashboard
