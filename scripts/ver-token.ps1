# Script para ver o token salvo no .env.local
# Uso: .\scripts\ver-token.ps1

Write-Host "Token da Meta salvo no .env.local" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

if (-not (Test-Path $envFile)) {
    Write-Host "Arquivo .env.local nao encontrado!" -ForegroundColor Red
    exit
}

$content = Get-Content $envFile

$tokenLine = $content | Where-Object { $_ -match "META_ADS_LIBRARY_ACCESS_TOKEN=" }

if ($tokenLine) {
    $token = $tokenLine -replace "META_ADS_LIBRARY_ACCESS_TOKEN=", ""
    
    if ([string]::IsNullOrWhiteSpace($token)) {
        Write-Host "Token nao configurado (vazio)" -ForegroundColor Yellow
    } else {
        Write-Host "Token encontrado:" -ForegroundColor Green
        Write-Host ""
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host $token -ForegroundColor White
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host ""
        
        # Perguntar se quer copiar
        $copy = Read-Host "Copiar token para area de transferencia? (S/N)"
        if ($copy -eq "S" -or $copy -eq "s") {
            $token | Set-Clipboard
            Write-Host "Token copiado!" -ForegroundColor Green
        }
    }
} else {
    Write-Host "Token nao encontrado no arquivo .env.local" -ForegroundColor Red
    Write-Host "Adicione a linha: META_ADS_LIBRARY_ACCESS_TOKEN=seu_token" -ForegroundColor Yellow
}



