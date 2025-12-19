# Script para testar token da Meta diretamente
# Uso: .\scripts\testar-token-meta.ps1

$ErrorActionPreference = "Continue"

Write-Host "=== TESTAR TOKEN DA META ===" -ForegroundColor Cyan
Write-Host ""

# Ler token do .env.local
if (-not (Test-Path .env.local)) {
    Write-Host "Arquivo .env.local nao encontrado!" -ForegroundColor Red
    exit 1
}

$content = Get-Content .env.local -Raw
if ($content -match "META_ADS_LIBRARY_ACCESS_TOKEN=(.+)") {
    $token = $matches[1].Trim()
    Write-Host "Token encontrado: $($token.Substring(0, [Math]::Min(30, $token.Length)))..." -ForegroundColor Green
} else {
    Write-Host "Token nao encontrado no .env.local!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Testando token diretamente na API da Meta..." -ForegroundColor Yellow
Write-Host ""

# Testar token diretamente na API da Meta
$testUrl = "https://graph.facebook.com/v21.0/ads_archive?access_token=$token&ad_reached_countries=AR&search_terms=infoproduto&limit=5&fields=id,ad_snapshot_url"

try {
    $response = Invoke-RestMethod -Uri $testUrl -Method GET
    
    if ($response.data) {
        Write-Host "SUCESSO! Token esta funcionando!" -ForegroundColor Green
        Write-Host "Anuncios encontrados: $($response.data.Count)" -ForegroundColor White
        Write-Host ""
        Write-Host "Token valido! Pode usar na coleta." -ForegroundColor Green
    } else {
        Write-Host "Token funcionou, mas nenhum anuncio encontrado." -ForegroundColor Yellow
    }
} catch {
    $errorMessage = $_.Exception.Message
    Write-Host "ERRO: Token invalido ou expirado!" -ForegroundColor Red
    Write-Host "Detalhes: $errorMessage" -ForegroundColor Red
    Write-Host ""
    Write-Host "Voce precisa gerar um novo token!" -ForegroundColor Yellow
    Write-Host "Acesse: https://developers.facebook.com/tools/explorer" -ForegroundColor White
    Write-Host "1. Selecione seu app" -ForegroundColor White
    Write-Host "2. Clique em 'Generate Access Token'" -ForegroundColor White
    Write-Host "3. Selecione permissao: ads_read" -ForegroundColor White
    Write-Host "4. Copie o token" -ForegroundColor White
    exit 1
}



