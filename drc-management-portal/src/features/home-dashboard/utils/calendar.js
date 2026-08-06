const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function formatDateKey(year, month, day) {
  const paddedMonth = String(month + 1).padStart(2, '0')
  const paddedDay = String(day).padStart(2, '0')
  return `${year}-${paddedMonth}-${paddedDay}`
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return { year, month: month - 1, day }
}

export function getMonthLabel(year, month) {
  return `${MONTH_LABELS[month]} ${year}`
}

export function getCalendarDays(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days = []

  for (let i = firstDayOfWeek - 1; i >= 0; i -= 1) {
    const day = daysInPrevMonth - i
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    days.push({
      day,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      dateKey: formatDateKey(prevYear, prevMonth, day),
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      day,
      month,
      year,
      isCurrentMonth: true,
      dateKey: formatDateKey(year, month, day),
    })
  }

  const trailingDays = 42 - days.length
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year

  for (let day = 1; day <= trailingDays; day += 1) {
    days.push({
      day,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      dateKey: formatDateKey(nextYear, nextMonth, day),
    })
  }

  return days
}

export function isToday(dateKey) {
  const today = new Date()
  return dateKey === formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())
}

export function formatDisplayDate(dateKey) {
  const { year, month, day } = parseDateKey(dateKey)
  const date = new Date(year, month, day)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTimeLabel(time) {
  if (!time) return ''
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`
}

export { WEEKDAY_LABELS, MONTH_LABELS }
