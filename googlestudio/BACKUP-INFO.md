# 📦 Backup do Projeto

## Data do Backup
Criado em: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")

## Localização
`backup/googlestudio/`

## Funcionalidades Preservadas
✅ Scraper da Meta Ad Library funcionando
✅ Extração de nome da página, anúncios ativos e tempo de veiculação
✅ Sistema de salvamento de bibliotecas
✅ Frontend e Backend API

## Novas Funcionalidades Implementadas
🆕 **Atualização em Tempo Real dos Ads Ativos**
- Atualização automática a cada 5 minutos para bibliotecas em monitoramento
- Indicadores visuais de atualização em progresso
- Botão de atualização manual em cada card
- Atualização sequencial para não sobrecarregar o sistema

## Como Funciona a Atualização em Tempo Real

1. **Automática**: Bibliotecas com status "monitoring" são atualizadas automaticamente a cada 5 minutos
2. **Manual**: Clique no botão de refresh (🔄) em qualquer card para atualizar imediatamente
3. **Indicadores**: 
   - Ícone de loading ao lado de "Active Ads" durante atualização
   - Banner azul "Atualizando dados..." quando em progresso
   - Botão de refresh desabilitado durante atualização

## Endpoints da API

- `POST /api/scrape` - Scraping inicial de uma biblioteca
- `POST /api/update-library` - Atualização de uma biblioteca específica (novo)
- `POST /api/traffic` - Dados de tráfego do SimilarWeb (pausado)

## Notas Importantes

⚠️ A atualização automática só funciona para bibliotecas com status "monitoring"
⚠️ Bibliotecas pausadas não são atualizadas automaticamente
⚠️ O intervalo de atualização pode ser ajustado no código (atualmente 5 minutos)

