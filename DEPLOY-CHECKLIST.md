# Checklist de Deploy - AdLib Monitor

## Pré-requisitos
- Conta no Supabase criada
- Projeto Supabase criado
- Node.js e npm/yarn instalados
- Supabase CLI instalado (`npm install -g supabase`)

---

## 1. Variáveis de Ambiente no Supabase

### No Dashboard do Supabase:
1. Acesse: **Project Settings > Edge Functions > Secrets**
2. Adicione as seguintes variáveis de ambiente:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Para o Frontend (`.env` ou `.env.local`):
Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Onde encontrar:**
- `SUPABASE_URL`: Project Settings > API > Project URL
- `SUPABASE_ANON_KEY`: Project Settings > API > Project API keys > anon public

---

## 2. Aplicar Migrations SQL

### Opção A: Via Supabase Dashboard (Recomendado para primeiro deploy)
1. Acesse: **SQL Editor** no dashboard
2. Copie o conteúdo de `supabase/migrations/001_initial_schema.sql`
3. Cole no editor e execute

### Opção B: Via Supabase CLI
```bash
# Login no Supabase
supabase login

# Link do projeto
supabase link --project-ref your-project-ref

# Aplicar migrations
supabase db push
```

---

## 3. Deploy das Edge Functions

### Via Supabase CLI:
```bash
# Instalar dependências (se necessário)
npm install

# Deploy de todas as functions
supabase functions deploy analyze-url
supabase functions deploy analyze-traffic
supabase functions deploy research-market
supabase functions deploy cron-refresh-libraries
```

### Ou deploy individual:
```bash
# analyze-url
supabase functions deploy analyze-url --no-verify-jwt

# analyze-traffic
supabase functions deploy analyze-traffic --no-verify-jwt

# research-market
supabase functions deploy research-market --no-verify-jwt

# cron-refresh-libraries
supabase functions deploy cron-refresh-libraries --no-verify-jwt
```

**Nota:** As functions já verificam JWT internamente, então `--no-verify-jwt` pode ser necessário dependendo da configuração.

---

## 4. Configurar Cron Job

1. Acesse: **Database > Cron Jobs** no dashboard do Supabase
2. Ou via SQL Editor, execute:

```sql
-- Criar cron job para refresh semanal (toda segunda-feira às 9:00 UTC)
SELECT cron.schedule(
  'refresh-libraries-weekly',
  '0 9 * * 1', -- Toda segunda-feira às 9:00 UTC
  $$
  SELECT
    net.http_post(
      url:='https://your-project-ref.supabase.co/functions/v1/cron-refresh-libraries',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
    ) AS request_id;
  $$
);
```

**Alternativa:** Use pg_cron extension se disponível:
```sql
-- Verificar se pg_cron está habilitado
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Criar job
SELECT cron.schedule(
  'refresh-libraries',
  '0 9 * * 1', -- Segunda-feira 9:00 UTC
  $$SELECT net.http_post(...)$$ -- Usar a mesma query acima
);
```

---

## 5. Testar Functions Localmente

### Instalar Supabase CLI (se não tiver):
```bash
npm install -g supabase
```

### Iniciar ambiente local:
```bash
# Iniciar Supabase local (requer Docker)
supabase start

# Setar secrets localmente
supabase secrets set GEMINI_API_KEY=your_key_here

# Servir function localmente
supabase functions serve analyze-url --env-file .env.local
```

### Testar function:
```bash
curl -X POST http://localhost:54321/functions/v1/analyze-url \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://facebook.com/ads/library/example"}'
```

---

## 6. Testar no Frontend

### Instalar dependências:
```bash
npm install
```

### Configurar variáveis de ambiente:
Crie `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Executar em desenvolvimento:
```bash
npm run dev
```

### Testar funcionalidades:
1. **Autenticação**: Faça login/cadastro no app
2. **Add Library**: Teste adicionar uma biblioteca e usar "Analyze Traffic"
3. **Traffic Analytics**: Abra o modal de tráfego de uma entrada
4. **Market Research**: Teste pesquisa de mercado por país/tópico

---

## 7. Verificar RLS (Row Level Security)

1. Acesse: **Authentication > Policies** no dashboard
2. Verifique que todas as tabelas têm políticas RLS habilitadas
3. Teste que usuários só veem seus próprios dados

**Para testar:**
```sql
-- Verificar políticas ativas
SELECT * FROM pg_policies WHERE tablename IN (
  'niches', 'boards', 'library_entries', 'library_entry_boards',
  'kanban_tasks', 'traffic_snapshots', 'market_reports'
);
```

---

## 8. Checklist de Validação

- [ ] `GEMINI_API_KEY` configurado nas Edge Functions
- [ ] `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no frontend
- [ ] Migrations aplicadas com sucesso
- [ ] Todas as 4 Edge Functions deployadas
- [ ] Cron job configurado (opcional mas recomendado)
- [ ] RLS habilitado em todas as tabelas
- [ ] Testes locais passando
- [ ] Frontend consegue autenticar
- [ ] Add Library funciona e chama analyze-url
- [ ] Traffic modal funciona e salva snapshots
- [ ] Market Research funciona com cache
- [ ] Filtros e listagens performam bem

---

## 9. Troubleshooting

### Erro: "GEMINI_API_KEY not configured"
- Verifique se a secret foi setada nas Edge Functions
- Use `supabase secrets list` para verificar

### Erro: "Unauthorized" nas functions
- Verifique se o token JWT está sendo enviado no header Authorization
- Confirme que o usuário está autenticado no frontend

### Erro: "RLS policy violation"
- Verifique se as políticas RLS estão corretas
- Confirme que `auth.uid()` retorna o ID do usuário correto

### Erro: CORS
- As Edge Functions já incluem headers CORS
- Se persistir, verifique configurações de CORS no Supabase Dashboard

### Frontend não conecta
- Verifique `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- Confirme que as variáveis começam com `VITE_` (requerido pelo Vite)
- Reinicie o servidor de desenvolvimento após alterar `.env.local`

---

## 10. Deploy em Produção

### Build do frontend:
```bash
npm run build
```

### Deploy (exemplos):
- **Vercel**: Conectar repositório e configurar env vars
- **Netlify**: `netlify deploy --prod`
- **Outros**: Fazer upload da pasta `dist/` gerada

**Importante:** Configure as mesmas variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) na plataforma de deploy.

---

## Estrutura Final Esperada

```
projeto/
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── functions/
│       ├── analyze-url/
│       ├── analyze-traffic/
│       ├── research-market/
│       └── cron-refresh-libraries/
├── lib/
│   └── supabase/
│       └── client.ts
├── services/
│   └── geminiService.ts (agora usa Edge Functions)
├── components/
│   └── ... (componentes React)
├── .env.local (não commitado)
└── package.json
```

---

## Próximos Passos (Opcional)

1. Implementar migração de dados do localStorage para Supabase
2. Adicionar paginação nas listagens
3. Implementar upload de imagens para landing pages
4. Adicionar notificações para mudanças significativas em ads count
5. Implementar analytics dashboard avançado




