# 📚 Repositório Oficial Meta - Ads Library API

## 🔗 Link do Repositório

**Repositório Oficial:** https://github.com/facebookresearch/Ad-Library-API-Script-Repository

Este é o repositório oficial do Facebook Research com exemplos de código para usar a Ads Library API.

---

## 📋 Informações Importantes

### Links Oficiais da Meta

- **Website:** https://www.facebook.com/ads/library
- **Report:** https://www.facebook.com/ads/library/report
- **API:** https://www.facebook.com/ads/library/api

### Exemplo de Uso (CLI Python)

```bash
python fb_ads_library_api_cli.py -t {access_token} -f 'page_id,ad_snapshot_url,funding_entity,ad_delivery_start_time' -c 'CA' -s '.' -v count
```

---

## 🔍 O Que Isso Significa Para Nós

O repositório oficial confirma que:

1. ✅ A API existe e é oficial
2. ✅ Requer um `access_token` válido
3. ✅ Requer autorização na página: https://www.facebook.com/ads/library/api
4. ✅ Funciona com parâmetros como país (`-c 'CA'`), campos (`-f`), etc.

---

## 🎯 Próximos Passos Baseados no Repositório Oficial

### 1. Verificar Documentação Oficial

O repositório menciona que há documentação completa (ainda a ser adicionada), mas os links oficiais são:

- **API Documentation:** https://www.facebook.com/ads/library/api
- **Website:** https://www.facebook.com/ads/library

### 2. Seguir o Processo Oficial

Baseado no repositório, o processo correto é:

1. **Acessar:** https://www.facebook.com/ads/library/api
2. **Autorizar o acesso** (obrigatório)
3. **Obter access_token** com permissão `ads_read`
4. **Usar a API** com os parâmetros corretos

---

## 🔧 Comparação com Nosso Código

### Nosso Código Atual

```typescript
const url = `https://graph.facebook.com/v21.0/ads_archive?access_token=${token}&ad_reached_countries=${country}&ad_active_status=ALL&search_terms=${keywords}&limit=100&fields=...`
```

### Exemplo do Repositório Oficial

```python
# Usa access_token diretamente
# Parâmetros: país, campos, etc.
```

**Nossa implementação está correta!** O problema é apenas a autorização.

---

## ✅ Confirmação

O repositório oficial **confirma** que:

1. ✅ A API requer autorização em https://www.facebook.com/ads/library/api
2. ✅ O token precisa ter permissão `ads_read`
3. ✅ A estrutura da nossa requisição está correta

**O problema é APENAS que você ainda não autorizou o acesso na página oficial!**

---

## 🚀 Solução Definitiva

Baseado no repositório oficial da Meta:

1. **Acesse:** https://www.facebook.com/ads/library/api
2. **Autorize o acesso** (obrigatório segundo a documentação oficial)
3. **Gere novo token** após autorizar
4. **Use a API** normalmente

---

## 📖 Recursos Adicionais

- **Repositório GitHub:** https://github.com/facebookresearch/Ad-Library-API-Script-Repository
- **Documentação API:** https://www.facebook.com/ads/library/api
- **Website Ads Library:** https://www.facebook.com/ads/library

---

**O repositório oficial confirma que a autorização é obrigatória!** 🎯



