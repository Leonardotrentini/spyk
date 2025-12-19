# 🧪 Como Testar Token no Graph API Explorer

## ✅ Teste Direto no Graph API Explorer

Para verificar se o token está funcionando, teste diretamente no Graph API Explorer:

### Passo 1: Mudar o Endpoint

No campo onde está `/me?fields=id,name`, substitua por:

```
/ads_archive?ad_reached_countries=AR&search_terms=infoproduto&limit=5
```

### Passo 2: Clicar em "Enviar"

Clique no botão azul **"Enviar"** (Send)

### Passo 3: Ver o Resultado

**Se funcionar:**
- Você verá JSON com anúncios
- O token está OK ✅

**Se não funcionar:**
- Você verá uma mensagem de erro
- O token tem problema ❌

---

## 📝 Endpoint Completo

Cole este endpoint completo no campo:

```
/ads_archive?ad_reached_countries=AR&ad_active_status=ALL&search_terms=infoproduto&limit=5&fields=id,page,ad_creative_bodies
```

---

## 🔍 O Que Verificar

1. **Token está no campo "Token de acesso"** ✅
2. **App "spy" está selecionado** ✅
3. **Permissão `ads_read` está adicionada** ✅
4. **Endpoint correto** (acima)
5. **Clicar em "Enviar"**

---

## ✅ Se Funcionar no Explorer

Se funcionar no Graph API Explorer, o token está OK e o problema pode ser no código.

---

## ❌ Se Não Funcionar no Explorer

Se não funcionar no Explorer, o problema é com:
- Token sem permissão correta
- App não configurado
- Limitação da conta

---

**Teste no Explorer primeiro e me diga o resultado!**



