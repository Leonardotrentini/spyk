# 💰 Como Funcionam os Gastos na Meta Ads Library

## ⚠️ Limitação da API da Meta

A **Meta Ads Library API NÃO retorna valores exatos** de gasto. Ela retorna apenas **ranges (intervalos)**:

- `spend.lower_bound` = Gasto mínimo estimado
- `spend.upper_bound` = Gasto máximo estimado

### Exemplo:
```json
{
  "spend": {
    "lower_bound": "100.00",
    "upper_bound": "500.00"
  }
}
```

Isso significa: **"Este anúncio gastou entre $100 e $500"**

---

## 🎯 Estratégias para Filtros

### Opção 1: Filtrar por Mínimo (Recomendado)
**Lógica:** Se o `spend_lower` (mínimo) for >= filtro, mostrar o anúncio

**Vantagem:** 
- Mostra anúncios que **pelo menos** gastaram X
- Não perde anúncios que podem ter gasto mais

**Exemplo:**
- Filtro: Gasto Mín = $200
- Anúncio: $100-$500 → **Mostra** (porque pode ter gasto $200+)
- Anúncio: $50-$150 → **Não mostra** (não pode ter gasto $200+)

### Opção 2: Filtrar por Máximo
**Lógica:** Se o `spend_upper` (máximo) for <= filtro, mostrar o anúncio

**Vantagem:**
- Mostra anúncios que **no máximo** gastaram X
- Útil para filtrar anúncios de baixo investimento

### Opção 3: Filtrar por Média
**Lógica:** Calcular média `(spend_lower + spend_upper) / 2` e filtrar por ela

**Vantagem:**
- Valor único para comparar
- Mais intuitivo

**Desvantagem:**
- Pode ser impreciso se o range for grande

### Opção 4: Filtrar por Ambos (Atual)
**Lógica:** 
- Gasto Mín: `spend_lower >= filtro`
- Gasto Máx: `spend_upper <= filtro`

**Vantagem:**
- Mais flexível
- Permite ranges de gasto

---

## ✅ Recomendação

**Manter como está (Opção 4)**, mas adicionar:

1. **Indicador visual** de que são estimativas
2. **Mostrar o range** na tabela (já está fazendo)
3. **Explicação** nos filtros de que são ranges

---

## 🔧 Melhorias Possíveis

### 1. Adicionar Valor Médio Calculado

Calcular e mostrar a média:
```typescript
const spendAverage = ad.spend_lower && ad.spend_upper 
  ? (ad.spend_lower + ad.spend_upper) / 2 
  : null
```

### 2. Indicador de Precisão

Mostrar quão "preciso" é o range:
- Range pequeno ($100-$120) = Mais preciso
- Range grande ($100-$500) = Menos preciso

### 3. Filtro por Média

Adicionar opção de filtrar por valor médio calculado.

---

## 📊 O Que Fazer

**Para os filtros atuais:**
- **Gasto Mín:** Filtra por `spend_lower >= valor` ✅ (já está assim)
- **Gasto Máx:** Filtra por `spend_upper <= valor` ✅ (já está assim)

**Isso está correto!** Mostra anúncios que:
- Pelo menos gastaram X (mínimo)
- No máximo gastaram Y (máximo)

---

## 💡 Dica

Para identificar anúncios **fortemente escalados**:
- Use **Gasto Mín alto** (ex: $500+)
- Isso mostra anúncios que **pelo menos** gastaram muito
- Indica investimento significativo

---

**Os filtros atuais estão corretos! A API da Meta só fornece ranges, não valores exatos.**



