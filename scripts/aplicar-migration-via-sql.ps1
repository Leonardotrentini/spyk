# Script para aplicar migration via API SQL do Supabase
# Usa a API REST para executar SQL diretamente

$projectRef = "acnbcideqohtjidtlrvi"
$migrationFile = Join-Path $PSScriptRoot "..\supabase\migrations\001_initial_schema.sql"
$sqlContent = Get-Content $migrationFile -Raw

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Aplicando Migration SQL" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Para aplicar a migration, você precisa:" -ForegroundColor Yellow
Write-Host "1. Acessar o SQL Editor no dashboard" -ForegroundColor White
Write-Host "2. Copiar o conteúdo do arquivo SQL" -ForegroundColor White
Write-Host "3. Executar no editor" -ForegroundColor White
Write-Host ""

$sqlEditorUrl = "https://supabase.com/dashboard/project/$projectRef/sql/new"
Write-Host "Abrindo SQL Editor..." -ForegroundColor Cyan
Start-Process $sqlEditorUrl

# Salvar SQL em arquivo temporário para fácil acesso
$tempFile = Join-Path $env:TEMP "supabase-migration-$(Get-Date -Format 'yyyyMMdd-HHmmss').sql"
$sqlContent | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host ""
Write-Host "✅ SQL salvo em:" -ForegroundColor Green
Write-Host $tempFile -ForegroundColor White
Write-Host ""
Write-Host "Abrindo arquivo SQL..." -ForegroundColor Cyan
Start-Process $tempFile

Write-Host ""
Write-Host "Copie TODO o conteúdo do arquivo que foi aberto" -ForegroundColor Yellow
Write-Host "Cole no SQL Editor do Supabase (já aberto)" -ForegroundColor Yellow
Write-Host "E clique em RUN" -ForegroundColor Yellow
Write-Host ""




