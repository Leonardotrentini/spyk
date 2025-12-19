# Script para testar o User Token específico
param(
    [string]$Token = "EAAQx23HT1RcBQILEMXR3BL4vpaqHg8LHvkIDqthdfMNEhtZBo1xCbp1DXI98W9SBOFBPrU0tYGYRSu00CVcfZB7FZAboZARZAnrjoUZAnQMgWc2IHOH13hLoIS3yNsIADWtbr2y1PzJ3hD2TosaHkroIAHEyYL5TVu4AgxitvWFBu tIEJcEDftKrChmT460EcdHUkKZBaiciT1r055R6wZDZD"
)

Write-Host "=== TESTE DO USER TOKEN ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Token (primeiros 30 chars): $($Token.Substring(0, [Math]::Min(30, $Token.Length)))..." -ForegroundColor Yellow
Write-Host "Token (tamanho): $($Token.Length) caracteres" -ForegroundColor Yellow
Write-Host ""

# Teste 1: Endpoint /me
Write-Host "=== TESTE 1: Endpoint /me ===" -ForegroundColor Cyan
$url1 = "https://graph.facebook.com/v21.0/me?access_token=$Token"
Write-Host "URL: $($url1.Substring(0, 50))..." -ForegroundColor Gray

try {
    $response1 = Invoke-RestMethod -Uri $url1 -Method Get
    Write-Host "SUCESSO!" -ForegroundColor Green
    Write-Host "Resposta: $($response1 | ConvertTo-Json -Depth 2)" -ForegroundColor White
} catch {
    Write-Host "ERRO!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Mensagem: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
            Write-Host "Corpo da resposta: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "Nao foi possivel ler o corpo da resposta" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "=== TESTE 2: Ads Archive (minimo) ===" -ForegroundColor Cyan
$url2 = "https://graph.facebook.com/v21.0/ads_archive?access_token=$Token&ad_reached_countries=AR&limit=5&fields=id,page"
Write-Host "URL: $($url2.Substring(0, 80))..." -ForegroundColor Gray

try {
    $response2 = Invoke-RestMethod -Uri $url2 -Method Get
    Write-Host "SUCESSO!" -ForegroundColor Green
    Write-Host "Anuncios encontrados: $($response2.data.Count)" -ForegroundColor Green
    if ($response2.data.Count -gt 0) {
        Write-Host "Primeiro anuncio:" -ForegroundColor Yellow
        Write-Host ($response2.data[0] | ConvertTo-Json -Depth 3) -ForegroundColor White
    }
} catch {
    Write-Host "ERRO!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Mensagem: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
            Write-Host "Corpo da resposta: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "Nao foi possivel ler o corpo da resposta" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "=== RESULTADO ===" -ForegroundColor Cyan
Write-Host "Se o Teste 2 passou, o token funciona!" -ForegroundColor Green
Write-Host "Se o Teste 2 falhou, ainda precisa autorizar em https://www.facebook.com/ads/library/api" -ForegroundColor Yellow



