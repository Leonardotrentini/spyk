# 🚀 Script para iniciar o servidor Next.js na porta 3000

Write-Host "🔄 Verificando se há servidor rodando na porta 3000..." -ForegroundColor Yellow

# Verificar se a porta 3000 está em uso
$port3000 = netstat -ano | findstr :3000
if ($port3000) {
    Write-Host "⚠️ Porta 3000 está em uso. Encerrando processo..." -ForegroundColor Yellow
    $process = netstat -ano | findstr :3000 | Select-String "LISTENING" | ForEach-Object { ($_ -split '\s+')[-1] }
    if ($process) {
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "✅ Processo encerrado." -ForegroundColor Green
    }
}

# Navegar para a pasta do projeto
$projectPath = "C:\Users\Leonardo trentini\Desktop\spy"
if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Host "✅ Navegando para: $projectPath" -ForegroundColor Green
} else {
    Write-Host "❌ Pasta não encontrada: $projectPath" -ForegroundColor Red
    exit 1
}

Write-Host "`n🚀 Iniciando servidor Next.js..." -ForegroundColor Cyan
Write-Host "📍 Aguarde a mensagem 'ready started server on 0.0.0.0:3000'" -ForegroundColor Yellow
Write-Host "🌐 Depois acesse: http://localhost:3000`n" -ForegroundColor Green

# Iniciar servidor
npm run dev

