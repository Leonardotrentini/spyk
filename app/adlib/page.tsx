'use client'

import dynamic from 'next/dynamic'

// Importar o App.tsx que está na raiz
// Usando dynamic import para evitar problemas com SSR
const AdLibMonitorApp = dynamic(() => import('../../App'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Carregando AdLib Monitor...</p>
      </div>
    </div>
  )
})

export default function AdLibPage() {
  return <AdLibMonitorApp />
}

