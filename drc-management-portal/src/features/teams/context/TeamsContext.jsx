import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'
import { fetchTeams, createTeam, updateTeam as updateTeamApi } from '@/services/teamService'
import { showError, showSuccess } from '@/utils/toast'

const TeamsContext = createContext(null)

function mapTeam(t) {
  return {
    id: t.id,
    teamName: t.name,
    description: '',
    status: t.status,
    createdDate: t.created_date,
    totalMembers: t.total_members ?? 0,
  }
}

export function TeamsProvider({ children }) {
  const { addNotification } = useNotifications()
  const [teams, setTeams] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadTeams = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchTeams()
      setTeams(data.map(mapTeam))
    } catch {
      showError('Could not load teams.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  const addTeam = useCallback(async (data) => {
    if (!data.teamName?.trim()) {
      showError('Team name is required.')
      return null
    }
    try {
      const created = await createTeam({
        name: data.teamName.trim(),
        status: data.status ?? 'active',
        created_date: data.createdDate ?? new Date().toISOString().slice(0, 10),
      })
      await loadTeams()
      addNotification({ type: 'team', title: created.name, message: `Team "${created.name}" has been created.` })
      showSuccess('Team created successfully.')
      return mapTeam(created)
    } catch (error) {
      showError(error.response?.data?.detail || 'Could not create team.')
      return null
    }
  }, [addNotification, loadTeams])

  const updateTeam = useCallback(async (id, data) => {
    try {
      await updateTeamApi(id, {
        name: data.teamName?.trim(),
        status: data.status,
      })
      await loadTeams()
      showSuccess('Team updated successfully.')
    } catch {
      showError('Could not update team.')
    }
  }, [loadTeams])

  const getTeamById = useCallback(
    (id) => teams.find((t) => String(t.id) === String(id)),
    [teams],
  )

  const value = useMemo(
    () => ({ teams, isLoading, addTeam, updateTeam, getTeamById }),
    [teams, isLoading, addTeam, updateTeam, getTeamById],
  )

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>
}

export function useTeams() {
  const ctx = useContext(TeamsContext)
  if (!ctx) throw new Error('useTeams must be used within TeamsProvider')
  return ctx
}
