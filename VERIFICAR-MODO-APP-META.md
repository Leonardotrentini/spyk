# 🔍 Verificar Modo do App Meta

## ⚠️ Problema Possível: App em Modo Publicado

Se o app está em modo **"Publicado"** (Live), pode estar causando problemas com tokens de usuário.

---

## ✅ SOLUÇÃO: Colocar App em Modo Desenvolvimento

### PASSO 1: Acessar Configurações do App

1. Acesse: https://developers.facebook.com/apps/
2. Faça login
3. Selecione seu app: **spy** (1180718484149527)

### PASSO 2: Verificar Modo do App

1. No menu lateral, vá em **"App Review"** ou **"Revisão do App"**
2. Procure por **"App Status"** ou **"Status do App"**
3. Veja se está em:
   - **"Live"** ou **"Publicado"** ❌ (pode causar problemas)
   - **"Development"** ou **"Desenvolvimento"** ✅ (correto)

### PASSO 3: Mudar para Modo Desenvolvimento

1. Se estiver em **"Live"**, clique em **"Switch Mode"** ou **"Mudar Modo"**
2. Selecione **"Development Mode"** ou **"Modo de Desenvolvimento"**
3. Confirme a mudança

---

## 🎯 Onde Verificar

### Opção 1: App Review

1. Menu lateral → **"App Review"**
2. Veja **"App Status"** no topo
3. Deve estar: **"In Development"**

### Opção 2: Settings → Basic

1. Menu lateral → **"Settings"** → **"Basic"**
2. Role até **"App Mode"** ou **"Modo do App"**
3. Deve estar: **"Development"**

---

## ⚠️ IMPORTANTE

- **Modo Desenvolvimento:** Permite usar tokens de usuário normalmente ✅
- **Modo Publicado:** Pode restringir tokens de usuário ❌

**Para desenvolvimento/testes, use sempre modo Desenvolvimento!**

---

## 🔧 Depois de Mudar o Modo

1. **Gere um NOVO token** no Graph API Explorer
2. **Atualize no projeto**
3. **Reinicie o servidor**
4. **Teste a coleta**

---

## 📋 Checklist

- [ ] App está em modo **"Development"**?
- [ ] Token foi gerado **DEPOIS** de mudar o modo?
- [ ] Token tem permissão `ads_read`?
- [ ] Servidor foi reiniciado após atualizar token?

---

**Mude o app para modo Desenvolvimento e gere um novo token!**



