import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared'
import { useCalendarItems } from '@/features/home-dashboard/hooks/useCalendarItems'

export default function ActivityOverviewWidget() {
  const { scheduleItems } = useCalendarItems()
  const meetingCount = scheduleItems.filter((item) => item.type === 'meeting').length
  const taskCount = scheduleItems.filter((item) => item.type === 'task').length
  const hasActivity = scheduleItems.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!hasActivity ? (
          <EmptyState
            icon={Activity}
            title="No activity yet"
            description="Your schedule activity summary will appear once you add items."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
              <p className="text-2xl font-semibold text-primary">{meetingCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">Meetings</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
              <p className="text-2xl font-semibold text-foreground">{taskCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">Tasks</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
