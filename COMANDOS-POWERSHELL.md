# 🚀 Comandos PowerShell - Guia Rápido

## Opção 1: Usar o Script Automático (Recomendado)

Execute o script que criamos:

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
.\setup.ps1
```

## Opção 2: Comandos Manuais

### 1. Navegar para a pasta do projeto

```powershell
cd "C:\Users\Leonardo trentini\Desktop\spy"
```

### 2. Criar arquivo .env.local

```powershell
@"
NEXT_PUBLIC_SUPABASE_URL=https://xwsqbgjflzoimpmcqtso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MDM5NTIsImV4cCI6MjA4MDk3OTk1Mn0.hQnrCNZPAhpJmCR4QmklqbZ_WQy3faEVKvVwvg13h6Q
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQwMzk1MiwiZXhwIjoyMDgwOTc5OTUyfQ.48bq280hlAJLg5UWWeJwDuDVcXwVQCpUAqZWKbte7Vk
META_ADS_LIBRARY_ACCESS_TOKEN=EAAQx23HT1RcBQOoBqpIclXMXOZAkJltnbXYkjHVdv5zHk5wttdItzO9qC2lE85Pg9f1k8PBJ5bsakBUoaZBjgTZAZCPKUJjJUv959nu2c5Mi4K33j1yrlNXOfX1iUpOHld237ZBAZCnAwetnF1OZAhQHiPLpQdk05ZCvlthI3JwlQ1RpDzp7sir5N23hqULkpwU83Yfh4cehOlQzsraCtlHZCwfntxxj3QNRnxwqK3I8uhlwFresyb1ZCgAWetOdl87ZBd2cM3cklwTaxFTymsiLGIOcir7R1cpvwZDZD
"@ | Out-File -FilePath ".env.local" -Encoding utf8
```

### 3. Instalar dependências (se ainda não instalou)

```powershell
npm install
```

### 4. Executar o projeto

```powershell
npm run dev
```

## Comandos Úteis

### Testar coleta de anúncios (em outro terminal PowerShell)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/meta-ads" -Method POST -ContentType "application/json" -Body '{"country": "AR", "keywords": "infoproduto"}'
```

### Processar anúncios coletados

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/process/batch" -Method POST
```

## Sequência Completa (Copiar e Colar)

```powershell
# 1. Navegar
cd "C:\Users\Leonardo trentini\Desktop\spy"

# 2. Criar .env.local
@"
NEXT_PUBLIC_SUPABASE_URL=https://xwsqbgjflzoimpmcqtso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MDM5NTIsImV4cCI6MjA4MDk3OTk1Mn0.hQnrCNZPAhpJmCR4QmklqbZ_WQy3faEVKvVwvg13h6Q
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c3FiZ2pmbHpvaW1wbWNxdHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQwMzk1MiwiZXhwIjoyMDgwOTc5OTUyfQ.48bq280hlAJLg5UWWeJwDuDVcXwVQCpUAqZWKbte7Vk
META_ADS_LIBRARY_ACCESS_TOKEN=EAAQx23HT1RcBQOoBqpIclXMXOZAkJltnbXYkjHVdv5zHk5wttdItzO9qC2lE85Pg9f1k8PBJ5bsakBUoaZBjgTZAZCPKUJjJUv959nu2c5Mi4K33j1yrlNXOfX1iUpOHld237ZBAZCnAwetnF1OZAhQHiPLpQdk05ZCvlthI3JwlQ1RpDzp7sir5N23hqULkpwU83Yfh4cehOlQzsraCtlHZCwfntxxj3QNRnxwqK3I8uhlwFresyb1ZCgAWetOdl87ZBd2cM3cklwTaxFTymsiLGIOcir7R1cpvwZDZD
"@ | Out-File -FilePath ".env.local" -Encoding utf8

# 3. Instalar dependências
npm install

# 4. Executar
npm run dev
```



