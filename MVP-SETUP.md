# Setup MVP - Apenas Supabase + Meta Ads Library

Este guia é para configurar o MVP mínimo que funciona **apenas com Supabase e Meta Ads Library**, sem necessidade de IA ou scraping complexo.

## ✅ O que funciona no MVP

- ✅ Coleta de anúncios da Meta Ads Library
- ✅ Armazenamento no Supabase
- ✅ Processamento básico (sem IA) - extrai dados simples dos anúncios
- ✅ Interface de exploração com filtros
- ✅ Sistema de favoritos
- ✅ Top 5 Players

## ❌ O que NÃO está no MVP

- ❌ Processamento com IA (opcional, pode adicionar depois)
- ❌ Scraping de landing pages (opcional)
- ❌ Screenshots automáticos

## Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No SQL Editor, execute o arquivo `lib/supabase/migrations.sql`
3. **NÃO precisa** executar o `storage-setup.sql` (só se quiser screenshots depois)

### 3. Configurar Variáveis de Ambiente

Crie `.env.local`:

```env
# OBRIGATÓRIO
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# OBRIGATÓRIO
META_ADS_LIBRARY_ACCESS_TOKEN=seu_token_meta

# OPCIONAL (não precisa para MVP)
# ANTHROPIC_API_KEY=
# OPENAI_API_KEY=
```

### 4. Obter Token da Meta Ads Library

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie um app do tipo "Business"
3. Vá em "Tools" > "Graph API Explorer"
4. Selecione seu app
5. Gere um Access Token com permissão `ads_read`
6. Use este token na variável `META_ADS_LIBRARY_ACCESS_TOKEN`

**Nota:** Tokens de usuário expiram rápido. Para produção, use um token de sistema ou configure OAuth.

### 5. Executar o Projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 6. Coletar Dados

#### Opção 1: Via Interface (quando implementar botão)

Por enquanto, use a API diretamente:

#### Opção 2: Via API (Recomendado para MVP)

**Coletar anúncios:**

```bash
curl -X POST http://localhost:3000/api/meta-ads \
  -H "Content-Type: application/json" \
  -d '{
    "country": "AR",
    "keywords": "infoproduto"
  }'
```

**Processar anúncios coletados (básico, sem IA):**

```bash
curl -X POST http://localhost:3000/api/process/batch
```

Ou processar um anúncio específico:

```bash
curl -X POST http://localhost:3000/api/process/basic \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "uuid-do-anuncio"
  }'
```

### 7. Usar a Interface

1. Crie uma conta em `/login`
2. Acesse `/explorar`
3. Veja os anúncios coletados e processados

## Como Funciona o Processamento Básico

O processamento básico (`/api/process/basic`) faz:

1. **Extrai domínio** da URL da landing page
2. **Cria/atualiza player** baseado no domínio
3. **Detecta nicho** por palavras-chave simples:
   - "dinero", "ganar" → Dinero Online
   - "salud", "perder peso" → Salud
   - "relacion", "amor" → Relaciones
4. **Tenta extrair preço** (busca padrões como $99, 99 USD)
5. **Calcula Score DR básico** (30-100) baseado em palavras-chave de DR
6. **Atualiza estatísticas** do player

## Limitações do MVP

- **Nicho:** Detecção básica por palavras-chave (pode errar)
- **Preço:** Extração simples (pode não encontrar)
- **Score DR:** Cálculo básico (menos preciso que IA)
- **Sem detalhes:** Não extrai bônus, garantia, gatilhos mentais complexos

## Próximos Passos (Opcional)

Depois que o MVP estiver funcionando, você pode adicionar:

1. **IA para processamento melhorado:**
   - Configure `ANTHROPIC_API_KEY` ou `OPENAI_API_KEY`
   - Use `/api/process/ai` em vez de `/api/process/basic`

2. **Scraping de landing pages:**
   - Configure Puppeteer ou serviço externo
   - Use `/api/landing-pages/scrape`

3. **Melhorias na interface:**
   - Botão para coletar anúncios
   - Processamento automático após coleta
   - Dashboard com estatísticas

## Troubleshooting

**Erro ao coletar anúncios:**
- Verifique se o token da Meta está válido
- Verifique se tem permissão `ads_read`
- Tokens de usuário expiram rápido - gere um novo

**Nenhum anúncio aparece:**
- Execute `/api/process/batch` para processar os anúncios coletados
- Verifique se há dados em `raw_ads` no Supabase

**Erro de autenticação:**
- Verifique as variáveis de ambiente do Supabase
- Certifique-se de que executou as migrations SQL



