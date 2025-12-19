# 🔥 Script de Extração no Console do Browser

## Como Usar:

### Opção 1: Script Automático (Recomendado)

1. Abra a página do Facebook Ad Library no seu browser
2. Abra o Console (F12 → Console)
3. Cole o código do arquivo `extract-from-page.js`
4. Pressione Enter
5. O script vai:
   - Extrair nome, contagem de anúncios e landing page
   - Mostrar o resultado no console
   - Copiar automaticamente para a área de transferência

### Opção 2: Script Completo (Abra o arquivo `SCRIPT-CONSOLE-CORRIGIDO.js`)

1. Abra a página do Facebook Ad Library
2. Abra o Console (F12)
3. Abra o arquivo `SCRIPT-CONSOLE-CORRIGIDO.js` e copie TODO o conteúdo
4. Cole no console e pressione Enter

### Opção 3: Código Rápido (Simplificado)

```javascript
// Extrair nome
const name = document.querySelector('h1, h2')?.textContent?.trim() || 
             Array.from(document.querySelectorAll('span, div'))
               .find(el => el.textContent.includes('Anúncios'))
               ?.previousElementSibling?.textContent?.trim();

// Extrair contagem
const count = document.body.innerText.match(/(\d+)\s*resultados?/i)?.[1];

// Extrair landing page
const landingPage = Array.from(document.querySelectorAll('a[href^="http"]'))
  .find(a => !a.href.includes('facebook.com'))?.href || window.location.href;

console.log({ name, count, landingPage });
```

## Resultado:

O script vai retornar um objeto JSON com:
- brandName
- estimatedAdsCount
- landingPageUrl
- niche
- summary
- trafficEstimate

Você pode copiar esse JSON e colar manualmente nos campos do modal!

