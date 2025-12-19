'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Offer } from '@/types/database'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function FavoritasPage() {
  const [favorites, setFavorites] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    // Favoritos desabilitados sem autenticação
    setFavorites([])
    setLoading(false)
  }

  const removeFavorite = async (offerId: string) => {
    // Favoritos desabilitados sem autenticação
    alert('Favoritos desabilitados (sem autenticação)')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Ofertas Favoritas</h1>
          {loading ? (
            <div className="text-center py-12">Carregando...</div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhuma oferta favoritada ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((offer: Offer) => (
                <div key={offer.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{offer.niche_principal}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Sub-nicho: {offer.sub_nicho || 'N/A'}</p>
                        <p>País: {offer.country}</p>
                        <p>Preço: ${offer.price_usd || 'N/A'} USD</p>
                        <p>Score DR: {offer.dr_score}</p>
                        <a
                          href={offer.landing_page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {offer.landing_page_url}
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFavorite(offer.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

