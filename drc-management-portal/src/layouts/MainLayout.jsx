import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import TopNavbar from '@/components/layout/TopNavbar'
import { cn } from '@/utils/cn'

const SIDEBAR_WIDTH = 256

export default function MainLayout({
  isSidebarOpen,
  isSidebarCollapsed,
  isMobile,
  onSidebarToggle,
}) {
  const showSidebar = isMobile ? isSidebarOpen : !isSidebarCollapsed
  const contentOffset = !isMobile && !isSidebarCollapsed ? SIDEBAR_WIDTH : 0

  return (
    <div className="h-screen overflow-hidden bg-content">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out',
          showSidebar ? 'translate-x-0' : '-translate-x-full',
          !isMobile && isSidebarCollapsed && 'lg:-translate-x-full',
        )}
        style={{ width: SIDEBAR_WIDTH }}
        aria-hidden={!showSidebar}
      >
        <Sidebar className="h-full shadow-soft-lg" />
      </aside>

      {isMobile && isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={onSidebarToggle}
          aria-label="Close sidebar overlay"
        />
      )}

      <div
        className="flex h-screen flex-col transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: contentOffset }}
      >
        <TopNavbar
          onMenuToggle={onSidebarToggle}
          isSidebarCollapsed={isSidebarCollapsed}
          isMobile={isMobile}
          className="sticky top-0 z-20"
        />

        <main className="flex-1 overflow-y-auto bg-content p-4 lg:p-6">
          <div className="mx-auto max-w-screen-2xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
