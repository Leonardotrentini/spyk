# 🔍 Diagnóstico: Erro 500 na API Meta

## ✅ Descoberta Importante!

Os testes mostraram:

- **Teste 1 (`/me`)**: ✅ **SUCESSO** - Token funciona!
- **Teste 2 (Ads Archive)**: ❌ **ERRO 500** - Erro interno do servidor
- **Teste 3 (Ads Archive com keywords)**: ❌ **ERRO 500** - Erro interno do servidor

---

## 🎯 O Que Isso Significa

**NÃO é um problema de token!** O token está válido e funcionando.

O erro **500** significa:
- ✅ Token está válido (senão seria 401)
- ✅ Requisição chegou ao servidor da Meta
- ❌ Servidor da Meta retornou erro interno

---

## 🔍 Possíveis Causas

### 1. **Versão da API Incompatível**
Estamos usando `v21.0`, mas pode precisar de outra versão.

### 2. **Parâmetros Inválidos**
Algum parâmetro pode estar causando erro no servidor.

### 3. **Problema Temporário da Meta**
Raro, mas possível.

### 4. **Formato da URL**
URL pode estar malformada.

---

## 🧪 Testes Adicionais

Criei um script melhorado que testa:

1. **Versões diferentes da API** (v21.0, v20.0, v19.0)
2. **Parâmetros mínimos** (apenas token e país)
3. **Captura do corpo da resposta** (para ver o erro real)

---

## 📋 Próximos Passos

Execute o script melhorado:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\scripts\testar-token-direto.ps1
```

O script agora vai:
- Testar múltiplas versões da API
- Testar com parâmetros mínimos
- Mostrar o corpo completo da resposta de erro

---

## 🎯 O Que Esperar

### Se alguma versão funcionar:
- Usar essa versão no nosso código
- Atualizar `app/api/ads/collect-full/route.ts`

### Se todas falharem com 500:
- Pode ser problema temporário da Meta
- Ou problema com o App ID/configuração

### Se aparecer mensagem de erro específica:
- Vamos corrigir baseado na mensagem

---

## ⚠️ Importante

O erro **500** é diferente de **401**:
- **401** = Token inválido/expirado
- **500** = Problema no servidor da Meta ou na requisição

**Execute o script melhorado e me envie o resultado completo!**



