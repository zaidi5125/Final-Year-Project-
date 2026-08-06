import { cn } from '@/utils/cn'

export default function CalendarDay({
  day,
  isCurrentMonth,
  isToday,
  events,
  onSelect,
}) {
  const hasEvents = events.length > 0

  return (
    <button
      type="button"
      onClick={() => onSelect(day.dateKey)}
      className={cn(
        'group relative flex min-h-[72px] flex-col items-start rounded-lg border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isCurrentMonth
          ? 'border-transparent bg-background hover:border-border hover:bg-muted/40'
          : 'border-transparent bg-muted/20 text-muted-foreground hover:bg-muted/40',
        isToday && 'border-primary/30 bg-accent/50 ring-1 ring-primary/20',
      )}
      aria-label={`${day.day}${isToday ? ', today' : ''}${hasEvents ? `, ${events.length} item${events.length > 1 ? 's' : ''}` : ''}`}
    >
      <span
        className={cn(
          'inline-flex size-7 items-center justify-center rounded-full text-sm font-medium',
          isToday
            ? 'bg-primary text-primary-foreground'
            : isCurrentMonth
              ? 'text-foreground'
              : 'text-muted-foreground',
        )}
      >
        {day.day}
      </span>

      {hasEvents && (
        <ul className="mt-1 flex w-full flex-col gap-0.5">
          {events.slice(0, 2).map((event) => (
            <li
              key={event.id}
              className={cn(
                'truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight',
                event.type === 'meeting'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-secondary text-secondary-foreground',
              )}
            >
              {event.title}
            </li>
          ))}
          {events.length > 2 && (
            <li className="px-1 text-[10px] text-muted-foreground">
              +{events.length - 2} more
            </li>
          )}
        </ul>
      )}
    </button>
  )
}
