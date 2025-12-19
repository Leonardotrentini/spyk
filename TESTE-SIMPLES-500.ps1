# Teste simples para erro 500
param(
    [string]$Token = ""
)

if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "Cole o token:" -ForegroundColor Yellow
    $Token = Read-Host
}

Write-Host "Testando 3 versoes da API..." -ForegroundColor Cyan
Write-Host ""

# Teste 1: v24.0
Write-Host "1. v24.0..." -ForegroundColor Gray
$url1 = "https://graph.facebook.com/v24.0/ads_archive?access_token=$Token&ad_reached_countries=AR&limit=5&fields=id,page"
try {
    $r1 = Invoke-RestMethod -Uri $url1 -Method Get
    Write-Host "   SUCESSO! Anuncios: $($r1.data.Count)" -ForegroundColor Green
    exit 0
} catch {
    Write-Host "   Erro: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Teste 2: v21.0
Write-Host "2. v21.0..." -ForegroundColor Gray
$url2 = "https://graph.facebook.com/v21.0/ads_archive?access_token=$Token&ad_reached_countries=AR&limit=5&fields=id,page"
try {
    $r2 = Invoke-RestMethod -Uri $url2 -Method Get
    Write-Host "   SUCESSO! Anuncios: $($r2.data.Count)" -ForegroundColor Green
    exit 0
} catch {
    Write-Host "   Erro: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Teste 3: v20.0
Write-Host "3. v20.0..." -ForegroundColor Gray
$url3 = "https://graph.facebook.com/v20.0/ads_archive?access_token=$Token&ad_reached_countries=AR&limit=5&fields=id,page"
try {
    $r3 = Invoke-RestMethod -Uri $url3 -Method Get
    Write-Host "   SUCESSO! Anuncios: $($r3.data.Count)" -ForegroundColor Green
    exit 0
} catch {
    Write-Host "   Erro: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Todas as versoes falharam." -ForegroundColor Red
Write-Host "Pode ser problema temporario da Meta." -ForegroundColor Yellow
Write-Host "Use modo MOCK por enquanto para continuar desenvolvendo." -ForegroundColor Yellow


