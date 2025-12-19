# 🧪 Usar Modo MOCK - Continuar Desenvolvendo

## ✅ Solução Imediata

Como todas as versões da API falharam, vamos usar o **modo MOCK** para continuar desenvolvendo enquanto resolvemos o problema do token da Meta.

---

## 🚀 Como Usar Modo MOCK

### 1. Iniciar o Servidor

```powershell
npm run dev
```

Aguarde até aparecer: `Ready on http://localhost:3000`

---

### 2. Coletar Anúncios com MOCK

Execute no PowerShell:

```powershell
$body = @{ 
    country = "AR"
    keywords = "infoproduto"
    maxPages = 5
    useMock = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect-full" -Method POST -ContentType "application/json" -Body $body
```

**Isso vai:**
- ✅ Gerar 50 anúncios mockados
- ✅ Salvar no Supabase
- ✅ Incluir nichos identificados
- ✅ Funcionar sem token da Meta

---

### 3. Verificar no Banco

Acesse seu Supabase e verifique a tabela `ads` - você deve ver os anúncios mockados lá!

---

## 📋 Coletar Mais Dados MOCK

Para coletar mais anúncios mockados, aumente `maxPages`:

```powershell
$body = @{ 
    country = "AR"
    keywords = "infoproduto"
    maxPages = 20  # Mais páginas = mais anúncios
    useMock = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect-full" -Method POST -ContentType "application/json" -Body $body
```

---

## 🎯 Continuar Desenvolvendo

Agora você pode:

1. ✅ **Testar filtros** - Todos os filtros funcionam com dados MOCK
2. ✅ **Testar interface** - Ver como os dados aparecem na tabela
3. ✅ **Testar nichos** - Ver como a identificação de nichos funciona
4. ✅ **Desenvolver features** - Continuar adicionando funcionalidades

---

## ⚠️ Sobre o Token da Meta

O problema do token é separado. Pode ser:

1. **Falta de autorização** na página da Meta
2. **Problema temporário** da API da Meta
3. **Token sem permissão** para Ads Library API

**Enquanto isso não é resolvido, use MOCK para continuar!**

---

## 🔄 Quando o Token Funcionar

Quando conseguir fazer o token funcionar:

1. **Remova `useMock: true`** do body
2. **Teste novamente** com o token real
3. **A coleta vai usar a API real** da Meta

---

## 📝 Exemplo Completo

```powershell
# 1. Iniciar servidor (em um terminal)
npm run dev

# 2. Coletar com MOCK (em outro terminal)
$body = @{ 
    country = "AR"
    keywords = "infoproduto"
    maxPages = 10
    useMock = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect-full" -Method POST -ContentType "application/json" -Body $body

# 3. Verificar resultado
# Acesse http://localhost:3000 e veja os anúncios na interface!
```

---

**Use MOCK e continue desenvolvendo! O sistema está funcionando, só falta o token da Meta.** 🚀


