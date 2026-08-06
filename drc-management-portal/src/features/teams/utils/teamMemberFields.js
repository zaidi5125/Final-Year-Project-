import { z } from 'zod'

export const TEAM_MEMBER_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export const TEAM_MEMBER_GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export const teamMemberSchema = z.object({
  teamMemberId: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  fatherName: z.string().min(1, 'Father name is required'),
  cnic: z.string().min(1, 'CNIC is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  email: z.string().email('Invalid email'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  gender: z.string().min(1, 'Gender is required'),
  experience: z.string().min(1, 'Experience is required'),
  status: z.string().min(1, 'Status is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
})

export function getMemberStatusLabel(status) {
  return TEAM_MEMBER_STATUSES.find((item) => item.value === status)?.label ?? status
}

export function getMemberStatusVariant(status) {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'muted'
    default:
      return 'muted'
  }
}

export function getMemberGenderLabel(gender) {
  return TEAM_MEMBER_GENDERS.find((item) => item.value === gender)?.label ?? gender
}

export function getMemberDisplayName(member) {
  return member?.fullName ?? member?.name ?? '—'
}

export function generateTeamMemberId(existingCount) {
  const num = String(existingCount + 1).padStart(3, '0')
  return `TM-${num}`
}
