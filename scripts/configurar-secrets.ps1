# Script para configurar secrets no Supabase
# Mostra instruções claras para configurar GEMINI_API_KEY

$geminiKey = "AlzaSyD1icpTGUEbrxdo5kGwClrO7zi9G-Cs2Z8"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Configurar GEMINI_API_KEY" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Chave do Gemini:" -ForegroundColor Yellow
Write-Host $geminiKey -ForegroundColor White
Write-Host ""
Write-Host "Abrindo página de configuração..." -ForegroundColor Cyan
Write-Host ""
Write-Host "No dashboard:" -ForegroundColor Cyan
Write-Host "1. Vá em: Project Settings > Edge Functions > Secrets" -ForegroundColor White
Write-Host "2. Clique em: Add a new secret" -ForegroundColor White
Write-Host "3. Name: GEMINI_API_KEY" -ForegroundColor White
Write-Host "4. Value: $geminiKey" -ForegroundColor White
Write-Host "5. Clique em Save" -ForegroundColor White
Write-Host ""

# Copiar chave para clipboard
$geminiKey | Set-Clipboard
Write-Host "✅ Chave copiada para clipboard!" -ForegroundColor Green
Write-Host ""

Start-Process "https://supabase.com/dashboard/project/acnbcideqohtjidtlrvi/settings/functions"




