import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'
import { fetchLeads, createLead, updateLead as updateLeadApi, updateLeadStatus as updateLeadStatusApi } from '@/services/leadService'
import { showError, showSuccess } from '@/utils/toast'

const LeadsContext = createContext(null)

function mapLead(l) {
  return {
    id: l.id,
    name: l.full_name,
    email: l.email ?? '',
    phone: l.contact_number ?? '',
    city: l.city ?? '',
    type: l.lead_type === 'dispute' ? 'dispute' : 'course',
    status: l.status,
    notes: l.notes ?? '',
    assignedTo: l.assigned_to,
    assignedToName: l.assigned_to_name,
    createdAt: l.created_at,
  }
}

export function LeadsProvider({ children }) {
  const { addNotification } = useNotifications()
  const [leads, setLeads] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadLeads = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchLeads()
      setLeads(data.map(mapLead))
    } catch {
      showError('Could not load leads.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  const addLead = useCallback(async (data) => {
    if (!data.name?.trim()) {
      showError('Lead name is required.')
      return null
    }
    try {
      const created = await createLead({
        lead_type: data.type === 'dispute' ? 'dispute' : 'student',
        full_name: data.name.trim(),
        contact_number: data.phone ?? '',
        email: data.email ?? '',
        city: data.company ?? '',
        status: data.status ?? 'new',
        notes: data.notes ?? '',
        lead_source: 'other',
      })
      await loadLeads()
      addNotification({
        type: 'lead',
        title: created.full_name,
        message: `New lead "${created.full_name}" added.`,
      })
      showSuccess('Lead added successfully.')
      return mapLead(created)
    } catch (error) {
      showError(error.response?.data?.detail || 'Could not add lead.')
      return null
    }
  }, [addNotification, loadLeads])

  const updateLead = useCallback(async (id, data) => {
    try {
      await updateLeadApi(id, {
        full_name: data.name,
        contact_number: data.phone,
        email: data.email,
        status: data.status,
        notes: data.notes,
      })
      await loadLeads()
      showSuccess('Lead updated successfully.')
    } catch {
      showError('Could not update lead.')
    }
  }, [loadLeads])

  const updateLeadStatus = useCallback(async (id, status) => {
    try {
      await updateLeadStatusApi(id, status)
      await loadLeads()
      showSuccess('Lead status updated.')
    } catch {
      showError('Could not update lead status.')
    }
  }, [loadLeads])

  const getLeadById = useCallback(
    (id) => leads.find((l) => String(l.id) === String(id)),
    [leads],
  )

  const bulkImportLeads = useCallback(async (rows) => {
    let count = 0
    for (const row of rows) {
      try {
        await createLead({
          lead_type: row.type === 'dispute' ? 'dispute' : 'student',
          full_name: row.name ?? '',
          contact_number: row.phone ?? '',
          email: row.email ?? '',
          status: row.status?.toLowerCase().replace(/\s+/g, '_') || 'new',
          notes: row.notes ?? '',
          lead_source: 'other',
        })
        count++
      } catch {
        // skip failed row
      }
    }
    await loadLeads()
    if (count > 0) {
      showSuccess(`${count} lead(s) imported successfully.`)
    }
    return count
  }, [loadLeads])

  const value = useMemo(
    () => ({ leads, isLoading, addLead, updateLead, updateLeadStatus, getLeadById, bulkImportLeads }),
    [leads, isLoading, addLead, updateLead, updateLeadStatus, getLeadById, bulkImportLeads],
  )

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
}

export function useLeads() {
  const ctx = useContext(LeadsContext)
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider')
  return ctx
}
