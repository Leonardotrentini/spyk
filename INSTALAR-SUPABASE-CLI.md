# Como Instalar Supabase CLI no Windows

## Opção 1: Via Scoop (Recomendado)

```powershell
# Instalar Scoop (se não tiver)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Adicionar bucket do Supabase
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git

# Instalar Supabase CLI
scoop install supabase
```

## Opção 2: Download Direto

1. Acesse: https://github.com/supabase/cli/releases
2. Baixe o arquivo `supabase_windows_amd64.zip` (ou a versão apropriada)
3. Extraia o arquivo
4. Adicione o caminho do executável ao PATH do Windows

## Opção 3: Via Chocolatey

```powershell
choco install supabase
```

## Verificar Instalação

Após instalar, verifique:

```powershell
supabase --version
```

## Após Instalar - Comandos de Deploy

```powershell
# Login
supabase login

# Link do projeto
supabase link --project-ref acnbcideqohtjidtlrvi

# Configurar secret
supabase secrets set GEMINI_API_KEY=AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8

# Deploy das functions
supabase functions deploy analyze-url
supabase functions deploy analyze-traffic
supabase functions deploy research-market
supabase functions deploy cron-refresh-libraries
```

---

**Nota:** Se não quiser instalar o CLI, você pode configurar os secrets manualmente via Dashboard e fazer deploy das functions usando a interface web do Supabase (se disponível) ou usar a API REST.




