'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    // Logout desabilitado - sem autenticação
    alert('Autenticação desabilitada para uso interno')
  }

  const navItems = [
    { href: '/explorar', label: 'Explorar', icon: '🔍' },
    { href: '/favoritas', label: 'Favoritas', icon: '⭐' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  ]

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">LATAM DR INTEL</h1>
        <p className="text-sm text-gray-400 mt-1">Inteligência Competitiva</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-400 text-center">
          Modo: Uso Interno
        </div>
      </div>
    </aside>
  )
}

