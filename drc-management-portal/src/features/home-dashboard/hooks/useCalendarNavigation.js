import { useState } from 'react'

export function useCalendarNavigation(initialDate = new Date()) {
  const [viewDate, setViewDate] = useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  )

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const goToPreviousMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  return {
    year,
    month,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  }
}
