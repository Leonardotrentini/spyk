# Script para deploy CORRIGIDO - usando --project-ref diretamente
$projectRef = "acnbcideqohtjidtlrvi"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Deploy das Edge Functions (Corrigido)" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$functions = @("analyze-url", "analyze-traffic", "research-market", "cron-refresh-libraries")

foreach ($func in $functions) {
    Write-Host ""
    Write-Host "[$($functions.IndexOf($func) + 1)/$($functions.Count)] Deploying $func..." -ForegroundColor Yellow
    supabase functions deploy $func --project-ref $projectRef
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $func deployed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ $func deployment failed!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Deploy Finalizado!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verifique no dashboard:" -ForegroundColor Yellow
$dashboardUrl = "https://supabase.com/dashboard/project/" + $projectRef + "/functions"
Write-Host $dashboardUrl -ForegroundColor White
Write-Host ""




