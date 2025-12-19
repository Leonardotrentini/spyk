# 🎯 Regras para Identificação de Nichos

## 📋 Como Funciona

O sistema identifica nichos automaticamente baseado em **palavras-chave** encontradas no conteúdo do anúncio (título, descrição e corpo).

---

## 🔍 Regra Principal: Contagem de Palavras-chave

### Algoritmo:

1. **Combinar todo o texto** do anúncio (título + descrição + corpo)
2. **Converter para minúsculas** para busca case-insensitive
3. **Contar ocorrências** de cada palavra-chave de cada nicho
4. **Somar os scores** por nicho
5. **Selecionar o nicho** com maior score
6. **Se score = 0**, classificar como "Outros"

### Exemplo:

```
Anúncio: "Aprenda a ganar dinheiro online com trading de criptomoedas"
```

**Scores:**
- Finanças: "dinheiro" (1) + "trading" (1) + "criptomoeda" (1) = **3 pontos**
- Marketing: "online" (1) = **1 ponto**
- Outros: **0 pontos**

**Resultado:** `financas` (maior score)

---

## ✅ Vantagens desta Abordagem

1. **Simples e rápida** - Não precisa de IA
2. **Transparente** - Fácil de entender e ajustar
3. **Escalável** - Pode adicionar mais palavras-chave facilmente
4. **Funciona offline** - Não depende de APIs externas

---

## 🎨 Melhorias Possíveis

### 1. Pesos Diferentes por Palavra-chave

Palavras mais específicas podem ter peso maior:

```typescript
keywords: [
  { word: 'trading', weight: 2 }, // Mais importante
  { word: 'dinheiro', weight: 1 }  // Menos específico
]
```

### 2. Contexto e Frases Completas

Buscar frases completas além de palavras soltas:

```typescript
phrases: [
  'ganhar dinheiro online',
  'renda passiva',
  'investir em ações'
]
```

### 3. Exclusões (Palavras que Desqualificam)

Se encontrar certas palavras, excluir de um nicho:

```typescript
exclusions: [
  'não é sobre dinheiro',
  'não é investimento'
]
```

### 4. Múltiplos Nichos

Se um anúncio tiver score alto em 2 nichos, pode ser ambos:

```typescript
// Exemplo: "Curso de Marketing para Ganhar Dinheiro"
// Pode ser: ['marketing', 'financas']
```

### 5. Machine Learning (Futuro)

Treinar um modelo com anúncios já classificados para melhorar precisão.

---

## 📊 Nichos Disponíveis

1. **💰 Finanças** - Dinheiro, investimentos, trading
2. **💪 Saúde e Bem-estar** - Emagrecimento, fitness, saúde
3. **❤️ Relacionamento** - Namoro, sedução, casamento
4. **📈 Marketing e Vendas** - Vendas, tráfego, copywriting
5. **📚 Educação** - Cursos, ensino, preparatórios
6. **🚀 Desenvolvimento Pessoal** - Sucesso, motivação, hábitos
7. **💻 Tecnologia** - Programação, desenvolvimento
8. **✨ Beleza e Estética** - Beleza, cuidados, estética
9. **🏠 Imóveis** - Investimento imobiliário, compra/venda
10. **📦 Outros** - Não categorizado

---

## 🔧 Como Ajustar

### Adicionar Nova Palavra-chave:

Edite `lib/nichos.ts`:

```typescript
{
  id: 'financas',
  nome: 'Finanças',
  keywords: [
    'dinheiro',
    'nova-palavra-aqui', // ← Adicione aqui
    // ...
  ]
}
```

### Adicionar Novo Nicho:

```typescript
{
  id: 'novo-nicho',
  nome: 'Novo Nicho',
  keywords: ['palavra1', 'palavra2'],
  descricao: 'Descrição do nicho'
}
```

---

## 💡 Dicas para Melhorar Precisão

1. **Use palavras específicas** - "trading" é melhor que "negócio"
2. **Considere variações** - "dinheiro", "dinheiro online", "ganhar dinheiro"
3. **Teste com dados reais** - Colete anúncios e veja quais são classificados errado
4. **Ajuste gradualmente** - Adicione palavras-chave conforme encontra falsos positivos/negativos
5. **Use contexto** - Palavras-chave em conjunto são mais confiáveis

---

## 📈 Métricas para Acompanhar

- **Precisão**: % de anúncios classificados corretamente
- **Cobertura**: % de anúncios que não ficam em "Outros"
- **Distribuição**: Quantos anúncios por nicho

---

## 🎯 Próximos Passos

1. **Coletar dados reais** e verificar classificação
2. **Ajustar palavras-chave** baseado em erros
3. **Adicionar mais nichos** se necessário
4. **Considerar IA** se precisar de precisão muito alta



