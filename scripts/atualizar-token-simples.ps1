# Script simples para atualizar token
# Uso: .\scripts\atualizar-token-simples.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

$ErrorActionPreference = "Continue"

Write-Host "=== ATUALIZAR TOKEN ===" -ForegroundColor Cyan
Write-Host ""

# Remover espaços e quebras de linha do token
$Token = $Token.Trim() -replace '\s+', ''

if ($Token.Length -lt 100) {
    Write-Host "ERRO: Token muito curto! Verifique se copiou completo." -ForegroundColor Red
    exit 1
}

Write-Host "Token recebido: $($Token.Substring(0, [Math]::Min(30, $Token.Length)))..." -ForegroundColor Yellow
Write-Host "Tamanho: $($Token.Length) caracteres" -ForegroundColor White
Write-Host ""

# Verificar se .env.local existe
if (-not (Test-Path .env.local)) {
    Write-Host "Criando arquivo .env.local..." -ForegroundColor Yellow
    
    # Ler variáveis do Supabase se existirem
    $supabaseUrl = "https://xwsqbgjflzoimpmcqtso.supabase.co"
    $supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MDM5NTIsImV4cCI6MjA4MDk3OTk1Mn0.hQnrCNZPAhpJmCR4QmklqbZ_WQy3faEVKvVwvg13h6Q"
    $supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQwMzk1MiwiZXhwIjoyMDgwOTc5OTUyfQ.48bq280hlAJLg5UWWeJwDuDVcXwVQCpUAqZWKbte7Vk"
    
    @"
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnonKey
SUPABASE_SERVICE_ROLE_KEY=$supabaseServiceKey
META_ADS_LIBRARY_ACCESS_TOKEN=$Token
"@ | Out-File -FilePath .env.local -Encoding utf8
    
    Write-Host "Arquivo .env.local criado!" -ForegroundColor Green
} else {
    # Atualizar token existente
    $content = Get-Content .env.local -Raw
    
    if ($content -match "META_ADS_LIBRARY_ACCESS_TOKEN=") {
        $content = $content -replace "META_ADS_LIBRARY_ACCESS_TOKEN=.*", "META_ADS_LIBRARY_ACCESS_TOKEN=$Token"
        Write-Host "Token atualizado no arquivo existente!" -ForegroundColor Green
    } else {
        $content += "`nMETA_ADS_LIBRARY_ACCESS_TOKEN=$Token"
        Write-Host "Token adicionado ao arquivo!" -ForegroundColor Green
    }
    
    $content | Out-File -FilePath .env.local -Encoding utf8 -NoNewline
}

Write-Host ""
Write-Host "Token atualizado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximo passo: Reinicie o servidor (Ctrl+C e depois npm run dev)" -ForegroundColor Yellow



