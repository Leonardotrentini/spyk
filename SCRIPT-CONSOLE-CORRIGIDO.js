// 🔥 SCRIPT PARA RODAR NO CONSOLE DO BROWSER - VERSÃO CORRIGIDA
// Cole este código COMPLETO no console quando estiver na página do Facebook Ad Library

(function() {
  console.log("🔥 Iniciando extração ultra-violenta...");
  
  // Extrair nome da página
  let pageName = null;
  
  // MÉTODO 0: Buscar H1 primeiro (geralmente contém o nome da página)
  const h1 = document.querySelector('h1');
  if (h1 && h1.textContent) {
    const text = h1.textContent.trim();
    if (text && 
        text.length >= 2 && 
        text.length <= 50 &&
        !text.includes('Ad Library') && 
        !text.includes('Facebook') && 
        !text.includes('Biblioteca') &&
        !text.includes('Meta')) {
      pageName = text;
      console.log("✅ Nome encontrado em H1:", pageName);
    }
  }
  
  // MÉTODO 0.5: Buscar direto em links do Facebook que contêm o pageId (MAIS PRECISO)
  const urlParams = new URLSearchParams(window.location.search);
  const pageId = urlParams.get('view_all_page_id');
  
  if (pageId && !pageName) {
    console.log("🔍 Buscando nome da página para pageId:", pageId);
    
    // Método 0.1: Buscar em links que apontam para a página do Facebook
    const pageLinks = Array.from(document.querySelectorAll(`a[href*="${pageId}"], a[href*="/${pageId}/"], a[href*="/${pageId}?"]`));
    for (const link of pageLinks) {
      const text = link.textContent?.trim();
      if (text && 
          text.length >= 2 && 
          text.length <= 50 &&
          !text.includes('Ad Library') &&
          !text.includes('Facebook') &&
          !text.includes('Biblioteca') &&
          !text.includes('Meta') &&
          !text.includes('Anúncios') &&
          text !== pageId) {
        pageName = text;
        console.log("✅ Nome encontrado em link do Facebook:", pageName);
        break;
      }
    }
    
    // Método 0.2: Buscar em elementos com data-hovercard-url contendo o pageId
    if (!pageName) {
      const hovercardElements = Array.from(document.querySelectorAll(`[data-hovercard-url*="${pageId}"]`));
      for (const el of hovercardElements) {
        const text = el.textContent?.trim() || el.innerText?.trim();
        if (text && 
            text.length >= 2 && 
            text.length <= 50 &&
            !text.includes('Ad Library') &&
            !text.includes('Facebook') &&
            !text.includes('Biblioteca') &&
            !text.includes('Meta') &&
            text !== pageId) {
          pageName = text;
          console.log("✅ Nome encontrado em hovercard:", pageName);
          break;
        }
      }
    }
    
    // Método 0.3: Buscar em elementos com aria-label que mencionam o pageId ou link para a página
    if (!pageName) {
      const ariaElements = Array.from(document.querySelectorAll('[aria-label]'));
      for (const el of ariaElements) {
        const ariaLabel = el.getAttribute('aria-label') || '';
        const text = el.textContent?.trim() || '';
        
        // Se o aria-label ou texto não contém palavras genéricas e parece um nome
        if ((ariaLabel || text) && 
            (ariaLabel.length >= 2 || text.length >= 2) &&
            (ariaLabel.length <= 50 || text.length <= 50) &&
            !ariaLabel.includes('Ad Library') &&
            !ariaLabel.includes('Facebook') &&
            !ariaLabel.includes('Biblioteca') &&
            !ariaLabel.includes('Meta') &&
            !text.includes('Ad Library') &&
            !text.includes('Facebook') &&
            !text.includes('Biblioteca') &&
            !text.includes('Meta')) {
          pageName = (ariaLabel || text).substring(0, 50);
          console.log("✅ Nome encontrado em aria-label:", pageName);
          break;
        }
      }
    }
    
    // Método 0.4: Buscar em elementos que são clicáveis e têm href contendo o pageId
    if (!pageName) {
      const clickableElements = Array.from(document.querySelectorAll('a, button, [role="link"], [role="button"]'));
      for (const el of clickableElements) {
        const href = el.getAttribute('href') || '';
        if (href.includes(pageId) || href.includes(`/${pageId}/`) || href.includes(`/${pageId}?`)) {
          const text = el.textContent?.trim() || el.innerText?.trim();
          if (text && 
              text.length >= 2 && 
              text.length <= 50 &&
              !text.includes('Ad Library') &&
              !text.includes('Facebook') &&
              !text.includes('Biblioteca') &&
              !text.includes('Meta') &&
              !text.includes('Anúncios') &&
              text !== pageId) {
            pageName = text;
            console.log("✅ Nome encontrado em elemento clicável:", pageName);
            break;
          }
        }
      }
    }
  }
  
  // Método 1: Buscar em headings (IGNORAR títulos genéricos) - só se não encontrou antes
  const headings = document.querySelectorAll('h1, h2, h3');
  const ignorePatterns = ['Ad Library', 'Facebook', 'Biblioteca', 'Meta', 'Anúncios'];
  for (const h of headings) {
    const text = h.textContent.trim();
    if (text && 
        text.length >= 2 && 
        text.length < 100 && 
        !ignorePatterns.some(pattern => text.includes(pattern))) {
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
      console.log("📍 Contexto antes de Anúncios:", beforeAnuncios);
      
      // Procurar por palavras que aparecem perto de "Anúncios"
      const words = beforeAnuncios.match(/\b[a-zA-Z][a-zA-Z0-9\s]{2,50}\b/g);
      if (words && words.length > 0) {
        console.log("📝 Palavras encontradas:", words);
        
        // Pegar palavras antes de "Anúncios", ignorando palavras comuns
        const commonWords = ['Anúncios', 'Ads', 'Sobre', 'About', 'Meta', 'Facebook', 'Biblioteca', 'resultados', 'results', 'Tudo', 'All', 'Todos', 'Click', 'yourself', 'with', 'brasil', 'official', 'com', 'https', 'www', 'http', 'de', 'da', 'do', 'dos', 'das', 'transparency', 'status'];
        
        // Pegar a última palavra válida antes de "Anúncios"
        for (let i = words.length - 1; i >= 0; i--) {
          const word = words[i].trim();
          const lowerWord = word.toLowerCase();
          if (word.length >= 2 && 
              word.length <= 50 && 
              !commonWords.some(cw => lowerWord === cw.toLowerCase() || lowerWord.includes(cw.toLowerCase())) &&
              !word.match(/^\d+$/) &&
              !lowerWord.includes('biblioteca') &&
              !lowerWord.includes('anúncios') &&
              !lowerWord.includes('meta')) {
            pageName = word;
            console.log("✅ Nome encontrado antes de Anúncios:", pageName);
            break;
          }
        }
      }
      
      // Método alternativo: buscar em elementos DOM (mais específico)
      if (!pageName) {
        // Buscar elementos que contêm "Anúncios" e pegar o texto ANTES dele
        const elementos = Array.from(document.querySelectorAll('*'));
        for (const el of elementos) {
          const textContent = el.textContent || '';
          if (textContent.includes('Anúncios') && textContent.length < 500) {
            // Pegar o texto antes de "Anúncios"
            const antesAnuncios = textContent.split('Anúncios')[0].trim();
            
            // Dividir por espaços e pegar as últimas palavras (nome da marca geralmente vem antes)
            const palavras = antesAnuncios.split(/\s+/).filter(p => p.length > 0);
            
            // Pegar a última palavra válida antes de "Anúncios"
            for (let i = palavras.length - 1; i >= 0; i--) {
              const palavra = palavras[i];
              const lowerPalavra = palavra.toLowerCase();
              
              // Ignorar palavras comuns
              if (!lowerPalavra.match(/^(anúncios|ads|sobre|about|meta|facebook|biblioteca|de|da|do|dos|das|resultados|results|tudo|all|todos|click|yourself|with|brasil|official|com|transparency|status)$/i) &&
                  palavra.length >= 2 && 
                  palavra.length <= 50 &&
                  !palavra.match(/^\d+$/)) {
                pageName = palavra;
                console.log("✅ Nome encontrado em elemento DOM:", pageName);
                break;
              }
            }
            
            if (pageName) break;
          }
        }
        
        // Método adicional: buscar elementos visíveis grandes (títulos de página)
        if (!pageName) {
          const largeElements = Array.from(document.querySelectorAll('*'))
            .filter(el => {
              const style = window.getComputedStyle(el);
              const fontSize = parseInt(style.fontSize);
              return fontSize >= 20 && el.textContent && el.textContent.length > 2 && el.textContent.length < 100;
            })
            .map(el => el.textContent.trim())
            .filter(text => 
              !text.includes('Ad Library') && 
              !text.includes('Facebook') && 
              !text.includes('Biblioteca') &&
              !text.includes('Meta') &&
              text.length >= 2 &&
              text.length <= 50
            );
          
          if (largeElements.length > 0) {
            pageName = largeElements[0];
            console.log("✅ Nome encontrado em elemento grande:", pageName);
          }
        }
      }
    }
  }
  
  // Método 3: Buscar em spans/divs com texto grande (FILTRAR MELHOR)
  if (!pageName) {
    const ignorePatterns = ['Ad Library', 'Facebook', 'Biblioteca', 'Meta', 'Anúncios', 'Ads', 'Sobre', 'About'];
    const largeText = Array.from(document.querySelectorAll('span, div'))
      .map(el => el.textContent.trim())
      .filter(text => 
        text.length >= 2 && 
        text.length <= 50 && 
        !ignorePatterns.some(pattern => text.includes(pattern)) &&
        /^[a-zA-Z]/.test(text) &&
        !text.match(/^(de|da|do|dos|das|com|https|www|http)$/i)
      )
      .find(text => text.length >= 2);
    
    if (largeText) {
      pageName = largeText;
      console.log("✅ Nome encontrado em elemento:", pageName);
    }
  }
  
  // Método 4: Buscar em elementos com classes específicas do Facebook
  if (!pageName) {
    // Tentar encontrar elementos que geralmente contêm o nome da página
    const possibleSelectors = [
      '[data-pagelet="ProfileTimeline"]',
      '[role="main"] h1',
      '[data-testid="page-title"]',
      '.x1heor9g', // Classe comum do Facebook para títulos
      '.x1lliihq', // Outra classe comum
    ];
    
    for (const selector of possibleSelectors) {
      try {
        const el = document.querySelector(selector);
        if (el && el.textContent) {
          const text = el.textContent.trim();
          if (text.length >= 2 && 
              text.length <= 50 && 
              !text.includes('Ad Library') &&
              !text.includes('Facebook') &&
              !text.includes('Biblioteca') &&
              !text.includes('Meta')) {
            pageName = text;
            console.log("✅ Nome encontrado com seletor:", selector, "→", pageName);
            break;
          }
        }
      } catch (e) {
        // Seletor inválido, continuar
      }
    }
  }
  
  // Método 5: Buscar no título da página e limpar
  if (!pageName) {
    const title = document.title;
    if (title) {
      // Remover sufixos comuns
      let cleanTitle = title
        .replace(/\s*-\s*Ad Library.*/i, '')
        .replace(/\s*-\s*Biblioteca.*/i, '')
        .replace(/\s*-\s*Facebook.*/i, '')
        .replace(/\s*\|\s*Meta.*/i, '')
        .trim();
      
      if (cleanTitle && 
          cleanTitle.length >= 2 && 
          cleanTitle.length <= 50 &&
          !cleanTitle.includes('Ad Library') &&
          !cleanTitle.includes('Facebook') &&
          !cleanTitle.includes('Biblioteca')) {
        pageName = cleanTitle;
        console.log("✅ Nome encontrado no título:", pageName);
      }
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
  
  // Extrair landing page (MELHORADO - decodificar links do Facebook)
  let landingPage = window.location.href;
  const allLinks = Array.from(document.querySelectorAll('a[href^="http"]'));
  
  // Decodificar links do Facebook (l.facebook.com/l.php?u=...)
  const decodedLinks = [];
  for (const link of allLinks) {
    const href = link.href;
    try {
      const url = new URL(href);
      
      // Se é um link redirecionado do Facebook, extrair o URL real
      if (url.hostname.includes('l.facebook.com') && url.searchParams.has('u')) {
        const realUrl = decodeURIComponent(url.searchParams.get('u'));
        decodedLinks.push(realUrl);
        console.log("🔗 Link decodificado:", realUrl);
      }
      // Se é um link direto, verificar se não é do Facebook
      else if (!url.hostname.includes('facebook.com') && 
               !url.hostname.includes('fbcdn') && 
               !url.hostname.includes('fb.com') &&
               !url.hostname.includes('metastatus.com') &&
               !url.hostname.includes('instagram.com') &&
               !url.hostname.includes('messenger.com')) {
        decodedLinks.push(href);
      }
    } catch (e) {
      // URL inválido, ignorar
    }
  }
  
  // Remover duplicatas
  const uniqueLinks = [...new Set(decodedLinks)];
  console.log("📋 Links únicos encontrados:", uniqueLinks.length);
  
  if (uniqueLinks.length > 0) {
    // Se encontrou o nome da página, tentar encontrar link relacionado
    if (pageName) {
      const pageNameLower = pageName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const relatedLink = uniqueLinks.find(href => {
        try {
          const url = new URL(href);
          const domain = url.hostname.toLowerCase().replace(/[^a-z0-9]/g, '');
          return domain.includes(pageNameLower) || pageNameLower.includes(domain);
        } catch {
          return false;
        }
      });
      
      if (relatedLink) {
        landingPage = relatedLink;
        console.log("✅ Landing page relacionada encontrada:", landingPage);
      } else {
        // Pegar o primeiro link que parece ser um site real (tem domínio próprio)
        const siteLink = uniqueLinks.find(href => {
          try {
            const url = new URL(href);
            return url.hostname.includes('.com') || url.hostname.includes('.net') || url.hostname.includes('.org');
          } catch {
            return false;
          }
        });
        landingPage = siteLink || uniqueLinks[0];
        console.log("✅ Landing page encontrada:", landingPage);
      }
    } else {
      landingPage = uniqueLinks[0];
      console.log("✅ Landing page encontrada:", landingPage);
    }
  }
  
  // Se ainda não encontrou, usar o link da página do Facebook como fallback
  if (landingPage === window.location.href && pageId) {
    landingPage = `https://www.facebook.com/${pageId}`;
    console.log("⚠️ Usando página do Facebook como landing page:", landingPage);
  }
  
  // VALIDAÇÃO FINAL: Se o nome encontrado contém palavras genéricas, tentar buscar de outra forma
  if (pageName && (
      pageName.includes('Biblioteca de') || 
      pageName.includes('Ad Library') || 
      pageName.includes('Meta') ||
      pageName === 'Biblioteca de Anúncios da Meta'
    )) {
    console.log("⚠️ Nome genérico detectado, tentando métodos alternativos...");
    pageName = null;
    
    // Tentar extrair do URL se tiver view_all_page_id
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('view_all_page_id');
    
    if (pageId) {
      // Buscar em elementos específicos que podem conter o nome real
      // Tentar elementos com aria-label ou title que geralmente têm o nome da página
      const ariaElements = Array.from(document.querySelectorAll('[aria-label], [title]'));
      for (const el of ariaElements) {
        const label = el.getAttribute('aria-label') || el.getAttribute('title') || '';
        if (label && 
            label.length >= 2 && 
            label.length <= 50 &&
            !label.includes('Ad Library') &&
            !label.includes('Facebook') &&
            !label.includes('Biblioteca') &&
            !label.includes('Meta')) {
          pageName = label.trim();
          console.log("✅ Nome encontrado em aria-label/title:", pageName);
          break;
        }
      }
      
      // Se ainda não encontrou, buscar em elementos com data-* attributes
      if (!pageName) {
        const dataElements = Array.from(document.querySelectorAll('[data-hovercard-url], [data-pagelet]'));
        for (const el of dataElements) {
          const hoverUrl = el.getAttribute('data-hovercard-url');
          if (hoverUrl && hoverUrl.includes(pageId)) {
            const text = el.textContent?.trim();
            if (text && 
                text.length >= 2 && 
                text.length <= 50 &&
                !text.includes('Ad Library') &&
                !text.includes('Facebook') &&
                !text.includes('Biblioteca')) {
              pageName = text;
              console.log("✅ Nome encontrado em data-attribute:", pageName);
              break;
            }
          }
        }
      }
    }
    
    // Se ainda não encontrou, usar fallback do pageId
    if (!pageName && pageId) {
      pageName = `Page ${pageId}`;
      console.log("⚠️ Usando fallback com pageId:", pageName);
    }
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
  }).catch(() => {
    console.log("⚠️ Não foi possível copiar automaticamente. Copie manualmente o JSON acima.");
  });
  
  return result;
})();

