import UpcomingMeetingsWidget from '@/features/home-dashboard/components/widgets/UpcomingMeetingsWidget'
import PendingTasksWidget from '@/features/home-dashboard/components/widgets/PendingTasksWidget'
import TodaysScheduleWidget from '@/features/home-dashboard/components/widgets/TodaysScheduleWidget'
import ActivityOverviewWidget from '@/features/home-dashboard/components/widgets/ActivityOverviewWidget'
import { useAuth } from '@/store/AuthContext'

export default function WidgetGrid() {
  const { hasRole } = useAuth()
  const canSeeActivityOverview = hasRole('Admin') || hasRole('Sub Admin')

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <UpcomingMeetingsWidget />
      <PendingTasksWidget />
      <TodaysScheduleWidget />
      {canSeeActivityOverview && <ActivityOverviewWidget />}
    </div>
  )
}
