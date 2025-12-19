# Script de Setup Completo Automatizado
# Executa todos os passos de configuração

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  🚀 Setup Completo - AdLib Monitor" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Passo 1: Verificar .env.local
Write-Host "[1/4] Verificando variáveis de ambiente..." -ForegroundColor Yellow
$envFile = Join-Path $PSScriptRoot "..\.env.local"
if (Test-Path $envFile) {
    Write-Host "✅ .env.local encontrado" -ForegroundColor Green
    $content = Get-Content $envFile
    if ($content -match "VITE_SUPABASE_URL" -and $content -match "VITE_SUPABASE_ANON_KEY") {
        Write-Host "✅ Variáveis configuradas" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Variáveis incompletas" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env.local não encontrado" -ForegroundColor Red
}
Write-Host ""

# Passo 2: Preparar Migration SQL
Write-Host "[2/4] Preparando migration SQL..." -ForegroundColor Yellow
$migrationFile = Join-Path $PSScriptRoot "..\supabase\migrations\001_initial_schema.sql"
if (Test-Path $migrationFile) {
    $sqlContent = Get-Content $migrationFile -Raw
    $tempFile = Join-Path $env:TEMP "supabase-migration.sql"
    $sqlContent | Out-File -FilePath $tempFile -Encoding UTF8
    Write-Host "✅ Migration SQL salva em: $tempFile" -ForegroundColor Green
    Write-Host "   Abrindo SQL Editor..." -ForegroundColor Cyan
    Start-Process "https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/sql/new"
    Start-Sleep -Seconds 2
    Start-Process $tempFile
} else {
    Write-Host "❌ Arquivo de migration não encontrado" -ForegroundColor Red
}
Write-Host ""

# Passo 3: Configurar Secrets
Write-Host "[3/4] Preparando configuração de secrets..." -ForegroundColor Yellow
$geminiKey = "AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8"
$geminiKey | Set-Clipboard
Write-Host "✅ Chave do Gemini copiada para clipboard" -ForegroundColor Green
Write-Host "   Abrindo página de secrets..." -ForegroundColor Cyan
Start-Process "https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/settings/functions"
Write-Host ""

# Passo 4: Instruções de Deploy
Write-Host "[4/4] Instruções de deploy das Edge Functions..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Para deploy das functions, você precisa:" -ForegroundColor Cyan
Write-Host "1. Instalar Supabase CLI:" -ForegroundColor White
Write-Host "   Windows (Scoop): scoop bucket add supabase https://github.com/supabase/scoop-bucket.git" -ForegroundColor Gray
Write-Host "   Windows (Scoop): scoop install supabase" -ForegroundColor Gray
Write-Host ""
Write-Host "   Ou baixe de: https://github.com/supabase/cli/releases" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Após instalar, execute:" -ForegroundColor White
Write-Host "   supabase login" -ForegroundColor Gray
Write-Host "   supabase link --project-ref acnbcideqohtjidtlrvi" -ForegroundColor Gray
Write-Host "   supabase secrets set GEMINI_API_KEY=$geminiKey" -ForegroundColor Gray
Write-Host "   supabase functions deploy analyze-url" -ForegroundColor Gray
Write-Host "   supabase functions deploy analyze-traffic" -ForegroundColor Gray
Write-Host "   supabase functions deploy research-market" -ForegroundColor Gray
Write-Host "   supabase functions deploy cron-refresh-libraries" -ForegroundColor Gray
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  ✅ Setup Inicial Concluído!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos manuais:" -ForegroundColor Yellow
Write-Host "1. ✅ Execute o SQL no editor (já aberto)" -ForegroundColor White
Write-Host "2. ✅ Configure GEMINI_API_KEY em secrets (já aberto)" -ForegroundColor White
Write-Host "3. ⏳ Instale Supabase CLI e faça deploy das functions" -ForegroundColor White
Write-Host ""
Write-Host "Depois de tudo configurado, teste com:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""




