# 🔧 Atualizar Token Rápido (Método Simples)

## ❌ Você colou o token no lugar errado!

O script estava pedindo **App ID** e **App Secret**, mas você precisa atualizar o **Token de Acesso**.

---

## ✅ MÉTODO CORRETO (Mais Fácil)

### Opção 1: Editar .env.local Manualmente

1. **Pressione `Ctrl+C`** para cancelar o script atual

2. **Abra o arquivo `.env.local`** na pasta do projeto

3. **Procure esta linha:**
   ```
   META_ADS_LIBRARY_ACCESS_TOKEN=
   ```

4. **Cole seu token após o `=`** (o token longo que você tem)

   Deve ficar assim:
   ```
   META_ADS_LIBRARY_ACCESS_TOKEN=EAAQx23HT1RcBQIMLhjybrhawcBCt2XbxNMz5vdfZA72HwxRMhTeY2828JyMdP13JVh5bDEsPiEM1SZCKKwleVcodSzNkhzwMu6ZBhaoSgXWHrab1hZABFWUMZBUPsG1AFXniRE6ZBtq5SIyu@gZBdwup16zBECIwZCKqXrFMKhVAzmSdWQUoMuMnPnpiR8uwUNicErvb4wX7Ahco11B9jGRbBPZC516sbZBUacWM1HzQm4MZCaJmMtdZCRRHxJ71T0rfAhvtdULBh0TeLEvZCGWZBxx1cNQDL0vkCCK3sReYWBhQZDZD
   ```

5. **Salve o arquivo**

6. **Reinicie o servidor** (pressione `Ctrl+C` e depois `npm run dev`)

---

## ✅ Opção 2: Script Direto (Se Preferir)

1. **Pressione `Ctrl+C`** para cancelar

2. **Abra o arquivo:** `scripts\atualizar-token-direto.ps1`

3. **Edite a linha que tem:**
   ```powershell
   $novoToken = "COLE_SEU_TOKEN_AQUI"
   ```

4. **Cole seu token entre as aspas:**
   ```powershell
   $novoToken = "EAAQx23HT1RcBQIMLhjybrhawcBCt2XbxNMz5vdfZA72HwxRMhTeY2828JyMdP13JVh5bDEsPiEM1SZCKKwleVcodSzNkhzwMu6ZBhaoSgXWHrab1hZABFWUMZBUPsG1AFXniRE6ZBtq5SIyu@gZBdwup16zBECIwZCKqXrFMKhVAzmSdWQUoMuMnPnpiR8uwUNicErvb4wX7Ahco11B9jGRbBPZC516sbZBUacWM1HzQm4MZCaJmMtdZCRRHxJ71T0rfAhvtdULBh0TeLEvZCGWZBxx1cNQDL0vkCCK3sReYWBhQZDZD"
   ```

5. **Salve o arquivo**

6. **Execute:**
   ```powershell
   .\scripts\atualizar-token-direto.ps1
   ```

7. **Reinicie o servidor**

---

## 🎯 RECOMENDAÇÃO: Use a Opção 1 (Mais Simples)

1. Pressione `Ctrl+C` no terminal
2. Abra `.env.local` no editor
3. Cole o token na linha `META_ADS_LIBRARY_ACCESS_TOKEN=`
4. Salve
5. Reinicie o servidor

**Pronto!** 🚀

---

## ⚠️ IMPORTANTE

- O token que você colou é o **Token de Acesso** (não App ID)
- Você NÃO precisa de App ID e App Secret para atualizar o token
- Só precisa colar o token no arquivo `.env.local`



