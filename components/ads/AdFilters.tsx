'use client'

import { useState } from 'react'
import type { AdFilters } from '@/types/ad'

interface AdFiltersProps {
  filters: AdFilters
  onFiltersChange: (filters: AdFilters) => void
  onReset: () => void
}

export default function AdFiltersComponent({ filters, onFiltersChange, onReset }: AdFiltersProps) {
  const [localFilters, setLocalFilters] = useState<AdFilters>(filters)

  const handleApply = () => {
    onFiltersChange({ ...localFilters, offset: 0 })
  }

  const handleChange = (key: keyof AdFilters, value: any) => {
    setLocalFilters({ ...localFilters, [key]: value })
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* País - Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            País
          </label>
          <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
            {[
              { value: 'AR', label: 'Argentina' },
              { value: 'BR', label: 'Brasil' },
              { value: 'MX', label: 'México' },
              { value: 'CO', label: 'Colômbia' },
              { value: 'CL', label: 'Chile' },
              { value: 'PE', label: 'Peru' },
              { value: 'EC', label: 'Equador' },
              { value: 'UY', label: 'Uruguai' },
            ].map((country) => (
              <label key={country.value} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={localFilters.country?.includes(country.value) || false}
                  onChange={(e) => {
                    const countries = localFilters.country || []
                    if (e.target.checked) {
                      handleChange('country', [...countries, country.value])
                    } else {
                      handleChange('country', countries.filter(c => c !== country.value))
                    }
                  }}
                  className="mr-2"
                />
                {country.label}
              </label>
            ))}
          </div>
        </div>

        {/* Plataforma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plataforma
          </label>
          <div className="space-y-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.platform?.includes('facebook') || false}
                onChange={(e) => {
                  const platforms = localFilters.platform || []
                  if (e.target.checked) {
                    handleChange('platform', [...platforms, 'facebook'])
                  } else {
                    handleChange('platform', platforms.filter(p => p !== 'facebook'))
                  }
                }}
                className="mr-2"
              />
              Facebook
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.platform?.includes('instagram') || false}
                onChange={(e) => {
                  const platforms = localFilters.platform || []
                  if (e.target.checked) {
                    handleChange('platform', [...platforms, 'instagram'])
                  } else {
                    handleChange('platform', platforms.filter(p => p !== 'instagram'))
                  }
                }}
                className="mr-2"
              />
              Instagram
            </label>
          </div>
        </div>

        {/* Nicho */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nicho
          </label>
          <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
            {[
              { value: 'financas', label: '💰 Finanças' },
              { value: 'saude', label: '💪 Saúde e Bem-estar' },
              { value: 'relacionamento', label: '❤️ Relacionamento' },
              { value: 'marketing', label: '📈 Marketing e Vendas' },
              { value: 'educacao', label: '📚 Educação' },
              { value: 'desenvolvimento-pessoal', label: '🚀 Desenvolvimento Pessoal' },
              { value: 'tecnologia', label: '💻 Tecnologia' },
              { value: 'beleza', label: '✨ Beleza e Estética' },
              { value: 'imoveis', label: '🏠 Imóveis' },
              { value: 'outros', label: '📦 Outros' },
            ].map((niche) => (
              <label key={niche.value} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={localFilters.niche?.includes(niche.value) || false}
                  onChange={(e) => {
                    const niches = localFilters.niche || []
                    if (e.target.checked) {
                      handleChange('niche', [...niches, niche.value])
                    } else {
                      handleChange('niche', niches.filter(n => n !== niche.value))
                    }
                  }}
                  className="mr-2"
                />
                {niche.label}
              </label>
            ))}
          </div>
        </div>

        {/* Busca por texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar no Copy
          </label>
          <input
            type="text"
            value={localFilters.search_text || ''}
            onChange={(e) => handleChange('search_text', e.target.value || undefined)}
            placeholder="Palavra-chave..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Nome da página */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Página
          </label>
          <input
            type="text"
            value={localFilters.page_name || ''}
            onChange={(e) => handleChange('page_name', e.target.value || undefined)}
            placeholder="Nome da página..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Curtidas Mín */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Curtidas Mín
          </label>
          <input
            type="number"
            value={localFilters.likes_min || ''}
            onChange={(e) => handleChange('likes_min', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Curtidas Máx */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Curtidas Máx
          </label>
          <input
            type="number"
            value={localFilters.likes_max || ''}
            onChange={(e) => handleChange('likes_max', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Sem limite"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Mínimo de Anúncios por Página */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mín. Anúncios por Página
          </label>
          <input
            type="number"
            min="1"
            value={localFilters.min_ads_per_page || ''}
            onChange={(e) => handleChange('min_ads_per_page', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ex: 5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Mostrar só páginas com X+ anúncios</p>
        </div>

        {/* Gasto Mín */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gasto Mín (USD)
          </label>
          <input
            type="number"
            step="0.01"
            value={localFilters.spend_min || ''}
            onChange={(e) => handleChange('spend_min', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Filtra por gasto mínimo estimado</p>
        </div>

        {/* Gasto Máx */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gasto Máx (USD)
          </label>
          <input
            type="number"
            step="0.01"
            value={localFilters.spend_max || ''}
            onChange={(e) => handleChange('spend_max', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="Sem limite"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Filtra por gasto máximo estimado</p>
        </div>

        {/* Data Início */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Início (De)
          </label>
          <input
            type="date"
            value={localFilters.date_from || ''}
            onChange={(e) => handleChange('date_from', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Data Fim */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Início (Até)
          </label>
          <input
            type="date"
            value={localFilters.date_to || ''}
            onChange={(e) => handleChange('date_to', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  )
}

