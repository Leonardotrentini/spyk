# Script para testar token completo (sem cortar)
param(
    [string]$Token = ""
)

Write-Host "=== TESTE DE TOKEN COMPLETO ===" -ForegroundColor Cyan
Write-Host ""

# Se token não foi passado, pedir
if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "Cole o token completo do Graph API Explorer:" -ForegroundColor Yellow
    $Token = Read-Host
}

# Verificar se token está completo
Write-Host "Token (primeiros 30 chars): $($Token.Substring(0, [Math]::Min(30, $Token.Length)))..." -ForegroundColor Yellow
Write-Host "Token (tamanho): $($Token.Length) caracteres" -ForegroundColor Yellow

if ($Token.Length -lt 100) {
    Write-Host "AVISO: Token parece muito curto! Deve ter ~200-300 caracteres" -ForegroundColor Red
}

Write-Host ""

# Teste 1: Endpoint /me
Write-Host "=== TESTE 1: Endpoint /me ===" -ForegroundColor Cyan
$url1 = "https://graph.facebook.com/v24.0/me?access_token=$Token"

try {
    $response1 = Invoke-RestMethod -Uri $url1 -Method Get
    Write-Host "SUCESSO!" -ForegroundColor Green
    Write-Host "Usuario: $($response1.name) (ID: $($response1.id))" -ForegroundColor White
} catch {
    Write-Host "ERRO!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
            Write-Host "Resposta: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "Nao foi possivel ler resposta" -ForegroundColor Yellow
        }
    }
}

Write-Host ""

# Teste 2: Ads Archive
Write-Host "=== TESTE 2: Ads Archive ===" -ForegroundColor Cyan
$url2 = "https://graph.facebook.com/v24.0/ads_archive?access_token=$Token&ad_reached_countries=AR&limit=5&fields=id,page"
Write-Host "Testando..." -ForegroundColor Gray

try {
    $response2 = Invoke-RestMethod -Uri $url2 -Method Get
    Write-Host "SUCESSO!" -ForegroundColor Green
    Write-Host "Anuncios encontrados: $($response2.data.Count)" -ForegroundColor Green
    if ($response2.data.Count -gt 0) {
        Write-Host ""
        Write-Host "Primeiro anuncio:" -ForegroundColor Yellow
        Write-Host ($response2.data[0] | ConvertTo-Json -Depth 3) -ForegroundColor White
    }
    Write-Host ""
    Write-Host "=== TOKEN FUNCIONA! ===" -ForegroundColor Green
    Write-Host "Copie este token e atualize no projeto:" -ForegroundColor Yellow
    Write-Host $Token -ForegroundColor Cyan
} catch {
    Write-Host "ERRO!" -ForegroundColor Red
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Status: $statusCode" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
            
            Write-Host ""
            Write-Host "Resposta completa:" -ForegroundColor Yellow
            Write-Host $responseBody -ForegroundColor White
            Write-Host ""
            
            Write-Host "=== DIAGNOSTICO ===" -ForegroundColor Cyan
            
            if ($responseBody -match "Application does not have permission") {
                Write-Host "PROBLEMA: App nao tem permissao para Ads Library API" -ForegroundColor Red
                Write-Host ""
                Write-Host "SOLUCAO:" -ForegroundColor Yellow
                Write-Host "1. Acesse: https://developers.facebook.com/apps" -ForegroundColor White
                Write-Host "2. Selecione seu app" -ForegroundColor White
                Write-Host "3. Adicione produto 'Ads Library API'" -ForegroundColor White
                Write-Host "4. Autorize em: https://www.facebook.com/ads/library/api" -ForegroundColor White
                Write-Host "5. Gere um NOVO token" -ForegroundColor White
            } elseif ($responseBody -match "Malformed") {
                Write-Host "PROBLEMA: Token malformado ou incompleto" -ForegroundColor Red
                Write-Host "SOLUCAO: Gere um novo token no Graph API Explorer" -ForegroundColor Yellow
            } elseif ($statusCode -eq 500) {
                Write-Host "PROBLEMA: Erro 500 (pode ser erro mascarado)" -ForegroundColor Red
                Write-Host ""
                Write-Host "POSSIVEIS CAUSAS:" -ForegroundColor Yellow
                Write-Host "- App nao tem produto 'Ads Library API' adicionado" -ForegroundColor White
                Write-Host "- App nao esta autorizado na pagina da Meta" -ForegroundColor White
                Write-Host "- Problema temporario da Meta API" -ForegroundColor White
                Write-Host ""
                Write-Host "SOLUCAO:" -ForegroundColor Yellow
                Write-Host "1. Verifique se app tem 'Ads Library API' em Products" -ForegroundColor White
                Write-Host "2. Autorize em: https://www.facebook.com/ads/library/api" -ForegroundColor White
                Write-Host "3. Gere um NOVO token" -ForegroundColor White
                Write-Host "4. Aguarde algumas horas e tente novamente" -ForegroundColor White
            } else {
                Write-Host "Erro desconhecido. Verifique a resposta acima." -ForegroundColor Yellow
            }
        } catch {
            Write-Host "Nao foi possivel ler resposta do erro" -ForegroundColor Yellow
            Write-Host "Erro ao ler stream: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "Nao foi possivel obter resposta do servidor" -ForegroundColor Yellow
        Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
}


