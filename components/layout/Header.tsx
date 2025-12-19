'use client'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">
          Inteligência Competitiva LATAM
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Última atualização: Hoje</span>
        </div>
      </div>
    </header>
  )
}



