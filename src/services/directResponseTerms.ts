// Termos de Venda Direta (Direct Response) comuns em anúncios escalados
// Esses termos indicam ofertas com alta conversão

export const DIRECT_RESPONSE_TERMS = [
  // Prova Social e Resultados
  'resultados comprovados',
  'resultados reais',
  'comprovado',
  'testado',
  'aprovado',
  'garantido',
  'milhares de',
  'centenas de',
  'milhares',
  'centenas',
  
  // Urgência e Escassez
  'últimas horas',
  'últimas vagas',
  'por tempo limitado',
  'oferta limitada',
  'estoque limitado',
  'apenas hoje',
  'hoje apenas',
  'não perca',
  'não deixe passar',
  
  // Benefícios e Transformação
  'transforme',
  'descubra',
  'revele',
  'método',
  'sistema',
  'segredo',
  'fórmula',
  'técnica',
  'estratégia',
  
  // Garantias e Redução de Risco
  'garantia',
  'sem risco',
  'sem compromisso',
  'teste grátis',
  'experimente',
  'prove',
  'comprove',
  
  // Call to Action Forte
  'comece agora',
  'comece hoje',
  'comece já',
  'acesse agora',
  'clique agora',
  'saiba mais',
  'descubra mais',
  'veja como',
  'aprenda como',
  
  // Números e Estatísticas
  'em apenas',
  'em x dias',
  'x% de desconto',
  'por apenas',
  'apenas',
  'somente',
  
  // Depoimentos e Testemunhos
  'depoimento',
  'testemunho',
  'história real',
  'caso real',
  'experiência real',
  
  // Variações em espanhol
  'resultados comprobados',
  'comprobado',
  'garantizado',
  'miles de',
  'cientos de',
  'últimas horas',
  'últimas plazas',
  'oferta limitada',
  'solo hoy',
  'hoy solo',
  'sin riesgo',
  'prueba gratis',
  'comienza ahora',
  'descubre más',
  've cómo',
  'aprende cómo',
];

// Função para detectar se um anúncio tem termos de venda direta
export function hasDirectResponseTerms(text: string | null): boolean {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  
  // Verificar se contém pelo menos um termo de DR
  return DIRECT_RESPONSE_TERMS.some(term => 
    lowerText.includes(term.toLowerCase())
  );
}

// Função para contar quantos termos de DR um anúncio tem
export function countDirectResponseTerms(text: string | null): number {
  if (!text) return 0;
  
  const lowerText = text.toLowerCase();
  
  return DIRECT_RESPONSE_TERMS.filter(term => 
    lowerText.includes(term.toLowerCase())
  ).length;
}

// Função para extrair termos de DR encontrados
export function extractDirectResponseTerms(text: string | null): string[] {
  if (!text) return [];
  
  const lowerText = text.toLowerCase();
  
  return DIRECT_RESPONSE_TERMS.filter(term => 
    lowerText.includes(term.toLowerCase())
  );
}

