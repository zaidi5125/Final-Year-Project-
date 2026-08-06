import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CalendarDay from '@/features/home-dashboard/components/Calendar/CalendarDay'
import { useCalendarNavigation } from '@/features/home-dashboard/hooks/useCalendarNavigation'
import {
  getCalendarDays,
  getMonthLabel,
  isToday,
  WEEKDAY_LABELS,
} from '@/features/home-dashboard/utils/calendar'
import { useMeetings } from '@/features/meetings/context/MeetingsContext'

export default function MeetingsCalendar({ onDateSelect }) {
  const { year, month, goToPreviousMonth, goToNextMonth, goToToday } =
    useCalendarNavigation()
  const { getMeetingsForDate } = useMeetings()

  const days = getCalendarDays(year, month)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Meetings Calendar</CardTitle>
        <div className="flex items-center gap-1">
          <Button type="button" variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <span className="min-w-[140px] text-center text-sm font-medium">
            {getMonthLabel(year, month)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {label}
            </div>
          ))}

          {days.map((day) => {
            const events = getMeetingsForDate(day.dateKey).map((meeting) => ({
              ...meeting,
              type: 'meeting',
            }))

            return (
              <CalendarDay
                key={day.dateKey}
                day={day}
                isCurrentMonth={day.isCurrentMonth}
                isToday={isToday(day.dateKey)}
                events={events}
                onSelect={onDateSelect}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
