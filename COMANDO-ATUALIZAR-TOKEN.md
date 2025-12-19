# 🔄 Comando para Atualizar Token

## Opção 1: Usar o Script (Recomendado)

```powershell
.\scripts\atualizar-token.ps1
```

O script vai pedir para você colar o token, e ele atualiza automaticamente o `.env.local`.

---

## Opção 2: Comando Direto (Substituir Manualmente)

Substitua `SEU_TOKEN_AQUI` pelo token que você gerou:

```powershell
$token = "SEU_TOKEN_AQUI"
(Get-Content .env.local) -replace 'META_ADS_LIBRARY_ACCESS_TOKEN=.*', "META_ADS_LIBRARY_ACCESS_TOKEN=$token" | Set-Content .env.local
```

**Exemplo:**
```powershell
$token = "EAAQx23HT1RcBQOoBqpIclXMXOZAkJltnbXYkjHVdv5zHk5wttdItzO9qC2lE85Pg9f1k8PBJ5bsakBUoaZBjgTZAZCPKUJjJUv959nu2c5Mi4K33j1yrlNXOfX1iUpOHld237ZBAZCnAwetnF1OZAhQHiPLpQdk05ZCvlthI3JwlQ1RpDzp7sir5N23hqULkpwU83Yfh4cehOlQzsraCtlHZCwfntxxj3QNRnxwqK3I8uhlwFresyb1ZCgAWetOdl87ZBd2cM3cklwTaxFTymsiLGIOcir7R1cpvwZDZD"
(Get-Content .env.local) -replace 'META_ADS_LIBRARY_ACCESS_TOKEN=.*', "META_ADS_LIBRARY_ACCESS_TOKEN=$token" | Set-Content .env.local
```

---

## Opção 3: Editar Manualmente

1. Abra o arquivo `.env.local` no editor
2. Encontre a linha: `META_ADS_LIBRARY_ACCESS_TOKEN=`
3. Cole o novo token depois do `=`
4. Salve o arquivo

---

## Depois de Atualizar

**Sempre reinicie o servidor:**

```powershell
# No terminal onde está rodando npm run dev:
# Pressione Ctrl+C
# Depois execute:
npm run dev
```

---

## Testar

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/ads/collect" -Method POST -ContentType "application/json" -Body '{"country": "AR", "keywords": "infoproduto"}'
```



