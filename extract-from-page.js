// 🔥 SCRIPT PARA RODAR NO CONSOLE DO BROWSER
// Cole este código no console quando estiver na página do Facebook Ad Library

(function() {
  console.log("🔥 Iniciando extração ultra-violenta...");
  
  // Extrair nome da página
  let pageName = null;
  
  // Método 1: Buscar em headings
  const headings = document.querySelectorAll('h1, h2, h3');
  for (const h of headings) {
    const text = h.textContent.trim();
    if (text && !text.includes('Ad Library') && !text.includes('Facebook') && text.length < 100) {
      pageName = text;
      console.log("✅ Nome encontrado em heading:", pageName);
      break;
    }
  }
  
  // Método 2: Buscar texto antes de "Anúncios" (MELHORADO)
  if (!pageName) {
    const allText = document.body.innerText;
    const anunciosIndex = allText.indexOf('Anúncios');
    if (anunciosIndex > -1) {
      // Buscar mais contexto antes de "Anúncios"
      const beforeAnuncios = allText.substring(Math.max(0, anunciosIndex - 500), anunciosIndex);
      
      // Procurar por palavras que aparecem perto de "Anúncios"
      const words = beforeAnuncios.match(/\b[a-zA-Z][a-zA-Z0-9\s]{2,50}\b/g);
      if (words && words.length > 0) {
        // Pegar palavras antes de "Anúncios", ignorando palavras comuns
        const commonWords = ['Anúncios', 'Ads', 'Sobre', 'About', 'Meta', 'Facebook', 'Biblioteca', 'resultados', 'results', 'Tudo', 'All', 'Todos', 'Click', 'yourself', 'with', 'brasil', 'official'];
        
        // Pegar a última palavra válida antes de "Anúncios"
        for (let i = words.length - 1; i >= 0; i--) {
          const word = words[i].trim();
          const lowerWord = word.toLowerCase();
          if (word.length >= 2 && 
              word.length <= 50 && 
              !commonWords.some(cw => lowerWord.includes(cw.toLowerCase())) &&
              !word.match(/^\d+$/)) {
            pageName = word;
            console.log("✅ Nome encontrado antes de Anúncios:", pageName);
            break;
          }
        }
      }
      
      // Método alternativo: buscar em elementos DOM
      if (!pageName) {
        const elementos = Array.from(document.querySelectorAll('*'));
        for (const el of elementos) {
          if (el.textContent && el.textContent.includes('Anúncios')) {
            const prev = el.previousElementSibling || el.parentElement?.previousElementSibling;
            if (prev && prev.textContent) {
              const text = prev.textContent.trim();
              if (text.length >= 2 && text.length <= 50 && 
                  !text.match(/^(Anúncios|Ads|Sobre|About|Meta|Facebook|Biblioteca)$/i)) {
                pageName = text.split('\n')[0].trim(); // Pega primeira linha
                console.log("✅ Nome encontrado em elemento DOM:", pageName);
                break;
              }
            }
          }
        }
      }
    }
  }
  
  // Método 3: Buscar em spans/divs com texto grande
  if (!pageName) {
    const largeText = Array.from(document.querySelectorAll('span, div'))
      .map(el => el.textContent.trim())
      .filter(text => text.length >= 2 && text.length <= 50 && !text.includes('Facebook'))
      .find(text => /^[a-zA-Z]/.test(text));
    
    if (largeText) {
      pageName = largeText;
      console.log("✅ Nome encontrado em elemento:", pageName);
    }
  }
  
  // Extrair contagem de anúncios
  let adCount = null;
  const allText = document.body.innerText;
  const countMatch = allText.match(/(~?\s*\d+)\s*resultados?/i);
  if (countMatch) {
    adCount = parseInt(countMatch[1].replace(/[~\s,]/g, ''), 10);
    console.log("✅ Contagem encontrada:", adCount);
  }
  
  // Extrair landing page
  let landingPage = window.location.href;
  const links = Array.from(document.querySelectorAll('a[href^="http"]'))
    .map(a => a.href)
    .find(href => !href.includes('facebook.com') && !href.includes('fbcdn'));
  
  if (links) {
    landingPage = links;
    console.log("✅ Landing page encontrada:", landingPage);
  }
  
  const result = {
    brandName: pageName || 'Unknown',
    estimatedAdsCount: adCount || 10,
    landingPageUrl: landingPage,
    niche: 'E-commerce',
    summary: `Ad Library entry${adCount ? ` with ${adCount} active ads` : ''}`,
    trafficEstimate: 'Unknown'
  };
  
  console.log("🎯 RESULTADO FINAL:", result);
  console.log("📋 COPIE ESTE JSON:");
  console.log(JSON.stringify(result, null, 2));
  
  // Copiar para clipboard automaticamente
  navigator.clipboard.writeText(JSON.stringify(result, null, 2)).then(() => {
    console.log("✅ JSON copiado para clipboard!");
  });
  
  return result;
})();

