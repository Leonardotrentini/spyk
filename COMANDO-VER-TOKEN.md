# 👀 Ver Token Salvo

## Script Automático

```powershell
.\scripts\ver-token.ps1
```

Este script mostra o token que está salvo no `.env.local`.

---

## Comando Direto (PowerShell)

```powershell
Get-Content .env.local | Select-String "META_ADS_LIBRARY_ACCESS_TOKEN"
```

Ou para ver só o token (sem o nome da variável):

```powershell
(Get-Content .env.local | Select-String "META_ADS_LIBRARY_ACCESS_TOKEN").ToString() -replace "META_ADS_LIBRARY_ACCESS_TOKEN=", ""
```

---

## Ver Arquivo Completo

```powershell
Get-Content .env.local
```

Isso mostra todo o conteúdo do arquivo `.env.local`.

---

## Abrir no Editor

```powershell
notepad .env.local
```

Ou se preferir VS Code:

```powershell
code .env.local
```



