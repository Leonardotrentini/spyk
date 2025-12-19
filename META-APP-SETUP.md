# 🎯 Configuração do App Meta para Ads Library API

## Passo 1: Casos de Uso (Use Cases)

Na tela que você está vendo, **NÃO precisa selecionar nenhum caso de uso específico** para a Ads Library API.

A Ads Library API é uma API pública que **não requer** configuração de casos de uso no app.

**Ação:** Clique em **"Pular"** ou **"Continuar"** sem selecionar nenhum caso de uso.

## Passo 2: Detalhes do App

- **Nome do App:** LATAM DR INTEL (ou qualquer nome)
- **Email de contato:** Seu email
- **Finalidade do App:** "Ferramenta de pesquisa e análise de anúncios públicos"

## Passo 3: Configurar Permissões

Após criar o app, você precisa:

### 3.1. Adicionar Produto "Ads Library API"

1. No painel do app, vá em **"Adicionar Produtos"** (menu lateral)
2. Procure por **"Ads Library API"**
3. Clique em **"Configurar"** ou **"Adicionar"**

### 3.2. Obter Access Token

Para acessar a Ads Library API, você tem 3 opções:

#### Opção A: Token de Usuário (Mais Fácil - Para Testes)

1. Vá em **Tools** > **Graph API Explorer**
2. Selecione seu app no dropdown
3. Clique em **"Generate Access Token"**
4. Selecione a permissão: `ads_read`
5. Copie o token gerado

⚠️ **Limitação:** Tokens de usuário expiram em ~1-2 horas

#### Opção B: Token de Sistema (Recomendado para Produção)

1. Vá em **Settings** > **Basic**
2. Role até **"App Secret"**
3. Clique em **"Show"** e copie o App Secret
4. Use o App ID + App Secret para gerar um token de sistema

#### Opção C: Token de Longa Duração (Para Desenvolvimento)

1. Vá em **Tools** > **Access Token Tool**
2. Selecione seu app
3. Gere um token de longa duração (60 dias)

## Passo 4: Configurar no Projeto

Cole o token no arquivo `.env.local`:

```env
META_ADS_LIBRARY_ACCESS_TOKEN=seu_token_aqui
```

## Passo 5: Testar a API

Você pode testar diretamente no Graph API Explorer:

```
GET https://graph.facebook.com/v21.0/ads_archive
  ?access_token=SEU_TOKEN
  &ad_reached_countries=AR
  &ad_active_status=ALL
  &search_terms=infoproduto
  &limit=10
```

Ou usar nossa API:

```bash
curl -X POST http://localhost:3000/api/meta-ads \
  -H "Content-Type: application/json" \
  -d '{"country": "AR", "keywords": "infoproduto"}'
```

## ⚠️ Importante

- **Ads Library API é PÚBLICA** - não precisa de aprovação de permissões
- **Rate Limits:** A Meta limita requisições (varia por tipo de token)
- **Tokens de Usuário:** Expirem rápido, use para testes
- **Tokens de Sistema:** Mais estáveis, use para produção

## 🔒 Segurança

- **NUNCA** commite tokens no Git
- Use variáveis de ambiente (`.env.local`)
- O arquivo `.env.local` já está no `.gitignore`

## 📚 Documentação Oficial

- Ads Library API: https://www.facebook.com/ads/library/api
- Graph API Explorer: https://developers.facebook.com/tools/explorer



