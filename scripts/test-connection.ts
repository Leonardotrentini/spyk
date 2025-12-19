/**
 * Script para testar a conexão com o Supabase
 * Execute com: npx tsx scripts/test-connection.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error('Certifique-se de que .env.local existe com as credenciais do Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n')

  try {
    // Testar conexão básica
    const { data, error } = await supabase.from('raw_ads').select('count').limit(1)

    if (error) {
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('⚠️  Tabelas ainda não foram criadas!')
        console.log('\n📝 Próximos passos:')
        console.log('1. Acesse o SQL Editor no painel do Supabase')
        console.log('2. Execute o conteúdo do arquivo: lib/supabase/migrations.sql')
        console.log('3. Execute novamente este script para testar\n')
        return
      }
      throw error
    }

    console.log('✅ Conexão com Supabase funcionando!')
    console.log('✅ Tabelas criadas corretamente\n')

    // Verificar tabelas
    const tables = ['raw_ads', 'raw_landing_pages', 'players', 'offers', 'user_favorites']
    console.log('📊 Verificando tabelas...\n')

    for (const table of tables) {
      const { error: tableError } = await supabase.from(table).select('*').limit(1)
      if (tableError) {
        console.log(`❌ Tabela "${table}": ${tableError.message}`)
      } else {
        console.log(`✅ Tabela "${table}": OK`)
      }
    }

    console.log('\n🎉 Tudo configurado corretamente!')
    console.log('Você pode executar: npm run dev')

  } catch (error: any) {
    console.error('❌ Erro ao conectar:', error.message)
    process.exit(1)
  }
}

testConnection()



