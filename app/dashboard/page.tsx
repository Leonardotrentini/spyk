import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-600">Em desenvolvimento...</p>
        </div>
      </div>
    </div>
  )
}



