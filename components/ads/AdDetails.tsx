'use client'

import type { Ad } from '@/types/ad'
import { getNichoNome } from '@/lib/nichos'

interface AdDetailsProps {
  ad: Ad
  onClose: () => void
}

export default function AdDetails({ ad, onClose }: AdDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Detalhes do Anúncio</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Página</label>
              <p className="text-sm text-gray-900">{ad.page_name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
              <p className="text-sm text-gray-900 capitalize">{ad.platform}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
              <p className="text-sm text-gray-900">{ad.country}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID do Anúncio</label>
              <p className="text-sm text-gray-900 font-mono">{ad.ad_id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nicho</label>
              <p className="text-sm text-gray-900">
                {ad.niche ? (
                  <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                    {getNichoNome(ad.niche as any)}
                  </span>
                ) : '-'}
              </p>
            </div>
          </div>

          {/* Copy do Anúncio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{ad.ad_creative_link_title || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{ad.ad_creative_link_description || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Corpo do Anúncio</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">{ad.ad_creative_body || '-'}</p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impressões</label>
              <p className="text-sm text-gray-900">
                {ad.impressions_lower && ad.impressions_upper
                  ? `${new Intl.NumberFormat('pt-BR').format(ad.impressions_lower)} - ${new Intl.NumberFormat('pt-BR').format(ad.impressions_upper)}`
                  : '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gasto (USD)</label>
              <p className="text-sm text-gray-900">
                {ad.spend_lower && ad.spend_upper
                  ? `$${ad.spend_lower.toFixed(2)} - $${ad.spend_upper.toFixed(2)}`
                  : '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
              <p className="text-sm text-gray-900">
                {ad.ad_delivery_start_time
                  ? new Date(ad.ad_delivery_start_time).toLocaleString('pt-BR')
                  : '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coletado em</label>
              <p className="text-sm text-gray-900">
                {new Date(ad.created_at).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2">
            {ad.ad_snapshot_url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link da Biblioteca (Snapshot)</label>
                <a
                  href={ad.ad_snapshot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Abrir na Biblioteca da Meta
                </a>
                <p className="text-xs text-gray-500 mt-1 break-all">{ad.ad_snapshot_url}</p>
              </div>
            )}
            {ad.landing_page_url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Landing Page</label>
                <a
                  href={ad.landing_page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {ad.landing_page_url}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

