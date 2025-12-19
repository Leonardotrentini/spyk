# Script para deploy manual das Edge Functions
$projectRef = "acnbcideqohtjidtlrvi"
$geminiKey = "AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Deploy das Edge Functions - Modo Manual" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Este script ira executar os comandos um por um." -ForegroundColor Yellow
Write-Host "Siga as instrucoes na tela." -ForegroundColor Yellow
Write-Host ""

# Passo 1: Login
Write-Host "[1/5] Fazendo login no Supabase..." -ForegroundColor Cyan
Write-Host "   Isso abrira seu navegador para autenticacao" -ForegroundColor Gray
Write-Host "   Apos fazer login, volte aqui e pressione Enter" -ForegroundColor Gray
Write-Host ""
Read-Host "Pressione Enter para iniciar o login"
supabase login

Write-Host ""
Write-Host "[2/5] Linkando projeto..." -ForegroundColor Cyan
supabase link --project-ref $projectRef

Write-Host ""
Write-Host "[3/5] Configurando GEMINI_API_KEY..." -ForegroundColor Cyan
$secretCmd = "GEMINI_API_KEY=$geminiKey"
supabase secrets set $secretCmd

Write-Host ""
Write-Host "[4/5] Fazendo deploy das Edge Functions..." -ForegroundColor Cyan
$functions = @("analyze-url", "analyze-traffic", "research-market", "cron-refresh-libraries")

foreach ($func in $functions) {
    Write-Host ""
    Write-Host "Deploying $func..." -ForegroundColor Yellow
    supabase functions deploy $func
    if ($LASTEXITCODE -eq 0) {
        Write-Host "$func deployed successfully!" -ForegroundColor Green
    } else {
        Write-Host "$func deployment failed!" -ForegroundColor Red
        Write-Host "Continue mesmo assim? (S/N)" -ForegroundColor Yellow
        $continue = Read-Host
        if ($continue -ne "S" -and $continue -ne "s") {
            break
        }
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Deploy Concluido!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verifique no dashboard:" -ForegroundColor Yellow
$dashboardUrl = "https://supabase.com/dashboard/project/" + $projectRef + "/functions"
Write-Host $dashboardUrl -ForegroundColor White
Write-Host ""
