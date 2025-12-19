# Script para fazer deploy das Edge Functions
# Execute este script após fazer login no Supabase

$projectRef = "acnbcideqohtjidtlrvi"
$geminiKey = "AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  🚀 Deploy das Edge Functions" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se CLI está instalado
try {
    $version = supabase --version 2>&1
    Write-Host "✅ Supabase CLI instalado: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI não encontrado. Execute primeiro: scoop install supabase" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Este script irá:" -ForegroundColor Yellow
Write-Host "1. Fazer login no Supabase (abrirá navegador)" -ForegroundColor White
Write-Host "2. Linkar o projeto" -ForegroundColor White
Write-Host "3. Configurar GEMINI_API_KEY" -ForegroundColor White
Write-Host "4. Fazer deploy das 4 Edge Functions" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Deseja continuar? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "Cancelado." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "[1/5] Fazendo login no Supabase..." -ForegroundColor Yellow
Write-Host "   (Isso abrirá seu navegador para autenticação)" -ForegroundColor Gray
supabase login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Login falhou" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/5] Linkando projeto..." -ForegroundColor Yellow
supabase link --project-ref $projectRef
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Link falhou" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[3/5] Configurando GEMINI_API_KEY..." -ForegroundColor Yellow
supabase secrets set "GEMINI_API_KEY=$geminiKey"
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Configuração de secret falhou (pode já estar configurado)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[4/5] Fazendo deploy das Edge Functions..." -ForegroundColor Yellow
$functions = @("analyze-url", "analyze-traffic", "research-market", "cron-refresh-libraries")

foreach ($func in $functions) {
    Write-Host ""
    Write-Host "Deploying $func..." -ForegroundColor Cyan
    supabase functions deploy $func
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $func deployed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ $func deployment failed" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  ✅ Deploy Concluído!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verifique no dashboard:" -ForegroundColor Yellow
Write-Host "https://supabase.com/dashboard/project/$projectRef/functions" -ForegroundColor White
Write-Host ""
Write-Host "Agora você pode testar o app:" -ForegroundColor Yellow
Write-Host "npm run dev" -ForegroundColor White
Write-Host ""




