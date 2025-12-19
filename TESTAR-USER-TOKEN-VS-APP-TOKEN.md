# 🔍 Testar User Token vs App Token

## 📋 Tokens Encontrados

Você tem dois tipos de tokens:

1. **User Token:** `EAAQx23HT1RcBQILEMXR3BL4vpaqHg8LHvkIDqthdfMNEhtZBo1xCbp1DXI98W9SBOFBPrU0tYGYRSu00CVcfZB7FZAboZARZAnrjoUZAnQMgWc2IHOH13hLoIS3yNsIADWtbr2y1PzJ3hD2TosaHkroIAHEyYL5TVu4AgxitvWFBu tIEJcEDftKrChmT460EcdHUkKZBaiciT1r055R6wZDZD`

2. **App Token:** `1180718484149527|boFZy61kwfC-_-MaWk6gpw7tpyqk`

---

## ⚠️ Diferença Importante

### User Token
- ✅ **Formato:** Longo, começa com `EAA...`
- ✅ **Uso:** Para acessar dados do usuário
- ✅ **Ads Library API:** **Requer User Token com `ads_read`**
- ✅ **Este é o token que devemos usar!**

### App Token
- ❌ **Formato:** `{app_id}|{app_secret}`
- ❌ **Uso:** Para operações do app (não dados do usuário)
- ❌ **Ads Library API:** **NÃO funciona com App Token**
- ❌ **Este token NÃO deve ser usado para Ads Library**

---

## 🧪 Testar User Token

Vamos testar o **User Token** que você mostrou:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"

# Atualizar com o User Token
$token = "EAAQx23HT1RcBQILEMXR3BL4vpaqHg8LHvkIDqthdfMNEhtZBo1xCbp1DXI98W9SBOFBPrU0tYGYRSu00CVcfZB7FZAboZARZAnrjoUZAnQMgWc2IHOH13hLoIS3yNsIADWtbr2y1PzJ3hD2TosaHkroIAHEyYL5TVu4AgxitvWFBu tIEJcEDftKrChmT460EcdHUkKZBaiciT1r055R6wZDZD"

# Testar endpoint /me
$url1 = "https://graph.facebook.com/v21.0/me?access_token=$token"
Invoke-RestMethod -Uri $url1 -Method Get

# Testar ads_archive
$url2 = "https://graph.facebook.com/v21.0/ads_archive?access_token=$token&ad_reached_countries=AR&limit=5&fields=id,page"
Invoke-RestMethod -Uri $url2 -Method Get
```

---

## 🔧 Atualizar Token no Projeto

Se o User Token funcionar, atualize no projeto:

```powershell
.\scripts\atualizar-token.ps1
```

Cole o User Token quando solicitado.

---

## ⚠️ Importante

- **Use SEMPRE o User Token** para Ads Library API
- **NÃO use o App Token** para Ads Library API
- O App Token é apenas para operações do app

---

## 🎯 Próximos Passos

1. **Teste o User Token** com os comandos acima
2. **Se funcionar:** Atualize no projeto
3. **Se não funcionar:** Ainda precisa autorizar em https://www.facebook.com/ads/library/api

---

**Teste o User Token agora!** 🚀



