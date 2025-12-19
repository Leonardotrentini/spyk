# 🎯 Como Filtrar Páginas com Muitos Anúncios (Escaladas)

## 📊 O Que Foi Implementado

1. ✅ **Contador por página** - Mostra quantos anúncios cada página tem
2. ✅ **Top páginas** - Lista as páginas com mais anúncios
3. ✅ **Filtro por página** - Clique em uma página para ver só os anúncios dela
4. ✅ **API de páginas** - Endpoint para buscar estatísticas de páginas

---

## 🎨 Interface

### Card "Anúncios Ativos por Página"

No topo da página `/explorar`, você verá:

- **Total de páginas ativas** (número grande)
- **Top 6 páginas** com mais anúncios
- Cada card mostra:
  - Nome da página
  - Quantidade de anúncios
  - **Clique no card** para filtrar apenas aquela página

---

## 🔍 Como Usar

### 1. Ver Páginas Escaladas

Acesse: http://localhost:3000/explorar

No topo, você verá as páginas com mais anúncios.

### 2. Filtrar por Página Específica

**Opção A: Clique no card**
- Clique em qualquer card de página
- A tabela filtra automaticamente para mostrar só anúncios daquela página

**Opção B: Filtro manual**
- Use o campo "Nome da Página" nos filtros
- Digite o nome da página
- Clique em "Aplicar Filtros"

### 3. Ver Todas as Páginas

Use a API diretamente:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/ads/pages?min_ads=5" -Method GET
```

Isso retorna todas as páginas com pelo menos 5 anúncios.

---

## 📈 Estratégia de Coleta

### Focar em Páginas Escaladas

Para coletar apenas anúncios de páginas que já estão escalando:

1. **Primeiro, colete normalmente:**
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect" -Method POST -ContentType "application/json" -Body '{"country": "AR", "keywords": "infoproduto", "useMock": true}'
   ```

2. **Depois, veja quais páginas têm muitos anúncios:**
   - Acesse a interface
   - Veja o card "Anúncios Ativos por Página"
   - Identifique páginas com 10+ anúncios (indicando escalação)

3. **Filtre por essas páginas:**
   - Clique no card da página
   - Ou use o filtro "Nome da Página"

---

## 💡 Dica: Regra para Identificar Páginas Escaladas

### Critérios Sugeridos:

1. **Mínimo de anúncios ativos:**
   - **5-10 anúncios** = Testando/Iniciando
   - **10-20 anúncios** = Escalando
   - **20+ anúncios** = Fortemente escalado

2. **Diversidade de anúncios:**
   - Múltiplos títulos diferentes
   - Múltiplos copy diferentes
   - Indica teste de criativos (boa prática)

3. **Tempo ativo:**
   - Anúncios com datas recentes
   - Anúncios rodando há vários dias
   - Indica que está funcionando

4. **Gasto acumulado:**
   - Páginas com alto gasto total
   - Indica investimento significativo

---

## 🔧 API de Páginas

### Endpoint: `/api/ads/pages`

**Parâmetros:**
- `min_ads` (opcional): Mínimo de anúncios por página (padrão: 1)

**Exemplo:**
```
GET /api/ads/pages?min_ads=10
```

**Resposta:**
```json
{
  "data": [
    {
      "page_id": "123456",
      "page_name": "Infoproduto Exemplo",
      "country": "AR",
      "platform": "facebook",
      "total_ads": 15,
      "countries": ["AR"],
      "platforms": ["facebook", "instagram"]
    }
  ],
  "total": 1
}
```

---

## ✅ Próximos Passos

1. **Colete mais anúncios** para ter dados suficientes
2. **Identifique páginas escaladas** (10+ anúncios)
3. **Foque nessas páginas** para análise detalhada
4. **Acompanhe evolução** - Veja quais páginas continuam escalando

---

**Acesse a interface e veja as páginas com mais anúncios!**



