# Script para coletar anuncios continuamente da Meta Ads Library
# Uso: .\scripts\coletar-continuo.ps1

param(
    [string]$Country = "AR",
    [string]$Keywords = "infoproduto",
    [int]$IntervalMinutes = 60,
    [int]$MaxPages = 100,
    [switch]$RunOnce = $false
)

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  COLETA CONTINUA DE ANUNCIOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pais: $Country" -ForegroundColor White
Write-Host "Palavras-chave: $Keywords" -ForegroundColor White
Write-Host "Intervalo: $IntervalMinutes minutos" -ForegroundColor White
Write-Host "Max. paginas por execucao: $MaxPages" -ForegroundColor White
Write-Host ""

if ($RunOnce) {
    Write-Host "Modo: Execucao unica" -ForegroundColor Yellow
} else {
    Write-Host "Modo: Continuo (a cada $IntervalMinutes minutos)" -ForegroundColor Yellow
}
Write-Host ""

$apiUrl = "http://localhost:3000/api/ads/collect-full"

function Invoke-Collection {
    $currentTime = (Get-Date).ToString("HH:mm:ss")
    Write-Host "[$currentTime] Iniciando coleta..." -ForegroundColor Green
    
    $body = @{
        country = $Country
        keywords = $Keywords
        maxPages = $MaxPages
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method POST -ContentType "application/json" -Body $body
        
        if ($response.success) {
            $stats = $response.stats
            $currentTime = (Get-Date).ToString("HH:mm:ss")
            Write-Host "[$currentTime] Coleta concluida!" -ForegroundColor Green
            Write-Host "   Total coletado: $($stats.total_collected)" -ForegroundColor White
            Write-Host "   Novos: $($stats.new_ads)" -ForegroundColor Cyan
            Write-Host "   Atualizados: $($stats.updated_ads)" -ForegroundColor Yellow
            Write-Host "   Paginas processadas: $($stats.pages_processed)" -ForegroundColor White
            
            if ($stats.has_more) {
                Write-Host "   Ainda ha mais paginas disponiveis" -ForegroundColor Yellow
            }
        } else {
            $currentTime = (Get-Date).ToString("HH:mm:ss")
            Write-Host "[$currentTime] Erro: $($response.error)" -ForegroundColor Red
            if ($response.details) {
                Write-Host "   Detalhes: $($response.details)" -ForegroundColor Red
            }
        }
    } catch {
        $currentTime = (Get-Date).ToString("HH:mm:ss")
        Write-Host "[$currentTime] Erro na requisicao: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "   Token da Meta expirado! Gere um novo token." -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
}

# Primeira execucao
Invoke-Collection

if ($RunOnce) {
    Write-Host "Execucao unica concluida." -ForegroundColor Cyan
    exit 0
}

# Loop continuo
Write-Host "Entrando em modo continuo..." -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Yellow
Write-Host ""

while ($true) {
    $nextRun = (Get-Date).AddMinutes($IntervalMinutes)
    $nextRunTime = $nextRun.ToString("HH:mm:ss")
    $currentTime = (Get-Date).ToString("HH:mm:ss")
    Write-Host "[$currentTime] Proxima coleta em $IntervalMinutes minutos (as $nextRunTime)" -ForegroundColor Gray
    
    Start-Sleep -Seconds ($IntervalMinutes * 60)
    
    Invoke-Collection
}
