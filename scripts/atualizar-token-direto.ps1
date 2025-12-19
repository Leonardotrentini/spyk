# Atualizar token diretamente
$token = "EAAQx23HT1RcBQOoBqpIclXMXOZAkJltnbXYkjHVdv5zHk5wttdItzO9qC2lE85Pg9f1k8PBJ5bsakBUoaZBjgTZAZCPKUJjJUv959nu2c5Mi4K33j1yrlNXOfX1iUpOHld237ZBAZCnAwetnF1OZAhQHiPLpQdk05ZCvlthI3JwlQ1RpDzp7sir5N23hqULkpwU83Yfh4cehOlQzsraCtlHZCwfntxxj3QNRnxwqK3I8uhlwFresyb1ZCgAWetOdl87ZBd2cM3cklwTaxFTymsiLGIOcir7R1cpvwZDZD"

if (Test-Path .env.local) {
    (Get-Content .env.local) -replace 'META_ADS_LIBRARY_ACCESS_TOKEN=.*', "META_ADS_LIBRARY_ACCESS_TOKEN=$token" | Set-Content .env.local
    Write-Host "Token atualizado no .env.local!" -ForegroundColor Green
} else {
    Write-Host "Arquivo .env.local nao encontrado. Criando..." -ForegroundColor Yellow
    @"
NEXT_PUBLIC_SUPABASE_URL=https://xwsqbgjflzoimpmcqtso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MDM5NTIsImV4cCI6MjA4MDk3OTk1Mn0.hQnrCNZPAhpJmCR4QmklqbZ_WQy3faEVKvVwvg13h6Q
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQwMzk1MiwiZXhwIjoyMDgwOTc5OTUyfQ.48bq280hlAJLg5UWWeJwDuDVcXwVQCpUAqZWKbte7Vk
META_ADS_LIBRARY_ACCESS_TOKEN=$token
"@ | Out-File -FilePath .env.local -Encoding utf8
    Write-Host "Arquivo .env.local criado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Proximo passo: Reinicie o servidor (Ctrl+C e depois npm run dev)" -ForegroundColor Yellow



