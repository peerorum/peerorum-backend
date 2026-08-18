import type { ReactNode } from 'react'
import Header from '../components/layout/Header'
import MyPageSidebar from '../components/layout/MyPageSidebar'
import Footer from '../components/layout/Footer'

export default function MyPageLayout({
  children,
  sidebarFooter,
}: {
  children: ReactNode
  sidebarFooter?: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <MyPageSidebar footer={sidebarFooter} />
        <main className="min-w-0 flex-1 px-6 py-8 md:px-10">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
