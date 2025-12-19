# Script PowerShell para configurar e executar o projeto

# Navegar para a pasta do projeto
cd "C:\Users\Leonardo trentini\Desktop\spy"

Write-Host "📁 Pasta do projeto: $(Get-Location)" -ForegroundColor Green

# Criar arquivo .env.local
$envContent = @"
NEXT_PUBLIC_SUPABASE_URL=https://xwsqbgjflzoimpmcqtso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MDM5NTIsImV4cCI6MjA4MDk3OTk1Mn0.hQnrCNZPAhpJmCR4QmklqbZ_WQy3faEVKvVwvg13h6Q
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQwMzk1MiwiZXhwIjoyMDgwOTc5OTUyfQ.48bq280hlAJLg5UWWeJwDuDVcXwVQCpUAqZWKbte7Vk
META_ADS_LIBRARY_ACCESS_TOKEN=EAAQx23HT1RcBQOoBqpIclXMXOZAkJltnbXYkjHVdv5zHk5wttdItzO9qC2lE85Pg9f1k8PBJ5bsakBUoaZBjgTZAZCPKUJjJUv959nu2c5Mi4K33j1yrlNXOfX1iUpOHld237ZBAZCnAwetnF1OZAhQHiPLpQdk05ZCvlthI3JwlQ1RpDzp7sir5N23hqULkpwU83Yfh4cehOlQzsraCtlHZCwfntxxj3QNRnxwqK3I8uhlwFresyb1ZCgAWetOdl87ZBd2cM3cklwTaxFTymsiLGIOcir7R1cpvwZDZD
"@

# Verificar se .env.local já existe
if (Test-Path ".env.local") {
    Write-Host "⚠️  Arquivo .env.local já existe. Deseja sobrescrever? (S/N)" -ForegroundColor Yellow
    $resposta = Read-Host
    if ($resposta -eq "S" -or $resposta -eq "s") {
        $envContent | Out-File -FilePath ".env.local" -Encoding utf8
        Write-Host "✅ Arquivo .env.local atualizado!" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Arquivo .env.local mantido como está." -ForegroundColor Cyan
    }
} else {
    $envContent | Out-File -FilePath ".env.local" -Encoding utf8
    Write-Host "✅ Arquivo .env.local criado!" -ForegroundColor Green
}

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "✅ Dependências já instaladas" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Iniciando o servidor de desenvolvimento..." -ForegroundColor Cyan
Write-Host "📝 Acesse: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""

# Executar o servidor
npm run dev



