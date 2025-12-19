# 🐛 Como Debugar o Scraper

## Problema: Nenhum anúncio encontrado (0 hits)

Se o scraper está rodando mas não encontra anúncios, siga estes passos:

## 1. Rodar em modo visível (não headless)

Edite o arquivo `.env` e adicione:

```env
ADLIB_SCRAPER_HEADLESS=false
```

Isso vai abrir o navegador para você ver o que está acontecendo.

## 2. Testar com keyword mais específica

A keyword "teste" pode não retornar resultados. Tente:

```bash
npm run scrape:keywords -- --keywords "infoproduto" --country BR
```

Ou:

```bash
npm run scrape:keywords -- --keywords "marketing digital" --country BR
```

## 3. Verificar se a página carregou

O scraper agora salva um screenshot quando `headless=false`. Verifique o arquivo `debug-search.png` na raiz do projeto.

## 4. Inspecionar o DOM manualmente

1. Abra o navegador manualmente
2. Acesse: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=infoproduto&search_type=keyword_unordered`
3. Abra o DevTools (F12)
4. Inspecione os cards de anúncio
5. Veja quais seletores CSS eles usam

## 5. Ajustar seletores CSS

Se os seletores estiverem errados, edite `src/scrapers/adLibrarySearch.ts` na linha ~56 e ajuste:

```typescript
// Seletores atuais (podem estar desatualizados)
const adCards = document.querySelectorAll('[data-testid*="ad"], .x1y1aw1k, [role="article"]');
```

Substitua pelos seletores corretos que você encontrou no DevTools.

## 6. Verificar logs de debug

O scraper agora mostra logs detalhados:
- Quantos cards foram encontrados com cada seletor
- Cards sem pageId (para identificar problemas de extração)

## 7. Testar URL diretamente

Cole a URL no navegador e veja se retorna resultados:
```
https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=infoproduto&search_type=keyword_unordered
```

Se não retornar nada no navegador, o problema não é o scraper, é que realmente não há anúncios para aquela keyword.

## 8. Verificar se precisa fazer login

Algumas vezes o Facebook pode pedir login. Se isso acontecer:
- O scraper vai falhar silenciosamente
- Você verá no navegador (se `headless=false`)
- Considere adicionar autenticação (mais complexo)

## Próximos Passos

1. Rode com `headless=false` para ver o que acontece
2. Teste com keywords mais específicas
3. Verifique o screenshot `debug-search.png`
4. Ajuste os seletores se necessário

