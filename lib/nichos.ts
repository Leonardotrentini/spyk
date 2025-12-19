// Nichos populares para DR/Infoprodutos na LATAM
// Baseado em padrões de mercado e palavras-chave comuns

export const NICHOS = [
  {
    id: 'financas',
    nome: 'Finanças',
    keywords: [
      'dinheiro', 'renda', 'investimento', 'trading', 'forex', 'criptomoeda',
      'bitcoin', 'ganhar dinheiro', 'renda extra', 'passiva', 'fortuna',
      'riqueza', 'milhão', 'lucro', 'dividendos', 'ações', 'bolsa'
    ],
    descricao: 'Cursos e produtos sobre dinheiro, investimentos e renda'
  },
  {
    id: 'saude',
    nome: 'Saúde e Bem-estar',
    keywords: [
      'emagrecer', 'perder peso', 'dieta', 'fitness', 'academia', 'treino',
      'musculação', 'saúde', 'bem-estar', 'nutrição', 'suplemento',
      'queima de gordura', 'definição', 'hipertrofia', 'corpo', 'shape'
    ],
    descricao: 'Produtos relacionados a saúde, fitness e emagrecimento'
  },
  {
    id: 'relacionamento',
    nome: 'Relacionamento',
    keywords: [
      'namoro', 'casamento', 'relacionamento', 'atrair', 'sedução',
      'conquistar', 'amor', 'casal', 'mulher', 'homem', 'paquera',
      'flerte', 'encontro', 'romance', 'atração'
    ],
    descricao: 'Cursos sobre relacionamentos e sedução'
  },
  {
    id: 'marketing',
    nome: 'Marketing e Vendas',
    keywords: [
      'vender', 'vendas', 'marketing', 'tráfego', 'anúncios', 'facebook ads',
      'instagram ads', 'copywriting', 'copy', 'funil', 'conversão',
      'cliente', 'negócio', 'empresa', 'empreendedor', 'negócio online'
    ],
    descricao: 'Produtos sobre marketing digital e vendas'
  },
  {
    id: 'educacao',
    nome: 'Educação e Ensino',
    keywords: [
      'curso', 'aprender', 'ensino', 'educação', 'estudar', 'concurso',
      'vestibular', 'idioma', 'inglês', 'espanhol', 'português',
      'matemática', 'português', 'redação', 'enem'
    ],
    descricao: 'Cursos educacionais e preparatórios'
  },
  {
    id: 'desenvolvimento-pessoal',
    nome: 'Desenvolvimento Pessoal',
    keywords: [
      'sucesso', 'motivação', 'produtividade', 'hábitos', 'mindset',
      'mentalidade', 'crescimento', 'pessoal', 'autoajuda', 'transformação',
      'mudança', 'realização', 'objetivos', 'metas', 'disciplina'
    ],
    descricao: 'Produtos de desenvolvimento pessoal e crescimento'
  },
  {
    id: 'tecnologia',
    nome: 'Tecnologia',
    keywords: [
      'programação', 'código', 'desenvolvimento', 'web', 'app', 'software',
      'python', 'javascript', 'html', 'css', 'react', 'node',
      'tecnologia', 'tech', 'digital', 'online', 'internet'
    ],
    descricao: 'Cursos de programação e tecnologia'
  },
  {
    id: 'beleza',
    nome: 'Beleza e Estética',
    keywords: [
      'beleza', 'estética', 'cabelo', 'maquiagem', 'skincare', 'pele',
      'rosto', 'corpo', 'tratamento', 'cosmético', 'procedimento',
      'estética facial', 'cuidados', 'autoestima'
    ],
    descricao: 'Produtos de beleza e cuidados estéticos'
  },
  {
    id: 'imoveis',
    nome: 'Imóveis',
    keywords: [
      'imóvel', 'casa', 'apartamento', 'investimento imobiliário',
      'comprar casa', 'vender imóvel', 'corretor', 'imobiliária',
      'financiamento', 'construção', 'reforma'
    ],
    descricao: 'Cursos sobre investimento e negócios imobiliários'
  },
  {
    id: 'outros',
    nome: 'Outros',
    keywords: [],
    descricao: 'Outros nichos não categorizados'
  }
] as const

export type NichoId = typeof NICHOS[number]['id']

// Função para identificar nicho baseado no conteúdo do anúncio
export function identificarNicho(ad: {
  ad_creative_body?: string | null
  ad_creative_link_title?: string | null
  ad_creative_link_description?: string | null
}): NichoId {
  // Combinar todo o texto do anúncio
  const textoCompleto = [
    ad.ad_creative_body || '',
    ad.ad_creative_link_title || '',
    ad.ad_creative_link_description || ''
  ].join(' ').toLowerCase()

  // Contar matches por nicho
  const scores: Record<NichoId, number> = {} as Record<NichoId, number>

  for (const nicho of NICHOS) {
    if (nicho.id === 'outros') continue

    let score = 0
    for (const keyword of nicho.keywords) {
      // Contar ocorrências da palavra-chave
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = textoCompleto.match(regex)
      if (matches) {
        score += matches.length
      }
    }
    scores[nicho.id] = score
  }

  // Encontrar nicho com maior score
  const nichoId = Object.entries(scores).reduce((a, b) => 
    scores[a[0] as NichoId] > scores[b[0] as NichoId] ? a : b
  )?.[0] as NichoId

  // Se nenhum nicho teve score > 0, retornar 'outros'
  if (!nichoId || scores[nichoId] === 0) {
    return 'outros'
  }

  return nichoId
}

// Função para obter nome do nicho
export function getNichoNome(id: NichoId): string {
  return NICHOS.find(n => n.id === id)?.nome || 'Outros'
}



