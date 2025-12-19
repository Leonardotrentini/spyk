# Script para estender token da Meta (60 dias)
# Uso: .\scripts\gerar-token-estendido.ps1

Write-Host "Gerador de Token Estendido da Meta" -ForegroundColor Cyan
Write-Host ""

# Solicitar informacoes
$APP_ID = Read-Host "Digite seu App ID"
$APP_SECRET = Read-Host "Digite seu App Secret" -AsSecureString
$APP_SECRET = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($APP_SECRET))

Write-Host ""
Write-Host "Para obter um token curto:" -ForegroundColor Yellow
Write-Host "1. Acesse: https://developers.facebook.com/tools/explorer" -ForegroundColor White
Write-Host "2. Selecione seu app" -ForegroundColor White
Write-Host "3. Clique em 'Generate Access Token'" -ForegroundColor White
Write-Host "4. Selecione permissao: ads_read" -ForegroundColor White
Write-Host "5. Copie o token gerado" -ForegroundColor White
Write-Host ""

$SHORT_TOKEN = Read-Host "Cole o token curto aqui"

Write-Host ""
Write-Host "Estendendo token..." -ForegroundColor Cyan

$url = "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$APP_ID&client_secret=$APP_SECRET&fb_exchange_token=$SHORT_TOKEN"

try {
    $response = Invoke-RestMethod -Uri $url
    
    if ($response.access_token) {
        Write-Host ""
        Write-Host "Token estendido gerado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "TOKEN (60 dias):" -ForegroundColor Yellow
        Write-Host $response.access_token -ForegroundColor White
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host ""
        
        $days = [math]::Round($response.expires_in / 86400, 1)
        Write-Host "Expira em: $days dias" -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "Adicione este token no arquivo .env.local:" -ForegroundColor Yellow
        Write-Host "META_ADS_LIBRARY_ACCESS_TOKEN=$($response.access_token)" -ForegroundColor White
        Write-Host ""
        
        # Perguntar se quer copiar para clipboard
        $copy = Read-Host "Copiar token para area de transferencia? (S/N)"
        if ($copy -eq "S" -or $copy -eq "s") {
            $response.access_token | Set-Clipboard
            Write-Host "Token copiado!" -ForegroundColor Green
        }
    } else {
        Write-Host "Resposta inesperada da API" -ForegroundColor Red
        Write-Host $response -ForegroundColor Yellow
    }
} catch {
    Write-Host ""
    Write-Host "Erro ao estender token:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        try {
            $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host ""
            Write-Host "Detalhes:" -ForegroundColor Yellow
            Write-Host $errorDetails.error.message -ForegroundColor Red
        } catch {
            Write-Host $_.ErrorDetails.Message -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Verifique:" -ForegroundColor Cyan
    Write-Host "- App ID esta correto" -ForegroundColor White
    Write-Host "- App Secret esta correto" -ForegroundColor White
    Write-Host "- Token curto e valido e tem permissao ads_read" -ForegroundColor White
}
