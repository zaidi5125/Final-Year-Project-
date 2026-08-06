import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchParticipants, createParticipant, updateParticipant as updateParticipantApi } from '@/services/participantService'
import { showError, showSuccess } from '@/utils/toast'

const ParticipantsContext = createContext(null)

function mapParticipant(p) {
  return {
    id: p.id,
    participantId: p.participant_id,
    profileImage: p.profile_image ?? '',
    fullName: p.full_name,
    fatherName: p.father_name,
    gender: p.gender,
    status: p.status,
    contactNumber: p.contact_number,
    email: p.email,
    cnic: p.cnic,
    city: p.city,
    address: p.address,
    enrolledDate: p.enrolled_date,
    sessionYear: p.session_year,
  }
}

export function ParticipantsProvider({ children }) {
  const [participants, setParticipants] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadParticipants = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchParticipants()
      setParticipants(data.map(mapParticipant))
    } catch {
      showError('Could not load participants.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadParticipants()
  }, [loadParticipants])

  const addParticipant = useCallback(async (data) => {
    try {
      const created = await createParticipant({
        full_name: data.fullName,
        father_name: data.fatherName,
        gender: data.gender,
        status: data.status || 'active',
        contact_number: data.contactNumber,
        email: data.email,
        cnic: data.cnic,
        city: data.city,
        address: data.address,
        enrolled_date: data.enrolledDate || null,
        session_year: data.sessionYear,
        profile_image: data.profileImage || '',
      })
      await loadParticipants()
      showSuccess('Participant added successfully.')
      return mapParticipant(created)
    } catch (error) {
      showError(error.response?.data?.detail || 'Could not add participant.')
      return null
    }
  }, [loadParticipants])

  const updateParticipant = useCallback(async (id, data) => {
    try {
      await updateParticipantApi(id, {
        full_name: data.fullName,
        father_name: data.fatherName,
        gender: data.gender,
        status: data.status,
        contact_number: data.contactNumber,
        email: data.email,
        cnic: data.cnic,
        city: data.city,
        address: data.address,
        enrolled_date: data.enrolledDate || null,
        session_year: data.sessionYear,
        profile_image: data.profileImage || '',
      })
      await loadParticipants()
      showSuccess('Participant updated successfully.')
    } catch {
      showError('Could not update participant.')
    }
  }, [loadParticipants])

  const getParticipantById = useCallback(
    (id) => participants.find((p) => String(p.id) === String(id)),
    [participants],
  )

  const value = useMemo(
    () => ({ participants, isLoading, addParticipant, updateParticipant, getParticipantById }),
    [participants, isLoading, addParticipant, updateParticipant, getParticipantById],
  )

  return <ParticipantsContext.Provider value={value}>{children}</ParticipantsContext.Provider>
}

export function useParticipants() {
  const ctx = useContext(ParticipantsContext)
  if (!ctx) throw new Error('useParticipants must be used within ParticipantsProvider')
  return ctx
}
