# Script para aplicar migration SQL no Supabase via API REST
# Este script abre o SQL Editor no navegador com o conteúdo pronto para copiar

$migrationFile = Join-Path $PSScriptRoot "..\supabase\migrations\001_initial_schema.sql"
$sqlContent = Get-Content $migrationFile -Raw

# Salvar SQL em arquivo temporário para fácil acesso
$tempFile = Join-Path $env:TEMP "supabase-migration.sql"
$sqlContent | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Migration SQL Preparada!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Arquivo salvo em: $tempFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Abra: https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/sql/new" -ForegroundColor White
Write-Host "2. Abra o arquivo: $tempFile" -ForegroundColor White
Write-Host "3. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)" -ForegroundColor White
Write-Host "4. Cole no SQL Editor do Supabase" -ForegroundColor White
Write-Host "5. Clique em RUN ou pressione Ctrl+Enter" -ForegroundColor White
Write-Host ""
Write-Host "Abrindo navegador..." -ForegroundColor Cyan
Start-Process "https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/sql/new"
Start-Process $tempFile




