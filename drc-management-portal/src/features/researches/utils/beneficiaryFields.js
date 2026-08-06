import { z } from 'zod'

export const BENEFICIARY_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'organization', label: 'Organization' },
]

export const beneficiarySchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  fatherName: z.string().min(1, 'Father name is required'),
  beneficiaryType: z.enum(['individual', 'organization'], { message: 'Beneficiary type is required' }),
  contactNumber: z.string().min(1, 'Contact number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  cnic: z.string().min(1, 'CNIC is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
})

export function getBeneficiaryTypeLabel(type) {
  return BENEFICIARY_TYPES.find((t) => t.value === type)?.label ?? type
}
