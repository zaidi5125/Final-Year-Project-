import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'
import { fetchMeetings, createMeeting, updateMeeting as updateMeetingApi } from '@/services/meetingService'
import { formatDateLong, formatTimeLabel } from '@/utils/formatDate'
import { showError, showSuccess } from '@/utils/toast'

const MeetingsContext = createContext(null)

function mapMeeting(m) {
  return {
    id: m.id,
    title: m.title,
    purpose: m.purpose ?? '',
    venue: m.venue ?? '',
    duration: m.duration,
    startTime: m.start_time,
    endTime: m.end_time,
    date: m.meeting_date,
    meetingDate: m.meeting_date,
    reminder: m.reminder,
    description: m.description ?? '',
    result: m.result ?? '',
    status: m.status,
    internalParticipants: m.internal_members ?? [],
    externalParticipants: m.external_members ?? [],
  }
}

export function MeetingsProvider({ children }) {
  const { addNotification } = useNotifications()
  const [meetings, setMeetings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadMeetings = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchMeetings()
      setMeetings(data.map(mapMeeting))
    } catch {
      showError('Could not load meetings.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMeetings()
  }, [loadMeetings])

  const addMeeting = useCallback(async (data) => {
    if (!data.title?.trim()) {
      showError('Meeting title is required.')
      return null
    }
    try {
      const created = await createMeeting({
        title: data.title.trim(),
        purpose: data.purpose ?? '',
        venue: data.venue ?? '',
        duration: data.duration || null,
        start_time: data.startTime || null,
        end_time: data.endTime || null,
        meeting_date: data.date ?? data.meetingDate,
        reminder: data.reminder || null,
        description: data.description ?? '',
        result: data.result ?? '',
        status: data.status ?? 'scheduled',
      })
      await loadMeetings()
      addNotification({
        type: 'meeting',
        title: created.title,
        message: `Meeting "${created.title}" scheduled for ${formatDateLong(created.meeting_date)}${created.start_time ? ` at ${formatTimeLabel(created.start_time)}` : ''}`,
      })
      showSuccess('Meeting created successfully.')
      return mapMeeting(created)
    } catch (error) {
      showError(error.response?.data?.detail || 'Could not create meeting.')
      return null
    }
  }, [addNotification, loadMeetings])

  const updateMeeting = useCallback(async (id, data) => {
    try {
      await updateMeetingApi(id, {
        title: data.title?.trim(),
        purpose: data.purpose,
        venue: data.venue,
        duration: data.duration || null,
        start_time: data.startTime || null,
        end_time: data.endTime || null,
        meeting_date: data.date ?? data.meetingDate,
        reminder: data.reminder || null,
        description: data.description,
        result: data.result,
        status: data.status,
      })
      await loadMeetings()
      showSuccess('Meeting updated successfully.')
    } catch {
      showError('Could not update meeting.')
    }
  }, [loadMeetings])

  const getMeetingById = useCallback(
    (id) => meetings.find((m) => String(m.id) === String(id)),
    [meetings],
  )

  const getMeetingsForDate = useCallback(
    (dateKey) => meetings.filter((m) => m.date === dateKey),
    [meetings],
  )

  const value = useMemo(
    () => ({ meetings, isLoading, addMeeting, updateMeeting, getMeetingById, getMeetingsForDate }),
    [meetings, isLoading, addMeeting, updateMeeting, getMeetingById, getMeetingsForDate],
  )

  return <MeetingsContext.Provider value={value}>{children}</MeetingsContext.Provider>
}

export function useMeetings() {
  const ctx = useContext(MeetingsContext)
  if (!ctx) throw new Error('useMeetings must be used within MeetingsProvider')
  return ctx
}
