'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        if (error) throw error
        
        // Verificar se precisa confirmar email
        if (data.user && !data.session) {
          setError('Verifique seu email para confirmar a conta antes de fazer login!')
          return
        }
        
        // Se já tem sessão, fazer login automático
        if (data.session) {
          window.location.href = '/explorar'
          return
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) {
          console.error('Erro no login:', error)
          throw error
        }
        
        if (data.session && data.user) {
          console.log('✅ Login bem-sucedido:', data.user.email)
          console.log('✅ Session token:', data.session.access_token.substring(0, 20) + '...')
          
          // Forçar atualização da sessão no cliente
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          })
          
          // Verificar se a sessão foi salva
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
          
          if (sessionError) {
            console.error('❌ Erro ao verificar sessão:', sessionError)
          }
          
          if (sessionData.session) {
            console.log('✅ Sessão verificada: OK')
            console.log('✅ User ID:', sessionData.session.user.id)
          } else {
            console.warn('⚠️ Sessão não encontrada após login')
          }
          
          // Aguardar mais tempo para garantir que os cookies foram salvos
          console.log('⏳ Aguardando cookies serem salvos...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Verificar novamente antes de redirecionar
          const { data: finalSession } = await supabase.auth.getSession()
          if (!finalSession.session) {
            console.error('❌ Sessão perdida após espera!')
            setError('Erro ao salvar sessão. Tente novamente.')
            return
          }
          
          console.log('✅ Sessão ainda válida após espera')
          console.log('🔄 Redirecionando para /explorar...')
          console.log('📍 URL atual:', window.location.href)
          
          // Múltiplas tentativas de redirecionamento
          setTimeout(() => {
            console.log('🔄 Tentativa 1: window.location.href')
            window.location.href = '/explorar'
          }, 100)
          
          setTimeout(() => {
            if (window.location.pathname === '/login') {
              console.log('🔄 Tentativa 2: window.location.replace')
              window.location.replace('/explorar')
            }
          }, 500)
          
          setTimeout(() => {
            if (window.location.pathname === '/login') {
              console.log('🔄 Tentativa 3: router.push')
              router.push('/explorar')
              router.refresh()
            }
          }, 1000)
        } else {
          console.error('❌ Sessão não criada')
          throw new Error('Sessão não criada. Verifique suas credenciais ou se precisa confirmar o email.')
        }
      }
    } catch (error: any) {
      console.error('Erro completo:', error)
      setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            LATAM DR INTEL
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Carregando...' : isSignUp ? 'Criar Conta' : 'Entrar'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem conta? Criar conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

