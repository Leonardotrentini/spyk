'use client'

import AdsTable from '@/components/ads/AdsTable'

export default function ExplorarPage() {
  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Anúncios Coletados</h1>
        <p className="text-gray-600">Ferramenta de SPY - Anúncios Escalados de Tráfego Direto</p>
      </div>
      <AdsTable />
    </div>
  )
}
