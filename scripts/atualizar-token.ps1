# Script para atualizar token no .env.local
# Uso: .\scripts\atualizar-token.ps1

Write-Host "Atualizar Token da Meta no .env.local" -ForegroundColor Cyan
Write-Host ""

$NEW_TOKEN = Read-Host "Cole o token estendido aqui"

if ([string]::IsNullOrWhiteSpace($NEW_TOKEN)) {
    Write-Host "Token vazio! Operacao cancelada." -ForegroundColor Red
    exit
}

$envFile = ".env.local"

# Verificar se arquivo existe
if (-not (Test-Path $envFile)) {
    Write-Host "Arquivo .env.local nao encontrado. Criando..." -ForegroundColor Yellow
    
    # Criar arquivo com todas as variaveis
    @"
NEXT_PUBLIC_SUPABASE_URL=https://xwsqbgjflzoimpmcqtso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MDM5NTIsImV4cCI6MjA4MDk3OTk1Mn0.hQnrCNZPAhpJmCR4QmklqbZ_WQy3faEVKvVwvg13h6Q
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQwMzk1MiwiZXhwIjoyMDgwOTc5OTUyfQ.48bq280hlAJLg5UWWeJwDuDVcXwVQCpUAqZWKbte7Vk
META_ADS_LIBRARY_ACCESS_TOKEN=$NEW_TOKEN
"@ | Out-File -FilePath $envFile -Encoding utf8
    
    Write-Host "Arquivo .env.local criado com sucesso!" -ForegroundColor Green
} else {
    # Ler arquivo atual
    $content = Get-Content $envFile -Raw
    
    # Verificar se linha META_ADS_LIBRARY_ACCESS_TOKEN existe
    if ($content -match "META_ADS_LIBRARY_ACCESS_TOKEN=") {
        # Substituir token existente
        $content = $content -replace "META_ADS_LIBRARY_ACCESS_TOKEN=.*", "META_ADS_LIBRARY_ACCESS_TOKEN=$NEW_TOKEN"
        Write-Host "Token atualizado no arquivo existente!" -ForegroundColor Green
    } else {
        # Adicionar nova linha
        $content += "`nMETA_ADS_LIBRARY_ACCESS_TOKEN=$NEW_TOKEN"
        Write-Host "Token adicionado ao arquivo!" -ForegroundColor Green
    }
    
    # Salvar arquivo
    $content | Out-File -FilePath $envFile -Encoding utf8 -NoNewline
}

Write-Host ""
Write-Host "Token atualizado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximo passo: Reinicie o servidor (Ctrl+C e depois npm run dev)" -ForegroundColor Yellow



