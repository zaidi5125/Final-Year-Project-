import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import { generateTeamMemberId } from '@/features/teams/utils/teamMemberFields'
import { createId } from '@/utils/id'
import { showError, showSuccess } from '@/utils/toast'

const TeamMembersContext = createContext(null)
const initialState = { members: [], memberships: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, action.payload] }
    case 'UPDATE_MEMBER':
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload.data } : m,
        ),
      }
    case 'DELETE_MEMBER':
      return {
        ...state,
        members: state.members.filter((m) => m.id !== action.payload.id),
        memberships: state.memberships.filter((m) => m.memberId !== action.payload.id),
      }
    case 'ADD_MEMBERSHIP':
      return { ...state, memberships: [...state.memberships, action.payload] }
    case 'REMOVE_MEMBERSHIP':
      return {
        ...state,
        memberships: state.memberships.filter((m) => m.id !== action.payload.id),
      }
    default:
      return state
  }
}

export function TeamMembersProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const addTeamMember = useCallback((data) => {
    const cnicTaken = state.members.some((m) => m.cnic === data.cnic)
    if (cnicTaken) {
      showError('CNIC must be unique.')
      return null
    }

    const emailTaken = state.members.some((m) => m.email === data.email)
    if (emailTaken) {
      showError('Email must be unique.')
      return null
    }

    const teamMemberId = data.teamMemberId?.trim() || generateTeamMemberId(state.members.length)
    const idTaken = state.members.some((m) => m.teamMemberId === teamMemberId)
    if (idTaken) {
      showError('Team member ID must be unique.')
      return null
    }

    const member = {
      id: createId(),
      teamMemberId,
      profileImage: data.profileImage ?? '',
      fullName: data.fullName,
      fatherName: data.fatherName,
      cnic: data.cnic,
      contactNumber: data.contactNumber,
      email: data.email,
      address: data.address,
      city: data.city,
      gender: data.gender,
      experience: data.experience,
      status: data.status,
      createdAt: new Date().toISOString(),
    }

    dispatch({ type: 'ADD_MEMBER', payload: member })
    return member
  }, [state.members])

  const updateTeamMember = useCallback((id, data) => {
    const existing = state.members.find((m) => m.id === id)
    if (!existing) return false

    if (data.cnic && state.members.some((m) => m.id !== id && m.cnic === data.cnic)) {
      showError('CNIC must be unique.')
      return false
    }

    if (data.email && state.members.some((m) => m.id !== id && m.email === data.email)) {
      showError('Email must be unique.')
      return false
    }

    if (data.teamMemberId && state.members.some((m) => m.id !== id && m.teamMemberId === data.teamMemberId)) {
      showError('Team member ID must be unique.')
      return false
    }

    dispatch({ type: 'UPDATE_MEMBER', payload: { id, data } })
    showSuccess('Team member updated.')
    return true
  }, [state.members])

  const deleteTeamMember = useCallback((id) => {
    dispatch({ type: 'DELETE_MEMBER', payload: { id } })
    showSuccess('Team member removed.')
  }, [])

  const assignMemberToTeam = useCallback((teamId, memberId, joiningDate) => {
    const duplicate = state.memberships.some(
      (m) => m.teamId === teamId && m.memberId === memberId,
    )
    if (duplicate) {
      showError('This member is already assigned to the team.')
      return null
    }

    const membership = {
      id: createId(),
      teamId,
      memberId,
      joiningDate,
    }

    dispatch({ type: 'ADD_MEMBERSHIP', payload: membership })
    return membership
  }, [state.memberships])

  const removeMembership = useCallback((membershipId) => {
    dispatch({ type: 'REMOVE_MEMBERSHIP', payload: { id: membershipId } })
    showSuccess('Member removed from team.')
  }, [])

  const getMemberById = useCallback(
    (id) => state.members.find((m) => m.id === id),
    [state.members],
  )

  const getMembersByTeam = useCallback(
    (teamId) => {
      const teamMemberships = state.memberships.filter((m) => m.teamId === teamId)
      return teamMemberships.map((membership) => {
        const member = state.members.find((m) => m.id === membership.memberId)
        return member ? { ...member, membershipId: membership.id, joiningDate: membership.joiningDate } : null
      }).filter(Boolean)
    },
    [state.members, state.memberships],
  )

  const value = useMemo(
    () => ({
      members: state.members,
      memberships: state.memberships,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      assignMemberToTeam,
      removeMembership,
      getMemberById,
      getMembersByTeam,
    }),
    [
      state.members,
      state.memberships,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      assignMemberToTeam,
      removeMembership,
      getMemberById,
      getMembersByTeam,
    ],
  )

  return <TeamMembersContext.Provider value={value}>{children}</TeamMembersContext.Provider>
}

export function useTeamMembersStore() {
  const ctx = useContext(TeamMembersContext)
  if (!ctx) throw new Error('useTeamMembersStore must be used within TeamMembersProvider')
  return ctx
}
