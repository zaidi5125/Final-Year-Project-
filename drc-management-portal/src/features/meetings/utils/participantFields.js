import { z } from 'zod'

export const ASSIGNED_ROLES = [
  { value: 'host', label: 'Host' },
  { value: 'attendee', label: 'Attendee' },
]

export const MEETING_PARTICIPANT_TYPES = [
  { value: 'host', label: 'Host' },
  { value: 'attendee', label: 'Attendee' },
]

/** @deprecated Use ASSIGNED_ROLES for internal assigned role dropdown */
export const INTERNAL_ROLES = ASSIGNED_ROLES

/** @deprecated Use MEETING_PARTICIPANT_TYPES for external participant type dropdown */
export const PARTICIPANT_TYPES = MEETING_PARTICIPANT_TYPES

export const internalParticipantSchema = z.object({
  teamMemberId: z.string().min(1, 'Team member is required'),
  assignedRole: z.string().min(1, 'Assigned role is required'),
  participantType: z.string().min(1, 'Participant type is required'),
  remarks: z.string().optional(),
})

export const externalParticipantSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  cnic: z.string().optional(),
  contactNumber: z.string().min(1, 'Contact number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  organization: z.string().optional(),
  city: z.string().optional(),
  participantType: z.string().min(1, 'Participant type is required'),
  remarks: z.string().optional(),
})

export function getInternalRoleLabel(role) {
  return ASSIGNED_ROLES.find((r) => r.value === role)?.label ?? role
}

export function getParticipantTypeLabel(type) {
  return MEETING_PARTICIPANT_TYPES.find((t) => t.value === type)?.label ?? type
}
