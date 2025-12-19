# Script para resolver token REAL - Teste completo
param(
    [string]$Token = ""
)

if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "Cole o token do Graph API Explorer:" -ForegroundColor Yellow
    $Token = Read-Host
}

Write-Host "=== TESTE COMPLETO DO TOKEN ===" -ForegroundColor Cyan
Write-Host ""

# Teste 1: Verificar token básico
Write-Host "1. Testando token basico (/me)..." -ForegroundColor Gray
$url1 = "https://graph.facebook.com/v24.0/me?access_token=$Token"
try {
    $r1 = Invoke-RestMethod -Uri $url1 -Method Get
    Write-Host "   OK - Usuario: $($r1.name)" -ForegroundColor Green
} catch {
    Write-Host "   ERRO - Token invalido!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Teste 2: Verificar permissões do token
Write-Host "2. Verificando permissoes do token..." -ForegroundColor Gray
$url2 = "https://graph.facebook.com/v24.0/me/permissions?access_token=$Token"
try {
    $r2 = Invoke-RestMethod -Uri $url2 -Method Get
    $adsRead = $r2.data | Where-Object { $_.permission -eq "ads_read" -and $_.status -eq "granted" }
    if ($adsRead) {
        Write-Host "   OK - ads_read esta concedida" -ForegroundColor Green
    } else {
        Write-Host "   ERRO - ads_read NAO esta concedida!" -ForegroundColor Red
        Write-Host "   Solucao: Gere novo token com ads_read no Graph API Explorer" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "   AVISO - Nao foi possivel verificar permissoes" -ForegroundColor Yellow
}

Write-Host ""

# Teste 3: Testar ads_archive com diferentes formatos
Write-Host "3. Testando ads_archive (varias tentativas)..." -ForegroundColor Gray
Write-Host ""

# Tentativa 3.1: Formato mínimo
Write-Host "   3.1. Formato minimo (apenas pais)..." -ForegroundColor DarkGray
$url3a = "https://graph.facebook.com/v24.0/ads_archive?access_token=$Token&ad_reached_countries=AR&limit=1"
try {
    $r3a = Invoke-WebRequest -Uri $url3a -Method Get -ErrorAction Stop
    Write-Host "      SUCESSO! Status: $($r3a.StatusCode)" -ForegroundColor Green
    $json = $r3a.Content | ConvertFrom-Json
    Write-Host "      Anuncios encontrados: $($json.data.Count)" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== TOKEN FUNCIONA! ===" -ForegroundColor Green
    Write-Host "Copie este token:" -ForegroundColor Yellow
    Write-Host $Token -ForegroundColor Cyan
    exit 0
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    Write-Host "      ERRO $status" -ForegroundColor Red
    
    # Tentar ler resposta de erro
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errorBody = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
            
            Write-Host "      Resposta:" -ForegroundColor Yellow
            Write-Host $errorBody -ForegroundColor White
            
            # Verificar se é erro de permissão
            if ($errorBody -match "Application does not have permission") {
                Write-Host ""
                Write-Host "=== PROBLEMA IDENTIFICADO ===" -ForegroundColor Red
                Write-Host "App nao tem permissao para Ads Library API" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "SOLUCAO:" -ForegroundColor Cyan
                Write-Host "1. Acesse: https://www.facebook.com/ads/library/api" -ForegroundColor White
                Write-Host "2. Faca login" -ForegroundColor White
                Write-Host "3. Procure por botao 'Authorize' ou 'Get Started'" -ForegroundColor White
                Write-Host "4. Autorize o acesso" -ForegroundColor White
                Write-Host "5. Gere um NOVO token no Graph API Explorer" -ForegroundColor White
                Write-Host "6. Execute este script novamente com o novo token" -ForegroundColor White
                exit 1
            }
        } catch {
            Write-Host "      Nao foi possivel ler resposta de erro" -ForegroundColor Yellow
        }
    }
}

# Tentativa 3.2: Com fields
Write-Host "   3.2. Com fields (id,page)..." -ForegroundColor DarkGray
$url3b = "https://graph.facebook.com/v24.0/ads_archive?access_token=$Token&ad_reached_countries=AR&limit=1&fields=id,page"
try {
    $r3b = Invoke-WebRequest -Uri $url3b -Method Get -ErrorAction Stop
    Write-Host "      SUCESSO! Status: $($r3b.StatusCode)" -ForegroundColor Green
    $json = $r3b.Content | ConvertFrom-Json
    Write-Host "      Anuncios encontrados: $($json.data.Count)" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== TOKEN FUNCIONA! ===" -ForegroundColor Green
    Write-Host "Copie este token:" -ForegroundColor Yellow
    Write-Host $Token -ForegroundColor Cyan
    exit 0
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    Write-Host "      ERRO $status" -ForegroundColor Red
}

# Tentativa 3.3: Versão diferente
Write-Host "   3.3. Versao v21.0..." -ForegroundColor DarkGray
$url3c = "https://graph.facebook.com/v21.0/ads_archive?access_token=$Token&ad_reached_countries=AR&limit=1"
try {
    $r3c = Invoke-WebRequest -Uri $url3c -Method Get -ErrorAction Stop
    Write-Host "      SUCESSO! Status: $($r3c.StatusCode)" -ForegroundColor Green
    $json = $r3c.Content | ConvertFrom-Json
    Write-Host "      Anuncios encontrados: $($json.data.Count)" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== TOKEN FUNCIONA! ===" -ForegroundColor Green
    Write-Host "Copie este token:" -ForegroundColor Yellow
    Write-Host $Token -ForegroundColor Cyan
    exit 0
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    Write-Host "      ERRO $status" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== TODAS AS TENTATIVAS FALHARAM ===" -ForegroundColor Red
Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Acesse: https://www.facebook.com/ads/library/api" -ForegroundColor White
Write-Host "2. Faca login" -ForegroundColor White
Write-Host "3. Autorize o acesso (se aparecer botao)" -ForegroundColor White
Write-Host "4. Gere um NOVO token no Graph API Explorer" -ForegroundColor White
Write-Host "5. Execute este script novamente" -ForegroundColor White
Write-Host ""
Write-Host "OU pode ser problema temporario da Meta. Tente novamente em algumas horas." -ForegroundColor Yellow


