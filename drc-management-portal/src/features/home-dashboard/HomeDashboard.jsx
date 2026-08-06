import { useState } from 'react'
import MonthlyCalendar from '@/features/home-dashboard/components/Calendar/MonthlyCalendar'
import CreateSchedulePanel from '@/features/home-dashboard/components/CreateSchedulePanel'
import NotificationsPanel from '@/features/home-dashboard/components/NotificationsPanel'
import WidgetGrid from '@/features/home-dashboard/components/widgets/WidgetGrid'

export default function HomeDashboard() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const handleDateSelect = (dateKey) => {
    setSelectedDate(dateKey)
    setIsPanelOpen(true)
  }

  return (
    <section aria-label="Home Dashboard" className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your schedule, tasks, and notifications from one place.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <MonthlyCalendar onDateSelect={handleDateSelect} />
          <WidgetGrid />
        </div>

        <NotificationsPanel />
      </div>

      <CreateSchedulePanel
        open={isPanelOpen}
        selectedDate={selectedDate}
        onOpenChange={setIsPanelOpen}
      />
    </section>
  )
}
