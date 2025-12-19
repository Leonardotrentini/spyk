# ✅ Testar Sistema SEM Token da Meta

## 🎯 Solução: Modo MOCK

Criei um modo de teste que funciona **sem token da Meta**. Isso permite testar todo o resto do sistema enquanto resolvemos o problema do token.

---

## 🚀 Como Usar

### Testar com Dados Mockados

Execute este comando:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect" -Method POST -ContentType "application/json" -Body '{"country": "AR", "keywords": "infoproduto", "useMock": true}'
```

Isso vai:
- ✅ Criar 2 anúncios de exemplo no banco
- ✅ Testar toda a estrutura (Supabase, salvamento, etc.)
- ✅ Funcionar mesmo sem token da Meta

---

## 📊 Ver Resultados

Depois de executar o comando acima:

1. Acesse: http://localhost:3000/explorar
2. Você verá os anúncios mockados na tabela
3. Pode testar filtros, visualização, etc.

---

## 🔄 Quando Resolver o Token

Quando conseguir um token válido da Meta:

1. Remova `"useMock": true` do comando
2. Ou não envie esse parâmetro
3. O sistema vai usar a API real da Meta

---

## ✅ Vantagens

- ✅ Testa todo o sistema sem depender do token
- ✅ Valida banco de dados, interface, filtros
- ✅ Permite desenvolvimento enquanto resolve o token
- ✅ Não fica preso em loop de gerar tokens

---

## 🎯 Próximos Passos

1. **Teste com MOCK agora** (comando acima)
2. **Verifique se tudo funciona** (interface, banco, etc.)
3. **Depois resolva o token** (sem pressa, o sistema já funciona)

---

**Execute o comando acima e me diga se funcionou!**



