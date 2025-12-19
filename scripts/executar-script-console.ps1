# 🚀 Script para executar o SCRIPT-CONSOLE-CORRIGIDO.js no navegador
# Este script abre o Facebook Ad Library e prepara o código para colar no console

Write-Host "🔥 Preparando script para executar no console do navegador..." -ForegroundColor Yellow

# Ler o conteúdo do script
$scriptPath = Join-Path $PSScriptRoot "..\SCRIPT-CONSOLE-CORRIGIDO.js"
if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ Arquivo não encontrado: $scriptPath" -ForegroundColor Red
    exit 1
}

$scriptContent = Get-Content $scriptPath -Raw

# Copiar para o clipboard
Set-Clipboard -Value $scriptContent
Write-Host "✅ Script copiado para a área de transferência!" -ForegroundColor Green

# Perguntar qual URL do Facebook Ad Library abrir
Write-Host "`n📋 Escolha uma opção:" -ForegroundColor Cyan
Write-Host "1. Abrir Facebook Ad Library genérico" -ForegroundColor White
Write-Host "2. Abrir URL específica (você pode colar)" -ForegroundColor White
Write-Host "3. Só copiar script (não abrir navegador)" -ForegroundColor White

$opcao = Read-Host "`nDigite o número da opção (1-3)"

switch ($opcao) {
    "1" {
        $url = "https://www.facebook.com/ads/library"
        Start-Process $url
        Write-Host "✅ Navegador aberto em: $url" -ForegroundColor Green
    }
    "2" {
        $url = Read-Host "Cole a URL do Facebook Ad Library"
        if ($url -match "facebook\.com/ads/library") {
            Start-Process $url
            Write-Host "✅ Navegador aberto em: $url" -ForegroundColor Green
        } else {
            Write-Host "⚠️ URL inválida. Abrindo página genérica..." -ForegroundColor Yellow
            Start-Process "https://www.facebook.com/ads/library"
        }
    }
    "3" {
        Write-Host "✅ Script copiado! Use F12 > Console em qualquer página do Facebook Ad Library." -ForegroundColor Green
    }
    default {
        Write-Host "⚠️ Opção inválida. Abrindo página genérica..." -ForegroundColor Yellow
        Start-Process "https://www.facebook.com/ads/library"
    }
}

Write-Host "`n📝 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. No navegador que abriu, navegue até a página do Ad Library que deseja analisar" -ForegroundColor White
Write-Host "2. Pressione F12 para abrir o DevTools" -ForegroundColor White
Write-Host "3. Vá na aba 'Console'" -ForegroundColor White
Write-Host "4. Pressione Ctrl+V para colar o script" -ForegroundColor White
Write-Host "5. Pressione Enter para executar" -ForegroundColor White
Write-Host "`n✅ O script está na área de transferência, pronto para colar!" -ForegroundColor Green

Write-Host "`n💡 Dica: O resultado será exibido no console e também copiado automaticamente para a área de transferência!" -ForegroundColor Yellow

