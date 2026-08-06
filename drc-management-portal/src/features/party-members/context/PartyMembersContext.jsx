import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getAuditFields, getCurrentUser } from '@/utils/currentUser'
import { createId } from '@/utils/id'
import { showError, showSuccess } from '@/utils/toast'

const PartyMembersContext = createContext(null)
const initialState = { members: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, members: [...state.members, action.payload] }
    case 'UPDATE':
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload.data } : m,
        ),
      }
    case 'DELETE':
      return {
        ...state,
        members: state.members.filter((m) => m.id !== action.payload.id),
      }
    default:
      return state
  }
}

export function PartyMembersProvider({ children }) {
  const queryClient = useQueryClient()
  const [state, dispatch] = useReducer(reducer, initialState)

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['party-members'] })
  }, [queryClient])

  const addPartyMember = useCallback((data) => {
    if (!data.caseId || !data.partyId) {
      showError('Case and party selection are required.')
      return null
    }

    const duplicate = state.members.find(
      (m) => m.caseId === data.caseId && m.partyId === data.partyId && m.cnic === data.cnic,
    )
    if (duplicate) {
      showError('CNIC must be unique within the same party.')
      return null
    }

    const audit = getAuditFields()
    const member = {
      id: createId(),
      document: data.document ?? null,
      ...data,
      ...audit,
    }
    dispatch({ type: 'ADD', payload: member })
    invalidate()
    showSuccess('Party member added successfully.')
    return member
  }, [state.members, invalidate])

  const updatePartyMember = useCallback((id, data) => {
    const existing = state.members.find((m) => m.id === id)
    if (!existing) return

    if (data.cnic) {
      const duplicate = state.members.find(
        (m) =>
          m.id !== id &&
          m.caseId === (data.caseId ?? existing.caseId) &&
          m.partyId === (data.partyId ?? existing.partyId) &&
          m.cnic === data.cnic,
      )
      if (duplicate) {
        showError('CNIC must be unique within the same party.')
        return
      }
    }

    const user = getCurrentUser()
    dispatch({
      type: 'UPDATE',
      payload: {
        id,
        data: {
          ...data,
          updatedBy: user.id,
          updatedByName: user.fullName,
          updatedAt: new Date().toISOString(),
        },
      },
    })
    invalidate()
    showSuccess('Party member updated successfully.')
  }, [state.members, invalidate])

  const deletePartyMember = useCallback((id) => {
    dispatch({ type: 'DELETE', payload: { id } })
    invalidate()
    showSuccess('Party member deleted successfully.')
  }, [invalidate])

  const getPartyMemberById = useCallback(
    (id) => state.members.find((m) => m.id === id),
    [state.members],
  )

  const getMembersByCase = useCallback(
    (caseId) => state.members.filter((m) => m.caseId === caseId),
    [state.members],
  )

  const value = useMemo(
    () => ({
      members: state.members,
      addPartyMember,
      updatePartyMember,
      deletePartyMember,
      getPartyMemberById,
      getMembersByCase,
    }),
    [state.members, addPartyMember, updatePartyMember, deletePartyMember, getPartyMemberById, getMembersByCase],
  )

  return <PartyMembersContext.Provider value={value}>{children}</PartyMembersContext.Provider>
}

export function usePartyMembers() {
  const ctx = useContext(PartyMembersContext)
  if (!ctx) throw new Error('usePartyMembers must be used within PartyMembersProvider')
  return ctx
}
