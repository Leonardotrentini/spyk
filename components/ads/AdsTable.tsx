'use client'

import { useState, useEffect } from 'react'
import type { Ad, AdFilters } from '@/types/ad'
import AdFiltersComponent from './AdFilters'
import AdDetails from './AdDetails'
import { getNichoNome } from '@/lib/nichos'

export default function AdsTable() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pagesStats, setPagesStats] = useState<{ 
    page_name: string
    total_ads: number
    total_spend_lower?: number
    total_spend_upper?: number
  }[]>([])
  const [filters, setFilters] = useState<AdFilters>({
    limit: 50,
    offset: 0,
    order_by: 'created_at',
    order_dir: 'desc'
  })
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadAds()
    loadPagesStats()
  }, [filters])

  const loadPagesStats = async () => {
    try {
      const response = await fetch('/api/ads/pages')
      const data = await response.json()
      if (data.data) {
        setPagesStats(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas de páginas:', error)
    }
  }

  const loadAds = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (filters.country) params.append('country', filters.country.join(','))
      if (filters.platform) params.append('platform', filters.platform.join(','))
      if (filters.niche) params.append('niche', filters.niche.join(','))
      if (filters.page_name) params.append('page_name', filters.page_name)
      if (filters.search_text) params.append('search_text', filters.search_text)
      if (filters.min_ads_per_page) params.append('min_ads_per_page', filters.min_ads_per_page.toString())
      if (filters.likes_min) params.append('likes_min', filters.likes_min.toString())
      if (filters.likes_max) params.append('likes_max', filters.likes_max.toString())
      if (filters.spend_min) params.append('spend_min', filters.spend_min.toString())
      if (filters.spend_max) params.append('spend_max', filters.spend_max.toString())
      if (filters.date_from) params.append('date_from', filters.date_from)
      if (filters.date_to) params.append('date_to', filters.date_to)
      
      params.append('limit', (filters.limit || 50).toString())
      params.append('offset', (filters.offset || 0).toString())
      params.append('order_by', filters.order_by || 'created_at')
      params.append('order_dir', filters.order_dir || 'desc')

      const response = await fetch(`/api/ads/list?${params.toString()}`)
      const data = await response.json()

      if (data.error) {
        console.error('Erro:', data.error)
        return
      }

      setAds(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (column: string) => {
    const newDir = filters.order_by === column && filters.order_dir === 'desc' ? 'asc' : 'desc'
    setFilters({
      ...filters,
      order_by: column,
      order_dir: newDir,
      offset: 0
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    const limit = filters.limit || 50
    setFilters({
      ...filters,
      offset: (page - 1) * limit
    })
    setCurrentPage(page)
  }

  const totalPages = Math.ceil(total / (filters.limit || 50))

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(ads.map(ad => ad.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return

    if (!confirm(`Tem certeza que deseja deletar ${selectedIds.size} anúncio(s)?`)) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch('/api/ads/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      })

      const data = await response.json()

      if (data.error) {
        alert(`Erro: ${data.error}`)
        return
      }

      alert(data.message || 'Anúncios deletados com sucesso!')
      setSelectedIds(new Set())
      loadAds()
      loadPagesStats()
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('Erro ao deletar anúncios')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Tem certeza que deseja deletar TODOS os anúncios? Esta ação não pode ser desfeita!')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch('/api/ads/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteAll: true })
      })

      const data = await response.json()

      if (data.error) {
        alert(`Erro: ${data.error}`)
        return
      }

      alert(data.message || 'Todos os anúncios foram deletados!')
      setSelectedIds(new Set())
      loadAds()
      loadPagesStats()
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('Erro ao deletar anúncios')
    } finally {
      setDeleting(false)
    }
  }

  const allSelected = ads.length > 0 && selectedIds.size === ads.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < ads.length

  const formatNumber = (num: number | null) => {
    if (!num) return '-'
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-BR')
  }

  // Agrupar anúncios por página para mostrar contador
  const adsByPage = ads.reduce((acc, ad) => {
    const pageName = ad.page_name || 'Sem nome'
    if (!acc[pageName]) {
      acc[pageName] = 0
    }
    acc[pageName]++
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-4">
      {/* Contador de Anúncios Ativos por Página */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Anúncios Ativos por Página</h3>
            <p className="text-sm text-gray-600">Páginas com mais anúncios escalados</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{pagesStats.length}</div>
            <div className="text-sm text-gray-500">páginas ativas</div>
          </div>
        </div>
        
        {/* Top Páginas */}
        {pagesStats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pagesStats.slice(0, 6).map((page, idx) => {
              const formatNumber = (num: number) => {
                if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
                if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`
                return `$${num.toFixed(0)}`
              }
              
              const hasSpend = page.total_spend_lower !== undefined && page.total_spend_lower > 0
              
              return (
              <div 
                key={idx} 
                className="border border-gray-200 rounded p-3 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all"
                onClick={() => {
                  setFilters({
                    ...filters,
                    page_name: page.page_name,
                    offset: 0
                  })
                  setCurrentPage(1)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate" title={page.page_name}>
                      {page.page_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Clique para filtrar</p>
                  </div>
                  <div className="ml-2 text-right">
                    <div className="text-lg font-bold text-blue-600">{page.total_ads}</div>
                    <div className="text-xs text-gray-500">anúncios</div>
                    {hasSpend && page.total_spend_upper && (
                      <div className="mt-1 pt-1 border-t border-gray-200">
                        <div className="text-xs font-semibold text-green-600">
                          {formatNumber(page.total_spend_lower!)} - {formatNumber(page.total_spend_upper)}
                        </div>
                        <div className="text-xs text-gray-400">gasto total</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
        
        {/* Total Geral */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total de anúncios coletados</span>
            <span className="text-lg font-semibold text-gray-900">{total}</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <AdFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() => {
          setFilters({ limit: 50, offset: 0, order_by: 'created_at', order_dir: 'desc' })
          setCurrentPage(1)
        }}
      />

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Barra de ações */}
        {(selectedIds.size > 0 || total > 0) && (
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedIds.size > 0 && (
                <span className="text-sm text-gray-700">
                  {selectedIds.size} anúncio(s) selecionado(s)
                </span>
              )}
              {selectedIds.size > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {deleting ? 'Deletando...' : `Deletar Selecionados (${selectedIds.size})`}
                </button>
              )}
            </div>
            <button
              onClick={handleDeleteAll}
              disabled={deleting || total === 0}
              className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {deleting ? 'Deletando...' : 'Deletar Todos'}
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('page_name')}
                >
                  Página {filters.order_by === 'page_name' && (filters.order_dir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('ad_creative_link_title')}
                >
                  Título {filters.order_by === 'ad_creative_link_title' && (filters.order_dir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Copy
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('platform')}
                >
                  Plataforma {filters.order_by === 'platform' && (filters.order_dir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('niche')}
                >
                  Nicho {filters.order_by === 'niche' && (filters.order_dir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('impressions_lower')}
                >
                  Impressões {filters.order_by === 'impressions_lower' && (filters.order_dir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('spend_lower')}
                >
                  Gasto (USD) {filters.order_by === 'spend_lower' && (filters.order_dir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('ad_delivery_start_time')}
                >
                  Início {filters.order_by === 'ad_delivery_start_time' && (filters.order_dir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : ads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    Nenhum anúncio encontrado
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(ad.id)}
                        onChange={(e) => handleSelectOne(ad.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {ad.page_name || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      {ad.ad_creative_link_title || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">
                      {ad.ad_creative_body ? (
                        <span title={ad.ad_creative_body}>
                          {ad.ad_creative_body.substring(0, 100)}...
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        ad.platform === 'instagram' 
                          ? 'bg-pink-100 text-pink-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ad.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {ad.niche ? (
                        <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                          {getNichoNome(ad.niche as any)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {ad.impressions_lower && ad.impressions_upper ? (
                        <span>{formatNumber(ad.impressions_lower)} - {formatNumber(ad.impressions_upper)}</span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {ad.spend_lower && ad.spend_upper ? (
                        <div>
                          <span className="font-medium">${formatNumber(ad.spend_lower)} - ${formatNumber(ad.spend_upper)}</span>
                          <span className="text-xs text-gray-500 block">estimado</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(ad.ad_delivery_start_time)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => setSelectedAd(ad)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Mostrando {((currentPage - 1) * (filters.limit || 50)) + 1} a {Math.min(currentPage * (filters.limit || 50), total)} de {total} anúncios
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedAd && (
        <AdDetails ad={selectedAd} onClose={() => setSelectedAd(null)} />
      )}
    </div>
  )
}

