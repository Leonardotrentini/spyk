# LATAM DR INTEL

Ferramenta de Inteligência Competitiva para Infoprodutos DR na América Latina.

## 🚀 MVP Rápido

Para começar rapidamente com apenas **Supabase + Meta Ads Library**, veja o guia [MVP-SETUP.md](./MVP-SETUP.md)

## Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database & Auth)
- Anthropic Claude / OpenAI GPT

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (crie um arquivo `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
META_ADS_LIBRARY_ACCESS_TOKEN=your_meta_token
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
```

3. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

- `/app` - Páginas e rotas (App Router)
- `/components` - Componentes React reutilizáveis
- `/lib` - Utilitários e configurações (Supabase, etc.)
- `/app/api` - Rotas de API do Next.js
- `/types` - Definições TypeScript

## Notas Importantes

- **Free Tiers**: O projeto foi otimizado para usar os tiers gratuitos do Vercel e Supabase
- **Rate Limits**: A Meta Ads Library API tem limites de requisições. Monitore o uso
- **Custos de IA**: Cada processamento consome tokens da API. Monitore os custos
- **Puppeteer**: O scraping de landing pages usa Puppeteer. No Vercel (serverless), considere:
  - Usar um serviço externo de scraping (ex: ScrapingBee, Apify)
  - Usar Edge Functions do Supabase para scraping
  - Executar scraping em um servidor dedicado ou VPS
  - Usar a rota `/api/landing-pages/scrape-simple` para scraping básico sem Puppeteer

## Documentação Completa

Consulte o arquivo `SETUP.md` para um guia detalhado de configuração e uso.

