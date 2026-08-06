import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'
import { fetchResearches, createResearch, updateResearch as updateResearchApi } from '@/services/researchService'
import { showError, showSuccess } from '@/utils/toast'

const ResearchesContext = createContext(null)

function mapResearch(r) {
  return {
    id: r.id,
    title: r.title,
    purpose: r.purpose ?? '',
    topic: r.topic ?? '',
    researchDocument: r.research_document ?? null,
    startDate: r.start_date,
    endDate: r.end_date,
    status: r.status,
    description: r.description ?? '',
    researchers: r.researchers ?? [],
    beneficiaries: r.beneficiaries ?? [],
    files: [],
    activities: [],
  }
}

export function ResearchesProvider({ children }) {
  const { addNotification } = useNotifications()
  const [researches, setResearches] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadResearches = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchResearches()
      setResearches(data.map(mapResearch))
    } catch {
      showError('Could not load researches.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadResearches()
  }, [loadResearches])

  const addResearch = useCallback(async (data) => {
    if (!data.title || !data.title.trim()) {
      showError('Research title is required.')
      return null
    }
    try {
      const created = await createResearch({
        title: data.title.trim(),
        purpose: data.purpose || data.topic || '',
        topic: data.topic || '',
        start_date: data.startDate || null,
        end_date: data.endDate || null,
        status: data.status || 'ongoing',
        description: data.description || '',
      })
      await loadResearches()
      addNotification({
        type: 'research',
        title: created.title,
        message: 'Research "' + created.title + '" has been created.',
      })
      showSuccess('Research created successfully.')
      return mapResearch(created)
    } catch (error) {
      showError('Could not create research.')
      return null
    }
  }, [addNotification, loadResearches])

  const updateResearch = useCallback(async (id, data) => {
    try {
      await updateResearchApi(id, {
        title: data.title,
        purpose: data.purpose || data.topic,
        topic: data.topic,
        start_date: data.startDate,
        end_date: data.endDate,
        status: data.status,
        description: data.description,
      })
      await loadResearches()
      showSuccess('Research updated successfully.')
    } catch {
      showError('Could not update research.')
    }
  }, [loadResearches])

  const addResearchFiles = useCallback(() => {
    showError('File attachments are not supported yet.')
  }, [])

  const getResearchById = useCallback(
    (id) => researches.find(function (r) { return String(r.id) === String(id) }),
    [researches],
  )

  const value = useMemo(
    function () {
      return { researches: researches, isLoading: isLoading, addResearch: addResearch, updateResearch: updateResearch, addResearchFiles: addResearchFiles, getResearchById: getResearchById }
    },
    [researches, isLoading, addResearch, updateResearch, addResearchFiles, getResearchById],
  )

  return <ResearchesContext.Provider value={value}>{children}</ResearchesContext.Provider>
}

export function useResearches() {
  const ctx = useContext(ResearchesContext)
  if (!ctx) throw new Error('useResearches must be used within ResearchesProvider')
  return ctx
}



