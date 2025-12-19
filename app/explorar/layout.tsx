import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function ExplorarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {children}
      </div>
    </div>
  )
}



