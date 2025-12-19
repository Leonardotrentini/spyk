# 🔄 Como Rodar a Coleta Contínua de Anúncios

## 📋 Visão Geral

O sistema agora suporta coleta automatizada e contínua de anúncios da Meta Ads Library, com:

- ✅ **Paginação completa** - Pega TODOS os anúncios disponíveis
- ✅ **Controle de duplicatas** - Não salva anúncios repetidos
- ✅ **Rate limiting** - Respeita limites da API
- ✅ **Logs detalhados** - Acompanhe o progresso
- ✅ **Múltiplos países** - Coleta de vários países
- ✅ **Múltiplas keywords** - Diferentes termos de busca

---

## 🚀 Opções de Coleta

### 1. Coleta Única Completa

Coleta TODOS os anúncios de uma vez (com paginação):

```powershell
.\scripts\coletar-continuo.ps1 -RunOnce
```

**Parâmetros:**
- `-Country "AR"` - País (padrão: AR)
- `-Keywords "infoproduto"` - Palavras-chave (padrão: infoproduto)
- `-MaxPages 100` - Máximo de páginas (padrão: 100)

**Exemplo:**
```powershell
.\scripts\coletar-continuo.ps1 -RunOnce -Country "BR" -Keywords "curso online" -MaxPages 200
```

---

### 2. Coleta Contínua (Automática)

Roda continuamente, coletando a cada X minutos:

```powershell
.\scripts\coletar-continuo.ps1 -IntervalMinutes 60
```

**Parâmetros:**
- `-IntervalMinutes 60` - Intervalo entre coletas (padrão: 60 minutos)
- `-Country "AR"` - País
- `-Keywords "infoproduto"` - Palavras-chave
- `-MaxPages 100` - Máximo de páginas por execução

**Exemplo (coleta a cada 30 minutos):**
```powershell
.\scripts\coletar-continuo.ps1 -IntervalMinutes 30 -Country "MX"
```

**Para parar:** Pressione `Ctrl+C`

---

### 3. Coleta Multi-País

Coleta de múltiplos países e keywords automaticamente:

```powershell
.\scripts\coletar-todos-paises.ps1
```

Este script coleta de:
- 🇦🇷 Argentina
- 🇧🇷 Brasil
- 🇲🇽 México
- 🇨🇴 Colômbia
- 🇨🇱 Chile
- 🇵🇪 Peru

Com keywords:
- infoproduto
- curso online
- treinamento
- mentoria
- ebook

---

## 📊 API Endpoint Direto

Você também pode chamar a API diretamente:

```powershell
$body = @{
    country = "AR"
    keywords = "infoproduto"
    maxPages = 100
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect-full" -Method POST -ContentType "application/json" -Body $body
```

**Resposta:**
```json
{
  "success": true,
  "message": "Coleta completa finalizada",
  "stats": {
    "total_collected": 1250,
    "new_ads": 800,
    "updated_ads": 450,
    "pages_processed": 13,
    "has_more": false
  }
}
```

---

## ⚙️ Configuração

### 1. Certifique-se que o servidor está rodando:

```powershell
npm run dev
```

### 2. Verifique o token da Meta:

```powershell
.\scripts\ver-token.ps1
```

### 3. Execute a coleta:

```powershell
.\scripts\coletar-continuo.ps1 -RunOnce
```

---

## 🔍 Monitoramento

### Logs no Console

O script mostra em tempo real:
- ✅ Anúncios coletados
- ✅ Novos vs atualizados
- ✅ Páginas processadas
- ❌ Erros (se houver)

### Exemplo de Saída:

```
[14:30:15] Iniciando coleta...
📄 Página 1...
📦 100 anúncios encontrados nesta página
✅ Salvos: 75 novos, 25 atualizados
➡️ Próxima página disponível...

[14:30:45] ✅ Coleta concluída!
   📊 Total coletado: 1250
   ✨ Novos: 800
   🔄 Atualizados: 450
   📄 Páginas processadas: 13
```

---

## ⚠️ Limitações e Cuidados

### 1. Rate Limiting

A Meta tem limites de requisições. O sistema:
- ✅ Aguarda automaticamente se receber 429 (rate limit)
- ✅ Faz pausa de 1s entre páginas
- ⚠️ Se receber muitos erros, pare e aguarde

### 2. Token Expiração

- ⚠️ Tokens expiram após algumas horas/dias
- ✅ O sistema detecta e para automaticamente
- 🔄 Gere um novo token quando necessário

### 3. Volume de Dados

- ⚠️ Coletar TUDO pode levar horas
- ✅ Use `maxPages` para limitar
- ✅ Comece com poucas páginas para testar

---

## 🎯 Estratégias Recomendadas

### Estratégia 1: Coleta Inicial Completa

1. **Primeira vez:** Coleta completa de tudo
   ```powershell
   .\scripts\coletar-todos-paises.ps1
   ```

2. **Depois:** Coleta contínua para atualizar
   ```powershell
   .\scripts\coletar-continuo.ps1 -IntervalMinutes 60
   ```

### Estratégia 2: Foco em Países Específicos

```powershell
# Coleta só do Brasil
.\scripts\coletar-continuo.ps1 -RunOnce -Country "BR" -Keywords "infoproduto" -MaxPages 200
```

### Estratégia 3: Coleta Noturna

Configure para rodar à noite (menos tráfego):

```powershell
# Roda a cada 2 horas
.\scripts\coletar-continuo.ps1 -IntervalMinutes 120
```

---

## 🔧 Troubleshooting

### Erro: "Token da Meta expirado"

**Solução:**
```powershell
.\scripts\gerar-token-estendido.ps1
.\scripts\atualizar-token.ps1
```

### Erro: "Rate limit"

**Solução:** Aguarde alguns minutos e tente novamente. O script já faz isso automaticamente.

### Erro: "Servidor não está rodando"

**Solução:**
```powershell
npm run dev
```

### Muitos "atualizados" e poucos "novos"

**Isso é normal!** Significa que os anúncios já estavam no banco. O sistema atualiza dados existentes.

---

## 📈 Próximos Passos

1. ✅ Execute uma coleta inicial completa
2. ✅ Configure coleta contínua (se quiser)
3. ✅ Monitore os logs
4. ✅ Ajuste intervalos conforme necessário

---

**Dica:** Comece com `-RunOnce` e `-MaxPages 10` para testar antes de rodar a coleta completa!



