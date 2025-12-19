import { redirect } from 'next/navigation'

export default function LoginPage() {
  // Redirecionar direto para explorar (sem login)
  redirect('/explorar')
}

