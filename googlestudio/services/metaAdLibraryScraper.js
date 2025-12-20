/**
 * SCRAPER BRUTAL - Meta Ad Library
 * Extração robusta de dados da biblioteca de anúncios do Facebook/Meta
 */

import puppeteer from 'puppeteer';

/**
 * Extrai nome da página com múltiplos fallbacks
 */
async function extractPageName(page) {
  // Aguarda mais tempo no ambiente serverless (Vercel)
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  const waitTime = isVercel ? 6000 : 3000;
  await new Promise(resolve => setTimeout(resolve, waitTime));

  try {
    const pageName = await page.evaluate(() => {
      // Busca por divs que contêm imagem de perfil + nome
      const allDivs = Array.from(document.querySelectorAll('div'));
      
      for (const div of allDivs) {
        const img = div.querySelector('img');
        if (img && img.width > 30 && img.width < 200) {
          const text = div.textContent?.trim();
          if (text) {
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            for (const line of lines) {
              if (line.length >= 2 && line.length <= 50 &&
                  !line.includes('Biblioteca') && !line.includes('Anúncio') &&
                  !line.includes('resultado') && !line.includes('Ativo') &&
                  !line.includes('Meta') && !line.includes('Facebook') &&
                  !line.includes('Conteúdo') && !line.includes('marca') &&
                  !line.match(/^\d+$/) && 
                  !line.match(/^\d{1,2}\s+de\s+\w+\s+de\s+\d{4}/i) &&
                  !line.match(/^[A-Z]{2,}$/) &&
                  /[a-zA-Z]/.test(line)) {
                return line;
              }
            }
          }
        }
      }

      // Busca por padrão específico - nome antes de "Anúncios" ou "Sobre"
      const buttons = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
      for (const btn of buttons) {
        const text = btn.textContent?.trim();
        if (text === 'Anúncios' || text === 'Sobre' || text === 'Ads' || text === 'About') {
          let element = btn.parentElement;
          for (let i = 0; i < 3 && element; i++) {
            const parentText = element.textContent?.trim();
            if (parentText) {
              const lines = parentText.split('\n').map(l => l.trim());
              for (const line of lines) {
                if (line.length >= 2 && line.length <= 50 &&
                    line !== 'Anúncios' && line !== 'Sobre' &&
                    !line.includes('Biblioteca') && !line.includes('Anúncio') &&
                    !line.includes('resultado') && !line.includes('Ativo') &&
                    !line.match(/^\d+$/) && /[a-zA-Z]/.test(line)) {
                  return line;
                }
              }
            }
            element = element.parentElement;
          }
        }
      }

      // Busca em todo o texto visível
      const bodyText = document.body.innerText;
      const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      const ignoreWords = [
        'Biblioteca', 'Anúncio', 'Anúncios', 'Meta', 'Facebook', 
        'resultado', 'resultados', 'Ativo', 'Active', 'Conteúdo',
        'marca', 'de', 'em', 'para', 'com', 'sobre', 'Sobre'
      ];
      
      for (const line of lines) {
        if (line.length >= 3 && line.length <= 50 &&
            !ignoreWords.some(word => line.includes(word)) &&
            !line.match(/^\d+$/) && 
            !line.match(/^\d{1,2}\s+de\s+\w+\s+de\s+\d{4}/i) &&
            !line.match(/^[A-Z]{2,}$/) &&
            /^[A-Z]/.test(line) &&
            line.split(/\s+/).length <= 5) {
          if (/[a-z]/.test(line)) {
            return line;
          }
        }
      }

      return null;
    });

    if (pageName && pageName !== 'Unknown Page') {
      return pageName;
    }
  } catch (e) {
    console.error('Erro ao extrair nome da página:', e);
  }

  // Fallback: Tenta extrair da URL
  try {
    const url = page.url();
    const match = url.match(/view_all_page_id=(\d+)/);
    if (match) {
      return `Page ID: ${match[1]}`;
    }
  } catch (e) {
    // Ignora
  }

  return 'Unknown Page';
}

/**
 * Extrai total de anúncios ativos com múltiplos fallbacks
 */
async function extractTotalActiveAds(page) {
  // Aguarda mais tempo no ambiente serverless
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  if (isVercel) {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  try {
    const pageText = await page.evaluate(() => document.body.innerText);
    
    const patterns = [
      /(?:~)?(\d+)\s*resultado/i,
      /(?:~)?(\d+)\s*ads?/i,
      /(?:~)?(\d+)\s*anúncio/i,
      /total[:\s]+(\d+)/i,
      /(\d+)\s*active/i
    ];

    for (const pattern of patterns) {
      const match = pageText.match(pattern);
      if (match) {
        const count = parseInt(match[1]);
        if (count > 0) {
          return count;
        }
      }
    }
  } catch (e) {
    console.error('Erro no método 1 de contagem:', e);
  }

  // Método 2: Conta cards visíveis
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const cards = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*'));
      const adCards = allElements.filter(el => {
        const text = el.textContent || '';
        return text.includes('Ativo') || text.includes('Active') || 
               text.includes('Identificação da biblioteca') ||
               text.includes('Library ID');
      });
      
      const uniqueCards = new Set();
      adCards.forEach(el => {
        let parent = el;
        for (let i = 0; i < 5 && parent; i++) {
          if (parent.classList && parent.classList.length > 0) {
            uniqueCards.add(parent);
            break;
          }
          parent = parent.parentElement;
        }
      });
      
      return uniqueCards.size;
    });
    
    if (cards > 0) {
      return cards;
    }
  } catch (e) {
    console.error('Erro no método 2 de contagem:', e);
  }

  return 0;
}

/**
 * Extrai data de início do primeiro anúncio
 */
async function extractFirstAdStartDate(page) {
  // Aguarda um pouco mais para garantir que os dados carregaram
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  if (isVercel) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const datePatterns = [
    /veiculação iniciada em (\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i,
    /started on (\w+)\s+(\d{1,2}),\s+(\d{4})/i,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{4})-(\d{2})-(\d{2})/
  ];

  try {
    const pageText = await page.evaluate(() => document.body.innerText);
    
    const dates = [];
    for (const pattern of datePatterns) {
      const matches = [...pageText.matchAll(new RegExp(pattern.source, 'gi'))];
      for (const match of matches) {
        dates.push(match[0]);
      }
    }

    if (dates.length > 0) {
      return dates[0];
    }
  } catch (e) {
    console.error('Erro ao extrair data:', e);
  }

  return 'Unknown';
}

/**
 * Extrai tempo total ativo do primeiro anúncio
 */
async function extractFirstAdActiveTime(page) {
  // Aguarda um pouco mais para garantir que os dados carregaram
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  if (isVercel) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  try {
    const pageText = await page.evaluate(() => document.body.innerText);
    
    const timePatterns = [
      /tempo total ativo:\s*(\d+[hdms]|[\d\s]+(?:hora|dia|semana|mês))/i,
      /total active time:\s*(\d+[hdms]|[\d\s]+(?:hour|day|week|month))/i,
      /active for\s*(\d+[hdms]|[\d\s]+(?:hour|day|week|month))/i
    ];

    for (const pattern of timePatterns) {
      const match = pageText.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
  } catch (e) {
    console.error('Erro ao extrair tempo ativo:', e);
  }

  return 'Unknown';
}

/**
 * Extrai URL de destino (landing page) dos anúncios
 */
async function extractLandingPageUrl(page) {
  try {
    // Aguarda mais tempo no ambiente serverless para garantir que os cards carregaram
    const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    const waitTime = isVercel ? 6000 : 3000;
    await new Promise(resolve => setTimeout(resolve, waitTime));

    // Método 1: Tenta clicar em "Ver detalhes" do primeiro anúncio para ver a landing page
    try {
      // Busca o botão "Ver detalhes" de forma mais robusta
      const detailButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button, a, div[role="button"], span[role="button"]'));
        for (const btn of buttons) {
          const text = btn.textContent?.trim().toLowerCase();
          if (text && (text.includes('ver detalhes') || text.includes('ver resumo') || 
                      text.includes('view details') || text.includes('see details') ||
                      text.includes('detalhes do anúncio'))) {
            // Verifica se está dentro de um card de anúncio (tem "Ativo" ou "Library ID" próximo)
            let parent = btn;
            for (let i = 0; i < 10 && parent; i++) {
              const parentText = parent.textContent || '';
              if (parentText.includes('Ativo') || parentText.includes('Active') || 
                  parentText.includes('Identificação da biblioteca') || 
                  parentText.includes('Library ID')) {
                return btn;
              }
              parent = parent.parentElement;
            }
          }
        }
        return null;
      });

      if (detailButton) {
        const element = detailButton.asElement ? detailButton.asElement() : detailButton;
        if (element) {
          // Clica no botão para abrir detalhes
          try {
            await element.click({ delay: 100 });
            await new Promise(resolve => setTimeout(resolve, 4000)); // Aguarda mais tempo
          } catch (clickError) {
            // Se não conseguir clicar, tenta via JavaScript
            await page.evaluate((btn) => {
              if (btn && typeof btn.click === 'function') {
                btn.click();
              } else if (btn && btn.dispatchEvent) {
                btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
              }
            }, element);
            await new Promise(resolve => setTimeout(resolve, 4000));
          }
          
          // Busca a landing page nos detalhes abertos
          const landingPageFromDetails = await page.evaluate(() => {
            // Busca por links que parecem ser landing pages
            const allLinks = Array.from(document.querySelectorAll('a[href]'));
            const foundUrls = [];
            
            for (const link of allLinks) {
              const href = link.getAttribute('href');
              if (!href) continue;
              
              // Remove links do Facebook/Meta/Instagram
              if (href.includes('facebook.com') || 
                  href.includes('meta.com') || 
                  href.includes('metastatus.com') ||
                  href.includes('instagram.com') ||
                  href.includes('messenger.com') ||
                  href.includes('whatsapp.com') ||
                  href.startsWith('#') ||
                  href.startsWith('javascript:') ||
                  href.startsWith('mailto:') ||
                  href.startsWith('tel:')) {
                continue;
              }
              
              try {
                let fullUrl = href;
                if (!href.startsWith('http')) {
                  fullUrl = `https://${href}`;
                }
                const url = new URL(fullUrl);
                
                const hostname = url.hostname.toLowerCase();
                // Filtra domínios válidos que não são do Meta/Facebook
                if (hostname.length > 4 && 
                    hostname.includes('.') &&
                    hostname.split('.').length >= 2 &&
                    !hostname.includes('facebook') &&
                    !hostname.includes('fbcdn') &&
                    !hostname.includes('static.xx') &&
                    !hostname.includes('meta') &&
                    !hostname.includes('metastatus') &&
                    !hostname.includes('instagram') &&
                    !hostname.includes('messenger') &&
                    !hostname.includes('whatsapp') &&
                    !hostname.includes('twitter') &&
                    !hostname.includes('linkedin') &&
                    !hostname.includes('youtube') &&
                    !hostname.includes('tiktok') &&
                    !url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)) {
                  const fullUrlStr = url.origin + url.pathname + (url.search || '');
                  foundUrls.push(fullUrlStr);
                }
              } catch (e) {
                continue;
              }
            }
            
            // Retorna a primeira URL encontrada
            return foundUrls.length > 0 ? foundUrls[0] : null;
          });

          if (landingPageFromDetails && typeof landingPageFromDetails === 'string') {
            return landingPageFromDetails;
          }
        }
      }
    } catch (e) {
      console.log('Não foi possível clicar em detalhes:', e.message);
    }

    // Método 2: Busca por links nos cards de anúncios visíveis
    const landingPage = await page.evaluate(() => {
      // Busca por todos os links na página
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      
      // Filtra links que parecem ser landing pages (não são do Facebook)
      const externalLinks = allLinks
        .map(link => {
          const href = link.getAttribute('href');
          if (!href) return null;
          
          // Remove links do Facebook/Meta/Instagram
          if (href.includes('facebook.com') || 
              href.includes('meta.com') || 
              href.includes('metastatus.com') ||
              href.includes('instagram.com') ||
              href.includes('messenger.com') ||
              href.includes('whatsapp.com') ||
              href.startsWith('#') ||
              href.startsWith('javascript:') ||
              href.startsWith('mailto:') ||
              href.startsWith('tel:')) {
            return null;
          }
          
          // Verifica se é uma URL válida
          try {
            let fullUrl = href;
            if (!href.startsWith('http')) {
              fullUrl = `https://${href}`;
            }
            const url = new URL(fullUrl);
            
            // Ignora URLs muito curtas, suspeitas ou de redes sociais/CDN
            const hostname = url.hostname.toLowerCase();
            if (hostname.length < 4 || 
                hostname.includes('facebook') ||
                hostname.includes('fbcdn') ||
                hostname.includes('static.xx') ||
                hostname.includes('instagram') ||
                hostname.includes('twitter') ||
                hostname.includes('linkedin') ||
                hostname.includes('youtube') ||
                hostname.includes('tiktok') ||
                hostname.endsWith('.png') ||
                hostname.endsWith('.jpg') ||
                hostname.endsWith('.jpeg') ||
                hostname.endsWith('.gif') ||
                hostname.endsWith('.svg')) {
              return null;
            }
            
            // Ignora URLs que são imagens (terminam com extensão de imagem)
            if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)) {
              return null;
            }
            
            // Valida se é uma URL válida e completa (tem domínio válido)
            if (hostname.includes('.') && hostname.split('.').length >= 2 && hostname.length > 4) {
              // Não pode ser IP
              if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return null;
              
              // TLD deve ter pelo menos 2 caracteres
              const parts = hostname.split('.');
              const tld = parts[parts.length - 1];
              if (tld.length < 2 || /^\d+$/.test(tld)) return null;
              
              // Retorna URL completa (com path e query params se houver)
              return url.origin + url.pathname + (url.search || '');
            }
            return null;
          } catch (e) {
            return null;
          }
        })
        .filter(url => {
          // Filtra URLs válidas: não nulas, não vazias, têm domínio válido
          if (!url || typeof url !== 'string' || url.length < 10) return false;
          try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            // Deve ter pelo menos um ponto e ser um domínio válido
            return hostname.includes('.') && hostname.split('.').length >= 2 && hostname.length > 4;
          } catch {
            return false;
          }
        })
        .filter((url, index, self) => self.indexOf(url) === index); // Remove duplicatas
      
      // Retorna o primeiro link externo válido encontrado (geralmente é a landing page)
      if (externalLinks.length > 0 && externalLinks[0] && typeof externalLinks[0] === 'string') {
        const firstUrl = externalLinks[0];
        // Validação final
        try {
          const urlObj = new URL(firstUrl);
          const hostname = urlObj.hostname.toLowerCase();
          if (hostname.includes('.') && hostname.split('.').length >= 2 && hostname.length > 4) {
            return firstUrl;
          }
        } catch {
          // URL inválida, continua procurando
        }
      }
      
      return null;
    });

    // Verifica se retornou uma string válida (não boolean) e é uma URL válida
    if (landingPage && typeof landingPage === 'string' && landingPage.length > 10) {
      try {
        const urlObj = new URL(landingPage);
        const hostname = urlObj.hostname.toLowerCase();
        // Valida se é um domínio válido (não IP, tem TLD válido)
        if (hostname.includes('.') && 
            hostname.split('.').length >= 2 &&
            !/^\d+\.\d+\.\d+\.\d+$/.test(hostname) &&
            hostname.length > 4 &&
            !hostname.includes('facebook') &&
            !hostname.includes('meta') &&
            !hostname.includes('fbcdn') &&
            !hostname.includes('instagram')) {
          console.log('Landing page encontrada (método 2):', landingPage);
          return landingPage;
        }
      } catch {
        // URL inválida, continua
      }
    }
    
    // Debug: verifica o que foi retornado
    if (landingPage) {
      console.log('Tipo retornado:', typeof landingPage, 'Valor:', landingPage);
    }

    // Método 2: Busca por texto que contém URLs no HTML completo
    try {
      const pageHtml = await page.content();
      const pageText = await page.evaluate(() => document.body.innerText);
      
      // Padrões para URLs mais específicos (domínios válidos apenas)
      const urlPatterns = [
        /https?:\/\/(?:www\.)?([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}(?:\/[^\s"<>]*)?/gi,
        /(?:www\.)?([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}(?:\/[^\s"<>]*)?/gi
      ];

      const foundUrls = new Set();
      
      // Busca no HTML primeiro (mais completo)
      for (const pattern of urlPatterns) {
        const matches = [...pageHtml.matchAll(pattern)];
        for (const match of matches) {
          let url = match[0].trim();
          
          // Remove caracteres finais inválidos
          url = url.replace(/[.,;:!?)\]}]+$/, '');
          
          // Adiciona https:// se não tiver protocolo
          if (!url.startsWith('http')) {
            url = `https://${url}`;
          }
          
          try {
            const urlObj = new URL(url);
            // Ignora Facebook/Meta/Instagram e outras redes sociais
            const hostname = urlObj.hostname.toLowerCase();
            if (!hostname.includes('facebook') && 
                !hostname.includes('fbcdn') &&
                !hostname.includes('static.xx') &&
                !hostname.includes('meta.com') &&
                !hostname.includes('metastatus') &&
                !hostname.includes('instagram') &&
                !hostname.includes('twitter') &&
                !hostname.includes('linkedin') &&
                !hostname.includes('youtube') &&
                !hostname.includes('tiktok') &&
                hostname.length > 4 &&
                hostname.includes('.') &&
                hostname.split('.').length >= 2 &&
                !urlObj.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)) {
              const cleanUrl = urlObj.origin + (urlObj.pathname !== '/' ? urlObj.pathname : '');
              foundUrls.add(cleanUrl);
            }
          } catch (e) {
            // Ignora URLs inválidas
          }
        }
      }

      // Busca também no texto visível
      for (const pattern of urlPatterns) {
        const matches = [...pageText.matchAll(pattern)];
        for (const match of matches) {
          let url = match[0].trim();
          url = url.replace(/[.,;:!?)\]}]+$/, '');
          
          if (!url.startsWith('http')) {
            url = `https://${url}`;
          }
          
          try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            if (!hostname.includes('facebook') && 
                !hostname.includes('fbcdn') &&
                !hostname.includes('static.xx') &&
                !hostname.includes('meta.com') &&
                !hostname.includes('metastatus') &&
                !hostname.includes('instagram') &&
                hostname.length > 4 &&
                hostname.includes('.') &&
                hostname.split('.').length >= 2 &&
                !urlObj.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)) {
              const cleanUrl = urlObj.origin + (urlObj.pathname !== '/' ? urlObj.pathname : '');
              foundUrls.add(cleanUrl);
            }
          } catch (e) {
            // Ignora
          }
        }
      }

      const urlsArray = Array.from(foundUrls).filter(url => {
        // Valida URLs antes de retornar
        if (!url || typeof url !== 'string' || url.length < 10) return false;
        try {
          const urlObj = new URL(url);
          const hostname = urlObj.hostname.toLowerCase();
          
          // Validações rigorosas de domínio
          if (!hostname.includes('.')) return false;
          const parts = hostname.split('.');
          if (parts.length < 2) return false;
          
          // Não pode ser IP (0.0.0.5, etc)
          if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return false;
          
          // Deve ter TLD válido (última parte deve ter pelo menos 2 caracteres e ser letras)
          const tld = parts[parts.length - 1];
          if (tld.length < 2 || /^\d+$/.test(tld) || !/^[a-z]{2,}$/.test(tld)) return false;
          
          // TLD deve ter pelo menos 2 letras e ser um TLD válido comum
          // Aceita TLDs comuns ou qualquer TLD com 2-4 letras (padrão de TLDs reais)
          if (tld.length < 2 || tld.length > 4 || !/^[a-z]{2,4}$/.test(tld)) return false;
          
          // Domínio deve ter pelo menos 5 caracteres
          if (hostname.length < 5) return false;
          
          // Não pode ser domínios do Meta/Facebook
          if (hostname.includes('facebook') || 
              hostname.includes('meta') || 
              hostname.includes('fbcdn') ||
              hostname.includes('instagram') ||
              hostname.includes('messenger') ||
              hostname.includes('whatsapp')) {
            return false;
          }
          
          // Domínio deve ter formato válido (ex: exemplo.com, não crhkldee.crhkldee)
          // Se o domínio e o TLD forem iguais, é inválido
          const domainPart = parts[0];
          if (domainPart.length < 2 || /^\d+$/.test(domainPart)) return false;
          if (domainPart.toLowerCase() === tld.toLowerCase()) return false; // Evita "crhkldee.crhkldee"
          
            // Se todas as partes do domínio forem muito curtas ou iguais, é inválido
            if (parts.length === 2 && parts[0].length < 3 && parts[1].length < 3) return false;
            if (parts.length > 2 && parts.every(p => p.length < 3)) return false;
            
            // Se domínio e TLD forem iguais, é inválido (ex: crhkldee.crhkldee)
            if (parts.length === 2 && parts[0].toLowerCase() === parts[1].toLowerCase()) return false;
            
            // Se alguma parte começa com número e é muito curta, é inválido (ex: 7d.ydmc.ydmc)
            if (parts.some(p => /^\d/.test(p) && p.length < 3)) return false;
            
            // Se alguma parte contém extensões de arquivo (php, js, etc), é inválido
            if (parts.some(p => /\.(php|js|css|html|json|xml)$/i.test(p))) return false;
          
          return true;
        } catch {
          return false;
        }
      });
      
      if (urlsArray.length > 0) {
        // Retorna a primeira URL válida encontrada (mais provável de ser a landing page)
        const foundUrl = urlsArray[0];
        if (typeof foundUrl === 'string' && foundUrl.length > 10) {
          // Validação final: deve ser um domínio real (não strings aleatórias)
          try {
            const urlObj = new URL(foundUrl);
            const hostname = urlObj.hostname.toLowerCase();
            const parts = hostname.split('.');
            
            // Se todas as partes forem muito curtas ou iguais, é inválido
            if (parts.length === 2 && (parts[0].length < 3 || parts[1].length < 2)) return null;
            if (parts.length > 2 && parts.every(p => p.length < 2)) return null;
            
            // Se domínio e TLD forem iguais, é inválido
            if (parts.length === 2 && parts[0].toLowerCase() === parts[1].toLowerCase()) return null;
            
            // Se alguma parte contém extensões de arquivo, é inválido
            if (parts.some(p => /\.(php|js|css|html|json|xml)$/i.test(p))) return null;
            
            // Se alguma parte começa com número e é muito curta, é inválido
            if (parts.some(p => /^\d/.test(p) && p.length < 3)) return null;
            
            return foundUrl;
          } catch {
            return null;
          }
        }
      }
      
      // Se não encontrou URL válida, retorna null
      return null;
    } catch (e) {
      console.error('Erro no método 2 de extração de landing page:', e);
    }

    // Método 3: Busca em atributos data-* ou meta tags
    try {
      const metaUrl = await page.evaluate(() => {
        // Busca em meta tags
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
          const content = ogUrl.getAttribute('content');
          if (content && !content.includes('facebook.com')) {
            return content;
          }
        }
        
        // Busca em links canônicos
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          const href = canonical.getAttribute('href');
          if (href && !href.includes('facebook.com')) {
            return href;
          }
        }
        
        return null;
      });

      if (metaUrl && typeof metaUrl === 'string' && metaUrl.length > 0) {
        return metaUrl;
      }
    } catch (e) {
      console.error('Erro no método 3 de extração de landing page:', e);
    }

    // Método 4: Busca por padrões específicos de URLs de destino em texto
    try {
      const pageText = await page.evaluate(() => document.body.innerText);
      const pageHtml = await page.content();
      
      // Busca por padrões como "curso-shop.com" ou domínios similares
      const domainPattern = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)(?:\/[^\s"<>]*)?/gi;
      
      const matches = [...pageHtml.matchAll(domainPattern)];
      for (const match of matches) {
        let url = match[0].trim();
        
        // Remove caracteres finais inválidos
        url = url.replace(/[.,;:!?)\]}]+$/, '');
        
        // Adiciona https:// se não tiver protocolo
        if (!url.startsWith('http')) {
          url = `https://${url}`;
        }
        
        try {
          const urlObj = new URL(url);
          const hostname = urlObj.hostname.toLowerCase();
          
          // Ignora Facebook, redes sociais e CDN/imagens
          if (!hostname.includes('facebook') &&
              !hostname.includes('fbcdn') &&
              !hostname.includes('static.xx') &&
              !hostname.includes('instagram') &&
              !hostname.includes('meta.com') &&
              hostname.length > 4 &&
              !urlObj.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)) {
            const fullUrl = urlObj.origin + urlObj.pathname + (urlObj.search || '');
            return fullUrl;
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      console.error('Erro no método 4 de extração de landing page:', e);
    }

    return null;
  } catch (e) {
    console.error('Erro ao extrair landing page:', e);
    return null;
  }
}

/**
 * Função principal de scraping da Meta Ad Library
 */
export async function scrapeMetaAdLibrary(url) {
  // Detecta se está rodando na Vercel (serverless)
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  
  let browserOptions = {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-web-security',
      '--disable-dev-shm-usage'
    ]
  };

  // Configurações específicas para Vercel/serverless
  if (isVercel) {
    browserOptions.args.push(
      '--disable-gpu',
      '--single-process',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-default-apps',
      '--disable-hang-monitor',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--disable-sync',
      '--disable-translate',
      '--metrics-recording-only',
      '--no-first-run',
      '--safebrowsing-disable-auto-update',
      '--enable-automation',
      '--password-store=basic',
      '--use-mock-keychain',
      '--disable-ipc-flooding-protection'
    );
  }

  const browser = await puppeteer.launch(browserOptions);

  try {
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Timeout maior na Vercel devido a latência
    const timeout = isVercel ? 60000 : 30000;
    
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: timeout 
    });

    // Aguarda mais tempo na Vercel para garantir carregamento completo
    console.log('⏳ Aguardando conteúdo dinâmico...');
    const contentWaitTime = isVercel ? 8000 : 4000;
    await new Promise(resolve => setTimeout(resolve, contentWaitTime));

    const pageName = await extractPageName(page);
    const totalAds = await extractTotalActiveAds(page);
    const firstAdDate = await extractFirstAdStartDate(page);
    const activeTime = await extractFirstAdActiveTime(page);
    const landingPageUrl = await extractLandingPageUrl(page);

    // Garante que landingPageUrl é uma string válida ou null
    let finalLandingPage = null;
    if (landingPageUrl && typeof landingPageUrl === 'string' && landingPageUrl.length > 10) {
      // Validação final rigorosa
      try {
        const urlObj = new URL(landingPageUrl);
        const hostname = urlObj.hostname.toLowerCase();
        const parts = hostname.split('.');
        
        // Deve ter pelo menos 2 partes (domínio.tld)
        if (parts.length < 2) {
          finalLandingPage = null;
        } else {
          // Validações adicionais
          const domain = parts[0];
          const tld = parts[parts.length - 1];
          
          // Não pode ser IP
          if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
            finalLandingPage = null;
          }
          // Domínio e TLD não podem ser iguais
          else if (domain.toLowerCase() === tld.toLowerCase()) {
            finalLandingPage = null;
          }
          // TLD deve ter pelo menos 2 letras
          else if (tld.length < 2 || !/^[a-z]{2,}$/.test(tld)) {
            finalLandingPage = null;
          }
          // Domínio deve ter pelo menos 2 caracteres
          else if (domain.length < 2) {
            finalLandingPage = null;
          }
          // Não pode conter extensões de arquivo
          else if (hostname.includes('.php') || hostname.includes('.js') || hostname.includes('.css')) {
            finalLandingPage = null;
          }
          // Não pode ser do Meta/Facebook
          else if (hostname.includes('facebook') || hostname.includes('meta') || hostname.includes('fbcdn')) {
            finalLandingPage = null;
          }
          else {
            finalLandingPage = landingPageUrl;
          }
        }
      } catch {
        finalLandingPage = null;
      }
    }

    console.log('Final landing page:', finalLandingPage, 'Type:', typeof finalLandingPage);

    return {
      pageName,
      totalActiveAds: totalAds,
      firstAdStartDate: firstAdDate,
      firstAdActiveTime: activeTime,
      landingPageUrl: finalLandingPage,
      url
    };

  } catch (error) {
    console.error('Erro durante scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

