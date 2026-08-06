import { useEffect, useState } from 'react'
import MainLayout from '@/layouts/MainLayout'
import AppProviders from '@/store/AppProviders'

const MOBILE_BREAKPOINT = 1024

function getIsMobile() {
  return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
}

export default function DashboardLayout() {
  const [isMobile, setIsMobile] = useState(getIsMobile)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = getIsMobile()
      setIsMobile(mobile)

      if (!mobile) {
        setIsMobileSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSidebarToggle = () => {
    if (isMobile) {
      setIsMobileSidebarOpen((previous) => !previous)
      return
    }

    setIsSidebarCollapsed((previous) => !previous)
  }

  return (
    <AppProviders>
      <MainLayout
        isSidebarOpen={isMobileSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
        onSidebarToggle={handleSidebarToggle}
      />
    </AppProviders>
  )
}
