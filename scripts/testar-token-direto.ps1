# Script para testar token diretamente com API Meta
param(
    [string]$Token = ""
)

Write-Host "=== TESTE DIRETO DO TOKEN COM API META ===" -ForegroundColor Cyan
Write-Host ""

# Se token não foi passado, tentar ler do .env.local
if ([string]::IsNullOrEmpty($Token)) {
    $envPath = ".\.env.local"
    if (Test-Path $envPath) {
        $content = Get-Content $envPath -Raw
        if ($content -match "META_ADS_LIBRARY_ACCESS_TOKEN=(.+)") {
            $Token = $matches[1].Trim()
            Write-Host "Token encontrado no .env.local" -ForegroundColor Green
        } else {
            Write-Host "Token nao encontrado no .env.local" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Arquivo .env.local nao encontrado" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Token (primeiros 30 chars): $($Token.Substring(0, [Math]::Min(30, $Token.Length)))..." -ForegroundColor Yellow
Write-Host "Token (tamanho): $($Token.Length) caracteres" -ForegroundColor Yellow
Write-Host ""

# Testar com endpoint simples primeiro
Write-Host "=== TESTE 1: Endpoint Simples (me) ===" -ForegroundColor Cyan
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
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Corpo da resposta: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== TESTE 2: Ads Archive (simples - versao v21.0) ===" -ForegroundColor Cyan
$url2 = "https://graph.facebook.com/v21.0/ads_archive?access_token=$Token&ad_reached_countries=AR&ad_active_status=ALL&limit=5&fields=id,page"
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
Write-Host "=== TESTE 2B: Ads Archive (versao v20.0) ===" -ForegroundColor Cyan
$url2b = "https://graph.facebook.com/v20.0/ads_archive?access_token=$Token&ad_reached_countries=AR&ad_active_status=ALL&limit=5&fields=id,page"
Write-Host "URL: $($url2b.Substring(0, 80))..." -ForegroundColor Gray

try {
    $response2b = Invoke-RestMethod -Uri $url2b -Method Get
    Write-Host "SUCESSO!" -ForegroundColor Green
    Write-Host "Anuncios encontrados: $($response2b.data.Count)" -ForegroundColor Green
    if ($response2b.data.Count -gt 0) {
        Write-Host "Primeiro anuncio:" -ForegroundColor Yellow
        Write-Host ($response2b.data[0] | ConvertTo-Json -Depth 3) -ForegroundColor White
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
Write-Host "=== TESTE 2C: Ads Archive (versao v19.0) ===" -ForegroundColor Cyan
$url2c = "https://graph.facebook.com/v19.0/ads_archive?access_token=$Token&ad_reached_countries=AR&ad_active_status=ALL&limit=5&fields=id,page"
Write-Host "URL: $($url2c.Substring(0, 80))..." -ForegroundColor Gray

try {
    $response2c = Invoke-RestMethod -Uri $url2c -Method Get
    Write-Host "SUCESSO!" -ForegroundColor Green
    Write-Host "Anuncios encontrados: $($response2c.data.Count)" -ForegroundColor Green
    if ($response2c.data.Count -gt 0) {
        Write-Host "Primeiro anuncio:" -ForegroundColor Yellow
        Write-Host ($response2c.data[0] | ConvertTo-Json -Depth 3) -ForegroundColor White
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
Write-Host "=== TESTE 2D: Ads Archive (minimo - apenas token e pais) ===" -ForegroundColor Cyan
$url2d = "https://graph.facebook.com/v21.0/ads_archive?access_token=$Token&ad_reached_countries=AR&limit=5"
Write-Host "URL: $($url2d.Substring(0, 80))..." -ForegroundColor Gray

try {
    $response2d = Invoke-RestMethod -Uri $url2d -Method Get
    Write-Host "SUCESSO!" -ForegroundColor Green
    Write-Host "Anuncios encontrados: $($response2d.data.Count)" -ForegroundColor Green
    if ($response2d.data.Count -gt 0) {
        Write-Host "Primeiro anuncio:" -ForegroundColor Yellow
        Write-Host ($response2d.data[0] | ConvertTo-Json -Depth 3) -ForegroundColor White
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
Write-Host "=== TESTE 3: Ads Archive (com keywords - versao v21.0) ===" -ForegroundColor Cyan
$url3 = "https://graph.facebook.com/v21.0/ads_archive?access_token=$Token&ad_reached_countries=AR&ad_active_status=ALL&search_terms=infoproduto&limit=5&fields=id,page,ad_creative_bodies"
Write-Host "URL: $($url3.Substring(0, 100))..." -ForegroundColor Gray

try {
    $response3 = Invoke-RestMethod -Uri $url3 -Method Get
    Write-Host "SUCESSO!" -ForegroundColor Green
    Write-Host "Anuncios encontrados: $($response3.data.Count)" -ForegroundColor Green
    if ($response3.data.Count -gt 0) {
        Write-Host "Primeiro anuncio:" -ForegroundColor Yellow
        Write-Host ($response3.data[0] | ConvertTo-Json -Depth 3) -ForegroundColor White
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
Write-Host "=== RESULTADO FINAL ===" -ForegroundColor Cyan
Write-Host "Se todos os testes falharam com 401, o token esta invalido ou expirado" -ForegroundColor Yellow
Write-Host "Se o teste 1 passou mas 2 e 3 falharam, pode ser problema de permissao ads_read" -ForegroundColor Yellow
Write-Host "Se todos passaram, o token esta OK e o problema esta no nosso codigo" -ForegroundColor Green

