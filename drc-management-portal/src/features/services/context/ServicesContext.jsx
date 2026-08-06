import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'
import { fetchCases, createCase, updateCase as updateCaseApi } from '@/services/caseService'
import { showError, showSuccess } from '@/utils/toast'

const ServicesContext = createContext(null)

function mapCase(c) {
  return {
    id: c.id,
    title: c.title,
    caseId: c.case_id,
    caseNumber: c.case_id,
    courtCaseId: c.court_case_id,
    caseType: c.case_type,
    court: c.court,
    paymentStatus: c.payment_status,
    status: c.status,
    startDate: c.start_date,
    openedDate: c.start_date,
    endDate: c.end_date,
    result: c.result,
    description: c.description,
    documents: [],
    hearings: [],
    createdByName: c.created_by_name,
  }
}

export function ServicesProvider({ children }) {
  const { addNotification } = useNotifications()
  const [cases, setCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadCases = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchCases()
      setCases(data.map(mapCase))
    } catch {
      showError('Could not load cases.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCases()
  }, [loadCases])

  const addCase = useCallback(async (data) => {
    if (!data.title?.trim()) {
      showError('Case title is required.')
      return null
    }
    try {
      const created = await createCase({
        title: data.title.trim(),
        case_id: data.caseId || data.caseNumber || '',
        court_case_id: data.courtCaseId || '',
        case_type: data.caseType || '',
        court: data.court || '',
        payment_status: data.paymentStatus || 'pending',
        status: data.status || 'active',
        start_date: data.startDate || data.openedDate || null,
        end_date: data.endDate || null,
        result: data.result || '',
        description: data.description || '',
      })
      await loadCases()
      addNotification({
        type: 'case',
        title: created.title,
        message: `Case "${created.title}" has been created.`,
      })
      showSuccess(`Case "${created.title}" created successfully.`)
      return mapCase(created)
    } catch (error) {
      const message =
        error.response?.data?.case_id?.[0] ||
        error.response?.data?.detail ||
        'Could not create case.'
      showError(message)
      return null
    }
  }, [addNotification, loadCases])

  const updateCase = useCallback(async (id, data) => {
    try {
      await updateCaseApi(id, {
        title: data.title?.trim(),
        case_id: data.caseId || data.caseNumber,
        court_case_id: data.courtCaseId,
        case_type: data.caseType,
        court: data.court,
        payment_status: data.paymentStatus,
        status: data.status,
        start_date: data.startDate || data.openedDate,
        end_date: data.endDate,
        result: data.result,
        description: data.description,
      })
      await loadCases()
      showSuccess('Case updated successfully.')
    } catch {
      showError('Could not update case.')
    }
  }, [loadCases])

  const getCaseById = useCallback(
    (id) => cases.find((c) => String(c.id) === String(id)),
    [cases],
  )

  const value = useMemo(
    () => ({ cases, isLoading, addCase, updateCase, getCaseById }),
    [cases, isLoading, addCase, updateCase, getCaseById],
  )

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
}

export function useServices() {
  const ctx = useContext(ServicesContext)
  if (!ctx) throw new Error('useServices must be used within ServicesProvider')
  return ctx
}
