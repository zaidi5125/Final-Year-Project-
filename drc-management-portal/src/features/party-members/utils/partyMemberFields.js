import { z } from 'zod'

export const PARTY_TYPES = [
  { value: 'complainant', label: 'Complainant' },
  { value: 'respondent', label: 'Respondent' },
]

export const PARTY_MEMBER_RELATIONS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'other', label: 'Other' },
]

export const PARTY_MEMBER_GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export const partyMemberSchema = z.object({
  caseId: z.string().min(1, 'Case is required'),
  partyId: z.string().min(1, 'Party is required'),
  partyType: z.string().min(1, 'Party type is required'),
  fullName: z.string().min(1, 'Full name is required'),
  fatherName: z.string().min(1, 'Father name is required'),
  cnic: z.string().min(1, 'CNIC is required'),
  gender: z.string().min(1, 'Gender is required'),
  relation: z.string().min(1, 'Relation is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
})

export function getGenderLabel(gender) {
  return PARTY_MEMBER_GENDERS.find((g) => g.value === gender)?.label ?? gender
}

export function getPartyTypeLabel(type) {
  return PARTY_TYPES.find((p) => p.value === type)?.label ?? type
}

export function getRelationLabel(relation) {
  return PARTY_MEMBER_RELATIONS.find((r) => r.value === relation)?.label ?? relation
}
