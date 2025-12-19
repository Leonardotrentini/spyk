# 🚀 Guia de Deploy na Vercel

## 📋 Pré-requisitos

1. Conta na Vercel (gratuita): https://vercel.com
2. Projeto no GitHub (recomendado) ou GitLab/Bitbucket
3. Node.js 18+ (a Vercel usa automaticamente)

## 🔧 Configuração

### 1. Estrutura do Projeto

O projeto está configurado para:
- **Frontend**: React + Vite (deploy automático)
- **Backend**: Vercel Serverless Functions (na pasta `api/`)

### 2. Arquivos de Configuração

- ✅ `vercel.json` - Configuração do projeto
- ✅ `api/*.js` - Serverless Functions (substituem `api/server.js`)
- ✅ `.vercelignore` - Arquivos ignorados no deploy

## 📦 Deploy

### Opção 1: Via Vercel CLI (Recomendado)

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# No diretório do projeto
cd googlestudio

# Fazer login
vercel login

# Deploy
vercel

# Para produção
vercel --prod
```

### Opção 2: Via GitHub (Recomendado para CI/CD)

1. **Conectar repositório GitHub:**
   - Acesse https://vercel.com/dashboard
   - Clique em "Add New Project"
   - Conecte seu repositório GitHub
   - Selecione o diretório `googlestudio`

2. **Configurações automáticas:**
   - Framework: Vite (detectado automaticamente)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy automático:**
   - Cada push para `main` faz deploy automático
   - Pull requests geram previews

## ⚙️ Variáveis de Ambiente

### Em Produção (Vercel Dashboard)

1. Acesse: **Settings → Environment Variables**
2. Adicione (se necessário):
   - `NODE_ENV=production` (já configurado)
   - `VITE_API_URL` (deixe vazio para usar URL relativa)

### Em Desenvolvimento Local

Crie `.env.local`:
```env
VITE_API_URL=http://localhost:3001
```

## 🔍 Endpoints da API

Após o deploy, os endpoints estarão disponíveis em:

- `https://seu-projeto.vercel.app/api/scrape`
- `https://seu-projeto.vercel.app/api/update-library`
- `https://seu-projeto.vercel.app/api/traffic`

## ⚠️ Limitações Importantes

### 1. Puppeteer na Vercel

**⚠️ ATENÇÃO**: Puppeteer pode não funcionar bem em ambientes serverless da Vercel devido a:
- Limitações de memória (512MB no plano gratuito)
- Timeout de 60 segundos (pode ser insuficiente para scraping)
- Falta de suporte completo ao Chrome headless

**Soluções alternativas:**
1. **Usar serviço externo** (Browserless.io, ScrapingBee, etc.)
2. **Deploy do backend separado** (Railway, Render, Fly.io)
3. **Usar API oficial** quando disponível

### 2. SimilarWeb Scraper

O scraper do SimilarWeb (`/api/traffic`) pode retornar dados vazios na Vercel devido às limitações do Puppeteer.

### 3. Meta Ad Library Scraper

O scraper principal (`/api/scrape` e `/api/update-library`) deve funcionar, mas pode ter timeouts em bibliotecas muito grandes.

## 🧪 Testar Localmente com Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Rodar localmente (simula ambiente Vercel)
vercel dev
```

## 📊 Monitoramento

Após o deploy, você pode:
- Ver logs em tempo real no dashboard da Vercel
- Monitorar performance e erros
- Ver analytics de uso

## 🔄 Atualizações

Cada push para o branch principal faz deploy automático. Para rollback:
1. Acesse o dashboard da Vercel
2. Vá em "Deployments"
3. Clique nos 3 pontos do deployment anterior
4. Selecione "Promote to Production"

## 📝 Notas Finais

- ✅ Frontend funciona perfeitamente na Vercel
- ⚠️ Backend (scrapers) pode ter limitações
- 💡 Considere usar serviços externos para scraping pesado
- 🔒 Dados são salvos no localStorage (não há backend de banco de dados)

## 🆘 Troubleshooting

### Erro: "Function exceeded maximum duration"
- Aumente `maxDuration` no `vercel.json` (máximo 60s no plano gratuito)

### Erro: "Module not found"
- Verifique se todos os imports estão corretos
- Certifique-se de que `node_modules` está no `.vercelignore`

### Puppeteer não funciona
- Normal em serverless. Considere alternativas mencionadas acima.

