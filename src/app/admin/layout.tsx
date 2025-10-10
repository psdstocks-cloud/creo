import { AdminNavigation } from '@/components/admin/AdminNavigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <div className="lg:pl-64">
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
