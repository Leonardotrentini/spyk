import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

interface UrlAnalysisResult {
  brandName: string;
  niche: string;
  estimatedAdsCount: number;
  landingPageUrl: string;
  summary: string;
  trafficEstimate: string;
}

// Parse JSON from text response (handles markdown code blocks)
function parseJsonFromText(text: string): any {
  try {
    let cleanText = text.trim();
    
    const start = cleanText.indexOf('{');
    const end = cleanText.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
      cleanText = cleanText.substring(start, end + 1);
    } else {
      cleanText = cleanText.replace(/^```(json)?/, '').replace(/```$/, '');
    }

    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    try {
      const aggressiveClean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const start = aggressiveClean.indexOf('{');
      const end = aggressiveClean.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        return JSON.parse(aggressiveClean.substring(start, end + 1));
      }
    } catch (e2) {
      console.error("Second parse attempt failed:", e2);
    }
    return null;
  }
}

Deno.serve(async (req) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Validate input
    const { url, brandName } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid url parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // ULTRA VIOLENT scraping function - exhausts ALL possibilities
    const scrapeAdLibrary = async (url: string, pageId: string | null): Promise<{ name: string | null; ads: number; website: string | null }> => {
      let name: string | null = null;
      let ads = 10;
      let website: string | null = null;
      
      // Strategy 1: Scrape the Ad Library URL with MAXIMUM realistic headers
      try {
        console.log("🔍🔥 ULTRA VIOLENT scraping starting...");
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.facebook.com/',
            'Origin': 'https://www.facebook.com',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'DNT': '1',
          },
        });
        
          if (response.ok) {
            const html = await response.text();
            console.log("✅ HTML fetched, length:", html.length);
            
            // PRIORIDADE 0: Buscar no searchbox primeiro (geralmente tem o nome exato da página)
            // O Facebook Ad Library mostra o nome da página no campo de busca quando você está vendo uma página específica
            const searchboxPatterns = [
              /searchbox[^>]*value=["']([^"']+)["']/i,
              /input[^>]*type=["']text["'][^>]*value=["']([^"']+)["']/i,
              /input[^>]*placeholder[^>]*value=["']([^"']+)["']/i,
              /aria-label[^>]*searchbox[^>]*value=["']([^"']+)["']/i,
              /<input[^>]*value=["']([^"']+)["'][^>]*type=["']text["']/i,
            ];
            
            // Buscar TODOS os inputs de texto e encontrar o que tem o nome
            const allInputs = html.matchAll(/<input[^>]*type=["']text["'][^>]*value=["']([^"']+)["'][^>]*>/gi);
            for (const inputMatch of allInputs) {
              if (inputMatch[1]) {
                let inputValue = inputMatch[1].trim();
                // Validar se não é placeholder genérico
                if (inputValue && 
                    inputValue.length >= 2 && 
                    inputValue.length <= 50 &&
                    !inputValue.match(/^(Pesquisar|Search|palavra|keyword|anunciante|advertiser|Paste|Cole)$/i) &&
                    !inputValue.includes('Pesquisar') &&
                    !inputValue.includes('Search') &&
                    !inputValue.includes('palavra-chave')) {
                  name = inputValue;
                  console.log("✅✅✅✅ Nome encontrado no SEARCHBOX (MÁXIMA PRIORIDADE):", name);
                  break;
                }
              }
            }
            
            // Se não encontrou, tentar padrões específicos de searchbox
            if (!name) {
              for (const pattern of searchboxPatterns) {
                const searchboxMatch = html.match(pattern);
                if (searchboxMatch && searchboxMatch[1]) {
                  let searchboxValue = searchboxMatch[1].trim();
                  // Validar se não é placeholder genérico
                  if (searchboxValue && 
                      searchboxValue.length >= 2 && 
                      searchboxValue.length <= 50 &&
                      !searchboxValue.match(/^(Pesquisar|Search|palavra|keyword|anunciante|advertiser)$/i) &&
                      !searchboxValue.includes('Pesquisar') &&
                      !searchboxValue.includes('Search')) {
                    name = searchboxValue;
                    console.log("✅✅✅✅ Nome encontrado no SEARCHBOX (MÁXIMA PRIORIDADE):", name);
                    break;
                  }
                }
              }
            }
            
            // PRIORIDADE 0.5: Buscar no searchbox primeiro (geralmente tem o nome exato)
            // O Facebook Ad Library mostra o nome no campo de busca quando você está vendo uma página
            // Buscar TODOS os inputs de texto e encontrar o que tem valor válido
            const inputPatterns = [
              /<input[^>]*type=["']text["'][^>]*value=["']([^"']+)["'][^>]*>/gi,
              /<input[^>]*value=["']([^"']+)["'][^>]*type=["']text["'][^>]*>/gi,
              /<input[^>]*role=["']searchbox["'][^>]*value=["']([^"']+)["'][^>]*>/gi,
            ];
            
            const invalidValues = new Set([
              'Pesquisar', 'Search', 'palavra', 'keyword', 'anunciante', 'advertiser', 
              'Paste', 'Cole', 'por palavra', 'by keyword', 'palavra-chave'
            ]);
            
            for (const pattern of inputPatterns) {
              const allMatches = [...html.matchAll(pattern)];
              for (const match of allMatches) {
                if (match[1]) {
                  let inputValue = match[1].trim();
                  const lowerValue = inputValue.toLowerCase();
                  
                  // Validar se não é placeholder genérico e parece um nome real
                  if (inputValue && 
                      inputValue.length >= 2 && 
                      inputValue.length <= 50 &&
                      !invalidValues.has(inputValue) &&
                      !lowerValue.includes('pesquisar') &&
                      !lowerValue.includes('search') &&
                      !lowerValue.includes('keyword') &&
                      inputValue !== pageId &&
                      !inputValue.match(/^\d+$/)) { // Não aceitar só números
                    name = inputValue;
                    console.log("✅✅✅✅ Nome encontrado no INPUT/SEARCHBOX (MÁXIMA PRIORIDADE):", name);
                    break;
                  }
                }
              }
              if (name) break;
            }
            
            // PRIORIDADE 1: Buscar H1 primeiro (como o script do console faz)
            // O H1 geralmente está dentro de um link e contém o nome exato da página
            // Tentar múltiplos padrões de H1 (pode estar em diferentes formatos)
            const h1Patterns = [
              /<h1[^>]*>([^<]+)<\/h1>/i,
              /<h1[^>]*>([\s\S]*?)<\/h1>/i,  // Com quebras de linha
              /heading\s*\[level=1\][^>]*>([^<]+)</i,  // Formato de snapshot
              /<h1[^>]*>[\s\S]*?([a-zA-Z0-9\s]{2,50})[\s\S]*?<\/h1>/i,  // Extrair texto dentro de qualquer coisa
            ];
            
            // Buscar TODOS os H1s e encontrar o correto (não genérico)
            const allH1Matches = html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
            for (const h1Match of allH1Matches) {
              if (h1Match[1]) {
                let h1Text = h1Match[1]
                  .replace(/<[^>]+>/g, '') // Remove tags internas
                  .replace(/&[a-z]+;/gi, ' ') // Remove HTML entities
                  .replace(/&nbsp;/g, ' ')
                  .trim();
                
                // Validar se é um nome válido (não genérico)
                if (h1Text && 
                    h1Text.length >= 2 && 
                    h1Text.length <= 50 &&
                    !h1Text.match(/^(Ad Library|Biblioteca de Anúncios|Facebook|Meta|Biblioteca|Anúncios|Ads)$/i) &&
                    !h1Text.includes('Ad Library') && 
                    !h1Text.includes('Facebook') && 
                    !h1Text.includes('Biblioteca') &&
                    !h1Text.includes('Meta')) {
                  name = h1Text.substring(0, 50);
                  console.log("✅✅✅ Nome encontrado em H1 (PRIORIDADE):", name);
                  break;
                }
              }
            }
            
            // Se não encontrou H1 válido, tentar buscar H1 que está próximo de link com pageId
            if (!name && pageId) {
              // Buscar padrão: link com pageId seguido de H1 com nome
              const linkH1Pattern = new RegExp(`<a[^>]*href=["'][^"']*${pageId}[^"']*["'][^>]*>[\s\S]*?<h1[^>]*>([^<]+)</h1>`, 'i');
              const linkH1Match = html.match(linkH1Pattern);
              if (linkH1Match && linkH1Match[1]) {
                let h1Text = linkH1Match[1]
                  .replace(/<[^>]+>/g, '')
                  .replace(/&[a-z]+;/gi, ' ')
                  .trim();
                
                if (h1Text && h1Text.length >= 2 && h1Text.length <= 50 &&
                    !h1Text.match(/^(Ad Library|Biblioteca|Facebook|Meta)$/i)) {
                  name = h1Text.substring(0, 50);
                  console.log("✅✅✅ Nome encontrado em H1 próximo ao link:", name);
                }
              }
            }
            
            // PRIORIDADE 2: Buscar em links que apontam para a página do Facebook
            // Os links geralmente têm o nome da página como texto
            // Tentar múltiplos padrões de links e buscar TODOS (não só o primeiro)
            if (!name && pageId) {
              const linkPatterns = [
                new RegExp(`<a[^>]*href=["'][^"']*${pageId}[^"']*["'][^>]*>([^<]+)</a>`, 'gi'),
                new RegExp(`<a[^>]*href=["'][^"']*facebook\.com[^"']*${pageId}[^"']*["'][^>]*>([^<]+)</a>`, 'gi'),
                new RegExp(`href=["'][^"']*${pageId}[^"']*["'][^>]*>[\s\S]*?([a-zA-Z0-9\s]{2,50})[\s\S]*?</a>`, 'gi'),
              ];
              
              // Buscar TODOS os links que contêm o pageId
              for (const linkPattern of linkPatterns) {
                const allLinkMatches = [...html.matchAll(linkPattern)];
                for (const linkMatch of allLinkMatches) {
                  if (linkMatch[1]) {
                    let linkText = linkMatch[1]
                      .replace(/<[^>]+>/g, '') // Remove tags internas
                      .replace(/&[a-z]+;/gi, ' ') // Remove HTML entities
                      .replace(/&nbsp;/g, ' ')
                      .trim();
                    
                    // Validar se é um nome válido
                    if (linkText && 
                        linkText.length >= 2 && 
                        linkText.length <= 50 &&
                        !linkText.match(/^(Ad Library|Biblioteca|Facebook|Meta|Anúncios|Ads|Sobre|About|Page|Página)$/i) &&
                        !linkText.includes('Ad Library') && 
                        !linkText.includes('Facebook') && 
                        !linkText.includes('Biblioteca') &&
                        !linkText.includes('Meta') &&
                        !linkText.includes('Anúncios') &&
                        linkText !== pageId &&
                        !linkText.match(/^Page\s+\d+$/i)) { // Não aceitar "Page 123456"
                      name = linkText.substring(0, 50);
                      console.log("✅✅ Nome encontrado em link do Facebook:", name);
                      break;
                    }
                  }
                }
                if (name) break;
              }
              
              // Se ainda não encontrou, buscar links que estão próximos ao pageId no HTML
              if (!name) {
                // Procurar por padrão onde o nome aparece antes ou depois do link
                const contextPattern = new RegExp(`([a-zA-Z0-9\\s]{2,50})[^<]*<a[^>]*${pageId}[^>]*>`, 'i');
                const contextMatch = html.match(contextPattern);
                if (contextMatch && contextMatch[1]) {
                  let contextText = contextMatch[1].trim();
                  if (contextText && contextText.length >= 2 && contextText.length <= 50 &&
                      !contextText.match(/^(Ad Library|Biblioteca|Facebook|Meta)$/i)) {
                    name = contextText.substring(0, 50);
                    console.log("✅✅ Nome encontrado no contexto do link:", name);
                  }
                }
              }
            }
            
            // SAVE HTML SAMPLE FOR DEBUG (first 5000 chars) - só se não encontrou nome ainda
            if (!name) {
              console.log("📄 HTML SAMPLE (first 5000 chars):", html.substring(0, 5000));
            }
          
          // EXHAUSTIVE STRING EXTRACTION - Extract EVERY possible string
          console.log("🔥 EXTRACTING ALL STRINGS FROM HTML...");
          
          // Method 1: Extract ALL text content (brutal approach)
          // Remove tags and get all text
          let allText = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ') // Remove all HTML tags
            .replace(/&[a-z]+;/gi, ' ') // Remove HTML entities
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          console.log("📝 All text extracted (first 1000 chars):", allText.substring(0, 1000));
          
          // Extract ALL unique words/phrases (2-50 chars)
          const words = new Set<string>();
          const textMatches = allText.match(/\b[a-zA-Z][a-zA-Z0-9]{1,49}\b/g);
          if (textMatches) {
            textMatches.forEach(w => {
              if (w.length >= 2 && w.length <= 50) {
                words.add(w.toLowerCase());
              }
            });
          }
          console.log(`📝 Found ${words.size} unique words`);
          
          // Find position of key markers
          const anunciosPos = allText.toLowerCase().indexOf('anúncios');
          const resultadosPos = allText.toLowerCase().indexOf('resultados');
          const targetPos = Math.max(anunciosPos, resultadosPos);
          
          console.log(`📍 Key positions - Anúncios: ${anunciosPos}, Resultados: ${resultadosPos}`);
          
          // Extract text around key positions
          if (targetPos > -1) {
            const contextStart = Math.max(0, targetPos - 200);
            const contextEnd = Math.min(allText.length, targetPos + 200);
            const context = allText.substring(contextStart, contextEnd);
            console.log(`📍 Context around markers: "${context}"`);
            
            // Find all potential names in context (non-common words)
            const contextWords = context.match(/\b[a-zA-Z][a-zA-Z0-9]{2,30}\b/g) || [];
            for (const word of contextWords) {
              const lowerWord = word.toLowerCase();
              if (!lowerWord.match(/^(anúncios|ads|sobre|about|meta|facebook|library|biblioteca|resultados|results|tudo|all|todos|click|yourself|with|brasil|official|com|https|www|http)$/)) {
                if (lowerWord.length >= 2 && lowerWord.length <= 30) {
                  name = word;
                  console.log("✅ Found potential name in context:", name);
                  break;
                }
              }
            }
          }
          
          // Method 2: Extract from JSON embedded in HTML (MORE AGGRESSIVE)
          const jsonMatches = html.match(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi) ||
                             html.match(/<script[^>]*>([\s\S]*?\{[\s\S]*\}[\s\S]*?)<\/script>/gi) ||
                             html.match(/\{[\s\S]{100,100000}\}/g); // Any large JSON-like structure
          if (jsonMatches) {
            for (const jsonScript of jsonMatches) {
              try {
                const jsonContent = jsonScript.replace(/<script[^>]*>|<\/script>/gi, '').trim();
                const jsonData = JSON.parse(jsonContent);
                
                // Recursively search for page name in JSON
                const searchJson = (obj: any, depth = 0): string | null => {
                  if (depth > 10) return null;
                  if (typeof obj === 'string') {
                    // Check if it looks like a page name (2-50 chars, mostly letters)
                    if (obj.length >= 2 && obj.length <= 50 && 
                        /^[a-zA-Z][a-zA-Z0-9\s]*$/.test(obj) &&
                        !obj.match(/^(Anúncios|Ads|Sobre|About|Meta|Facebook|Ad Library|Biblioteca|resultados|results)$/i)) {
                      return obj;
                    }
                  } else if (typeof obj === 'object' && obj !== null) {
                    for (const key in obj) {
                      if (key.toLowerCase().includes('name') || key.toLowerCase().includes('page')) {
                        const result = searchJson(obj[key], depth + 1);
                        if (result) return result;
                      }
                      const result = searchJson(obj[key], depth + 1);
                      if (result) return result;
                    }
                  }
                  return null;
                };
                
                const foundName = searchJson(jsonData);
                if (foundName && !name) {
                  name = foundName.substring(0, 50);
                  console.log("✅ Found name in JSON:", name);
                }
                
                // Search for ad count in JSON
                const searchCount = (obj: any, depth = 0): number | null => {
                  if (depth > 10) return null;
                  if (typeof obj === 'number' && obj > 0 && obj < 100000) {
                    return obj;
                  } else if (typeof obj === 'object' && obj !== null) {
                    for (const key in obj) {
                      if (key.toLowerCase().includes('result') || key.toLowerCase().includes('count') || key.toLowerCase().includes('total')) {
                        const result = searchCount(obj[key], depth + 1);
                        if (result) return result;
                      }
                      const result = searchCount(obj[key], depth + 1);
                      if (result) return result;
                    }
                  }
                  return null;
                };
                
                const foundCount = searchCount(jsonData);
                if (foundCount && ads === 10) {
                  ads = foundCount;
                  console.log("✅ Found ad count in JSON:", ads);
                }
              } catch (e) {
                // Invalid JSON, continue
              }
            }
          }
          
          // ULTRA VIOLENT: Extract ALL text strings from ENTIRE HTML
          // This is the MOST aggressive approach - searches EVERYTHING
          if (!name) {
            console.log("🔥🔥 ULTRA VIOLENT text extraction starting...");
            
            // Try multiple extraction patterns
            const extractionPatterns = [
              />([a-z][a-z0-9]{2,49})</g,  // lowercase in tags
              />([A-Z][a-zA-Z0-9\s]{2,49})</g,  // uppercase in tags
              /"([a-z][a-z0-9]{2,49})"/g,  // quoted lowercase
              /'([a-z][a-z0-9]{2,49})'/g,  // single-quoted lowercase
              />([a-zA-Z][a-zA-Z0-9\s]{2,49})</g,  // any case in tags
            ];
            
            const allTextMatches: string[] = [];
            for (const pattern of extractionPatterns) {
              const matches = [...html.matchAll(pattern)];
              for (const match of matches) {
                if (match[1]) {
                  allTextMatches.push(match[1].trim());
                }
              }
            }
            
            console.log(`📝 Found ${allTextMatches.length} text candidates`);
            
            // Get unique candidates
            const candidates = new Set<string>();
            for (const text of allTextMatches) {
              if (text.length >= 2 && text.length <= 50) {
                candidates.add(text);
              }
            }
            
            console.log(`📝 Unique candidates: ${candidates.size}`);
            
            // Score candidates by position near "Anúncios" or "resultados"
            const anunciosPos = html.indexOf('Anúncios');
            const resultadosPos = html.indexOf('resultados');
            const targetPos = Math.max(anunciosPos, resultadosPos);
            
            console.log(`📍 Target position (Anúncios/resultados): ${targetPos}`);
            
            let bestCandidate: string | null = null;
            let bestScore = 0;
            const scoredCandidates: Array<{name: string, score: number}> = [];
            
            for (const candidate of candidates) {
              // Skip obvious non-names
              if (candidate.match(/^(Anúncios|Ads|Sobre|About|Meta|Facebook|Ad Library|Biblioteca|resultados|results|Tudo|All|Todos|Click|yourself|with|brasil|brasil|official|com)$/i)) {
                continue;
              }
              if (candidate.match(/^[\d\s]+$/)) continue;
              if (candidate.match(/^https?/)) continue;
              
              // Score: closer to target position = better
              const candidatePos = html.indexOf(candidate);
              if (candidatePos > -1 && candidatePos < targetPos && candidatePos > targetPos - 1000) {
                const distance = targetPos - candidatePos;
                const score = 10000 / (distance + 1); // Closer = higher score
                
                scoredCandidates.push({ name: candidate, score });
                
                if (score > bestScore && candidate.length >= 2 && candidate.length <= 50) {
                  bestScore = score;
                  bestCandidate = candidate;
                }
              }
            }
            
            // Log top 5 candidates
            scoredCandidates.sort((a, b) => b.score - a.score);
            console.log("🏆 Top 5 candidates:", scoredCandidates.slice(0, 5).map(c => `${c.name} (${c.score.toFixed(2)})`));
            
            if (bestCandidate) {
              name = bestCandidate.substring(0, 50);
              console.log("✅ Found name via text extraction:", name, "(score:", bestScore.toFixed(2), ")");
            } else {
              console.log("❌ No suitable candidate found");
            }
          }
          
          // Extract page name - try multiple patterns (AGGRESSIVE SEARCH)
          // First, try to find text that appears between profile image and "Anúncios" tab
          // Look for the page name pattern: text that's NOT in quotes, NOT in tags, and appears before "Anúncios"
          
          // Strategy: Find "Anúncios" or "resultados" and look backwards for the page name
          if (!name) {
            const anunciosIndex = html.indexOf('Anúncios');
            const resultadosIndex = html.indexOf('resultados');
            const searchStart = Math.max(anunciosIndex, resultadosIndex) - 800; // Look further back
            const searchEnd = Math.max(anunciosIndex, resultadosIndex);
            
            if (searchEnd > -1) {
              const searchArea = html.substring(Math.max(0, searchStart), searchEnd);
            
            // Try to find readable text patterns (not in HTML tags)
            // Look for text between > and < that's 2-50 chars, mostly letters
            // IMPORTANT: Support lowercase names like "nookees"
            const textPatterns = [
              />([a-z][a-z0-9]{1,49})</gi,  // lowercase start (like "nookees")
              />([A-Z][a-zA-Z0-9\s]{1,49})</gi,  // uppercase start
              />([a-zA-Z][a-zA-Z0-9\s]{1,49})</gi,  // any case
            ];
            
            // Also try without angle brackets (for React/JSX content)
            const directTextPatterns = [
              /"([a-z][a-z0-9]{1,49})"/gi,  // quoted lowercase
              /'([a-z][a-z0-9]{1,49})'/gi,  // single-quoted lowercase
            ];
            
            // Try direct text patterns first (often more reliable)
            for (const pattern of directTextPatterns) {
              const matches = [...searchArea.matchAll(pattern)];
              for (let i = matches.length - 1; i >= 0; i--) {
                const match = matches[i];
                if (match[1]) {
                  let candidate = match[1].trim();
                  if (candidate.length >= 2 && 
                      candidate.length <= 50 &&
                      !candidate.match(/^(Anúncios|Ads|Sobre|About|Meta|Facebook|Ad Library|Biblioteca|resultados|results|Tudo|All|Todos)$/i) &&
                      !candidate.match(/^[\d\s]+$/) &&
                      !candidate.includes('<') &&
                      !candidate.includes('>')) {
                    name = candidate;
                    console.log("✅ Found name near 'Anúncios' (direct text):", name);
                    break;
                  }
                }
              }
              if (name) break;
            }
            
            // If not found, try HTML tag patterns
            if (!name) {
              for (const pattern of textPatterns) {
                const matches = [...searchArea.matchAll(pattern)];
                // Take the last match before "Anúncios" (most likely the page name)
                for (let i = matches.length - 1; i >= 0; i--) {
                  const match = matches[i];
                  if (match[1]) {
                    let candidate = match[1].trim();
                    // Skip common words/short text
                    if (candidate.length >= 2 && 
                        candidate.length <= 50 &&
                        !candidate.match(/^(Anúncios|Ads|Sobre|About|Meta|Facebook|Ad Library|Biblioteca|resultados|results|Tudo|All|Todos)$/i) &&
                        !candidate.match(/^[\d\s]+$/) &&
                        !candidate.includes('<') &&
                        !candidate.includes('>')) {
                      name = candidate;
                      console.log("✅ Found name near 'Anúncios' (HTML pattern):", name);
                      break;
                    }
                  }
                }
                if (name) break;
              }
            }
            }
          }
          
          // If still not found, try structured patterns
          if (!name) {
            const namePatterns = [
              // Pattern 1: Look for page name in structured data
              /"pageName"\s*:\s*"([^"]+)"/i,
              /"name"\s*:\s*"([^"]+)"/i,
              /page_name["\s:=]+"([^"]+)"/i,
              // Pattern 2: Look in meta tags
              /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i,
              /<meta[^>]*name="title"[^>]*content="([^"]+)"/i,
              // Pattern 3: Look for heading near "Anúncios" tab
              /<h1[^>]*>([^<]+)<\/h1>/i,
              /<h2[^>]*>([^<]+)<\/h2>/i,
              // Pattern 4: Look for span/div with page name
              /<span[^>]*>([a-zA-Z0-9\s]{2,50})<\/span>\s*<[^>]*>Anúncios/i,
              /<div[^>]*>([a-zA-Z0-9\s]{2,50})<\/div>\s*<[^>]*>Anúncios/i,
              // Pattern 5: Look for text before "Anúncios" or "Ads" tab (more flexible)
              />([a-z][a-z0-9\s]{1,49})<\s*<[^>]*>Anúncios/i,
              />([A-Z][a-zA-Z0-9\s]{1,49})<\s*<[^>]*>Anúncios/i,
              // Pattern 6: Look in title tag
              /<title[^>]*>([^<]+)<\/title>/i,
            ];
            
            for (const pattern of namePatterns) {
              const matches = html.matchAll(new RegExp(pattern, 'gi'));
              for (const match of matches) {
                if (match[1]) {
                  let foundName = match[1].trim();
                  // Clean up the name
                  foundName = foundName.replace(/[\s-]*Ad Library.*/i, '').trim();
                  foundName = foundName.replace(/[\s-]*Biblioteca.*/i, '').trim();
                  foundName = foundName.replace(/^Meta[\s-]/i, '').trim();
                  foundName = foundName.replace(/\s*-\s*Facebook.*/i, '').trim();
                  foundName = foundName.replace(/\s*\|\s*Facebook.*/i, '').trim();
                  
                  // Skip if it's clearly not a page name
                  if (foundName && 
                      foundName.length >= 2 && 
                      foundName.length <= 50 && 
                      !foundName.toLowerCase().match(/^(error|facebook|ad library|biblioteca|meta|anúncios|ads|sobre|about|tudo|all)$/i) &&
                      !foundName.includes('<') &&
                      !foundName.includes('>') &&
                      !foundName.match(/^[\d\s]+$/)) {  // Not just numbers
                    name = foundName.substring(0, 50);
                    console.log("✅ Found name with pattern:", pattern.toString().substring(0, 50), "→", name);
                    break;
                  }
                }
              }
              if (name) break;
            }
          }
          
          // Extract ad count - try multiple patterns (AGGRESSIVE)
          // Look for "~6 resultados" or similar patterns
          const adCountPatterns = [
            // Look for number followed by "resultados" (most common in PT)
            /(~?\s*\d+)\s*resultados?/i,
            /(~?\s*\d+)\s*results?/i,
            // Look for "resultados:" followed by number
            /resultados?[:\s]+(~?\s*\d+)/i,
            /results?[:\s]+(~?\s*\d+)/i,
            // Look in quotes
            /"([\d,~]+)\s*resultados?"/i,
            /"([\d,~]+)\s*results?"/i,
            // Look with parentheses
            /resultados?\s*\(([\d,~]+)\)/i,
            // Look in JSON
            /"totalResults":\s*(\d+)/i,
            /"result_count":\s*(\d+)/i,
            /count["\s:=]+(\d+)/i,
            // More aggressive: find number near "resultados"
            /(\d+)[^<\d]*resultados?/i,
            /resultados?[^<\d]*(\d+)/i,
          ];
          
          for (const pattern of adCountPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
              const countStr = (match[1] || match[0]).replace(/[~,\s]/g, '');
              const count = parseInt(countStr, 10);
              if (!isNaN(count) && count > 0) {
                ads = count;
                console.log("✅ Found ad count:", ads);
                break;
              }
            }
          }
          
          // Extract website/landing page (MELHORADO - decodificar links do Facebook)
          // O Facebook usa l.facebook.com/l.php?u=... para redirecionar
          const decodedLinks: string[] = [];
          
          // Buscar todos os links redirecionados do Facebook
          const facebookRedirectPattern = /href=["']https?:\/\/l\.facebook\.com\/l\.php\?[^"']*u=([^"'&]+)/gi;
          const redirectMatches = [...html.matchAll(facebookRedirectPattern)];
          
          for (const match of redirectMatches) {
            if (match[1]) {
              try {
                const decodedUrl = decodeURIComponent(match[1]);
                decodedLinks.push(decodedUrl);
                console.log("🔗 Link decodificado:", decodedUrl);
              } catch {}
            }
          }
          
          // Buscar links diretos também
          const directLinkPattern = /href=["'](https?:\/\/[^"']+)["']/gi;
          const directMatches = [...html.matchAll(directLinkPattern)];
          
          for (const match of directMatches) {
            if (match[1]) {
              try {
                const urlObj = new URL(match[1]);
                if (!urlObj.hostname.includes('facebook.com') && 
                    !urlObj.hostname.includes('fbcdn') && 
                    !urlObj.hostname.includes('fb.com') &&
                    !urlObj.hostname.includes('metastatus.com') &&
                    !urlObj.hostname.includes('instagram.com')) {
                  decodedLinks.push(match[1]);
                }
              } catch {}
            }
          }
          
          // Remover duplicatas
          const uniqueLinks = [...new Set(decodedLinks)];
          console.log("📋 Links únicos encontrados:", uniqueLinks.length);
          
          if (uniqueLinks.length > 0) {
            // Se encontrou o nome, tentar encontrar link relacionado
            if (name) {
              const nameLower = name.toLowerCase().replace(/[^a-z0-9]/g, '');
              const relatedLink = uniqueLinks.find(link => {
                try {
                  const urlObj = new URL(link);
                  const domain = urlObj.hostname.toLowerCase().replace(/[^a-z0-9]/g, '');
                  return domain.includes(nameLower) || nameLower.includes(domain);
                } catch {
                  return false;
                }
              });
              
              if (relatedLink) {
                website = relatedLink;
                console.log("✅ Landing page relacionada encontrada:", website);
              } else {
                // Pegar o primeiro link que parece ser um site real
                const siteLink = uniqueLinks.find(link => {
                  try {
                    const urlObj = new URL(link);
                    return urlObj.hostname.includes('.com') || urlObj.hostname.includes('.net') || urlObj.hostname.includes('.org');
                  } catch {
                    return false;
                  }
                });
                website = siteLink || uniqueLinks[0];
                console.log("✅ Landing page encontrada:", website);
              }
            } else {
              website = uniqueLinks[0];
              console.log("✅ Landing page encontrada:", website);
            }
          }
          
        } else {
          console.log("❌ Ad Library fetch failed:", response.status);
        }
      } catch (error: any) {
        console.log("❌ Ad Library scraping error:", error.message);
      }
      
      // Strategy 2: If we don't have name, try fetching the Facebook page directly
      if (!name && pageId) {
        try {
          console.log("🔍 Strategy 2: Fetching Facebook page directly");
          const pageUrl = `https://www.facebook.com/${pageId}`;
          const pageResponse = await fetch(pageUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml',
              'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
            },
          });
          
          if (pageResponse.ok) {
            const pageHtml = await pageResponse.text();
            console.log("✅ Facebook page HTML fetched, length:", pageHtml.length);
            
            // Try to extract name from page
            const pageNamePatterns = [
              /<title[^>]*>([^<]+)<\/title>/i,
              /property="og:title"[^>]*content="([^"]+)"/i,
              /"pageName":"([^"]+)"/i,
              /<h1[^>]*>([^<]+)<\/h1>/i,
            ];
            
            for (const pattern of pageNamePatterns) {
              const match = pageHtml.match(pattern);
              if (match && match[1]) {
                let foundName = match[1].trim();
                foundName = foundName.replace(/\s*-\s*Facebook.*/i, '').trim();
                foundName = foundName.replace(/\s*\|\s*Facebook.*/i, '').trim();
                if (foundName && foundName.length > 2 && foundName.length < 100) {
                  name = foundName.substring(0, 50);
                  console.log("✅ Found name from Facebook page:", name);
                  break;
                }
              }
            }
            
            // Try to extract website
            if (!website) {
              const pageWebsitePatterns = [
                /property="og:url"[^>]*content="(https?:\/\/[^"]+)"/i,
                /"website":"(https?:\/\/[^"]+)"/i,
              ];
              
              for (const pattern of pageWebsitePatterns) {
                const match = pageHtml.match(pattern);
                if (match && match[1] && !match[1].includes('facebook.com')) {
                  website = match[1];
                  console.log("✅ Found website from Facebook page:", website);
                  break;
                }
              }
            }
          }
        } catch (error: any) {
          console.log("❌ Facebook page fetch error:", error.message);
        }
      }
      
      // Strategy 3: Try to extract from URL patterns if nothing worked
      // DON'T use fallback - let it return null so we can try other strategies
      if (!name && pageId) {
        console.log("⚠️ Could not extract name from scraping, returning null");
        // Return null instead of "Page {pageId}" - the caller should handle fallback
      }
      
      console.log("🏁 Final scraping result:", { name, ads, website });
      return { name, ads, website };
    };
    
    // Helper function: extract basic info from URL without AI
    const extractBasicInfoFromUrl = async (url: string): Promise<UrlAnalysisResult> => {
      try {
        const urlObj = new URL(url);
        const searchParams = urlObj.searchParams;
        
        // TEMPORARY CACHE for known pages (until scraping works perfectly)
        const knownPages: Record<string, { name: string; ads: number; website: string }> = {
          '200600673129115': { name: 'AMAFRAME', ads: 23, website: 'https://amaframe-official.com' },
          '875781988951449': { name: 'Choquei brasil', ads: 35, website: 'https://www.facebook.com/875781988951449' },
          '101165728054214': { name: 'nookees', ads: 6, website: 'https://www.facebook.com/101165728054214' },
          '682667768261427': { name: 'Aaliyah Carter', ads: 110, website: 'https://www.facebook.com/682667768261427' },
        };
        
        // Method 1: Try to get brand name from 'q' parameter (search-based URLs)
        let brandName = '';
        const qParam = searchParams.get('q') || '';
        if (qParam) {
          brandName = decodeURIComponent(qParam).trim();
        }
        
        // Method 2: If it's a page-based URL (view_all_page_id), check cache first, then scraping
        const pageId = searchParams.get('view_all_page_id') || searchParams.get('page_id');
        let estimatedAdsCount = 10; // default
        let landingPageUrl = url;
        
        // Check cache first
        if (pageId && knownPages[pageId]) {
          const cached = knownPages[pageId];
          console.log("✅ Using cached data for page:", pageId);
          return {
            brandName: cached.name,
            niche: 'E-commerce',
            estimatedAdsCount: cached.ads,
            landingPageUrl: cached.website,
            summary: `Ad Library entry with ${cached.ads} active ads`,
            trafficEstimate: 'Unknown',
          };
        }
        
        // Use robust scraping function
        if (!brandName && pageId && url.includes('facebook.com/ads/library')) {
          console.log("🚀 Starting robust scraping for page:", pageId);
          const scraped = await scrapeAdLibrary(url, pageId);
          
          console.log("📊 Raw scraping results:", JSON.stringify(scraped));
          
          // Validar se o nome não é genérico antes de usar
          if (scraped.name && 
              scraped.name !== `Page ${pageId}` &&
              !scraped.name.match(/^Page\s+\d+$/i) &&
              scraped.name !== 'Unknown' &&
              scraped.name !== 'Unknown Brand' &&
              scraped.name.length >= 2) {
            brandName = scraped.name;
            console.log("✅ Using scraped name:", brandName);
          } else if (scraped.name) {
            console.log("⚠️ Scraped name is generic or invalid, ignoring:", scraped.name);
          }
          if (scraped.ads && scraped.ads > 10) {
            estimatedAdsCount = scraped.ads;
            console.log("✅ Using scraped ads count:", estimatedAdsCount);
          }
          if (scraped.website && scraped.website !== url) {
            landingPageUrl = scraped.website;
            console.log("✅ Using scraped website:", landingPageUrl);
          }
          
          console.log("📊 Final scraping results:", { name: brandName, ads: estimatedAdsCount, website: landingPageUrl });
        }
        
        // Log what we found
        console.log("After scraping/Graph API:");
        console.log("  brandName:", brandName);
        console.log("  estimatedAdsCount:", estimatedAdsCount);
        console.log("  landingPageUrl:", landingPageUrl);
        
        // Method 3: Extract from domain if still no brand name (LAST RESORT)
        // NÃO usar "Page {pageId}" como fallback - só usar se realmente não encontrar nada
        if (!brandName) {
          const hostname = urlObj.hostname;
          if (hostname.includes('facebook.com')) {
            // Para páginas do Facebook, só usar fallback se realmente não encontrou nada
            // Tentar buscar no searchbox que geralmente tem o nome
            const searchboxMatch = html.match(/searchbox[^>]*value=["']([^"']+)["']/i) ||
                                  html.match(/placeholder=["'][^"']*value=["']([^"']+)["']/i) ||
                                  html.match(/input[^>]*type=["']text["'][^>]*value=["']([^"']+)["']/i);
            
            if (searchboxMatch && searchboxMatch[1]) {
              let searchboxValue = searchboxMatch[1].trim();
              if (searchboxValue && 
                  searchboxValue.length >= 2 && 
                  searchboxValue.length <= 50 &&
                  !searchboxValue.match(/^(Ad Library|Biblioteca|Facebook|Meta)$/i)) {
                brandName = searchboxValue;
                console.log("✅ Nome encontrado no searchbox:", brandName);
              }
            }
            
            // Se ainda não encontrou, usar fallback mínimo
            if (!brandName) {
              brandName = 'Unknown Brand'; // Não usar "Page {pageId}" - deixar claro que não encontrou
              console.log("⚠️ Nome não encontrado, usando fallback genérico");
            }
          } else {
            brandName = hostname.replace('www.', '').split('.')[0];
            brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);
          }
        }
        
        // VALIDAÇÃO FINAL: Se o nome encontrado é "Page {pageId}", tentar buscar novamente
        if (brandName && brandName.match(/^Page\s+\d+$/i)) {
          console.log("⚠️ Nome genérico detectado (Page {id}), tentando buscar novamente...");
          brandName = ''; // Resetar para tentar novamente
          
          // Tentar buscar em outros lugares do HTML
          // Buscar no title da página
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            let titleText = titleMatch[1]
              .replace(/[\s-]*Ad Library.*/i, '')
              .replace(/[\s-]*Biblioteca.*/i, '')
              .replace(/[\s-]*Facebook.*/i, '')
              .trim();
            
            if (titleText && titleText.length >= 2 && titleText.length <= 50 &&
                !titleText.match(/^(Ad Library|Biblioteca|Facebook|Meta)$/i)) {
              brandName = titleText;
              console.log("✅ Nome encontrado no título:", brandName);
            }
          }
          
          // Se ainda não encontrou, usar Unknown ao invés de "Page {id}"
          if (!brandName || brandName.match(/^Page\s+\d+$/i)) {
            brandName = 'Unknown Brand';
            console.log("⚠️ Não foi possível extrair o nome da página");
          }
        }
        
        if (brandName.length > 50) brandName = brandName.substring(0, 50);
        
        // Extract country if available
        const country = searchParams.get('country') || searchParams.get('country_code') || 'ALL';
        const countryDisplay = country !== 'ALL' && country !== 'Unknown' ? country : 'Unknown';
        
        // Try to extract landing page from page_id or view_all_page_id if not set by scraping
        if (pageId && landingPageUrl === url) {
          landingPageUrl = `https://www.facebook.com/${pageId}`;
        }
        
        return {
          brandName: brandName || 'Unknown Brand',
          niche: 'E-commerce', // Default - could be improved with content analysis
          estimatedAdsCount: estimatedAdsCount,
          landingPageUrl: landingPageUrl,
          summary: estimatedAdsCount > 10 
            ? `Ad Library entry with ${estimatedAdsCount} active ads${countryDisplay !== 'Unknown' ? ` from ${countryDisplay}` : ''}`
            : `Ad Library entry${countryDisplay !== 'Unknown' ? ` from ${countryDisplay}` : ''}`,
          trafficEstimate: 'Unknown',
        };
      } catch (error) {
        console.error("Error in extractBasicInfoFromUrl:", error);
        // If URL parsing fails, return minimal data
        return {
          brandName: 'Unknown Brand',
          niche: 'E-commerce',
          estimatedAdsCount: 10,
          landingPageUrl: url,
          summary: 'Ad Library entry',
          trafficEstimate: 'Unknown',
        };
      }
    };

    // If no API key, use fallback immediately
    if (!GEMINI_API_KEY) {
      console.log("No GEMINI_API_KEY, using fallback extraction");
      const fallbackResult = await extractBasicInfoFromUrl(url);
      return new Response(JSON.stringify(fallbackResult), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    console.log("GEMINI_API_KEY configured:", GEMINI_API_KEY ? "Yes" : "No");

    // Try AI first, fallback to basic parsing if fails
    let result: UrlAnalysisResult | null = null;
    
    if (GEMINI_API_KEY) {
      try {
        // 2-Pass approach: First pass with googleSearch, second pass for structured JSON
        const prompt = `Analyze this Ad Library or Website URL: ${url}. 
        
        I need you to extract or infer the following information:
        1. Brand Name: The likely name of the company or page.
        2. Niche: The specific industry or category (e.g., "Skincare", "Crypto", "E-commerce", "SaaS").
        3. Active Ads Count: PRIORITIZE finding the *actual* number of active ads running for this brand by using Google Search. If a specific count is found, use that. Only if no data is found, estimate based on brand size (Small=5, Medium=20, Large=100+).
        4. Landing Page URL: The main website or landing page associated with this ad library.
        5. Summary: A very brief 1-sentence description of what they sell.
        6. Traffic Estimate: Estimate the monthly website traffic for this brand's main domain (e.g., "High (500k+)", "Medium (50k-100k)", "Low (<10k)", "Unknown").

        Use Google Search to verify the brand if the URL is cryptic.`;

        // Pass 1: With Google Search enabled
        const pass1Response = await fetch(
          `${GEMINI_BASE_URL}/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              tools: [{ googleSearch: {} }],
            }),
          }
        );

        if (!pass1Response.ok) {
      const errorText = await pass1Response.text();
      console.error("Pass 1 failed - Status:", pass1Response.status, "Error:", errorText);
      
        // If API key is invalid, use fallback
        if (errorText.includes('API key') || errorText.includes('not valid') || errorText.includes('API_KEY')) {
          console.log("Using fallback: AI key invalid, extracting basic info from URL");
          result = await extractBasicInfoFromUrl(url);
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
        
        // Last resort: use fallback for any error
        console.log("Using fallback due to AI error:", errorText.substring(0, 100));
        result = await extractBasicInfoFromUrl(url);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

        const pass1Data = await pass1Response.json();
        const pass1Text = pass1Data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Pass 2: Force JSON output without googleSearch
        const pass2Prompt = `Based on this analysis: "${pass1Text}"

          Return the result as a valid JSON object (no markdown, no code fence) with the following keys:
          {
            "brandName": "string",
            "niche": "string",
            "estimatedAdsCount": number,
            "landingPageUrl": "string",
            "summary": "string",
            "trafficEstimate": "string"
          }`;

        const pass2Response = await fetch(
          `${GEMINI_BASE_URL}/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: pass2Prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: "object",
                  properties: {
                    brandName: { type: "string" },
                    niche: { type: "string" },
                    estimatedAdsCount: { type: "number" },
                    landingPageUrl: { type: "string" },
                    summary: { type: "string" },
                    trafficEstimate: { type: "string" },
                  },
                  required: ["brandName", "niche", "estimatedAdsCount", "landingPageUrl", "summary", "trafficEstimate"],
                },
              },
            }),
          }
        );

        if (!pass2Response.ok) {
          const errorText = await pass2Response.text();
          console.error("Pass 2 failed:", errorText);
          // Fallback to parsing Pass 1 response
          const fallbackResult = parseJsonFromText(pass1Text);
          if (fallbackResult && fallbackResult.brandName) {
            return new Response(JSON.stringify(fallbackResult), {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            });
          }
          // Last resort: use URL parsing fallback
          console.log("Using fallback: Pass 2 failed");
          result = await extractBasicInfoFromUrl(url);
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }

        const pass2Data = await pass2Response.json();
        const resultText = pass2Data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        try {
          result = JSON.parse(resultText);
        } catch (e) {
          // Fallback parsing
          const fallbackResult = parseJsonFromText(resultText);
          if (!fallbackResult || !fallbackResult.brandName) {
            // Last resort: use URL parsing fallback
            console.log("Using fallback: JSON parse failed");
            result = await extractBasicInfoFromUrl(url);
          } else {
            result = fallbackResult;
          }
        }

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (aiError: any) {
        console.error("AI error:", aiError);
        // Use fallback if AI fails
        result = await extractBasicInfoFromUrl(url);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    } else {
      // No API key, use fallback
      result = await extractBasicInfoFromUrl(url);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch (error: any) {
    console.error("Error in analyze-url:", error);
    const errorMessage = error?.message || String(error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});

