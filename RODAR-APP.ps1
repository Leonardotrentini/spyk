# Script para rodar o app e abrir no navegador automaticamente

Write-Host "🚀 Iniciando AdLib Monitor..." -ForegroundColor Cyan
Write-Host ""

# Mudar para o diretório do projeto
Set-Location "C:\Users\Leonardo trentini\Desktop\spy"

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Aguardar um pouco e abrir navegador
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 5
    Start-Process "http://localhost:3000"
} | Out-Null

Write-Host "✅ Abrindo http://localhost:3000 no navegador em 5 segundos..." -ForegroundColor Green
Write-Host ""
Write-Host "Para parar o servidor, pressione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Rodar o servidor
npm run dev




