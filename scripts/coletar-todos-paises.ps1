# Script para coletar anúncios de múltiplos países
# Uso: .\scripts\coletar-todos-paises.ps1

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  COLETA MULTI-PAÍS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Países LATAM principais
$paises = @(
    @{ code = "AR"; nome = "Argentina" },
    @{ code = "BR"; nome = "Brasil" },
    @{ code = "MX"; nome = "México" },
    @{ code = "CO"; nome = "Colômbia" },
    @{ code = "CL"; nome = "Chile" },
    @{ code = "PE"; nome = "Peru" }
)

$keywords = @(
    "infoproduto",
    "curso online",
    "treinamento",
    "mentoria",
    "ebook"
)

$apiUrl = "http://localhost:3000/api/ads/collect-full"

$totalColetado = 0

foreach ($pais in $paises) {
    Write-Host ""
    Write-Host "🌎 Coletando de $($pais.nome) ($($pais.code))..." -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Gray
    
    foreach ($keyword in $keywords) {
        Write-Host ""
        Write-Host "🔍 Palavra-chave: '$keyword'" -ForegroundColor Yellow
        
        $body = @{
            country = $pais.code
            keywords = $keyword
            maxPages = 50
        } | ConvertTo-Json

        try {
            $response = Invoke-RestMethod -Uri $apiUrl -Method POST -ContentType "application/json" -Body $body
            
            if ($response.success) {
                $stats = $response.stats
                Write-Host "   ✅ $($stats.total_collected) anúncios coletados ($($stats.new_ads) novos)" -ForegroundColor Green
                $totalColetado += $stats.total_collected
            } else {
                Write-Host "   ❌ Erro: $($response.error)" -ForegroundColor Red
            }
            
            # Pausa entre requisições
            Start-Sleep -Seconds 2
            
        } catch {
            Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
            
            if ($_.Exception.Response.StatusCode -eq 429) {
                Write-Host "   ⏳ Rate limit, aguardando 60s..." -ForegroundColor Yellow
                Start-Sleep -Seconds 60
            }
        }
    }
    
    Write-Host ""
    Write-Host "✅ $($pais.nome) concluído" -ForegroundColor Green
    Write-Host "⏳ Aguardando 10s antes do próximo país..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  COLETA COMPLETA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total coletado: $totalColetado anúncios" -ForegroundColor White
Write-Host ""



