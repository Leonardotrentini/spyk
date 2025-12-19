<<<<<<< HEAD
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

=======
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1A-EvGigk3LgdfiZAB-RQhBtzgRhufgO-

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
>>>>>>> 67aac4f327c2bf1a6214bcda81527dfb41c16f57
